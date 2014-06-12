function lg(str) {console.log(str);}

// ********* WEBSOCKET *************//

function getWebSocket() {
    connection = new WebSocket("ws://localhost:9000/chtr");
    connection.onopen = function () {
      connection.send('{"OPEN":1}')
      console.log("onopen");
    };

    connection.onerror = function (error) {
      console.log('WebSocket Error ' + error);
    };

    connection.onmessage = function (e) {
      console.log('Server: ' + e.data);
      blob = $.parseJSON(e.data)
      if (blob.OPEN){
        this.UID = blob.UID  
      }
      if (blob.MSG && blob.UID !== this.UID) {
        $("#chat-box").find('tbody').append($('<tr>').text(blob.MSG)); 
      }
       
    };

    return connection;
}

// ********* GEOLOCATION *************//

function getMapFeatureOpts() {
  return [
      {
        stylers: [
          { hue: '#0000ff' },
          { visibility: 'simplified' },
          { gamma: 0.5 },
          { weight: 0.5 }
        ]
      },
      {
        elementType: 'labels',
        stylers: [
          { visibility: 'off' }
        ]
      },
      {
        featureType: 'water',
        stylers: [
          { color: '#000089' }
        ]
      }
    ];
}

var myposition;

var mapObject = function() {
  this.map;
  this.position;
  this.initialize = function() {
    this.featureOpts = getMapFeatureOpts();
    this.styledMapOptions = { name: 'Custom Style' };
    this.customMapType = new google.maps.StyledMapType(this.featureOpts, this.styledMapOptions);
    this.MY_MAPTYPE_ID = 'custom_style';

    this.mapOptions = this.getMapOptions();
    this.map = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);
    this.map.mapTypes.set(this.MY_MAPTYPE_ID, this.customMapType);
    this.position = this.getGeolocation(this.map);
  }

  this.getMapOptions = function() {
    return {
      zoom: 4,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, this.MY_MAPTYPE_ID]
      },
      disableDefaultUI: true,
      mapTypeId: this.MY_MAPTYPE_ID
    };
  }

  this.getGeolocation = function(map) {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(pos);
        var LatLngList = new Array();
        LatLngList[0] = pos;
        new google.maps.Marker({
          position: pos,
          map: map,
          icon: 'https://cdn4.iconfinder.com/data/icons/miu/22/map_location_pin_map-marker-48.png'
        });

        pos = new google.maps.LatLng(45,-70);
        LatLngList[1] = pos;
        new google.maps.Marker({
          position: pos,
          map: map,
          icon: 'http://c.tadst.com/gfx/n/icon/icon-map-pin.png'
        });

        // pos = new google.maps.LatLng(41.90, -87.65 );
        // LatLngList[2] = pos;
        // new google.maps.Marker({
        //   position: pos,
        //   map: map,
        //   icon: 'http://c.tadst.com/gfx/n/icon/icon-map-pin.png'
        // });

        // pos = new google.maps.LatLng(37.75, -122.68);
        // LatLngList[3] = pos;
        // new google.maps.Marker({
        //   position: pos,
        //   map: map,
        //   icon: 'http://c.tadst.com/gfx/n/icon/icon-map-pin.png'
        // });

        var bounds = new google.maps.LatLngBounds ();
        for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
          bounds.extend (LatLngList[i]);
        }
        map.fitBounds(bounds);

        myposition = position;
      }, function() {
        lg('error with google maps');
      });
    } else {
      lg('error with google maps, unsupported');
    }
  }
}


// ********* MAIN *************//

function scrollToBottom() {
  var mainDiv = $('#main');
  mainDiv.scrollTop(mainDiv.prop('scrollHeight'));
}

function main() {
    ws = new getWebSocket();
    map = new mapObject();
    map.initialize();

    $("#chat-input").focus(); 

    window.onresize = function(event) {
      var h1 = document.getElementById('wrap').clientHeight;
      var h2 = document.getElementById('footer').clientHeight + 30;
      $('#main').css('max-height',h1-h2);
      scrollToBottom();
    }

    window.onresize()

    $("#welcome").fadeIn(4000);

    $("#chat-form").submit(function() {
      return false;
    })

    $("#chat-input").bind('keyup', function(e){ 
      if(e.keyCode == 13){ 
        e.preventDefault();
        onSubmit($("#chat-input").val())
      }
    });

    function onSubmit(str) {
      if (ws.UID) {
        var $message = $('<tr>').text(str).hide();
        $("#chat-box").find('tbody').append($message);
        $message.show('slow');
        $("#chat-input").val('');
        msg = buildMessage(str)
        ws.send(msg);
      }
      scrollToBottom();
    }

    function buildMessage(str) {
      out = { UID: ws.UID, MSG: str }
      return JSON.stringify(out)
    }
}

$(document).ready(function(){
    main();
    // mapfoo().initialize();
});
