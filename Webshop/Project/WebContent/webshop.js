var currentUser = null;
var img64 = null;
var recensionImage = null;
var allAdvertisements = [];
var sortedAds = [];
var allMessages = [];
var allUsers = [];
var allCategories = [];
var allRecensions = [];
var cities = [];

					//-----------------  INITIALISE -----------------


/*	funkcija za: 
 * dodavanje oglasa svakom prodavcu
 * dodavanje kategorije svakom oglasu
 * NOTE: Ovo ce raditi samo ako nije bilo promena u faljovima - kad se sami fajlovi naprave (10 oglasa, 3 kategorije, 3 prodavca)
 */ 
function initialise(){
	
$.get({
		
		url: 'rest/initSellers',
		contentType: 'application/json',
		success: function(){
			console.log('uradio je nesto');
		},
		error: function(){
			alert('doslo je go greske');
		}
			
	});	
	
	
}

					//-----------------  END INITIALISE -----------------


// funkcija za generisanje ID-a
function generateUUID() {
	 return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
	   (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	 )
}


					//----------------- USERS -----------------

/* ovu opciju ima samo admin
 * funkcija za dodavanje korisnika u drop-down meni, kojima ce se menjati uloga
 */
function addUsersCB(user){	
	
	if(user.role == 0)
		return;
	
	$('#selectUsers').append(new Option(user.username + " (" + user.firstName + ")", user.role));
}

// kada se zatvori modalni dialog, sve se deselektuje i oznacena vrednost se stavi na default (5)
function closeUserType(){

	$('#inlineRadio1').prop("checked", false);
	$('#inlineRadio2').prop("checked", false);
	$('#inlineRadio3').prop("checked", false);
	$('#selectUsers').val(5);
}

// menjanje uloga korisnicima
function roleChanged(){
	
	var role = $('#selectUsers option:selected').val();
	var username = $("#selectUsers option:selected").text();
	
	if($('#inlineRadio1').prop("checked") == true){
		role = 0;
	}else if($('#inlineRadio2').prop("checked") == true)
		role = 1;
	else if($('#inlineRadio3').prop("checked") == true){
		role = 2;
	}
	
	if(role == 5){
		return;
	}
	
	$.post({
		url: 'rest/changeRole/' + username + '/' + role,
		contentType: 'application/json',
		success: function(){
			window.location = "./webshop.html";
		},
		error: function(){
			console.log('error');
		}
	});
	
}

					//----------------- END USERS -----------------





					//----------------- SEARCH -----------------

// dodavanje grafova u dropdown meni u searchu
function addCitiesToDropDown(ad){
	
	if(cities.length == 0){
		cities.push(ad.city);
	}else{
		if(cities.includes(ad.city)){
			return;
		}
		else{
			cities.push(ad.city);
			$('#searchCity').append(new Option(ad.city, ad.city));
		}
	}

}

// izilstavanje oglasa po zeljenim kriterijumima
function searchAds(){
	
	var arrayName = [];
	
	var name = $('#searchName').val();
	var minPrice = $('#serachMinPrice').val();
	var maxPrice = $('#searchMaxPrice').val();	
	var minLikes = $('#serachMinReview').val();
	var maxLikes = $('#serachMaxReview').val();
	var dateMin = $('#serachDateMin').val();
	var dateMax = $('#serachDateMax').val();
	var city = $('#searchCity').val();
	var status = $('#searchStatus').val();

	
	// pretraga po imenu
	
	for(var a of allAdvertisements){
		if(a.name.toLowerCase().includes(name.toLowerCase())){
			arrayName.push(a);
		}
	}
	
	// pretraga po ceni
	
	var arrayPrice = [];
	
	
	if(minPrice == '')
		minPrice = 0;

	if(maxPrice == ''){
		for(var a of arrayName){
			if(a.price > minPrice){
				arrayPrice.push(a);
			}
		}
	}else{
		for(var a of arrayName){
			if(a.price > minPrice && a.price < maxPrice){
				arrayPrice.push(a);
			}
		}
	}
	
	// pretraga po lajkovima
	
	var arrayLikes = [];
	
	if(minLikes == '')
		minLikes = 0;
	
	if(maxLikes == ''){
		for(var a of arrayPrice){
			if(a.numLikes > minLikes){
				arrayLikes.push(a);
			}
		}
	}
	else{
		for(var a of arrayPrice){
			if(a.numLikes > minLikes && a.numLikes < maxLikes){
				arrayLikes.push(a);
			}
		}
	}
	
	// pretraga po datumu
	
	var arrayDate = [];
	
	
	if(dateMin == '' && dateMax == ''){
		
		for(var a of arrayLikes)
			arrayDate.push(a);
		
	}
	else if(dateMin == ''){
		
		var dMax = new Date(dateMax);
		var dateMaxMilisecs = dMax.getTime();
		
		for(var a of arrayLikes){
			
			var adExpired = new Date(a.dateExpired);
			
			if(adExpired.getTime() < dateMaxMilisecs){
				arrayDate.push(a);
			}
		}
		
	}
	else if(dateMax == ''){
		
		var dMin = new Date(dateMin);
		var dateMinMilisecs = dMin.getTime();
		
		for(var a of arrayLikes){
			
			var adPublished = new Date(a.datePublished);
			
			if(adPublished.getTime() > dateMinMilisecs){
				arrayDate.push(a);
			}
		}
	}
	else{
		
		var dMin = new Date(dateMin);
		var dateMinMilisecs = dMin.getTime();
		
		var dMax = new Date(dateMax);
		var dateMaxMilisecs = dMax.getTime();
		
		
		for(var a of arrayLikes){
			var adPublished = new Date(a.datePublished);
			var adExpired = new Date(a.dateExpired);
			
			if(adPublished.getTime() > dateMinMilisecs && adExpired.getTime() < dateMaxMilisecs){
				arrayDate.push(a);
			}
		}
		
	}
	
	// pretraga po gradu
	var arrayCity = [];
	
	if(city == null){
		for(var a of arrayDate)
			arrayCity.push(a);
	}
	else{
		for(var a of arrayDate){
			if(city == a.city){
				arrayCity.push(a);
			}
		}
	}
	
	// pretraga po statusu
	var arrayStatus = [];
	
	if(status == null){
		for(var a of arrayCity){
			arrayStatus.push(a);
		}
	}
	else{
		for(var a of arrayCity){
			if(status == a.status){
				arrayStatus.push(a);
			}
		}
	}
	
	// dodavanje u konacnu listu
	var finalArray = [];
	
	for(var a of arrayStatus){
		finalArray.push(a);
	}
	
	showSearchAds(finalArray);
	
	
}

//prikazivanje trazenih oglasa
function showSearchAds(finalArray){
		
	$('#divMsgInbox').attr('hidden', true);
	$('#adsItems').attr('hidden', false);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', false);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	$('#adsItems').html('');
	
	for(var ad of finalArray){
		
		if(ad.active == false){
			continue;
		}
		
		if(currentUser !== null && currentUser !== undefined){
			if(currentUser.role == 0){	//admin
				
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						"id=\"" + ad.idAd + "\"" + ">" + 
						"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
						"<p class=\"card-text\">" + ad.price + "</p>" +
						"</div><div class=\"card-footer\">" +
						"<small class=\"text-muted\">"+
						"<img src=\"Images/edit.png\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px; padding:0px\" class=\"adIcons\">"+
						"<img src=\"Images/delete.png\" id=\"remove" + ad.idAd + "\" onclick=\"removeAd(this.id)\" align=\"right\" style=\"margin:0px 5px\" class=\"adIcons\">"+
						"</small>" + 
						"</div>" +
						"</div>" + "</div>"); 
				
				
			}else if(currentUser.role == 1){	//buyer
				
				if(currentUser.buyerOrderedAds.includes(ad.idAd)){
					continue;
				}
				
				if(currentUser.buyerFavouriteAds.includes(ad.idAd)){
					
					$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
							"id=\"" + ad.idAd + "\"" + " style=\"border: 2px solid rgba(255,165,0,0.4);\">" + 
							"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
							"<div class=\"card-body\">" +
							"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
							"<p class=\"card-text\">" + ad.price + "</p>" +
							"</div><div class=\"card-footer\">" +
							"<small class=\"text-muted\">"+
							"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
							"<img src=\"Images/cart.png\" align=\"right\" id=\"ord"+ad.idAd+"\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\" onclick=\"addAddToOrdered(this.id)\">"+
							"<img src=\"Images/star.png\" align=\"right\" id=\"img"+ad.idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToFavourites(this.id)\">"+ 
							"</small>" + 
							"</div>" +
							"</div>" + "</div>");
					
				}else{
					
					$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
							"id=\"" + ad.idAd + "\"" + ">" + 
							"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
							"<div class=\"card-body\">" +
							"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
							"<p class=\"card-text\">" + ad.price + "</p>" +
							"</div><div class=\"card-footer\">" +
							"<small class=\"text-muted\">" +
							"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
							"<img src=\"Images/cart.png\" align=\"right\" id=\"ord"+ad.idAd+"\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\" onclick=\"addAddToOrdered(this.id)\">"+
							"<img src=\"Images/star_blank.png\" align=\"right\" id=\"img"+ad.idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToFavourites(this.id)\">"+
							"</small>" +
							"</div>" +
							"</div>" + "</div>");
				}				
				
			}else if(currentUser.role == 2){	//seller
				
					if(ad.publisher == currentUser.username){
						
						if(ad.status == 0 || ad.status == 1){
							
							$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
									"id=\"" + ad.idAd + "\"" + "style=\"border: 2px solid rgba(50,205,50,0.4);\">" + 
									"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
									"<div class=\"card-body\">" +
									"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
									"<p class=\"card-text\">" + ad.price + "</p>" +
									"<p align=\"center\">(Isporucen)</p>" +
									"</div><div class=\"card-footer\">" +
									"<small class=\"text-muted\">"+
									"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
									"<span><img src=\"Images/edit.png\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\">"+
									"<img src=\"Images/approved.png\" align=\"right\" style=\"margin:0px 5px\"></span>"+
									"</small>" + 
									"</div>" +
									"</div>" + "</div>");
							
							
						}else{
							
							$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
									"id=\"" + ad.idAd + "\"" + "style=\"border: 2px solid rgba(0,123,255,0.4);\">" + 
									"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
									"<div class=\"card-body\">" +
									"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
									"<p class=\"card-text\">" + ad.price + "</p>" +
									"</div><div class=\"card-footer\">" +
									"<small class=\"text-muted\">"+
									"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
									"<img src=\"Images/edit.png\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\">"+
									"<img src=\"Images/delete.png\" id=\"remove" + ad.idAd + "\" onclick=\"removeAd(this.id)\" align=\"right\" style=\"margin:0px 5px\" class=\"adIcons\">"+
									"</small>" + 
									"</div>" +
									"</div>" + "</div>");
						}		
						continue;
					}
				
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						"id=\"" + ad.idAd + "\"" + ">" + 
						"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
						"<p class=\"card-text\">" + ad.price + "</p>" +
						"</div><div class=\"card-footer\">" +
						"<small class=\"text-muted\">"+
						"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
						"</small>" + 
						"</div>" +
						"</div>" + "</div>");
			}
		}
		else{ //guest
			$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
					"id=\"" + ad.idAd + "\"" + ">" + 
					"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
					"<div class=\"card-body\">" +
					"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
					"<p class=\"card-text\">" + ad.price + "</p>" +
					" <p class=\"card-text\"><small class=\"text-muted\">"+
					"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
					"</small></p>" + 
					"</div>" +
					"</div>" + "</div>"); 
		}
	}
	
	
	
}

