import json
import logging
from incident.models import Incident
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from core.authentication import login_required
from incident.data import send_incident_update_notification

logger = logging.getLogger(__name__)

@csrf_exempt
@login_required
def list_dept_incidents(request, *args, **kwargs):
    #only GET method allowed
    if request.method != "GET":
        return JsonResponse({"error":"Only GET requests are allowed"})
    #getting id from query params
    dept_id = kwargs.get("department_id")
    if not dept_id:
        return JsonResponse({"error": "Department ID is required"})
    
    try:
        incidents = Incident.objects.filter(department_id=dept_id)
        reports = []
        for inc in incidents:
            reports.append({
                "id": inc.id,
                "title": inc.title,
                "department_id": inc.department_id, 
                "category": inc.category,
                "severity": inc.severity,
                "status": inc.status,
                "description": inc.description,
                "named_location": inc.named_location,
                "reporter_id": inc.reporter_id,
                "created_at": inc.created_at.isoformat() if inc.created_at else None, # Clean date format
                "media": inc.media,
            })
        
        return JsonResponse({"success":True, "data": reports})
    except Exception:
        logger.exception("Error occurred while fetching incidents")
        return JsonResponse({"error": "An error occurred while fetching incidents"})
    


@csrf_exempt
@login_required
def update_status(request, *args, **kwargs):
    #only PATCH request accepted
    if request. method != "PATCH":
        return JsonResponse({"error": "Only PATCH method is allowed"})
    #getting status data
    ALLOWED_STATUSES = ["pending", "in_progress", "resolved"]   
    try:
        incident_id = kwargs.get("incident_id")
        if not incident_id:
            return JsonResponse({"error": "Incident ID is required"})
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST
            
        status = data.get("status")
        if not status or status not in ALLOWED_STATUSES:
            return JsonResponse({"error": f"Status is required and must be one of {ALLOWED_STATUSES}"})
                
        #updating incident status
        incident = Incident.objects.filter(id=incident_id).first()
        incident.status = status
        incident.save()
        notif = send_incident_update_notification(
            request, incident_id, incident.department_id, incident.reporter_id, status)
        if not notif['success']:
            return JsonResponse({"error": "Failed to send to notification"})
        return JsonResponse({"success":True, "message": f"Incident status updated to {status}"})
    
    except Incident.DoesNotExist:
        return JsonResponse({"error": "Incident not found"})
    except Exception:
        return JsonResponse({"error": "An error occurred while updating incident status"})

