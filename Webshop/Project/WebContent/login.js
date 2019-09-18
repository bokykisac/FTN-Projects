$(document).ready(function() {
	
	$('#login').submit(function(event) {
		
		event.preventDefault();
		let username = $('input[name="txtusername"]').val();
		let password = $('input[name="txtpassword"]').val();

		$.post({
			url: 'rest/login',
			data: JSON.stringify({username: username, password: password}),
			contentType: 'application/json',
			success: function() {
				window.location='./webshop.html';
			},
			error: function() {
				$('#error').text("Neispravan username i/ili sifra!");
				$("#error").show().delay(3000).fadeOut();
			}
		});
	});
});

function getLoggedUser(){
	
	var result = null;
	
	$.get({
		
		url: 'rest/currentUser',
		contentType: 'application/json',
		async: false,
		success: function(user){
			result = user;
		},
		error: function(){
			alert('doslo je go greske');
		}
			
	});	
	
	return result;
}
