import base64
import hashlib
import time
import requests
from datetime import datetime
from flask import current_app

class DarajaAPI:
    def __init__(self):
        self.consumer_key = current_app.config.get('DARAJA_CONSUMER_KEY')
        self.consumer_secret = current_app.config.get('DARAJA_CONSUMER_SECRET')
        self.shortcode = current_app.config.get('DARAJA_SHORTCODE')
        self.callback_url = current_app.config.get('DARAJA_CALLBACK_URL')
        self.passkey = current_app.config.get('DARAJA_PASSKEY')
        self.env = current_app.config.get('DARAJA_ENV', 'sandbox')
    
    def _get_access_token(self):
        auth_string = f"{self.consumer_key}:{self.consumer_secret}"
        encoded_auth = base64.b64encode(auth_string.encode()).decode()
        
        url = f"https://{'sandbox' if self.env == 'sandbox' else 'api'}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        
        headers = {
            'Authorization': f'Basic {encoded_auth}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data.get('access_token')
            return None
        except Exception as e:
            print(f"Failed to get access token: {e}")
            return None
    
    def _generate_password(self):
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_string = f"{self.shortcode}{self.passkey}{timestamp}"
        password = base64.b64encode(password_string.encode()).decode()
        return password, timestamp
    
    def stk_push(self, phone, amount, transaction_id, description="KaziLive Payment"):
        access_token = self._get_access_token()
        if not access_token:
            return {'success': False, 'error': 'Failed to authenticate'}
        
        password, timestamp = self._generate_password()
        
        url = f"https://{'sandbox' if self.env == 'sandbox' else 'api'}.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": str(int(amount)),
            "PartyA": phone,
            "PartyB": self.shortcode,
            "PhoneNumber": phone,
            "CallBackURL": self.callback_url,
            "AccountReference": transaction_id,
            "TransactionDesc": description
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            result = response.json()
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'checkout_request_id': result.get('CheckoutRequestID'),
                    'merchant_request_id': result.get('MerchantRequestID'),
                    'response_code': result.get('ResponseCode'),
                    'response_description': result.get('ResponseDescription')
                }
            else:
                return {
                    'success': False,
                    'error': result.get('errorMessage', 'Payment failed'),
                    'response_code': result.get('ResponseCode')
                }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def query_transaction(self, checkout_request_id):
        access_token = self._get_access_token()
        if not access_token:
            return {'success': False, 'error': 'Failed to authenticate'}
        
        password, timestamp = self._generate_password()
        
        url = f"https://{'sandbox' if self.env == 'sandbox' else 'api'}.safaricom.co.ke/mpesa/stkpushquery/v1/query"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            result = response.json()
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'result_code': result.get('ResultCode'),
                    'result_desc': result.get('ResultDesc')
                }
            return {'success': False, 'error': result.get('errorMessage', 'Query failed')}
        except Exception as e:
            return {'success': False, 'error': str(e)}


def init_daraja(app):
    app.config.setdefault('DARAJA_CONSUMER_KEY', '')
    app.config.setdefault('DARAJA_CONSUMER_SECRET', '')
    app.config.setdefault('DARAJA_SHORTCODE', '')
    app.config.setdefault('DARAJA_PASSKEY', '')
    app.config.setdefault('DARAJA_CALLBACK_URL', '')
    app.config.setdefault('DARAJA_ENV', 'sandbox')