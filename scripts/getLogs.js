$(document).ready(function(){
	$.ajaxSetup({
    type: "GET",
    data: {},
    dataType: 'json',
    xhrFields: {
       withCredentials: true
    },
    crossDomain: true
});

	if(getLogs("test@test.com")){
	 	setInterval(function(){getLogs("test@test.com")}, 10000);
	}

});

var getLogs = function(username){
	var url = 'https://smartlockproject.herokuapp.com/api/getUserLogs';

	$.ajax({
	   url: url,
	   xhrFields: {
	      withCredentials: true
	   },
	   success: function(data){
	        if(data.status == "error"){
				$("#logContent").html("not logged in");
				return false;
			}
			  console.dir(data.message);
			  $("#logContent").empty();

			  //sort log according to the time - last log first
			  data.message.sort(function(a, b) {
			  return (new Date(b.time)) - (new Date(a.time))
				});

			  for(var i=0; i<data.message.length; i++){
			  	$("<p>"+JSON.stringify(data.message[i])+"</p>").appendTo("#logContent");
			  }

			  return true;
			}
		});
	// var jqxhr = $.get( url, function(data) {

	// 	if(data.status == "error"){
	// 		$("#logContent").html("not logged in");
	// 		return false;
	// 	}
	//   console.dir(data.message);
	//   $("#logContent").empty();

	//   //sort log according to the time - last log first
	//   data.message.sort(function(a, b) {
	//   return (new Date(b.time)) - (new Date(a.time))
	// 	});

	//   for(var i=0; i<data.message.length; i++){
	//   	$("<p>"+JSON.stringify(data.message[i])+"</p>").appendTo("#logContent");
	//   }

	//   return true;
	// })
	//   .done(function() {
	//   //  alert( "second success" );
	//   })
	//   .fail(function(e) {
	//     //alert( "error" );
	//     console.dir(e);
	//   })
	//   .always(function() {
	//     //alert( "finished" );
	//   });
};