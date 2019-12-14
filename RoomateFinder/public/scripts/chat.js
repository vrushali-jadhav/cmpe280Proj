$(function(){
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');
    var $userForm = $('#userForm');
    var $userFormArea = $('#userFormArea');
    var $messageArea = $('#messageArea');
    var $users = $('#users');
    var $userName = $('#username');
    $messageForm.submit(function(e){
        e.preventDefault();
        socket.emit('send message', $message.val());
        $message.val('');
    });
    $userForm.submit(function(e){
        e.preventDefault();
        socket.emit('new user', $userName.val(), function(data){
            if(data)
            {
                $userFormArea.hide();
                $messageArea.show();
            }
        });
        $userName.val('');
    });
    socket.on('new message', function(data){
        $chat.append('<div class="well">'+data.msg+'</div>');
    });
    socket.on('get users', function(data)
    {
        var html = '';
        for(i=0; i<data.length;i++)
        {
            html += '<li class="list-group-item">'+data[i]+'</li>';
        }
        $users.html(html);
    });
});
