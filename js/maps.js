var currentStats = {
    location: '',
    latitude: '',
    longitude: '',
    heading: '0'
};

function getQuery(params) {
    var baseUrl = 'https://maps.googleapis.com/maps/api/streetview?';
    if (params.location) {
        baseUrl += 'location=' + params.location + '&';
    }

    currentStats.location = params.location;

    if (params.size) {
        baseUrl += 'size=' + params.size + '&';
    }

    if (params.heading) {
        baseUrl += 'heading=' + params.heading;
    }
    return baseUrl;
};


function init() {
    var documentWidth = $(document).width();
    var documentHeight = $(document).height();
    var size = documentWidth + 'x' + documentHeight;
    var params = {
        location: 'Redmond',
        size: size,
        heading: '0'
    };

    var initialQuery = getQuery(params);
    $('.main-image').attr('src', initialQuery);
};

function getCurrentLocationLatLong() {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': currentStats.location }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        currentStats.latitude = results[0].geometry.location.latitude
        currentStats.longitude =  results[0].geometry.location.longitude
      }
    });
};


$(document).ready( function () {
    init();
});