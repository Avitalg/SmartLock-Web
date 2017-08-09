$(document).ready(function(){
$(".read-more").on("click", function(){
	location.href="about.html";
});

$("#mobileBar").click(function(){
        //if logged in- show all menu
        if($.cookie("slock") && $.cookie("slock")!="null" ){
            $("#navBar").slideToggle("slow");
            $("#navBar li").css("display", "block");
        } else {// else hide loggedin class
            $("#navBar").slideToggle("slow");
            $("#navBar li:not(.loggedin)").css("display", "block");
        }
        
    });
});


var getUrlParam = function(param) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName;

    for (var i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === param) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};