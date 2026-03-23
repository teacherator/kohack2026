from app.asr import transcribe_once
from app.parser import parse_command
from app.dispatcher import emit_command


def main():
    print("Voice command service (LOCAL) started.")
    print("Speak after 'Listening...'\n")

    while True:
        try:
            transcript = transcribe_once()
            print(f"\nTranscript: {transcript}")

            if not transcript:
                continue
            command = parse_command(transcript)

            if command["action"] == "exit":
                print("Voice exit command received. Stopping.")
                break

            emit_command(command)

            print("\n---\n")

        except KeyboardInterrupt:
            print("\nStopping.")
            break
        except Exception as e:
            print("Error:", e)


if __name__ == "__main__":
    main()