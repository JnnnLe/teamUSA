var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.listen(1337, function () {
  console.log('app listening on port 1337!')
})


var request=require('request');




var findUVIndex = function (req, res) {
  // Work here to send the api call to the weather ground
  // process the result of it and send back to the FE

  /*
  * Step1: Get the request and process it
  */
  console.log(req.body)
  console.log(req.body.zipcode)
  var url = 'http://api.wunderground.com/api/e5d404218521ff0d/conditions/q/' + req.body.zipcode + '.json'
  request.get(url,function(err,res,body){
    console.log(url)
    console.log(err)
    //TODO Do something with response
    console.log("body : "  + res.body)
    console.log("parsed json: "+ JSON.parse(res.body))
  });
  res.json({ unIndex: 6.5, risk: "high", recommendation: "go out" })
}


app.post('/', [findUVIndex])
