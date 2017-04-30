//TODO: .gitignore API + modularize url

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


var findUVIndex = function (req, response) {
  // Work here to send the api call to the weather ground
  // process the result of it and send back to the FE

  /*
  * Step1: Get the request and process it
  */
  console.log("Hey I got a request")
  var UVIndex;
  var risk;
  var recommendation;
  var url = 'http://api.wunderground.com/api/e5d404218521ff0d/conditions/q/' + req.body.zipcode + '.json';

  var values = request.get(url, function(err,res,body) {

    var parsed_json = JSON.parse(body);
    UVIndex = parsed_json['current_observation']['UV'];

    if (UVIndex <= 2.9) {
      risk = "Low"
      recommendation = "Wear sunglasses on bright days; use sunscreen if there is snow on the ground, which reflects UV radiation, or if you have particularly fair skin."
    } else if (UVIndex >=3 && UVIndex <= 5.9)  {
      risk  = "Moderate"
      recommendation = "Take precautions, such as covering up, if you will be outside. Stay in shade near midday when the sun is strongest."
    } else if (UVIndex >=6 && UVIndex <= 7.9) {
      risk = "Orange"
      recommendation = "Cover the body with sun protective clothing, use SPF 30+ sunscreen, wear a hat, reduce time in the sun within three hours of solar noon, and wear sunglasses."
    } else if (UVIndex >= 8 && UVIndex <= 10.9) {
      risk = "Red"
      recommendation = "Wear SPF 30+ sunscreen, a shirt, sunglasses, and a wide-brimmed hat. Do not stay in the sun for too long."
    } else {
      risk = "Violet"
      recommendation = "Take all precautions: Wear SPF 30+ sunscreen, a long-sleeved shirt and trousers, sunglasses, and a very broad hat. Avoid the sun within three hours of solar noon."
    }
    //console.log(UVIndex, risk, recommendation)
    response.json({ uvIndex: UVIndex, risk: risk, recommendation: recommendation })
});

}


app.post('/findUVIndex', [findUVIndex]);

app.listen(1337, function () {
  console.log('app listening on port 1337!')
})
