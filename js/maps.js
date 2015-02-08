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
        baseUrl += 'pitch=' + params.pitch + '&';
    }

    baseUrl +='key=AIzaSyACmklUUFJAOFAWQrDBEd_eMqroq859rxE'

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

function initTweets(city) {
    $.ajax({
        url: 'http://jeopardy.sdslabs.local/twitter',
        data: {city: city},
        dataType: 'jsonp',
        success: function (data) {
            $('.tweets').text('Tweets from #' + city);
            var html = '';
            for (var i = 0; i < data.statuses.length; i++) {
                var name = data.statuses[i].name;
                var text = data.statuses[i].text;
                html += '<div class="tweet><span>' + name + '</span><span class="tweet-content">' + text + '</div>';
            }
            $('.swag').html(html);
        }
    });
}
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
        if (events[eventName]) {
            if (events[eventName][command]) {
                events[eventName][command]++;
            } else {
                events[eventName][command] = 1;
            }
            console.log(events[eventName][command], command);
        } else {
            events[eventName] = {};
            events[eventName][command] = 1;
        }

        if (events[eventName][command] >= 50) {
            events[eventName][command] = 1;
            handleCommand(eventName, command);
        }
    };

};

function handleCommand(eventName, command) {
    switch (eventName) {
        case 'speech':
            handleSpeech(command);
            break;
        case 'turn':
            handleTurn(command);
            break;
        case 'backward':
            handleBackward(command);
            break;
        case 'forward':
            handleForward(command);
            break;
    };
}


function handleSpeech(command) {
    switch(command) {
        case 'fly to new york':
            switchToPlace('New York');
            break;
        case 'fly to london':
            switchToPlace('London');
            break;
        case 'fly to new delhi':
            switchToPlace('New Delhi');
            break;
        case 'third person':
            switchToThirdPerson();
            break;
        case 'first person':
            switchToFirstPerson();
            break;
    }
}


function handleTurn(command) {
    switch(command) {
        case 'left':
            console.log('left');
            turnLeft();
            break;
        case 'right':
            console.log('right');
            turnRight();
            break;
       case 'up':
            lookUp();
            break;
        case 'down':
            lookDown();
            break;
    };
}

function switchToPlace(place) {
    var params = {
        location: place,
        size: mapSize,
        heading: '0'
    };
    initTweets(place);
    currentStats.location = place;
    imageChange(getQuery(params));

};

$(document).ready( function () {
    documentWidth = $(document).width();
    documentHeight = $(document).height();
    mapSize = documentWidth + 'x' + documentHeight;

    init();
    initKeyBindings();
    initTweets('Redmond')
    getCurrentLocationLatLong();
    connectWebSocket();
});