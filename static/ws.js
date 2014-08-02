function getWebSocket(onopen) {
    connection = new WebSocket("ws://piet.us/chtr");
    // connection.setMaxIdleTime(1000 * 60 * 60)

    connection.onopen = function () {
      connection.send('{"OPEN":1}')
      console.log("onopen");
      setInterval(connection.send('{"PING":0'), 3000);
      onopen();
    };

    connection.onerror = function (error) {
      console.log('WebSocket Error ' + error);
    };

    connection.onclose = function (close) {
      console.log("WebSocket Close " + close);
    }

    connection.onmessage = function (e) {
      console.log('Server: ' + e.data);
      blob = $.parseJSON(e.data)
      if (blob.OPEN){
        this.UID = blob.UID
      }
      if (blob.MSG && blob.UID !== this.UID) {
        $("#chat-box").find('tbody').append($('<tr>').text(blob.MSG)); 
      }

      if (blob.LOCS) {
        var locSet = {};
        var arr = eval(blob.LOCS);

        for (var loc in arr) {
          var re = /(\-?[0-9]*\.\-?[0-9]*)/g
          var locArray = arr[loc].match(re);
          locSet[arr[loc]]=locArray.map(parseFloat)
        }

        for (k in locSet) {
          for (var q in MY_MAP.locationArray) {
            var keyPair = "("+MY_MAP.locationArray[q].k+", "+MY_MAP.locationArray[q].A+")";
            delete locSet[keyPair]
          }
        }

        for (k in locSet) {
          MY_MAP.addPosition(locSet[k][0],locSet[k][1])
          MY_MAP.getBounds()
        }

      }
    };




    return connection;
}
