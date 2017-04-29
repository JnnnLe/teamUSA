var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.listen(1337, function () {
  console.log('app listening on port 1337!')
})

var findUVIndex = function (req, res) {
  // Work here to send the api call to the weather ground
  // process the result of it and send back to the FE

  /*
  * Step1: Get the request and process it
  */
  console.log(req.body)
  res.json({ unIndex: 6.5, risk: "high", recommendation: "go out" })
}


app.post('/', [findUVIndex])
