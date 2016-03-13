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

function formatRate(rate){
  return roundToTwo(rate * 100)
}

