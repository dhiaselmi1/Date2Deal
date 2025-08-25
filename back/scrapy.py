import requests
import csv
import re
import time
import json # Import the json module for JSON output
from urllib.parse import urljoin, urlparse
import tldextract
import difflib
# --- Configuration ---
SERPER_API_KEY = "406fa4083a9e1508c23dca6c349a38633815be1d"
GEMINI_API_KEY = "AIzaSyCe_jW8XjpgDp_iYyJkKAmnWwJJyHKgEnI"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY


# 🔹 Étape 1 : Trouver le site officiel de l'entreprise

def find_company_website(company_name, region=None):
    """Trouve le site officiel de l'entreprise"""

    query = f'"{company_name}" official website'
    if region:
        query += f' "{region}"'

    print(f"🔍 Recherche du site officiel de {company_name}...")

    url = "https://google.serper.dev/search"
    headers = {"X-API-KEY": SERPER_API_KEY}
    params = {"q": query, "num": 10}

    try:
        res = requests.post(url, headers=headers, json=params)
        res.raise_for_status()
        data = res.json()

        # Chercher le site officiel dans les résultats
        for item in data.get("organic", []):
            link = item.get('link', '')
            title = item.get('title', '').lower()
            snippet = item.get('snippet', '').lower()

            # Filtres pour identifier le site officiel
            if any(indicator in link.lower() for indicator in ['.com', '.fr', '.org', '.net']):
                if any(word in title or word in snippet for word in ['official', 'officiel', company_name.lower()]):
                    if not any(
                            exclude in link for exclude in ['linkedin', 'facebook', 'twitter', 'wikipedia', 'indeed']):
                        print(f"✅ Site trouvé: {link}")
                        return link

        # Si pas trouvé, prendre le premier résultat valide
        for item in data.get("organic", []):
            link = item.get('link', '')
            if not any(exclude in link for exclude in ['linkedin', 'facebook', 'twitter', 'wikipedia', 'indeed']):
                print(f"🔄 Site présumé: {link}")
                return link

    except Exception as e:
        print(f"Erreur recherche site: {e}")

    return None


# 🔹 Étape 2 : Rechercher les pages équipe/à propos sur le site

def find_team_pages(base_url):
    """Trouve les pages équipe, à propos, direction sur le site"""

    if not base_url:
        return []

    # Pages typiques contenant les informations d'équipe
    team_paths = [
        '/team', '/equipe', '/about', '/a-propos', '/about-us',
        '/leadership', '/direction', '/management', '/notre-equipe',
        '/who-we-are', '/qui-sommes-nous', '/board', '/conseil',
        '/executives', '/dirigeants', '/staff', '/personnel','/our-leaders'
    ]

    team_urls = []

    # Rechercher ces pages sur Google avec site:
    domain = urlparse(base_url).netloc

    search_queries = [
        f'site:{domain} "équipe" OR "team" OR "direction"',
        f'site:{domain} "about" OR "à propos" OR "leadership"',
        f'site:{domain} "management" OR "dirigeants" OR "executives"'
    ]

    for query in search_queries:
        try:
            url = "https://google.serper.dev/search"
            headers = {"X-API-KEY": SERPER_API_KEY}
            params = {"q": query, "num": 5}

            res = requests.post(url, headers=headers, json=params)
            res.raise_for_status()
            data = res.json()

            for item in data.get("organic", []):
                link = item.get('link', '')
                if domain in link and link not in team_urls:
                    team_urls.append(link)

            time.sleep(1)

        except Exception as e:
            print(f"Erreur recherche pages équipe: {e}")

    # Ajouter les URLs construites manuellement
    for path in team_paths:
        constructed_url = urljoin(base_url, path)
        if constructed_url not in team_urls:
            team_urls.append(constructed_url)

    print(f"🔍 {len(team_urls)} pages d'équipe à analyser")
    return team_urls[:10]  # Limiter à 10 pages


# 🔹 Étape 3 : Extraire le contenu des pages équipe

def extract_page_content(url):
    """Extrait le contenu textuel d'une page web"""

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        # Extraction basique du contenu (on pourrait utiliser BeautifulSoup pour plus de précision)
        content = response.text

        # Nettoyer le HTML basique
        content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)
        content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL)
        content = re.sub(r'<[^>]+>', ' ', content)
        content = re.sub(r'\s+', ' ', content)

        return content[:5000]  # Limiter la taille

    except Exception as e:
        print(f"Erreur extraction {url}: {e}")
        return ""


# 🔹 Étape 4 : Analyser le contenu avec Gemini pour extraire les dirigeants

