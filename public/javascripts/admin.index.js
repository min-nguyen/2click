
var getPost = function(){
    $.ajax({
        url: "//localhost:3000/admin/index/getPost", 
        type: "POST",
        success: function(data){
            var forms = JSON.parse(data);
            for(i = 0; i < forms.length; i++){
                insertRow(forms[i]);
            }
        }
    });
}
var insertRow = function(form){
    row = "<tr> " + "<td>" + form.surname    + "</td>"
                    + "<td>" + form.firstname  + "</td>"
                    + "<td class = 'row-jobref'>" + form.jobref     + "</td>"
                    + "<td>" + form.equipment + "</td>"
                    + "<td>" + form.datein     + "</td>"
                    + "<td>" + form.dateout    + "</td>" 
                    + "<td>" + "<button class = 'row-button' type = 'button'> EDIT </button>" + " </td> </tr>";
    $('#index-table').append(row); 
    $('.row-button').click(function(){
        var jobref = ($(this).closest('tr')).find('.row-jobref').text();
        $('#jobref').val(jobref);
        $('#submit-button').click();
    })
}

function search() { 
    $('.search').on('input', function(){
        var search_index = ($(this).parent('th')).index() + 1;
        var search_value  = $(this).val();
        
        $("#index-table tr").each(function(){
            var col_value = $(this).find('td:nth-child(' + search_index + ')').first().text();
            //Ignore header rows 
            if($(this).attr('class') == 'fixed-row')
                $(this).show();
            //Column value doesnt match input search value
            else if(col_value.indexOf(search_value) != 0 && search_value != ''){
                $(this).hide();
                console.log("Search is : '" + search_value + " Hiding " + col_value + " immediately due to result " + search_value.indexOf(col_value));

            }
            //Column value matches input search value - check rest of row's corresponding search values
            else{
                var shown = true;
                for(var i = 1; i < 4; i++){
                    var search_i = ($('#search-row').find('th:nth-child(' + i + ')')).find('.search').val();
                    var col_i    = $(this).find('td:nth-child('+i+')').first().text();
                    if(col_i.indexOf(search_i) != 0 && search_i != ''){
                        shown = false;
                        return;
                    }
                }
                if(shown)
                    $(this).show();
                else
                    $(this).hide();
            }
        })
    })
}