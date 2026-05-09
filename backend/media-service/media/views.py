from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Media
from .utils import validate_uploaded_file
from django.views.decorators.http import require_GET
from django.shortcuts import get_object_or_404


@csrf_exempt           # because we're not using Django forms (just an API)
@require_POST          # only allow POST requests
def upload_media(request):
    incident_id = request.POST.get('incident_id')
    uploaded_file = request.FILES.get('file')

    if not incident_id or not uploaded_file:
        return JsonResponse({'error': 'incident_id and file are required'}, status=400)

    try:
        mime_type = validate_uploaded_file(uploaded_file)
    except ValidationError as e:
        return JsonResponse({'error': str(e)}, status=400)

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
    }, status=201)


@require_GET  # only accept GET requests
def get_media(request, media_id):        # media_id comes from the URL
    media = get_object_or_404(Media, pk=media_id)

    # Build the full public URL for local storage
    public_url = request.build_absolute_uri(media.file.url)

    return JsonResponse({
        'id': str(media.id),
        'incident_id': str(media.incident_id),
        'file_name': media.file_name,
        'file_type': media.file_type,
        'url': public_url,
        'created_at': media.created_at.isoformat(),
    })

@require_GET
def incident_media(request, incident_id):
    # Django ORM: .filter() returns a QuerySet (like an array of records)
    media_list = Media.objects.filter(incident_id=incident_id)

    result = []
    for m in media_list:
        result.append({
            'id': str(m.id),
            'file_name': m.file_name,
            'file_type': m.file_type,
            'url': request.build_absolute_uri(m.file.url),
            'created_at': m.created_at.isoformat(),
        })
    return JsonResponse(result, safe=False)