def extract_leaders_from_content(content, company_name, website_url):
    """Extrait les dirigeants du contenu de la page avec validation"""

    prompt = f"""
Tu es un expert en analyse de sites web d'entreprises.

MISSION CRITIQUE : Extraire TOUS les dirigeants, directeurs et responsables mentionnés sur cette page du site officiel de "{company_name}" ({website_url}).

CONTENU DE LA PAGE :
{content}

INSTRUCTIONS STRICTES :
1. Cherche UNIQUEMENT les personnes avec des postes de direction/responsabilité
2. Inclus : CEO, Directeur Général, Directeurs (tous départements), Managers, Head of, VP, Responsables
3. Pour chaque personne, extrais :
   - Nom complet (prénom + nom)
   - Poste exact mentionné
   - Si disponible : email, téléphone, département

CRITÈRES DE VALIDATION :
- Le nom doit être complet (pas d'initiales seules)
- Le poste doit indiquer une responsabilité
- La personne doit être clairement employée chez "{company_name}"
- Ignorer les témoignages clients ou partenaires externes

FORMAT DE SORTIE OBLIGATOIRE :
Nom Complet | Poste Exact | Email (si disponible) | Département

Si aucun dirigeant n'est trouvé, écris : "AUCUN DIRIGEANT IDENTIFIÉ"

DIRIGEANTS IDENTIFIÉS :
"""

    return call_gemini_api(prompt)


# 🔹 Étape 5 : Recherche LinkedIn complémentaire avec vérification

def search_linkedin_profiles(person_name, company_name, region=None):
    """Recherche et vérifie les profils LinkedIn"""

    query = f'"{person_name}" "{company_name}" site:linkedin.com'
    if region:
        query += f' "{region}"'

    try:
        url = "https://google.serper.dev/search"
        headers = {"X-API-KEY": SERPER_API_KEY}
        params = {"q": query, "num": 3}

        res = requests.post(url, headers=headers, json=params)
        res.raise_for_status()
        data = res.json()

        for item in data.get("organic", []):
            if 'linkedin.com/in/' in item.get('link', ''):
                return {
                    'linkedin_url': item['link'],
                    'linkedin_title': item.get('title', ''),
                    'linkedin_snippet': item.get('snippet', '')
                }
    except Exception as e:
        print(f"Erreur LinkedIn pour {person_name}: {e}")

    return {}


# 🔹 Étape 6 : Validation croisée des données

def validate_person_data(person_data, company_name):
    """Valide les données d'une personne avec des critères stricts"""

    name = person_data.get('name', '').strip()
    role = person_data.get('role', '').strip()

    # Validation du nom
    name_parts = name.split()
    if len(name_parts) < 2:
        return False

    if any(len(part) < 2 for part in name_parts):
        return False

    # Le nom ne doit pas contenir d'éléments suspects
    if any(word in name.lower() for word in ['lorem', 'ipsum', 'example', 'test', 'admin']):
        return False

    # Validation du poste
    leadership_keywords = [
        'directeur', 'director', 'ceo', 'cto', 'cfo', 'coo', 'manager',
        'responsable', 'head', 'chef', 'président', 'president', 'vp',
        'vice', 'général', 'general', 'managing', 'senior', 'lead','dg'
    ]

    if not any(keyword in role.lower() for keyword in leadership_keywords):
        return False

    # Le poste ne doit pas être trop générique
    if role.lower() in ['manager', 'director', 'responsable']:
        return False

    return True


# 🔹 Étape 7 : Pipeline principal complet

