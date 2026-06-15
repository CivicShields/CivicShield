#views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Department, Assignment
from .auth_decorator import login_required, verify_token
from .data import get_incidents

def department_to_dict(dept):
    return {
        'id': dept.id,
        'name': dept.name,
        'contact_email': dept.contact_email,
        'contact_phone': dept.contact_phone,
        'created_at': dept.created_at.isoformat(),
        'updated_at': dept.updated_at.isoformat(),
    }


def assignment_to_dict(assgn):
    return {
        'id': assgn.id,
        'incident_id': str(assgn.incident_id),
        'department_id': str(assgn.department_id),
        'assigned_by': assgn.assigned_by,
        'assigned_at': assgn.assigned_at.isoformat(),
    }


# GET /departments/
@login_required
def list_departments(request):
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'})
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'})
    departments = Department.objects.all()
    return JsonResponse(
        {'success': True, 'departments': [department_to_dict(d) for d in departments]}, 
        safe=False)


@csrf_exempt
@login_required
def create_department(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'})

    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'})
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'})

    data = json.loads(request.body)

    name = data.get('name')
    email = data.get('contact_email')
    phone = data.get('contact_phone')
        
    if Department.objects.filter(contact_email=email).exists():
        return JsonResponse(
                {'error': 'A department with that email is already registered.'}
            )

    dept = Department.objects.create(
        name=name,
        contact_email=email,
        contact_phone=phone,
    )
    return JsonResponse({'success': True, 'department': department_to_dict(dept),"message": "Department successfully created"})


# GET /departments/<id>/
@csrf_exempt
@login_required
def get_department(request, department_id):
    dept = Department.objects.filter(id=department_id).first()
    if not dept:
        return JsonResponse({'error': 'department not found'})
    return JsonResponse({'success': True, 'department': department_to_dict(dept)})


@csrf_exempt
@login_required
def update_department(request, department_id):
    if request.method != 'PATCH':
        return JsonResponse({'error': 'PATCH required'})

    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'})
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'})
    
    dept = Department.objects.filter(id=department_id).first()
    if not dept:
        return JsonResponse({'success': False, '': 'department not found'})

    data = json.loads(request.body)
  
    name = data.get('name')
    email = data.get('contact_email')
    phone = data.get('contact_phone')

    if name:
        dept.name = data.get('name')
        dept.save()
    if 'contact_email' in data:
        dept.contact_email = data['contact_email']
    if 'contact_phone' in data:
        dept.contact_phone = data['contact_phone']
    dept.save()
    return JsonResponse({'success': True, 'department': department_to_dict(dept), "message": "Department has been successfully updated"})

@csrf_exempt
@login_required
def get_depart_names(request):
    # Returns only unique names, ignoring duplicates
    depart_list = list(Department.objects.values('id', 'name').distinct())
    return JsonResponse({'success': True, 'list': depart_list}, safe=False)


# DELETE /departments/<id>/   (admin only)
@csrf_exempt
@login_required
def delete_department(request, department_id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'DELETE required'})

    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'})
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'})

    Department.objects.filter(id=department_id).delete()
    return JsonResponse({'success': True, 'message': 'Department successfully deleted'})


# GET /departments/<id>/incidents/
@csrf_exempt
@login_required
def department_incidents(request, department_id):
    dept = Department.objects.filter(id=department_id).first()
    if not dept:
        return JsonResponse({'success': False, 'error': 'department not found'})
    incidents = get_incidents(request, department_id)
    if not incidents['success']:
        return JsonResponse({"success": False, "error": "Failed to load department data " })
      
    assignments = Assignment.objects.filter(department=department_id).order_by('-assigned_at')
    return JsonResponse({'success': True, "message": incidents['status'], 'incidents': incidents['data']}, safe=False)


@csrf_exempt
@login_required
def assign_incident(request, id, incident_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'})

    dept = Department.objects.filter(id=id).first()
    if not dept:
        return JsonResponse({'success': False, 'error': 'department not found'})

    if Assignment.objects.filter(department_id=id, incident_id=incident_id).exists():
        return JsonResponse({'success': False, 'error': 'incident already assigned to this department'})

    assignment = Assignment.objects.create(
        incident_id=incident_id,
        department=dept,
        assigned_by=request.user_payload['user_id']
    )
    return JsonResponse({'success': True, 'assignment': assignment_to_dict(assignment), "message": "incident successfully assigned"})