

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
    var tableRow = $('.cost-row')[0];
    newRow = $(tableRow).clone();
    $(newRow).insertBefore('#cost-table-total');
}

function installations_newrow(){
    var tableRow = $('.installation-row')[0];
    newRow = $(tableRow).clone();
    $(newRow).insertBefore('#installation-button-row');
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