from flask import Flask, jsonify, request, json
from flask_cors import CORS
import os
from apscheduler.schedulers.background import BackgroundScheduler





app = Flask(__name__)
CORS(app)

# routes
@app.route('/test', methods=['GET', 'POST'])
def test():
    return jsonify({
        'username': 'lol',
        'email': 'lol@test.com'
    })



def load_json_data(sitemapping, time_map):
    json_folder = 'plot_data_Folder'
    folder_map = {"1D":"/daily_plot_data", "1W":"/weekly_plot_data", "1M":"/monthly_plot_data", "1Y":"/yearly_plot_data"}    
    # sitemapping parameter
    json_folder = json_folder + folder_map[time_map]
    json_file_path = os.path.join(json_folder, f'{sitemapping}.json')

    # Load the JSON data from the file
    if os.path.exists(json_file_path):
        with open(json_file_path, 'r') as file:
            json_data = json.load(file)
        return json_data
    else:
        # Return None if the file does not exist
        return jsonify("fails")

@app.route('/<sitemapping>-<time_map>.json', methods=['GET', 'POST'])
def api_response(sitemapping, time_map):
    # Load JSON data based on the sitemapping parameter
    json_data = load_json_data(sitemapping,time_map)

    if json_data is not None:
        return jsonify(json_data)
    else:
        return jsonify({"error": "Not Found"}), 404


if __name__ == "__main__":
    app.run(debug=True, threaded=True)

