from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Media
from .utils import validate_uploaded_file

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