import json

def emit_command(cmd):
    print("\nStructured command:")
    print(json.dumps(cmd, indent=2))