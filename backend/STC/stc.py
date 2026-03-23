def STC(on_processed=None):
    from app.asr import transcribe_once
    from app.parser import parse_command
    from app.dispatcher import emit_command

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

            # 👇 THIS IS THE KEY
            if on_processed:
                on_processed(transcript, command)

            print("\n---\n")

        except KeyboardInterrupt:
            print("\nStopping.")
            break
        except Exception as e:
            print("Error:", e)