$(function(){
	$('button').click(function(){
		var user = document.getElementById("inputUsername").value;
		console.log(user);
		$.ajax({
			url: '/signUpUser',
			data: JSON.stringify({username:user}),
			type: 'POST',
			async: false, 
			dataType: 'json',
        	contentType: "application/json; charset=utf-8",

			success: function(response){
				console.log(response);
				console.log(response.status);

			},
			error: function(error){
				console.log(error);
			}
		});
	});
});