from flask_mail import Message
from extensions import mail

def send_reset_email(email, reset_link):

    msg = Message(
        "Reset Your Password",
        recipients=[email]
    )

    msg.body = f"""
    Click the link below to reset your password:

    {reset_link}

    This link will expire in 30 minutes.
    """

    mail.send(msg)