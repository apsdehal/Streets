function getQuery(params) {
    var baseUrl = 'https://maps.googleapis.com/maps/api/streetview?';
    if (params.location) {
        baseUrl += 'location=' + params.location + '&';
    }

    if (params.size) {
        baseUrl += 'size=' + params.size;
    }

    return baseUrl;
}


function init() {
    var params = {
        location: 'Redmond',
        size: '500x500'
    }
    var initialQuery = getQuery(params);
    $('.main-image').attr('src', initialQuery);
}

$(document).ready( function () {
    init();
});