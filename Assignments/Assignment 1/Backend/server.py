from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

# Database connection
conn = psycopg2.connect(
    dbname="railway",
    user="postgres",
    password="akwwmxIlIPaRazzCpFjMmnyDiiDAisTe",
    host="caboose.proxy.rlwy.net",
    port="12261"
)
cursor = conn.cursor()

@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data['email']
    password = data['password']

    try:
        cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email, password))
        user = cursor.fetchone()
        if user:
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "message": "Invalid email or password"}), 401
    except Exception as e:
        print(f"Error signing in: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
