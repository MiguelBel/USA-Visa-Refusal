$(function(){
  loadData().always(function(raw_data){
    $("#finder").hideseek();

    var countries = byCountry(rawDataToCountries(raw_data));

    showCountriesInForm(countries);
    countrySelection(countries);
  });
});

function showCountriesInForm(countries){
  $.each(countries, function(key, value){
    name = value.name
    $("#countries").append("<li class='country' value='" + name + "'>" + name.capitalize() + "</li>");
  });
}

function countrySelection(countries){
  $("#countries").on("click", '.country', function(){
    country_name = $(this).attr("value")
    showCountryModal(country_name, countries);
  });
}

function showCountryModal(name, countries){
  cleanUpModal();
  setDataForCountry(country_name, countries);
  $("#countryModal").modal('show');
}

function cleanUpModal(){
  $("#modal-title").text('');
  $("#country-table-data").text('');
}

function setDataForCountry(name, countries){
  country = getDataForCountry(name, countries);
  $("#modal-title").text(name.capitalize());
  addDataToTable(country);
  addBarChart(country);
}

function getDataForCountry(name, countries){
  for(i = 0; i < countries.length; i++){
    if(countries[i].name == name){
      return orderRefusalRates(countries[i])
    }
  }
}

function addDataToTable(country){
  $.each(country.data.reverse(), function(key, value){
    rate = String(formatRate(value.refusal_rate)) + "%"
    $("#country-table-data").append("<tr><td>" + value.year + "</td><td>" + rate + "</td></tr>");
  });
}

function addBarChart(country){
  to_print_data = { years: [], rates: [] }

  $.each(country.data.reverse(), function(key, value) {
    to_print_data['years'].push(value.year)
    to_print_data['rates'].push(formatRate(value.refusal_rate))
  });

  $('#chart').highcharts({
    chart: {
        type: 'line'
    },
    title: {
        text: 'Evolution'
    },
    xAxis: {
      title: {
        text: 'Years'
      },
      categories: to_print_data['years']
    },
    yAxis: {
        title: {
          text: 'Rate (%)'
        }
    },
    series: [{
      name: country.name.capitalize(),
      data: to_print_data['rates']
    }]
  });
}
