import subprocess
import sys
import os
import json
from multiprocessing import Process

# Path to the JSON file with people data
JSON_FILE_PATH = 'bpi_france_france_leaders_verified.json'


def load_people_data_from_json(json_file_path):
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            people_data = []
            for entry in data:
                name = entry.get('name')
                linkedin_url = entry.get('linkedin_url', '')
                if name:
                    people_data.append({'name': name, 'linkedin_url': linkedin_url})
            print(f"Loaded {len(people_data)} entries from {json_file_path}")
            return people_data
    except FileNotFoundError:
        print(f"ERROR: JSON file '{json_file_path}' not found.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"ERROR: Could not decode JSON from '{json_file_path}': {e}")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred while loading JSON: {e}")
        sys.exit(1)


def run_ytyb_orchestrator(person_name):
    script_path = os.path.join('youtube', 'orchestrator_ytyb.py')
    print(f"🎥 Starting YouTube Orchestrator for {person_name}")
    try:
        subprocess.run([sys.executable, script_path, person_name], check=True)
    except Exception as e:
        print(f"❌ YouTube Orchestrator error: {e}")


def run_linkedin_orchestrator(person_name, linkedin_url):
    script_path = os.path.join('linkedin', 'orchestrator_linkedin.py')
    print(f"🔗 Starting LinkedIn Orchestrator for {person_name}")

    if not linkedin_url:
        print(f"⚠️ LinkedIn URL missing for {person_name}, skipping.")
        return

    try:
        subprocess.run([sys.executable, script_path, linkedin_url], check=True)
    except Exception as e:
        print(f"❌ LinkedIn Orchestrator error: {e}")


def run_google_profile_orchestrator(person_name, context=""):
    script_path = os.path.join('.', 'profile_orchestrator_agent.py')
    print(f"🌍 Starting Google Profile Orchestrator for {person_name}")
    try:
        subprocess.run([sys.executable, script_path, person_name, context], check=True)
    except Exception as e:
        print(f"❌ Google Profile Orchestrator error: {e}")


def run_final_report_agent(person_name):
    script_path = os.path.join('.', 'final_report_agent.py')
    print(f"📄 Starting Final Report Agent for {person_name}")
    try:
        subprocess.run([sys.executable, script_path, person_name], check=True)
    except Exception as e:
        print(f"❌ Final Report Agent error: {e}")


def run_linkedin_photo_scraper(linkedin_url, output_filename):
    script_path = os.path.join('linkedin', 'linkedin_photo_scraper.py')
    print(f"🖼️ Scraping LinkedIn photo: {linkedin_url}")
    try:
        subprocess.run([sys.executable, script_path, linkedin_url, output_filename], check=True)
        print(f"✅ Photo saved as: {output_filename}")
    except Exception as e:
        print(f"❌ Photo scraping error: {e}")


def main_orchestrator():
    print("🚀 Main Orchestrator Launched")
    people_to_process = load_people_data_from_json(JSON_FILE_PATH)

    if not people_to_process:
        print("⚠️ No people found. Exiting.")
        return

    # Mode debug : une seule personne
    first_person = [people_to_process[0]]
    print(f"🧪 DEBUG: Processing only {first_person[0]['name']}")
    people_to_process = first_person

    for person in people_to_process:
        name = person['name']
        linkedin_url = person['linkedin_url']
        context = person.get('company', '')

        print(f"\n🎯 Processing: {name}")

        processes = []

        # YouTube
        p1 = Process(target=run_ytyb_orchestrator, args=(name,))
        p1.start()
        processes.append(p1)

        # LinkedIn
        p2 = Process(target=run_linkedin_orchestrator, args=(name, linkedin_url))
        p2.start()
        processes.append(p2)

        # Google
        p3 = Process(target=run_google_profile_orchestrator, args=(name, context))
        p3.start()
        processes.append(p3)

        # Télécharger la photo LinkedIn (synchrone)
        if linkedin_url:
            os.makedirs("photos", exist_ok=True)
            photo_filename = f"photos/{name.replace(' ', '_')}_linkedin_photo.jpg"
            run_linkedin_photo_scraper(linkedin_url, photo_filename)

        # Attendre que tout se termine
        for p in processes:
            p.join()

        print(f"✅ Data gathering completed for {name}")

        # Rapport final
        final_proc = Process(target=run_final_report_agent, args=(name,))
        final_proc.start()
        final_proc.join()

        print(f"📑 Final report completed for {name}")

    print("\n🎉 All orchestrations complete.")


if __name__ == "__main__":
    main_orchestrator()
