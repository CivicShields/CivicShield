import magic
from django.core.exceptions import ValidationError

ALLOWED_MIME_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/jpg',
    'video/mp4', 'video/webm',
    'application/pdf',
]
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB

def validate_uploaded_file(file):
    if file.size > MAX_FILE_SIZE:
        raise ValidationError('File too large.')
    mime = magic.from_buffer(file.read(2048), mime=True)
    file.seek(0)
    if mime not in ALLOWED_MIME_TYPES:
        raise ValidationError(f'Unsupported file type: {mime}')
    return mime