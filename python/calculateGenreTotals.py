import json

genre_buckets = {
    "House": [
        "Deep House",
        "Funky House",
        "House",
        "Minimal / Deep Tech",
        "Afro House",
        "Organic House / Downtempo"
    ],
    "Tech House": [
        "Tech House",
        "UK Garage / Bassline"
    ],
    "Melodic House & Techno": [
        "Melodic House & Techno"
    ],
    "Techno": [
        "Techno (Peak Time / Driving)",
        "Hard Techno",
        "Techno",
        "Techno (Raw / Deep / Hypnotic)"
    ],
    "Pop / Dance / Disco": [
        "Nu Disco / Disco",
        "Dance / Electro Pop",
        "Indie Dance"
    ],
    "EDM": [
        "Big Room",
        "Electro House",
        "Progressive House",
        "Hard Dance / Hardcore",
        "Future House",
        "Bass House",
        "Mainstage",
    ],
    "Trance": [
      "Trance",
      "Psy-Trance",
      "Trance (Main Floor)"
    ],
    "Drum & Bass": [
        "Drum & Bass"
    ],
}


# Initialize a dictionary to hold the aggregated data
aggregated_data = {genre: {} for genre in genre_buckets}

# Load genres.json file
with open('python/genres.json', 'r') as file:
    all_genres_data = json.load(file)

# Aggregate the counts for each genre bucket
for genre, subgenres in genre_buckets.items():
    for subgenre in subgenres:
        # Check if the subgenre is in the all_genres_data
        if subgenre in all_genres_data:
            # Iterate through each year for the subgenre
            for year, count in all_genres_data[subgenre].items():
                # Initialize year in aggregated data if not present
                aggregated_data[genre].setdefault(year, 0)
                # Add count to the aggregated data
                aggregated_data[genre][year] += count

# Now `aggregated_data` contains the summed counts for each genre bucket

# Write aggregated data to a JSON file
with open('aggregated_genre_data.json', 'w') as file:
    json.dump(aggregated_data, file, indent=4)

print("Aggregation complete. Data saved to 'aggregated_genre_data.json'.")