from django.shortcuts import render

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from .models import Notification, Escalation
import json


# GET /notifications/user/{userId}
def user_notifications(request, user_id):

    notifications = Notification.objects.filter(user_id=user_id)

    data = [model_to_dict(n) for n in notifications]

    return JsonResponse(data, safe=False)


# PATCH /notifications/{id}/read
@csrf_exempt
def mark_as_read(request, id):

    if request.method == 'PATCH':

        notification = Notification.objects.get(id=id)

        notification.is_read = True

        notification.save()

        return JsonResponse({'message': 'Notification marked as read'})

    return JsonResponse({'error': 'Invalid request'})


# POST /notifications/incident/{incidentId}
@csrf_exempt
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
def trigger_escalation(request, incident_id):

    if request.method == 'POST':

        escalation = Escalation.objects.create(
            incident_id=incident_id
        )

        return JsonResponse(model_to_dict(escalation))

    return JsonResponse({'error': 'Invalid request'})


# GET /notifications
def all_notifications(request):

    notifications = Notification.objects.all()

    data = [model_to_dict(n) for n in notifications]

    return JsonResponse(data, safe=False)


# DELETE /notifications/{id}
@csrf_exempt
def delete_notification(request, id):

    if request.method == 'DELETE':

        notification = Notification.objects.get(id=id)

        notification.delete()

        return JsonResponse({'message': 'Deleted successfully'})

    return JsonResponse({'error': 'Invalid request'})