// prikazi div za trazenje usera i popuni tabelu svim korisnicima
function showUsers(){
	
	$('#userTableBody').html('');
	
	for(var u of allUsers){
		$('#userTableBody').append("<tr><td>" + u.firstName + "</td>" +
				"<td>" + u.lastName + "</td>" +
				"<td>" + u.phone + "</td>" +
				"<td>" + u.city + "</td>" +
				"<td>" + u.email + "</td>" +
				"<td>" + u.date + "</td></tr>"); 	
	}
	
	$('#createRecension').attr('hidden', true);
	$('#adsItems').attr('hidden', true);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgInbox').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#changeRecension').attr('hidden', true);
	$('#usersDiv').attr('hidden', false);
	$('#detailedAd').attr('hidden', true);
	
	$('#formUsers').submit((event) => {
		event.preventDefault();
		
		showSearchedUsers();		
		
		});
}

// trazenje korisnika po kriterijumu i dodavanje u tabelu
function showSearchedUsers(){
	
	$('#userTableBody').html('');
	
	var name = $('#seearchUserName').val();
	var city = $('#seearchUserCity').val();
	
	if(name == '' && city == ''){
		for(var u of allUsers){
			$('#userTableBody').append("<tr><td>" + u.firstName + "</td>" +
					"<td>" + u.lastName + "</td>" +
					"<td>" + u.phone + "</td>" +
					"<td>" + u.city + "</td>" +
					"<td>" + u.email + "</td>" +
					"<td>" + u.date + "</td></tr>"); 	
		}
	}
	else if(name == '' && city != ''){
		for(var u of allUsers){
			if(u.city.toLowerCase().includes(city.toLowerCase())){
				$('#userTableBody').append("<tr><td>" + u.firstName + "</td>" +
						"<td>" + u.lastName + "</td>" +
						"<td>" + u.phone + "</td>" +
						"<td>" + u.city + "</td>" +
						"<td>" + u.email + "</td>" +
						"<td>" + u.date + "</td></tr>"); 	
			}
		}
		
		
	}
	else if(name != '' && city == ''){
		for(var u of allUsers){
			if(u.firstName.toLowerCase().includes(name.toLowerCase())){
				$('#userTableBody').append("<tr><td>" + u.firstName + "</td>" +
						"<td>" + u.lastName + "</td>" +
						"<td>" + u.phone + "</td>" +
						"<td>" + u.city + "</td>" +
						"<td>" + u.email + "</td>" +
						"<td>" + u.date + "</td></tr>"); 	
			}
		}
	}
	else if(name != '' && city != ''){
		for(var u of allUsers){
			if(u.firstName.toLowerCase().includes(name.toLowerCase()) && u.city.toLowerCase().includes(city.toLowerCase())){
				$('#userTableBody').append("<tr><td>" + u.firstName + "</td>" +
						"<td>" + u.lastName + "</td>" +
						"<td>" + u.phone + "</td>" +
						"<td>" + u.city + "</td>" +
						"<td>" + u.email + "</td>" +
						"<td>" + u.date + "</td></tr>"); 	
			}
		}
	}	
}

					//----------------- ENDSEARCH -----------------





					//----------------- RECENSIONS -----------------


// prikazivanje DIV-a za kreiranje nove recenzije
function showCreateRecension(){
	
	$('#createRecension').attr('hidden', false);
	$('#adsItems').attr('hidden', true);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgInbox').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#changeRecension').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	$('#recAutor').val(currentUser.username);
	
}

// dobijamo oglase koje je postavio kupac
function getMyRecensions(){
	
	var myRecensions = [];
	
	for(var r of allRecensions){
		if(r.active == false)
			continue;
			
		if(r.recensionist == currentUser.username){
			myRecensions.push(r);
		}
	}
	
	return myRecensions;
}

// prikaz recenzija za kupca
function showMyRecensions(){
	
	var recensions = getMyRecensions();
	var descriptionCorrect;
	var dealFullfiled;
	
	$('#createRecension').attr('hidden', true);
	$('#adsItems').attr('hidden', true);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgInbox').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', false);
	$('#changeRecension').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);

	
	$('#divMyRecensions').html('');
	
	if(recensions.length == 0){
		$('#divMyRecensions').append("<h3 align=\"center\" style=\"margin:0px 20px;\">Nemate recenzija!</h3>");
	}
	else{
		
		$('#divMyRecensions').html('');
		
		for(var r of recensions){
			
			if(r.descriptionCorrect)
				descriptionCorrect = "Da"
			else
				descriptionCorrect = "Ne"
					
			if(r.fullfiled)
				dealFullfiled = "Da"
			else
				dealFullfiled = "Ne"
			
			if(r.img == null){
				
				$('#divMyRecensions').append("<div class=\"card\" style=\"margin:10px\">" +
						"<div class=\"card-header\"><strong>" + r.recensionName + "</strong></div>" +
						"<div class=\"card-body\">" + 
						"<blockquote class=\"blockquote mb-0\">" +
						"<p style=\"color:Black ;\">Opis tacan: " + descriptionCorrect + "</p>" +
						"<p style=\"color:Black ;\">Ispostovan dogovor: " + dealFullfiled + "</p>" + "<br>" + 
						"<p style=\"font-family:Comic Sans MS, cursive, sans-serif; color:#007bff\">" + r.recensionContent + "</p><br>" +
						"<footer class=\"footer\">" +
						"<cite title=\"Source Title\" style=\"float:right\">" +
						"<a href=\"#\" class=\"recensionClicks\" id=\"chgrec" + r.recensionId + "\" onclick=\"changeRecension(this.id)\">Izmeni</a>" +
						"<a href=\"#\" class=\"recensionClicks\" id=\"delrec" + r.recensionId + "\" onclick=\"deleteRecension(this.id)\">Obrisi</a>" +
						"</cite></footer>" + 
						"</blockquote></div></div>");		
			}
			else{
				
				$('#divMyRecensions').append("<div class=\"card\" style=\"margin:10px\">" +
						"<div class=\"card-header\"><strong>" + r.recensionName + "</strong></div>" +
						"<div class=\"card-body\">" + 
						"<blockquote class=\"blockquote mb-0\">" +
						"<img src=\"" + r.img + "\" style=\"float:right; widht:128px; height:128px\">" + 
						"<p style=\"color:Black ;\">Opis tacan: " + descriptionCorrect + "</p>" +
						"<p style=\"color:Black ;\">Ispostovan dogovor: " + dealFullfiled + "</p>" + "<br>" + 
						"<p style=\"font-family:Comic Sans MS, cursive, sans-serif; color:#007bff\">" + r.recensionContent + "</p><br>" +
						"<footer class=\"footer\">" +
						"<cite title=\"Source Title\" style=\"float:right\">" +
						"<a href=\"#\" class=\"recensionClicks\" id=\"chgrec" + r.recensionId + "\" onclick=\"changeRecension(this.id)\">Izmeni</a>" +
						"<a href=\"#\" class=\"recensionClicks\" id=\"delrec" + r.recensionId + "\" onclick=\"deleteRecension(this.id)\">Obrisi</a>" +
						"</cite></footer>" + 
						"</blockquote></div></div>");
			}
		}
	}
}

function changeRecension(changeId){
	
	var recensionId = changeId.substring(6);
	var adId;
	var recension;
	var oldImage;
	
	
	for(var r of allRecensions){
		if(r.recensionId == recensionId){
			recension = r;
			adId = r.adId;
		}
	}
	
	$('#createRecension').attr('hidden', true);
	$('#adsItems').attr('hidden', true);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgInbox').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#changeRecension').attr('hidden', false);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	$('#chgrecAutor').val(currentUser.username);
	$('#chgselectRecAd option[value="'+adId+'"]').attr("selected", "selected");
	$('#chgselectRecAd').prop('disabled', 'disabled');
	$('#chgrecTitle').val(recension.recensionName);
	$('#chgrecContent').val(recension.recensionContent);
	oldImage = recension.img;
	$('#chgrecCorrect').prop('checked', recension.descriptionCorrect);
	$('#chgrecDeal').prop('checked', recension.fullfiled);
	
	$('#formChangeRecension').submit((event) => {
		event.preventDefault();
		
		var adId = $('#chgselectRecAd option:selected').val();
		var recAutor = $('#chgrecAutor').val();
		var recTitle = $('#chgrecTitle').val();
		var recContent = $('#chgrecContent').val();
		var img;
		var newImg = recensionImage;
		var adCorrect;
		var dealFullfiled;
		
		if(newImg == null || newImg == undefined){
			img = oldImage;
		}else{
			img = newImg;
		}
		
		if($('#chgrecCorrect').is(":checked")){
			adCorrect = true;
		}
		else{
			adCorrect = false;
		}
		
		if($('#chgrecDeal').is(":checked")){
			dealFullfiled = true;
		}
		else{
			dealFullfiled = false;
		}
		
		$.post({
			
			url: 'rest/recensions/changeRecension',
			data: JSON.stringify({'recensionId':recension.recensionId, 'adId':adId, 'recensionist':recAutor, 'recensionName':recTitle,
					'recensionContent':recContent, 'img':img, 'descriptionCorrect':adCorrect, 'fullfiled':dealFullfiled, 'active':true}),
			contentType: 'application/json',
			success: function(){
				window.location.reload();
			},
			error: function(){
				console.log('Doslo je do grekse!');
			}
			
		});
		
		
	});
	
	
}

// logicko brisanje recenzija
function deleteRecension(deleteId){
	
	var recensionId = deleteId.substring(6);
	
	$.get({
		
		url: 'rest/recensions/deleteRecension/' + recensionId,
		contentType: 'application/json',
		success: function(){
			window.location.reload();
		},
		error: function(){
			console.log('Doslo je do greske!');
		}
		
	});
	
}

// dobijemo sve recenzije 
function getRecensions(){
	
	$.get({
		url: 'rest/recensions/getRecensions',
		contentType: 'application/json',
		success: function(recensions){
			
			for(i = 0; i < recensions.length; i++){
				allRecensions.push(recensions[i]);
			}
		},
		error: function(){
			console.log('Doslo je do greske!');
		}
	});
	
}

