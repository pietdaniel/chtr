function getWebSocket(onopen) {
    connection = new WebSocket("ws://localhost:9000/chtr");

    connection.onopen = function () {
      connection.send('{"OPEN":1}')
      console.log("onopen");
      onopen();
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