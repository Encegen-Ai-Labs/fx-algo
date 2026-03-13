import requests
from flask import Blueprint, jsonify

currency_bp = Blueprint("currency", __name__)

@currency_bp.get("/usd-inr")
def get_usd_inr():

    try:
        res = requests.get("https://open.er-api.com/v6/latest/USD")
        data = res.json()

        rate = data["rates"]["INR"]

        return jsonify({
            "rate": rate
        })

    except Exception as e:

        print("Currency API error:", e)

        # fallback rate
        return jsonify({
            "rate": 83
        })