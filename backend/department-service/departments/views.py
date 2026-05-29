from django.shortcuts import render

import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Department


@method_decorator(csrf_exempt, name='dispatch')
class DepartmentListView(View):

    def get(self, request):
        departments = list(
            Department.objects.values('id', 'name', 'email', 'phone')
        )
        return JsonResponse({'departments': departments}, status=200)

    def post(self, request):
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
            'id': dept.id,
            'name': dept.name,
            'email': dept.email,
            'phone': dept.phone,
        }, status=201)


@method_decorator(csrf_exempt, name='dispatch')
class DepartmentDetailView(View):

    def get(self, request, dept_id):
        try:
            dept = Department.objects.get(id=dept_id)
        except Department.DoesNotExist:
            return JsonResponse({'error': 'Not found'}, status=404)

        return JsonResponse({
            'id': dept.id,
            'name': dept.name,
            'email': dept.email,
            'phone': dept.phone,
        })

    def put(self, request, dept_id):
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

    def delete(self, request, dept_id):
        try:
            dept = Department.objects.get(id=dept_id)
        except Department.DoesNotExist:
            return JsonResponse({'error': 'Not found'}, status=404)

        dept.delete()
        return JsonResponse({'message': 'Deleted successfully'})