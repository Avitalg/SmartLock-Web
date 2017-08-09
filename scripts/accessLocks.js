$(document).ready(function(){
	getUsersLocks();

	$(".errMsg .close-btn").click(function(e){$(".errMsg").hide();})
});

function getUsersLocks(){
	var url = 'https://smartlockproject.herokuapp.com/api/getLocksByUser?token=';

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
	   		if(!!data.message && typeof data.message.userLocks == 'object'){
	   			for(var i =0; i< data.message.userLocks.length; i++){
		   			var lock = "<li class='lockid'>lockid:"+data.message.userLocks[i].lockid+"</li>";
		   			if(!!data.message.userLocks[i].description){
		   				lock += "<li class='description'>"+data.message.userLocks[i].description+"</li>";
		   			}
		   			if(data.message.userLocks[i].status == "open") lock +="<i  class='fa fa-unlock-alt' aria-hidden='true'></i>";
		   			else lock +="<i  class='fa fa-lock' aria-hidden='true'></i>";
		   			lock+="<div class='loader'><img src='images/loader.gif' alt='loader'><div>";
		   			$("<div class='lockWrap'><ul class='lock' data-status='"+data.message.userLocks[i].status+"' data-lock='"+ data.message.userLocks[i].lockid +"'>"+lock+"</ul></div>").appendTo("#locksData");
		   			getUserPermission(data.message.userLocks[i].lockid);
		   		}	
	   		} else {
	   			$("#locksData").append("No Locks to manage");
	   			
	   		}

	   		$("#locksData .lockWrap .lock").click(function(){
				console.log("ok");
				var action;
				$(this).find(".loader").show();
				if($(this).attr('data-status') == "open"){
					action = "lock";
					//$(this).attr('data-lock', "close");

				} else {
					action="unlock";
				}

				lockAction(action,$(this).attr('data-lock'), $(this));
			});
	   		

				
		},
		error:function(e){
			console.log(e.responseText);
			$("#locksData").html("Server Error");
		}
	});
}

function getUserPermission(lockid){
	var url = "https://smartlockproject.herokuapp.com/api/getPermission/"+$.cookie("username")+"/"+lockid+"?token=";

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
	   	var cmdPer = "Show";
	    var permissions="<div class='seePer'>Show Permissions</div><ul class='perList'>";
	   	switch(data.status){
	   		case "success":
	   			if(data.message.type == 0 || data.message.type == 1){
	   				var fingerPrint;

	   				if(!data.message.physicalId){
	   					fingerPrint = "<div class='addFingerPrint'></div>";
	   				} else {
	   					fingerPrint = "<div class='removeFingerPrint'></div>";
	   				}

	   				$(".lockWrap .lock[data-lock='"+lockid+"']").after(fingerPrint);


	   				$(".addFingerPrint").click(function(){
	   					lockAction("addFingerprint", lockid);
	   				});

	   				$(".removeFingerPrint").click(function(){
	   					lockAction("delFingerprint", lockid);
	   				});
	   			}

		   		if(data.message.duration){
		   			var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		   			var duration = data.message.duration;
		   			for(var i=0 ; i<days.length; i++){
		   				permissions += "<li><span>"+days[i] +" :</span> "+duration[days[i]].start +"-" +duration[days[i]].end+"</li>";
		   			}
		   		} else {
		   			var date = new Date(data.message.date).getDate() + "/" + (new Date(data.message.date).getMonth()+1) +"/" + new Date(data.message.date).getFullYear();
		   			permissions += "date:"+date + ", time:"+data.message.hours.start+"-" + data.message.hours.end;
		   		}

		   		permissions += "</ul></div>";
		   		$(".lockWrap .lock[data-lock='"+lockid+"']").after(permissions);
		   		$(".seePer").click(function(){
		   			if(cmdPer == "Show"){
		   				cmdPer = "Hide";	
		   				$(this).html("Hide Permissions");
		   			} else {
		   				cmdPer = "Show";
		   				$(this).html("Show Permissions");
		   			} 
		   			
		   			$(this).siblings("ul").toggle("slow");

		   		});
		   		break;
		   	case "error":
		   		break;

	   	}
	   		
	   }, 
	   error: function(data){

	   }
	});

}

function lockAction(action, lockid, lock){

	var url = "https://smartlockproject.herokuapp.com/api/requestLockAction/"+action+"?token="+$.cookie("slock");

	$.ajax({
		method: "POST",
		url: url,
		xhrFields: {
			withCredentials: true
		},
		cache: false,
		crossDomain: true,
		data: { 
			lockid: lockid
		},
		success: function(data){
			console.dir(data);
			$(".loader").hide();
			
			switch(data.status){
			case "success":case "request created":
				if(action == "lock" || action == "unlock"){
					checkRequest(data.requestId, lockid, lock);
				}else {
					location.reload();
				}
				break;
			default:
				$(".errMsg .content").html(data.message);
				$(".errMsg").show();
				
			}
	

		},
		error: function(err){
			$(".loader").hide();
			console.dir(err);
			$(".errMsg .content").html("error");
			$(".errMsg").show();
		}
	});

};

var checkRequest = function(requestid, lockid, lock){
var url = "https://smartlockproject.herokuapp.com/api/checkLockAction/"+requestid+"?token="+$.cookie("slock");
	$(lock).find(".loader").show();
	$.ajax({
		method: "GET",
		url: url,
		xhrFields: {
			withCredentials: true
		},
		cache: false,
		crossDomain: true,
		success: function(data){
			switch(data.status){
				case "timeout":
					$(lock).find(".loader").hide();
					$(".errMsg .content").html("Can't connect to lock");
					$(".errMsg").show();
					break;
				case "unhandle":
					checkRequest(requestid, lockid, lock);
					break;
				default:
					$(lock).find(".loader").hide();
					if($(lock).attr('data-status') == "open"){
						$(lock).attr('data-status', "close");
						$(lock).find("i.fa-unlock-alt").removeClass("fa-unlock-alt").addClass("fa-lock");

					} else {
						$(lock).attr('data-status',"open");
						$(lock).find("i.fa-lock").removeClass("fa-lock").addClass("fa-unlock-alt");
					}

			}
		}
	});

};