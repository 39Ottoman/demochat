// ページ表示時にチャットルームの情報を読込
window.onload = init();

// チャットルーム内部画面を初期化
function init() {
  console.log('init');
  var username = $('#username>a').text();
  var roomId = $('#roomId').text();
  console.log(username, roomId);



  // /room/:roomIdにGETでアクセス
  $.get('/room/' + roomId, function (room) {
    // チャットルームがあれば、内容に従ってページを更新
    if(room) {
      console.log(room);
      // 参加者であれば参加ボタン・設定ボタンを更新
      updateToolBar(username, room.members);
      // 参加者であれば参加者表示エリアを表示
      updateMembersArea(username, room.members);

    }
  });
}

// 参加ボタン・設定ボタンの表示を切り替え
function updateToolBar(username, members) {
  console.log('updateToolBar');
  // 参加者であれば不参加ボタンと設定ボタンを表示
  var $enterButton = $('#enterButton');
  var $settingButton = $('#settingButton');
  if(isMember(username, members)) {
    $enterButton.text('不参加');
    $enterButton.removeClass('btn-success');
    $enterButton.addClass('btn-danger');
    $enterButton.on('click', function() {
      exitRoom();
    });
    $settingButton.css('display', 'inline');
  } else {
    // 参加者でなければ参加ボタンのみを表示
    $enterButton.text('参加');
    $enterButton.removeClass('btn-danger');
    $enterButton.addClass('btn-success');
    $enterButton.on('click', function() {
      enterRoom();
    });
    $settingButton.css('display', 'none');
  }
}

// チャットに参加する
function enterRoom() {
  var username = $('#username>a').text();
  var roomId = $('#roomId').text();
  // /room/:roomId/enterにPUTでアクセス
  $.ajax({
    type: 'PUT',
    url: '/room/' + roomId + '/entry',
    data: 'username=' + username,
    success: function (res) {
      console.log('/room/:roomId/enter PUT ' + res);
      if (res) {
        // 成功したらチャットルーム内部画面の初期化を行う
        init();
      }
    }
  });
}

// チャットをやめる
function exitRoom() {
  var username = $('#username>a').text();
  var roomId = $('#roomId').text();
  // /room/:roomId/exitにPUTでアクセス
  $.ajax({
    type: 'PUT',
    url: '/room/' + roomId + '/exit',
    data: 'username=' + username,
    success: function (res) {
      console.log('/room/:roomId/exit PUT ' + res);
      if (res) {
        // 成功したらチャットルーム内部画面の初期化を行う
        init();
      }
    }
  });
}

// 参加者表示エリアを表示する
function updateMembersArea(username, members) {
  var $membersArea = $('#membersArea');
  // チャットルーム一覧を初期化
  $membersArea.children().remove();
  // 参加者であれば参加者表示エリアに名前を表示
  if(isMember(username, members)) {
    $.each(members, function (index, memberName) {
      var memberSpan = createMemberSpan(memberName);
      $membersArea.append(memberSpan);
    });
  }
}

// チャット参加者表示部分を生成する
function createMemberSpan(username) {
  return '<span style="margin-right: 10px;">' + username + '</span>';
}

// チャット参加者かどうかを判定する
function isMember(username, members) {
  return $.inArray(username, members) != -1;
}
