
var serverUrl = "http://127.0.0.1:8080/data1.json";
var arrLocalStorage;
var intDataLength = 10;
var isHideOrShowView = false;
var intValueSubmitId;
var strScrollValue = "";

jQuery.ajax({
    type: "GET",
    url : serverUrl,
    success : function(data)
    {
        pageLoad(data);   
    },
    error : function(error)
    {
        console.log(error);
    }

});


function pageLoad(data)
{
   // console.log("hi");
    if(!localStorage.getItem("allData"))
    {
            arrLocalStorage = [];
             addIntoArray(data);
             display(intDataLength);
     }
     else
     {
         
        display(intDataLength);
     }   
}

function addIntoArray(data)
{
    for(var i=0; i<=100; i++)
    {
        // for(var i in data)
        // {
                        var arrLocation = [];
                        var strLocation = "";
                        for(var m in data[0].location)
                        {
                            strLocation = strLocation +","+ data[0].location[m];
                        }
                        var entry = {
                            "firstname" : "firstname_"+[i],
                            "lastname" : "lastname_"+[i],
                            "email" : "user"+[i]+"@google.com",
                            "phone" : "34324324323"+[i],
                            "location" : strLocation+[i],
                            "batch" : "UI"+[i],
                            "address" :  { 
                                            "communication" : data[0].address.communication+[i],
                                            "permanent" : data[0].address.permanent+[i]
                                        },
                            "previous_employer" :  data[0].previous_employer.google+[i]+","+data[0].previous_employer.facebook+[i]+ ","+data[0].previous_employer.linkedIn+[i],                                                            
                            };
                    arrLocalStorage.push(entry);
         }
      localStorage.setItem("allData",JSON.stringify(arrLocalStorage));
}

//Select value display row usign dropdown box
jQuery('#dropdown_id').change(function(){
    if( this.value != "onscroll")
    {
        strScrollValue = this.value;
        intDataLength = parseInt(this.value);
        display(intDataLength);    
    }
    else
    {
        strScrollValue = this.value;
    }   
    
});



function display(intDataLength)
{
    arrLocalStorage = JSON.parse(localStorage.getItem("allData"));
    $('tr[id^="tr_id"]').remove(); // Remove table and again construct
    $('#divNoRecord').remove();
    var flagValue = false; 
    if(intDataLength >= arrLocalStorage.length)
    {
        intDataLength = arrLocalStorage.length;
        flagValue = true;
    }
    for(var x=0; x<intDataLength; x++)
    {
       jQuery('#tblData').append(`
              <tr id="tr_id${x}">
              <td class ="firstname" > ${arrLocalStorage[x].firstname} </td>
              <td class= "lastname"> ${arrLocalStorage[x].lastname} </td>
              <td> ${arrLocalStorage[x].email} </td>
              <td class="location"> ${arrLocalStorage[x].location} </td>
              <td class="phone"> ${arrLocalStorage[x].phone} </td>
              <td class="batch"> ${arrLocalStorage[x].batch} </td>
              <td> ${arrLocalStorage[x].address.communication} </td>
              <td> ${arrLocalStorage[x].address.permanent} </td>
              <td> 
                <input id="view_${x}" type="button" value="view"> 
                <input id="edit_${x}" type="button" value="edit">
                <input id="delete_${x}" type="button" value="delete">
              </td>
            </tr>
       `);
    }
    if(flagValue)
    {
        jQuery('#tblData').after(`<div id="divNoRecord" align="center"> NO More Record </div>`);
    }
    
}

//Delete iterm from data base 
jQuery(document).on('click','input[id^="delete_"]',function()
{
    var strDelete_id = jQuery(this).attr('id');
    var strTrDeleteId = strDelete_id.replace("delete_","tr_id");
    var intValueId = parseInt(strTrDeleteId.replace("tr_id","")); 
    // console.log(localStorage.getItem("allData",arrLocalStorage[intValueId])); 
    localStorage.removeItem("allData");
    arrLocalStorage.splice(intValueId,1);
    localStorage.setItem("allData",JSON.stringify(arrLocalStorage));
    display(intDataLength);
});


//Edit button 
jQuery(document).on('click','input[id^="edit_"]',function()
{
     var strEdit_id = jQuery(this).attr('id');
     var strTrEditId = strEdit_id.replace("edit_","tr_id");
     var intValueEditId = parseInt(strTrEditId.replace("tr_id",""));
     $('tr').remove("#tr_view_id"+intValueEditId);
    if(jQuery('#tr_edit_view_id'+intValueEditId).attr('id') != undefined)
    {
        $('tr').remove("#tr_edit_view_id"+intValueEditId);
    }
    else   
    {  
        jQuery('#'+strTrEditId).after(`
             <tr id="tr_edit_view_id${intValueEditId}">
             </tr>
        `)
        $('form#insertDataIntoForm input').each(function(index){ 
            var strKeyValue = $(this).attr("name");
            if(strKeyValue != "submit")
            {
                if(strKeyValue == "communication" || strKeyValue == "permanent")
                {
                    jQuery("#tr_edit_view_id"+intValueEditId).append(`<td> <input name="strKeyValue" type="text" value ="${arrLocalStorage[intValueEditId]["address"][strKeyValue]}"</td>`);
                }
                else
                {
                    jQuery("#tr_edit_view_id"+intValueEditId).append(`<td> <input name="${strKeyValue}" type ="text"  value ="${arrLocalStorage[intValueEditId][strKeyValue]}"</td>`);    
                }
            }
        });
        jQuery("#tr_edit_view_id"+intValueEditId).append(`<tr> <td> <input id="btn_edit_submit_id${intValueEditId} name="submit" type="button" value="submit"> </td> </tr>`);

    }
});

