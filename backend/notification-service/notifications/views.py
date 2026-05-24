from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from .models import Notification, Escalation
from .auth_decorator import login_required, verify_token
import json


# GET /notifications/user/{userId}
@login_required
def user_notifications(user_id):
    notifications = Notification.objects.filter(user_id=user_id)
    data = [model_to_dict(n) for n in notifications]
    return JsonResponse(data, safe=False)


# PATCH /notifications/{id}/read
@csrf_exempt
@login_required
def mark_as_read(request, id):
    if request.method == 'PATCH':
        notification = Notification.objects.get(id=id)
        notification.is_read = True
        notification.save()
        return JsonResponse({'message': 'Notification marked as read'})
    return JsonResponse({'error': 'Invalid request'})


# POST /notifications/incident/{incidentId}
@csrf_exempt
@login_required
def trigger_incident_notification(request, incident_id):
    if request.method == 'POST':
        body = json.loads(request.body)
        notification = Notification.objects.create(
            user_id=body['user_id'],
            incident_id=incident_id,
            type='incident_created',
            message=body['message']
        )
        return JsonResponse(model_to_dict(notification))
    return JsonResponse({'error': 'Invalid request'})


# POST /notifications/send
@csrf_exempt
@login_required
def send_notification(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        notification = Notification.objects.create(
            user_id=body['user_id'],
            incident_id=body.get('incident_id'),
            type=body['type'],
            message=body['message']
        )
        return JsonResponse(model_to_dict(notification))
    return JsonResponse({'error': 'Invalid request'})


# POST /notifications/escalation/{incidentId}
@csrf_exempt
@login_required
def trigger_escalation(request, incident_id):
    if request.method == 'POST':
        escalation = Escalation.objects.create(
            incident_id=incident_id
        )
        return JsonResponse(model_to_dict(escalation))
    return JsonResponse({'error': 'Invalid request'})


# GET /notifications
@login_required
def all_notifications(request):
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'}, status=401)
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'}, status=403)
    notifications = Notification.objects.all()
    data = [model_to_dict(n) for n in notifications]
    return JsonResponse(data, safe=False)


# DELETE /notifications/{id}
@csrf_exempt
@login_required
def delete_notification(request, id):
    if request.method == 'DELETE':
        notification = Notification.objects.get(id=id)
        notification.delete()
        return JsonResponse({'message': 'Deleted successfully'})
    return JsonResponse({'error': 'Invalid request'})
