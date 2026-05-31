from django.http import JsonResponse
from ..models import Incident
from django.core import serializers

def admin_list_incidents(request, *args, **kwargs):

    #only POST method is allowed
    if request.method != "POST":
        return JsonResponse({"error":"only POST request is allowed"}, status=400)
    
    #getting and validating request body
    department = request.POST.get("department")
    severity = request.POST.get("severity")
    status = request.POST.get("status")

    ALLOWED_SEVERITY = ["Low", "Medium", "High", "Urgent"]
    ALLOWED_STATUS = ["pending", "in_progress", "resolved"]

    if not severity or not status or not department:
        return JsonResponse({"error":"department id, severity and status required"}, status=400)
    
    if severity not in ALLOWED_SEVERITY:
        return JsonResponse({"error":"unknown severity provided"})
    
    if status not in ALLOWED_STATUS:
        return JsonResponse({"error":"unknown status provided"})

    #getting incidents
    try:
        queryset = Incidents.objects.filter(department_id = department, severity=severity, status=status)

        if not queryset.exists():
            return JsonResponse({"error":"no incidents found"}, status=404)
    
        #serializing data
        data = serializers.serialize("json", queryset)
        return JsonResponse({"success":True, "data":data}, status=200)
    
    except Exception as e:
        return JsonResponse({"error":"an error occurred while fetching incidents", "errors":f"{str(e)}"}, status=500)


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
        incident = Incidents.objects.get(id=incident_id)
        incident.delete()
        return JsonResponse({"success":True, "message":f"incident with id {incident_id} has been removed"}, status=200)
    
    except Incidents.DoesNotExist:
        return JsonResponse({"error":"incident not found"}, status=404)
    
    except Exception as e:
        return JsonResponse({"error":"an error occurred while removing incident", "errors":f"{str(e)}"}, status=500)

    
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
        incident = Incidents.objects.get(id=incident_id)

        if severity:
            incident.severity = severity
        
        if status:
            incident.status = status
        
        incident.save()
        return JsonResponse({"success":True, "message":f"incident with id {incident_id} has been updated"}, status=200)
    
    except Incidents.DoesNotExist:
        return JsonResponse({"error":"incident not found"}, status=404)
    
    except Exception as e:
        return JsonResponse({"error":"an error occurred while updating incident", "errors":f"{str(e)}"}, status=500)
