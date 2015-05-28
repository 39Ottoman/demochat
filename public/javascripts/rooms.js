// ページ表示時にチャットルーム一覧を読込
$(function() {
  // var data = {
  //   _id: '2222',
  //   name: '新人歓迎会',
  //   description: 'XX年度○○部の新人歓迎会を行います!',
  //   members: ['hori', 'yamada']
  // };
  // var html = createRoomPanel(data);
  // $('#roomList').prepend(html);
  showRooms();
});

function showRooms() {
  var $roomList = $('#roomList');
  var $message = $('.message');

  // チャットルーム一覧を初期化
  $roomList.children().remove();

  // /roomListにGETでアクセス
  $.get('/roomList', function (roomList) {
    // 取得したチャットルームがあれば表示
    $.each(roomList, function (index, room) {
      var roomPanel = createRoomPanel(room);
      $roomList.prepend(roomPanel);
    });
  });
}

function createRoomPanel(room) {
  var roomPanel =
    '<div class="panel panel-default">' +
      '<div class="panel-heading">' +
      '<a href="/roompage/' + room._id + '">' + room.name + '</a>' +
      '</div>' +
      '<div class="panel-body">' +
        room.description +
      '</div>' +
      '<div class="panel-footer">' +
        '参加人数: ' + room.members.length + '人' +
      '</div>' +
    '</div>';
  return roomPanel;
}
