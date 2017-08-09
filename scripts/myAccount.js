$(document).ready(function(){
	getUserDetails();

	$("#edit").click(editDetails);

	$(".delete").click(deleteAccount);
});

var getUserDetails = function(){
	var url = 'https://smartlockproject.herokuapp.com/api/getUser?token=';
	var token = $.cookie("slock");

	if(!token || token == "null"){
		$(".account-data").html("Not logged in");
		return;
	}
	

	$.ajax({
	   url: url+ token,
	   xhrFields: {
	      withCredentials: true
	   },
	   cache: false,
	   crossDomain: true,
	   dataType: 'json',
	   method: "GET",
	   success: function(data){
	   		switch(data.status){
	   			case "success":
	   				console.log(data.message);
	   				$(".username-data").html(data.message.username);
	   				$(".phone-data").html(data.message.phone);
	   				break;
	   			case "error":
	   				$(".account-data").html("Server error");
	   				break;
	   		}

		},
		error:function(e){
			$(".account-data").html("Server error");
		}
	});
};

var editDetails = function(){
	$(".account-data").hide();
	$(".edit").show();

	$("input[name=submit]").click(updateUser);

};

var updateUser = function(e){
	e.preventDefault();
	var username = $("input[name=username]").val();
	var phone = $("input[name=phone]").val();
	$(".edit-msg").html("");

	if(!username || !phone){
		$(".edit-msg").html("Need to enter all properties");
		return;
	}

	var url = 'https://smartlockproject.herokuapp.com/api/updateUser/'+username+'/'+phone+'?token=';
	var token = $.cookie("slock");

	if(!token || token == "null"){
		$(".edit-msg").html("Not logged in");
		return;
	}

	$.ajax({
	   url: url+ token,
	   cache: false,
	   crossDomain: true,
	   dataType: 'json',
	   method: "PUT",
	   success: function(data){
	   		$(".edit-msg").html(data.message);
	   		setTimeout(function(){
	   			location.reload();
	   		}, 1000);
		},
		error:function(e){
			console.log(e);
			$(".edit-msg").html("server error");
		}
	});
};

var deleteAccount = function(){
	var url = 'https://smartlockproject.herokuapp.com/api/removeUser?token=';
	var token = $.cookie("slock");

	$.ajax({
	   url: url+ token,
	   cache: false,
	   crossDomain: true,
	   dataType: 'json',
	   method: "DELETE",
	   success: function(data){
	   		$(".edit-msg").html(data.message);
	   		$.cookie("slock","null");
	   		setTimeout(function(){
	   			location.href="index.html";
	   		}, 1000);
		},
		error:function(e){
			console.log(e);
			$(".edit-msg").html("server error");
		}
	});
};