def comprehensive_leader_search(company_name, region, min_people=10):
    """Recherche complète avec validation et vérification"""

    print(f"\n🎯 RECHERCHE COMPLÈTE : {company_name} ({region})")
    print("🔹 Objectif : Minimum {min_people} dirigeants validés")
    print("=" * 70)

    all_leaders = []
    processed_names = set()

    # PHASE 1 : Trouver le site officiel
    print("\n📍 PHASE 1 : Identification du site officiel")
    company_website = find_company_website(company_name, region)

    if not company_website:
        print("❌ Impossible de trouver le site officiel")
        return []

    # PHASE 2 : Trouver les pages équipe
    print("\n📍 PHASE 2 : Recherche des pages équipe/direction")
    team_pages = find_team_pages(company_website)

    if not team_pages:
        print("⚠️ Aucune page équipe trouvée, recherche alternative...")
        # Recherche alternative sur LinkedIn si pas de pages équipe
        return fallback_linkedin_search(company_name, region, min_people)

    # PHASE 3 : Extraction du contenu des pages
    print(f"\n📍 PHASE 3 : Analyse de {len(team_pages)} pages")

    for i, page_url in enumerate(team_pages):
        print(f"🔍 Analyse page {i + 1}/{len(team_pages)}: {page_url[:50]}...")

        page_content = extract_page_content(page_url)
        if not page_content:
            continue

        # Extraire les dirigeants de cette page
        leaders_text = extract_leaders_from_content(page_content, company_name, page_url)

        if "AUCUN DIRIGEANT IDENTIFIÉ" in leaders_text:
            continue

        # Traiter chaque dirigeant trouvé
        for line in leaders_text.splitlines():
            if "|" not in line or line.startswith("Nom") or len(line.strip()) < 10:
                continue

            parts = [p.strip() for p in line.split("|")]
            if len(parts) < 2:
                continue

            name = parts[0]
            role = parts[1]
            email = parts[2] if len(parts) > 2 else ""
            department = parts[3] if len(parts) > 3 else ""

            # Éviter les doublons
            if name.lower() in processed_names:
                continue

            # Validation
            person_data = {'name': name, 'role': role}
            if not validate_person_data(person_data, company_name):
                continue

            # Recherche LinkedIn complémentaire
            linkedin_data = search_linkedin_profiles(name, company_name, region)

            leader = {
                'name': name,
                'role': role,
                'email': email,
                'department': department,
                'company': company_name,
                'region': region,
                'source': 'Site officiel',
                'source_url': page_url,
                'linkedin_url': linkedin_data.get('linkedin_url', ''),
                'linkedin_verified': bool(linkedin_data.get('linkedin_url')),
                'category': categorize_role(role)
            }

            all_leaders.append(leader)
            processed_names.add(name.lower())

            print(f"✅ Dirigeant validé: {name} - {role}")

            # Pause pour éviter le spam
            time.sleep(0.5)

        # Arrêter si on a assez de personnes
        if len(all_leaders) >= min_people:
            break

    # PHASE 4 : Recherche complémentaire si pas assez de résultats
    if len(all_leaders) < min_people:
        print(f"\n📍 PHASE 4 : Recherche complémentaire (actuel: {len(all_leaders)}/{min_people})")
        additional_leaders = fallback_linkedin_search(company_name, region, min_people - len(all_leaders))

        for leader in additional_leaders:
            if leader['name'].lower() not in processed_names:
                all_leaders.append(leader)
                processed_names.add(leader['name'].lower())

    return all_leaders


def fallback_linkedin_search(company_name, region, needed_count):
    """Recherche de secours sur LinkedIn avec validation renforcée"""

    print(f"🔄 Recherche de secours LinkedIn pour {needed_count} personnes supplémentaires")

    search_queries = [
    f'"{company_name}" CEO "Chief Executive Officer" site:linkedin.com',
    f'"{company_name}" Directeur Général site:linkedin.com',
    f'"{company_name}" DG site:linkedin.com ',
    f'"{company_name}" COO "Chief Operating Officer" site:linkedin.com',
    f'"{company_name}" CFO "Chief Financial Officer" site:linkedin.com',
    f'"{company_name}" CTO "Chief Technology Officer" site:linkedin.com',
    f'"{company_name}" CMO "Chief Marketing Officer" site:linkedin.com',
    f'"{company_name}" CHRO site:linkedin.com',
    f'"{company_name}" VP site:linkedin.com',
    f'"{company_name}" "Vice President" site:linkedin.com',
    f'"{company_name}" Directeur site:linkedin.com',
    f'"{company_name}" Head of site:linkedin.com',
    f'"{company_name}" Responsable site:linkedin.com',
    f'"{company_name}" Manager site:linkedin.com',
    f'"{company_name}" Lead site:linkedin.com'
    ]


    if region:
        search_queries = [f'{query} "{region}"' for query in search_queries]

    leaders = []
    processed_names = set()

    for query in search_queries:
        if len(leaders) >= needed_count:
            break

        try:
            url = "https://google.serper.dev/search"
            headers = {"X-API-KEY": SERPER_API_KEY}
            params = {"q": query, "num": 10}

            res = requests.post(url, headers=headers, json=params)
            res.raise_for_status()
            data = res.json()

            results_text = ""
            for item in data.get("organic", []):
                results_text += f"Titre: {item.get('title', '')}\nSnippet: {item.get('snippet', '')}\nURL: {item.get('link', '')}\n---\n"

            # Extraire avec Gemini
            extracted = extract_leaders_from_linkedin_results(results_text, company_name,region)

            for line in extracted.splitlines():
                if "|" not in line or len(leaders) >= needed_count:
                    continue

                parts = [p.strip() for p in line.split("|")]
                if len(parts) < 2:
                    continue

                name = parts[0]
                role = parts[1]
                linkedin_url = parts[2] if len(parts) > 2 else ""

                if name.lower() in processed_names:
                    continue

                if validate_person_data({'name': name, 'role': role}, company_name):
                    leaders.append({
                        'name': name,
                        'role': role,
                        'email': '',
                        'department': '',
                        'company': company_name,
                        'region': region,
                        'source': 'LinkedIn',
                        'source_url': linkedin_url,
                        'linkedin_url': linkedin_url,
                        'linkedin_verified': True,
                        'category': categorize_role(role)
                    })
                    processed_names.add(name.lower())
                    print(f"✅ LinkedIn validé: {name} - {role}")

            time.sleep(2)

        except Exception as e:
            print(f"Erreur recherche LinkedIn: {e}")

    return leaders


