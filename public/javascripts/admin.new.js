

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
};

function costs_newrow(){

    var table = $('#cost-table');
    var numcols = (table.find("tr:first")).find('th').length;

    var tablerow = '<tr>' +
                    '<td> <select name = "costtype" class = "drop-down">' +
                    '    <option value=""></option> ' +
                    '    <option value="Labour">Labour</option> ' +
                    '    <option value="Materials">Materials</option> ' +
                    '    <option value="Other">Other</option> </select> </th>' +
                    ' <td>  <textarea class = "cost-dscrpt" rows = "2" type = "text" name = "costdscrpt"></textarea></td> ' +
                    ' <td>  <input type = "number" name = "cost" class = "cost-input" min="0" step="0.01" data-number-to-fixed="2" data-number-stepfactor="100" style/> </td> ' +
                    '</tr>';
    $(tablerow).insertBefore('#cost-table-total');
}

function installations_newrow(){
    var table = $('.installation-table');

    var tablerow = 
        '<tr>' +
            '<td> <select name = "installation" class = "drop-down">' +
                    '<option value="" ></option>' +
                    '<option value="Hardware">Hardware</option>' +
                    '<option value="Software">Software</option>' +
                    '<option value="Other">Other</option>' +
                '</select> </td>' +
            '<td> <textarea class = "job-input" rows = "2" type = "text" name = "installationdscrpt"></textarea></td>' +
        '</tr>';
    $(tablerow).insertBefore('#installation-button-row');
    
}

/////////////////////////////////////////////////////////////////
function newrow(button){
    var id = $(button).attr('id');
    if(id == 'installation-button'){
        installations_newrow();
    }
    else if(id == 'equipment-button'){
        equipment_newrow();
    }
    else if(id == 'cost-button'){
        costs_newrow();
    }
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