#!/bin/sh

set -e  # Exit script on any error

echo "Starting nginx..."
exec nginx -g 'daemon off;'
