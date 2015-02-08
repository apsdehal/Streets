var currentStats = {
    location: '',
    latitude: '',
    longitude: '',
    heading: '0',
    pitch: '0'
};

var ip = '127.0.0.1';
var documentWidth;
var documentHeight;
var mapSize;


function getQuery(params) {
    // console.log(currentStats);
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
    currentStats.heading %= 360;
    var initialQuery = getQuery(params);
    imageChange(getQuery(params));
};

function initTweets(city) {
    if (city == 'Redmond')
    {
        url = 'hardcode/seattle.json';
    }
    else if (city == 'Paris')
    {
        url = 'hardcode/paris.json';
    }
    else
    {
        url = 'hardcode/miami.json';
    }
    $.ajax({
        url: url,
        dataType: 'json',
        success: function (data) {
            $('.tweets').text('Tweets from #' + city);
            var html = '';
            for (var i = 0; i < data.statuses.length; i++) {
                var name = data.statuses[i].user.name;
                var text = data.statuses[i].text;
                html += '<div class="tweet"><span>' + name + '</span><span class="tweet-content">' + text + '</div>';
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
    currentStats.heading %= 360;
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
    var lat       = Number(currentStats.latitude + 0.0001).toFixed(7);
    var longitude = Number(currentStats.longitude + 0.0001).toFixed(7);
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
var sCanvas, sContext;
function initCanvas() {
    sCanvas = document.createElement('canvas');
    sContext = sCanvas.getContext('2d');
    sCanvas.width = 500 ;
    sCanvas.height = 500;
    document.getElementsByTagName('body')[0].appendChild(sCanvas);
}
function renderCanvas(data) {
    var head = {}, rs = {}, ls = {}, rh = {}, re = {}, lh = {}, le = {}, lf = {}, rf = {}, cs = {}, lk = {}, rk ={}, hc ={};
    head.x = data.head[0];
    head.y = data.head[1];
    rs.y = data.rs[1];
    rs.x = data.rs[0];
    ls.y = data.ls[1];
    ls.x = data.ls[0];
    rh.y = data.rh[1];
    rh.x = data.rh[0];
    re.y = data.re[1];
    re.x = data.re[0];
    lh.y = data.lh[1];
    lh.x = data.lh[0];
    le.y = data.le[1];
    le.x = data.le[0];
    lf.x = data.lf[0];
    lf.y = data.lf[1];
    rf.x = data.rf[0];
    rf.y = data.rf[1];
    cs.x = data.cs[0];
    cs.y = data.cs[1];
    hc.x = data.hc[0];
    hc.y = data.hc[1];
    lk.x = data.lk[0];
    lk.y = data.lk[1];
    rk.x = data.rk[0];
    rk.y = data.rk[1];

   drawLine(head, cs);
   drawLine(cs, rs);
   drawLine(cs, ls);
   drawLine(ls, le);
   drawLine(rs, re);
   drawLine(re, rh);
   drawLine(le, lh);
   drawLine(cs, hc);
   drawLine(hc, lk);
   drawLine(hc, rk);
   drawLine(rk, rf);
   drawLine(hc, lk);
   drawLine(lk, lf);

}

function drawLine(obj1, obj2) {
    sContext.beginPath();
    sContext.moveTo(obj1.x1, obj1.y1);
    sContext.lineTo(obj2.x2, obj2.y2);
    sContext.strokeStyle = 'green';
    sContext.stroke();
};

var swag = 1;
function connectWebSocket() {
    var conn = new WebSocket('ws://' + ip + ':8080');

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
        if (eventName == 'canvas') {
            if (swag) {
                command = JSON.parse(command);
                renderCanvas(command);
                swag = 0;
                window.setTimeout(function () {
                    swag = 1;
                }, 1000)
            }
            return
        }
        if (eventName == 'speech') {
            handleCommand(eventName, command);
        }
        if (eventName == 'forward' || eventName == 'backward') {
            if (events[eventName]) {
                events[eventName]++;
            } else {
                events[eventName] = 1;
            }

            if (events[eventName] > 20) {
                handleCommand(eventName, command);
                events[eventName] = 1;
            }
            return;
        }
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

        if (events[eventName][command] >= 20) {
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

function handleBackward(command) {
    moveBackward();
}

function handleForward() {
    moveForward();
}


function handleSpeech(command) {
    switch(command) {
        case 'fly to new york':
            switchToPlace('New York');
            break;
        case 'fly to miami':
            switchToPlace('Miami');
            break;
        case 'fly to new delhi':
            switchToPlace('New Delhi');
            break;
        case 'fly to paris':
            switchToPlace('Paris');
            break;
        case 'third person':
            switchToThirdPerson();
            break;
        case 'first person':
            switchToFirstPerson();
            break;
        case 'search for rome':
            displaysearch();
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
    removesearch();
    currentStats.location = place;
    getCurrentLocationLatLong();
    imageChange(getQuery(params));

};

$(document).ready( function () {
    documentWidth = $(document).width();
    documentHeight = $(document).height();
    mapSize = documentWidth + 'x' + documentHeight;

    init();
    initKeyBindings();
    initTweets('Redmond');
    initCanvas();
    getCurrentLocationLatLong();
    connectWebSocket();
});