//submit button
jQuery(document).on('click','input[id^="btn_edit_submit_id"]',function()
{
    var strBtnSubmit_id = jQuery(this).attr('id');
    var strTrSubmitId = strBtnSubmit_id.replace("btn_edit_submit_id","tr_id");
    intValueSubmitId = parseInt(strTrSubmitId.replace("tr_id",""));
    // console.log('#tr_edit_view_id'+intValueSubmitId+" td input");
    // var strValueSubmitId = strTrSubmitId.replace("tr_id","");
        $('#tr_edit_view_id'+intValueSubmitId+" td input").each(function(){
            var strKeyValue = $(this).attr("name");
            if(strKeyValue != "submit")
            {
                if(strKeyValue == "communication" || strKeyValue == "permanent")
                {
                    arrLocalStorage[intValueSubmitId]["address"][strKeyValue] = $(this).val();                                    
                }
                else
                {
                    arrLocalStorage[intValueSubmitId][strKeyValue]  = $(this).val();                                    
                }
            }
        });
     $('tr').remove("#tr_edit_view_id"+intValueSubmitId);
    localStorage.removeItem("allData")
    localStorage.setItem("allData",JSON.stringify(arrLocalStorage));
    display(intDataLength);

});

// view button
jQuery(document).on('click','input[id^="view_"]',function()
{    
    var strViewId = jQuery(this).attr('id');
    var strTrViewId = strViewId.replace("view_","tr_id");
    var intValueViewId = parseInt(strTrViewId.replace("tr_id",""));
    $('tr').remove("#tr_edit_view_id"+intValueViewId);
    if(jQuery('#tr_view_id'+intValueViewId).attr('id') != undefined)
    {
        $('tr').remove("#tr_view_id"+intValueViewId);
    }
    else   
    {   
        jQuery('#'+strTrViewId).after(`
             <tr id="tr_view_id${intValueViewId}">
             </tr>
        `)
        $('form#insertDataIntoForm input').each(function(index){ 
            var strKeyValue = $(this).attr("name");
            if(strKeyValue != "submit")
            {
                if(strKeyValue == "communication" || strKeyValue == "permanent")
                {
                    jQuery("#tr_view_id"+intValueViewId).append("<td>"+arrLocalStorage[intValueViewId]["address"][strKeyValue] +"</td>");
                }
                else
                {
                     jQuery("#tr_view_id"+intValueViewId).append("<td>"+arrLocalStorage[intValueViewId][strKeyValue] +"</td>");
                }
            }
        });
    }
});


//search functionality
jQuery(document).on('keyup','#txtSearch',function()
{
    var input, filter, table, tr, td, i;
    input = document.getElementById("txtSearch");
    filter = input.value.toLowerCase();
    table = document.getElementById("tblData");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    // console.log(tr);
    for (i = 0; i < intDataLength; i++) {
      td_1 = $("#tr_id"+i+" td.firstname").html();
      td_2 = $("#tr_id"+i+" td.lastname").html();
      td_3 = $("#tr_id"+i+" td.location").html();
      td_4 = $("#tr_id"+i+" td.phone").html();
      td_5 = $("#tr_id"+i+" td.batch").html();

    // if (td_1 || td_2 || td_3 || td_4) 
      if (td_1 || td_2 || td_3 || td_4 || td_5) {
            // console.log(td_1);
                 var cond_1 = td_1.toLowerCase().indexOf(filter) > -1;
                 var cond_2 = td_2.toLowerCase().indexOf(filter) > -1;
                 var cond_3 = td_3.toLowerCase().indexOf(filter) > -1;
                 var cond_4 = td_4.toLowerCase().indexOf(filter) > -1;
                 var cond_5 = td_5.toLowerCase().indexOf(filter) > -1;
            if (cond_1 || cond_2 || cond_3 || cond_4 || cond_5) {
                    $("#tr_id"+i+" td").show();
                } else {
                    $("#tr_id"+i+" td").hide();
                }
       } 
    }
});


//when click form 
jQuery(document).on('click','#btnSubmit',function()
{
    if($('.err').length > 0 ) {
        $('.err').remove();
    }
    $('form#insertDataIntoForm input').each(function(index){ 
        if( $(this).val() == "")
        {   
            $(this).after('<h4 class="err"> Hey Its empty </h4>'); 
        }
    });
    if($('.err').length == 0)
    {
        var object = {};
        var subObject = {};
        $('form#insertDataIntoForm input').each(function(index){
                if($(this).val() != "submit")
                {
                    if($(this).attr("name") == "communication" || $(this).attr("name") == "permanent")
                    {
                        subObject[$(this).attr("name")] =  $(this).val();
                        object["address"] = subObject;
                    }
                    else
                    {
                        console.log("hi1");
                        object[$(this).attr("name")] = $(this).val();
                    }
                    
                }   
        });
        arrLocalStorage.push(object);
        localStorage.setItem("allData",JSON.stringify(arrLocalStorage));
        console.log(arrLocalStorage);

        $('form#insertDataIntoForm input').each(function(index){
            if($(this).val() != "submit")
                {
                      $(this).val('');
                }
        });
        // intDataLength = 10;
        display(intDataLength);
        
    }
});

// window.onscroll = function() {myFunction()};

$(window).scroll(function() {        
        //onscroll look property
    if(strScrollValue == "onscroll")
    {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            if(intDataLength >= arrLocalStorage.length)
            {
                intDataLength = arrLocalStorage.length;
                flagValue = true;
            }
            else
            {
                intDataLength += 10;
                display(intDataLength);
            }
        }
    }
});