def extract_leaders_from_linkedin_results(results_text, company_name,region):
    """Extrait les dirigeants des résultats LinkedIn avec validation"""

    prompt = f"""
Tu es un expert en recrutement et en analyse de profils LinkedIn.

IMPORTANT : Cette recherche cible la région « {region} »   
— Si dans le BLOC DE RÉSULTATS la ligne d’un profil contient un indicateur de localisation  
  très éloignée et ne contient pas « {region.lower()} » ,  
  réponds EXACTEMENT :  
    PAGE HORS ZONE GÉOGRAPHIQUE – IGNORÉE  
  et **ne liste aucun** profil pour cette ligne.

CRITÈRES STRICTS :
- Nom complet obligatoire (prénom + nom).  
- Poste de direction ou de responsabilité uniquement  
  (abréviations acceptées : CEO, DG, CTO, CFO, COO, CMO, CHRO, VP…).  
- Personne actuellement en poste chez « {company_name} ».  
- Exclure les anciens employés, consultants externes, témoignages.

FORMAT DE SORTIE :
Pour chaque dirigeant valide, une ligne :  
Nom Complet | Poste Exact | URL LinkedIn

BLOC DE RÉSULTATS À ANALYSER :
{results_text}

Résultats :
"""
    return call_gemini_api(prompt)

    return call_gemini_api(prompt)


def categorize_role(role):
    role_lower = role.lower()
    categories = [
        ("CEO/Direction Générale", ["ceo", "directeur général", "dg", "president", "managing director"]),
        ("Direction Exécutive (C-Level)", ["cio", "cto", "cfo", "coo", "chief"]),
        ("Vice-Présidents", ["vp", "vice president"]),
        ("Directeurs", ["directeur", "director"]),
        ("Chefs de Département/Managers", ["manager", "head of", "chef de", "responsable"]),
    ]
    # Ensure "head of" roles with innovation context stay in Managers unless explicitly C-level
    if "head of" in role_lower and any(term in role_lower for term in ["innovation", "factory", "research"]):
        return "Chefs de Département/Managers"
    for category, keywords in categories:
        if any(keyword in role_lower for keyword in keywords):
            return category
    return "Autres Décideurs"


