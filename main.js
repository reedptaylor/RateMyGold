function main() {
	var cells      = document.getElementsByClassName('clcellprimary');
	var length     = cells.length;
	var professors = [];
	var profCount  = 0;

	for (var i = 3; i < length; i += 18) { //iterate through the cells, only those which contain a professor name
		var profName = cells[i].innerText.slice(0,-1); //slice off &nbsp; character	
		if (profName != 'T.B.A.' && profName != 'Cancel'){
			professors.push(profName.slice(0,-1)); //slice off remaining space at end and push to professor array
			var div        = cells[i+9]; //cell where the button will go
			var searchName = professors[profCount].split(' ')[0]; //slice off all characters except last name
			div.searchURL  = 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+california+santa+barbara&queryoption=HEADER&query='+ searchName +'&facetSearch=true';
			div.profURL    = '';
			div.innerHTML  = '<input class="ratingButton" type="button" value="SHOW RATING" />';
			div.cell       = cells[i+10]; //cell where the popup's html will be placed
			div.clicked    = false;
			div.addEventListener('click', openPopup);
			profCount++;
		}//end if
	}//end for
}//end main()

function openPopup() {
	if (this.clicked == true) { //happens when button was clicked while active
		this.cell.innerHTML = '';
		this.innerHTML      = '<input class="ratingButton" type="button" value="SHOW RATING" />';
		this.clicked        = false;
	}
	else { //happens when button was clicked while inactive
		this.clicked    = true;
		this.innerHTML  = '<input class="ratingButton" type="button" value="HIDE RATING" />';	
		var popup       = document.createElement('div');
		popup.className = 'popup';

		this.cell.style.position = 'relative';
		this.cell.appendChild(popup);
		popup.innerText = 'Loading...'

		chrome.runtime.sendMessage({ //need a separate event page to do the xmlhttprequest because of http to https issue
    		url: this.searchURL,
		}, function(responseText) {
			var tmp        = document.createElement('div');//make a temp element so that we can search through its html
   			tmp.innerHTML  = responseText;
   			var foundProfs = tmp.getElementsByClassName('listing PROFESSOR'); 
   			
   			if (foundProfs.length == 0){ //if no results were returned, print this message
   				popup.innerText = "Professor has no ratings.";
   			}
   			else{
   				tmp.innerHTML  = foundProfs[0].innerHTML;
   				var link       = tmp.getElementsByTagName('a');
   				this.profURL   = 'http://www.ratemyprofessors.com/' + link[0].toString().slice(23); //this is the URL

   				chrome.runtime.sendMessage({ //make another xmlhttprequest using the actual professor link
    				url: this.profURL,
				}, function(responseText) {
					tmp             = document.createElement('div');
   					tmp.innerHTML   = responseText;
   					var proffName	= tmp.getElementsByClassName('pfname')[0].innerText;
   					var proflName	= tmp.getElementsByClassName('plname')[0].innerText;
   					var ratingInfo  = tmp.getElementsByClassName('left-breakdown')[0];
   					tmp.innerHTML   = ratingInfo.innerHTML;

   					//get the raw rating data
   					var overallAndAvg = tmp.getElementsByClassName('grade');
   					var otherRatings  = tmp.getElementsByClassName('rating');

   					//handle hotness
					var hotness       = overallAndAvg[2];
   					var isCold		  = /cold/.test(hotness.innerHTML);
   					var isWarm		  = /warm/.test(hotness.innerHTML); 
   					var isHot		  = /hot/.test(hotness.innerHTML);
   					var hotnessFinal  = " - ";
   					if(isCold)        {hotnessFinal = "Cold";}
   					else if(isWarm)   {hotnessFinal = "Warm";}
   					else if(isHot)    {hotnessFinal = "Hot";}

   					var overall       = overallAndAvg[0];
   					var avgGrade      = overallAndAvg[1];
   					var helpfulness   = otherRatings[0];
   					var clarity       = otherRatings[1];
   					var easiness      = otherRatings[2];
   					tmp.remove();
 
   					//create the ratings divs
   					var profNameDiv	   = document.createElement('div');
   					var overallDiv     = document.createElement('div');
					var avgGradeDiv    = document.createElement('div');
					var hotnessDiv	   = document.createElement('div');
					var helpfulnessDiv = document.createElement('div');
					var clarityDiv     = document.createElement('div');
					var easinessDiv    = document.createElement('div');

					//assign class names for styling
					profNameDiv.className 	 = 'rating';
					overallDiv.className     = 'rating';
					avgGradeDiv.className    = 'rating';
					hotnessDiv.className     = 'rating';
					helpfulnessDiv.className = 'rating';
					clarityDiv.className     = 'rating';
					easinessDiv.className    = 'rating';

					//put rating data in divs
					profNameDiv.innerText	 = 	proffName + " "    + proflName;
					overallDiv.innerText     = 'Overall Quality: ' + overall.innerHTML;
					avgGradeDiv.innerText    = 'Average Grade: '   + avgGrade.innerHTML;
					hotnessDiv.innerText     = 'Hotness: '         + hotnessFinal;
					helpfulnessDiv.innerText = 'Helpfulness: '     + helpfulness.innerHTML;
					clarityDiv.innerText     = 'Clarity: '         + clarity.innerHTML;
					easinessDiv.innerText    = 'Easiness: '        + easiness.innerHTML;

					//add divs to popup
					popup.innerHTML = ''; //remove 'loading...' text
					popup.appendChild(profNameDiv);
   					popup.appendChild(overallDiv);
   					popup.appendChild(avgGradeDiv);
   					popup.appendChild(hotnessDiv);
   					popup.appendChild(helpfulnessDiv);
   					popup.appendChild(clarityDiv);
   					popup.appendChild(easinessDiv);

				});//end message
			}//end else
		});//end message
	}//end else
}//end openPopup()

main();






