$(document).ready(function(){
	$("#contactUsForm button").click(function(e){
		e.preventDefault();
		sendContactUsMail();
	});
});

function sendContactUsMail(){
	var url = "https://smartlockproject.herokuapp.com/api/contactUs";
	var username = $("input[name=username]").val();
	var message = $("textarea[name=message]").val();

	if(!username){
		$(".message_data").html("Need to enter username");
		return;
	} else if( !message){
		$(".message_data").html("Need to enter message");
		return;
	}

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
	  		message: message
	  	},
	  	success: function(data){
        	console.dir(data);

			switch(data.status){
		  		case "success":
		  			$(".message_data").html("Message was sent successfully.");
		  			break;
		  		case "error":
		  			$(".message_data").html("Error occured.");
		  			break;
			}

		},
		error: function(err){
			console.log(err);
			$(".error-msg").html(JSON.parse(err.responseText).message);
		}
	});

}