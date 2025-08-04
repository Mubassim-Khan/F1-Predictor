from flask import Flask, request, jsonify
from flask_cors import CORS

from predict import predict_race_positions
from stats import get_driver_stats
from plot_circuit_map import plot_circuit_map
from plot_gear_shifts_on_track import plot_gear_shifts
import os

app = Flask(__name__, static_folder='../static')
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    try:
        prediction = predict_race_positions(data)
        if isinstance(prediction, dict) and 'error' in prediction:
            return jsonify(prediction), 400
        return jsonify(prediction)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/driver-stats', methods=['GET'])
def driver_stats():
    driver = request.args.get('driver')
    try:
        stats = get_driver_stats(driver)
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/circuit-map', methods=['POST'])
def circuit_map():
    data = request.get_json()
    year = data.get('year')
    gp = data.get('gp')
    img_name = f"{year}_{gp.replace(' ', '_')}_circuit.png"
    img_path = os.path.join('static', 'graphs', img_name)
    # Ensure directory exists
    os.makedirs(os.path.dirname(img_path), exist_ok=True)
    plot_circuit_map(year, gp, img_path)
    return jsonify({'img_url': f'/static/graphs/{img_name}'})

@app.route('/gear-shifts', methods=['POST'])
def gear_shifts():
    data = request.get_json()
    year = data.get('year')
    gp = data.get('gp')
    img_name = f"{year}_{gp.replace(' ', '_')}_gear.png"
    img_path = os.path.join('static', 'graphs', img_name)
    # Ensure directory exists
    os.makedirs(os.path.dirname(img_path), exist_ok=True)
    plot_gear_shifts(year, gp, img_path)
    return jsonify({'img_url': f'/static/graphs/{img_name}'})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
