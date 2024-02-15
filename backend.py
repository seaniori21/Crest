import os
import requests
import pandas as pd
from io import StringIO
from datetime import datetime, timedelta
import json
import re

# URL of the database website
url = "https://datadb.noaacrest.org/public/uhmt/Processed_Data/"

# Create a folder named 'db_folder' if it doesn't exist
db_folder_path = 'db_folder'
os.makedirs(db_folder_path, exist_ok=True)

def fetch_data():

    # HTTP request to the URL
    try:
        response = requests.get(url)
        response.raise_for_status() 

        # Check if the request was successful (status code 200)
        if response.status_code == 200:

            html_content = response.text

            # We extract the links to CSV files
            links = re.findall(r'href=(["\'])([^"\'>]*?\.csv)\1', html_content)

            # We clean up the link, since we have doubles
            unique_links = list(set([link[1] for link in links]))

            # Download and save each CSV file
            for link in unique_links:

                file_url = url + link
                file_name = os.path.join(db_folder_path, link)

                csv_response = requests.get(file_url)

                if csv_response.status_code == 200:
                    # If download successful, save the CSV content to a file
                    with open(file_name, 'w', encoding='utf-8') as file:
                        file.write(csv_response.text)
                    
                else:
                    print(f"Failed to download {file_url}")
            
            print("Downloaded data")

        else:
            print(f"The download csv link is not working{url}")

    except requests.exceptions.RequestException as e:
        print(f"Error accessing the URL:\n {e}")


def get_daily():
    
    # daily_plot_data folder
    output_folder_path = 'plot_data_Folder/daily_plot_data'
    os.makedirs(output_folder_path, exist_ok=True)

    # Function to filter csv data within 24 hours and save as JSON
    def process_csv_file(file_path):
        try:
            # Read the CSV file into a DataFrame
            df = pd.read_csv(file_path, dtype={'AirTF': 'object', 'RH': 'object', 'Rainfall_Tot': 'float'})
            df['TIMESTAMP'] = pd.to_datetime(df['TIMESTAMP'])

            df['AirTF'] = pd.to_numeric(df['AirTF'], errors='coerce')
            df['RH'] = pd.to_numeric(df['RH'], errors='coerce')

            # Get the most recent timestamp
            max_timestamp = df['TIMESTAMP'].max()

            # Filter data within the last 24 hours
            last_24_hours = df[df['TIMESTAMP'] > max_timestamp - timedelta(days=5)].copy()
            last_24_hours.loc[:, 'TIMESTAMP'] = last_24_hours['TIMESTAMP'].dt.strftime('%Y-%m-%d %H:%M:%S')

            json_data = last_24_hours.to_json(orient='records')
            output_file_path = os.path.join(output_folder_path, f"{os.path.basename(file_path).split('.')[0]}.json")

            # Save the JSON data to a new file
            with open(output_file_path, 'w') as json_file:
                json_file.write(json_data)
            
            # If we want to see which csv Files are processed
            # print(f"Processed {file_path}. Output saved to {output_file_path}")

        except Exception as e:
            print(f"Error processing {file_path}: {e}")


    # Iterate through each CSV file in the db_folder
    for filename in os.listdir(db_folder_path):
        if filename.endswith(".csv"):
            file_path = os.path.join(db_folder_path, filename)
            process_csv_file(file_path)
    
    print("DAILY DATA UPDATED\n")



def get_weekly():

    # weekly_plot_data folder
    output_folder_path = 'plot_data_Folder/weekly_plot_data'
    os.makedirs(output_folder_path, exist_ok=True)

    # Function to filter data within the last month and save as JSON
    def process_csv_file(file_path):
        try:

            # Read the CSV file into a DataFrame
            df = pd.read_csv(file_path)
            df['TIMESTAMP'] = pd.to_datetime(df['TIMESTAMP'])

            # Get the most recent timestamp
            max_timestamp = df['TIMESTAMP'].max()

            last_month = df[df['TIMESTAMP'] > max_timestamp - timedelta(days=30)]

            # Resample the DataFrame to 1-Day intervals, calculate average of 'AirTF' and 'RH', and sum of 'Rainfall_Tot'
            weeklyData = last_month.resample('2H', on='TIMESTAMP').agg({'AirTF': 'mean', 'RH': 'mean', 'Rainfall_Tot': 'sum'}).reset_index()
            
            # Fill NaN values with 0 for all columns
            weeklyData.fillna(0, inplace=True)

            # Reformat
            weeklyData['TIMESTAMP'] = weeklyData['TIMESTAMP'].dt.strftime('%Y-%m-%d %H:%M:%S')

            output_file_path = os.path.join(output_folder_path, f"{os.path.basename(file_path).split('.')[0]}.json")

            json_data = weeklyData.to_dict(orient='records')
            with open(output_file_path, 'w') as json_file:
                json.dump(json_data, json_file, indent=2)

            # print(f"Processed {file_path}. Output saved to {output_file_path}")

        except Exception as e:
            # print(f"Error processing {file_path}: {e}")
            print()

    # Iterate through each CSV file in the db_folder
    for filename in os.listdir(db_folder_path):
        if filename.endswith(".csv"):
            file_path = os.path.join(db_folder_path, filename)
            process_csv_file(file_path)

    print("Weekly Data Updated")


