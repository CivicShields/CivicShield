# Kwanganje Incident Reporter

**Kwanganje Incident Reporter** is a community-driven reporting platform where citizens can report incidents and law enforcement authorities can respond. It bridges communities and authorities to improve safety, accountability and transparency.

## Features

- **User Accounts:** Citizens and authorities have accounts. Authorities have special roles to respond to reports.
- **Community Reporting:** Users can submit reports with descriptions, locations and media attachments.
- **Authority Responses:** Verified authorities can update reports, provide guidance and mark cases as resolved.
- **Categorized Incidents:** Reports are organized by type (theft, assault, vandalism, etc.) for easy tracking.
- **Real-Time Updates:** Users can follow incidents and receive updates.

## Tech Stack

- **Backend:** Django
- **Frontend:** React
- **Database:** PostgreSQL
- **Authentication:** JWT or Django auth system with role-based access

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git
- PostgreSQL

---

### Backend Setup (Django)

1. Clone the repository:

```bash
git clone https://github.com/yourusername/civicshield.git
cd CivicShield
```

### Frontend Setup (React)

1. Clone the repository:

```bash
git clone https://github.com/yourusername/civicshield.git
```

2. Naviagate to the frontend folder:

```bash
cd CivicShield/frontend
```

3. Install required dependicies :

```bash
npm install
```

4. Run project:

```bash
npm run dev
```

### Backend setup (Django)

---

## Manual Setup

1. Install PostgreSQL (linux, if windows download postgresql and install it)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Start and enable it:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

2. Install PostGIS _(required for incident service)_

```bash
sudo apt install postgis postgresql-14-postgis-3
```

> If you're on a different PostgreSQL version, replace `14` with yours. Check with `psql --version`.

---

3. Create the Databases

Switch to the postgres user:

```bash
sudo -i -u postgres psql
```

create new user using the following command

```sql
CREATE USER kwanganje WITH PASSWORD 'your_secure_password';
```

Then run:

```sql
CREATE DATABASE auth_db;
CREATE DATABASE incident_db;
CREATE DATABASE department_db;
CREATE DATABASE media_db;
CREATE DATABASE notification_db;
```

Exit psql:

```sql
\q
```

## go to each services settings.py and replace the password with the password you set when creating the user

4. Enable PostGIS on `incident_db`

```bash
sudo -u postgres psql -d incident_db
```

Then run:

```sql
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```

Exit:

```sql
\q
```

---

5. Set Up Each Service (manual way)

Repeat the following steps for each service. Navigate into each folder, create its virtual environment, install dependencies, and start the server.

#### Auth Service

```bash
cd backend/auth-service
python3 -m venv .authvenv
source .authvenv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

#### Incident Service

```bash
cd backend/incident-service
python3 -m venv .incidvenv
source .incidvenv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

#### Department Service

```bash
cd backend/department-service
python3 -m venv .depvenv
source .depvenv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

#### Media Service

```bash
cd backend/media-service
python3 -m venv .mediavenv
source .mediavenv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

#### Notification Service

```bash
cd backend/notification-service
python3 -m venv .novenv
source .novenv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

> Each service needs to be running in its own terminal. Open a new terminal tab or window for each one before running `python manage.py runserver`.

6. Running the services all at once (optional)

### Prerequisites

- `tmux` _(optional but recommended — gives you proper tabs in one terminal)_

Install tmux:

```bash
sudo apt install tmux        # Ubuntu/Debian
brew install tmux            # macOS
```

\*\*1. navigate to the backend root directory

**2. Open it and update the `APPS` array with your local paths:**

```bash
nano launch_django.sh
```

Each entry follows the format `"absolute_path|venv_folder_name"`:

```bash
APPS=(
  "/home/<you>/path/to/auth-service|.authvenv"
  "/home/<you>/path/to/incident-service|.incidvenv"
  ...
)
```

**3. Make it executable (only needed once):**

```bash
chmod +x launch_django.sh
```

---

### Running

```bash
./launch_django.sh
```

The script will validate each service before launching. A `✓ READY` means the path, venv, and `manage.py` were all found. A `⚠ SKIP` means something is missing — the message will tell you what.

**With tmux**, all 5 services open as tabs in one terminal. Switch between them with:

| Action         | Shortcut              |
| -------------- | --------------------- |
| Next tab       | `Ctrl+B` then `n`     |
| Previous tab   | `Ctrl+B` then `p`     |
| Jump to tab    | `Ctrl+B` then `0`–`4` |
| Detach session | `Ctrl+B` then `d`     |

Re-attach to a detached session with:

```bash
tmux attach -t kwanganje
```

**Without tmux**, each service opens in its own terminal window.