// biranje slike za recenziju
function handleFilesRecension(){
	
	const selectedFile = document.getElementById('inputGroupFile03').files[0];
	
	var reader = new FileReader();
	reader.readAsDataURL(selectedFile);
	
	   reader.onload = function () {
		   
		 recensionImage = reader.result;
	   };
	   reader.onerror = function (error) {
	     console.log('Error: ', error);
	   };
	
	if(selectedFile !== null && selectedFile !== undefined){
		$('#recImgName').text(selectedFile.name);
	}
}

function handleFilesChgRecension(){
	
	const selectedFile = document.getElementById('inputGroupFile04').files[0];
	
	var reader = new FileReader();
	reader.readAsDataURL(selectedFile);
	
	   reader.onload = function () {
		   
		 recensionImage = reader.result;
	   };
	   reader.onerror = function (error) {
	     console.log('Error: ', error);
	   };
	
	if(selectedFile !== null && selectedFile !== undefined){
		$('#chgrecImgName').text(selectedFile.name);
	}
}

// dodavanje oglasa koji su u DELIVERED u drop-down meni za kreiranje recenzije
function fillRecensionAds(ads){
	
	if(currentUser == null || currentUser.role != 1)
		return;
	
	var adIds = currentUser.buyerDeliveredAds;
	
	for(var i = 0; i < adIds.length; i++){
		for(var j = 0; j < ads.length; j++){
			if(adIds[i] == ads[j].idAd){
				$('#selectRecAd').append(new Option(ads[j].name, ads[j].idAd));
				$('#chgselectRecAd').append(new Option(ads[j].name, ads[j].idAd));
			}
		}
	}
}

					//  -----------------  END RECENSIONS -----------------



					//  -----------------  MESSAGES -----------------

function sortMessagesByDate(b, a){
	  var aDate = a.msgDate;
	  var bDate = b.msgDate; 
	  return ((aDate < bDate) ? -1 : ((aDate > bDate) ? 1 : 0));
}

function sendMessageToAdmin(idAd){
	
	$.post({
		
		url: 'rest/messages/sellerDeletedAd/' + idAd,
		contentType: 'application/json',
		success: function(){
			console.log('uspeo');
		},
		error: function(){
			console.log('error');
		}
		
	});
	
}

// funkcija za dodavanje primalaca u drop-down meniju kod kreiranja poruke 
function addUsersDropdown(user){
	
	if(currentUser == undefined)
		return;
	
	if(currentUser.role == 0){
		$('#selectMsgReciver').append(new Option(user.username, user.role));
	}else if(currentUser.role == 1){
		if(user.role == 2){
			$('#selectMsgReciver').append(new Option(user.username, user.role));
		}
	}else if (currentUser.role == 2){
		if(user.role == 0){
			$('#selectMsgReciver').append(new Option(user.username, user.role));
		}
	}
	
}

function addAdToDropdown(ad){
	
	$('#selectMsgAd').append(new Option(ad.name, ad.idAd));
	$('#chSelectMsgAd').append(new Option(ad.name, ad.idAd));
	
}

function appendMessagesInbox(){
	
	var messageIds = [];
	var buyers = [];
	messageIds = currentUser.sellerMessages;
	
	for(var i = 0; i < allUsers.length; i++){
		if(allUsers[i].role == 1){
			buyers.push(allUsers[i].username);
		}
	}
	
	$('#divMsgInbox').html('');
	
	if(messageIds.length == 0 ){
		$('#divMsgInbox').append("<h3 align=\"center\" style=\"margin:10px\">Nemate primljenih poruka!</h3>");
	}else{
		
		if(currentUser.role == 2){ //AKO JE PRODAVAC
			for(var i = 0; i < allMessages.length; i++){
				for(var j = 0; j < messageIds.length; j++){	
					if(allMessages[i].deleted != true){ //OVO VEROVATNO NE TREBA
						if(messageIds[j] == allMessages[i].msgId){
							if(buyers.includes(allMessages[i].msgSender)){
								var date = new Date(allMessages[i].msgDate);
								
								$('#divMsgInbox').append("<div class=\"card\" style=\"margin:10px\">" +
										"<div class=\"card-header\"><strong>" + allMessages[i].msgName + "</strong></div>" +
										"<div class=\"card-body\">" + 
										"<blockquote class=\"blockquote mb-0\">" +
										"<p style=\"color:Black ;\">Poruka od: " + allMessages[i].msgSender + "</p>" +
										"<p style=\"color:Black ;\">Oglas: " + allMessages[i].adName + "</p>" + "<br>" + 
										"<p style=\"font-family:Comic Sans MS, cursive, sans-serif; color:#007bff\">" + allMessages[i].msgContent + "</p><br>" +
										"<footer class=\"blockquote-footer\">" + 'Poruka primnjena u ' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() +
										", " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() +
										"<cite title=\"Source Title\" style=\"float:right\"><button type=\"button\" class=\"btn btn-secondary\"" +
										"data-toggle=\"modal\" data-target=\"#modalReplyMessage\" data-whatever=\"@mdo\"" +
										" id=\"clickMessageReply\" style=\":margin:0px 10px 0px 10px;\"\" onclick=\"replyMessage(\'"+allMessages[i].msgId+"\')\">Odgovori</button></cite></footer>" + 
										"</blockquote></div></div>");							
								
						
							}
							else{
								var date = new Date(allMessages[i].msgDate);
								
								$('#divMsgInbox').append("<div class=\"card\" style=\"margin:10px\">" +
										"<div class=\"card-header\"><strong>" + allMessages[i].msgName + "</strong></div>" +
										"<div class=\"card-body\">" + 
										"<blockquote class=\"blockquote mb-0\">" +
										"<p style=\"color:Black ;\">Poruka od: " + allMessages[i].msgSender + "</p>" +
										"<p style=\"color:Black ;\">Oglas: " + allMessages[i].adName + "</p>" + "<br>" + 
										"<p style=\"font-family:Comic Sans MS, cursive, sans-serif; color:#007bff\">" + allMessages[i].msgContent + "</p><br>" +
										"<footer class=\"blockquote-footer\">" + 'Poruka primnjena u ' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() +
										", " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() +
										"<cite title=\"Source Title\"></cite></footer>" + 
										"</blockquote></div></div>");
								
							}												
						}
					}
				}
			}											
		}
		else{
			for(var i = 0; i < allMessages.length; i++){
				for(var j = 0; j < messageIds.length; j++){
					if(allMessages[i].deleted != true){ //OVO VEROVATNO NE TREBA
						if(messageIds[j] == allMessages[i].msgId){
							
							var date = new Date(allMessages[i].msgDate);
							
							$('#divMsgInbox').append("<div class=\"card\" style=\"margin:10px\">" +
									"<div class=\"card-header\"><strong>" + allMessages[i].msgName + "</strong></div>" +
									"<div class=\"card-body\">" + 
									"<blockquote class=\"blockquote mb-0\">" +
									"<p style=\"color:Black;\">Od: " + allMessages[i].msgSender + "</p>" +
									"<p style=\"color:Black;\">Za oglas: " + allMessages[i].adName + "</p>" + "<br>" + 
									"<p style=\"font-family:Comic Sans MS, cursive, sans-serif; color:#007bff\">" + allMessages[i].msgContent + "</p><br>" +
									"<footer class=\"blockquote-footer\">" + 'Poruka primljena u ' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() +
									", " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() +
									"<cite title=\"Source Title\" ></cite></footer>" + 
									"</blockquote></div></div>");		
						}
					}
				}
			}		
		}	
	}	
}

function replyMessage(messageId){
	
	var message;
	$('#modalReplyContent').val("");
	
	for(var i = 0; i < allMessages.length; i++){
		if(allMessages[i].msgId == messageId){
			message = allMessages[i];
		}
	}
	
	$('#modalReplyRecipient').val(message.msgSender);
	
	$('#modalReplySubmit').click(function(){
		var msgContent = $('#modalReplyContent').val();
		var messageName = "RE: " + message.msgName;
		var messageDate = new Date();
		
		
		$.post({
			url: 'rest/messages/sendMessage',
			contentType: 'application/json',
			data: JSON.stringify({"msgId":generateUUID(), "adName":message.adName, "msgName":messageName, "msgSender":currentUser.username, "msgReciver":message.msgSender,
									"msgContent":msgContent, "msgDate":messageDate.getTime(), "deleted":false, "read":false}),
			success: function(){
				window.location = "./webshop.html";
			},
			error: function(){
				console.log("error");
			}
		});
		
	});	
}


function appendMessagesOutbox(){
	
	var sentMessages = [];
	
	for(var i = 0; i < allMessages.length; i ++){
		if(currentUser.username == allMessages[i].msgSender){
			if(allMessages[i].deleted == true){
				continue;
			}
			sentMessages.push(allMessages[i]);
		}
	}
	
	$('#divMsgOutbox').html('');
	
	if(sentMessages.length == 0){
		$('#divMsgOutbox').append("<h3 align=\"center\" style=\"margin:10px\">Nemate poslatih poruka!</h3>");
	}else{	
		
		for(var j = 0; j < sentMessages.length; j++){
				var date = new Date(sentMessages[j].msgDate);
				
				$('#divMsgOutbox').append("<div class=\"card\" style=\"margin:10px\">" +
						"<div class=\"card-header\"><strong>" + sentMessages[j].msgName + "</strong></div>" +
						"<div class=\"card-body\">" + 
						"<blockquote class=\"blockquote mb-0\">" +
						"<p style=\"color:Black ;\">Poruka je poslata: " + sentMessages[j].msgReciver + "</p>" +
						"<p style=\"color:Black;\">Oglas: " + sentMessages[j].adName + "</p>" + "<br>" + 
						"<p style=\"font-family:Comic Sans MS, cursive, sans-serif; color:#007bff\">" + sentMessages[j].msgContent + "</p><br>" +
						"<footer class=\"blockquote-footer\">" + 'Poruka poslata u ' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() +
						", " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() +
						"<cite title=\"Source Title\" style=\"float:right\"><button id=\"msgCh" + sentMessages[j].msgId +"\" onclick=\"clickChangeMessage(this.id)\" class=\"btn btn-secondary\" style=\"margin:0px 10px\">Izmeni</button>" +
						"<button id=\"buttonkDeleteMessage\" class=\"btn btn-secondary\" style=\"margin:0px 10px\" onclick=\"clickDeleteMessage(\'"+sentMessages[j].msgId+"\')\">Izbrisi</button></cite></footer>" + 
						"</blockquote></div></div>");
				
		}	
	}
}

