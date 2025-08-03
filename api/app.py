from flask import Flask, request, jsonify
from flask_cors import CORS

from predict import predict_race_positions
from stats import get_driver_stats  # You’ll define this below

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    try:
        prediction = predict_race_positions(data)
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

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
