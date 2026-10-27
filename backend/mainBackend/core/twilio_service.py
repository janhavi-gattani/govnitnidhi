# # core/twilio_service.py

# import os
# from twilio.rest import Client
# from urllib.parse import quote
# from deep_translator import GoogleTranslator
# import logging

# logger = logging.getLogger(__name__)


# class TwilioVoiceService:
#     """Service to handle Twilio voice calls"""
    
#     def __init__(self):
#         self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
#         self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
#         self.from_number = os.getenv("TWILIO_FROM_NUMBER")
#         self.base_url = os.getenv("TWILIO_BASE_URL")  # Your ngrok/server URL
        
#         if not all([self.account_sid, self.auth_token, self.from_number, self.base_url]):
#             logger.warning("Twilio credentials not fully configured")
#             self.client = None
#         else:
#             self.client = Client(self.account_sid, self.auth_token)
    
#     def translate_to_hindi(self, english_text):
#         """Translate English text to Hindi"""
#         try:
#             translator = GoogleTranslator(source='en', target='hi')
#             hindi_text = translator.translate(english_text)
#             logger.info(f"Translated: {english_text} -> {hindi_text}")
#             return hindi_text
#         except Exception as e:
#             logger.error(f"Translation failed: {e}")
#             return "नमस्ते! यह एक महत्वपूर्ण अपडेट है।"  # Fallback
    
#     def make_complaint_resolution_call(self, complaint, to_phone_number):
#         """
#         Make a voice call to inform citizen about complaint resolution
        
#         Args:
#             complaint: Complaint model instance
#             to_phone_number: Phone number to call (with country code)
        
#         Returns:
#             dict: Call status and details
#         """
#         if not self.client:
#             logger.error("Twilio client not initialized")
#             return {"success": False, "error": "Twilio not configured"}
        
#         try:
#             # Create English message
#             english_message = (
#                 f"Hello! This is an update from the District Administration. "
#                 f"Your complaint number {complaint.ticket_number} regarding {complaint.title} "
#                 f"has been successfully resolved. "
#                 f"Thank you for your patience."
#             )
            
#             # Translate to Hindi
#             hindi_message = self.translate_to_hindi(english_message)
            
#             # Create TwiML URL with both messages
#             encoded_english = quote(english_message)
#             encoded_hindi = quote(hindi_message)
#             twiml_url = (
#                 f"{self.base_url}/api/twilio/complaint-resolved?"
#                 f"english={encoded_english}&hindi={encoded_hindi}"
#             )
            
#             logger.info(f"Making call to {to_phone_number} for complaint {complaint.ticket_number}")
            
#             # Make the call
#             call = self.client.calls.create(
#                 to=to_phone_number,
#                 from_=self.from_number,
#                 url=twiml_url,
#                 status_callback=f"{self.base_url}/api/twilio/call-status",
#                 status_callback_event=['completed', 'failed'],
#                 status_callback_method='POST'
#             )
            
#             logger.info(f"Call initiated successfully. SID: {call.sid}")
            
#             return {
#                 "success": True,
#                 "call_sid": call.sid,
#                 "status": call.status,
#                 "to": to_phone_number,
#                 "hindi_message": hindi_message,
#                 "english_message": english_message
#             }
            
#         except Exception as e:
#             logger.error(f"Failed to make call: {str(e)}")
#             return {
#                 "success": False,
#                 "error": str(e)
#             }
    
#     def make_custom_call(self, to_phone_number, english_message):
#         """
#         Make a custom voice call with any message
        
#         Args:
#             to_phone_number: Phone number to call
#             english_message: Message to speak
#         """
#         if not self.client:
#             return {"success": False, "error": "Twilio not configured"}
        
#         try:
#             hindi_message = self.translate_to_hindi(english_message)
            
#             encoded_english = quote(english_message)
#             encoded_hindi = quote(hindi_message)
#             twiml_url = (
#                 f"{self.base_url}/api/twilio/custom-call?"
#                 f"english={encoded_english}&hindi={encoded_hindi}"
#             )
            
