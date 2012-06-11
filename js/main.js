//ASD Project 2
//James Floyd II 
//June 2, 2012


var parseAddGiftForm = function(data){
	// uses form data here;
	console.log(data);
};

$('#additemform').on('pageinit', function(){


    var aiform = $('#additemform'),
        aierrorslink = $('#aierrorslink')
    ;

    aiform.validate({
        invalidHandler: function(form, validator){
            aierrorslink.click();
            var html = '';
            for(var key in validator.submitted){
                var label = $('label[for^="'+ key +'"]').not('[generated]');
                var legend = label.closest('fieldset').find('.ui-controlgroup-label');
                var fieldName = legend.length ? legend.text() : label.text();
                html += '<li>'+ fieldName +'</li>';
            };
            $("#additemerrors ul").html(html);
        },
        submitHandler: function(){
            var data = aiform.serializeArray();
            parseAddGiftForm(data);
            storeData(key);
        }
    });


/*

//Wait for DOM to be ready
window.bind("DOMContentLoaded", function(){

	//getElementById Function
	function $(x){
		var theElement = document.getElementById(x);
		return theElement;
	}
	//Create select field element and populate with options
	function makeCats(){
		var formTag = document.getElementsByTagName("form"), //formTag is an array of all forms
			selectLi= $("select"),
			makeSelect = $("select");
			makeSelect.attr("id", "groups");
		for(var i=0, j=contactGroups.length; i<j; i++){
			var makeOption = $("option");
			var optText = contactGroups[i];
			makeOption.attr("value", optText);
			makeOption.html = optText;
			makeSelect.append(makeOption);
		}	
		selectLi.append(makeSelect);
	}
	
*/
	
	//Find the value of selected radio button
	function getSelectedRadio(){
		var radios = $("form").local;
		for(var i=0; i<radios.length; i++){
			if (radios[i].checked){
				purchaseValue = radios[i].val();
			}
		}
	}
	
	function toggleControls(n){
		switch(n){
			case "on":
				$("contactForm").css("display","none");
				$("clear").css("display","inline");
				$("displayLink").css("display","none");
				$("addNew").css("display","inline");
				break;
			case "off":
				$("contactForm").css("display","block");
				$("clear").css("display","inline");
				$("displayLink").css("display","inline");
				$("addNew").css("display","none");
				$("items").css("display","none");
				break;
			default:
				return false;
		}
	}
	
	function storeData(key){
	//If there is no key, this means this is a brand new item and we need a new key.
	if(!key){
		var id  		= Math.floor(Math.random()*10000001);
	}else {
		//Set the id to the existing key we're editing so that it will save over the data.
		//The key is the same key that's been passed along from the editSubmit envent handler
		//To the validate function, and then passed here, into the storeData function.
		id = key;
	}
	getSelectedRadio();
	var item		= {};
		item.group		= ["Group:", $("groups").val()];
		item.fname		= ["First Name:", $("fname").val()];
		item.lname		= ["Last Name:", $("lname").val()];
		item.gift		= ["Gift:", $("gift").val()];
		item.quantity	= ["Quantity:", $("quantity").val()];
		item.purchase	= ["Where to Buy:", purchaseValue]; 
		item.buydate	= ["Buy Date:", $("buydate").val()];
		item.notes		= ["Notes:", $("notes").val()];
		//Save data into Local Storage: Use Stringify to convert our object
		localStorage.setItem(id, JSON.stringify(item));
		alert("Contact Saved!");
		
	}
	
	function getData(){
	
		toggleControls("on");
		if(localStorage.length === 0){
			alert("There is no data in local storage, so default data was added.");
			autoFillData();
		}
		//Write Data from Local Storage to the browser.
		var makeDiv = $("div");
		makeDiv.attr("id", "items");
		var makeList = $("ul");
		makeDiv.append(makeList);
		document.body.append(makeDiv);
		$("items").css("display","block");
		for(var i=0, len=localStorage.length; i<len; i++){
			var makeLi = $("li");
			var linksLi = $("li");
			makeList.append(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			//Convert a string from local storage value back to an object by using JSON.parse
			var obj = JSON.parse(value);
			var makeSubList = $("ul");
			makeLi.append(makeSubList);
			getImage(obj.group[1], makeSubList);
			for(var n in obj){
				var makeSubLi = $("li");
				makeSubList.append(makeSubLi);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubLi.append(optSubText);
				makeSubList.append(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi);  //Create our edit and delete buttons/links for each item in Local Storage
		}
	}
	
	//Get Image for the right category
	function getImage (catName, makeSubList){
		var imageLi = $("li");
		makeSubList.append(imageLi);
		var newImg = $("img");
		var setSrc= newImg.attr("src", "images/"+ catName + ".png");
		imageLi.append(newImg);
	}
	
	//Auto Populate Local Storage
	function autoFillData() {
		//The actual JSON JOBKJECT data required for this to work is coming from our json.js file, which is laoaded from our HTML page.
		//Store the JSON OBJECT in local storage.
		for(var n in json) {
			var id = Math.floor(Math.random()*10000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	}
	
	//Make Item Links
	//Creat the edit and delete links for each stored item when displayed
	function makeItemLinks(key, linksLi){
		//add edit single item link
		var editLink = $("a");
		 editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Gift ";
		editLink.bind("click", editItem);
		editLink.html = editText; 
		linksLi.append(editLink);
		
		//add delete single item link
		var deleteLink = $("a");
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Gift";
		deleteLink.bind("click", deleteItem);
		deleteLink.html = deleteText;
		linksLi.append(deleteLink);
	}
	
	function editItem(){
		//Grab the data from our item from Local Storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);
		
		//Show the form
		toggleControls("off");
		
		//Populate the form fields with current localStorage values.
		$("groups").val() = item.group[1];
		$("fname").val() = item.fname[1];
		$("lname").val() = item.lname[1];
		$("gift").val() = item.gift[1];
		$("quantity").val() = item.quantity[1];
		var radios = $("form").local;
		for(var i=0; i<radios.length; i++){
			if(radios[i].val() == "online" && item.purchase[1] == "online"){
				radios[i].attr("checked", "checked");
			}else if(radios[i].val() == "store" && item.purchase[1] == "store"){
				radios[i].attr("checked", "checked");
			}
		}
		$("buydate").val() = item.buydate[1];
		$("notes").val() = item.notes[1];
		
		save.unbind("click", storeData);

		$("submit").val() = "Edit Contact";
		var editSubmit = $("submit");

		editSubmit.bind("click", validate);
		editSubmit.key = this.key;
	}
	
	function deleteItem(){
		var ask = confirm("Are you sure you want to delete this gift?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Gift was deleted!");
			window.location.reload();
		}else{
			alert("Gift was not deleted.")
		}
	}
	
	function clearLocal(){
		if(localStorage.length === 0){
			alert("There is no data to clear.")
		}else{
			localStorage.clear();
			alert("All gifts are deleted!");
			window.location.reload();
			return false;
		}
	}
	
/*	
	
	function validate(e){
		//Define the elements we want to check
		var getGroup = $("groups");
		var getFname = $("fname");
		var getLname = $("lname");
		var getGift = $("gift");
		
		//Reset Error Messages
		errMsg.html = "";
		getGroup.css("border","1px solid black");
		getFname.css("border","1px solid black");
		getLname.css("border","1px solid black");
		getGift.css("border","1px solid black");
		
		//Get error messages
		var messageAry = [];
		//Group validation
		if(getGroup.val() === "--Choose A Group--"){
			var groupError = "Please choose a group.";
			getGroup.css("border","1px solid red");
			messageAry.push(groupError);
		}
		
		//First Name Validation
		if(getFname.val() === ""){
			var fNameError = "Please enter a first name.";
			getFname.css("border","1px solid red");
			messageAry.push(fNameError);
		}
		
		//Last Name Validation
		if(getLname.val() === ""){
			var lNameError = "Please enter a last name.";
			getLname.css("border","1px solid red");
			messageAry.push(lNameError);
		}
		
		//Gift Validation
		if(getGift.val() === ""){
			var giftError = "Please a gift.";
			getGift.css("border","1px solid red");
			messageAry.push(giftError);
		}
		
		//If there were errors display them on the screen
		if(messageAry.length >= 1){
			for(var i=0, j=messageAry.length; i < j; i++){
				var txt = $("li");
				txt.html = messageAry[i];
				errMsg.append(txt);
			}
			e.preventDefault();
			return false;
		}else {
			//If all is ok save data! Send the key value (which came from the editData function)
			//Remember this key value was passed through the editSubmit event listener as a property.
			storeData(this.key);
		}
	}
	
*/
	
	 //Variable Defaults
	var contactGroups = ["--Choose A Group--", "Family", "Non-Family"],
		purchaseVaule,
		errMsg = $("errors");
	;
	makeCats();

	//Set Link & Submit Click Events
	var displayLink =  $("#displayLink");
	displayLink.bind("click", getData);
	var clearLink = $("#clear");
	clearLink.bind("click", clearLocal); 
	var save = $("#submit");
	save.bind("click", validate);
});


