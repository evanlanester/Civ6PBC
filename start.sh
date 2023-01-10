#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as sudo or root" 
   exit 1
fi

sudo -u www-data tmux new-session -d -s Civ6PBC 'node public/index.js'