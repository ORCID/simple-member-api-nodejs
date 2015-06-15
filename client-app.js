var bodyParser = require('body-parser'), 
  config = require('./helpers/config'),
  httpLogging = require('./helpers/http-logging'),
  express = require('express'),
  request = require('request'),
  striptags = require('striptags');
 
var app = express(); // Init express
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(config.PORT, config.SERVER_IP, function () { // Start express
  console.log('server started on ' + config.PORT);
});

app.all('/', function(req, res) { 
  // Read body params
  var accept = req.body.accept ? striptags(req.body.accept): 'application/vnd.orcid+xml';
  var accordState = req.body.accordState ? striptags(req.body.accordState): '';
  var httpMethod = req.body.httpMethod ? striptags(req.body.httpMethod): 'get';
  var authorization = req.body.authorization ? striptags(req.body.authorization): 'bearer [token]';
  var reqBody = req.body.reqBody ? req.body.reqBody: '';
  var path = req.body.path ? striptags(req.body.path): '';
  var resBody = req.body.resBody ? req.body.resBody: '';
  var orcid = req.body.orcid ? striptags(req.body.orcid): '[ORCID]';
  var putCode = req.body.putCode ? striptags(req.body.putCode): '[PUT_CODE]';
  var contentType = req.body.contentType ? striptags(req.body.contentType): 'application/vnd.orcid+xml'; 
  var readPublicToken = req.body.readPublicToken? striptags(req.body.readPublicToken): '[READ_PUBLIC_TOKEN]';
  var updateActivitiesToken = req.body.updateActivitiesToken? striptags(req.body.updateActivitiesToken): '[ACTIVITIES_TOKEN]';

  var apiResCallback = function(error, response, body) {
      // returns index page
      res.render('pages/index', {
        'accept': accept,
        'accordState': accordState,
        'httpMethod': httpMethod,
        'authorization': authorization,
        'orcid': orcid,
        'putCode': putCode,
        'reqBody': reqBody,
        'contentType': contentType,
        'path': path, 
        'res': response,
        'results': error ? error: body,
        'readPublicToken': readPublicToken,
        'updateActivitiesToken': updateActivitiesToken,
        'statusCode': error ? '' : response.statusCode});
  };
    
  // Using the api is easy, just add authorization header to request 
  var apiReqOptions = {
    url: 'https://api.sandbox.orcid.org' + path,
    method: httpMethod,
    body: reqBody,
    headers: {
      'Accept': accept,
      'Authorization': authorization,
      'Content-type': contentType
    }
  };
  if (httpMethod.toLowerCase() ==  'post' || httpMethod.toLowerCase() ==  'put') {
    apiReqOptions['body'] = reqBody;
    apiReqOptions.headers['Content-type'] = contentType;
  }

  // Making request to member Search API
  request(apiReqOptions, apiResCallback);
});
