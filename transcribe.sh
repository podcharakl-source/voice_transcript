#!/bin/bash

# Prevent execution failure on line ending mismatch or empty arguments
set -e

# Colors for beautiful formatting
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
RESET='\033[0m'

# Print helper message
usage() {
    echo -e "${YELLOW}Usage:${RESET} $0 <path_to_audio_file> [model]"
    echo -e "Example: $0 2026-06-11T03_45_57Z.m4a gemini-3.1-pro-preview"
    echo -e "Default model: ${GREEN}gemini-3.5-flash${RESET}"
    exit 1
}

# Check argument
if [ -z "$1" ]; then
    usage
fi

AUDIO_FILE="$1"
MODEL="${2:-gemini-3.5-flash}"

# Check if file exists
if [ ! -f "$AUDIO_FILE" ]; then
    echo -e "${RED}Error:${RESET} File '$AUDIO_FILE' not found."
    exit 1
fi

# Load GEMINI_API_KEY from environment or potential local config files
if [ -z "$GEMINI_API_KEY" ]; then
    if [ -f ".env" ]; then
        # Load from .env if present
        export $(grep -v '^#' .env | grep GEMINI_API_KEY | xargs 2>/dev/null || true)
    fi
fi

# If GEMINI_API_KEY is still not found, check MY_GEMINI_API_KEY (from your secrets configuration)
if [ -z "$GEMINI_API_KEY" ] && [ ! -z "$MY_GEMINI_API_KEY" ]; then
    GEMINI_API_KEY="$MY_GEMINI_API_KEY"
fi

# Check if we have the API key
if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}Error:${RESET} GEMINI_API_KEY environment variable is not set."
    echo -e "Please export your key first:"
    echo -e "  ${BLUE}export GEMINI_API_KEY=\"your_api_key_here\"${RESET}"
    echo -e "Or create a ${BLUE}.env${RESET} file in this directory with:"
    echo -e "  ${BLUE}GEMINI_API_KEY=your_api_key_here${RESET}"
    exit 1
fi

# Detect mime type by file extension
EXTENSION="${AUDIO_FILE##*.}"
EXTENSION=$(echo "$EXTENSION" | tr '[:upper:]' '[:lower:]')

case "$EXTENSION" in
    m4a)
        MIME_TYPE="audio/x-m4a"
        ;;
    mp3)
        MIME_TYPE="audio/mp3"
        ;;
    wav)
        MIME_TYPE="audio/wav"
        ;;
    ogg)
        MIME_TYPE="audio/ogg"
        ;;
    aac)
        MIME_TYPE="audio/aac"
        ;;
    *)
        # Default to audio/x-m4a if unknown
        MIME_TYPE="audio/x-m4a"
        ;;
esac

echo -e "${BLUE}[1/3]${RESET} Encoding audio file: ${GREEN}$AUDIO_FILE${RESET} (MimeType: $MIME_TYPE)..."

# Base64 encode the audio file
# Handles differences between macOS and Linux safely
if command -v base64 >/dev/null 2>&1; then
    BASE64_DATA=$(base64 -w 0 "$AUDIO_FILE" 2>/dev/null || base64 "$AUDIO_FILE" | tr -d '\r\n')
else
    echo -e "${RED}Error:${RESET} 'base64' command line tool is not installed."
    exit 1
fi

if [ -z "$BASE64_DATA" ]; then
    echo -e "${RED}Error:${RESET} Failed to base64 encode the file."
    exit 1
fi

echo -e "${BLUE}[2/3]${RESET} Sending request to Google Gemini API (using $MODEL)..."

# Call the Gemini API endpoint
RESPONSE=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"contents\": [{
      \"parts\": [
        {
          \"inlineData\": {
            \"mimeType\": \"$MIME_TYPE\",
            \"data\": \"$BASE64_DATA\"
          }
        },
        {
          \"text\": \"Please transcribe this audio exactly as it is spoken. Output only the transcription text.\"
        }
      ]
    }]
  }")

# Check response and extract text
echo -e "${BLUE}[3/3]${RESET} Transcription complete!"
echo -e "------------------------------------------------------------"

# Attempt to parse json. We prefer python3 if available (built-in on Ubuntu) otherwise fallback to jq or regex
if command -v python3 >/dev/null 2>&1; then
    RESULT=$(echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if 'error' in data:
        print('API Error: ' + data['error']['message'], file=sys.stderr)
        sys.exit(1)
    text = data['candidates'][0]['content']['parts'][0]['text']
    print(text)
except Exception as e:
    print('Failed to parse response. Raw response received was invalid json or structure.', file=sys.stderr)
    sys.exit(1)
" 2>&1)
    PARSE_STATUS=$?
elif command -v jq >/dev/null 2>&1; then
    RESULT=$(echo "$RESPONSE" | jq -r '.candidates[0].content.parts[0].text' 2>/dev/null)
    PARSE_STATUS=$?
else
    # Fallback text extract (highly simple regex)
    RESULT=$(echo "$RESPONSE" | grep -o '"text": "[^"]*' | head -n 1 | cut -d '"' -f 4)
    PARSE_STATUS=0
fi

if [ $PARSE_STATUS -ne 0 ] || [ -z "$RESULT" ] || [ "$RESULT" = "null" ]; then
    echo -e "${RED}Error:${RESET} Transcription parsing failed. Full API response below:"
    echo "$RESPONSE"
    exit 1
fi

echo -e "${GREEN}$RESULT${RESET}"
echo -e "------------------------------------------------------------"
