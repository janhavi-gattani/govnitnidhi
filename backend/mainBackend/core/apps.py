# from django.apps import AppConfig


# class CoreConfig(AppConfig):
#     name = 'core'




# core/apps.py

from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    
    def ready(self):
        # Initialize Twilio service when Django starts
        try:
            from .twilio_service import twilio_service
            print(f"Twilio service initialized: {twilio_service.client is not None}")
        except Exception as e:
            print(f"Failed to initialize Twilio service: {e}")