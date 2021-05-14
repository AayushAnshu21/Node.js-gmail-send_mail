const express = require("express");
const sendmail = require("./sendmail");

var app = express();
app.use(express.json());



//Api to send email
app.post("/mail", sendmail, (req, res) => {
    res.json(req.retVal);
});

app.listen(3000, () => {
  console.log('server is running on port 3000')
})