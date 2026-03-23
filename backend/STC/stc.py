from .app.asr import transcribe_once
from .app.parser import parse_command
from .app.dispatcher import emit_command


def STC():
    print("Voice command service (LOCAL) started.")
    print("Speak after 'Listening...'\n")

    try:
        transcript = transcribe_once()
        print(f"\nTranscript: {transcript}")

        if not transcript:
            return {
                "status": "no_speech",
                "transcript": "",
                "command": None,
                "message": "No speech detected. Please try again.",
            }
        command = parse_command(transcript)

        if not command:
            print("No valid command found in transcript.")
            return {
                "status": "no_command",
                "transcript": transcript,
                "command": None,
                "message": "No valid command found in transcript.",
            }

        if command["action"] == "exit":
            return {
                "status": "exit",
                "transcript": transcript,
                "command": command,
                "message": "Exiting STC loop.",
            }

        emit_command(command)

        print("\n---\n")
        return {
            "status": "ok",
            "transcript": transcript,
            "command": command,
            "message": "Voice command recognized.",
        }


    except Exception as e:
        print("Error:", e)
        raise


if __name__ == "__main__":
    STC()
