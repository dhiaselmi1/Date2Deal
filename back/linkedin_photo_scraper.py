# linkedin/linkedin_photo_scraper.py
import time
import os
import pickle
import requests
import sys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import undetected_chromedriver as uc

COOKIE_FILE = "linkedin_cookies.pkl"


def save_cookies(driver, filepath):
    with open(filepath, "wb") as file:
        pickle.dump(driver.get_cookies(), file)


def load_cookies(driver, filepath):
    with open(filepath, "rb") as file:
        cookies = pickle.load(file)
        for cookie in cookies:
            try:
                driver.add_cookie(cookie)
            except:
                continue


def download_image(image_url, filename):
    headers = {
        'User-Agent': 'Mozilla/5.0'
    }
    try:
        response = requests.get(image_url, headers=headers)
        if response.status_code == 200:
            with open(filename, "wb") as f:
                f.write(response.content)
            print(f"✅ Image downloaded: {filename}")
        else:
            print(f"❌ Image download failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")


def scrape_photo(linkedin_url, output_filename="profile_photo.jpg"):
    options = uc.ChromeOptions()
    options.add_argument("--disable-notifications")

    driver = uc.Chrome(options=options)
    wait = WebDriverWait(driver, 15)

    if os.path.exists(COOKIE_FILE):
        driver.get("https://www.linkedin.com/")
        time.sleep(2)
        load_cookies(driver, COOKIE_FILE)
        driver.refresh()
        time.sleep(2)
    else:
        driver.get("https://www.linkedin.com/login")
        input("🔐 Log in manually, then press Enter...")
        save_cookies(driver, COOKIE_FILE)

    driver.get(linkedin_url)
    time.sleep(5)

    selectors = [
        "//img[contains(@alt, 'Profile photo')]",
        "//img[contains(@class, 'EntityPhoto')]",
        "//img[contains(@class, 'presence-entity__image')]"
    ]

    image_url = None
    for selector in selectors:
        try:
            image_element = wait.until(EC.presence_of_element_located((By.XPATH, selector)))
            image_url = image_element.get_attribute("src")
            if image_url and "http" in image_url:
                break
        except:
            continue

    if image_url:
        download_image(image_url, output_filename)
    else:
        print("❌ Could not find profile image.")

    driver.quit()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python linkedin_photo_scraper.py <linkedin_url> [<output_filename>]")
        sys.exit(1)

    linkedin_url = sys.argv[1]
    filename = sys.argv[2] if len(sys.argv) >= 3 else "profile_photo.jpg"
    scrape_photo(linkedin_url, filename)
