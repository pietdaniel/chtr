var MY_MAP;
var lg = console.log.bind( console );

function scrollToBottom() {
  var mainDiv = $('#main');
  mainDiv.scrollTop(mainDiv.prop('scrollHeight'));
}

function main() {
    var ws = new getWebSocket(function(){
      doGeoLocationJazz(function(position) {

        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        MY_MAP.setCenter(pos);
        MY_MAP.myPosition(pos.k,pos.A);
        // MY_MAP.addPosition(45,-70)
        ws.send(buildLocation(pos.toString()));
        MY_MAP.getBounds();
      });

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

      function buildLocation(loc) {
        out = { UID: ws.UID, LOC: loc }
        return JSON.stringify(out)
      }

    });
}

$(document).ready(function(){
    $.getScript( "ws.js", function() {
      $.getScript( "geo.js", function() {
        main();
      })
    });
});
