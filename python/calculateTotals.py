import pandas as pd

start_year = 2013
end_year = 2022

# DataFrame to store all data
all_data = pd.DataFrame(columns=['Type', 'Name', 'Count'])

for year in range(start_year, end_year + 1):
    # Load the data
    filepath = f'./python/data/beatport_results_{year}-01-01_to_{year}-12-01.csv'
    data = pd.read_csv(filepath)

    # Convert 'Count' column to numeric, handle errors by converting non-convertible entries to NaN
    data['Count'] = pd.to_numeric(data['Count'], errors='coerce')

    # Check and print out data that could not be converted to a number
    if data['Count'].isnull().any():
        print(f"Non-numeric data found in year {year}:")
        print(data[data['Count'].isnull()])

    # Optionally, handle rows where 'Count' is NaN
    data = data.dropna(subset=['Count'])

    # Ensure that 'Count' is of integer type
    data['Count'] = data['Count'].astype(int)

    # Concatenate all years data into a single DataFrame
    all_data = pd.concat([all_data, data], ignore_index=True)

# Group, sum, and sort for both Labels and Artists
grouped_data = all_data.groupby(['Type', 'Name']).sum().reset_index()

# Ensure that 'Count' is of integer type before using nlargest
grouped_data['Count'] = grouped_data['Count'].astype(int)

top_labels = grouped_data[grouped_data['Type']
                          == 'Label'].nlargest(50, 'Count')
top_artists = grouped_data[grouped_data['Type']
                           == 'Artist'].nlargest(50, 'Count')

# Save the top artists and labels to separate CSV files
top_labels.to_csv('./python/data/top_labels.csv', index=False)
top_artists.to_csv('./python/data/top_artists.csv', index=False)
