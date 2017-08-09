$(document).ready(function(){

	if(!$.cookie("slock") || $.cookie("slock") == "null"){
		$(".changePassContent").html("Need to login.");
		return;
	}
	$("#changePassBtn").click(changePassword);
});

var changePassword = function(e){
	e.preventDefault();

	var password = $("input[name=password]").val();
	var oldpass =  $("input[name=oldpass]").val();

	if(!password || !oldpass){
		$(".change-form-msg").html("You didn't enter all details.");
		return;
	}

	var token = $.cookie("slock");

	var url = 'https://smartlockproject.herokuapp.com/api/changePassword/'+password+"/"+oldpass+"?token="+token;	

	$(".change-form-msg").html("");

	$.ajax({
	   url: url,
	   cache: false,
	   crossDomain: true,
	   dataType: 'json',
	   method: "PUT",
	   success: function(data){
	   		$(".change-form-msg").html(data.message);
	   		
		},
		error:function(e){
			console.log(e.responseText);
			$(".change-form-msg").html("Server error");
		}
	});


};