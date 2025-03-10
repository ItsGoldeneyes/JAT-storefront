from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/countries', methods=['GET'])
def get_countries():
    with open('countries.json') as f:
        data = json.load(f)
    return jsonify(data['countries'])

if __name__ == '__main__':
    app.run(debug=True)
