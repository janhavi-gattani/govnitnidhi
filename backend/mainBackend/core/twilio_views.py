# core/twilio_views.py

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse
import logging

logger = logging.getLogger(__name__)


@csrf_exempt
def complaint_resolved_twiml(request):
    """Generate TwiML for complaint resolution call"""
    english_text = request.GET.get('english', 'Your complaint has been resolved.')
    hindi_text = request.GET.get('hindi', 'आपकी शिकायत हल हो गई है।')
    
    logger.info(f"TwiML requested - Hindi: {hindi_text[:50]}... English: {english_text[:50]}...")
    
    response = VoiceResponse()
    
    # First speak in Hindi
    response.say(hindi_text, voice="Polly.Aditi", language="hi-IN")
    
    # Small pause
    response.pause(length=1)
    
    # Then speak in English
    response.say(english_text, voice="Polly.Raveena", language="en-IN")
    
    return HttpResponse(str(response), content_type='application/xml')


@csrf_exempt
def custom_call_twiml(request):
    """Generate TwiML for custom calls"""
    english_text = request.GET.get('english', 'This is an important message.')
    hindi_text = request.GET.get('hindi', 'यह एक महत्वपूर्ण संदेश है।')
    
    response = VoiceResponse()
    
    # First speak in Hindi
    response.say(hindi_text, voice="Polly.Aditi", language="hi-IN")
    response.pause(length=1)
    
    # Then speak in English
    response.say(english_text, voice="Polly.Raveena", language="en-IN")
    
    return HttpResponse(str(response), content_type='application/xml')


@csrf_exempt
def call_status_callback(request):
    """Handle call status callbacks from Twilio"""
    if request.method == 'POST':
        call_sid = request.POST.get('CallSid')
        call_status = request.POST.get('CallStatus')
        
        logger.info(f"Call {call_sid} status: {call_status}")
        
        # You can save this to database if needed
        # CallLog.objects.create(call_sid=call_sid, status=call_status)
    
    return HttpResponse(status=200)