import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

def generate_dungeon_map(file_structure, readme):
    """
    1. Receives raw file text.
    2. Sends context to Gemini.
    3. Returns a Dict (which will be converted to TOON by the controller).
    """
    prompt = f"""
    You are the Dungeon Master of Code. Analyze this codebase.
    
    INPUT CONTEXT:
    README: {readme[:1000]}
    FILES:
    {file_structure}

    TASK:
    Map the modules to a D&D fantasy setting.
    - Auth -> Gatekeeper
    - DB -> Library
    - Utils -> Alchemist
    
    OUTPUT:
    Return strictly valid JSON.
    {{
        "nodes": [
            {{ "id": "1", "label": "src/auth", "fantasyName": "The Iron Gate", "type": "fortress" }}
        ],
        "edges": [
            {{ "source": "1", "target": "2" }}
        ]
    }}
    """
    
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return json.loads(response.text)
    except Exception as e:
        return {"error": str(e)}

def roast_code_logic(code_snippet):
    """
    The Angry Senior Dev.
    """
    prompt = f"""
    ROLE: Sarcastic Senior Engineer.
    TASK: Roast this code.
    CODE:
    {code_snippet}

    OUTPUT JSON:
    {{
        "roast": "Your mean comment here",
        "bugs": ["Bug 1", "Bug 2"],
        "fixed_code": "Clean code here"
    }}
    """
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return json.loads(response.text)
    except Exception as e:
        return {"error": str(e)}

def analyze_for_issues(folder_name, code_snippet):
    prompt = f"""
    Identify one critical bug in '{folder_name}'.
    Code: {code_snippet[:2000]}
    
    OUTPUT JSON:
    {{
        "title": "Bug Title",
        "body": "Description",
        "severity": "High"
    }}
    """
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return json.loads(response.text)
    except Exception as e:
        return {"error": str(e)}