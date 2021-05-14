const express = require("express");
const sendmail = require("./sendmail");
const { readandAuth } = require("./validate");
const fs = require("fs");

var app = express();
app.use(express.json());



//Api to donwload token if token doesn't exist
app.get("/token", (req, res) => {
  if (fs.existsSync('token.json')) {
    return res.json("token Exist")
  }  
  readandAuth("credentials.json", undefined);
  res.json("Please follow the terminal instructions to authorize the gmail account");
});

//Api to send email
app.post("/mail", sendmail, (req, res) => {
    res.json(req.retVal);
});

app.listen(3000, () => {
  console.log('server is running on port 3000')
})