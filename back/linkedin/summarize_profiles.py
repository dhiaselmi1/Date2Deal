import json
import os
import glob
from datetime import datetime
import re
import requests  # Utilisation de requests pour les appels API
import sys  # Pour récupérer les arguments de la ligne de commande


class LinkedInProfileSummarizer:
    """
    Agent chargé de trouver le profil LinkedIn (fichier JSON),
    de l'analyser avec l'API Gemini pour en extraire une synthèse professionnelle,
    et de sauvegarder cette synthèse dans un fichier Markdown.
    """
    # Clé API Gemini. Il est recommandé d'utiliser une variable d'environnement pour la sécurité.
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyABnrK3uWS4UNs_19WxlhN6SXA74TT58PA")
    GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY

    def __init__(self):
        """
        Initialise l'agent d'analyse de profils LinkedIn.
        """
        if not self.GEMINI_API_KEY or self.GEMINI_API_KEY == "VOTRE_CLÉ_API_GEMINI_ICI":
            raise ValueError(
                "Clé API Gemini non configurée. Veuillez la définir dans le script ou via la variable d'environnement GEMINI_API_KEY.")
        print("Agent d'analyse de profils LinkedIn initialisé.")

    def _get_linkedin_reports_dir(self):
        """Détermine le répertoire où se trouvent les rapports LinkedIn."""
        # Le script est dans dating/linkedin, le JSON est dans dating
        return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    def load_profile_data(self, specific_file_path: Optional[str] = None) -> Optional[Tuple[Dict, str]]:
        """
        Charge un fichier JSON de profil spécifique ou le plus récent dans le dossier spécifié.

        Args:
            specific_file_path: Chemin absolu ou relatif vers un fichier JSON spécifique.
                                Si None, cherche le fichier le plus récent dans le répertoire par défaut.

        Returns:
            Un tuple contenant les données du profil (dict) et le nom du fichier,
            ou None si aucun fichier n'est trouvé ou en cas d'erreur.
        """
        if specific_file_path:
            filepath = specific_file_path
            print(f"🔍 Chargement du fichier de profil spécifié: '{filepath}'...")
            if not os.path.exists(filepath):
                print(f"❌ Erreur: Le fichier '{filepath}' n'existe pas.")
                return None
        else:
            folder = self._get_linkedin_reports_dir()
            print(f"🔍 Recherche du fichier de profil JSON le plus récent dans le dossier '{folder}'...")

            # Rechercher tous les fichiers JSON dans le dossier
            json_files = glob.glob(os.path.join(folder, "*.json"))

            if not json_files:
                print("❌ Aucun fichier JSON de profil trouvé.")
                return None

            # Tente de trouver le fichier le plus récent basé sur la date dans le nom
            datetime_pattern = r'(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})\.json$'
            latest_file_name = None
            latest_datetime = None

            for file in json_files:
                match = re.search(datetime_pattern, os.path.basename(file))
                if match:
                    try:
                        file_datetime = datetime.strptime(match.group(1), "%Y-%m-%d_%H-%M-%S")
                        if latest_datetime is None or file_datetime > latest_datetime:
                            latest_datetime = file_datetime
                            latest_file_name = file
                    except ValueError:
                        continue  # Ignore les fichiers avec un format de date invalide

            # Si aucun fichier avec un nom daté n'est trouvé, utilise la date de modification
            if not latest_file_name:
                print("💡 Aucun fichier avec horodatage trouvé. Utilisation du fichier modifié le plus récemment.")
                latest_file_name = max(json_files, key=os.path.getmtime)

            filepath = latest_file_name  # filepath est déjà le chemin complet ici

        print(f"📄 Fichier à charger: {os.path.basename(filepath)}")

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print(f"✅ Données du profil chargées avec succès depuis '{os.path.basename(filepath)}'.")
            return data, os.path.basename(filepath)  # Retourne le nom de base du fichier
        except json.JSONDecodeError as e:
            print(f"❌ Erreur de décodage JSON dans le fichier {os.path.basename(filepath)}: {e}")
            return None
        except Exception as e:
            print(f"❌ Erreur inattendue lors de la lecture du fichier {os.path.basename(filepath)}: {e}")
            return None

    def summarize_with_llm(self, profile_data: Dict) -> Optional[str]:
        """
        Génère une synthèse du profil en utilisant un prompt spécifique avec l'API Gemini.

        Args:
            profile_data: Un dictionnaire contenant les données du profil.

        Returns:
            La synthèse textuelle générée par le LLM ou None en cas d'erreur.
        """
        print("🤖 Analyse du profil en cours avec le LLM (Gemini)...")

        # Construction du prompt
        prompt = f"""Tu es un assistant qui extrait et formate les informations professionnelles clés des profils utilisateur.

Voici le profil:
- Nom: {profile_data.get("name")}
- À propos: {profile_data.get("about")}
- Titre du poste: {profile_data.get("job_title")}
- Entreprise: {profile_data.get("company")}

Expérience:
{json.dumps(profile_data.get("experiences", []), indent=2, ensure_ascii=False)}

Éducation:
{json.dumps(profile_data.get("educations", []), indent=2, ensure_ascii=False)}

Posts Récents:
{json.dumps(profile_data.get("recent_posts", []), indent=2, ensure_ascii=False)}

➡️ Extrais les informations suivantes dans un format clair et structuré (points ou liste numérotée):

1. Nom Complet
2. Titre du Poste Actuel et Entreprise
3. Années d'expérience totale (estimation si nécessaire)
4. Compétences clés ou domaines d'expertise
5. Résumé du parcours éducatif
6. Réalisations ou projets notables (tirés des expériences/posts)
7. Tout rôle de leadership ou impact dans l'industrie
8. Sujets d'intérêt basés sur les posts récents

Formate ta réponse avec des titres clairs et des points.
"""

        gemini_api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.GEMINI_API_KEY}"

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 2048,
            }
        }

        try:
            response = requests.post(gemini_api_url, headers={'Content-Type': 'application/json'}, json=payload)
            response.raise_for_status()

            api_response = response.json()

            # Extraction de la réponse textuelle
            summary = api_response['candidates'][0]['content']['parts'][0]['text']

            print("✅ Synthèse du profil générée avec succès.")
            return summary.strip()

        except requests.exceptions.HTTPError as err:
            print(f"❌ Erreur HTTP lors de l'appel à l'API Gemini: {err}")
            print(f"Détails de la réponse: {response.text}")
            return None
        except Exception as e:
            print(f"❌ Erreur inattendue lors de l'analyse LLM: {e}")
            return None

    def save_summary(self, summary: str, original_filename: str) -> str:
        """
        Sauvegarde la synthèse générée dans un fichier Markdown.
        Le fichier est sauvegardé dans le même répertoire que ce script.

        Args:
            summary: Le texte de la synthèse.
            original_filename: Le nom du fichier JSON original pour créer le nom du fichier de sortie.

        Returns:
            Le chemin complet du fichier de synthèse sauvegardé.
        """
        # Crée un nom de fichier .md à partir du nom de fichier .json
        md_filename = os.path.splitext(original_filename)[0] + ".md"
        # Sauvegarde dans le répertoire du script summarize_profiles.py
        filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), md_filename)

        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(f"# Synthèse Professionnelle du Profil : {original_filename.replace('.json', '')}\n\n")
                f.write(f"**Date de génération :** {datetime.now().strftime('%d/%m/%Y à %H:%M:%S')}\n\n")
                f.write("---\n\n")
                f.write(summary)

            print(f"💾 Synthèse sauvegardée dans: {filepath}")
            return filepath
        except Exception as e:
            print(f"❌ Erreur lors de la sauvegarde de la synthèse: {e}")
            return ""

    def run_complete_summary(self, specific_file_path: Optional[str] = None):
        """
        Exécute le processus complet : chargement, analyse et sauvegarde.

        Args:
            specific_file_path: Chemin vers un fichier JSON de profil spécifique à analyser.
                                Si None, le script cherchera le fichier le plus récent.
        """
        print("🚀 Démarrage de la synthèse complète du profil LinkedIn...")
        print("=" * 60)

        # 1. Charger les données du profil
        result = self.load_profile_data(specific_file_path)
        if not result:
            print("❌ Processus arrêté : impossible de charger les données.")
            sys.exit(1)  # Exit with error code

        profile_data, original_filename = result

        # 2. Analyser et synthétiser avec le LLM
        summary = self.summarize_with_llm(profile_data)
        if not summary:
            print("❌ Processus arrêté : échec de l'analyse LLM.")
            sys.exit(1)  # Exit with error code

        # 3. Sauvegarder la synthèse
        saved_file = self.save_summary(summary, original_filename)
        if not saved_file:
            print("❌ Processus arrêté : échec de la sauvegarde.")
            sys.exit(1)  # Exit with error code

        print("=" * 60)
        print("🎉 SYNTHÈSE TERMINÉE AVEC SUCCÈS !")
        print(f"📄 Fichier généré : {saved_file}")
        sys.exit(0)  # Exit successfully


def main():
    """Fonction principale pour exécuter l'agent."""
    print("✨ AGENT DE SYNTHÈSE DE PROFILS LINKEDIN ✨")
    print("=" * 45)
    print("Ce programme analyse un fichier de profil JSON.")
    print("=" * 45)

    try:
        agent = LinkedInProfileSummarizer()

        # Vérifie si un chemin de fichier est fourni en argument
        if len(sys.argv) > 1:
            specific_file = sys.argv[1]
            agent.run_complete_summary(specific_file)
        else:
            print("💡 Aucun chemin de fichier spécifié. Recherche du fichier le plus récent.")
            agent.run_complete_summary()

    except ValueError as e:
        print(f"\n❌ Erreur de configuration: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Une erreur inattendue est survenue: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
