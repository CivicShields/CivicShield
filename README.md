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

5. Run backend simultaneously (optional)

## Running the Services

### Prerequisites

Ensure you have the following installed:

- Python 3.x
- Virtual environments set up for each service
- `tmux` _(optional but recommended — gives you proper tabs in one terminal)_

Install tmux:

```bash
sudo apt install tmux        # Ubuntu/Debian
brew install tmux            # macOS
```

6. navigate to the backend root directory

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
