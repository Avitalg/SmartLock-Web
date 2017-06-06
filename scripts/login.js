$(document).ready(function(){

	if($.cookie("slock") == "loggedin"){
		$("#login-popup").hide();
		$("#logs").css("display", "inline-block");
	}

	$("#loginBtn").click(function(e){
		 e.preventDefault();
		 var url = "https://smartlockproject.herokuapp.com/api/login"; 

		 $.ajax({
		  method: "POST",
		  url: url,
		  xhrFields: {
	      withCredentials: true
		   },
		   cache: false,
		   crossDomain: true,
		  data: { username: $("input[name=email]").val(), password: $("input[name=password]").val() },
		  success: function(data){
	         console.dir(data);

		  switch(data.status){
		  	case "success":
		  		$("#login-popup").fadeOut();
		  		$("#logs").css("display", "inline-block");
		  		$.cookie("slock", "loggedin");

		  		break;
		  	case "error":
		  		$(".error-msg").html(data.message);
		  		break;
			  }

			}
		});
	});
		
});