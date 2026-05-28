from django.http import JsonResponse
from ..models import Incident
from ..permissions import IsDepartment
from django.core import serializers 


def list_incidents(request, *args, **kwargs):

    #getting id from query params
    dept_id = kwargs.get("id")
    if not dept_id:
        return JsonResponse({"error": "Department ID is required"}, status=400)
    try:
        incidents = Incident.objects.filter(department_id=dept_id)
        data = serializers.serialize("json", incidents)
        return JsonResponse({"success":True, "data":data}, status=200)
    except Exception as e:
        return JsonResponse({"error": "An error occurred while fetching incidents", "errors":f"{str(e)}"}, status=500)