function clickChangeMessage(btnId){
	
	var messageId = btnId.substring(5);
	
	
	$('#divMsgInbox').attr('hidden', true);
	$('#adsItems').attr('hidden', true);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', false);
	$('#createRecension').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	var msg;
	var ad;
	
	for(var m of allMessages){
		if(messageId == m.msgId)
			msg = m;
	}
	
	for(var a of allAdvertisements){
		if(msg.adName == a.name){
			ad = a;
		}
	}
	
	$('#changeMessageHeader').append(" " + "\'" + msg.msgName + "\'");
	$('#chSelectMsgReciver option:first').text(msg.msgReciver);
	$('#chSelectMsgReciver').prop('disabled', true);
	$('#chMsgTitle').val(msg.msgName);
	$('#chSelectMsgAd option[value="'+ad.idAd+'"]').attr("selected", "selected");
	$('#chMsgContent').val(msg.msgContent);
	
	var mTitle = $('#chMsgTitle').val();
	
	if(mTitle.includes("(Izmena)")){
		
		mTitle = mTitle.replace("(Izmena)", '');
		$('#chMsgTitle').val(mTitle);
	}
	
	$('#formChangeMessage').submit((event) => {
		
		event.preventDefault();
		
		var msgReciver = $('#chSelectMsgReciver option:selected').text();
		var msgTitle = $('#chMsgTitle').val();
		var msgAd = $('#chSelectMsgAd option:selected').text();
		console.log(msgAd);
		var msgDescription = $('#chMsgContent').val();
		
		let msgDate = new Date();
		
		$.post({
			url: 'rest/messages/changeMessage/' + msg.msgId,
			contentType: 'application/json',
			data: JSON.stringify({"msgId":msg.msgId, "adName":msgAd, "msgName":msgTitle + " (Izmena)", "msgSender":currentUser.username, "msgReciver":msgReciver,
									"msgContent":msgDescription, "msgDate":msgDate.getTime(), "deleted":false, "read":false}),
			success: function(){
				window.location = "./webshop.html";
			},
			error: function(){
				console.log("error");
			}
		});
		
	});
	
}

function clickDeleteMessage(messageId){
	
	$.ajax({
	    url: 'rest/messages/deleteMessage/' + messageId,
	    type: 'DELETE',
	    success: function() {
	    	window.location.reload();
	    },
	    error: function(){
	    	console.log('error');
	    }
	});
}

					//----------------- END MESSAGES -----------------


					//----------------- ADVERTISEMENTS -----------------

function getOrderedAds(){
	
	var ordAds = [];
	
	for(var i =0; i < currentUser.buyerOrderedAds.length; i++){
		for(var j = 0; j < allAdvertisements.length; j++){
			
			if(allAdvertisements[j].active == false){
				continue;
			}
			
			if(currentUser.buyerOrderedAds[i] == allAdvertisements[j].idAd){
				ordAds.push(allAdvertisements[j]);
			}
		}
	}
	
	return ordAds;
	
}

function getFavouriteAds(){
	
	
	var favAds = [];
	
	for(var i = 0; i < currentUser.buyerFavouriteAds.length; i++){
		for(var j = 0; j < allAdvertisements.length; j++){
			
			if(allAdvertisements[j].active == false){
				continue;
			}
			
			if(currentUser.buyerFavouriteAds[i] == allAdvertisements[j].idAd){
				favAds.push(allAdvertisements[j]);
			}
		}
	}
	
	return favAds;
	
	
}

function getDeliveredAds(){
	
	var delAds = [];
	
	for(var i = 0; i < currentUser.buyerDeliveredAds.length; i++){
		for(var j = 0; j < allAdvertisements.length; j++){
			
			if(allAdvertisements[j].active == false){
				continue;
			}
			
			if(currentUser.buyerDeliveredAds[i] == allAdvertisements[j].idAd){
				delAds.push(allAdvertisements[j]);
			}
		}
	}
	
	return delAds;
	
}

function getSellerAds(){
	
	var sellerAds = [];
	
	for(var i = 0; i < currentUser.sellerPostedAds.length; i++){
		for(var j = 0; j < allAdvertisements.length; j++){
			
			if(allAdvertisements[j].active == false){
				continue;
			}
			
			if(currentUser.sellerPostedAds[i] == allAdvertisements[j].idAd){
				sellerAds.push(allAdvertisements[j]);
			}
			
		}
	}
	
	return sellerAds;
	
}

function showSellerAds(){
	
	var ads = getSellerAds();
	
	$('#divMsgInbox').attr('hidden', true);
	$('#adsItems').attr('hidden', false);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	$('#adsItems').html('');
	
	if(ads.length == 0){
		$('#adsItems').append("<h3 align=\"center\" style=\"margin:0px 20px;\">Nemate oglasa!</h3>");
	}else{
		
		$('#adsItems').html('');
		
		for(var i = 0; i < ads.length; i++){
			
			if(ads[i].status == 0 || ads[i].status == 1){
				
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						"id=\"" + ads[i].idAd + "\"" + ">" + 
						"<img class=\"card-img-top\" src=\"" + ads[i].imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ads[i].name +"</h5>" + 
						"<p class=\"card-text\">" + ads[i].price + "</p>" +
						"<p align=\"center\">(Isporucen)</p>" +
						"</div><div class=\"card-footer\">" +
						/*" <p class=\"card-text\">*/"<small class=\"text-muted\">"+
						"<span class=\"adLikes\">" + ads[i].numLikes + "</span>" + "<span class=\"adDislikes\">" + ads[i].numDislikes + "</span>" +
						"<span><img src=\"Images/edit.png\" id=\"change" + ads[i].idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\">"+
						"<img src=\"Images/approved.png\" align=\"right\" style=\"margin:0px 5px\"></span>"+
						"</small>"/*</p>*/ + 
						"</div>" +
						"</div>" + "</div>");					
				
			}else{
				
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						"id=\"" + ads[i].idAd + "\"" + ">" + 
						"<img class=\"card-img-top\" src=\"" + ads[i].imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ads[i].name +"</h5>" + 
						"<p class=\"card-text\">" + ads[i].price + "</p>" +
						"</div><div class=\"card-footer\">" +
						/*" <p class=\"card-text\">*/"<small class=\"text-muted\">"+
						"<span class=\"adLikes\">" + ads[i].numLikes + "</span>" + "<span class=\"adDislikes\">" + ads[i].numDislikes + "</span>" +
						"<img src=\"Images/edit.png\" id=\"change" + ads[i].idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\">"+
						"<img src=\"Images/delete.png\" id=\"remove" + ads[i].idAd + "\" onclick=\"removeAd(this.id)\" align=\"right\" style=\"margin:0px 5px\" class=\"adIcons\">"+
						"</small>"/*</p>*/ + 
						"</div>" +
						"</div>" + "</div>");	
				
			}							
		}
	}
}

function showOrderedAds(){
	
	var ads = getOrderedAds();
	
	$('#divMsgInbox').attr('hidden', true);
	$('#adsItems').attr('hidden', false);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	$('#adsItems').html('');
	
	
	if(ads.length == 0){
		$('#adsItems').append("<h3 align=\"center\" style=\"margin:0px 20px;\">Nemate oglasa u realizaciji!</h3>");
	}else{
		
		$('#adsItems').html('');
		
		for(var i = 0; i < ads.length; i++){
			
			if(currentUser.buyerFavouriteAds.includes(ads[i].idAd)){
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						">" + 
						"<img class=\"card-img-top\" src=\"" + ads[i].imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ads[i].name +"</h5>" + 
						"<p class=\"card-text\">" + ads[i].price + "</p>" +
						"</div><div class=\"card-footer\">" +
						"<small class=\"text-muted\"Porucen:>"+
						"<img src=\"Images/delivered.png\" align=\"right\" id=\"del"+ads[i].idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToDelivered(this.id)\">"+
						"<img src=\"Images/star.png\" align=\"right\" id=\"img"+ads[i].idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToFavourites(this.id)\">"+
						"</small>" + 
						"</div>" +
						"</div>" + "</div>");
			}else{
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						">" + 
						"<img class=\"card-img-top\" src=\"" + ads[i].imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ads[i].name +"</h5>" + 
						"<p class=\"card-text\">" + ads[i].price + "</p>" +
						"</div><div class=\"card-footer\">" +
						"<small class=\"text-muted\">Porucen"+
						"<img src=\"Images/delivered.png\" align=\"right\" id=\"del"+ads[i].idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToDelivered(this.id)\">"+
						"<img src=\"Images/star_blank.png\" align=\"right\" id=\"img"+ads[i].idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToFavourites(this.id)\">"+
						"</small>" + 
						"</div>" +
						"</div>" + "</div>");
			}
		}
	}
}


function showFavouriteAds(){
	
	var ads = getFavouriteAds();
	
	$('#divMsgInbox').attr('hidden', true);
	$('#adsItems').attr('hidden', false);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	$('#adsItems').html('');
	
	
	if(ads.length == 0){
		
		$('#adsItems').append("<h3 align=\"center\" style=\"margin:0px 20px;\">Nemate omiljenih oglasa!</h3>");
		
	}else{
		
		$('#adsItems').html('');
		
		for(var i = 0; i < ads.length; i++){
	
			$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
					">" + 
					"<img class=\"card-img-top\" src=\"" + ads[i].imgPath + "\" alt=\"Card image cap\">" +
					"<div class=\"card-body\">" +
					"<h5 class=\"card-title\">" + ads[i].name +"</h5>" + 
					"<p class=\"card-text\">" + ads[i].price + "</p>" +
					"</div><div class=\"card-footer\">" +
					"<small class=\"text-muted\">Omiljen"+
					"<img src=\"Images/star.png\" align=\"right\" id=\"img"+ads[i].idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToFavourites(this.id)\">"+
					"</small>" + 
					"</div>" +
					"</div>" + "</div>");
		}
	}
	
	
}

