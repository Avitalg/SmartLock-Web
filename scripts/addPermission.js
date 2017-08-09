var addPermissionSubmit = function(e){
	e.preventDefault();
	var username = $("input[name=username]").val();
	var type = $("input[name=type]:checked").val();
	var freq = $("input[name=freq]:checked").val();
	var date = $("input[name=date]").val();
	var start = $("input[name=start-time]").val();
	var end = $("input[name=end-time]").val();

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
	

	var lockid = getUrlParam("lockid");

	var url = "https://smartlockproject.herokuapp.com/api/addPermission?token="+$.cookie("slock");

	if(window.once){
		starts[0] = start;
		ends[0] = end;
		date = new Date(date);
		date = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();

	} else {
		for(var i=0; i<7; i++){
			if(!starts[i]) starts[i] = 0;
			if(!ends[i]) ends[i] = 0;
		}

	}
	$(".error-msg").html("");
	$.ajax({
	  	method: "POST",
	  	url: url,
	  	xhrFields: {
      		withCredentials: true
	   	},
	   	cache: false,
	   	crossDomain: true,
	  	data: { 
	  		username: username, 
	  		lockid: lockid, 
	  		frequency: freq,
	  		date: date, 
	  		type: type,
	  		start1: starts[0],
	  		start2: starts[1],
	  		start3: starts[2],
	  		start4: starts[3],
	  		start5: starts[4],
	  		start6: starts[5],
	  		start7: starts[6],
	  		end1: ends[0],
	  		end2: ends[1],
	  		end3: ends[2],
	  		end4: ends[3],
	  		end5: ends[4],
	  		end6: ends[5],
	  		end7: ends[6]
	  	},
	  	success: function(data){
        	console.dir(data);

			switch(data.status){
		  		case "success":
		  			$(".error-msg").html("Permission was saved successfully.");
		  			setTimeout(function(){
		  				location.href = "/lock.html?lockid="+lockid;
		  			}, 3000);
		  			break;
		  		case "error":
		  			$(".error-msg").html(data.message);
		  			break;
			}

		},
		error: function(err){
			console.log(err);
			$(".error-msg").html(JSON.parse(err.responseText).message);
		}
	});

};

var permissionFreq = function(){

	var freq = $("input[name=freq]:checked").val();
	console.log(freq);
	switch(freq){
		case "always":
			window.once = false;
			$("#addPermission .once").hide("slow");
			$("#addPermission .always").show("slow");
			break;
		case "once":
			window.once = true;
			$("#addPermission .once").show("slow");
			$("#addPermission .always").hide("slow");
			break;

	}
};

var permissionType = function(){
	var type = $("input[name=type]:checked").val();

	switch(type){
		case "1":
			$("input[name=freq][value='always'").prop('checked', true);
			$("input[name=freq]").prop("disabled", "true");
			$(".always").hide("slow");
			$(".once").hide("slow");
			break;
		default:
			$("input[name=freq]").prop('disabled', false);
			$("input[name=freq]").change();

	}

};


$(document).ready(function(){
	window.once = true; 
	
	$(".back").click(function(){
		location.href="permissions.html";
	});

	if($.cookie("slock") && $.cookie("slock")!="null"){
		$("#addPermission button").click(addPermissionSubmit);
		$("input[name=freq]").change(permissionFreq);
		$("input[name=type]").change(permissionType);
	} else{
		$("#addPermission").html("Need to log in");
	}
	
});