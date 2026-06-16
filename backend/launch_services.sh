#!/usr/bin/env bash
# ┌─────────────────────────────────────────────────────┐
# │            Django Multi-App Launcher                │
# └─────────────────────────────────────────────────────┘
# 1. Edit the APPS array below
# 2. chmod +x launch_service.sh
# 3. ./launch_service.sh

# ─── CONFIG ───────────────────────────────────────────────────────────────────
# Format: "absolute_path|venv_folder_name"
APPS=(
  "/home/kirito/Documents/PROJECT/kwanganje_incident_reporter/backend/auth-service|.authvenv"
  "/home/kirito/Documents/PROJECT/kwanganje_incident_reporter/backend/incident-service|.incidvenv"
  "/home/kirito/Documents/PROJECT/kwanganje_incident_reporter/backend/department-service|.depvenv"
  "/home/kirito/Documents/PROJECT/kwanganje_incident_reporter/backend/media-service|.mediavenv"
  "/home/kirito/Documents/PROJECT/kwanganje_incident_reporter/backend/notification-service|.novenv"
)
# ──────────────────────────────────────────────────────────────────────────────

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
R="\033[0m"

echo -e "\n${BOLD}${CYAN}🚀 Django Launcher${R}\n"

# ── Validate apps ─────────────────────────────────────────────────────────────
VALID_APPS=()

for APP_ENTRY in "${APPS[@]}"; do
  IFS='|' read -r APP_DIR VENV_NAME <<< "$APP_ENTRY"
  APP_NAME=$(basename "$APP_DIR")

  if [[ ! -d "$APP_DIR" ]]; then
    echo -e "  ${YELLOW}⚠  SKIP${R}  $APP_NAME — directory not found"
  elif [[ ! -f "$APP_DIR/$VENV_NAME/bin/activate" ]]; then
    echo -e "  ${YELLOW}⚠  SKIP${R}  $APP_NAME — venv '$VENV_NAME' not found inside $APP_DIR"
  elif [[ ! -f "$APP_DIR/manage.py" ]]; then
    echo -e "  ${YELLOW}⚠  SKIP${R}  $APP_NAME — manage.py not found in $APP_DIR"
  else
    VALID_APPS+=("$APP_DIR|$VENV_NAME")
    echo -e "  ${GREEN}✓  READY${R}  $APP_NAME    (venv: $VENV_NAME)"
  fi
done

echo ""

