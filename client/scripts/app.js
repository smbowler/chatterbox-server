// YOUR CODE HERE:

//App object
var app = {};


//App init
app.init = function(value)   {
  return true;
};

app.username = 'Hercules';
app.roomname = 'Lobby';

//Array objectIDs
var objectIDs = [];


//App send method
app.send = function(message){
  //should submit post request
  //Variable to hold ObjectID value;
  $.ajax({
      url: 'http://127.0.0.1:3000/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent. Data: ', data);
        console.log(message);
        userMessage(message);
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message. Error: ', data);
    }  
  });
};


//App fetch method
app.fetch = function(selection) {
 $.ajax({
    url: 'http://127.0.0.1:3000',
    type: 'GET',
    data: JSON.stringify(),
    contentType: 'application/json',
    success: function (data){ 
      data = JSON.parse(data);
      console.log(data);
      //messages form server - messages is the array of message objects
      var messages = data.results;
      showMessage(messages);
      collectRooms(messages);
      populateRooms(messages, selection);
      //console.log(data.results);

      //populateRooms(messages);

      console.log('chatterbox: Message fetched. Data: ', data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message. Error: ', data);
      //console.log(request);
    }  
  });
};


//App clear messages method
app.clearMessages = function() {
  $('#chats').empty();
};


//App add messages method
app.addMessage = function(theMessage){
  //$('#chats').append('<div/>' + message + '</div>');
  //$send = $('#send');
  var message = {
    username: app.username,
    roomname: app.room || 'lobby',
    text: theMessage
  };

  app.send(message);
};


//App add room method
app.addRoom = function(roomName){
  $('#roomSelect').append('<div/>' + roomName + '</div>');
};


//App add friend method
app.addFriend = function() {

};


//App showMessage method
var showMessage = function(messages) {
  var reverseMessages = messages.reverse();

  _.each(reverseMessages, function(messageObject) {
    var escapedUsername = _.escape(messageObject.username)
    var escapedText = _.escape(messageObject.text)
    $('.chats').append('<div class = messages>' + '<a href = #>' + escapedUsername + '</a>' + ": " + escapedText + "; " + escapedUsername + '</div>');
  
  });
};

var userMessage = function(message){
  $('.chats').prepend('<div class = messages>' + '<a href = #>' + message.username + '</a>' + ": " + message.text + "; " + message.username + '</div>');
  console.log(message);
};


//Collect rooms in an array, populate select element on index.html with rooms
var collectRooms = function(messages) {
  var reverseMessages = messages.reverse();
  var rooms = [];

  _.each(reverseMessages, function(messageObject) {
    if (messageObject.roomname && messageObject.roomname !== null) {
      rooms.push(messageObject.roomname);
    }
  });

  var uniqRooms = _.uniq(rooms);
  addOption(uniqRooms);
};

var addOption = function(uniqRooms) {
  _.each(uniqRooms, function(room) {
    var escapedRoom = _.escape(room)
    $('#roomSelect').append('<option value = ' + escapedRoom + '>' + escapedRoom + '</option>');
  });
};

var populateRooms = function(messages,selection){
  var selection = selection;
  var reverseMessages = messages.reverse();
  var rooms = [];
  
  _.each(reverseMessages, function(messageObject) {
    if (messageObject.roomname === selection){
      $('.chats').append('<div class = messages>' + '<a href = #>' + messageObject.username + '</a>' + ": " + messageObject.text + "; " + messageObject.username + '</div>');
    } else {
      console.log('wrong name');
    }
  });
};



//Event handlers below

//Fetch New Messages
$('button').on('click', function(){
  app.fetch();
});

//Add New Messages
$('#submit').on('click', function(event){
  event.preventDefault();
  //invke the addMessage function, passing it a parameter of message
  var send = $('#send input');
  console.log(send);
  app.addMessage(send[0].value);
});

//Event listener for when room changes

$('#roomSelect').on('change', function(e){
  //Clear chats container
  selection = (this.options[e.target.selectedIndex].text);
  $('.chats').empty();

  app.fetch(selection);
});





