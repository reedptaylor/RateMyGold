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
			div.url        = 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+california+santa+barbara&queryoption=HEADER&query='+ searchName +'&facetSearch=true';
			div.innerHTML  = '<input class="ratingButton" type="button" value="Show Rating" />';
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
		this.innerHTML      = '<input class="ratingButton" type="button" value="Show Rating" />';
		this.clicked        = false;
	}
	else {
		this.clicked    = true;
		this.innerHTML  = '<input class="ratingButton" type="button" value="Hide Rating" />';	
		var popup       = document.createElement('div');
		popup.className = 'popup';

		this.cell.style.position = 'relative';
		this.cell.appendChild(popup);

		var xhr = new XMLHttpRequest();
		xhr.popup = popup;

		xhr.open("GET", chrome.extension.getURL(this.url), true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				//var data = xhr.responseText;
   				//xhr.popup.innerHTML = "test";
   				alert(xhr.responseXML);
			}
		}
		xhr.send();


	}
}

main();






