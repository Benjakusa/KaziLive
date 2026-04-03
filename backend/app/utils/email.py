import random
import string
from datetime import datetime, timedelta
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from flask import current_app


def generate_verification_token(length=6):
    """Generate a 6-digit numeric token."""
    return ''.join(random.choices(string.digits, k=length))


def get_token_expiry(minutes=30):
    """Token valid for 30 minutes."""
    return datetime.utcnow() + timedelta(minutes=minutes)


def _send_email(to_email, subject, html_content):
    """Core SendGrid send function."""
    try:
        sg = SendGridAPIClient(current_app.config['SENDGRID_API_KEY'])
        from_email = Email(
            current_app.config['SENDGRID_SENDER_EMAIL'],
            current_app.config['SENDGRID_SENDER_NAME']
        )
        to = To(to_email)
        content = Content("text/html", html_content)
        mail = Mail(from_email, to, subject, content)

        response = sg.client.mail.send.post(request_body=mail.get())
        print(f"[SendGrid] Email sent to {to_email} | Status: {response.status_code}")
        return True
    except Exception as e:
        print(f"[SendGrid] Failed to send email to {to_email} | Error: {str(e)}")
        return False


def send_verification_email(email, token):
    """Send 2-step verification email with token."""
    subject = "KaziLive - Verify Your Email"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to KaziLive!</h2>
        <p>Thank you for registering. Please verify your email address using the token below:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #2563eb; letter-spacing: 8px; font-size: 36px;">{token}</h1>
        </div>
        <p>This token is valid for <strong>30 minutes</strong>.</p>
        <p>If you did not register on KaziLive, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">KaziLive - Connecting Talent with Opportunity</p>
    </div>
    """
    return _send_email(email, subject, html_content)


def send_payment_notification_email(email, amount, transaction_id):
    """Send payment confirmation email."""
    subject = "KaziLive - Payment Confirmation"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Payment Confirmed!</h2>
        <p>Your payment has been received successfully. You can now browse jobseeker profiles.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Amount:</strong> KES {amount}</p>
            <p><strong>Transaction ID:</strong> {transaction_id}</p>
        </div>
        <p>Thank you for using KaziLive!</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">KaziLive - Connecting Talent with Opportunity</p>
    </div>
    """
    return _send_email(email, subject, html_content)