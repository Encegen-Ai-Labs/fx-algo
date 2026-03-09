import requests

BOT_TOKEN = "8646978360:AAFNYuAMKMfJmFEi094mBmvLdDaJk7vekpE"
CHAT_ID = "6093450356"


def send_admin_alert(message, buttons=None):
    """
    Send a text message to Telegram admin.
    Supports optional inline buttons.
    """

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

    payload = {
        "chat_id": CHAT_ID,
        "text": message,
        "parse_mode": "HTML"
    }

    if buttons:
        payload["reply_markup"] = {
            "inline_keyboard": buttons
        }

    try:
        response = requests.post(url, json=payload)

        if response.status_code != 200:
            print("Telegram error:", response.text)

        return response.json()

    except Exception as e:
        print("Telegram notification failed:", e)
        return None


def send_admin_photo(photo_path, caption, buttons=None):
    """
    Send image + caption to Telegram.
    Used for manual payment screenshots.
    """

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto"

    try:
        with open(photo_path, "rb") as photo:

            payload = {
                "chat_id": CHAT_ID,
                "caption": caption,
                "parse_mode": "HTML"
            }

            if buttons:
                payload["reply_markup"] = {
                    "inline_keyboard": buttons
                }

            files = {"photo": photo}

            response = requests.post(url, data=payload, files=files)

            if response.status_code != 200:
                print("Telegram photo error:", response.text)

            return response.json()

    except Exception as e:
        print("Telegram photo failed:", e)
        return None