from django.conf import settings
from django.http import JsonResponse
import jwt

def verify_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def login_required(view_func):
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Unauthorized attempt'}, status=401)
        payload = verify_token(auth_header[7:])
        if not payload:
            return JsonResponse({'error': 'invalid token'}, status=401)
        request.user_payload = payload
        return view_func(request, *args, **kwargs)
    return wrapper