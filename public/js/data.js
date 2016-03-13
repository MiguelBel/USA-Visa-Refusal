function loadData(){
  return $.getJSON("data/countries_and_visa_refusal_rate.json");
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

function orderRefusalRates(country){
  data_ordered = country.data
  data_ordered.sort(function(a, b) {
    return parseInt(a.year) > parseInt(b.year);
  });

  country["data"] = data_ordered

  return country
}
