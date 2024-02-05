from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from datetime import datetime
from collections import defaultdict
import csv

# Configurations
EMAIL = 'beatportanalysisproject@gmail.com'
PASSWORD = 'RyWqdvbC3FDEhHJ'
start_date = datetime(2022, 1, 1)
end_date = datetime(2022, 12, 1)
BASE_URL = "https://www.bptoptracker.com/top/track/global/"

# Set up the driver
browser = webdriver.Chrome()

# Navigate to the page
browser.get(BASE_URL)

# Log in
email_elem = browser.find_element(By.NAME, 'email')
password_elem = browser.find_element(By.NAME, 'password')
email_elem.send_keys(EMAIL)
password_elem.send_keys(PASSWORD)
password_elem.submit()

# Wait for the page to load
browser.implicitly_wait(5)

# Verify login
assert "Beatport Top" in browser.title

# Initialize collections
genres_count = defaultdict(int)
labels_count = defaultdict(int)
artists_count = defaultdict(int)

# Initialize current_date with start_date
current_date = start_date

while current_date <= end_date:
    print(f'checking for {current_date.strftime("%Y-%m-%d")}')
    url = BASE_URL + current_date.strftime('%Y-%m-%d')
    browser.get(url)

    browser.implicitly_wait(5)

    # Identify rows
    rows = browser.find_elements(By.CSS_SELECTOR, 'tbody tr')
    for row in rows:
        # Check if row contains "OUT" label, if it does skip the row
        progression_text = row.find_element(
            By.CSS_SELECTOR, 'td.progression').text.strip()
        if "OUT" not in progression_text:
            genre = row.find_element(By.CSS_SELECTOR, 'td.genre').text.strip()
            genres_count[genre] += 1

            label = row.find_element(
                By.CSS_SELECTOR, 'td.label, td.labelname1').text.strip()
            labels_count[label] += 1

            artist_names = row.find_element(
                By.CSS_SELECTOR, 'td.artists').text.strip().split(", ")
            for artist in artist_names:
                artists_count[artist] += 1

    # Move to the next month
    year = current_date.year
    month = current_date.month
    if month == 12:  # if current month is December
        year += 1   # increase year by 1
        month = 1   # reset month to January
    else:
        month += 1  # go to next month
    current_date = datetime(year, month, 1)

# Always close the browser when done
browser.quit()

# Export to CSV
filename = f'beatport_results_{start_date.strftime("%Y-%m-%d")}_to_{end_date.strftime("%Y-%m-%d")}.csv'
with open(filename, 'w', newline='') as csvfile:
    fieldnames = ['Type', 'Name', 'Count']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for name, count in genres_count.items():
        writer.writerow({'Type': 'Genre', 'Name': name, 'Count': count})
    for name, count in labels_count.items():
        writer.writerow({'Type': 'Label', 'Name': name, 'Count': count})
    for name, count in artists_count.items():
        writer.writerow({'Type': 'Artist', 'Name': name, 'Count': count})

print("Scraping complete and results exported to beatport_results.csv!")
