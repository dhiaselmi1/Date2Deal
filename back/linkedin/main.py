import undetected_chromedriver as uc
from linkedin_scraper import Person
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
import os
import json
from datetime import datetime
import sys
from urllib.parse import urlparse

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

driver = None  # Global driver


def is_logged_in(driver_instance):
    driver_instance.get("https://www.linkedin.com/feed/")
    time.sleep(3)
    return "feed" in driver_instance.current_url.lower()


def perform_manual_login(driver_instance):
    driver_instance.get("https://www.linkedin.com/login")
    print("\n" + "=" * 70)
    print("           *** AUTHENTIFICATION LINKEDIN REQUISE ***")
    print("===================================================================")
    print("Veuillez vous connecter MANUELLEMENT à LinkedIn dans le navigateur.")
    print("Puis appuyez sur ENTRÉE dans ce terminal une fois connecté.")
    print("===================================================================\n")

    max_wait_time = 300
    start_time = time.time()

    while time.time() - start_time < max_wait_time:
        user_input = input("Appuyez sur ENTRÉE ici APRÈS vous être connecté...")
        if user_input == "":
            if is_logged_in(driver_instance):
                print("Connexion confirmée. Continuons.")
                return True
            else:
                print("Connexion non détectée. Réessayez.")
    print("Temps écoulé ou échec de connexion.")
    return False


def ensure_logged_in(driver_instance):
    """Forces manual login only (no cookies)."""
    return perform_manual_login(driver_instance)


def clean_filename(text):
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        text = text.replace(char, '_')
    text = text.replace(' ', '_')
    text = '_'.join(filter(None, text.split('_')))
    if len(text) > 50:
        text = text[:50]
    return text.strip('_')


def generate_filename(person_name):
    clean_name = clean_filename(person_name)
    current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    return f"{clean_name}_{current_datetime}.json"


def validate_linkedin_url(url):
    if not url:
        return None
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    if 'linkedin.com/in/' not in url and 'linkedin.com/company/' not in url:
        return None
    if "?" in url:
        url = url.split("?")[0]
    if not url.endswith('/'):
        url += '/'
    return url


def scroll_and_get_recent_posts(driver_instance, profile_url, max_posts=3):
    print("Navigating to profile activity tab...")
    driver_instance.get(profile_url + "recent-activity/all/")
    time.sleep(5)

    print("Scrolling and loading posts...")
    actions = ActionChains(driver_instance)
    for _ in range(3):
        actions.send_keys(Keys.PAGE_DOWN).perform()
        time.sleep(2)

    print("Extracting post content...")
    post_elements = driver_instance.find_elements(By.CSS_SELECTOR, "div.feed-shared-update-v2")

    posts = []
    for post in post_elements[:max_posts]:
        try:
            content_element = post.find_element(By.CSS_SELECTOR, "span.break-words")
            post_text = content_element.text.strip()
            if post_text:
                posts.append(post_text)
        except Exception:
            continue
    return posts


def save_person_data(person, posts=None, filename=None):
    try:
        if not filename:
            filename = generate_filename(person.name if person.name else "Unknown_Profile")

        data = {
            "name": person.name,
            "about": person.about,
            "company": person.company,
            "job_title": person.job_title,
            "experiences": [vars(exp) for exp in person.experiences] if hasattr(person, 'experiences') else [],
            "educations": [vars(edu) for edu in person.educations] if hasattr(person, 'educations') else [],
            "interests": [vars(i) for i in person.interests] if hasattr(person, 'interests') else [],
            "accomplishments": [vars(a) for a in person.accomplishments] if hasattr(person, 'accomplishments') else [],
            "recent_posts": posts if posts else [],
            "scraped_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "scraped_timestamp": datetime.now().isoformat()
        }
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filename}")
        return filename
    except Exception as e:
        print(f"Error saving data: {e}")
        return None


def main(linkedin_url_arg=None):
    global driver

    user_data_dir = os.path.join(os.path.expanduser("~"), ".uc_linkedin_profile")
    os.makedirs(user_data_dir, exist_ok=True)

    try:
        driver = uc.Chrome(headless=False, use_subprocess=True, user_data_dir=user_data_dir)

        if not ensure_logged_in(driver):
            print("Failed to log in. Exiting.")
            sys.exit(1)

        print("\n" + "=" * 50)
        print("LinkedIn Profile Scraper")
        print("=" * 50)

        if linkedin_url_arg is None:
            if len(sys.argv) > 1:
                linkedin_url = sys.argv[1].strip()
            else:
                print("Error: No LinkedIn URL provided.")
                sys.exit(1)
        else:
            linkedin_url = linkedin_url_arg.strip()

        if not linkedin_url:
            print("Empty LinkedIn URL. Skipping.")
            sys.exit(0)

        clean_url = validate_linkedin_url(linkedin_url)

        if not clean_url:
            print(f"Invalid LinkedIn URL: '{linkedin_url}'")
            sys.exit(1)

        print(f"\nScraping profile: {clean_url}")

        person = Person(clean_url, driver=driver, close_on_complete=False)
        print(f"Name: {person.name}")

        posts = scroll_and_get_recent_posts(driver, clean_url)
        if posts:
            print("Recent Posts Found:")
            for i, post in enumerate(posts, 1):
                print(f"  {i}. {post[:100]}...")
        else:
            print("No recent posts found.")

        filename = generate_filename(person.name)
        saved_file = save_person_data(person, posts=posts, filename=filename)

        if saved_file:
            print(f"Profile scraping completed: {saved_file}")
            sys.exit(0)
        else:
            print("Failed to save data.")
            sys.exit(1)

    except KeyboardInterrupt:
        print("\nProcess interrupted.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
    finally:
        if driver:
            try:
                driver.quit()
                print("Browser closed.")
            except Exception as e:
                print(f"Error closing browser: {e}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        main(sys.argv[1])
    else:
        print("Usage: python main.py <linkedin_profile_url>")
        sys.exit(1)
