# Cloudflare DNS Overwriter for dynamic IP

This is a very simple program to track changes in your dynamic IP address and Overwrite the DNS records if the IP address changes

## commands:

- **npm install** - install all dependencies
- **npm start** - start the App
- **npm run dev** - start the App with development mode (nodemon)
- **npm run linux** - start the App in linux (pm2 manager)
- **npm run getDNS** - show all your DNS records with id (helps with settings)

## Instruction:
0. Install NodeJS & copy this code
1. Go to your Profile/API Tokens in Cloudlflare https://dash.cloudflare.com/profile/api-tokens
2. Create new token with permissions **Zone.DNS**
3. Copy & paste this token to .env file for API_SECRET_KEY
4. Create new Record in your DNS Records (In Cloudflare)
5. run command: **npm run getDNS** to get all your DNS records with IDs (We need IDs)
6. Copy & paste Zone ID and Record ID to settings.js, fill other fields
7. Set your check Interval if you want in settings.js - After how long will the program check whether the IP match (In seconds)
8. save & run **npm install**

### Startup App
#### Windows:
- type command **npm start**
___
#### Linux: 
- Install **PM2** manager - https://pm2.keymetrics.io/
- run **npm run linux**
___