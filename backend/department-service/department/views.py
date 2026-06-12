#views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Department, Assignment
from .auth_decorator import login_required

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
        'incident_id': assgn.incident_id,
        'department_id': assgn.department_id,
        'assigned_by': assgn.assigned_by,
        'assigned_at': assgn.assigned_at.isoformat(),
    }


# GET /departments/
@login_required
def list_departments(request):
    departments = Department.objects.all()
    return JsonResponse(
        {'success': True, 'departments': [department_to_dict(d) for d in departments]}, 
        safe=False)


@csrf_exempt
@login_required
def create_department(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    if request.user_payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'}, status=403)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        data = request.POST

    name = data.get('name')
    email = data.get('contact_email')
    phone = data.get('contact_phone')
    #removing phone due to testing purposes
    if not name or not email:
        return JsonResponse({'success': False, 
                             'error': 'name and contact_email required'}, 
                            status=400)
        
    if Department.objects.filter(name=name).exists() or Department.objects.filter(name=email).exists():
            return JsonResponse(
                {'success': False, 'error': 'A department with that name or email is already registered.'}, 
                status=400
            )

    dept = Department.objects.create(
        name=name,
        contact_email=email,
        contact_phone=phone,
    )
    return JsonResponse({'success': True, 'department': department_to_dict(dept)}, status=201)


# GET /departments/<id>/
@csrf_exempt
@login_required
def get_department(request, department_id):
    dept = Department.objects.filter(id=department_id).first()
    if not dept:
        return JsonResponse({'error': 'department not found'}, status=404)
    return JsonResponse({'success': True, 'department': department_to_dict(dept)})


@csrf_exempt
@login_required
def update_department(request, id):
    if request.method != 'PATCH':
        return JsonResponse({'error': 'PATCH required'}, status=405)

    if request.user_payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'}, status=403)

    dept = Department.objects.filter(id=id).first()
    if not dept:
        return JsonResponse({'success': False, '': 'department not found'}, status=404)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        data = request.POST

    if 'name' in data:
        dept.name = data['name']
    if 'contact_email' in data:
        dept.contact_email = data['contact_email']
    if 'contact_phone' in data:
        dept.contact_phone = data['contact_phone']
    dept.save()
    return JsonResponse({'success': True, 'department': department_to_dict(dept)})

@csrf_exempt
@login_required
def get_depart_names(request):
    # Returns only unique names, ignoring duplicates
    depart_list = list(Department.objects.values('id', 'name').distinct())
    return JsonResponse({'success': True, 'list': depart_list}, safe=False)


# DELETE /departments/<id>/   (admin only)
@csrf_exempt
@login_required
def delete_department(request, id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'DELETE required'}, status=405)

    if request.user_payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'}, status=403)

    Department.objects.filter(id=id).delete()
    return JsonResponse({'success': True, 'message': 'deleted'})


# GET /departments/<id>/incidents/
@csrf_exempt
@login_required
def department_incidents(request, id):
    dept = Department.objects.filter(id=id).first()
    if not dept:
        return JsonResponse({'success': False, 'error': 'department not found'}, status=404)
    assignments = Assignment.objects.filter(department_id=id).order_by('-assigned_at')
    return JsonResponse({'success': True, 'incidents': [assignment_to_dict(a) for a in assignments]}, safe=False)


@csrf_exempt
@login_required
def assign_incident(request, id, incident_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    dept = Department.objects.filter(id=id).first()
    if not dept:
        return JsonResponse({'success': False, 'error': 'department not found'}, status=404)

    if Assignment.objects.filter(department_id=id, incident_id=incident_id).exists():
        return JsonResponse({'success': False, 'error': 'incident already assigned to this department'}, status=409)

    assignment = Assignment.objects.create(
        incident_id=incident_id,
        department=dept,
        assigned_by=request.user_payload['user_id']
    )
    return JsonResponse({'success': True, 'assignment': assignment_to_dict(assignment)}, status=201)