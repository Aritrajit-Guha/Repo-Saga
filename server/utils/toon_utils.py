from flask import Response, request
import toon_format
import sys

def toonify(data, status=200):
    toon_string = toon_format.encode(data)
    return Response(toon_string, status=status, mimetype='text/toon')

def parse_toon_request():
    try:
        raw_data = request.data.decode('utf-8')
        
        # DEBUG: Print what the server actually received
        print(f"--- RECEIVED RAW DATA ---\n{raw_data}\n-------------------------", file=sys.stderr)
        
        if not raw_data.strip():
            print("Error: Received empty body", file=sys.stderr)
            return None

        parsed = toon_format.decode(raw_data)
        return parsed
    except Exception as e:
        # DEBUG: Print the specific parsing error
        print(f"TOON PARSING ERROR: {e}", file=sys.stderr)
        return None