def get_monthly():

    # weekly_plot_data folder
    output_folder_path = 'plot_data_Folder/monthly_plot_data'
    os.makedirs(output_folder_path, exist_ok=True)

    # Function to filter data within the last year and save as JSON
    def process_csv_file(file_path):
        try:
            # Read the CSV file into a DataFrame
            df = pd.read_csv(file_path)
            df['TIMESTAMP'] = pd.to_datetime(df['TIMESTAMP'])

            # Get the most recent timestamp
            max_timestamp = df['TIMESTAMP'].max()

            last_year = df[df['TIMESTAMP'] > max_timestamp - timedelta(days=365)]

            # Resample the DataFrame to 1-Day intervals, calculate average of 'AirTF' and 'RH', and sum of 'Rainfall_Tot'
            monthlyData = last_year.resample('1d', on='TIMESTAMP').agg({'AirTF': 'mean', 'RH': 'mean', 'Rainfall_Tot': 'sum'}).reset_index()

            # Fill NaN values with 0 for all columns
            monthlyData.fillna(0, inplace=True)

            monthlyData['TIMESTAMP'] = monthlyData['TIMESTAMP'].dt.strftime('%Y-%m-%d %H:%M:%S')

            output_file_path = os.path.join(output_folder_path, f"{os.path.basename(file_path).split('.')[0]}.json")

            json_data = monthlyData.to_dict(orient='records')
            with open(output_file_path, 'w') as json_file:
                json.dump(json_data, json_file, indent=2)

            # print(f"Processed {file_path}. Output saved to {output_file_path}")

        except Exception as e:
            # print(f"Error processing {file_path}: {e}")
            print()

    # Iterate through each CSV file in the db_folder
    for filename in os.listdir(db_folder_path):
        if filename.endswith(".csv"):
            file_path = os.path.join(db_folder_path, filename)
            process_csv_file(file_path)

    print("Monthly Data Updated")

def get_yearly():
    
    output_folder_path = 'plot_data_Folder/yearly_plot_data'
    os.makedirs(output_folder_path, exist_ok=True)

     # Function to filter data within the last year and save as JSON
    def process_csv_file(file_path):
        try:
            # Read the CSV file into a DataFrame
            df = pd.read_csv(file_path)


            df['TIMESTAMP'] = pd.to_datetime(df['TIMESTAMP'])

            # Resample the DataFrame to 1-hour intervals, calculate average of 'AirTF' and 'RH', and sum of 'Rainfall_Tot'
            yearly = df.resample('W-Mon', on='TIMESTAMP').agg({'AirTF': 'mean', 'RH': 'mean', 'Rainfall_Tot': 'sum'}).reset_index()

            # Fill NaN values with 0 for all columns
            yearly.fillna(0, inplace=True)

            yearly['TIMESTAMP'] = yearly['TIMESTAMP'].dt.strftime('%Y-%m-%d %H:%M:%S')

            output_file_path = os.path.join(output_folder_path, f"{os.path.basename(file_path).split('.')[0]}.json")

            json_data = yearly.to_dict(orient='records')
            with open(output_file_path, 'w') as json_file:
                json.dump(json_data, json_file, indent=2)

            # print(f"Processed {file_path}. Output saved to {output_file_path}")

        except Exception as e:
            # print(f"Error processing {file_path}: {e}")
            print()

    # Iterate through each CSV file in the db_folder
    for filename in os.listdir(db_folder_path):
        if filename.endswith(".csv"):
            file_path = os.path.join(db_folder_path, filename)
            process_csv_file(file_path)

    print("Yearly Data Updated")


# fetch_data()
get_daily()
# get_weekly()
# get_monthly()
# get_yearly()
    