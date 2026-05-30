from django.http import JsonResponse
from ..models import Incident
from ..permissions import IsDepartment
from django.core import serializers 


def list_incidents(request, *args, **kwargs):

    #getting id from query params
    dept_id = kwargs.get("id")
    if not dept_id:
        return JsonResponse({"error": "Department ID is required"}, status=400)
    
    #getting and serializing incident data
    try:
        incidents = Incident.objects.filter(department_id=dept_id)
        data = serializers.serialize("json", incidents)
        return JsonResponse({"success":True, "data":data}, status=200)
    except Exception as e:
        return JsonResponse({"error": "An error occurred while fetching incidents", "errors":f"{str(e)}"}, status=500)
    

def update_status(request, *args, **kwargs):

    #only PATCH request accepted
    if request. method != "PATCH":
        return JsonResponse({"error": "Only PATCH method is allowed"}, status=405)
    
    #getting status data
    ALLOWED_STATUSES = ["in_progress", "resolved"]
    status = request.OST.get("status")
    if not status or status not in ALLOWED_STATUSES:
        return JsonResponse({"error": f"Status is required and must be one of {ALLOWED_STATUSES}"}, status=400)
    
    #getting incident id from query params
    incident_id = kwargs.get("id")
    if not incident_id:
        return JsonResponse({"error": "Incident ID is required"}, status=400)
    
    #updating incident status
    try:
        incident = Incident.objects.get(id=incident_id)
        incident.status = status
        incident.save()
        return JsonResponse({"success":True, "message": f"Incident status updated to {status}"}, status=200)
    except Incident.DoesNotExist:
        return JsonResponse({"error": "Incident not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": "An error occurred while updating incident status", "errors":f"{str(e)}"}, status=500)
    
