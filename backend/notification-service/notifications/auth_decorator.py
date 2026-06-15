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
        token = request.COOKIES.get('auth_token')
        if not token:
            return JsonResponse({'error': 'unauthorized'})
        payload = verify_token(token)
        if not payload:
            return JsonResponse({'error': 'invalid token'})
        request.user_payload = payload
        return view_func(request, *args, **kwargs)
    return wrapper