import csv
import json
import os
from glob import glob
print("Current working directory:", os.getcwd())

# Initialize dictionaries for each Type
genres = {}
labels = {}
artists = {}

# Function to update the dictionary based on Type
def update_dict(entry_type, name, year, count):
    if entry_type == 'Genre':
        genres.setdefault(name, {}).update({year: count})
    elif entry_type == 'Label':
        labels.setdefault(name, {}).update({year: count})
    elif entry_type == 'Artist':
        artists.setdefault(name, {}).update({year: count})

# Iterate over CSV files from 2013 to 2022
for year in range(2013, 2023):
    filename = f'python/data/beatport_results_{year}-01-01_to_{year}-12-01.csv'
    with open(filename, mode='r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            update_dict(row['Type'], row['Name'], str(year), int(row['Count']))

# Save the data to JSON files
for data_dict, filename in [(genres, 'genres.json'), (labels, 'labels.json'), (artists, 'artists.json')]:
    with open(filename, 'w', encoding='utf-8') as json_file:
        json.dump(data_dict, json_file, ensure_ascii=False, indent=2)
