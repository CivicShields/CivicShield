import requests
from django.conf import settings

def get_incidents(request, department_id):
    url = f"{settings.INCIDENT_URL}incident/department/{department_id}/"
    client_cookies = request.COOKIES   
    try:
        # pass the cookies forward into the internal microservice request
        response = requests.get(url, cookies=client_cookies, timeout=5)      
        response.raise_for_status()
        return {'success': True, 'status': 'Incidents retrieved successfully', 'data': response.json()['data']}

    except requests.exceptions.Timeout:
        raise Exception("Incident service timed out")
        
    except requests.exceptions.HTTPError as err:
        raise Exception(f"Incident service error: {str(err)}")
        
    except requests.exceptions.RequestException:
        raise Exception("Failed to connect to the Incident service")
    
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