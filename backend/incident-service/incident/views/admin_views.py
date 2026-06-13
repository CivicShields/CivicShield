import json
import logging
from incident.models import Incident
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from core.authentication import login_required
from incident.data import save_media, get_name
from .user_views import incident_to_dict

logger = logging.getLogger(__name__)


@csrf_exempt
@login_required
def admin_list_incidents(request):
    if request.method != "POST":
        return JsonResponse({"error":"only POST request is allowed"}, status=400)
    
    #getting and validating request body
    data = json.loads(request.body)
    department = data.get("department")
    severity = data.get("severity")
    status = data.get("status")

    ALLOWED_SEVERITY = ["low", "medium", "high", "urgent"]
    ALLOWED_STATUS = ["pending", "in_progress", "resolved"]

    if not severity or not status or not department:
        return JsonResponse({"error":"department id, severity and status required"}, status=400)
    
    if severity not in ALLOWED_SEVERITY:
        return JsonResponse({"error":"unknown severity provided"})
    
    if status not in ALLOWED_STATUS:
        return JsonResponse({"error":"unknown status provided"})

    #getting incidents
    try:
        queryset = Incident.objects.filter(department_id = department, severity=severity, status=status)

        if not queryset.exists():
            return JsonResponse({"error":"no incidents found"}, status=404)
    
        return JsonResponse({"success":True, "reports": incident_to_dict(queryset)}, status=200)
    
    except Exception as e:
        logger.exception("Error while fetching incidents")
        return JsonResponse({"error":"an error occurred while fetching incidents"}, status=500)




@login_required
def admin_remove_incidents(request, *args, **kwargs):
    
    #only DELETE method is allowed
    if request.method != "DELETE":
        return JsonResponse({"error":"only DELETE request is allowed"}, status=400)
    
    #getting incident id from query params
    incident_id = kwargs.get("id")
    if not incident_id:
        return JsonResponse({"error":"incident id is required"}, status=400)
    
    #deleting incident
    try:
        incident = Incident.objects.get(id=incident_id)
        incident.delete()
        return JsonResponse({"success":True, "message":f"incident with id {incident_id} has been removed"}, status=200)
    
    except Incident.DoesNotExist:
        return JsonResponse({"error":"incident not found"}, status=404)
    
    except Exception as e:
        logger.exception("Error while removing incident")
        return JsonResponse({"error":"an error occurred while removing incident"}, status=500)


@login_required   
def admin_update_incident(request, *args, **kwargs):

    #only PATCH method is allowed
    if request.method != "PATCH":
        return JsonResponse({"error":"only PATCH request is allowed"}, status=400)
    
    #getting incident id from query params
    incident_id = kwargs.get("id")
    if not incident_id:
        return JsonResponse({"error":"incident id is required"}, status=400)
    
    #getting and validating request body
    severity = request.POST.get("severity")
    status = request.POST.get("status")

    ALLOWED_SEVERITY = ["Low", "Medium", "High", "Urgent"]
    ALLOWED_STATUS = ["pending", "in_progress", "resolved"]

    if severity and severity not in ALLOWED_SEVERITY:
        return JsonResponse({"error":"unknown severity provided"})
    
    if status and status not in ALLOWED_STATUS:
        return JsonResponse({"error":"unknown status provided"})

    #updating incident
    try:
        incident = Incident.objects.get(id=incident_id)
        if severity:
            incident.severity = severity 
        if status:
            incident.status = status
        incident.save()
        return JsonResponse({"success":True, "message":f"incident with id {incident_id} has been updated"}, status=200)
    
    except Incident.DoesNotExist:
        return JsonResponse({"error":"incident not found"}, status=404)
    
    except Exception as e:
        logger.exception("Error while updating incident")
        return JsonResponse({"error":"an error occurred while updating incident"}, status=500)

