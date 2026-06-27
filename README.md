# Kwanganje Incident Reporter

**Kwanganje Incident Reporter** is a community-driven reporting platform where citizens can report incidents and law enforcement authorities can respond. It bridges communities and authorities to improve safety, accountability, and transparency.

## Features

* **User Accounts:** Citizens and authorities have accounts. Authorities have special roles to respond to reports.
* **Community Reporting:** Users can submit reports with descriptions, locations, and media attachments.
* **Authority Responses:** Verified authorities can update reports, provide guidance, and mark cases as resolved.
* **Categorized Incidents:** Reports are organized by type (theft, assault, vandalism, fire, etc.) for easy tracking.
* **Real-Time Updates:** Users can follow incidents and receive notifications as their reports progress.

## Tech Stack

* **Backend:** Django
* **Frontend:** React
* **Database:** PostgreSQL + PostGIS
* **Authentication:** JWT / Django Authentication
* **Containerization:** Docker & Docker Compose

---

# Getting Started

## Prerequisites

* Docker
* Docker Compose
* Git

Clone the repository:

```bash
git clone https://github.com/CivicShields/CivicShield.git
cd CivicShield
```

---

# System Deployment

Once the project has been cloned, you can deploy the entire platform using Docker.

## Option A – Pull Pre-built Images (Recommended)

```bash
docker compose pull
docker compose up -d
```

---

## Option B – Build Locally

If you are developing locally or Docker Hub images are unavailable:

1. Ensure the `image:` lines inside `docker-compose.yml` are commented out and the `build:` entries are enabled.

2. Build the containers:

```bash
docker compose build
```

3. Start the platform:

```bash
docker compose up -d
```

---

## Verify the Deployment

Wait approximately **30 seconds** for all services to initialize.

Then check the container status:

```bash
docker compose ps
```

All services should display a status of **Up**.

---

# Database Initialization

> **Only required the first time the system starts, or after a full database reset.**

Populate the database with the default users and departments:

```bash
docker compose exec auth-service python manage.py seed_users

docker compose exec department-service python manage.py seed_departments
```

If the output reports that records already exist, the database has already been initialized.

---

# Testing the Platform

Open your browser and navigate to:

```
http://localhost:3000
```

Follow the workflow below to verify the complete system.

---

## Phase 1 – Administrator Setup

### Login

**Email**

```
admin@example.com
```

**Password**

```
AdminPass123!
```

### Tasks

1. Open **Manage Users**.
2. Find:

```
dept@example.com
```

3. Assign the user to the **Fire Department**.
4. Open **Departments** and verify:

* Fire Department
* Water Department
* Police Department
5. Logout.

---

## Phase 2 – Citizen Reporting

### Login

**Email**

```
user1@example.com
```

**Password**

```
User1Pass123!
```

### Create Three Incidents
Make sure to include all details including uploading images

#### Incident 1

| Field      | Value           |
| ---------- | --------------- |
| Title      | Kitchen Fire    |
| Location   | Apt 4B          |
| Department | Fire Department |

#### Incident 2

| Field      | Value            |
| ---------- | ---------------- |
| Title      | Burst Water Pipe |
| Department | Water Department |

#### Incident 3

| Field      | Value             |
| ---------- | ----------------- |
| Title      | House on fire |
| Department | Fire Department |

Open **Kitchen Fire** and send the following message in the chat:

> Please send help quickly!

Logout.

---

## Phase 3 – Department Officer

### Login

**Email**

```
dept@example.com
```

**Password**

```
DeptPass123!
```

### Verify Role Isolation

Only **Kitchen Fire** should be visible.

The Water and Police incidents should **not** appear.

### Process the Incident

1. Open Kitchen Fire.
2. Assign:

```
Team Alpha
```
Which will change it's status to:

```
In Progress
```
3. Go to the resolve tab and resolve it which will change it's status again to:

```
Resolved
```

Reply to the user's message with:

> "Help is on the way." If status is in progress else "Incident has been rsolved."

Logout.

---

## Phase 4 – Citizen Verification

Login again as:

```
user1@example.com
```

Verify that:

* Kitchen Fire status changed correctly.
* Department reply appears in the chat.
* Burst Water Pipe remains unchanged.
* House on fire remains unchanged.

---

# Troubleshooting

## 502 Bad Gateway

Check that every container is running:

```bash
docker compose ps
```

---

## Service Errors

View logs for the affected service.

Example:

```bash
docker compose logs incident-service

docker compose logs auth-service
```

---

## Invalid Credentials

Passwords are case-sensitive.

Use the credentials exactly as listed above.

---

## Docker Pull Fails

If Docker Hub images are unavailable, use:

```bash
docker compose build

docker compose up -d
```

instead.

---

# Full System Reset

To completely erase all databases and uploaded files:

```bash
docker compose down -v

docker compose up -d
```

After resetting, run the seed commands again:

```bash
docker compose exec auth-service python manage.py seed_users

docker compose exec department-service python manage.py seed_departments
```
