from flask import Flask, request, jsonify, send_from_directory, make_response, url_for
from flask_cors import CORS
import os
from predict import predict_race_positions
from stats import get_driver_stats
from plot_circuit_map import plot_circuit_map
from plot_gear_shifts_on_track import plot_gear_shifts

app = Flask(__name__, static_folder='../static', static_url_path='/')
CORS(app)

@app.route("/")
def home():
    return app.send_static_file("index.html")

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
    img_path = os.path.join(app.static_folder, 'images', 'graphs', img_name)
    os.makedirs(os.path.dirname(img_path), exist_ok=True)

    # Only generate if not already existing
    if not os.path.exists(img_path):
        plot_circuit_map(year, gp, img_path)

    return jsonify({'img_url': url_for('serve_graph_image', filename=img_name)})

@app.route('/gear-shifts', methods=['POST'])
def gear_shifts():
    data = request.get_json()
    year = data.get('year')
    gp = data.get('gp')
    img_name = f"{year}_{gp.replace(' ', '_')}_gear.png"
    img_path = os.path.join(app.static_folder, 'images', 'graphs', img_name)
    os.makedirs(os.path.dirname(img_path), exist_ok=True)

    if not os.path.exists(img_path):
        plot_gear_shifts(year, gp, img_path)

    return jsonify({'img_url': url_for('serve_graph_image', filename=img_name)})

# Route to serve cached images explicitly with cache headers
@app.route('/images/graphs/<path:filename>')
def serve_graph_image(filename):
    response = make_response(send_from_directory(os.path.join(app.static_folder, 'images', 'graphs'), filename))
    response.headers['Cache-Control'] = 'public, max-age=86400'  # Cache for 1 day
    return response

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