function showDeliveredAds(){
	
	var ads = getDeliveredAds();
	var publisher;
	
	$('#divMsgInbox').attr('hidden', true);
	$('#adsItems').attr('hidden', false);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	$('#adsItems').html('');
	
	if(ads.length == 0){
		
		$('#adsItems').append("<h3 align=\"center\" style=\"margin:0px 20px;\">Nemate dostavljenih oglasa!</h3>");
		
	}else{
		
		$('#adsItems').html('');
		
		for(var i = 0; i < ads.length; i++){
			for(var j = 0; j < allUsers.length; j++){
				if(allUsers[j].username == ads[i].publisher){
					publisher = allUsers[j];
				}
			}
	
			$('#adsItems').append("<div style=\"margin:5px 10px\">" + "<div class=\"card\" style=\"width:250px;\">" + 
					"<img class=\"card-img-top\" style=\"margin-bottom:10px;\" src=\"" + ads[i].imgPath + "\" alt=\"Card image cap\">" +
					"<div class=\"card-body\" style=\"padding:10px\">" +
					"<p class=\"adReviewText\">Naziv proizvoda: " + "<span style=\"color:black; font-weight:bold;\"><i>" + ads[i].name + "</i></span></p>" + 
					"<p class=\"adReviewText\">Cena proizvoda: " + "<span style=\"color:black; font-weight:bold;\"><i>" + ads[i].price + "</i></span></p><br>" +
					
					"<div style=\"padding-bottom:25px\"><span align=\"left\" class=\"adReviewGrades\">Oceni oglas: </span>" +
					"<span style=\"float:right; font-size:20px;\">" +
					"<img src=\"Images/like.png\" class=\"adIcons\" id=\"imgl" + ads[i].idAd + "\" style=\"padding:0px 8px\" onclick=\"likeAd(this.id)\">" + ads[i].numLikes +
					"<img src=\"Images/dislike.png\" class=\"adIcons\" id=\"imgd" + ads[i].idAd + "\" style=\"padding:0px 8px\" onclick=\"dislikeAd(this.id)\">" + ads[i].numDislikes + "</span></div>" +
					
					"<div style=\"padding-bottom:5px\"><span class=\"adReviewGrades\">Oceni prodavca:</span>" + 
					"<span style=\"float:right; font-size:20px;\">" +
					"<img src=\"Images/like.png\" class=\"adIcons\" id=\"imgsl" + ads[i].publisher + "\" style=\"padding:0px 8px\" onclick=\"likeSeller(this.id)\">" + publisher.sellerLikes +
					"<img src=\"Images/dislike.png\" class=\"adIcons\" id=\"imgsd" + ads[i].publisher + "\" style=\"padding:0px 8px\" onclick=\"dislikeSeller(this.id)\">" + publisher.sellerDislikes + "</span></div>" +
					
					"</div><div class=\"card-footer\">" +
					"<small class=\"text-muted\">Dostavljen od: <strong>"+ ads[i].publisher + "</strong>" +
					"<img src=\"Images/approved.png\" align=\"right\" style=\"margin:0px 0px 0px 5px\">"+
					"</small>" + 
					"</div>" +
					"</div>" + "</div>");
		}
	}
}

function showAllAds(){
	
	ads = allAdvertisements;
	
	$('#divMsgInbox').attr('hidden', true);
	$('#adsItems').attr('hidden', false);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', false);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	$('#adsItems').html('');
	
	for(var ad of ads){
		
		if(ad.active == false){
			continue;
		}
		
		if(currentUser !== null && currentUser !== undefined){
			if(currentUser.role == 0){	//admin
				
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						"id=\"" + ad.idAd + "\"" + ">" + 
						"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
						"<p class=\"card-text\">" + ad.price + "</p>" +
						"</div><div class=\"card-footer\">" +
						"<small class=\"text-muted\">"+
						"<img src=\"Images/edit.png\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px; padding:0px\" class=\"adIcons\">"+
						"<img src=\"Images/delete.png\" id=\"remove" + ad.idAd + "\" onclick=\"removeAd(this.id)\" align=\"right\" style=\"margin:0px 5px\" class=\"adIcons\">"+
						"</small>" + 
						"</div>" +
						"</div>" + "</div>"); 
				
				
			}else if(currentUser.role == 1){	//buyer
				
				if(currentUser.buyerOrderedAds.includes(ad.idAd)){
					continue;
				}
				
				if(currentUser.buyerFavouriteAds.includes(ad.idAd)){
					
					$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
							"id=\"" + ad.idAd + "\"" + " style=\"border: 2px solid rgba(255,165,0,0.4);\">" + 
							"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
							"<div class=\"card-body\">" +
							"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
							"<p class=\"card-text\">" + ad.price + "</p>" +
							"</div><div class=\"card-footer\">" +
							"<small class=\"text-muted\">"+
							"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
							"<img src=\"Images/cart.png\" align=\"right\" id=\"ord"+ad.idAd+"\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\" onclick=\"addAddToOrdered(this.id)\">"+
							"<img src=\"Images/star.png\" align=\"right\" id=\"img"+ad.idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToFavourites(this.id)\">"+ 
							"</small>" + 
							"</div>" +
							"</div>" + "</div>");
					
				}else{
					
					$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
							"id=\"" + ad.idAd + "\"" + ">" + 
							"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
							"<div class=\"card-body\">" +
							"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
							"<p class=\"card-text\">" + ad.price + "</p>" +
							"</div><div class=\"card-footer\">" +
							"<small class=\"text-muted\">" +
							"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
							"<img src=\"Images/cart.png\" align=\"right\" id=\"ord"+ad.idAd+"\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\" onclick=\"addAddToOrdered(this.id)\">"+
							"<img src=\"Images/star_blank.png\" align=\"right\" id=\"img"+ad.idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToFavourites(this.id)\">"+
							"</small>" +
							"</div>" +
							"</div>" + "</div>");
				}				
				
			}else if(currentUser.role == 2){	//seller
				
					if(ad.publisher == currentUser.username){
						
						if(ad.status == 0 || ad.status == 1){
							
							$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
									"id=\"" + ad.idAd + "\"" + "style=\"border: 2px solid rgba(50,205,50,0.4);\">" + 
									"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
									"<div class=\"card-body\">" +
									"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
									"<p class=\"card-text\">" + ad.price + "</p>" +
									"<p align=\"center\">(Isporucen)</p>" +
									"</div><div class=\"card-footer\">" +
									"<small class=\"text-muted\">"+
									"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
									"<span><img src=\"Images/edit.png\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\">"+
									"<img src=\"Images/approved.png\" align=\"right\" style=\"margin:0px 5px\"></span>"+
									"</small>" + 
									"</div>" +
									"</div>" + "</div>");
							
							
						}else{
							
							$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
									"id=\"" + ad.idAd + "\"" + "style=\"border: 2px solid rgba(0,123,255,0.4);\">" + 
									"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
									"<div class=\"card-body\">" +
									"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
									"<p class=\"card-text\">" + ad.price + "</p>" +
									"</div><div class=\"card-footer\">" +
									"<small class=\"text-muted\">"+
									"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
									"<img src=\"Images/edit.png\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\">"+
									"<img src=\"Images/delete.png\" id=\"remove" + ad.idAd + "\" onclick=\"removeAd(this.id)\" align=\"right\" style=\"margin:0px 5px\" class=\"adIcons\">"+
									"</small>" + 
									"</div>" +
									"</div>" + "</div>");
						}		
						continue;
					}
				
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						"id=\"" + ad.idAd + "\"" + ">" + 
						"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
						"<p class=\"card-text\">" + ad.price + "</p>" +
						"</div><div class=\"card-footer\">" +
						"<small class=\"text-muted\">"+
						"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
						"</small>" + 
						"</div>" +
						"</div>" + "</div>");
			}
		}
		else{ //guest
			$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
					"id=\"" + ad.idAd + "\"" + ">" + 
					"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
					"<div class=\"card-body\">" +
					"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
					"<p class=\"card-text\">" + ad.price + "</p>" +
					" <p class=\"card-text\"><small class=\"text-muted\">"+
					"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
					"</small></p>" + 
					"</div>" +
					"</div>" + "</div>"); 
		}
	}
	
	
	
}

function likeSeller(sellerUsername){
	
	var adId = sellerUsername.substring(5);
	var imgSource = $('#' + sellerUsername).attr('src');
	
	if(imgSource == "Images/like.png"){
		
		$.post({
			
			url: 'rest/ads/likeSeller/' + adId,
			contentType: 'application/json',
			success: function(){
				$('#' + sellerUsername).attr('src', "Images/like_filled.png");
			},
			error: function(){
				console.log('error');
			}
			
		});
		
	}
	
}

function dislikeSeller(sellerUsername){
	
	var adId = sellerUsername.substring(5);
	var imgSource = $('#' + sellerUsername).attr('src');
	
	if(imgSource == "Images/dislike.png"){
		
		$.post({
			
			url: 'rest/ads/dislikeSeller/' + adId,
			contentType: 'application/json',
			success: function(){
				$('#' + sellerUsername).attr('src', "Images/dislike_filled.png");
			},
			error: function(){
				console.log('error');
			}
			
		});
		
	}
	
}

function likeAd(imgId){
	
	var adId = imgId.substring(4);
	var imgSource = $('#' + imgId).attr('src');
	
	if(imgSource == "Images/like.png"){
		
		$.post({
			
			url: 'rest/ads/likeAd/' + adId,
			contentType: 'application/json',
			success: function(){
				$('#' + imgId).attr('src', "Images/like_filled.png");
			},
			error: function(){
				console.log('error');
			}
			
		});
		
	}
	
}

function dislikeAd(imgId){
	
	var adId = imgId.substring(4);
	var imgSource = $('#' + imgId).attr('src');
	
	if(imgSource == "Images/dislike.png"){
		
		$.post({
			
			url: 'rest/ads/dislikeAd/' + adId,
			contentType: 'application/json',
			success: function(){
				$('#' + imgId).attr('src', "Images/dislike_filled.png");
			},
			error: function(){
				console.log('error');
			}
			
		});
		
	}
	
}

function sortAdsByFavourites(b, a){
	  var aFavourites = a.numFavourites;
	  var bFavourites = b.numFavourites; 
	  return ((aFavourites < bFavourites) ? -1 : ((aFavourites > bFavourites) ? 1 : 0));
}

function changeAd(imgid){
	
	var idAd = imgid.substring(6);
	var ad;
	
	for(var i = 0; i < allAdvertisements.length; i++){
		if(idAd == allAdvertisements[i].idAd){
			ad = allAdvertisements[i];
		}
	}
	
	$('#changeAdHeader').append(" " + "\'" + ad.name.toUpperCase() + "\'");
	
	$('#adsItems').attr('hidden', true);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgInbox').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', false);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	$('#chAdName').val(ad.name);
	$('#chAdPrice').val(ad.price);
	$('#chAdCity').val(ad.city);
	$('#chAdDesc').val(ad.description);
	var oldImg = ad.imgPath;
	
	$('#changeAd').submit((event) =>{
		event.preventDefault();
		
		var name = $('#chAdName').val();
		var price = $('#chAdPrice').val();
		var city = $('#chAdCity').val();
		var description = $('#chAdDesc').val();
		var img;
		var newImg = img64;
		
		if(newImg == null || newImg == undefined){
			img = oldImg;
		}else{
			img = newImg;
		}
		
		console.log(img);
		
		
		$.post({
			url: 'rest/ads/changeAd/' + idAd,
			data: JSON.stringify({'idAd':ad.idAd, 'name':name, 'publisher':ad.publisher, 'price':price, 'description':description,
					'numLikes':ad.numLikes, 'numDislikes':ad.numDislikes, 'imgPath':img, 'datePublished':ad.datePublished, 'dateExpired':ad.dateExpired,
					'active':true, 'city':city, 'recensions':ad.recensions, 'status':ad.status, 'numFavourites':ad.numFavourites}),
			contentType: 'application/json',
			success: function(){
				window.location.reload();
			},
			error: function(){
				console.log('error');
			}
			
			
		});
		
	});
	
	

}

