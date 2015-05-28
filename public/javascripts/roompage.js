// ページ表示時にチャットルームの情報を読込
$(function() {
  init();
});

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
      // チャットルーム説明を表示
      updateDescriptionArea(username, room);
      // 参加者であればアンケート表示エリアとチャット表示エリアを表示
      updateCommunicationArea(username, room.members);
      // 既に投稿されているアンケート一覧を表示
      updateQuestionArea(username, room);
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

// 参加者表示エリアを切り替える
function updateMembersArea(username, members) {
  var $membersArea = $('#membersArea');
  var $memberCount = $('#memberCount');
  // チャットルーム一覧を初期化
  $membersArea.children().remove();
  $memberCount.children().remove();
  // 参加者であれば参加者表示エリアに名前を表示
  if(isMember(username, members)) {
    $memberCount.append('<p style="font-size: 30px;">' + members.length + '人</p>');
    $membersArea.append('<span style="margin-right: 10px;">参加者:</span>');
    $.each(members, function (index, memberName) {
      var memberSpan = createMemberSpan(memberName);
      $membersArea.append(memberSpan);
    });
  }
}

// チャットルーム説明を更新する
function updateDescriptionArea(username, room) {
  var $descriptionArea = $('#descriptionArea');
  $descriptionArea.children().remove();
  $descriptionArea.append('<p>' + room.description + '</p>');
}

// アンケート表示エリアとチャット表示エリアを切り替える
function updateCommunicationArea(username, members) {
  var $communicationArea = $('#communicationArea');
  if (isMember(username, members)) {
    $communicationArea.css('display', 'inline');
  } else {
    $communicationArea.css('display', 'none');
  }
}

// アンケート表示エリアを更新する
function updateQuestionArea(username, room) {
  var $questionList = $('#questionList');
  $questionList.children().remove();
  if (isMember(username, room.members)) {
    for (var i = 0; i < room.questions.length; i++) {
      var question = room.questions[i];
      $questionList.prepend(createQuestionPanel(question));
    }
  }
}

// チャット参加者表示部分を生成する
function createMemberSpan(username) {
  return '<span style="margin-right: 10px;">' + username + '</span>';
}

// アンケートパネルを生成する
function createQuestionPanel(question) {
  console.log(question);
  var timeString = new Date(question.time).toLocaleString();
  var itemString = '';
  for(var i = 0; i < question.items.length; i++) {
    var item = question.items[i];
    itemString +=
      '<div class="row">' +
        '<div class="col-xs-10">' +
          '<input type="radio" name="' + question._id + '" value="' + question.items[i] + '">' +
          '<label for="' + question._id + '" style="mergin-right: 10px;">' + item.text + '</label>' +
        '</div>' +
        '<div class="col-xs-2">' +
          '<p class="replyCount">' + item.selected.length + '</p>' +
        '</div>' +
      '</div>'
  }
  var questionPanel =
    '<div class="panel panel-default">' +
      '<div class="panel-heading">' +
        '<div class="qId" style="display: none;">' + question._id + '</div>' +
        '<div class="qParam">(' + timeString + ")  " + question.username + '</div>' +
        '<div class="qTitle">' + question.title + '</div>' +
      '</div>' +
      '<div class="panel-body">' +
        itemString +
        '<button class="replyButton btn btn-info" disabled="disabled">回答</button>' +
      '</div>'+
    '</div>';
  return questionPanel;
}

// チャット参加者かどうかを判定する
function isMember(username, members) {
  return $.inArray(username, members) != -1;
}
