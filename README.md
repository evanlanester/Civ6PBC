# Civ6PBC
Sid Meier's Civilization VI Play By Cloud Node JS Webhook Proxy

## Requirements:
Packages:
- tmux *(recommended but not necessary)*
- npm
- nodejs

### Quick Start:
```bash
apt install git node npm tmux -y
mkdir Civ6PBC
cd Civ6PBC
git clone https://github.com/evanlanester/Civ6PBC.git
```

Setup your Civ 6 Play By Cloud Webhook URL to your API Endpoint:
Game Options -> Game -> Play By Cloud WebHook URL: `https://api.example.com/pbc/`

**Keep security in mind when running an App with Public Access - Limit Permissions and use a Limited User Account**

For example:
```bash
chown -R www-data:www-data
find -type f -exec chmod 644 {} \;
find -type d -exec chmod 755 {} \;
```

#### Tested and Maintained on Debian Linux
<img src="https://www.debian.org/Pics/debian-logo-1024x576.png" alt="drawing" width="200"/><https://www.debian.org/>
