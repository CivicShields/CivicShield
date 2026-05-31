import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from .models import Department
from .auth_decorator import login_required


@csrf_exempt
@login_required
def get_depart_list():
    departments = list(
        Department.objects.values('id', 'name', 'email', 'phone')
    )
    return JsonResponse({'success': True, 'departments': departments}, status=200)


@csrf_exempt
@login_required
def create_depart(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    if not data.get('name') or not data.get('email'):
        return JsonResponse({'error': 'name and email are required'}, status=400)

    dept = Department.objects.create(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone', ''),
    )
    return JsonResponse({
        'success': True,
        'department': {
            'id': dept.id,
            'name': dept.name,
            'email': dept.email,
            'phone': dept.phone
        }
    }, status=201)


@csrf_exempt
@login_required
def get_depart(dept_id):
    try:
        dept = Department.objects.get(id=dept_id)
    except Department.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    return JsonResponse({
        'success': True,
        'department': {
            'id': dept.id,
            'name': dept.name,
            'email': dept.email,
            'phone': dept.phone
        }
    })

@csrf_exempt
@login_required
def update_depart(request, dept_id):
    if request.method != 'PATCH':
        return JsonResponse({'error': 'PATCH required'}, status=405)
    try:
        dept = Department.objects.get(id=dept_id)
    except Department.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    data = json.loads(request.body)
    dept.name = data.get('name', dept.name)
    dept.email = data.get('email', dept.email)
    dept.phone = data.get('phone', dept.phone)
    dept.save()

    return JsonResponse({'id': dept.id, 'name': dept.name, 'email': dept.email})

@csrf_exempt
@login_required
def delete_depart(request, dept_id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'DELETE required'}, status=405)
    try:
        dept = Department.objects.get(id=dept_id)
    except Department.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    dept.delete()
    return JsonResponse({'message': 'Deleted successfully'})