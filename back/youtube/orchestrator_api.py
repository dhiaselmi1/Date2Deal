from flask import Flask, request, jsonify
import subprocess
import sys

app = Flask(__name__)

@app.route('/run-orchestrator_run_all', methods=['POST'])
def run_orchestrator():
    data = request.json
    company = data.get('company_name')
    region = data.get('region')

    if not company or not region:
        return jsonify({"error": "company_name et region sont requis"}), 400

    try:
        result = subprocess.run(
            [sys.executable, "orchestrateur_run_all.py", company, region],
            check=True,
            capture_output=True,
            text=True
        )
        return jsonify({"status": "OK", "output": result.stdout})
    except subprocess.CalledProcessError as e:
        return jsonify({"status": "Erreur", "output": e.stderr}), 500

if __name__ == "__main__":
    app.run(debug=True)
