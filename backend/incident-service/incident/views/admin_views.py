import json
import logging
from incident.models import Incident
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from core.authentication import login_required, verify_token
from incident.data import save_media, get_name
from .user_views import incident_to_dict

logger = logging.getLogger(__name__)


@csrf_exempt
@login_required
def admin_list_incidents(request):
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'})
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'})

    #getting incidents
    try:
        queryset = Incident.objects.all()
        if not queryset.exists():
            return JsonResponse({"error":"no incidents found"})
        incidents = []
        for inc in queryset:
            incidents.append(incident_to_dict(request, inc))
        return JsonResponse({"success":True, "incidents": incidents})
    
    except Exception as e:
        logger.exception("Error while fetching incidents")
        return JsonResponse({"error":"an error occurred while fetching incidents"})



@csrf_exempt
@login_required
def admin_remove_incidents(request, *args, **kwargs):
    
    #only DELETE method is allowed
    if request.method != "DELETE":
        return JsonResponse({"error":"only DELETE request is allowed"})
    
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'})
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'})
    
    #getting incident id from query params
    incident_id = kwargs.get("incident_id")
    if not incident_id:
        return JsonResponse({"error":"incident id is required"})
    
    #deleting incident
    try:
        incident = Incident.objects.get(id=incident_id)
        incident.delete()
        return JsonResponse({"success":True, "message":f"incident with id {incident_id} has been removed"})
    
    except Incident.DoesNotExist:
        return JsonResponse({"error":"incident not found"})
    
    except Exception as e:
        logger.exception("Error while removing incident")
        return JsonResponse({"error":"an error occurred while removing incident"})


@csrf_exempt
@login_required   
def admin_update_incident(request, *args, **kwargs):

    #only PATCH method is allowed
    if request.method != "PATCH":
        return JsonResponse({"error":"only PATCH request is allowed"})
    
    #getting incident id from query params
    incident_id = kwargs.get("incident_id")
    if not incident_id:
        return JsonResponse({"error":"incident id is required"})
    
    #getting and validating request body
    data = json.loads(request.body)
    severity = data.get("severity")
    status = data.get("status")
    #updating incident
    try:
        incident = Incident.objects.filter(id=incident_id).first()
        if severity:
            incident.severity = severity
            incident.save()
        if status:
            incident.status = status
            incident.save()
        return JsonResponse({"success":True, "message":f"incident with id {incident_id} has been updated"})
    
    except Incident.DoesNotExist:
        return JsonResponse({"error":"incident not found"})
    
    except Exception as e:
        logger.exception("Error while updating incident")
        return JsonResponse({"error":"an error occurred while updating incident"})

