import requests
from django.conf import settings
from django.http import JsonResponse


def save_media(request, incident_id, file):
    url = f"{settings.MEDIA_URL}/media/upload?incident_id={incident_id}&file={file}"

    try:
        response = requests.post(url, timeout=5)
        response.raise_for_status()
        media_data = response.json()
        return JsonResponse({'success': True, 'status': 'Media uploaded successfully', 'data': media_data})

    except requests.exceptions.Timeout:
        return JsonResponse({'success': False, 'error': 'Media service timed out'}, status=504)
        
    except requests.exceptions.HTTPError as err:
        return JsonResponse({'success': False, 'error': f'Media service error: {str(err)}'}, status=response.status_code)
        
    except requests.exceptions.RequestException:
        return JsonResponse({'success': False, 'error': 'Failed to connect to the Media service'}, status=503)

def get_media(request, media_id):
    url = f"{settings.MEDIA_URL}media/{media_id}"

    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        media_data = response.json()
        return JsonResponse({'success': True, 'status': 'Media successfully retrieved', 'data': media_data})

    except requests.exceptions.Timeout:
        return JsonResponse({'success': False, 'error': 'Media service timed out'}, status=504)
        
    except requests.exceptions.HTTPError as err:
        return JsonResponse({'success': False, 'error': f'Media service error: {str(err)}'}, status=response.status_code)
        
    except requests.exceptions.RequestException:
        return JsonResponse({'success': False, 'error': 'Failed to connect to the Media service'}, status=503)