def call_gemini_api(prompt):
    """Appel à Gemini avec configuration optimisée"""

    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 3000
        }
    }

    try:
        res = requests.post(GEMINI_API_URL, headers=headers, json=data)
        res.raise_for_status()
        result = res.json()
        return result["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(f"Erreur Gemini: {e}")
        return ""


# 🔹 Affichage et export des résultats

def display_comprehensive_results(leaders, company_name, region):
    """Affichage complet avec statistiques"""

    print(f"\n📊 RÉSULTATS FINAUX : {company_name} ({region})")
    print("=" * 70)

    if not leaders:
        print("❌ ÉCHEC : Aucun dirigeant validé trouvé")
        return False

    print(f"🎯 OBJECTIF ATTEINT : {len(leaders)} dirigeants identifiés et validés")

    # Statistiques par source
    sources = {}
    for leader in leaders:
        source = leader['source']
        sources[source] = sources.get(source, 0) + 1

    print(f"\n📈 Sources utilisées :")
    for source, count in sources.items():
        print(f"   • {source}: {count} personnes")

    # Affichage par catégorie
    categories = {}
    for leader in leaders:
        cat = leader['category']
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(leader)

    category_order = [
        'CEO/Direction Générale',
        'Direction Exécutive (C-Level)',
        'Vice-Présidents',
        'Directeurs',
        'Chefs de Département/Managers',
        'Autres Décideurs'
    ]

    for category in category_order:
        if category in categories:
            people = categories[category]
            print(f"\n🏆 {category} ({len(people)}) :")
            print("-" * 50)

            for person in people:
                print(f"👤 {person['name']}")
                print(f"   💼 {person['role']}")
                if person['department']:
                    print(f"   🏢 Département: {person['department']}")
                if person['email']:
                    print(f"   ✉️  {person['email']}")
                if person['linkedin_url']:
                    print(f"   🔗 LinkedIn: {person['linkedin_url']}")
                print(f"   📍 Source: {person['source']}")
                print()

    return True


def export_comprehensive_csv(leaders, company_name, region):
    """Export CSV complet avec toutes les données"""

    if not leaders:
        return

    filename = f"{company_name.replace(' ', '_')}_{region.replace(' ', '_')}_leaders_verified.csv"

    # Tri par importance
    leaders.sort(key=lambda x: {
        'CEO/Direction Générale': 1,
        'Direction Exécutive (C-Level)': 2,
        'Vice-Présidents': 3,
        'Directeurs': 4,
        'Chefs de Département/Managers': 5,
        'Autres Décideurs': 6
    }.get(x['category'], 7))

    fieldnames = [
        'name', 'role', 'category', 'company', 'region', 'department',
        'email', 'linkedin_url', 'linkedin_verified', 'source', 'source_url'
    ]

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(leaders)

    print(f"✅ Export CSV complet: {filename}")


def export_comprehensive_json(leaders, company_name, region):
    """Export JSON complet avec toutes les données"""

    if not leaders:
        return

    # Nettoyer le nom de l'entreprise et la région pour le nom de fichier
    clean_company_name = re.sub(r'[^\w\s-]', '', company_name).replace(' ', '_')
    clean_region = re.sub(r'[^\w\s-]', '', region).replace(' ', '_')
    filename = f"{clean_company_name}_{clean_region}_leaders.json"

    # Tri par importance (optionnel, mais bon pour la cohérence)
    # Define the rank mapping
    rank_mapping = {
    'CEO/Direction Générale': 1,
    'Direction Exécutive (C-Level)': 2,
    'Vice-Présidents': 3,
    'Directeurs': 4,
    'Chefs de Département/Managers': 5,
    'Autres Décideurs': 6
      }

# Add a 'rank' field to each leader
    for leader in leaders:
       leader['rank'] = rank_mapping.get(leader['category'], 7)

# Optionally, sort the list afterward if needed
    leaders.sort(key=lambda x: x['rank'])
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(leaders, f, ensure_ascii=False, indent=4)
        print(f"✅ Export JSON complet: {filename}")
    except Exception as e:
        print(f"❌ Erreur lors de l'export JSON: {e}")


# 🔹 Programme principal

if __name__ == "__main__":
    print("🎯 PROFILING AGENT WEBSITE-FOCUSED")
    print("🔹 Recherche sur site officiel + Validation LinkedIn")
    print("🔹 Garantit minimum 10 dirigeants validés")
    print("=" * 70)

    # Saisie
    company = input("🏢 Nom de l'entreprise : ").strip()
    region = input("🌍 Région/Ville : ").strip()

    if not company:
        print("❌ Le nom de l'entreprise est obligatoire")
        exit()

    # Paramètres
    min_people = 8

    try:
        # Recherche principale
        print(f"\n🚀 Lancement de la recherche complète...")
        leaders = comprehensive_leader_search(company, region, min_people)

        # Affichage des résultats (peut être commenté si seul l'export JSON est souhaité)
        # success = display_comprehensive_results(leaders, company, region)

        if leaders:
            # Export CSV (peut être commenté si seul l'export JSON est souhaité)
            # export_comprehensive_csv(leaders, company, region)

            # Export JSON
            export_comprehensive_json(leaders, company, region)

            if len(leaders) >= min_people:
                print(f"\n🎉 MISSION ACCOMPLIE : {len(leaders)} dirigeants validés !")
            else:
                print(f"\n⚠️  MISSION PARTIELLE : {len(leaders)}/{min_people} dirigeants trouvés")
        else:
            print("\n💡 CONSEILS :")
            print("- Vérifiez l'orthographe exacte de l'entreprise")
            print("- L'entreprise a-t-elle un site web officiel ?")
            print("- Essayez une région plus large (pays vs ville)")

    except KeyboardInterrupt:
        print("\n\n⏹️  Recherche interrompue par l'utilisateur")
    except Exception as e:
        print(f"\n❌ Erreur critique: {e}")