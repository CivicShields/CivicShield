import logging
import requests
from django.conf import settings
from django.http import JsonResponse

logger = logging.getLogger(__name__)


def save_media(request, incident_id):
    url = f"{settings.MEDIA_URL}/media/upload/"
    uploaded_file = request.FILES.get('file')
    
    if not uploaded_file:
        return JsonResponse({'error': 'No file was provided in the request'})
    data_payload = {
        'incident_id': incident_id
    }
    # This maps directly to request.FILES to the Media Service
    files_payload = {
        'file': (uploaded_file.name, uploaded_file.read(), uploaded_file.content_type)
    }
    client_cookies = request.COOKIES 
    try:
        # Execute the POST request using multipart form-data
        response = requests.post(
            url, 
            data=data_payload,    # Becomes request.POST downstream
            files=files_payload,  # Becomes request.FILES downstream
            cookies=client_cookies, 
            timeout=5
        )
        if response.status_code == 200:
            media_data = response.json()
            return {'success': True, 'status': 'Media uploaded successfully', 'media_data': media_data}
        else:
            return {'error': 'Media service rejected the upload', 'details': response.json()}
            
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': f'Failed to connect to Media Service: {str(e)}'})


def get_media(request, media_id):
    url = f"{settings.MEDIA_URL}media/{media_id}/"
    client_cookies = request.COOKIES   
    try:
        # pass the cookies forward into the internal microservice request
        response = requests.get(url, cookies=client_cookies, timeout=5)      
        response.raise_for_status()
        return JsonResponse({'success': True, 'status': 'Media retrieved successfully', 'data': response.json()})

    except requests.exceptions.Timeout:
        raise Exception("Media service timed out")
        
    except requests.exceptions.HTTPError as err:
        raise Exception(f"Media service error: {str(err)}")
        
    except requests.exceptions.RequestException:
        raise Exception("Failed to connect to the Media service")
    
def get_name(request, department_id):
    url = f"{settings.DEPARTMENT_URL}departments/{department_id}/"
    client_cookies = request.COOKIES   
    try:
        # pass the cookies forward into the internal microservice request
        response = requests.get(url, cookies=client_cookies, timeout=5)      
        response.raise_for_status()
        return {'success': True, 'status': 'Department name retrieved successfully', 'data': response.json()["department"]}

    except requests.exceptions.Timeout:
        raise Exception("Department service timed out")
        
    except requests.exceptions.HTTPError as err:
        raise Exception(f"Department service error: {str(err)}")
        
    except requests.exceptions.RequestException:
        raise Exception("Failed to connect to the Department service")
    
def send_incident_creation_notification(request, incident_id,  department_id, reporter_id):
    url = f"{settings.NOTIFICATION_URL}/notifications/internal/incident-created/"
    
    data_payload = {
        'incident_id': incident_id,
        "department_id": department_id,
        "reporter_id": reporter_id,
    }
  
    client_cookies = request.COOKIES 
    try:
        # Execute the POST request using multipart form-data
        response = requests.post(
            url, 
            data=data_payload,    # Becomes request.POST downstream
            cookies=client_cookies, 
            timeout=5
        )
        if response.json()['success']:
            message_data = response.json()
            return {'success': True, 'status': 'Notification sent successfully', 'notification': message_data}
        else:
            return JsonResponse({'error': 'Notification service failed to send notifications ', 'details': response.json()})
            
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': f'Failed to connect to Notification Service: {str(e)}'})

def send_incident_update_notification(request, incident_id,  department_id, reporter_id, status):
    url = f"{settings.NOTIFICATION_URL}/notifications/internal/status-update/"
    
    data_payload = {
        'incident_id': incident_id,
        "department_id": department_id,
        "reporter_id": reporter_id,
        "status": status,
    }
  
    client_cookies = request.COOKIES 
    try:
        # Execute the POST request using multipart form-data
        response = requests.post(
            url, 
            data=data_payload,    # Becomes request.POST downstream
            cookies=client_cookies, 
            timeout=5
        )
        if response.json()['success']:
            message_data = response.json()
            return {'success': True, 'status': 'Notification sent successfully', 'notification': message_data}
        else:
            return JsonResponse({'error': 'Notification service failed to send notifications ', 'details': response.json()})
            
    except requests.exceptions.RequestException:
        logger.exception("Failed to connect to Notification Service")
        return JsonResponse({'error': 'Failed to connect to Notification Service'})
