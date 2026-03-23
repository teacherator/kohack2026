from app.asr import transcribe_once
from app.parser import parse_command
from app.dispatcher import emit_command


def STC():
    print("Voice command service (LOCAL) started.")
    print("Speak after 'Listening...'\n")

    try:
        transcript = transcribe_once()
        print(f"\nTranscript: {transcript}")

        if not transcript:
            return"No speech detected. Please try again."
        command = parse_command(transcript)
            
        if not command:
            print("No valid command found in transcript.")
            return"No valid command found in transcript."

        if command["action"] == "exit":
            return"Exiting STC loop."

        emit_command(command)

        print("\n---\n")


    except Exception as e:
        print("Error:", e)


if __name__ == "__main__":
    STC()