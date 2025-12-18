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




# backend/app.py

@app.route('/chat_with_tyrion', methods=['POST'])
def chat_with_tyrion():
    from flask import request
    data = request.get_json()
    
    # 1. Get the Context
    repo_url = data.get('repoUrl', '')
    user_message = data.get('message', '') # User's typed message or code
    chat_history = data.get('history', []) # List of previous turn objects
    file_path = data.get('filePath', None)

    # 2. Fetch Repo Structure (Cached or fresh)
    from services.github_service import get_repo_structure
    repo_data = get_repo_structure(repo_url)
    
    if "error" in repo_data:
        return jsonify({"error": "Could not fetch repo context"}), 400

    # 3. Call the Chat Logic
    from services.gemini_service import tyrion_chat_logic
    response = tyrion_chat_logic(
        current_message=user_message,
        history=chat_history,
        repo_context=repo_data['context'],
        file_structure=repo_data['structure'],
        file_path=file_path
    )
    
    return jsonify(response)






@app.route('/scout_quests', methods=['POST'])
def scout_quests():
    from flask import request, jsonify
    data = request.get_json()
    
    repo_url = data.get('repoUrl')
    node_path = data.get('nodePath') # e.g., "src/auth"
    
    if not repo_url or not node_path:
        return jsonify({"error": "Missing repoUrl or nodePath"}), 400

    # 1. Fetch the code from that folder (Re-using the helper from the Maester feature)
    from services.github_service import get_folder_summary
    code_content = get_folder_summary(repo_url, node_path)
    
    if not code_content:
        return jsonify({"quests": []})

    # 2. AI Analysis
    from services.gemini_service import scout_for_quests
    quests = scout_for_quests(code_content, node_path)
    
    return jsonify({"quests": quests})






if __name__ == '__main__':
    app.run(debug=True, port=5000)