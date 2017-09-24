////////////////////////////////////////////////////////
function client_insertinfo(form){
    $('#firstname').val(form.firstname);
    $('#surname').val(form.surname);
    $('#jobref').val(form.jobref);
    $('#clientid').val(form.clientid);
    $('#datein').append('<h2>' + form.datein + '</h2>');
    $('#dateout').append('<h2>' + form.dateout + '</h2>');
    $('#address').val(form.address);
    $('input[name="status"][value="' + form.status + '"]').attr('checked', 'checked');
    $('#postcode').val(form.postcode);
    $('#telephone').val(form.telephone);
    $('#email').val(form.email);
    $('#jobdscrpt').val(form.jobdscrpt);
    $('#workdone').val(form.workdone);
}

////////////////////////////////////////////////////////
function equipment_insertinfo(){
    if(form.equipment == undefined)
        return;

    var equipments = JSON.parse(form.equipment);
    for(i = 0; i < equipments.length; i++){
        equipment_newrow();
        equipment_loadrow(i + 1, equipments[i]);
    }
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


    $('[name="make"]').attr('list', 'suggestions');
    $('[name="make"]').attr('autocomplete', 'off');
};

function equipment_loadrow(row_num, equipment){
    row_num++;

    var table  = $('#equipment-table');
    var numcols = (table.find("tr:first")).find('th').length;
    var row_DOM = $('#equipment-table tr:nth-child(' + row_num + ')');
   

    for(j = 1; j < numcols + 1; j++){
        var cell_DOM = row_DOM.find('td:nth-child(' + j + ')');
        var input_DOM = cell_DOM.find('input');
        var col_name = table.find('tr:first').find('th:nth-child(' + j + ')').text();
        var cell_text = equipment[col_name];
        input_DOM.val(cell_text);
    }
};

// "[{"type":"Total","dscrpt":"Total Cost","cost":0},
// {"type":"Materials","dscrpt":"s","cost":5},
// {"type":"Labour","dscrpt":"2","cost":40}]

//////////////////////////////////////////////////////////////
function costs_insertinfo(form){
    if(form.costs == undefined)
        return;

    var costs = JSON.parse(form.costs);
    for(i = 0; i < costs.length; i++){
        if(costs[i].costtype == 'Total'){
            $('input[name=totalcost]').val(costs[i]['cost']);
        }
        else{
            costs_newrow();
            row_num = i + 1;
            row_DOM = $('#cost-table tr:nth-child(' + row_num + ')');
    
            var cell_type = row_DOM.find('select[name=costtype]');
            cell_type.val(costs[i]['costtype']);
            var cell_dscrpt = row_DOM.find('textarea[name=costdscrpt]');
            cell_dscrpt.val(costs[i]['costdscrpt']);
            var cell_cost = row_DOM.find('input[name=cost]');
            cell_cost.val(costs[i]['cost']);
        }
    }
}

function costs_newrow(){
    var tableRow = $('.cost-row')[0];
    newRow = $(tableRow).clone();
    newRow.find('select[name=costtype]').val('');
    newRow.find('textarea[name=costdscrpt]').val('');
    newRow.find('input[name=cost]').val('');
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