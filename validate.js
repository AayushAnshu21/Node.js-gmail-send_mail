const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");


const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
];
const TOKEN_PATH = "token.json";


//Function to initiate authentication using  OAuth 2.0 and sending Email
async function readandAuth(fname, getAuth) {
  fs.readFile(fname, (err, content) => {
    if (err)
      return console.log("Error loading client secret file:", err);

    authorize(JSON.parse(content), getAuth);
  });
}

//Function to validate the stored credentials and email
//If token not present , user need to authorize his gmail account to receive token 
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

//Function to get token from authorized gmail account by following instruction on terminal
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


//Convert the content of email to base64
function makeBody(to, from, subject, message) {
    var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    var encodedMail = Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
}


//Send email from authenticated user gmail account to given userID
function sendMessage(auth, content,callback) {
  const { to, from, subject, message } = content;
  var mail = makeBody(to, from, subject, message);
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.messages.send(
    {
      auth: auth,
      userId: "me",
      resource: {
        raw: mail,
      },
    },
    function (err, response) {
      if (err)
        callback("The API returned an error: " + err, undefined);
      else {
        callback(undefined, response.statusText + ", email send successfully");
      }
    }
  );
}

module.exports = {
  readandAuth,
  sendMessage
};

