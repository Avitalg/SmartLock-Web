$(document).ready(function(){
	var lockid = getUrlParam("lockid");

	$(".back").click(function(){
		location.href="permissions.html";
	});

	if($.cookie("slock") && $.cookie("slock") !="null" && !!lockid){
		getPermissions(lockid);
	}  else {
		$("#permissions").html("Need to log in");
	}

	$("#addUser").click(function(){addPermission(lockid);});
});

var getPermissions = function(param){
	var url = 'https://smartlockproject.herokuapp.com/api/getPermissionsByLock/'+param+'?token='+$.cookie("slock");

	$.ajax({
	   url: url,
	   xhrFields: {
	      withCredentials: true
	   },
	   cache: false,
	   crossDomain: true,
	   dataType: 'json',
	   method: "GET",
	   success: function(data){
	   	$(".loader").hide();
	   	console.log(data);
	   		if(!!data.message && data.message.length && data.status == "success"){
	   			var types = ["manager", "with fingerprint", "standard"];
	   			for(var i =0; i< data.message.length; i++){
		   			var permission = "<li><span>username:</span>"+data.message[i].username+"</li>" +
		   			"<li><span>type:</span>"+types[data.message[i].type]+"</li>" +
		   			"<li><span>frequency:</span>"+data.message[i].frequency+"</li>";
		   			if(data.message[i].date){
		   				var date = new Date(data.message[i].date).getDate() +"/"+(new Date(data.message[i].date).getMonth()+1)+"/"+new Date(data.message[i].date).getFullYear();
		   				permission += "<li> <span>date:</span>"+date+"</li>";
		   			}
		   			if(data.message[i].hours){
		   				permission += "<li><span>hours:</span>"+data.message[i].hours.start+"-"+data.message[i].hours.end+"</li>";
		   			}

		   			if(data.message[i].duration){
		   				var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		   				permission += "<div id='duration'>";
		   				for(var j=0; j<days.length; j++){
		   					permission += "<li><span>"+days[j]+":</span> <br>"+data.message[i].duration[days[j]].start+"-"+data.message[i].duration[days[j]].end+"</li>";
		   				}
		   				permission += "</div>";
		   			}
		   			
		   			$("<div class='perWrap' data-user='"+ data.message[i].username +"''><ul class='permission'>"+permission+"</ul><div class='delete' data-user='"+data.message[i].username+"'>DELETE</div><div class='update' data-user='"+data.message[i].username+"'>UPDATE</div></div>").appendTo("#permissions");


		   			$(".perWrap .delete").click(function(){
		   				var username = $(this).attr("data-user");
		   				removePermission(username,param);
		   			});

		   			$(".perWrap .update").click(function(){
		   				var username = $(this).attr("data-user");
		   				location.href="updatePermission.html?lockid="+param+"&username="+username;
		   			});
		   		}	
	   		} else if(data.status == "error"){
	   			$("#permissions").append(data.message);
	   		}
			
		},
		error:function(e){
			console.log(e.responseText);
			$("#locksData").html("Server Error");
			clearInterval(window.getLogs);
		}
	});
};



var removePermission = function(username, lockid){
	var url = "https://smartlockproject.herokuapp.com/api/removePermission/"+username+"/"+lockid+"?token="+$.cookie("slock");

	$.ajax({
	   url: url,
	   xhrFields: {
	      withCredentials: false
	   },
	   cache: false,
	   crossDomain: true,
	   dataType: 'json',
	   method: "DELETE",
	   success: function(data){
	   	$('.server-message').show();
	   	console.log(data);
	   	$(".server-message").html(data.message);

	   	setTimeout(function(){
	   		window.location.reload();
	   	}, 1000);
			
		},
		error:function(e){
			$('.server-message').show();
			console.log(e.responseText);
			$(".server-message").html("error");
		}
	});
};

var addPermission = function(lockid){
	window.location.href = "/addPermission.html?lockid="+lockid;
};