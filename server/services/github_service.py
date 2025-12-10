from github import Github
import os

def get_repo_structure(repo_url):
    """
    Parses a GitHub URL, fetches the file tree, and README content.
    Returns a simplified text representation for Gemini to analyze.
    """
    # Use a public token or no token for public repos (Rate limits apply without token)
    # For a hackathon, it's safer to ask user for a token or use a shared one.
    g = Github() 
    
    try:
        # Extract "owner/repo" from "https://github.com/owner/repo"
        clean_url = repo_url.replace("https://github.com/", "").replace(".git", "")
        repo = g.get_repo(clean_url)
        
        # Get the tree (recursive=True gets all folders)
        contents = repo.get_git_tree("main", recursive=True).tree
        
        file_tree = []
        readme_content = ""
        
        for file in contents:
            # We only need paths to generate the map, not full code yet
            file_tree.append(file.path)
            
            # Grab README for context
            if file.path.lower() == "readme.md":
                import requests
                readme_content = requests.get(repo.get_contents(file.path).download_url).text[:2000] # Limit size

        return {
            "structure": "\n".join(file_tree),
            "readme": readme_content,
            "repo_name": clean_url
        }

    except Exception as e:
        return {"error": str(e)}

def create_github_issue(token, repo_name, title, body):
    """
    Creates an issue on the user's behalf using their PAT (Personal Access Token).
    """
    try:
        g = Github(token)
        repo = g.get_repo(repo_name)
        issue = repo.create_issue(title=title, body=body)
        return {"success": True, "url": issue.html_url}
    except Exception as e:
        return {"success": False, "error": str(e)}