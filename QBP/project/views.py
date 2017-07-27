from django.core.mail import EmailMessage
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.views.decorators.http import require_POST
from django.http import HttpResponse
from project.email_templates import *

import logging
# Set log format
log = logging.getLogger(__name__)

@require_POST
def send_mail(request):
    try:
        validate_email(request.POST.get("email"))
        email = EmailMessage(
                    subject=mail_text_header,
                    body=mail_text_body % (request.POST.get("name"), request.POST.get("message")),
                    from_email='noreply@quantum-bytes.com',
                    to=['contact@quantum-bytes.com',],
                    reply_to=[request.POST.get("email"),]
                )
        email.send()

        return HttpResponse("success")
    except ValidationError:
        return HttpResponse("invalid")
    except Exception as e:
        log.exception(e)
        return HttpResponse("error")
