
var getJobs = function(){
    $.ajax({
        url: "//localhost:3000/admin/index/getJobs", 
        type: "POST",
        success: function(data){
            var forms = JSON.parse(data);
            var row = forms.map((form) => {
                var job = "<tr> " 
                + "<td>" + form.surname       + "</td>"
                + "<td>" + form.firstname     + "</td>"
                + "<td class = 'row-jobref'>" + form.jobref     + "</td>"
                + "<td>" + form.equipment         + "</td>"
                + "<td>" + form.datein       + "</td>" 
                + "<td>" + form.dateout      + "</td>" 
                + "<td>" + "<button class = 'row-button' type = 'button'> EDIT </button>" + " </td> </tr>";
                return job}
            )
            row.map(job => {$('#job-table').append(job)})
            $('.row-button').click(function(){
                var jobref = ($(this).closest('tr')).find('.row-jobref').text();
                console.log(jobref)
                $('#jobref').val(jobref);
                $('#submit-button').click();
            })
        }
    });
}


var getClients = function(){
    $.ajax({
        url: "//localhost:3000/admin/index/getClients", 
        type: "POST",
        success: function(data){
           obj = JSON.parse(data)
           console.log(obj)
           var row = obj.map((client) => {
            var cl = "<tr> " 
            + "<td>" + client.surname       + "</td>"
            + "<td>" + client.firstname     + "</td>"
            + "<td>" + client.telephone     + "</td>"
            + "<td>" + client.email         + "</td>"
            + "<td>" + client.address       + "</td>" 
            + "<td>" + client.postcode      + "</td>" 
            + "<td>" + "<button class = 'row-button' type = 'button'> JOBS </button>" + " </td> </tr>";
            return cl}
            )
            row.map(client => {$('#client-table').append(client)})
        }
    });
}

function search(searchId) { 
    ($(searchId).find('.search')).on('input', function(){
        var search_index = ($(this).parent('th')).index() + 1;
        var search_value  = $(this).val();
        
        $(".index-table tr").each(function(){
            
            var col_value = $(this).find('td:nth-child(' + search_index + ')').first().text();
            //Ignore header rows 
            if($(this).attr('class') == 'fixed-row')
                $(this).show();
            //Column value doesnt match input search value
            else if(col_value.indexOf(search_value) != 0 && search_value != ''){
                $(this).hide();
            }
            //Column value matches input search value - check rest of row's corresponding search values
            else{
                var shown = true;
                for(var i = 1; i < 4; i++){
                    var search_i = ($(searchId).find('th:nth-child(' + i + ')')).find('.search').val();
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