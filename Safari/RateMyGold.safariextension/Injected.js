//displays icon in address bar when script is active
function showPageAction( tabId, changeInfo, tab ) {
	if(tab.url == "https://my.sa.ucsb.edu/gold/ResultsFindCourses.aspx"){
		chrome.pageAction.show(tabId);
	}
};

//chrome.tabs.onUpdated.addListener(showPageAction);

// I think this is the function I want to do that ^ above
safari.self.tab.dispatchMessage("calcThis",theData);


//function to make xmlhttprequests

safari.application.addEventListener("message",function(request, sender, callback) { 
	var xhr = new XMLHttpRequest();

	xhr.onload = function() {
    	callback(xhr.responseText);
    };
	xhr.onerror = function() {
		callback();
 	};
 	
  	xhr.open('GET', request.url, true);
   	xhr.send();
   	return true; // prevents the callback from being called too early on return   
},false);





// chrome.runtime.onMessage.addListener(function(request, sender, callback) { 
// 	var xhr = new XMLHttpRequest();

// 	xhr.onload = function() {
//     	callback(xhr.responseText);
//     };
// 	xhr.onerror = function() {
// 		callback();
//  	};
 	
//   	xhr.open('GET', request.url, true);
//    	xhr.send();
//    	return true; // prevents the callback from being called too early on return   
// });
