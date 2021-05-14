const express = require("express");
const { readandAuth, sendMessage } = require("./validate");

var app = express();
app.use(express.json());



module.exports = function (req, res, next) {
  var to = req.body.to;
  var subject = req.body.subject;
  var message = req.body.message;

  //Callback function for sending OAuth2 client for sending email
  function getAuth(auth) {
    let content = {
      to,
      from: "me",
      subject,
      message,
    };
    sendMessage(auth, content, (err, res) => {
      if (err) {
        req.retVal = err;
        next()
      } else {
        req.retVal = res;
        next()
      }
    });
  }
  readandAuth("credentials.json", getAuth);
};
