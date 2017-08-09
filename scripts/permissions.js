$(document).ready(function(){

	$("#addLock").click(function(){
		$(".addLockPer").toggle();
	});

	$(".addLockPer button").click(function(e){
			e.preventDefault();
			addManagerPer();
	});

	if($.cookie("slock") && $.cookie("slock")!="null"){
		getLocks();
	} else{
		$(".loader").hide();
		$("#locksData").html("Need to log in");
	}
});


var addManagerPer = function(lockid, username){
	var url = "https://smartlockproject.herokuapp.com/api/addPermission?token="+$.cookie("slock");
	var lockid = $("input[name=lockid]").val();
	var username = $.cookie("username");
	$("#server-msg").html("");
	$.ajax({
	  	method: "POST",
	  	url: url,
	  	xhrFields: {
      		withCredentials: true
	   	},
	   	cache: false,
	   	crossDomain: true,
	  	data: { username: username, lockid: lockid },
	  	success: function(data){
        	console.dir(data);	
			switch(data.status){
		  		case "success":
		  			console.log(data.message);
		  			$("#server-msg").html("Permission was saved successfully");
		  			break;
		  		case "error":
		  			$("#server-msg").html(data.message);
		  			if(!data.message){
		  				$("#server-msg").html("Lock has manager. Ask him for permissions");
		  			}
		  			break;
			}

		}
	});
};



var getLocks = function(){
	var url = 'https://smartlockproject.herokuapp.com/api/getManageLocksByIds?token=';

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
		   	console.log(data);
		   	$(".loader").hide();
	   		if(typeof data.message == 'object' && data.message.length){
	   			var lockIcons = {"open":"fa fa-unlock-alt", "close":"fa fa-lock"};
	   			if(!data.message.length){
	   				var lock = "<li>lockid:"+data.message.lockid+"</li>";
		   			if(!!data.message.description){
		   				lock += "<li>"+data.message.description+"</li>";
		   			}
		   			lock +="<li><i class='"+lockIcons[data.message.status]+"'></i></li>";
		   			$("<div class='lockWrap' data-lock='"+ data.message.lockid +"''><ul class='lock'>"+lock+"</ul></div>").appendTo("#locksData");
	   			}

	   			for(var i =0; i< data.message.length; i++){
		   			var lock = "<li>lockid:"+data.message[i].lockid+"</li>";
		   			if(!!data.message[i].description){
		   				lock += "<li>"+data.message[i].description+"</li>";
		   			}
		   			lock +="<li><i class='"+lockIcons[data.message[i].status]+"'></i></li>";
		   			$("<div class='lockWrap' data-lock='"+ data.message[i].lockid +"''><ul class='lock'>"+lock+"</ul></div>").appendTo("#locksData");
		   		}	
	   		} else {
	   			$("#locksData").append("No Locks to manage");
	   			
	   		}

	   		$("#locksData .lockWrap").click(function(){
				console.log("ok");
				window.location.href = "/lock.html?lockid="+ $(this).attr('data-lock');
			});
	   		

				
		},
		error:function(e){
			console.log(e.responseText);
			$("#locksData").html("Server Error");
		}
	});
};