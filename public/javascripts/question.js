var socket = io();
var $createQuestionButton = $('#createQuestionButton');

$createQuestionButton.click(function() {
  var data;
  var username = $('*[name="username"]')[0].value;
  var title = $('*[name="title"]')[0].value;
  var items = $('*[name="items"]');
  var itemArray = [];
  for(var i = 0; i < items.length; i++) {
    itemArray.push(items[i].value);
  }
  data =
  {
    roomId: $('#roomId').text(),
    data: {
      username: username,
      title: title,
      items: itemArray
    }
  };
  console.log(data);
  socket.json.emit('question', data);
});
