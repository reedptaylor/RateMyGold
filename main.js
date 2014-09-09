function main() {
	var cells = document.getElementsByClassName('clcellprimary');
	var professors = [];
	var profCount = 0;

	//increment list to retrieve professor cell only
	for (var i=3; i<cells.length; i+=18) {
		//slice off &nbsp; character
		var profName = cells[i].innerText.slice(0,-1);	
		if (profName != 'T.B.A.' && profName != 'Cancel'){

			//slice off remaining space at end and push to professor array
			professors.push(profName.slice(0,-1));

			//create button for professor rating below professor name and add an event listener
			var div = cells[i+9];
			var searchName = professors[profCount].split(' ')[0];
			div.url = 'http://www.ratemyprofessors.com/SelectTeacher.jsp?searchName=' + searchName + '&search_submit1=Search&sid=1077';
			div.innerHTML = '<input class="rating" type="button" value="Show Rating" />';
			div.cell = cells[i+10];
			div.clicked = false;
			div.addEventListener('click', openPopup);

			profCount++;
		}
	}

	//action on button click 
	function openPopup() {
		if (this.clicked == true) {
			//remove popup
			this.cell.innerHTML = '';
			this.innerHTML = '<input class="rating" type="button" value="Show Rating" />';
			this.clicked = false;
		}
		else{
			//show popup
			this.clicked = true;
			this.innerHTML = '<input class="rating" type="button" value="Hide Rating" />';

			var popup = document.createElement('div');
			popup.className = 'popup';

			var link = document.createElement('p');
			link.innerText = this.url;

			popup.appendChild(link);
			this.cell.style.position = 'relative';
			this.cell.appendChild(popup);
		}
	}


	var xhr = new XMLHttpRequest();
	var url = 'http://www.ratemyprofessors.com/SelectTeacher.jsp?sid=1077';
	xhr.open('GET', url, true);

	xhr.onreadystatechange=function() {
  		if (xhr.readyState==4 && xhr.status==200)
   		{
   			var data = xhr.response;
   			cells[3].innerHTML = data;
    	}
    	else{
   		}
  	}
  	xhr.send();

};


main();







