# Send_Mail
Api to send E-mail using Gmail api

# How to run ?

Before running the app, [credentials.json](https://developers.google.com/gmail/api/quickstart/nodejs) should be downloaded and stored in the root directory.

```
* npm install 
* node app.js 

```

If `token.json` file is not present, follow the instructions on terminal and authorize your Gmail account to get `token.json`.Then send a JSON post request to (http://localhost:3000/mail) with `to , subject and message` as key with their appropriate values.
