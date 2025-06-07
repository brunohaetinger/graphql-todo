#!/bin/bash

# Check if filename was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <filename>.http"
  exit 1
fi

FILE="$1"

# Extract method and URL
method=$(head -n 1 "$FILE" | awk '{print $1}')
url=$(head -n 1 "$FILE" | awk '{print $2}')
content_type=$(grep -i 'Content-Type:' "$FILE" | cut -d' ' -f2-)

# Extract body (everything after the first empty line)
body=$(awk 'BEGIN {found=0} /^$/ {found=1; next} found {print}' "$FILE")

# Make the curl request
curl -X "$method" "$url" \
  -H "Content-Type: $content_type" \
  -d "$body"
