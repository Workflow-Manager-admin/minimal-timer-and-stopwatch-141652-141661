#!/bin/bash
cd /home/kavia/workspace/code-generation/minimal-timer-and-stopwatch-141652-141661/timer_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

