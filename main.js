var cells = document.getElementsByClassName('clcellprimary');
var professors = [];
var profCount = 0;


//increment list to retrieve professor name only
for (var i=3; i<cells.length; i+=18) {
	//slice off &nbsp; character
	var profName = cells[i].innerText.slice(0,-1);	
	if (profName != 'T.B.A.' && profName != 'Cancel'){

		//slice off remaining space at end and push to professor array
		professors.push(profName.slice(0,-1));
		
		//create link to professor rating
		link = document.createElement('a');
		//link.className = 'ratingLink';
		var searchName = professors[profCount].split(' ')[0];
		link.href = 'http://www.ratemyprofessors.com/SelectTeacher.jsp?searchName=' + searchName + '&search_submit1=Search&sid=1077';
		link.innerHTML = '<input class="rating" type="button" value="Rating" />';

		cells[i+9].appendChild(link);
		
		profCount++;
	}

}