if [[ ${#VALID_APPS[@]} -eq 0 ]]; then
  echo -e "${RED}❌ No valid apps to launch. Fix the APPS config above.${R}\n"
  exit 1
fi

# ── Write a temp launcher script per app ──────────────────────────────────────
make_launcher() {
  local dir="$1" venv="$2"
  local name
  name=$(basename "$dir")
  local tmpfile
  tmpfile=$(mktemp /tmp/django_${name}_XXXX.sh)

  cat > "$tmpfile" <<SCRIPT
#!/usr/bin/env bash
cd "$dir"
source "$dir/$venv/bin/activate"
clear
echo ""
echo "  ─────────────────────────────────────────────────"
echo "   $name  |  venv: $venv"
echo "  ─────────────────────────────────────────────────"
echo ""
python manage.py runserver
echo ""
echo "  Server stopped. Press enter to close."
read -r
rm -- "\$0"
SCRIPT

  chmod +x "$tmpfile"
  echo "$tmpfile"
}

# ── Launch ────────────────────────────────────────────────────────────────────

if command -v tmux &>/dev/null; then
  # ── tmux: cleanest option — all services as tabs in one terminal ────────────
  SESSION="kwanganje"
  tmux kill-session -t "$SESSION" 2>/dev/null

  first=true
  for APP_ENTRY in "${VALID_APPS[@]}"; do
    IFS='|' read -r APP_DIR VENV_NAME <<< "$APP_ENTRY"
    APP_NAME=$(basename "$APP_DIR")
    LAUNCHER=$(make_launcher "$APP_DIR" "$VENV_NAME")

    if $first; then
      tmux new-session -d -s "$SESSION" -n "$APP_NAME"
      first=false
    else
      tmux new-window -t "$SESSION" -n "$APP_NAME"
    fi
    tmux send-keys -t "$SESSION:$APP_NAME" "bash $LAUNCHER" Enter
  done

  echo -e "${GREEN}${BOLD}✅ All services running in tmux session '${SESSION}'.${R}"
  echo -e "   Attaching now — use ${BOLD}Ctrl+B then a number${R} to switch tabs.\n"
  tmux attach -t "$SESSION"

elif [[ "$OSTYPE" == "darwin"* ]]; then
  # ── macOS Terminal ──────────────────────────────────────────────────────────
  for APP_ENTRY in "${VALID_APPS[@]}"; do
    IFS='|' read -r APP_DIR VENV_NAME <<< "$APP_ENTRY"
    LAUNCHER=$(make_launcher "$APP_DIR" "$VENV_NAME")
    osascript -e "tell application \"Terminal\" to do script \"$LAUNCHER\"" &>/dev/null
  done
  echo -e "${GREEN}${BOLD}✅ All apps launched.${R}\n"

elif command -v gnome-terminal &>/dev/null; then
  # ── GNOME: one window per service (batched --tab is broken on newer versions)
  for APP_ENTRY in "${VALID_APPS[@]}"; do
    IFS='|' read -r APP_DIR VENV_NAME <<< "$APP_ENTRY"
    APP_NAME=$(basename "$APP_DIR")
    LAUNCHER=$(make_launcher "$APP_DIR" "$VENV_NAME")
    gnome-terminal --title="$APP_NAME" -- bash "$LAUNCHER" &
    sleep 0.4  # avoid race conditions on startup
  done
  echo -e "${GREEN}${BOLD}✅ All apps launched in separate windows.${R}"
  echo -e "   ${CYAN}Tip: install tmux for a cleaner tab-based experience.${R}\n"

elif command -v konsole &>/dev/null; then
  for APP_ENTRY in "${VALID_APPS[@]}"; do
    IFS='|' read -r APP_DIR VENV_NAME <<< "$APP_ENTRY"
    APP_NAME=$(basename "$APP_DIR")
    LAUNCHER=$(make_launcher "$APP_DIR" "$VENV_NAME")
    konsole --new-tab --title "${APP_NAME}" -e bash "$LAUNCHER" &
    sleep 0.3
  done
  echo -e "${GREEN}${BOLD}✅ All apps launched.${R}\n"

elif command -v xfce4-terminal &>/dev/null; then
  for APP_ENTRY in "${VALID_APPS[@]}"; do
    IFS='|' read -r APP_DIR VENV_NAME <<< "$APP_ENTRY"
    APP_NAME=$(basename "$APP_DIR")
    LAUNCHER=$(make_launcher "$APP_DIR" "$VENV_NAME")
    xfce4-terminal --title "$APP_NAME" -e "bash $LAUNCHER" &
    sleep 0.3
  done
  echo -e "${GREEN}${BOLD}✅ All apps launched.${R}\n"

elif command -v xterm &>/dev/null; then
  for APP_ENTRY in "${VALID_APPS[@]}"; do
    IFS='|' read -r APP_DIR VENV_NAME <<< "$APP_ENTRY"
    APP_NAME=$(basename "$APP_DIR")
    LAUNCHER=$(make_launcher "$APP_DIR" "$VENV_NAME")
    xterm -title "$APP_NAME" -e bash "$LAUNCHER" &
    sleep 0.3
  done
  echo -e "${GREEN}${BOLD}✅ All apps launched.${R}\n"

else
  echo -e "${RED}❌ No supported terminal found.${R}"
  echo "   Install one of: tmux, gnome-terminal, konsole, xfce4-terminal, xterm"
  exit 1
fi
