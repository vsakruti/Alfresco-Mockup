const express = require('express');
const os = require("os");

// express module to server RESTful API
const app = express();
const basicAuth = require('express-basic-auth')
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// need swagger-ui-express node module to server swagger compatible web page
const swaggerUi = require('swagger-ui-express');

// json describing the interface in swagger syntax
const swaggerDocument = require('./swagger.json');

const baseURL = "/alfresco/api/-default-/public/gs/versions/1";

app.use('/apiDocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// need body-parser node module to parse http request for parameters and headers
const bodyParser = require('body-parser');

// specifiy that bodyParser is used for parsing HTTP Request
app.use(bodyParser.json());

// setup main RESTful API in the middleware
app.get(baseURL + '/probes/:probeId', (httpRequest, httpResponse) => {

  const probeIdValue = httpRequest.params.probeId;

  let responseObj = {};
  httpResponse.status(200);

  if (probeIdValue == '-ready-') {
    responseObj = {
      "entry": {
        "message": "readyProbe: Success - Tested"
      }
    };

  } else if (probeIdValue == '-live-') {
    responseObj = {
      "entry": {
        "message": "liveProbe: Success - Tested"
      }
    };
  } else if (probeIdValue == '-test-') {
    httpResponse.status(503);
    responseObj = {
      "entry": {
        "message": "testProbe: failed"
      }
    };
  }

  httpResponse.send(responseObj);

})

app.use(basicAuth({
  users: {
      'admin': 'admin',
      'venkat': 'password1234'
  }
}))

app.post(baseURL + '/record-categories/:recordCategoryId/children', (httpRequest, httpResponse) => {

  printCookies(httpRequest);

  const recordCategoryIdValue = httpRequest.params.recordCategoryId;

  const name = httpRequest.body.name;
  const nodeType = httpRequest.body.nodeType;
  const relativePath = httpRequest.body.relativePath;

  let responseObj = {};
  httpResponse.status(200);

  responseObj = {
    "host": getHostName(),
    "name": name,
    "nodeType": nodeType,
    "relativePath": relativePath
  };

  httpResponse.send(responseObj);

})

app.post(baseURL + '/files/:docId/declare', (httpRequest, httpResponse) => {

  printCookies(httpRequest);

  const docIdValue = httpRequest.params.docId;

  const hideRecordFlag = httpRequest.query.hideRecord;
  const parentIdValue = httpRequest.query.parentId;

  let responseObj = {};
  httpResponse.status(200);

  responseObj = {
    "host": getHostName(),
    "docId": docIdValue,
    "hideRecord": hideRecordFlag,
    "parentId": parentIdValue
  };

  httpResponse.send(responseObj);

})

app.post(baseURL + '/files/:docId/complete', (httpRequest, httpResponse) => {

  printCookies(httpRequest);

  const docIdValue = httpRequest.params.docId;

  let responseObj = {};
  httpResponse.status(200);

  responseObj = {
    "host": getHostName(),
    "docId": docIdValue
  };

  httpResponse.send(responseObj);

})

app.post('/alfresco/s/api/rma/actions/ExecutionQueue', (httpRequest, httpResponse) => {

  printCookies(httpRequest);

  const name = httpRequest.body.name;
  const nodeRef = httpRequest.body.nodeRef;

  let responseObj = {};
  httpResponse.status(200);

  responseObj = {
    "host": getHostName(),
    "name": name,
    "nodeRef": nodeRef
  };

  httpResponse.send(responseObj);

})

app.put(baseURL + '/records/:recordId', (httpRequest, httpResponse) => {

  printCookies(httpRequest);
  
  const recordIdValue = httpRequest.params.recordId;
  const inputProperties = httpRequest.body.properties;
  const dateFieldValue = inputProperties["rma:dateField"];

  let responseObj = {};
  httpResponse.status(200);

  responseObj = {
    "host": getHostName(),
    "recordId": recordIdValue,
    "dateField": JSON.stringify(inputProperties)
  };

  httpResponse.send(responseObj);

})

const portNumber = 3000;

// start and initialize the server
app.listen(portNumber, () => console.log(`Server started on port ${portNumber}`));

const getHostName = () => {

  return os.hostname();
}

const printCookies = (httpRequest) => {
  console.log("All Cookies:" + JSON.stringify(httpRequest.cookies));
  console.log("All Headers:" + JSON.stringify(httpRequest.headers));
}
