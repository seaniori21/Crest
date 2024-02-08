import atexit
from flask import Flask, jsonify, request, json
from flask_cors import CORS
import os
from flask_apscheduler import APScheduler
# from apscheduler.schedulers.background import BackgroundScheduler
from backend import fetch_data, get_daily, get_weekly, get_monthly, get_yearly


app = Flask(__name__)
CORS(app)
scheduler = APScheduler()
scheduler.init_app(app)

atexit.register(lambda: scheduler.shutdown())

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
    scheduler.add_job(id='fetch_data', func=fetch_data, trigger='cron', minute=15)
    scheduler.add_job(id='get_daily', func=get_daily, trigger='cron', day=1)
    scheduler.add_job(id='get_weekly', func=get_weekly, trigger='cron', week=1)
    scheduler.add_job(id='get_monthly', func=get_monthly, trigger='cron', week=1)
    scheduler.add_job(id='get_yearly', func=get_yearly, trigger='cron', week=1)
    # scheduler.add_job(id='fetch_data', func=fetch_data, trigger='cron', second=30)
    # scheduler.add_job(id='get_daily', func=get_daily, trigger='cron', second=60)
    # scheduler.add_job(id='get_weekly', func=get_weekly, trigger='cron', second=60)
    # scheduler.add_job(id='get_monthly', func=get_monthly, trigger='cron', second=60)
    # scheduler.add_job(id='get_yearly', func=get_yearly, trigger='cron', second=60)
    scheduler.start()
    app.run(debug=True, use_reloader=False, threaded=True)

