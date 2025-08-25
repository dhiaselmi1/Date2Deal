import subprocess
import sys
import os  # Import the os module


def run_youtube_search(person_name):
    print(f"🔍 Étape 1 : Lancement de youtube_search.py pour {person_name}...")
    script_dir = os.path.dirname(__file__)  # Get the directory of the current script
    youtube_search_path = os.path.join(script_dir, "youtube_search.py")

    # Pass the person_name as a command-line argument to youtube_search.py
    result = subprocess.run([sys.executable, youtube_search_path, person_name],
                            check=False)  # Use check=False to prevent immediate exit on error
    if result.returncode != 0:
        print(f"❌ youtube_search.py a échoué pour {person_name}.")
        return False
    print(f"✅ youtube_search.py terminé avec succès pour {person_name}.")
    return True


def run_agent_youtube():
    # agent_youtube.py doesn't seem to take a person_name directly,
    # it processes the latest JSON from youtube_search.py.
    print("\n🤖 Étape 2 : Lancement de agent_youtube.py...")
    script_dir = os.path.dirname(__file__)  # Get the directory of the current script
    agent_youtube_path = os.path.join(script_dir, "agent_youtube.py")

    result = subprocess.run([sys.executable, agent_youtube_path], check=False)  # Use check=False
    if result.returncode != 0:
        print("❌ agent_youtube.py a échoué.")
        return False
    print("✅ agent_youtube.py terminé avec succès.")
    return True


def main(person_name):
    """
    Main function for the YouTube orchestrator.
    Args:
        person_name (str): The name of the person to search for.
    """
    if run_youtube_search(person_name):
        run_agent_youtube()
    else:
        print(f"🚫 Arrêt du processus YouTube pour {person_name} : l'étape de recherche a échoué.")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        person_name_arg = sys.argv[1]
        main(person_name_arg)
    else:
        print("Usage: python orchestrator_ytyb.py <person_name>")
        print("❌ Erreur: Aucun nom de personne fourni. L'orchestrateur YouTube nécessite un nom.")