#             call = self.client.calls.create(
#                 to=to_phone_number,
#                 from_=self.from_number,
#                 url=twiml_url
#             )
            
#             return {
#                 "success": True,
#                 "call_sid": call.sid,
#                 "status": call.status
#             }
            
#         except Exception as e:
#             logger.error(f"Failed to make custom call: {str(e)}")
#             return {"success": False, "error": str(e)}


# # Initialize the service
# twilio_service = TwilioVoiceService()



# core/twilio_service.py

import os
from twilio.rest import Client
from urllib.parse import quote
from deep_translator import GoogleTranslator
import logging

logger = logging.getLogger(__name__)


class TwilioVoiceService:
    """Service to handle Twilio voice calls"""
    
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.from_number = os.getenv("TWILIO_FROM_NUMBER")
        self.base_url = os.getenv("TWILIO_BASE_URL")
        
        # Debug: Print what we got
        logger.info("=== Twilio Configuration Check ===")
        logger.info(f"TWILIO_ACCOUNT_SID: {'SET' if self.account_sid else 'NOT SET'}")
        logger.info(f"TWILIO_AUTH_TOKEN: {'SET' if self.auth_token else 'NOT SET'}")
        logger.info(f"TWILIO_FROM_NUMBER: {self.from_number if self.from_number else 'NOT SET'}")
        logger.info(f"TWILIO_BASE_URL: {self.base_url if self.base_url else 'NOT SET'}")
        
        if not all([self.account_sid, self.auth_token, self.from_number, self.base_url]):
            logger.warning("Twilio credentials not fully configured - calls will be skipped")
            self.client = None
        else:
            try:
                self.client = Client(self.account_sid, self.auth_token)
                logger.info("Twilio client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {e}")
                self.client = None
    
    def translate_to_hindi(self, english_text):
        """Translate English text to Hindi"""
        try:
            translator = GoogleTranslator(source='en', target='hi')
            hindi_text = translator.translate(english_text)
            logger.info(f"Translation successful")
            return hindi_text
        except Exception as e:
            logger.error(f"Translation failed: {e}")
            return "नमस्ते! यह एक महत्वपूर्ण अपडेट है।"
    
    def make_complaint_resolution_call(self, complaint, to_phone_number):
        """
        Make a voice call to inform citizen about complaint resolution
        """
        if not self.client:
            logger.error("Twilio client not initialized - cannot make call")
            return {"success": False, "error": "Twilio not configured"}
        
        try:
            # Create English message
            english_message = (
                f"Hello! This is an update from the District Administration. "
                f"Your complaint number {complaint.ticket_number} regarding {complaint.title} "
                f"has been successfully resolved. "
                f"Thank you for your patience."
            )
            
            # Translate to Hindi
            hindi_message = self.translate_to_hindi(english_message)
            
            # Create TwiML URL with both messages
            encoded_english = quote(english_message)
            encoded_hindi = quote(hindi_message)
            twiml_url = (
                f"{self.base_url}/api/twilio/complaint-resolved?"
                f"english={encoded_english}&hindi={encoded_hindi}"
            )
            
            logger.info(f"Making call to {to_phone_number} for complaint {complaint.ticket_number}")
            logger.info(f"TwiML URL: {twiml_url[:100]}...")
            
            # Make the call
            call = self.client.calls.create(
                to=to_phone_number,
                from_=self.from_number,
                url=twiml_url,
                status_callback=f"{self.base_url}/api/twilio/call-status",
                status_callback_event=['completed', 'failed'],
                status_callback_method='POST'
            )
            
            logger.info(f"Call initiated successfully. SID: {call.sid}")
            
            return {
                "success": True,
                "call_sid": call.sid,
                "status": call.status,
                "to": to_phone_number,
                "hindi_message": hindi_message,
                "english_message": english_message
            }
            
        except Exception as e:
            logger.error(f"Failed to make call: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }


# Initialize the service
twilio_service = TwilioVoiceService()