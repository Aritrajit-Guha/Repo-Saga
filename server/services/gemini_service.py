import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')



def generate_dungeon_map(file_structure, repo_context):
    """
    Converts a file tree into a Game of Thrones Map.
    """
    prompt = f"""
        ROLE: You are Grand Maester of the Codebase.
        
        INPUT CONTEXT:
            {repo_context}

        FILE STRUCTURE:
            {file_structure}

        TASK:
            Map the modules to 'Game of Thrones' locations.
            
            RULES for MAPPING:
            1. Auth/Security -> 'The Wall' (Guards the realm).
            2. Database/Assets -> 'The Iron Bank' (Stores value).
            3. Core Logic/Controllers -> 'King's Landing' (The capital).
            4. Utils/Helpers/Docs -> 'The Citadel' (Knowledge).
            5. Messy/Large Modules -> 'Flea Bottom'.
            6. Frontend/Public -> 'Winterfell'.

        OUTPUT (JSON):
            {{
                "nodes": [
                    {{ "id": "1", "label": "src/auth", "fantasyName": "The Wall", "description": "The Night's Watch guards the routes here.", "type": "wall" }}
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




def explain_module_lore(code_summaries, folder_name, repo_context):
    prompt = f"""
    ROLE: You are a Grand Maester in the Citadel of Westeros. 
    You are wise, articulate, and use Game of Thrones metaphors to explain complex systems.

    CONTEXT:
    The student is asking about the folder: '{folder_name}'
    Repo Tech Stack: {repo_context}

    SCROLLS (CODE CONTENT):
    {code_summaries}

    TASK:
    Explain what this specific module does.
    1. Title: Give it a GoT Title (e.g., "The Laws of Kings Landing" for Controllers).
    2. The Lore (The Metaphor): Explain the logic as if it were a castle, bank, or army function.
    3. The Reality (The Tech): Explain it plainly for a junior developer.

    OUTPUT JSON:
    {{
        "title": "Fantasy Title",
        "lore": "A paragraph using GoT metaphors...",
        "technical_explanation": "Clear, concise technical summary (libraries used, logic flow).",
        "key_files": ["List of important files found"]
    }}
    """
    
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return json.loads(response.text)
    except Exception as e:
        return {"error": str(e)}




def roast_code_logic(code_snippet, repo_context, file_structure, file_path=None):
    """
    Evaluates code for quality.
    - If Good: Praise it.
    - If Bad: Roast it.
    - If Duplicate: Call it out.
    """
    
    # Step 1: The Locator (Same as before)
    inferred_location = file_path
    if not inferred_location:
        # ... (Keep your locator logic here) ...
        inferred_location = "Unknown Context"

    # Step 2: The "Fair Judge" Prompt
    prompt = f"""
        ROLE: You are Tyrion Lannister (Game of Thrones).
            You are drinking wine and reviewing code. You are witty, cynical, and highly intelligent.
        
        CONTEXT:
            The code is in: '{file_path or 'Unknown Lands'}'
            Repo Stack: {repo_context}

        CODE:
            {code_snippet}

        TASK:
            1. IF CODE IS BAD: "I drink and I know things, and I know this code is a disaster." Roast it with Westeros metaphors (e.g., "This function is as useless as nipples on a breastplate.")
            2. IF CODE IS GOOD: "A mind needs books as a sword needs a whetstone. You have sharpened this well."
            3. AUDIT: Find 'White Walkers' (Bugs) and 'Wildlings' (Security flaws).

        OUTPUT JSON:
            {{
                "status": "Good/Bad",
                "commentary": "Tyrion's Quote...",
                "issues": [ ... ],
                "fixed_code": "..."
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