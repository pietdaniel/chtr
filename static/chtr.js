function lg(str) {console.log(str);}
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

function getLocation() {
  lg("location")
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
   console.log("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {
  console.log(position);
}

function main() {
    ws = new getWebSocket();
    getLocation();

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
    }

    function buildMessage(str) {
        out = {
            UID: ws.UID,
            MSG: str
        }
        return JSON.stringify(out)
    }
}

$(document).ready(function(){
    main()
});



