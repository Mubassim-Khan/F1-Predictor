from flask import Flask, request
from flask_cors import CORS
from predict import predict_race_positions

app = Flask(__name__)
CORS(app) 

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    return predict_race_positions(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
