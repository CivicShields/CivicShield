import json
import logging
from incident.models import Incident
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from core.authentication import login_required
from incident.data import get_media, save_media, get_name
from .user_views import incident_to_dict

logger = logging.getLogger(__name__)

@csrf_exempt
@login_required
def list_dept_incidents(request, *args, **kwargs):
    #only GET method allowed
    if request.method != "GET":
        return JsonResponse({"error":"Only GET requests are allowed"}, status=400)
    #getting id from query params
    dept_id = kwargs.get("department_id")
    if not dept_id:
        return JsonResponse({"error": "Department ID is required"}, status=400)
    
    try:
        incidents = Incident.objects.filter(department_id=dept_id)
        
        data = list(incidents.values("id", "reporter_id", "category","severity", "status", "description", "named_location"))
        return JsonResponse({"success":True, "data":data}, status=200)
    except Exception:
        logger.exception("Error occurred while fetching incidents")
        return JsonResponse({"error": "An error occurred while fetching incidents"}, status=500)
    


@csrf_exempt
@login_required
def update_status(request, *args, **kwargs):
    #only PATCH request accepted
    if request. method != "PATCH":
        return JsonResponse({"error": "Only PATCH method is allowed"}, status=405)
    #getting status data
    ALLOWED_STATUSES = ["pending", "in_progress", "resolved"]   
    try:
        data = json.loads(request.body)
        status = data.get("status")
        if not status or status not in ALLOWED_STATUSES:
            return JsonResponse({"error": f"Status is required and must be one of {ALLOWED_STATUSES}"}, status=400)
        
        #getting incident id from query params
        incident_id = kwargs.get("id")
        if not incident_id:
            return JsonResponse({"error": "Incident ID is required"}, status=400)
        
        #updating incident status
        incident = Incident.objects.get(id=incident_id)
        incident.status = status
        incident.save()
        return JsonResponse({"success":True, "message": f"Incident status updated to {status}"}, status=200)
    
    except Incident.DoesNotExist:
        return JsonResponse({"error": "Incident not found"}, status=404)
    except Exception:
        return JsonResponse({"error": "An error occurred while updating incident status"}, status=500)

