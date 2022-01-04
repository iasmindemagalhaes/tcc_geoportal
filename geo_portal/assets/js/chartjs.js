$('document').ready(function(){

    $.ajax({
        type:"POST",
        url: "/geo_portal/assets/php/chart.php",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            var nomebairro = [];
            var pop_total = [];
            for(var i=0; i < data.length; i++){
                nomebairro.push(data[i].name);
                pop_total.push(data[i].poptotal);
            }

            grafico(nomebairro, pop_total)
        }
    })
})

function grafico(bairro, populacao){
    
    const labels = nomebairro;
    const data = {
        labels: labels,
        datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: pop_total,
        }]
    };


    const config = {
        type: 'line',
        data,
        options: {}
    };


    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}