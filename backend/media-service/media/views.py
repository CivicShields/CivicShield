from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Media
from django.views.decorators.http import require_http_methods
from .utils import validate_uploaded_file
from django.views.decorators.http import require_GET
from django.shortcuts import get_object_or_404
from .auth_decorator import login_required, verify_token


@csrf_exempt           
@require_POST  
@login_required
# only allow POST requests and requires login
def upload_media(request):
    incident_id = request.POST.get('incident_id')
    uploaded_file = request.FILES.get('file')

    if not incident_id or not uploaded_file:
        return JsonResponse({'error': 'incident_id and file are required'})

    try:
        mime_type = validate_uploaded_file(uploaded_file)
    except ValidationError:
        return JsonResponse({'error': "Invalid file upload"})

    media = Media.objects.create(
        incident_id=incident_id,
        file=uploaded_file,
        file_name=uploaded_file.name,
        file_type=mime_type,
    )

    public_url = request.build_absolute_uri(media.file.url)

    return JsonResponse({
        'media_id': str(media.id),
        'url': public_url
    })

@require_GET  # only accept GET requests
@login_required
def get_media(request, media_id):        # media_id comes from the URL
    media = get_object_or_404(Media, pk=media_id)

    # Build the full public URL for local storage
    public_url = request.build_absolute_uri(media.file.url)

    return JsonResponse({
        'success': True,
        'media': {  
            'id': str(media.id),
            'incident_id': str(media.incident_id),
            'file_name': media.file_name,
            'file_type': media.file_type,
            'url': public_url,
            'created_at': media.created_at.isoformat()
        }
    })

@login_required
def all_media(request):
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'})
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'})
    media = Media.objects.all()
    result = []
    for m in media:
        result.append({
            'id': str(m.id),
            'incident_id': str(m.incident_id),
            'file_name': m.file_name,
            'file_type': m.file_type,
            'url': request.build_absolute_uri(m.file.url),
            'created_at': m.created_at.isoformat(),
        })
    return JsonResponse({'success': True, 'medias': result}, safe=False)


@csrf_exempt                    
@require_http_methods(["DELETE"])
@login_required
def delete_media(request, media_id):
    token = request.COOKIES.get('auth_token')
    if not token:
        return JsonResponse({'error': 'unauthorized'})
    payload = verify_token(token)
    if not payload or payload['role'] != 'admin':
        return JsonResponse({'error': 'forbidden'})
    media = get_object_or_404(Media, pk=media_id)

    # Delete the physical file from disk
    media.file.delete(save=False)
    # Delete the database record
    media.delete()

    return JsonResponse({'success': True, 'message': 'Media deleted successfully'})