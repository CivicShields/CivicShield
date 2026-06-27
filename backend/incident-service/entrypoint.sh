#!/bin/sh
set -e

echo "=================================="
echo " Running database migrations..."
echo "=================================="

# Retry loop in case postgres is still starting
until python manage.py migrate --noinput; do
    echo "Migration failed, retrying in 3 seconds..."
    sleep 3
done

echo "=================================="
echo " Migrations complete!"
echo "=================================="

# Optionally seed test data
if [ "$INIT_TEST_DATA" = "true" ]; then
    echo "=================================="
    echo " Seeding test data..."
    echo "=================================="
    # Try to run the seeding command – ignore errors if it doesn't exist
    python manage.py seed_users --noinput 2>/dev/null || true
    python manage.py seed_departments --noinput 2>/dev/null || true
fi

echo "=================================="
echo " Starting Django server..."
echo "=================================="

exec python manage.py runserver 0.0.0.0:8000