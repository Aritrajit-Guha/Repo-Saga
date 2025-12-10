from flask import Flask, jsonify
from flask_cors import CORS
from services.github_service import get_repo_structure, create_github_issue
from services.gemini_service import generate_dungeon_map, roast_code_logic, analyze_for_issues
from utils.toon_utils import toonify, parse_toon_request

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return jsonify({"message": "Welcome to the RepoG Backend!"})

@app.route('/generate_map', methods=['POST'])
def generate_map():
    # 1. Parse Request (TOON -> Dict)
    data = parse_toon_request()
    if not data or 'repoUrl' not in data:
        return toonify({"error": "Invalid TOON request. Missing repoUrl."}, 400)

    repo_url = data['repoUrl']
    
    # 2. Logic (Get GitHub Tree)
    repo_data = get_repo_structure(repo_url)
    if "error" in repo_data:
        return toonify({"error": repo_data["error"]}, 400)

    # 3. AI Processing
    dungeon_map_dict = generate_dungeon_map(repo_data['structure'], repo_data['readme'])
    
    # 4. Response (Dict -> TOON)
    response_payload = {
        "repoName": repo_data['repo_name'],
        "mapData": dungeon_map_dict
    }
    return toonify(response_payload)




@app.route('/roast_code', methods=['POST'])
def roast_code():
    data = parse_toon_request()
    if not data:
        return toonify({"error": "Invalid TOON request. Failed to parse request body."}, 400)
    
    code = data.get('code', '')
    
    feedback_dict = roast_code_logic(code)
    return toonify(feedback_dict)




@app.route('/scout_bugs', methods=['POST'])
def scout_bugs():
    data = parse_toon_request()
    if not data:
        return toonify({"error": "Invalid TOON request. Failed to parse request body."}, 400)
    
    folder_name = data.get('nodeName')
    # Mocking code fetch for demo
    sample_code = "def insecure(): pass" 
    
    issue_data = analyze_for_issues(folder_name, sample_code)
    return toonify(issue_data)




@app.route('/create-issue', methods=['POST'])
def create_issue():
    data = parse_toon_request()
    if not data:
        return toonify({"error": "Invalid TOON request. Failed to parse request body."}, 400)
    
    # Extract args from TOON object
    result = create_github_issue(
        token=data.get('token'),
        repo_name=data.get('repoName'),
        title=data.get('title'),
        body=data.get('body')
    )
    return toonify(result)



if __name__ == '__main__':
    app.run(debug=True, port=5000)