$(document).ready(function(){
	$("#login-popup").hide();
	$("#login").click(function(e){
		$("#login-popup").fadeIn();	
	});
	$(".close-btn").click(function(e){
		$("#login-popup").hide();
	});

	if($.cookie("slock") && $.cookie("slock")!="null"){
		loggedIn();
	} 

	$("#loginBtn").click(loginAction);
	$("#verification-btn").click(verification);
	$("#sendCode").click(sendCode);
		
});


var loginAction = function(e){
	e.preventDefault();
	var url = "https://smartlockproject.herokuapp.com/api/login"; 
	$(".login-error-msg").html("");
	$.ajax({
		method: "POST",
		url: url,
		xhrFields: {
			withCredentials: true
		},
		cache: false,
		crossDomain: true,
		data: { username: $("#login-popup input[name=email]").val().toLowerCase(), password: $("#login-popup input[name=password]").val() },
		success: function(data){
			console.dir(data);

			switch(data.status){
				case "success":
					$("#login-popup").fadeOut();
					$.cookie("username", $("input[name=email]").val());
					$.cookie("slock", data.message.token);

					if(data.message.forgot_password){
						location.href="changePassword.html";
						return;
					}

					location.reload();
					break;
				case "error":
					if(data.message.message == "Need to verify mail first"){
						window.token = data.message.token;
						$("#loginWrap").toggle("slow");
						$("#verificationWrap").toggle("slow");
						return;
					}
					$(".login-error-msg").html(data.message);
					break;
				}

		}
	});
}

var loggedIn = function(){
	var logoutBtn = "<a href='index.html'>logout</a>";
	var profile = "<div id='profile'></div>";
	$("#login-popup").hide();
	$("#anonymous").hide();
	$(".loggedin").css("display", "inline-block");
	$(".greeting").html(profile+"<div id='user'>Hello "+$.cookie("username") + logoutBtn + "</div>");

	$(".greeting a").click(function(e){
		e.preventDefault();
		$.cookie("slock", null, { path: '/' });
		location.reload();
	});

	$(".greeting #profile").click(function(){
		location.href="myAccount.html";
	});
};

var verification = function(e){
	e.preventDefault();
	var url = "https://smartlockproject.herokuapp.com/api/validationCode"; 
	$(".verification-error-msg").html("");
	$.ajax({
		method: "POST",
		url: url,
		xhrFields: {
			withCredentials: true
		},
		cache: false,
		crossDomain: true,
		data: { 
			username: $("#login-popup input[name=email]").val(), 
			num1: $("#login-popup input[name=num1]").val(),
			num2: $("#login-popup input[name=num2]").val(),
			num3: $("#login-popup input[name=num3]").val(),
			num4: $("#login-popup input[name=num4]").val()
		},
		success: function(data){
			switch(data.status){
				case "error":
					$(".verification-error-msg").html(data.message);
					break;
				case "success":
					$("#login-popup").fadeOut();
					$.cookie("username", $("input[name=email]").val());
					$.cookie("slock", token);
					location.reload();
					break;
			}
			

		},
		error: function(err){
			console.log(err);
			$(".verification-error-msg").html("server error");
		}
	});
};

var sendCode = function(e){
	e.preventDefault();
	var url ="https://smartlockproject.herokuapp.com/api/sendValidCode";
	var username = $("#login-popup input[name=email]").val();

	$(".verification-error-msg").html("");

	$.ajax({
		method: "POST",
		url: url,
		xhrFields: {
			withCredentials: true
		},
		cache: false,
		crossDomain: true,
		data: { 
			username: username
		},
		success: function(data){
			switch(data.status){
				case "error":
					$(".verification-error-msg").html(data.message);
					break;
				case "success":
					$(".verification-error-msg").html("Code sent to the email "+username);
					break;
			}
			

		},
		error: function(err){
			$(".verification-error-msg").html(err);
		}
	});
};
