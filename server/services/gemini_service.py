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






def tyrion_chat_logic(current_message, history, repo_context, file_structure, file_path=None):
    """
    Handles a continuous conversation with context.
    """
    
    # 1. Format the history for the Prompt
    # We turn the JSON array into a script format for Gemini to read
    conversation_script = ""
    for turn in history[-5:]: # Keep last 5 turns to save tokens
        conversation_script += f"User: {turn['user']}\nTyrion: {turn['ai']}\n"

    # 2. The Prompt
    prompt = f"""
    ROLE: You are Tyrion Lannister. You are reviewing code in a 'Game of Thrones' style.
    You are cynical, wise, and technically brilliant.
    
    CONTEXT:
    Repo Tech Stack: {repo_context}
    Current File: {file_path or 'Unknown'}
    
    PREVIOUS CONVERSATION:
    {conversation_script}
    
    CURRENT USER INPUT:
    "{current_message}"

    TASK:
    Respond to the user.
    - If they pasted Code: Roast it or Approve it. Provide specific fixes.
    - If they asked a Question: Answer it with wit and technical accuracy.
    - Maintain the persona. Do not break character.

    OUTPUT JSON:
    {{
        "reply": "Tyrion's response text...",
        "fixed_code": "..." (Optional, null if not needed),
        "issues": [] (Optional list of bugs found)
    }}
    """
    
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return json.loads(response.text)
    except Exception as e:
        return {"reply": f"The maesters are confused. (Error: {str(e)})"}
    





def scout_for_quests(code_summaries, folder_name):
    """
    Analyzes code snippets and generates 'Quests' (GitHub Issues).
    """
    prompt = f"""
    ROLE: You are the Lord Commander of the Night's Watch.
    
    TASK: Send scouts to analyze the territory '{folder_name}'.
    Identify 3 distinct improvement opportunities in the provided code.
    These can be:
    1. Bugs (White Walkers)
    2. Missing Documentation (Lost Scrolls)
    3. Refactoring opportunities (Rebuilding the Wall)
    4. Security Vulnerabilities (Wildling Raids)

    CODE SCROLLS:
    {code_summaries[:5000]}

    OUTPUT FORMAT (JSON Array):
    [
        {{
            "quest_rank": "Easy/Medium/Hard",
            "quest_name": "Game of Thrones Style Title (e.g., 'Fortify the Login Gate')",
            "issue_title": "Technical GitHub Title (e.g., 'Refactor: Add Error Handling in Auth')",
            "issue_body": "Markdown formatted description explaining the issue and how to fix it.",
            "reward": "100 Gold"
        }}
    ]
    """
    
    try:
        # Generate content
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return json.loads(response.text)
    except Exception as e:
        # Fallback if AI fails
        return [{
            "quest_name": "The Long Night",
            "issue_title": "Manual Inspection Required",
            "issue_body": "The scouts returned no report. (AI Error)",
            "reward": "0 Gold"
        }]





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