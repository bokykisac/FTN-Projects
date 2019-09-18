$(document).ready(() => {
	
	
	$('#registrationForm').submit((event) => {
		event.preventDefault();
		
		let username = $('input[name="txtusername"]').val();
		let password = $('input[name="txtpassword"]').val();
		let name = $('input[name="txtname"]').val();
		let lastname = $('input[name="txtlastname"]').val();
		let contact = $('input[name="txtcontact"]').val();
		let city = $('input[name="txtcity"]').val();
		let email = $('input[name="txtemail"]').val();
		
		if(username == ''){
			alert('Korisnicko ime i lozinka moraju biti popunjeni!');
			return;
		}
		if(password == ''){
			alert('Korisnicko ime i lozinka moraju biti popunjeni!');
			return;
		}
		
		let fullDate = new Date();
		let shortDate = fullDate.toLocaleDateString();
		
		let role = 1;
		
		$.post({
			url: 'rest/register',
			data: JSON.stringify({username: username, password: password, firstName: name, lastName: lastname,
				role: role, phone: contact, city: city, email: email, date: shortDate}),
			contentType: 'application/json',
			success: function(){
				alert('Uspesna registracija!');
				window.location = './login.html';
			},
			error: function(){
				alert("Doslo je do greske!");
			}
		});
		
	});
	
});