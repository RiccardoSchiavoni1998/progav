import { decode } from "punycode";

const jwt = require('jsonwebtoken');
require('dotenv').config();


export var checkHeader = function(req: any, res: any, next: any){
  const authHeader = req.headers.authorization;
  if (authHeader) {
      next();
  }else{
      res.sendStatus(401); 
  }
};

export var checkToken= function(req: any, res: any, next: any){
  const bearerHeader = req.headers.authorization;
  if(typeof bearerHeader!=='undefined'){
      const bearerToken = bearerHeader.split(' ')[1];
      req.token=bearerToken;
      next();
  }else{
      res.sendStatus(403); 
  }
}

export var decryptTokenAndVerifyIntegrity = function(req: any, res: any, next: any){
  try{
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);//DEVO SETTARE SECRET K
    if(decoded !== null){
      req.user = {"email": decoded.email, "role": decoded.role}
      next();
    }else{
      res.sendStatus(401);
    }
  }catch(e){
    res.sendStatus(401);
  }  
}




















/*var express = require('express');
//const { isNewExpression } = require('typescript');
var app = express();

var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

var requestTime = function (req, res, next) {
    req.requestTime = Date.now();
    next();
  };

var checkHeader = function(req, res, next){
    const authHeader = req.headers.authorization;
    if (authHeader) {
        next();
    }else{
        next("no auth header");
    }
};

var checkHeader = function(req, res, next){
    const authHeader = req.headers.authorization;
    if (authHeader) {
        next();
    }else{
        let err = new Error("ahi ahi no auth header");
        next(err);
    }
};

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
  }

function errorHandler(err, req, res, next) {   
    res.status(500).send({"error": err.message});
  }
  

app.use(myLogger);
app.use(requestTime);
app.use(checkHeader);
app.use(logErrors);
app.use(errorHandler);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000);*/