function addAds(){
	
	
	var allAds = sortedAds;
	allAds.sort(sortAdsByFavourites);
	
	var counter = 0;

	for(var ad of allAds){
		
		if(counter == 10)
		return;
	
		if(ad.active == false){
			continue;
		}
		
		if(currentUser !== null && currentUser !== undefined){
			if(currentUser.role == 0){	//admin
				
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						"id=\"" + ad.idAd + "\"" + ">" + 
						"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
						"<p class=\"card-text\">" + ad.price + "</p>" +
						"</div><div class=\"card-footer\">" +
						"<small class=\"text-muted\">"+
						"<img src=\"Images/edit.png\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px; padding:0px\" class=\"adIcons\">"+
						"<img src=\"Images/delete.png\" id=\"remove" + ad.idAd + "\" onclick=\"removeAd(this.id)\" align=\"right\" style=\"margin:0px 5px\" class=\"adIcons\">"+
						"</small>" + 
						"</div>" +
						"</div>" + "</div>"); 
				
				
			}else if(currentUser.role == 1){	//buyer
				
				if(currentUser.buyerOrderedAds.includes(ad.idAd)){
					continue;
				}
				
				if(currentUser.buyerFavouriteAds.includes(ad.idAd)){
					
					$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:10px 0px; min-width:200px;\">" + "<div class=\"card\"" +
							"id=\"" + ad.idAd + "\"" + " style=\"border: 2px solid rgba(255,165,0,0.4);\">" + 
							"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
							"<div class=\"card-body\">" +
							"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
							"<p class=\"card-text\">" + ad.price + "</p>" +
							"</div><div class=\"card-footer\">" +
							"<small class=\"text-muted\">"+
							"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
							"<img src=\"Images/cart.png\" align=\"right\" id=\"ord"+ad.idAd+"\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\" onclick=\"addAddToOrdered(this.id)\">"+
							"<img src=\"Images/star.png\" align=\"right\" id=\"img"+ad.idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToFavourites(this.id)\">"+ 
							"</small>" + 
							"</div>" +
							"</div>" + "</div>");
					
				}else{
					
					$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
							"id=\"" + ad.idAd + "\"" + ">" + 
							"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
							"<div class=\"card-body\">" +
							"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
							"<p class=\"card-text\">" + ad.price + "</p>" +
							"</div><div class=\"card-footer\">" +
							"<small class=\"text-muted\">" +
							"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
							"<img src=\"Images/cart.png\" align=\"right\" id=\"ord"+ad.idAd+"\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\" onclick=\"addAddToOrdered(this.id)\">"+
							"<img src=\"Images/star_blank.png\" align=\"right\" id=\"img"+ad.idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToFavourites(this.id)\">"+
							"</small>" +
							"</div>" +
							"</div>" + "</div>");
				}				
				
			}else if(currentUser.role == 2){	//seller
				
					if(ad.publisher == currentUser.username){
						
						if(ad.status == 0 || ad.status == 1){
							
							$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
									"id=\"" + ad.idAd + "\"" + "style=\"border: 2px solid rgba(50,205,50,0.4);\">" + 
									"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
									"<div class=\"card-body\">" +
									"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
									"<p class=\"card-text\">" + ad.price + "</p>" +
									"<p align=\"center\">(Isporucen)</p>" +
									"</div><div class=\"card-footer\">" +
									"<small class=\"text-muted\">"+
									"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
									"<span><img src=\"Images/edit.png\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\">"+
									"<img src=\"Images/approved.png\" align=\"right\" style=\"margin:0px 5px\"></span>"+
									"</small>" + 
									"</div>" +
									"</div>" + "</div>");
							
							
						}else{
							
							$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
									"id=\"" + ad.idAd + "\"" + "style=\"border: 2px solid rgba(0,123,255,0.4);\">" + 
									"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
									"<div class=\"card-body\">" +
									"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
									"<p class=\"card-text\">" + ad.price + "</p>" +
									"</div><div class=\"card-footer\">" +
									"<small class=\"text-muted\">"+
									"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
									"<img src=\"Images/edit.png\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\">"+
									"<img src=\"Images/delete.png\" id=\"remove" + ad.idAd + "\" onclick=\"removeAd(this.id)\" align=\"right\" style=\"margin:0px 5px\" class=\"adIcons\">"+
									"</small>" + 
									"</div>" +
									"</div>" + "</div>");
						}
						counter++;
						continue;
					}
				
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						"id=\"" + ad.idAd + "\"" + ">" + 
						"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
						"<p class=\"card-text\">" + ad.price + "</p>" +
						"</div><div class=\"card-footer\">" +
						"<small class=\"text-muted\">"+
						"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
						"</small>" + 
						"</div>" +
						"</div>" + "</div>");
			}
		}
		else{ //guest
			$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
					"id=\"" + ad.idAd + "\"" + ">" + 
					"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
					"<div class=\"card-body\">" +
					"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
					"<p class=\"card-text\">" + ad.price + "</p>" +
					" <p class=\"card-text\"><small class=\"text-muted\">"+
					"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
					"</small></p>" + 
					"</div>" +
					"</div>" + "</div>"); 
		}
		counter++;
	}
	
}

function addAdToDelivered(imgId){
	
	var adId = imgId.substring(3);
	var imgSource = $('#' + imgId).attr('src');
	
	$.post({
		url: 'rest/ads/addToDelivered/' + adId,
		contentType: 'application/json',
		success: function(){
			alert('Proizvod uspesno dostavljen!');
			window.location.reload();
		},
		error: function(){
			console.log("error");
		}
	});	
}

function addAddToOrdered(imgId){
	
	var adId = imgId.substring(3);
	var imgSource = $('#' + imgId).attr('src');
	
	$.post({
		url: 'rest/ads/addToOrdered/' + adId,
		contentType: 'application/json',
		success: function(){
			alert('Proizvod uspesno porucen!');
			window.location.reload();
		},
		error: function(){
			console.log("error");
		}
	});
	
}

function addAdToFavourites(imgId){

	
	var adId = imgId.substring(3);
	var imgSource = $('#' + imgId).attr('src');
	
	if(imgSource == "Images/star_blank.png"){
		
		$.post({
			url: 'rest/ads/addToFavourites/' + adId,
			contentType: 'application/json',
			success: function(){
				$('#' + imgId).attr('src', "Images/star.png");
				window.location.reload();
			},
			error: function(){
				console.log("error");
			}
		});
		
		
		
	}else{
		
		$.post({
			url: 'rest/ads/removeFromFavourites/' + adId,
			contentType: 'application/json',
			success: function(){
				$('#' + imgId).attr('src', "Images/star_blank.png");
				window.location.reload();
			},
			error: function(){
				console.log("error");
			}
		});	
	}

	
}

function removeAd(id){
	
	var url = "rest/ads/removeAd/";
	var idAd = id.substring(6);
	url = url + id.substring(6);
	
	$.get({
		
		url:url,
		contentType: 'application/json',
		success: function(){
			if(currentUser.role == 2){
				sendMessageToAdmin(idAd);
			}
			window.location.reload();
		},
		error: function(){
			console.log('error');
		}
	});
	
}

					//----------------- END ADVERTISEMENTS -----------------

					//----------------- CATEGORIES -----------------

function getCategories(){
	
	$.get({
		url: 'rest/category/getCategories',
		contentType: 'application/json',
		success: function(categories){
			$('#categories').html("");
			for(i = 0; i < categories.length; i++){
				addCategories(categories[i]);
				fillCategories(categories[i]);
				allCategories.push(categories[i]);
			}
		}
	});		
	
}

function addToCategory(ad){
	$('#categoryAds').append(new Option(ad.name, ad.idAd));
	$('#chCategoryAds').append(new Option(ad.name, ad.idAd));
}

function addCategories(category){
	
	if(category.active == false)
		return;
	
	var cat = category;
	
	var cName = category.name.replace(/\s/g, '');
	
	
	$('#categories').append("<div class=\"card\" row style=\"width: 24rem; margin:10px\">" + 
			"<div class=\"card-body\">" +
			"<h5 class=\"card-body\">" + category.name + "</h5>" +
			"<p class=\"card-text\">" + category.description + "</p>" + 
			"<a href=\"#\" id=\"cdel" + cName +"\" class=\"card-link\">Obrisi</a>" + 
			"<a href=\"#\" id=\"cchg" + cName +"\" class=\"card-link\">Izmeni</a>" +
			"</div></div>");
	
	
	$('#cdel' + cName).click(function(){		
		removeCategory(category);
	});
	
	$('#cchg' + cName).click(function(){
		changeCategory(category);
	});
}

function changeCategory(cat){
	
	$('#adsItems').attr('hidden', true);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgInbox').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', false);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	$('#catHeader').append(" " + "'" + cat.name.toUpperCase() + "\'")
	$('#chCatName').val(cat.name);
	$('#chCatDescription').val(cat.description);
	
	$('#changeCategory').submit((event) =>{
		event.preventDefault();		
		
		var name = $('#chCatName').val();
		var description = $('#chCatDescription').val();
		var multiselect = $('#chCategoryAds').val();;
		var ads = [];
		
		for(var i = 0; i < allAdvertisements.length; i++){
			for(var j = 0; j < multiselect.length; j++){
					
				if(allAdvertisements[i].idAd == multiselect[j]){
					
					ads.push(allAdvertisements[i].idAd);
				}
			}
		}
		
		alert(cat.name);
		
		$.post({
			url: 'rest/category/changeCategory/' + cat.name,
			data: JSON.stringify({"name":name, "description":description, "active":true, "advertisements":ads}),
			contentType: 'application/json',
			success: function(){
				alert('Uspesna izmena kategorije!');
				window.location = './webshop.html';
			},
			error: function(){
				console.log('error');
			}
			
		});
		
		
	
	});
}

function removeCategory(cat){
	
	var url = "rest/category/removeCat/" + cat.name;
	
	$.get({
		
		url:url,
		contentType: 'application/json',
		success: function(){
			alert('Uspesno brisanje kategorije!')
			window.location.reload();
		},
		error: function(){
			console.log('error');
		}
	});
	
}

