#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as sudo or root" 
   exit 1
fi

sudo apt install node npm tmux -y
sudo npm init -y
sudo npm install http https