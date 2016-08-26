var restify     =   require('restify');
var mongojs     =   require('mongojs');
var morgan  	=   require('morgan');
//var db          =   mongojs('bucketlistapp', ['appUsers','bucketLists']);
var db = mongojs('mongodb://obione:obione94310@ds013956.mlab.com:13956/auth', ['auth','user','bucketLists','placetobe']);
//var db = mongojs('http://localhost:27017', ['auth','user','bucketLists','placetobe']);

var server      =   restify.createServer();
 
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(morgan('dev')); // LOGGER
 
// CORS
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Token', 'init');
    next();
});
 
server.listen(process.env.PORT || 9804, function () {
    console.log("Server started @ ",process.env.PORT || 9804);
});



db . createCollection (  "youare" , 
   { 
      validator :  {  $or : 
         [ 
            {  password :  { $type :  "string"  }  }, 
            {  datein 	:  { $type :  "Timestamp"  }  }, 
            {  datelast :  { $type :  "Timestamp"  }  }, 
            {  tokenchangepassword :  { $type :  "string"  }  }, 
            {  phone 	:  {  $type :  "string"  }  }, 
            {  email 	:  {  $regex :  /@mongodb\.com$/  }  }, 
            {  status 	:  {  $in :  [  "Unknown" ,  "Incomplete"  ]  }  } 
         ] 
      },
      capped : true, autoIndexID : true, size : 6142800, max : 10000 
  });

db . createCollection (  "authyouare" , 
   { 
      validator :  {  $or : 
         [ 
            {  datein 	:  { $type :  "Timestamp"  }  }, 
            {  token:  { $type :  "string"  }  }, 
            {  user 	:  {  $type :  "string"  }  }, 
         ] 
      },
      capped : true, autoIndexID : true, size : 6142800, max : 10000 
  });


db . createCollection (  "localisation" , 
   { 
      validator :  {  $or : 
         [ 
            {  name :  { $type :  "string"  }  }, 
            {  slug :  { $type :  "string"  }  }, 
            {  longitude :  { $type :  "int"  }  }, 
            {  latitude :  { $type :  "int"  }  }, 
            {  datelast :  { $type :  "Timestamp"  }  }, 
            {  datein :  { $type :  "Timestamp"  }  }, 
            {  publisher :  {  $type :  "string"  }  }, 
            {  status  :  {  $in :  [  "Unknown" ,  "Incomplete"  ]  }}, 
            {  type  :  {    $type :  "array"}}, 
            {  media : {  $type :  "array"} }
         ] 
      },
      capped : true, autoIndexID : true, size : 6142800, max : 10000 
   });



var manageUsers = require('./managerUser')(server, db);
var manageLists =   require('./manageList')(server, db);