function showAdsByCategorie(cat){
	
	var category;
	var ads = [];
	
	for(var c of allCategories){
		if(c.name === cat){
			category = c;
		}
	}
	
	for(var i = 0; i < category.advertisements.length; i++){
		for(var j = 0; j < allAdvertisements.length; j++){
			if(category.advertisements[i] == allAdvertisements[j].idAd){
				if(allAdvertisements[j].active == false)
					continue;
				ads.push(allAdvertisements[j]);
			}
		}
	}
	
	$('#divMsgInbox').attr('hidden', true);
	$('#adsItems').attr('hidden', false);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
	
	$('#adsItems').html('');
		
	for(var ad of ads){
		
		//if(ad.active == false){
			//continue;
		//}
		
		if(currentUser !== null && currentUser !== undefined){
			if(currentUser.role == 0){	//admin
				
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						"id=\"" + ad.idAd + "\" onclick=\"showDetailedAd('"+ad.idAd+"')\"" + ">" + 
						"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
						"<p class=\"card-text\">" + ad.price + "</p>" +
						"</div><div class=\"card-footer\">" +
						"<small class=\"text-muted\">"+
						"<img src=\"Images/edit.png\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" align=\"right\" style=\"margin:0px 0px 0px 5px; padding:0px\" class=\"adIcons\">"+
						"<img src=\"Images/delete.png\" id=\"remove" + ad.idAd + "\" onclick=\"removeAd(this.id)\" align=\"right\" style=\"margin:0px 5px\" class=\"adIcons\">"+
						"</small>" + 
						"</div>" +
						"</div>" + "</div>"); 
				
				
			}else if(currentUser.role == 1){	//buyer
				
				if(currentUser.buyerOrderedAds.includes(ad.idAd)){
					continue;
				}
				
				if(currentUser.buyerFavouriteAds.includes(ad.idAd)){
					
					$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
							"id=\"" + ad.idAd + "\"" + " style=\"border: 2px solid rgba(255,165,0,0.4);\">" + 
							"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
							"<div class=\"card-body\">" +
							"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
							"<p class=\"card-text\">" + ad.price + "</p>" +
							"</div><div class=\"card-footer\">" +
							"<small class=\"text-muted\">"+
							"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
							"<img src=\"Images/cart.png\" align=\"right\" id=\"ord"+ad.idAd+"\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\" onclick=\"addAddToOrdered(this.id)\">"+
							"<img src=\"Images/star.png\" align=\"right\" id=\"img"+ad.idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToFavourites(this.id)\">"+ 
							"</small>" + 
							"</div>" +
							"</div>" + "</div>");
					
				}else{
					
					$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
							"id=\"" + ad.idAd + "\"" + ">" + 
							"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
							"<div class=\"card-body\">" +
							"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
							"<p class=\"card-text\">" + ad.price + "</p>" +
							"</div><div class=\"card-footer\">" +
							"<small class=\"text-muted\">" +
							"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
							"<img src=\"Images/cart.png\" align=\"right\" id=\"ord"+ad.idAd+"\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\" onclick=\"addAddToOrdered(this.id)\">"+
							"<img src=\"Images/star_blank.png\" align=\"right\" id=\"img"+ad.idAd+"\" style=\"margin:0px 5px\" class=\"adIcons\" onclick=\"addAdToFavourites(this.id)\">"+
							"</small>" +
							"</div>" +
							"</div>" + "</div>");
				}				
				
			}else if(currentUser.role == 2){	//seller
				
					if(ad.publisher == currentUser.username){
						
						if(ad.status == 0 || ad.status == 1){
							
							$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
									"id=\"" + ad.idAd + "\"" + "style=\"border: 2px solid rgba(50,205,50,0.4);\">" + 
									"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
									"<div class=\"card-body\">" +
									"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
									"<p class=\"card-text\">" + ad.price + "</p>" +
									"<p align=\"center\">(Isporucen)</p>" +
									"</div><div class=\"card-footer\">" +
									"<small class=\"text-muted\">"+
									"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
									"<span><img src=\"Images/edit.png\" align=\"right\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\">"+
									"<img src=\"Images/approved.png\" align=\"right\" style=\"margin:0px 5px\"></span>"+
									"</small>" + 
									"</div>" +
									"</div>" + "</div>");
							
							
						}else{
							
							$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
									"id=\"" + ad.idAd + "\"" + "style=\"border: 2px solid rgba(0,123,255,0.4);\">" + 
									"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
									"<div class=\"card-body\">" +
									"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
									"<p class=\"card-text\">" + ad.price + "</p>" +
									"</div><div class=\"card-footer\">" +
									"<small class=\"text-muted\">"+
									"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
									"<img src=\"Images/edit.png\" align=\"right\" id=\"change" + ad.idAd + "\" onclick=\"changeAd(this.id)\" style=\"margin:0px 0px 0px 5px\" class=\"adIcons\">"+
									"<img src=\"Images/delete.png\" id=\"remove" + ad.idAd + "\" onclick=\"removeAd(this.id)\" align=\"right\" style=\"margin:0px 5px\" class=\"adIcons\">"+
									"</small>" + 
									"</div>" +
									"</div>" + "</div>");
						}		
						continue;
					}
				
				$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
						"id=\"" + ad.idAd + "\"" + ">" + 
						"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
						"<div class=\"card-body\">" +
						"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
						"<p class=\"card-text\">" + ad.price + "</p>" +
						"</div><div class=\"card-footer\">" +
						"<small class=\"text-muted\">"+
						"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
						"</small>" + 
						"</div>" +
						"</div>" + "</div>");
			}
		}
		else{ //guest
			$('#adsItems').append("<div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-2\" style=\"margin:5px 0px; min-width:200px;\">" + "<div class=\"card\"" +
					"id=\"" + ad.idAd + "\"" + ">" + 
					"<img class=\"card-img-top\" src=\"" + ad.imgPath + "\" alt=\"Card image cap\">" +
					"<div class=\"card-body\">" +
					"<h5 class=\"card-title\">" + ad.name +"</h5>" + 
					"<p class=\"card-text\">" + ad.price + "</p>" +
					" <p class=\"card-text\"><small class=\"text-muted\">"+
					"<span class=\"adLikes\">" + ad.numLikes + "</span>" + "<span class=\"adDislikes\">" + ad.numDislikes + "</span>" +
					"</small></p>" + 
					"</div>" +
					"</div>" + "</div>"); 
		}
	}	
	
}

function showDetailedAd(adId){
	
	$('#divMsgInbox').attr('hidden', true);
	$('#adsItems').attr('hidden', true);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', false);
	$('#usersDiv').attr('hidden', true);
	
	var ad;
	
	for(var a of allAdvertisements){
		if(a.idAd == adId){
			ad = a;
		}
	}
	
	$('#detailedAd').html('');
	
	$('#detailedAd').append("<div class=\"card mb-3\" style=\"max-width:540px; align:center;\">" +
			"<div class=\"row no-gutters\">" +
			"<div class=\"col-md-4\">" +
			"<img src=\"" + ad.imgPath + "\" class=\"card-img\" style=\"margin-left:10px;\"></div>" +
			"<div class=\"col-md-8\">" +
			"<div class=\"card-body\">" +
			"<h5 class=\"card-title\">"+ad.name+"</h5>" +
			"<p class=\"card-text\">Cena: " + ad.price + "</p>" +
			"<p class=\"card-text\">Broj lajkova: " + ad.numLikes + "</p>" +
			"<p class=\"card-text\">Broj dislajkova: " + ad.numDislikes + "</p>" +
			"<p class=\"card-text\">Datum postavljanja: " + ad.datePublished + "</p>" +
			"<p class=\"card-text\">Vazi do: " + ad.dateExpired + "</p>" +
			"<p class=\"card-text\">Grad: " + ad.city + "</p>" +
			"<p class=\"card-text\">Opis: " + ad.description + "</p>" +
			"</div></div></div></div>");
	
}

function fillCategories(category){
	
	if(category.active == false)
		return;

	var catName = category.name;
	catName = catName.replace(/\s/g, '');
	
	$('#buyerCategoriesMenu').append("<li><a href=\"#\" id=\""+catName+"Buyer\">" +
			 category.name + "</a></li>");	
	
	$('#guestCategoriesMenu').append("<li><a href=\"#\" id=\""+catName+"Guest\">" +
			 category.name + "</a></li>");
	
	$('#sellerCategoriesMenu').append("<li><a href=\"#\" id=\""+catName+"Seller\">" +
			 category.name + "</a></li>");
	
	$('#adminCategoriesMenu').append("<li><a href=\"#\" id=\""+catName+"Admin\">" +
			 category.name + "</a></li>");
	
	$('#' + catName + 'Buyer').click(function () {
		
		showAdsByCategorie(category.name);
		
	});
	
	$('#' + catName + 'Guest').click(function () {
		
		showAdsByCategorie(category.name);
		
	});
	
	$('#' + catName + 'Seller').click(function () {
		
		showAdsByCategorie(category.name);
		
	});
	
	$('#' + catName + 'Admin').click(function () {
		
		showAdsByCategorie(category.name);
		
	});

}


					//----------------- END CATEGORIES -----------------


function handleFiles(){
	
	const selectedFile = document.getElementById('inputGroupFile01').files[0];
	
	var reader = new FileReader();
	reader.readAsDataURL(selectedFile);
	
	   reader.onload = function () {
		   
	     img64 = reader.result;
	   };
	   reader.onerror = function (error) {
	     console.log('Error: ', error);
	   };
	
	if(selectedFile !== null && selectedFile !== undefined){
		$('#imgName').text(selectedFile.name);
	}
}

function handleFilesChanged(){
	
	const selectedFile = document.getElementById('inputGroupFile02').files[0];
	
	var reader = new FileReader();
	reader.readAsDataURL(selectedFile);
	
	   reader.onload = function () {
		   
	     img64 = reader.result;
	   };
	   reader.onerror = function (error) {
	     console.log('Error: ', error);
	   };
	
	if(selectedFile !== null && selectedFile !== undefined){
		$('#chImgName').text(selectedFile.name);
	}
}

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

function adminLogged(){
	$('#loggedUser').text(currentUser.firstName + ' (admin)');
	$('#logout').attr("hidden", false);
	$('#buyersidebar').attr("hidden", true);
	$('#sellersidebar').attr("hidden", true);
	$('#guestsidebar').attr("hidden", true);
	$('#adminsidebar').attr("hidden", false);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
}

