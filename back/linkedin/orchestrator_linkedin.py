import sys
import time
import os
import subprocess  # Ajout de cette ligne pour importer le module subprocess


def orchestrate_linkedin_analysis(linkedin_url):
    """
    Orchestre l'exécution du scraper LinkedIn puis de l'analyseur de profil.
    Args:
        linkedin_url (str): The LinkedIn profile URL to scrape.
    """
    print("\n🚀 Lancement de l'Orchestrateur d'Analyse de Profil LinkedIn 🚀")
    print("===================================================================")

    if not linkedin_url:
        print(f"LinkedIn URL vide. Le scraping LinkedIn est ignoré.")  # Removed emoji
        return

    # --- ÉTAPE 1: Exécution du Scraper de Profil ---
    print("\n--- ÉTAPE 1: Démarrage du Scraper de Profil (main.py) ---")
    script_dir = os.path.dirname(__file__)  # Get the directory of the current script
    main_script_path = os.path.join(script_dir, "main.py")

    scraped_file_path = None  # To store the path of the scraped JSON file

    try:
        # Appelle la fonction main() du script main.py, en lui passant l'URL LinkedIn
        # Explicitly set encoding='utf-8' for capturing output to prevent UnicodeDecodeError
        result = subprocess.run(
            [sys.executable, main_script_path, linkedin_url],
            check=False,
            capture_output=True,
            text=True,  # This implies encoding='utf-8' but explicit is better
            encoding='utf-8',  # Explicitly set encoding for decoding stdout/stderr
            errors='replace'  # Replace unencodable characters with a placeholder
        )

        # Print stdout and stderr for debugging, ensuring they are not None
        if result.stdout:
            print("--- main.py stdout ---")
            print(result.stdout)
            print("----------------------")
        if result.stderr:
            print("--- main.py stderr ---")
            print(result.stderr)
            print("----------------------")

        if result.returncode != 0:
            print(f"Une erreur est survenue durant le scraping de {linkedin_url}.")  # Removed emoji
            print(f"L'orchestration est arrêtée car la récupération du profil a échoué.")  # Removed emoji
            return  # Met fin à l'orchestration

        # Attempt to find the saved file path from the output of main.py
        # Check if result.stdout is not None before splitting lines
        if result.stdout:
            for line in result.stdout.splitlines():
                if "Data saved to" in line:  # Changed from "File saved as:" to "Data saved to" based on main.py output
                    # Extract only the filename, assuming it's in the current directory of main.py
                    # The filename is usually at the end of the "Data saved to" line
                    filename_part = line.split("Data saved to")[1].strip()
                    # Ensure we get just the filename, not the full path if main.py prints full path
                    scraped_file_path = os.path.join(script_dir, os.path.basename(filename_part))
                    break

        if scraped_file_path and os.path.exists(scraped_file_path):
            print(f"Scraper terminé avec succès. Fichier sauvegardé: {scraped_file_path}")  # Removed emoji
        else:
            print(
                f"Scraper terminé, mais le chemin du fichier sauvegardé n'a pas été trouvé ou le fichier n'existe pas.")  # Removed emoji
            print("La synthèse ne peut pas continuer sans le fichier de profil.")  # Removed emoji
            return

    except FileNotFoundError:
        print(
            f"ERREUR: Le fichier '{main_script_path}' est introuvable. Assurez-vous qu'il est dans le même dossier.")  # Removed emoji
        return  # Met fin à l'orchestration
    except Exception as e:
        print(f"Une erreur critique est survenue durant le scraping: {e}")  # Removed emoji
        print("L'orchestration est arrêtée car la récupération du profil a échoué.")  # Removed emoji
        return  # Met fin à l'orchestration

    print("\n-------------------------------------------------------------------")
    time.sleep(2)  # Petite pause pour la lisibilité

    # --- ÉTAPE 2: Exécution du Synthétiseur de Profil ---
    print("\n--- ÉTAPE 2: Démarrage du Synthétiseur de Profil (summarize_profiles.py) ---")

    summarize_script_path = os.path.join(script_dir, "summarize_profiles.py")

    if scraped_file_path and os.path.exists(scraped_file_path):
        print(f"Le synthétiseur va maintenant analyser le fichier : {scraped_file_path}")  # Removed emoji
        try:
            # Pass the scraped file path as an argument
            subprocess.run([sys.executable, summarize_script_path, scraped_file_path], check=True, encoding='utf-8',
                           errors='replace')
            print(f"Synthèse terminée avec succès.")  # Removed emoji
        except FileNotFoundError:
            print(f"ERREUR: Le fichier '{summarize_script_path}' est introuvable.")  # Removed emoji
        except subprocess.CalledProcessError as e:
            print(f"Une erreur est survenue durant la synthèse: {e}")  # Removed emoji
        except Exception as e:
            print(f"Une erreur critique est survenue durant la synthèse: {e}")  # Removed emoji
            return  # Met fin à l'orchestration
    else:
        print("Aucun fichier de profil scrapé valide trouvé pour la synthèse. Étape ignorée.")  # Removed emoji

    print("\n===================================================================")
    print("Orchestration terminée avec succès ! 🎉")  # Removed emoji
    print("Vous pouvez trouver le profil scrapé (.json) et la synthèse (.md) dans votre dossier.")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        linkedin_url_arg = sys.argv[1]
        orchestrate_linkedin_analysis(linkedin_url_arg)
    else:
        print("Usage: python orchestrator_linkedin.py <linkedin_profile_url>")
        print("Error: No LinkedIn URL provided. L'orchestrateur LinkedIn nécessite une URL.")  # Removed emoji

