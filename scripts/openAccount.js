var openAccountSubmit = function(e){
	e.preventDefault();
	var username = $("input[name=username]").val();
	var password = $("input[name=password]").val();
	var phone = $("input[name=phone]").val();
	var lock = $("input[name=lock]").val();

	$.ajax({
	  	method: "POST",
	  	url: window.url,
	  	xhrFields: {
      		withCredentials: true
	   	},
	   	cache: false,
	   	crossDomain: true,
	  	data: { username: username, password: password, phone : phone, lockid:lock },
	  	success: function(data){
        	console.dir(data);

			switch(data.status){
		  		case "success":
		  			$(".error-msg").html("Thank you for joining us! You can now log in.");
		  			break;
		  		case "error":
		  			$(".error-msg").html(data.message);
		  			break;
			}

		}
	});

};

var managerAccount = function(){
	$("#openAccount input[name=lock]").toggle("slow");

	if($(this).is(":checked")) {
    	window.url = "https://smartlockproject.herokuapp.com/api/openManagerAccount"; 
    } else {
    	window.url = "https://smartlockproject.herokuapp.com/api/addUser"; 	
    }
}


$(document).ready(function(){
	window.url = "https://smartlockproject.herokuapp.com/api/addUser"; 
	$("#openAccount button").click(openAccountSubmit);
	$("#manager").change(managerAccount);
});