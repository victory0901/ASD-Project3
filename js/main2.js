$(document).ready(function () {
	$('#jsonButt').bind('click', function(){
        console.log("JSON Button pressed");
        
        $('#jsonlist').empty();
        $.ajax({
            url: 'xhr/data.json',
            type: 'GET',
            dataType: 'json',
            success: function(response){
                for(var i = 0, j=response.myJson.length; i<j; i++){
                    var myj = response.myJson[i];
                    $(''+
                        '<ul>'+
                            '<li>'+ myj.group[0] + myj.group[1] +'</li>'+
                            '<li>'+ myj.fname[0] + myj.fname[1] +'</li>'+
                            '<li>'+ myj.lname[0] + myj.lname[1] +'</li>'+
                            '<li>'+ myj.gift[0] + myj.gift[1] +'</li>'+
                            '<li>'+ myj.quantity[0] + myj.quantity[1] +'</li>'+
                            '<li>'+ myj.purchase[0] + myj.purchase[1] +'</li>'+
                            '<li>'+ myj.buydate[0] + myj.buydate[1] +'</li>'+
                            '<li>'+ myj.notes[0] + myj.notes[1] +'</li>'+
                        '</ul>'
                     ).appendTo('#jsonlist');
                 }
             }
        });
        $("#jsonlist").listview("refresh");
    });


// XML ***************************************************************************************    


     $('#xmlButt').bind('click', function(){
         console.log("XMl Button Pressed");
		 $('#xmllist').empty();	
         $.ajax({
             url: 'xhr/data.xml',
             type: 'GET',
             dataType: 'xml',
             success: function(xmlData){
                 $(xmlData).find("present").each(function(){
					var group = $(this).find('group').text();
                     var fname = $(this).find('fname').text();
                     var lname = $(this).find('lname').text();
                     var gift = $(this).find('gift').text();
                     var quantity = $(this).find('quantity').text();
                     var purchase = $(this).find('purchase').text();
                     var buydate = $(this).find('buydate').text();
                     var notes = $(this).find('notes').text();
                     $('#xmllist').append($(' ' +
                         '<ul>' +
                         '<li>Group: ' + group + '</li>' +
                         '<li>First Name: ' + fname + '</li>' +
                         '<li>Last Name: ' + lname + '</li>' +
                         '<li>Gift: ' + gift + '</li> ' +
                         '<li>Quantity: ' + quantity + '</li> ' +
                         '<li>Where to Buy: ' + purchase + '</li> ' +
                         '<li>Buy Gift By: ' + buydate + '</li> ' +
                         '<li>Notes: ' + notes + '</ul><br/>'));


                 });
         $('xmllist').listview('refresh');
             }

         });

     });

// CSV ***************************************************************************************     
 
 
 	$('#csvButt').bind("click", function (){
         console.log("CSV Button Pressed");
         $('#csvlist').empty();
         $.ajax({
         url: 'xhr/data.csv',
         type: 'GET',
         dataType: 'text',
         success: function(csvData){
             var items = csvData.split("\n");
             for(var n=1; n < items.length; n++){
                 var row = items[n];
                 var columns = row.split(",");

                 $('#csvlist').append($(' ' +
                     '<ul>' +
                     '<li> ' + row + '</li> ' +
                     '</ul><br/>'));
                }
             }
         });
     });     
     
});






