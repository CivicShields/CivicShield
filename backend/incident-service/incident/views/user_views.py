import json
import logging
from incident.models import Incident
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from core.authentication import login_required
from incident.data import save_media, get_name, send_incident_creation_notification
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D

logger = logging.getLogger(__name__)


def incident_to_dict(request, inc):
    return {
        'id': inc.id,
        'reporter_id': inc.reporter_id,
        'department_id': inc.department_id,
        'category': inc.category,
        'severity': inc.severity,
        'status': inc.status,
        'title': inc.title,
        'media': inc.media,
        'description': inc.description,
        'location': inc.named_location,
        'created_at': inc.created_at.isoformat(),
        'updated_at': inc.updated_at.isoformat(),
    }


@csrf_exempt
@login_required
def create_incident(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Only POST method is allowed"})
    data = (request.POST)["metadata"]
    metadata_dict = json.loads(data)
    incident_coordinates = Point(metadata_dict['coordinates']['longitude'], metadata_dict['coordinates']['latitude'], srid=4326)

    inc = Incident.objects.create(
        reporter_id=request.user_payload['user_id'],
        department_id=metadata_dict['department'],
        category=metadata_dict['category'],
        description=metadata_dict['description'],
        named_location=metadata_dict['address'],
        coordinates=incident_coordinates,
        title=metadata_dict['incidentTitle'],
        severity=metadata_dict['severity'],
    )
    if not inc:
        return JsonResponse({"success": False, "error": "Incident not created and saved"})
    med = save_media(request, inc.id)
    if not med['success']: 
        return JsonResponse({"success": False, "error": "Error occurred while saving media"})
    inc.media = med["media_data"]["media_id"]
    inc.save()
    notif = send_incident_creation_notification(
            request, inc.id, inc.department_id, inc.reporter_id)
    if not notif['success']:
        return JsonResponse({"error": "Failed to send to notification"})
    return JsonResponse({"success":True, "report": incident_to_dict(request, inc), "message": "Successfully reported"})

@csrf_exempt
@login_required
def list_user_incidents(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method is allowed"})
    #getting user id from request
    user_id = request.user_payload['user_id']
    # Query the database for incidents reported by the user    
    try:
        incidents = Incident.objects.filter(reporter_id=user_id)
        if not incidents.exists():
            return JsonResponse({"success": True, "reports": []})
        first_dept_id = incidents.first().department_id
        name_data = get_name(request, first_dept_id)["data"]
        reports = []
        for inc in incidents:
            reports.append({
                "id": inc.id,
                "title": inc.title,
                "department_id": name_data["name"], 
                "category": inc.category,
                "severity": inc.severity,
                "status": inc.status,
                "description": inc.description,
                "named_location": inc.named_location,
                "reporter_id": inc.reporter_id,
                "created_at": inc.created_at.isoformat() if inc.created_at else None, # Clean date format
                "media": inc.media,
                "coordinates": {
                    "lat": inc.coordinates.y,  
                    "lon": inc.coordinates.x   
                }
            })

        return JsonResponse({"success": True, "reports": reports})
    except Exception as e:
        logger.exception("Error while fetching incidents for user_id=%s", user_id)
        return JsonResponse({"error": "An error occurred while fetching incidents"})


@login_required
def find_nearby_incidents(request):
    #Parse the user's input coordinates
    user_lat = float(request.GET.get('lat'))
    user_lon = float(request.GET.get('lon'))
    #Create a GeoDjango Point object 
    user_point = Point(user_lon, user_lat, srid=4326)
    user_id = request.user_payload['user_id']
    # Query the database using spatial lookups
    nearby = Incident.objects.filter(
        coordinates__distance_lte=(user_point, D(km=20))
    )
    results = [
        {
            "id": inc.id,
            "title": inc.title,
            "named_location": inc.named_location, 
            "coordinates": [inc.coordinates.y, inc.coordinates.x] # Returns [lat, lon]
        }
        for inc in nearby
    ]
    
    return JsonResponse({"success": True, 
                         "search_origin": {
                            "lat": user_lat,
                            "lon": user_lon,
                            "radius_km": 2.0
                        },
                         "incidents": results})
