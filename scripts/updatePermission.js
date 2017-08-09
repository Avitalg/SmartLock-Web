$(document).ready(function(){
	window.lockid = getUrlParam("lockid");
	window.username = getUrlParam("username");

	$('.seePer').click(function(){
		location.href="lock.html?lockid="+lockid;
	})

	if(!$.cookie("slock") || $.cookie("slock")=="null"){
		//need to login
		$(".updatePermission").html("Need to login");
		return;
	}

	$("#updatePer").prop('disabled', true);

	if(lockid && username){
		getPermission(lockid, username);
	}
	

	
});

var doubleDigit = function(num){
	if(num<10){
		return "0"+num;
	}
	return num;
}

var getPermission = function(lockid, username){
	var url = 'https://smartlockproject.herokuapp.com/api/getPermission/'+username+"/"+lockid+'?token='+$.cookie("slock");

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
	   		console.log(data);
	   		switch(data.status){
	   			case "success":
	   				$("input[name=username]").val(data.message.username);
	   				$("input[name=freq][value="+data.message.frequency+"]").prop('checked', true);
	   				$("input[name=type][value="+data.message.type+"]").prop('checked', true);
	   				$('input[name=freq]').trigger("change");

	   				$("#updatePer").prop('disabled', false);
	   				$("#updatePer").click(updatePermission);

	   				if(data.message.frequency == "once"){
	   					var date = new Date(data.message.date);
	   					$("input[type=date]").val(date.getFullYear()+"-"+doubleDigit(date.getMonth()+1)+"-"+doubleDigit(date.getDate()));
	   					$("input[name=start-time]").val(data.message.hours.start);
	   					$("input[name=end-time]").val(data.message.hours.end);
	   					return;

	   				}

  					$("input[name=start1]").val(data.message.duration.Sunday.start);
  					$("input[name=end1]").val(data.message.duration.Sunday.end);
  					$("input[name=start2]").val(data.message.duration.Monday.start);
  					$("input[name=end2]").val(data.message.duration.Monday.end);
  					$("input[name=start3]").val(data.message.duration.Tuesday.start);
  					$("input[name=end3]").val(data.message.duration.Tuesday.end);
  					$("input[name=start4]").val(data.message.duration.Wednesday.start);
  					$("input[name=end4]").val(data.message.duration.Wednesday.end);
  					$("input[name=start5]").val(data.message.duration.Thursday.start);
	   				$("input[name=end5]").val(data.message.duration.Thursday.end);
	   				$("input[name=start6]").val(data.message.duration.Friday.start);
	   				$("input[name=end6]").val(data.message.duration.Friday.end);
	   				$("input[name=start7]").val(data.message.duration.Saturday.start);
	   				$("input[name=end7]").val(data.message.duration.Saturday.end);

	   				var emptyTimes = $('input[type=time]').filter(function() { return this.value == ""; });

	   				for(var i=0; i<emptyTimes.length; i++){
	   					emptyTimes[i].value="00:00";
	   				}

	   				break;
	   			case "error":
	   				break;
	   		}
		},
		error:function(e){
			console.log(e);
		}
	});
};

var updatePermission = function(e){
	e.preventDefault();
	var token = $.cookie("slock");
	var type = $("input[name=type]:checked").val();
	var freq = $("input[name=freq]:checked").val();
	var date = $("input[name=date]").val().split("-");
	var start = $("input[name=start-time]").val();
	var end = $("input[name=end-time]").val();

	date = date[2]+"-"+date[1]+"-"+date[0];

	var starts = [
		$("input[name=start1]").val(),
		$("input[name=start2]").val(),
		$("input[name=start3]").val(),
		$("input[name=start4]").val(),
		$("input[name=start5]").val(),
		$("input[name=start6]").val(),
		$("input[name=start7]").val()
	];

	var ends = [
		$("input[name=end1]").val(),
		$("input[name=end2]").val(),
		$("input[name=end3]").val(),
		$("input[name=end4]").val(),
		$("input[name=end5]").val(),
		$("input[name=end6]").val(),
		$("input[name=end7]").val()
	];

	var url = 'https://smartlockproject.herokuapp.com/api/updatePermission/'+username+"/"+lockid+"/"+freq+"/"+type+"/";

	switch(freq){
		case "once":
			url+=date + "/"+start+"/"+end
			break;
		case "always":
			url+=starts[0]+"/"+ends[0]+"/"+starts[1]+"/"+ends[1]+"/"+starts[2]+"/"+ends[2]+"/"+starts[3]+"/"+ends[3]+"/"+starts[4]+"/"+ends[4]+"/"+starts[5]+
			"/"+ends[5]+"/"+starts[6]+"/"+ends[6]
			break;
	}

	url+="?token="+token;

	$.ajax({
	   url: url,
	   cache: false,
	   crossDomain: true,
	   dataType: 'json',
	   method: "PUT",
	   success: function(data){
	   		console.log(data);
	   		$(".update-msg").html(data.message);
	   		
	   		if(data.status=="success"){
	   			setTimeout(function(){
		   			location.reload();
		   		},1000);	
	   		}
	   		
		},
		error:function(e){
			console.log(e);
			$(".update-msg").html("server error");
		}
	});



};

/*
app.put('/api/updatePermission/:username/:lockid/:frequency/:type/:start1/:end1/:start2/:end2/:start3/:end3/:start4/:end4' +
        '/:start5/:end5/:start6/:end6/:start7/:end7', permissions.updatePermission);
    app.put('/api/updatePermission/:username/:lockid/:frequency/:type/:date/:start1/:end1', permissions.updatePermission);
*/
