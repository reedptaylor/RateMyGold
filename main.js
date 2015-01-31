function main() {
	var cells      = document.getElementsByClassName('clcellprimary');
	var length     = cells.length;
	var professors = [];
	var profCount  = 0;

	for (var i = 3; i < length; i += 18) {
		var profName = cells[i].innerText.slice(0,-1); //slice off &nbsp; character	
		if (profName != 'T.B.A.' && profName != 'Cancel'){
			professors.push(profName.slice(0,-1)); //slice off remaining space at end and push to professor array
			var div        = cells[i+9];
			var searchName = professors[profCount].split(' ')[0];
			div.searchURL  = 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+california+santa+barbara&queryoption=HEADER&query='+ searchName +'&facetSearch=true';
			div.profURL    = '';
			div.innerHTML  = '<input class="ratingButton" type="button" value="SHOW RATING" />';
			div.cell       = cells[i+10];
			div.clicked    = false;
			div.addEventListener('click', openPopup);
			profCount++;
		}//end if
	}
}

function openPopup() {
	if (this.clicked == true) {
		this.cell.innerHTML = '';
		this.innerHTML      = '<input class="ratingButton" type="button" value="SHOW RATING" />';
		this.clicked        = false;
	}
	else {
		this.clicked    = true;
		this.innerHTML  = '<input class="ratingButton" type="button" value="HIDE RATING" />';	
		var popup       = document.createElement('div');
		popup.className = 'popup';

		this.cell.style.position = 'relative';
		this.cell.appendChild(popup);

		chrome.runtime.sendMessage({
    		url: this.searchURL,
		}, function(responseText) {
			var tmp        = document.createElement('div');//make a temp element so that we can search through its html
   			tmp.innerHTML  = responseText;
   			var foundProfs = tmp.getElementsByClassName('listing PROFESSOR'); //throw exception here if null
   			tmp.innerHTML  = foundProfs[0].innerHTML;
   			var link       = tmp.getElementsByTagName('a');
   			this.profURL   = 'http://www.ratemyprofessors.com/' + link[0].toString().slice(23); //this is the URL
   			

   				chrome.runtime.sendMessage({
    				url: this.profURL,
				}, function(responseText) {
					var tmp         = document.createElement('div');//make a temp element so that we can search through its html
   					tmp.innerHTML   = responseText;
   					var foundProfs  = tmp.getElementsByClassName('rating-breakdown');
   					popup.innerHTML = foundProfs[0].innerHTML;
				});


		});
	}
}

//get event page to do xmlhttprequest
		


main();






