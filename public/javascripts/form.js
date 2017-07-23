function equipment_input(){
    var table = $('#equipment-table');

    var numrows = table.find('tr').length;
    var numcols = (table.find("tr:first")).find('th').length;
   
    for(i = 2; i < numrows + 1; i++){
         for(j = 1; j < numcols + 1; j++){

            var cell_dom  = table.find('tr:nth-child(' + i + ')').find('td:nth-child(' + j + ')');
            var col_name  = table.find('tr:first').find('th:nth-child(' + j + ')').text();
            
            
            var cell_input =    '<input class = "table-input" type = "text" name = "' 
                                + col_name + '">';

            console.log(cell_dom);                   
            cell_dom.append(cell_input);

         }
    }
};

function eq1(){

}

