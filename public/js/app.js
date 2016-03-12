$(function(){
  loadData().always(function(raw_data){
    $("#finder").hideseek();

    console.log(raw_data.responseText);
    var countries = byCountry(rawDataToCountries(raw_data));

    $.each(countries, function(key, value){
      name = value.name
      $("#countries").append("<li class='country' value='" + name + "'>" + name.capitalize() + "</li>");
    });

    $("#countries").on("click", '.country', function(){
      cleanUpModal();
      country_name = $(this).attr("value")
      setDataForCountry(country_name, countries);
      $("#countryModal").modal('show')
    });
  });
});

function loadData(){
  return $.getJSON("data/countries_and_visa_refusal_rate.json");
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

function orderRefusalRates(country){
  data_ordered = country.data
  data_ordered.sort(function(a, b) {
    return parseInt(a.year) > parseInt(b.year);
  });

  country["data"] = data_ordered

  return country
}

function addDataToTable(country){
  $.each(country.data.reverse(), function(key, value){
    rate = String(formatRate(value.refusal_rate)) + "%"
    $("#country-table-data").append("<tr><td>" + value.year + "</td><td>" + rate + "</td></tr>");
  });
}

function formatRate(rate){
  return roundToTwo(rate * 100)
}

function addBarChart(country){
  to_print_data = { years: [], rates: [] }

  $.each(country.data.reverse(), function(key, value) {
    to_print_data['years'].push(value.year)
    to_print_data['rates'].push(formatRate(value.refusal_rate))
  });

  console.log(to_print_data)

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

function rawDataToCountries(raw_data){
  countries = []

  $.each(raw_data, function(two_digits_year, yearly_data){
    year = "20" + two_digits_year;
    $.each(yearly_data, function(key, value){
      countries.push({
        year: year,
        country: value[0].toLowerCase(),
        refusal_rate: parseFloat(value[1]) / 100.0
      })
    });
  });

  return countries;
}

function byCountry(raw_data){
  grouped = groupBy(raw_data, function(item){
    return [item.country];
  });

  with_name = []

  $.each(grouped, function(key, value) {
    with_name.push({ name: value[0].country, data: value })
  });

  return with_name;
}

function groupBy(array, f){
  var groups = {};

  array.forEach( function(o){
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });

  return Object.keys(groups).map(function(group){
    return groups[group];
  })
}

String.prototype.capitalize = function() {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function roundToTwo(num) {
  return +(Math.round(num + "e+4")  + "e-4");
}
