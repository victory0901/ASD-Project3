$(document).ready(function(){
	console.log("I am ready");
	
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
}); 
