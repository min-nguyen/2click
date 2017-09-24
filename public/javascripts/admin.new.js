
function client_insertinfo(form){
    $('#firstname').val(form.firstname);
    $('#surname').val(form.surname);
    $('#jobref').val(form.jobref);
    $('#clientid').val(form.clientid);
    $('#address').val(form.address);
    $('#postcode').val(form.postcode);
    $('#telephone').val(form.telephone);
    $('#email').val(form.email);
    console.log(form);
    console.log($('#clientid').val());
}


function equipment_newrow(){
    var table = $('#equipment-table');
    var numcols = (table.find("tr:first")).find('th').length;
    var table  = $('#equipment-table');
    var tablerow = '<tr>';
    for(j = 1; j < numcols + 1; j++){
        var col_name  = table.find('tr:first').find('th:nth-child(' + j + ')').text();
        
        var cell_input =    '<td> <input class = "table-input" type = "text" name = "' 
                            + col_name + '"> </td>';
        tablerow += cell_input;      
    }
    tablerow += '</tr>';
    $(tablerow).insertBefore('#equipment-button-row');
    $('[name="make"]').attr('list', 'make-suggestions');
    $('[name="make"]').attr('autocomplete', 'off');
};

function costs_newrow(){
    var tableRow = $('.cost-row')[0];
    newRow = $(tableRow).clone();
    $(newRow).insertBefore('#cost-table-total');
}


/////////////////////////////////////////////////////////////////
function newrow(button){
    var id = $(button).attr('id');
    if(id == 'equipment-button'){
        equipment_newrow();
    }
    else if(id == 'cost-button'){
        costs_newrow();
    }
}


function loadSuggestions(){
    var jobref = $('#jobref').val();
    $.ajax({
        url: "//localhost:3000/admin/loadSuggestions", 
        type: "POST",
        success: function(data){
            console.log(data)
            var suggestions = JSON.parse(data);

            // Load make suggestions
            var makeSuggestions = suggestions.make;
            var datalist = "<datalist id='make-suggestions'>";
            for(i = 0; i < makeSuggestions.length; i++){
                datalist += "<option value = '" + makeSuggestions[i] + "'>"
            }
            datalist += "</datalist>";
            $('#equipment-table').append(datalist);
            var equipmentElements = $('[name="make"]');
            $(equipmentElements).attr('list', 'make-suggestions');
            $(equipmentElements).attr('autocomplete', 'off');
            // Load equipment suggestions
            var equipmentSuggestions = suggestions.equipment;
            var datalist = "<datalist id='equipment-suggestions'>";
            for(i = 0; i < equipmentSuggestions.length; i++){
                datalist += "<option value = '" + equipmentSuggestions[i] + "'>"
            }
            datalist += "</datalist>";
            $('#equipment-table').append(datalist);
            var equipmentElements = $('[name="equipment"]');
            $(equipmentElements).attr('list', 'equipment-suggestions');
            $(equipmentElements).attr('autocomplete', 'off');
        },
        error: function(xhr, ajaxOptions, thrownError){
            console.log(xhr.status);
            console.log(xhr.responseText);
            alert("Error " + xhr.status + " : " + xhr.responseText);
        }
    });
}


function checkValidJobRef(){
    var jobref = $('#jobref').val();
    $.ajax({
        url: "//localhost:3000/admin/new/checkValidJobRef", 
        data: {jobref : jobref}, 
        type: "POST",
        success: function(data){
            console.log(data)
            $('#form').submit();
        },
        error: function(xhr, ajaxOptions, thrownError){
            console.log(xhr.status);
            console.log(xhr.responseText);
            alert("Error " + xhr.status + " : " + xhr.responseText);
        }
    });
}