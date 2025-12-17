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
    
    # 2. Logic (Get GitHub Tree & Rich Context)
    repo_data = get_repo_structure(repo_url)
    
    if "error" in repo_data:
        return toonify({"error": repo_data["error"]}, 400)

    # 3. AI Processing (Now passing 'context' instead of just 'readme')
    # Note: repo_data['context'] contains the README + Dependency info
    dungeon_map_dict = generate_dungeon_map(
        file_structure=repo_data['structure'], 
        repo_context=repo_data['context'] 
    )
    
    # 4. Response (Dict -> TOON)
    response_payload = {
        "repoName": repo_data['repo_name'],
        "mapData": dungeon_map_dict
    }
    return toonify(response_payload)




# We are building the feature where a user clicks a location on the GoT Map (e.g., "The Iron Bank") #
# and gets a specific explanation of how that code works, translated into Westeros Lore.
# We call this endpoint: /consult_master

@app.route('/consult_master', methods=['POST'])
def consult_master():
    from flask import request, jsonify
    data = request.get_json()
    
    repo_url = data.get('repoUrl')
    node_path = data.get('nodePath') # The folder path, e.g., "src/database"
    
    # 1. Reuse existing logic to get general context (optional, but helps accuracy)
    from services.github_service import get_repo_structure, get_folder_summary
    repo_data = get_repo_structure(repo_url) # Cached ideally
    
    # 2. Get specific code for that folder
    folder_content = get_folder_summary(repo_url, node_path)
    
    # 3. Ask the Master
    from services.gemini_service import explain_module_lore
    lore = explain_module_lore(
        code_summaries=folder_content, 
        folder_name=node_path,
        repo_context=repo_data.get('context', '')
    )
    
    return jsonify(lore)




@app.route('/roast_code', methods=['POST'])
def roast_code():
    from flask import request
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Invalid JSON request. Failed to parse request body."}), 400
    
    repo_url = data.get('repoUrl', '')
    code = data.get('code', '')
    file_path = data.get('filePath', None) # Get path if user provided it

    # Fetch Repo Data (Context + Structure)
    from services.github_service import get_repo_structure
    repo_data = get_repo_structure(repo_url)
    
    if "error" in repo_data:
        return jsonify({"error": "Could not fetch repo context"}), 400

    # Pass everything to the logic layer
    feedback_dict = roast_code_logic(
        code_snippet=code,
        repo_context=repo_data['context'],
        file_structure=repo_data['structure'], # Pass the tree so Gemini can guess location
        file_path=file_path
    )
    
    return jsonify(feedback_dict)




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




@app.route('/create_issue', methods=['POST'])
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