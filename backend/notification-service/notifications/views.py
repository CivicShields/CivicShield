from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import models as django_models
from .models import Notification, Escalation
from .auth_decorator import login_required, verify_token
import json


# GET /notifications/ - for current user (includes personal + department notifications)
@login_required
def my_notifications(request):
    user_id = request.user_payload['user_id']
    department_id = request.user_payload.get('department_id')  # may be None
    
    # Build query: notifications where user_id matches OR department_id matches
    query = django_models.Q(user_id=user_id)
    if department_id:
        query |= django_models.Q(department_id=department_id)
    
    notifications = Notification.objects.filter(query).order_by('-created_at')
    
    data = []
    for n in notifications:
        data.append({
            'id': str(n.id),
            'user_id': n.user_id,
            'department_id': n.department_id,
            'incident_id': n.incident_id,
            'type': n.type,
            'message': n.message,
            'is_read': n.is_read,
            'created_at': n.created_at.isoformat(),
        })
    return JsonResponse(data, safe=False)


# GET /notifications/department/<department_id>/ - admin only
@login_required
def department_notifications(request, department_id):
    # Check admin role
    if request.user_payload.get('role') != 'admin':
        return JsonResponse({'error': 'forbidden'}, status=403)
    
    notifications = Notification.objects.filter(department_id=department_id).order_by('-created_at')
    data = [{
        'id': str(n.id),
        'user_id': n.user_id,
        'department_id': n.department_id,
        'incident_id': n.incident_id,
        'type': n.type,
        'message': n.message,
        'is_read': n.is_read,
        'created_at': n.created_at.isoformat(),
    } for n in notifications]
    return JsonResponse(data, safe=False)


# PATCH /notifications/<id>/read/
@csrf_exempt
@login_required
def mark_as_read(request, id):
    if request.method != 'PATCH':
        return JsonResponse({'error': 'PATCH required'}, status=405)
    
    notification = Notification.objects.get(id=id)
    # Optional: verify that the user is allowed to mark this as read
    user_id = request.user_payload['user_id']
    dept_id = request.user_payload.get('department_id')
    if notification.user_id != user_id and notification.department_id != dept_id:
        return JsonResponse({'error': 'Not authorized'}, status=403)
    
    notification.is_read = True
    notification.save()
    return JsonResponse({'message': 'Notification marked as read'})


# POST /notifications/internal/incident-created/ - service-to-service
@csrf_exempt
def incident_created(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    
    # In production, verify an internal API key here
    
    data = json.loads(request.body)
    incident_id = data.get('incident_id')
    department_id = data.get('department_id')
    reporter_id = data.get('reporter_id')
    message = f'Incident #{incident_id} has been created'
    
    if department_id:
        Notification.objects.create(
            department_id=department_id,
            incident_id=incident_id,
            type='incident_created',
            message=message
        )
    if reporter_id:
        Notification.objects.create(
            user_id=reporter_id,
            incident_id=incident_id,
            type='incident_created',
            message=f'Your incident #{incident_id} has been recorded. {message}'
        )
    return JsonResponse({'success': True})


# POST /notifications/internal/status-update/ 
@csrf_exempt
def status_update(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try: 
        data = json.loads(request.body)
    except Exception:
        data = request.POST
        
    incident_id = data.get('incident_id')
    user_id = data.get('user_id')          # reporter or assigned user
    department_id = data.get('department_id')  # optional
    new_status = data.get('status')
    message = data.get('message', f'Incident #{incident_id} status changed to {new_status}')
    
    if user_id:
        Notification.objects.create(
            user_id=user_id,
            incident_id=incident_id,
            type='status_update',
            message=message
        )
    if department_id:
        Notification.objects.create(
            department_id=department_id,
            incident_id=incident_id,
            type='status_update',
            message=f'Incident #{incident_id} updated to {new_status}'
        )
    return JsonResponse({'success': True})


@csrf_exempt
@login_required
def delete_notification(request, id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'DELETE required'}, status=405)
    
    Notification.objects.filter(id=id).delete()
    return JsonResponse({'message': 'Deleted successfully'})


# All notifications (admin only)
@login_required
def all_notifications(request):
    if request.user_payload.get('role') != 'admin':
        return JsonResponse({'error': 'forbidden'}, status=403)
    
    notifications = Notification.objects.all().order_by('-created_at')
    data = [{
        'id': str(n.id),
        'user_id': n.user_id,
        'department_id': n.department_id,
        'incident_id': n.incident_id,
        'type': n.type,
        'message': n.message,
        'is_read': n.is_read,
        'created_at': n.created_at.isoformat(),
    } for n in notifications]
    return JsonResponse({'success': True, 'notifications': data})