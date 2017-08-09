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

	if($.cookie("slock") ){
		getLogs();
		window.getLogs = setInterval(getLogs, 10000);
	} 

});

var getLogs = function(){
	var url = 'https://smartlockproject.herokuapp.com/api/getUserLogs?token=';
	var lockid = getUrlParam("lockid");

	$.ajax({
	   url: url+$.cookie("slock"),
	   xhrFields: {
	      withCredentials: true
	   },
	   cache: false,
	   crossDomain: true,
	   dataType: 'json',
	   method: "GET",
	   success: function(data){
	   		var locks={};
	   		switch(data.status){
	   			case "error":
	   				$("#logContent").html("not logged in");
					clearInterval(window.getLogs);
	   				break;
	   			case "success":
		   			if(!data.message ||!data.message.length){
						$("#logContent").html("no logs");
						clearInterval(window.getLogs);
						return;
					}
					console.dir(data.message);
				  $("#logContent").empty();

				  //sort log according to the time - last log first
				  data.message.sort(function(a, b) {
				  return (new Date(b.time)) - (new Date(a.time))
					});

				  for(var i=0; i<data.message.length; i++){
				  	if(lockid == data.message[i].lockid || !lockid){
				  		var date = new Date(data.message[i].time);
				  		var action = "did";
				  		locks[data.message[i].lockid] = data.message[i].lockid;
					  	var text = "<span>The username </span>"+ data.message[i].username + " <span>"+action+"</span> "+data.message[i].action + 
					  	" <span>to lockid:</span>"+ data.message[i].lockid + 
					  	" <span>at</span> " + date.getDate() + "/"+(date.getMonth()+1)+'/'+date.getFullYear()+" "+ ((date.getHours()<10)?'0':'') +date.getHours()+":"+ (date.getMinutes()<10?'0':'') +date.getMinutes();
					  	$("<li>"+text+"</li>").appendTo("#logContent");	
				  	}
				  	
				  }

				  var select = "<button id='reset'>RESET</button><form method='get' id='lockSelector'><select name='lockid'>";

				for (var key in locks) {
					select += "<option>"+key+"</option>";

				  }

				  select += "</select><button>SUBMIT</button></form>";

				  $("#filter").html(select);

				  $("#reset").click(function(){
				  	location.href="/logs.html";
				  })

	   				break;
	   		}

		},
		error:function(e){
			console.log(e.responseText);
			$("#logContent").html("Server Error");
			clearInterval(window.getLogs);
		}
		});
};

var writeAction = function(action){
	return (action.toLowerCase().indexOf('permission')>-1 ||
			action.toLowerCase().indexOf('mail')>-1 ||
			action.toLowerCase().indexOf('physical')>-1)?"received" : "did";
}