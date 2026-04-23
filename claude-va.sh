#!/bin/bash
# Claude Assistant for VA Tasks
# Usage: ./claude-va.sh "your question here"

claude "$@" --allowedTools "Read,Edit,Glob,Bash,Write" --cwd /Users/corey-dev/.openclaw/workspace/lead2client-dashboard