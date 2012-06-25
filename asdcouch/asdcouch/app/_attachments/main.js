$("#home").bind('pageinit', function(){
	console.log("I am ready");
	$.couch.db("asdproject").view("app/gifts", {
		success: function(data){
			console.log(data);
			$.each(data.rows, function(index, gift){
				var group = gift.value.group[1]; 
				var fname = gift.value.fname[1];
				var lname = gift.value.lname[1];
				var giftx = gift.value.gift[1];	
				var quantity = gift.value.quantity[1];
				var purchase = gift.value.purchase[1];
				var buydate = gift.value.buydate[1];
				var notes = gift.value.notes[1];  
				$(''+
                        '<ul>' +
                        '<li>'+ 'Group: ' + group + '</li>' +
                        '<li>'+ 'Name: ' + fname + " " + lname +'</li>'+
                        '<li>'+ 'Gift: ' + giftx +'</li>'+	
                        '<li>'+ 'Quantity: ' + quantity +'</li>'+
                        '<li>'+ 'Purchase: ' + purchase +'</li>'+
                        '<li>'+ 'Buy Date: ' + buydate +'</li>'+
                        '<li>'+ 'Notes: ' + notes +'</li>'+ 
                        '</ul>'	+ '<br />'
                     ).appendTo('#giftlist');
			});
			$("#giftlist").listview("refresh");
		}
	});
	
	/*	
	$.ajax({
		"url": "_view/gifts",
		"dataType": "json",
		"success": function(data){
			$.each(data.rows, function(index, gift){
				var group = gift.value.group[1]; 
				var fname = gift.value.fname[1];
				var lname = gift.value.lname[1];
				var giftx = gift.value.gift[1];	
				var quantity = gift.value.quantity[1];
				var purchase = gift.value.purchase[1];
				var buydate = gift.value.buydate[1];
				var notes = gift.value.notes[1];  
				$(''+
                        '<ul>' +
                        '<li>'+ 'Group: ' + group + '</li>' +
                        '<li>'+ 'Name: ' + fname + " " + lname +'</li>'+
                        '<li>'+ 'Gift: ' + giftx +'</li>'+	
                        '<li>'+ 'Quantity: ' + quantity +'</li>'+
                        '<li>'+ 'Purchase: ' + purchase +'</li>'+
                        '<li>'+ 'Buy Date: ' + buydate +'</li>'+
                        '<li>'+ 'Notes: ' + notes +'</li>'+ 
                        '</ul>'	+ '<br />'
                     ).appendTo('#giftlist');
				console.log(data);
				
			});
			$("#giftlist").listview("refresh");
		}
	});
 */

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
            storeData();
        }
    });


	
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
	
	function storeData(key, rev){
	//If there is no key, this means this is a brand new item and we need a new key.
	if(!key){
		var id  		= Math.floor(Math.random()*10000001);
	}else {
		//Set the id to the existing key we're editing so that it will save over the data.
		//The key is the same key that's been passed along from the editSubmit event handler
		//To the validate function, and then passed here, into the storeData function.
		id = key;
	}
	getSelectedRadio();
	var item			= {};
		item._id		= key;
		item._rev		= rev;
		item.group		= ["Group:", $("groups").val()];
		item.fname		= ["First Name:", $("fname").val()];
		item.lname		= ["Last Name:", $("lname").val()];
		item.gift		= ["Gift:", $("gift").val()];
		item.quantity	= ["Quantity:", $("quantity").val()];
		item.purchase	= ["Where to Buy:", purchaseValue]; 
		item.buydate	= ["Buy Date:", $("buydate").val()];
		item.notes		= ["Notes:", $("notes").val()];
		
		//Save data into Local Storage: Use Stringify to convert our object
		$.couch.db('asdproject').saveDoc(item, {
        	success: function(data) {
                alert("Gift saved.");
        	}
        });
		
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
//		document.body.append(makeDiv);
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
/*		for(var n in json) {
			var id = Math.floor(Math.random()*10000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		} */
	} 
	
	//Make Item Links
	//Creat the edit and delete links for each stored item when displayed
	function makeItemLinks(key, linksLi){
		
		//add edit single item link
		var editLink = $("a");
		 editLink.prop("href","#");
		editLink.key = key;
		
		var editText = "Edit Gift ";
		$(editLink).bind("click", function(){
			editItem(key);
		});
		editLink.html = editText; 
		linksLi.append(editLink);
		
		//add delete single item link
		var deleteLink = $("a");
		deleteLink.prop("href", "#");
		deleteLink.key = key;
		
		var deleteText = "Delete Gift";
		$(deleteLink).bind("click", function(){
			deleteItem(key);
		});
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
		$(editSubmit).on("click", function(){
			storeData(key);
			return false;		
		});	
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
	

	//Set Link & Submit Click Events
	var displayLink =  $("#displayLink");
	displayLink.bind("click", getData);
	var clearLink = $("#clear");
	clearLink.bind("click", clearLocal); 
	var save = $("#submit");
	$("#submit").bind('click',function () {
		storeData();
	});
});