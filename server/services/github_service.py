from github import Github
import requests
import base64



def get_folder_summary(repo_url, folder_path):
    """
    Fetches the content of key files inside a specific folder 
    to help Gemini understand what this module actually does.
    """
    g = Github() # Add token if needed
    try:
        clean_url = repo_url.replace("https://github.com/", "").replace(".git", "")
        repo = g.get_repo(clean_url)
        
        # Get list of files in that specific folder
        contents = repo.get_contents(folder_path)
        
        code_summary = []
        
        # Limit to first 4 files to save tokens/time
        for file_content in contents[:4]:
            if file_content.type == "file" and file_content.name.endswith(('.py', '.js', '.ts', '.java', '.go', '.md')):
                # Download raw content
                try:
                    raw_code = requests.get(file_content.download_url).text
                    # Truncate large files (first 1000 chars is usually enough for context)
                    code_summary.append(f"--- File: {file_content.name} ---\n{raw_code[:1000]}\n")
                except:
                    continue
                    
        return "\n".join(code_summary)

    except Exception as e:
        return f"Error reading scrolls: {str(e)}"
    




def get_repo_structure(repo_url):
    """
    Fetches file structure and builds a robust context string, 
    even if README is missing.
    """
    g = Github() # Add token if available: Github(os.getenv("GITHUB_TOKEN"))
    
    try:
        clean_url = repo_url.replace("https://github.com/", "").replace(".git", "")
        repo = g.get_repo(clean_url)
        
        # 1. Get the File Tree
        contents = repo.get_git_tree("main", recursive=True).tree
        file_tree = [file.path for file in contents]
        
        # 2. Build Context (The "Brain" of the repo)
        context_parts = []
        
        # A. Repo Description (Often overlooked, but very useful)
        if repo.description:
            context_parts.append(f"Project Description: {repo.description}")
            
        # B. Primary Language
        if repo.language:
            context_parts.append(f"Primary Language: {repo.language}")

        # C. Hunt for Documentation & Dependencies
        # We prioritize these files to understand the stack
        priority_files = {
            "readme.md": "Documentation",
            "package.json": "Node.js Dependencies",
            "requirements.txt": "Python Dependencies",
            "pom.xml": "Java Maven",
            "go.mod": "Go Modules",
            "cargo.toml": "Rust Crates",
            "composer.json": "PHP Composer"
        }

        found_readme = False
        dependency_content = ""

        # scan the root directory first to save API calls
        root_files = [f.name.lower() for f in repo.get_contents("")]

        for filename, label in priority_files.items():
            if filename in root_files:
                try:
                    # Download content
                    file_content = repo.get_contents(filename)
                    decoded_content = base64.b64decode(file_content.content).decode('utf-8')
                    
                    if filename == "readme.md":
                        found_readme = True
                        context_parts.append(f"README Snippet: {decoded_content[:1500]}")
                    else:
                        # Only grab the first 50 lines of dependencies to save tokens
                        short_deps = "\n".join(decoded_content.splitlines()[:50])
                        context_parts.append(f"{label}: {short_deps}")
                        
                    # If we found dependencies + readme, we can stop searching to save time
                    if found_readme and dependency_content:
                        break
                except:
                    continue

        # D. If absolutely nothing found, infer from file extensions
        if not context_parts:
            extensions = [f.split('.')[-1] for f in file_tree if '.' in f]
            # Find most common extension
            from collections import Counter
            if extensions:
                common_ext = Counter(extensions).most_common(3)
                context_parts.append(f"Inferred Stack based on extensions: {common_ext}")

        full_context = "\n---\n".join(context_parts)

        return {
            "structure": "\n".join(file_tree),
            "context": full_context, # Use this instead of just 'readme'
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