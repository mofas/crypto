
var express = require('express')  
  , server
  , port = 3000;

var app = express();
app.use(express.static('views/'));
app.listen(port);
