$(document).ready(function(){
	$("#forgotPassBtn").click(forgotPassword);
});


var forgotPassword = function(e){
	e.preventDefault();

	var username = $("input[name=username]").val();

	if(!username){
		$(".forgot-form-msg").html("You didn't enter your email.");
		return;
	}

	var url = 'https://smartlockproject.herokuapp.com/api/forgotPassword/'+username;	

	$(".forgot-form-msg").html("");

	$.ajax({
	   url: url,
	   cache: false,
	   crossDomain: true,
	   dataType: 'json',
	   method: "PUT",
	   success: function(data){
	   		
	   		switch(data.status){
	   			case "error":
	   				$(".forgot-form-msg").html(data.message);
	   				break;
	   			case "success":
	   				$(".forgot-form-msg").html("Please check your email for your new password.");
	   				break;
	   		}
		   	

		},
		error:function(e){
			console.log(e.responseText);
		}
	});
};