var twitterStream = angular.module('myApp', ['chart.js'])

twitterStream.controller("mainCtrl", ['$scope', 'socket',
function ($scope, socket) {
  //chart labels
  $scope.labels = ["love", "life", "best", "free", "happy"];
  //chart colors
  $scope.colors = ['#9CF6F6','#F56960','#F3C98B','#C46D5E', '#9527C2', '#A1869E'];
  //intial data values
  $scope.Data = [0,0,0,0,0,0];

  socket.on('newTweet', function (tweet) {
    $scope.tweet = tweet.text
    $scope.user = tweet.user.screen_name
    //parse source from payload
    var text = tweet.text;
    text = text.split(' ');

    if (text.indexOf('love') !== -1) {
      text = 'love';
    }
    if (text.indexOf('best') !== -1) {
      text = 'best';
    }
    if (text.indexOf('free') !== -1) {
      text = 'free';
    }
    if (text.indexOf('happy') !== -1) {
      text = 'happy';
    }
    if (text.indexOf('life') !== -1) {
      text = 'life';
    }

    console.log(text);

    //all hashtags in the tweet
    var hashtags = tweet.entities.hashtags.map(function(el){
      return el.text.toLowerCase()
    })

    //check source and increment for #trump tweets
    if (hashtags.indexOf('wednesdaywisdom') !== -1){
      switch (text) {
        case 'love': $scope.Data[0]++
        break;
        case 'life': $scope.Data[1]++
        break;
        case 'best': $scope.Data[2]++
        break;
        case 'free': $scope.Data[3]++
        break;
        case 'happy': $scope.Data[4]++
        break;
        default: console.log('whatever');
        break;
      }
    }
  });
}
]);


/*---------SOCKET IO METHODS (careful)---------*/

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
