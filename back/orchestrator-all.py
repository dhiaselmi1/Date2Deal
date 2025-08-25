import subprocess
import sys
import os
import json
from multiprocessing import Process

def get_or_create_leader_json(company_name, region):
    base_name = f"{company_name.strip().replace(' ', '_')}_{region.strip().replace(' ', '_')}"
    json_filename = f"{base_name}_leaders.json"

    if os.path.exists(json_filename):
        print(f"\U0001F4C1 Fichier JSON trouvé : {json_filename}")
        return json_filename

    print(f"\U0001F680 Fichier non trouvé. Lancement du profiling complet : {company_name} ({region})")
    try:
        subprocess.run([sys.executable, "scrapjudge.py"], input=f"{company_name}\n{region}\n".encode(), check=True)
        if os.path.exists(json_filename):
            print(f"✅ JSON généré : {json_filename}")
            return json_filename
        else:
            print(f"❌ Fichier non généré après exécution.")
            return None
    except Exception as e:
        print(f"❌ Erreur profiling : {e}")
        return None

def run_ytyb_orchestrator(person_name):
    script_path = os.path.join('youtube', 'orchestrator_ytyb.py')
    print(f"🎥 YouTube pour {person_name}")
    try:
        subprocess.run([sys.executable, script_path, person_name], check=True)
    except Exception as e:
        print(f"❌ Erreur YouTube : {e}")

def run_linkedin_orchestrator(person_name, linkedin_url):
    script_path = os.path.join('linkedin', 'orchestrator_linkedin.py')
    print(f"🔗 LinkedIn pour {person_name}")

    if not linkedin_url:
        print(f"⚠️ URL LinkedIn manquante pour {person_name}")
        return

    try:
        subprocess.run([sys.executable, script_path, linkedin_url], check=True)
    except Exception as e:
        print(f"❌ Erreur LinkedIn : {e}")

def run_google_profile_orchestrator(person_name, context=""):
    script_path = os.path.join('.', 'profile_orchestrator_agent.py')
    print(f"🌍 Google Profile pour {person_name}")
    try:
        subprocess.run([sys.executable, script_path, person_name, context], check=True)
    except Exception as e:
        print(f"❌ Erreur Google Profile: {e}")

def run_final_report_agent(person_name):
    script_path = os.path.join('.', 'final_report_agent.py')
    print(f"📄 Rapport final pour {person_name}")
    try:
        subprocess.run([sys.executable, script_path, person_name], check=True)
    except Exception as e:
        print(f"❌ Erreur rapport final: {e}")

def main_orchestrator():
    if len(sys.argv) < 3:
        print("ℹ️ Aucun argument détecté. Veuillez entrer les données manuellement.")
        company_name = input("🏢 Nom de l'entreprise : ").strip()
        region = input("📍 Région : ").strip()
    else:
        company_name = sys.argv[1]
        region = sys.argv[2]

    if not company_name or not region:
        print("❌ Nom d'entreprise ou région manquant.")
        return

    json_file = get_or_create_leader_json(company_name, region)
    if not json_file:
        print("❌ Profiling échoué.")
        return

    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            people_to_process = json.load(f)
    except Exception as e:
        print(f"❌ Erreur lecture JSON: {e}")
        return

    for person in people_to_process:
        name = person['name']
        linkedin_url = person.get('linkedin_url', '')
        context = person.get('company', '')

        final_report_pattern = f"rapport_final_{name.strip().replace(' ', '_')}_"
        report_exists = any(
            file.startswith(final_report_pattern) and file.endswith(".md")
            for file in os.listdir('.')
        )

        if report_exists:
            print(f"📝 Rapport final déjà existant pour {name}, passage au suivant.")
            continue

        print(f"\n🔄 Traitement de : {name}")

        processes = []

        p_ytyb = Process(target=run_ytyb_orchestrator, args=(name,))
        p_linkedin = Process(target=run_linkedin_orchestrator, args=(name, linkedin_url,))
        p_google = Process(target=run_google_profile_orchestrator, args=(name, context,))

        processes.extend([p_ytyb, p_linkedin, p_google])

        for p in processes:
            p.start()
        for p in processes:
            p.join()

        print(f"✅ Collecte terminée pour {name}")

        try:
            p_report = Process(target=run_final_report_agent, args=(name,))
            p_report.start()
            p_report.join()
            print(f"📁 Rapport généré pour {name}")
        except Exception as e:
            print(f"❌ Erreur génération rapport final: {e}")

    print("🎉 Tous les profils ont été traités.")

if __name__ == "__main__":
    main_orchestrator()
