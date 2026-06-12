import requests
from django.conf import settings
from django.http import JsonResponse


def save_media(request, incident_id):
    url = f"{settings.MEDIA_URL}/media/upload/"
    uploaded_file = request.FILES.get('file')
    
    if not uploaded_file:
        return JsonResponse({'error': 'No file was provided in the request'}, status=400)
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
        if response.status_code == 201:
            media_data = response.json()
            return {'success': True, 'status': 'Media uploaded successfully', 'media_data': media_data}
        else:
            return JsonResponse({'error': 'Media service rejected the upload', 'details': response.json()}, status=response.status_code)
            
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': f'Failed to connect to Media Service: {str(e)}'}, status=503)


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