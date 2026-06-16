from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Notification, Escalation
from .auth_decorator import login_required, verify_token
import json

def notification_to_dict(request, notif):
    return {
        "id": str(notif.id),
        "user_id": notif.user_id,
        'department_id': notif.department_id,
        'incident_id': notif.incident_id,
        'type': notif.type,
        'message': notif.message,
        'is_read': notif.is_read,
        'created_at': notif.created_at.isoformat(),
    } 


# GET /notifications/ - for current user 
@login_required
def my_notifications(request, user_id):
    notifications = Notification.objects.filter(user_id=user_id).order_by('-created_at')
    data = []
    for n in notifications:
        data.append(notification_to_dict(request, n))
    return JsonResponse({"success": True, "notifications": data}, safe=False)


# GET /notifications/department/<department_id>/ - admin only
@login_required
def department_notifications(request, department_id):
    notifications = Notification.objects.filter(department_id=department_id).order_by('-created_at')
    data = [notification_to_dict(request, n) for n in notifications]
    return JsonResponse({"success": True, "notifications": data}, safe=False)


# PATCH /notifications/<id>/read/
@csrf_exempt
@login_required
def mark_as_read(request, id):
    if request.method != 'PATCH':
        return JsonResponse({'error': 'PATCH required'})
    data = json.loads(request.body)
    department_id = data.get('department_id')
    user_id = data.get('user_id')
    
    if user_id:
        notification = Notification.objects.filter(id=id, user_id=user_id).first()
        notification.is_read = True
        notification.save()
    if department_id:
        notification = Notification.objects.filter(id=id, department_id=department_id).first()
        notification.is_read = True
        notification.save()
    
    return JsonResponse({'success': True, 'message': 'Notification marked as read'})


# POST /notifications/internal/incident-created/ - service-to-service
@csrf_exempt
def incident_created(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'})
    
    # In production, verify an internal API key here
    try:
        data = json.loads(request.body)
    except Exception:
        data = request.POST
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
        return JsonResponse({'error': 'POST required'})
    try: 
        data = json.loads(request.body)
    except Exception:
        data = request.POST
        
    incident_id = data.get('incident_id')      
    department_id = data.get('department_id') 
    new_status = data.get('status')
    reporter_id = data.get('reporter_id')
    if new_status == 'in_progress':
        message = f"Incident with id:{str(incident_id)[:5]} has been seen and is being attended to"
    if new_status == 'resolved':
        message = f"Incident with id:{str(incident_id)[:5]} has been resolved"
    if new_status == 'pending':
        message = f"Incident with id:{str(incident_id)[:5]} has been changed to the status of pending, please contact the department for more info"
    
    if department_id:
        Notification.objects.create(
            department_id=department_id,
            incident_id=incident_id,
            type='status_update',
            message=message,
        )
    if reporter_id:
        Notification.objects.create(
            user_id=reporter_id,
            incident_id=incident_id,
            type='status_update',
            message=message,
        )
    return JsonResponse({'success': True})


@csrf_exempt
@login_required
def delete_notification(request, id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'DELETE required'}, status=405)
    data = json.loads(request.body)
    department_id = data.get('department_id')
    user_id = data.get('user_id')
    
    if user_id:
        Notification.objects.filter(id=id, user_id=user_id).delete()
    if department_id:
        Notification.objects.filter(id=id, department_id=department_id).delete()
    return JsonResponse({"success": True, 'message': 'Deleted successfully'})


# All notifications (admin only)
@login_required
def all_notifications(request):
    if request.user_payload.get('role') != 'admin':
        return JsonResponse({'error': 'forbidden'})
    
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