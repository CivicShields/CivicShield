import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from .models import User
from .token_utils import create_token, verify_token
import uuid

def user_to_dict(user):
    return {
        'id': user.id,
        'email': user.email,
        'name': user.first_name,
        'role': user.role,
        'department_id': str(user.department_id),
        'phone': user.phone,
        'created_at': user.date_joined.isoformat(),
        'updated_at': user.last_login.isoformat() if user.last_login else None,
    }

@csrf_exempt
def register(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
    except:
        data = request.POST
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', '')
    if not email or not password:
        return JsonResponse({'error': 'email and password required'}, status=400)
    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'email already registered, use another email'}, status=400)
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name,
        role=data.get('role', 'normal_user'),
        department_id=data.get('department_id'),
        phone=data.get('phone')
    )
    return JsonResponse(user_to_dict(user), status=201)

@csrf_exempt
def logout(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'no token provided'}, status=400)
    payload = verify_token(token)
    if not payload:
        return JsonResponse({'error': 'invalid token'}, status=401)
    response = JsonResponse({'message': 'logged out'})
    response.set_cookie(
        'auth_token',
        '',
        httponly=True,
        secure=False,          
        samesite='Strict',
        max_age=0,            
    )
    return response

@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
    except:
        data = request.POST
        
    email = data.get('email')
    password = data.get('password')
    user = authenticate(request, username=email, password=password)

    if user:
        auth_token = create_token(user) 
        response = JsonResponse({ 
            'user': user_to_dict(user)
        })
        response.set_cookie(
            key='auth_token',
            value=auth_token,
            httponly=True,        # Block client-side JavaScript access (XSS defense)
            secure=False,         # Change to True in production (forces HTTPS)
            samesite='Lax',       # Protection against CSRF attacks
            max_age=3600*4 ,        # valid for four hours
        )
        return response
        
    return JsonResponse({'error': 'Invalid email or password'}, status=401)

@csrf_exempt
def change_password(request):
    if request.method != 'PATCH':
        return JsonResponse({'error': 'PATCH required'}, status=405)
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'}, status=401)
    payload = verify_token(token)
    if not payload:
        return JsonResponse({'error': 'invalid token'}, status=401)
    user = User.objects.filter(id=payload['user_id']).first()
    if not user:
        return JsonResponse({'error': 'user not found'}, status=404)
    try:
        data = json.loads(request.body)
    except:
        data = request.POST
    old_pw = data.get('old_password')
    new_pw = data.get('new_password')
    if not user.check_password(old_pw):
        return JsonResponse({'error': 'wrong old password'}, status=400)
    if user.check_password(old_pw) and old_pw == new_pw:
        return JsonResponse({'error': 'new password cannot be the same as old one'})
    user.set_password(new_pw)
    user.save()
    return JsonResponse({'message': 'password changed'})

def me(request):
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'}, status=401)
    payload = verify_token(token)
    if not payload:
        return JsonResponse({'error': 'invalid token'}, status=401)
    user = User.objects.filter(id=payload['user_id']).first()
    if not user:
        return JsonResponse({'error': 'user not found'}, status=404)
    return JsonResponse({'user': user_to_dict(user)})

def list_users(request):
    # admin only
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'}, status=401)
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'}, status=403)
    users = User.objects.all()
    return JsonResponse({"success": True, "users": [user_to_dict(u) for u in users]}, safe=False)

@csrf_exempt
def update_role(request, user_id):
    if request.method != 'PATCH':
        return JsonResponse({'error': 'PATCH required'}, status=405)
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'}, status=401)
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'}, status=403)
    user = User.objects.filter(id=user_id).first()
    if not user:
        return JsonResponse({'error': 'user not found'}, status=404)
    try:
        data = json.loads(request.body)
    except:
        data = request.POST
    new_role = data.get('role')
    if new_role not in dict(User.ROLE_CHOICES):
        return JsonResponse({'error': 'invalid role'}, status=400)
    user.role = new_role
    user.save()
    return JsonResponse(user_to_dict(user))

@csrf_exempt
def delete_user(request, user_id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'DELETE required'}, status=405)
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'}, status=401)
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'}, status=403)
    User.objects.filter(id=user_id).delete()
    return JsonResponse({'message': 'deleted'})


@csrf_exempt
def update_user_department(request, user_id):
    if request.method != 'PATCH':
        return JsonResponse({'error': 'PATCH required'}, status=405)
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'}, status=401)
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'}, status=403)
    try:
        user = User.objects.filter(id=user_id).first()
        if not user:
            return JsonResponse({'error': 'user not found'}, status=404)
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'invalid JSON'}, status=400)

    department_id = data.get('department_id')
    if not department_id:
        return JsonResponse({"error": "Give valid departmen_id"})
    user.department_id = department_id
    user.role = "department_user"
    user.save()
    return JsonResponse({
        'success': True,
        'user': user_to_dict(user) 
    })
