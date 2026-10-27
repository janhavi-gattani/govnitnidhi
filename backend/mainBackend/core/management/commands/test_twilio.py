# test_twilio_direct.py

import os
import sys
import django

# Setup Django
sys.path.append('D:/devsquad/backend/mainBackend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mainBackend.settings')
django.setup()

print("=== Testing Twilio Configuration ===\n")

# Test 1: Check environment variables
print("1. Checking environment variables:")
from dotenv import load_dotenv
load_dotenv()

vars_to_check = {
    'TWILIO_ACCOUNT_SID': os.getenv('TWILIO_ACCOUNT_SID'),
    'TWILIO_AUTH_TOKEN': os.getenv('TWILIO_AUTH_TOKEN'),
    'TWILIO_FROM_NUMBER': os.getenv('TWILIO_FROM_NUMBER'),
    'TWILIO_BASE_URL': os.getenv('TWILIO_BASE_URL'),
}

for key, value in vars_to_check.items():
    if value:
        if len(value) > 10:
            masked = f"{value[:4]}...{value[-4:]}"
        else:
            masked = "***"
        print(f"   {key}: {masked} ✓")
    else:
        print(f"   {key}: NOT SET ✗")

print()

# Test 2: Check Twilio service
print("2. Testing Twilio service initialization:")
try:
    from core.twilio_service import twilio_service
    
    print(f"   Service object created: {twilio_service is not None}")
    print(f"   Client initialized: {twilio_service.client is not None}")
    
    if twilio_service.client:
        print(f"   Account SID: {twilio_service.account_sid[:4]}...{twilio_service.account_sid[-4:]}")
        print(f"   From number: {twilio_service.from_number}")
        print(f"   Base URL: {twilio_service.base_url}")
    
except Exception as e:
    print(f"   ERROR: {e}")

print()

# Test 3: Try to fetch a complaint and test call
print("3. Testing with a real complaint:")
try:
    from core.models import Complaint
    
    # Get the most recent complaint
    complaint = Complaint.objects.filter(status='resolved').first()
    
    if complaint:
        print(f"   Found complaint: {complaint.ticket_number}")
        print(f"   Title: {complaint.title}")
        print(f"   Citizen phone: {complaint.citizen_phone}")
        
        # Format phone number
        phone = complaint.citizen_phone
        if not phone.startswith('+'):
            phone = f"+91{phone.lstrip('0')}"
        
        print(f"   Formatted phone: {phone}")
        
        # Don't actually make the call, just test the message generation
        print("\n   Testing message generation...")
        english_message = (
            f"Hello! This is an update from the District Administration. "
            f"Your complaint number {complaint.ticket_number} regarding {complaint.title} "
            f"has been successfully resolved. "
            f"Thank you for your patience."
        )
        
        print(f"   English: {english_message[:100]}...")
        
        # Test translation
        hindi_message = twilio_service.translate_to_hindi(english_message)
        print(f"   Hindi: {hindi_message[:100]}...")
        
        print("\n   Would you like to make a test call? (yes/no)")
        choice = input("   > ").strip().lower()
        
        if choice == 'yes':
            print("\n   Making test call...")
            result = twilio_service.make_complaint_resolution_call(complaint, phone)
            print(f"   Result: {result}")
        else:
            print("   Test call skipped")
    else:
        print("   No resolved complaints found")
        
except Exception as e:
    print(f"   ERROR: {e}")
    import traceback
    traceback.print_exc()

print("\n=== Test Complete ===")