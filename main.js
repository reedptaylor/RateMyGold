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
			var searchName = '';

			//check if professor's last name is two words to include in search
			var nameArray = professors[profCount].split(' ');
			if (nameArray.length == 1){ //special case for single name on gold
				searchName = nameArray[0];
				div.firstName = ' ';
			}
			else if (nameArray[1].length > 1){ 
				searchName = nameArray[0] + ' ' + nameArray[1] 
				div.firstName = nameArray[2];
			}
			else{ 
				searchName = nameArray[0]; 
				div.firstName = nameArray[1];
			}

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
		popup.innerText = 'Loading...';
		var firstName   = this.firstName;
		this.cell.style.position = 'relative';
		this.cell.appendChild(popup);

		chrome.runtime.sendMessage({ //need a separate event page to do the xmlhttprequest because of http to https issue
    		url: this.searchURL,
		}, function(responseText) {
			var tmp        = document.createElement('div');//make a temp element so that we can search through its html
   			tmp.innerHTML  = responseText;
   			var foundProfs = tmp.getElementsByClassName('listing PROFESSOR'); 
   			
   			if (foundProfs.length == 0){ //if no results were returned, print this message
   				var emptyPopup       = popup;
                emptyPopup.className = 'notFoundPopup';
                var notFound         = document.createElement('div');
                var idk              = document.createElement('div');
                
                notFound.className   = 'notFound';
                idk.className        = 'idk';
                notFound.innerText   = "Professor not found";
                idk.innerText        = "¯\\_(ツ)_/¯";
                
                emptyPopup.innerHTML = '';
                emptyPopup.appendChild(notFound);
                emptyPopup.appendChild(idk);
   			}
   			else{ //iterate through the search results and match by first letter of first name to verify identity
   				var length = foundProfs.length;
   				for (var i = 0; i < length; i++){
   					var tmp          = document.createElement('div');
   					tmp.innerHTML    = foundProfs[i].innerHTML;
   					var name         = tmp.getElementsByClassName('main')[0].innerText;

   					if (firstName.charAt(0) == name.split(',')[1].charAt(1)){
   						break;
   					}
   					else if (i == length-1) {
   						var emptyPopup       = popup;
                		emptyPopup.className = 'notFoundPopup';
                		var notFound         = document.createElement('div');
                		var idk              = document.createElement('div');
                
               			notFound.className   = 'notFound';
                		idk.className        = 'idk';
                		notFound.innerText   = "Professor not found";
                		idk.innerText        = "¯\\_(ツ)_/¯";
                
		                emptyPopup.innerHTML = '';
        		        emptyPopup.appendChild(notFound);
                		emptyPopup.appendChild(idk);
   						return 0;
   					}
   				}//end for loop

   				//get the link for the actual professor page
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
					// var hotness       		= overallAndAvg[2];
   					// var isCold		  		= /cold/.test(hotness.innerHTML);
   					// var isWarm		 		= /warm/.test(hotness.innerHTML); 
   					// var hotnessFinal  		= " - ";
   					// if(isCold || isWarm) 	{hotnessFinal = "Not hot";}
   					// else 		    		{hotnessFinal = "Hot";}

   					var overall       = overallAndAvg[0];
   					var avgGrade      = overallAndAvg[1];
   					var helpfulness   = otherRatings[0];
   					var clarity       = otherRatings[1];
   					var easiness      = otherRatings[2];
   					tmp.remove();
 
   					//create the ratings divs
   					var profNameDiv        = document.createElement('div');

                    var overallDiv         = document.createElement('div');
                    var overallTextDiv     = document.createElement('div');

                    var avgGradeDiv        = document.createElement('div');
                    var avgGradeTextDiv    = document.createElement('div');

                    var helpfulnessDiv     = document.createElement('div');
                    var helpfulnessTextDiv = document.createElement('div');

                    var clarityDiv         = document.createElement('div');
                    var clarityTextDiv     = document.createElement('div');

                    var easinessDiv        = document.createElement('div');
                    var easinessTextDiv    = document.createElement('div');

                    //assign class names for styling
                    profNameDiv.className        = 'profName';

                    overallDiv.className         = 'overall';
                    overallTextDiv.className     = 'overallText';

                    avgGradeDiv.className        = 'avgGrade';
                    avgGradeTextDiv.className    = 'avgGradeText';

                    helpfulnessDiv.className     = 'helpfulness';
                    helpfulnessTextDiv.className = 'helpfulnessText';

                    clarityDiv.className         = 'clarity';
                    clarityTextDiv.className     = 'clarityText';

                    easinessDiv.className        = 'easiness';
                    easinessTextDiv.className    = 'easinessText';

                    //put rating data in divs
                    profNameDiv.innerHTML        = '<a href="'+ this.profURL + '">'+ proffName + " " + proflName; + '</a>';

                    overallDiv.innerText         = 'Overall Quality';
                    overallTextDiv.innerText     = overall.innerHTML;

					avgGradeDiv.innerText        = 'Average Grade';
					avgGradeTextDiv.innerText    = avgGrade.innerHTML;

					helpfulnessDiv.innerText     = 'Helpfulness';
					helpfulnessTextDiv.innerText = helpfulness.innerHTML;

					clarityDiv.innerText         = 'Clarity';
					clarityTextDiv.innerText     = clarity.innerHTML;

					easinessDiv.innerText        = 'Easiness';
					easinessTextDiv.innerText    = easiness.innerHTML;

					//add divs to popup
					popup.innerHTML = ''; //remove 'loading...' text
					popup.appendChild(profNameDiv);
   					popup.appendChild(overallDiv);
   					popup.appendChild(overallTextDiv);
   					popup.appendChild(avgGradeDiv);
   					popup.appendChild(avgGradeTextDiv);
   					popup.appendChild(helpfulnessDiv);
   					popup.appendChild(helpfulnessTextDiv);
   					popup.appendChild(clarityDiv);
   					popup.appendChild(clarityTextDiv);
   					popup.appendChild(easinessDiv);
   					popup.appendChild(easinessTextDiv);

				});//end message
			}//end else
		});//end message
	}//end else
}//end openPopup()

main();






