import logging
from .models import Incident
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from core.authentication import login_required
from incident.data import get_media, save_media
from django.core import serializers
import json
import ast

logger = logging.getLogger(__name__)

def incident_to_dict(inc):
    return {
        'id': inc.id,
        'reporter_id': inc.reporter_id,
        'department_id': inc.department_id,
        'category': inc.category,
        'severity': inc.severity,
        'status': inc.status,
        'title': inc.title,
        'description': inc.description,
        'location': inc.location,
        'created_at': inc.created_at.isoformat(),
        'updated_at': inc.updated_at.isoformat(),
    }


@csrf_exempt
@login_required
def create_incident(request):
    # Only allow POST method
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Only POST method is allowed"}, status=405)
    data = (request.POST)["metadata"]
    metadata_dict = json.loads(data)

    inc = Incident.objects.create(
        reporter_id=request.user_payload['user_id'],
        department_id=metadata_dict['department'],
        category=metadata_dict['category'],
        description=metadata_dict['description'],
        location=metadata_dict['location'],
        title=metadata_dict['incidentTitle'],
    )
    if not inc:
        return JsonResponse({"success": False, "error": "Incident not created and saved"})
    inc.save()
    med = save_media(request, inc.id)
    if not med['success']: 
        return JsonResponse({"success": False, "error": "Error occurred while saving media"})
    return JsonResponse({"success":True, "report": incident_to_dict(inc), "message": "Successfully reported"}, status=201)

@csrf_exempt
@login_required
def list_user_incidents(request, *args, **kwargs):
    # Only allow GET method
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=405)
    #getting user id from url parameters
    user_id = kwargs.get("id")
    if user_id is None:
        return JsonResponse({"error": "User ID is required"}, status=400)
    
    # Query the database for incidents reported by the user and perfoming serialization    
    try:
        incidents = Incident.objects.filter(reporter_id=user_id)
        data = list(incidents.values("id", "department_id", "category", "severity", "status", "description", "location"))
        return JsonResponse({"success":True, "data":data}, status=200)

    except Exception as e:
        logger.exception("Error while fetching incidents for user_id=%s", user_id)
        return JsonResponse({"error": "An error occurred while fetching incidents"}, status=500)


@csrf_exempt
@login_required
def admin_list_incidents(request):

    #only POST method is allowed
    if request.method != "POST":
        return JsonResponse({"error":"only POST request is allowed"}, status=400)
    
    #getting and validating request body
    data = json.loads(request.body)
    med = get_media(request, media_id="c1df42c1-b725-488d-bb5f-3614eb30320e")
    print(med)
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
    
        #serializing data
        data = serializers.serialize("json", queryset)
        return JsonResponse({"success":True, "data":data}, status=200)
    
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


@csrf_exempt
@login_required
def list_dept_incidents(request, *args, **kwargs):
    #only GET method allowed
    if request.method != "GET":
        return JsonResponse({"error":"Only GET requests are allowed"}, status=400)
    #getting id from query params
    dept_id = kwargs.get("id")
    if not dept_id:
        return JsonResponse({"error": "Department ID is required"}, status=400)
    
    #getting and serializing incident data
    try:
        incidents = Incident.objects.filter(department_id=dept_id)
        data = list(incidents.values("id", "reporter_id", "category","severity", "status", "description", "location"))
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
        print(request.body)
        data = json.loads(request.body)
        status = data.get("status")
        print(status)
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
