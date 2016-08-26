var request = require('request');
var options=[];
var user=[];
var userbis=[];

	console.log('coucou');


var option = {
  url: 'http://localhost:9804/api/v1/bucketList/user/login',
  method: "POST",
  form:{'email':'lemanour.david2@gmail.com','password':'obione'},
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Headers':'Content-Type'
  }
};
options.push(option);
 var option = {
  url: 'http://localhost:9804/api/v1/bucketList/user/login',
  method: "POST",
  form:{'email':'lemanour.david2@gmail.com','password':'obione'},
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Headers':'Content-Type'
  }
};

options.push(option); 


function callback2(error, response, body) {
  if (!error && response.statusCode == 200) {
	info = JSON.parse(body);
	console.log({token:response.toJSON().headers.token,info:info,status:response.statusCode,error:error});
	//return {token:response.toJSON().headers.token,info:info,status:response.statusCode,error:error}

  } else {
  	info = JSON.parse(body);
	console.log({token:response.toJSON().headers.token,info:info,status:response.statusCode});
		//return {token:response.toJSON().headers.token,info:info,status:response.statusCode,error:error}

  }
}

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
	 info = JSON.parse(body);

	 option2 = {
	  url: 'http://localhost:9804/api/v1/bucketList/data/list?email='+info.email,
	  method: "GET",
	  headers: {
	    'content-type': 'application/x-www-form-urlencoded',
	    'Access-Control-Allow-Headers':'Content-Type',
	    'token':response.toJSON().headers.token
	  }
	};
	console.log({token:response.toJSON().headers.token,info:info,status:response.statusCode});
	request(option2, callback2);
	//return {token:response.toJSON().headers.token,info:info,status:response.statusCode,error:error}

  } else {
  	//var info = JSON.parse(body);
	//return {token:response.toJSON().headers.token,info:info,status:response.statusCode,error:error}
  }
}
 

for(option in options){
	request(options[option], callback);
}



//console.log(userbis);


/*
request({
    url: "http://josiahchoi.com/myjson",
    method: "POST",
    headers: {
        "content-type": "application/xml",  // <--Very important!!!
    },
    body: myXMLText
}, function (error, response, body){
    console.log(response);
});
*/