function buyerLogged(){
	$('#loggedUser').text(currentUser.firstName + ' (kupac)');
	$('#logout').attr("hidden", false);
	$('#buyersidebar').attr("hidden", false);
	$('#sellersidebar').attr("hidden", true);
	$('#guestsidebar').attr("hidden", true);
	$('#adminsidebar').attr("hidden", true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
}

function sellerLogged(){
	$('#loggedUser').text(currentUser.firstName + ' (prodavac)');
	$('#logout').attr("hidden", false);
	$('#buyersidebar').attr("hidden", true);
	$('#sellersidebar').attr("hidden", false);
	$('#guestsidebar').attr("hidden", true);
	$('#adminsidebar').attr("hidden", true);
	$('#accReview').attr("hidden", false);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	
	$('#accLikes').text(currentUser.sellerLikes);
	$('#accDislikes').text(currentUser.sellerDislikes);
}

function noAccLogged(){
	$('#loggedUser').text('Logujte se, ili se registrujte!');
	$('#login').attr("hidden", false);
	$('#register').attr("hidden", false);
	$('#buyersidebar').attr("hidden", true);
	$('#sellersidebar').attr("hidden", true);
	$('#guestsidebar').attr("hidden", false);
	$('#adminsidebar').attr("hidden", true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', false);
	$('#searchByStatus').attr('hidden', true);
	
	
}

function inobxClick(){
	appendMessagesInbox();
	
	$('#divMsgInbox').attr('hidden', false);
	$('#adsItems').attr('hidden', true);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#divMsgOutbox').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
	
};

function outboxClick(){
	appendMessagesOutbox();
	
	$('#divMsgOutbox').attr('hidden', false);
	$('#divMsgInbox').attr('hidden', true);
	$('#adsItems').attr('hidden', true);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
}

function newMessageClick(){

	$('#divMsgInbox').attr('hidden', true);
	$('#adsItems').attr('hidden', true);
	$('#categories').attr('hidden', true);
	$('#createCategory').attr('hidden', true);
	$('#createMessage').attr('hidden', false);
	$('#divMsgOutbox').attr('hidden', true);
	$('#addNewAd').attr('hidden', true);
	$('#searchSidebar').attr('hidden', true);
	$('#changeCategory').attr('hidden', true);
	$('#changeAd').attr('hidden', true);
	$('#changeMessage').attr('hidden', true);
	$('#createRecension').attr('hidden', true);
	$('#divMyRecensions').attr('hidden', true);
	$('#detailedAd').attr('hidden', true);
	$('#usersDiv').attr('hidden', true);
}

$(document).ready(function() {
	
	currentUser = getLoggedUser();
	
	$.get({
		url: 'rest/ads/getAds',
		contentType: 'application/json',
		success: function(ads){			
		
			for(var i=0; i < ads.length; i++){
				allAdvertisements.push(ads[i]);
				sortedAds.push(ads[i]);
				addToCategory(ads[i]);
				addAdToDropdown(ads[i]);
				addCitiesToDropDown(ads[i]);
			}
			
			addAds();
			fillRecensionAds(ads);
			
		},
		error: function(){
			alert('greska!');
		}
	});
	
	$.get({
		url: 'rest/getUsers',
		contentType: 'application/json',
		success: function(users){
			
			for(var i = 0; i < users.length; i++){
				addUsersCB(users[i]);
				addUsersDropdown(users[i]);
				allUsers.push(users[i]);
				
			}
		},
		error: function(){
			console.log('greska');
		}
	});
	
	$.get({
		url: 'rest/messages/getMessages',
		contentType: 'application/json',
		success: function(msgs){
			
			for(var i = 0; i < msgs.length; i++){
				allMessages.push(msgs[i]);
			}
			
			allMessages.sort(sortMessagesByDate);
			
		},
		error: function(){
			alert('greska!');
		}
	});
	
	getCategories();
	getRecensions();
		
	$('#showCategories').click(function(e) {
		
		e.preventDefault();
		
		$('#adsItems').attr('hidden', true);
		$('#categories').attr('hidden', false);
		$('#createCategory').attr('hidden', true);
		$('#createMessage').attr('hidden', true);
		$('#divMsgInbox').attr('hidden', true);
		$('#divMsgOutbox').attr('hidden', true);
		$('#searchSidebar').attr('hidden', true);
		$('#changeCategory').attr('hidden', true);
		$('#changeAd').attr('hidden', true);
		$('#changeMessage').attr('hidden', true);
		$('#createRecension').attr('hidden', true);
		$('#divMyRecensions').attr('hidden', true);
		$('#detailedAd').attr('hidden', true);
		$('#usersDiv').attr('hidden', true);
		
		$.get({
			url: 'rest/category/getCategories',
			contentType: 'application/json',
			success: function(categories){
				$('#categories').html("");
				for(i = 0; i < categories.length; i++){
					addCategories(categories[i]);
				}
			}
		});		
		
	});
	
	$('#showAddCat').click(function(e){
		
		e.preventDefault();
		
		$('#adsItems').attr('hidden', true);
		$('#categories').attr('hidden', true);
		$('#createCategory').attr('hidden', false);
		$('#createMessage').attr('hidden', true);
		$('#divMsgInbox').attr('hidden', true);
		$('#searchSidebar').attr('hidden', true);
		$('#changeCategory').attr('hidden', true);
		$('#changeAd').attr('hidden', true);
		$('#changeMessage').attr('hidden', true);
		$('#createRecension').attr('hidden', true);
		$('#divMyRecensions').attr('hidden', true);
		$('#detailedAd').attr('hidden', true);
		$('#usersDiv').attr('hidden', true);
		
	});
	
	
	$('#sCreateAd').click(function(e){
		
		$('#adsItems').attr('hidden', true);
		$('#addNewAd').attr('hidden', false);
		$('#divMsgOutbox').attr('hidden', true);
		$('#divMsgInbox').attr('hidden', true);
		$('#createMessage').attr('hidden', true);
		$('#searchSidebar').attr('hidden', true);
		$('#changeCategory').attr('hidden', true);
		$('#changeAd').attr('hidden', true);
		$('#changeMessage').attr('hidden', true);
		$('#createRecension').attr('hidden', true);
		$('#divMyRecensions').attr('hidden', true);
		$('#detailedAd').attr('hidden', true);
		$('#usersDiv').attr('hidden', true);
		
	});
	
	$('#selectUsers').on('change', function() {
		  if(this.value == 0){
			  $('#inlineRadio1').prop("checked", true);
		  }else if(this.value == 1){
			  $('#inlineRadio2').prop("checked", true);
		  }else if(this.value == 2){
			  $('#inlineRadio3').prop("checked", true);
		  }
		});
	
	$('#formNewMessage').submit((event) => {
		
		event.preventDefault();
		
		var msgReciver = $('#selectMsgReciver option:selected').text();
		var msgTitle = $('#msgTitle').val();
		var msgAd = $('#selectMsgAd option:selected').text();
		var msgDescription = $('#msgContent').val();
		
		let msgDate = new Date();
		
		$.post({
			url: 'rest/messages/sendMessage',
			contentType: 'application/json',
			data: JSON.stringify({"msgId":generateUUID(), "adName":msgAd, "msgName":msgTitle, "msgSender":currentUser.username, "msgReciver":msgReciver,
									"msgContent":msgDescription, "msgDate":msgDate.getTime(), "deleted":false, "read":false}),
			success: function(){
				window.location = "./webshop.html";
			},
			error: function(){
				console.log("error");
			}
		});
		
	});
	
	$('#submitCat').submit((event) =>{
		event.preventDefault();
		
		
		var name = $('#catName').val();
		var description = $('#catDescription').val();
		var multiselect = $('#categoryAds').val();;
		var ads = [];
		
		for(var i = 0; i < allAdvertisements.length; i++){
			for(var j = 0; j < multiselect.length; j++){
					
				if(allAdvertisements[i].idAd == multiselect[j]){
					
					ads.push(allAdvertisements[i].idAd);
				}
			}
		}
		
		$.post({
			url: 'rest/category/addCategory',
			data: JSON.stringify({"name":name, "description":description, "active":true, "advertisements":ads}),
			contentType: 'application/json',
			success: function(){
				window.location = './webshop.html';
			},
			error: function(){
				console.log('error');
			}
			
		});
		
		
		
	});
	
	$('#submitAd').submit((event) =>{
		event.preventDefault();
		
		var name = $('#adName').val();
		var price = $('#adPrice').val();
		var city = $('#adCity').val();
		var description = $('#adDesc').val();
		var img = img64;
		
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;

		var yyyy = today.getFullYear();
		if (dd < 10) {
		  dd = '0' + dd;
		} 
		if (mm < 10) {
		  mm = '0' + mm;
		} 
		var today = mm + '/' + dd + '/' + yyyy;
		
		
		$.post({
			url: 'rest/ads/addNewAd',
			data: JSON.stringify({'idAd':generateUUID(), 'name':name, 'publisher':currentUser.username, 'price':price, 'description':description,
					'numLikes':0, 'numDislikes':0, 'imgPath':img, 'datePublished':today, 'dateExpired':mm + '/' + dd  + '/' + (yyyy + 1),
					'active':true, 'city':city, 'recensions':null, 'status':-1, 'numFavourites':0}),
			contentType: 'application/json',
			success: function(){
				window.location.reload();
			},
			error: function(){
				console.log('error');
			}
			
			
		});
		
	});
	
	$('#formNewRecension').submit((event) => {
		event.preventDefault();
		
		var adId = $('#selectRecAd option:selected').val();
		var recTitle = $('#recTitle').val();
		var recContent = $('#recContent').val();
		var recAutor = $('#recAutor').val();
		var recImage = recensionImage;
		var adCorrect;
		var dealFullfiled;
		var badAd;
		
		if($('#recCorrect').is(":checked")){
			adCorrect = true;
		}else{
			adCorrect = false;
		}
		
		if($('#recDeal').is(":checked")){
			dealFullfiled = true;
		}else{
			dealFullfiled = false;
		}
		
		// ako oglas ne valja, salje se upozorenje prodavcu
		if($('#recIncorrect').is(":checked")){
			
			$.post({
				
				url: 'rest/messages/badAdWarning/' + adId,
				contentType: 'application/json',
				success: function(){
					console.log('uspeo');
				},
				error: function(){
					console.log('ne ladi');
				}
					
			});
			
		}
		// kreiranje nove recenzije u fajl
		$.post({ //UMESTO isDescriptionCorrect u json-u ide descriptionCorrect isto i za isFullfiled ?!?!?!?!?!??!?!?!?!?!?!?!?
			
			url: 'rest/recensions/addRecension',
			data: JSON.stringify({'recensionId':generateUUID(), 'adId':adId, 'recensionist':recAutor, 'recensionName':recTitle,
					'recensionContent':recContent, 'img':recensionImage, 'descriptionCorrect':adCorrect, 'fullfiled':dealFullfiled, 'active':true}),
			contentType: 'application/json',
			success: function(){
				recensionImage = null;
				window.location.reload();
			},
			error: function(){
				console.log('Doslo je do greske!');
			}
			
		});
		
		
		
	});
	
	var btn = false;
	
	 $('#sidebarCollapse').on('click', function () {
		 if(btn === false){
			 $("#sidebarCollapse").html('Prikazi meni');
			 btn = true;
		 }else{
			 $("#sidebarCollapse").html('Zatvori meni');
			 btn = false;
		 }
	        $('#sidebar').toggleClass('active');   
	    });
	 
	if(currentUser != null){
		if(currentUser.role === 0){

			adminLogged();
			
		}else if(currentUser.role === 1){
			
			buyerLogged();
			
		}else if(currentUser.role === 2){
			
			sellerLogged();
		}
	}else{
		
		noAccLogged();
	}
	
	$('a[href="#odjava"]').click(function(){
		
		$.post({
			url: 'rest/logout',
			success: function(){
				window.location = "./login.html";
			}
		});
		
	});	
});
