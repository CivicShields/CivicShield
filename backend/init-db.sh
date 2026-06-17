#!/bin/bash
set -e

# Create databases if they don't exist (connect to the 'postgres' database)
for db in auth_db incident_db dept_db notification_db media_db; do
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d postgres <<-EOSQL
        SELECT 'CREATE DATABASE $db'
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$db')\gexec
EOSQL
done

# Enable PostGIS extension on incident_db
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d incident_db <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
EOSQL