
def parse_command(text: str):
    text = text.lower()
    if "stop" in text or "exit" in text or "quit" in text:
        return make("exit", None, text)
    # NAVIGATION
    if "settings" in text:
        return make("navigate", "settings", text)
    if "profile" in text:
        return make("navigate", "profile", text)
    if "home" in text:
        return make("navigate", "home", text)

    # ACTIONS
    if "go back" in text or "back" in text:
        return make("go_back", None, text)

    if "scroll down" in text:
        return make("scroll_down", None, text)

    if "scroll up" in text:
        return make("scroll_up", None, text)

    if "next" in text:
        return make("select_next", None, text)

    if "previous" in text:
        return make("select_previous", None, text)

    if "submit" in text:
        return make("tap", "submit", text)

    # fallback
    return make("unknown", None, text)


def make(action, target, spoken):
    return {
        "action": action,
        "target": target,
        "confidence": 0.9 if action != "unknown" else 0.2,
        "spoken_text": spoken,
    }