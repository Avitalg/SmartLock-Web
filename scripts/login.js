$(document).ready(function(){

	if($.cookie("slock") == "loggedin"){
		$("#login-popup").hide();
		$("#logs").css("display", "inline-block");
	}

	$("#loginBtn").click(function(e){
		 e.preventDefault();
		 var url = "https://smartlockproject.herokuapp.com/api/login"; 
    	var jqxhr = $.post( url, { username: $("input[name=email]").val(), password: $("input[name=password]").val() }, function(data) {
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

		})
		  .done(function() {
		    //alert( "second success" );
		  })
		  .fail(function(e) {
		    //alert( "error" );
		    console.dir(e.responseText);
		    var error = JSON.parse(e.responseText);
		    $(".error-msg").html(error.message);
		  })
		  .always(function() {
		    //alert( "finished" );
		  });
		});
});