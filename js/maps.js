var currentStats = {
    location: '',
    latitude: '',
    longitude: '',
    heading: '0',
    pitch: '0'
};


var documentWidth;
var documentHeight;
var mapSize;


function getQuery(params) {
    console.log(currentStats);
    var baseUrl = 'https://maps.googleapis.com/maps/api/streetview?';
    if (params.location) {
        baseUrl += 'location=' + params.location + '&';
    }

    currentStats.location = params.location;

    if (params.size) {
        baseUrl += 'size=' + params.size + '&';
    }

    if (params.heading) {
        baseUrl += 'heading=' + params.heading + '&';
    }

    if (params.pitch) {
        baseUrl += 'pitch=' + params.pitch;
    }
    return baseUrl;
};


function init() {
    var params = {
        location: 'Redmond',
        size: mapSize,
        heading: '0'
    };

    var initialQuery = getQuery(params);
    $('.main-image').attr('src', initialQuery);
};

function getCurrentLocationLatLong() {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': currentStats.location }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        currentStats.latitude = results[0].geometry.location.lat();
        currentStats.longitude =  results[0].geometry.location.lng();
      }
    });
};

function turnRight() {
    var params = {
        location: currentStats.location,
        size: mapSize,
        heading: currentStats.heading + 5,
        pitch: currentStats.pitch
    };

    currentStats.heading += 5;
    var initialQuery = getQuery(params);
    imageChange(getQuery(params));
};

function turnLeft() {
    var params = {
        location: currentStats.location,
        size: mapSize,
        heading: currentStats.heading - 5,
        pitch: currentStats.pitch
    };

    currentStats.heading -= 5;
    var initialQuery = getQuery(params);
    imageChange(getQuery(params));
};


function lookUp() {
    var params = {
        location: currentStats.location,
        size: mapSize,
        heading: currentStats.heading,
        pitch: currentStats.pitch + 90
    };

    currentStats.pitch += 90;

    imageChange(getQuery(params));
}

function lookDown() {
    var params = {
        location: currentStats.location,
        size: mapSize,
        heading: currentStats.heading,
        pitch: currentStats.pitch - 90
    };

    currentStats.pitch -= 90;
    imageChange(getQuery(params));
}


function imageChange(url) {
    $(".main-image").attr('src', url);

}
function moveForward() {
    var lat       = Number(currentStats.latitude - 0.0001).toFixed(7);
    var longitude = Number(currentStats.longitude - 0.0001).toFixed(7);
    currentStats.latitude = lat;
    currentStats.longitude = longitude;
    var location  = lat + ',' + longitude;
    var params = {
        location: location,
        size: mapSize,
        heading: currentStats.heading,
        pitch: currentStats.pitch
    };
    imageChange(getQuery(params));
};

function moveBackward() {

};

function initKeyBindings() {
    $('body').keydown( function (e) {
        switch(e.keyCode) {
            case 39:
                turnRight();
                break;
            case 37:
                turnLeft();
                break;
            case 38:
                moveForward();
                break;
            case 40:
                moveBackward();
                break;
            case 34:
                lookDown();
                break;
            case 33:
                lookUp();
                break;
        };
    });
};


function connectWebSocket() {
    var conn = new WebSocket('ws://192.168.0.125:8080');

    // var data = {x:0, y:0};
    // gestureHandler.handleAction('beam', data);
    conn.onopen = function () {
        conn.send("Connection Established Confirmation");
    };

    var events = {};
    conn.onmessage = function (data) {
        data = data.data;
        data = data.split("&");
        var eventName = data[0].split("=")[1];
        var command = data[1].split("=")[1];
        if (events[eventName][command]) {
            events[eventName][command]++;
        } else {
            events[eventName][command] = 1;
        }

        if (events[eventName][command] >= 50) {
            events[eventName][command] = 0;
        }
    };

}

$(document).ready( function () {
    documentWidth = $(document).width();
    documentHeight = $(document).height();
    mapSize = documentWidth + 'x' + documentHeight;

    init();
    initKeyBindings();
    getCurrentLocationLatLong();
    connectWebSocket();
});