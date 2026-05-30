from ..permissions import IsReporter
from ..models import Incident
from django.http import JsonResponse
from ..forms import IncidentForm
from django.core import serializers 
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

@csrf_exempt
def create_incident(request):
    # Only allow POST method
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)
    
    # Validate the form data
    form = IncidentForm(request.POST)
    if not form.is_valid():
        return JsonResponse({"error": "Invalid form data", "details": form.errors}, status=400)
    
    # create new incident object
    incident = form.save(commit=False)
    incident.reporter_id = request.user.id
    # Set the reporter_id to the authenticated user's ID
    data = incident.save()

    return JsonResponse({"suceess":True, "data":data}, status=201)


def list_incidents(request, *args, **kwargs):
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
        data = serializers.serialize("json", incidents)
        return JsonResponse({"success":True, "data":data}, status=200)

    except Exception as e:
        return JsonResponse({"error": "An error occurred while fetching incidents", "errors":f"{str(e)}"}, status=500)







