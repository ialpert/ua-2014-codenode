'use strict';

/**
 * @ngdoc directive
 * @name interviewer.directive:chat
 * @description
 */

angular.module('interviewer')
  .directive('chat', function(AppState, Room, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'components/chat/chat.directive.html',
      scope: {},
      controller: function($scope) {
        var chats, selectedChat;

        chats = AppState.getState().at('_page.session').at('chats');
        selectedChat = AppState.getState().at('_page.user').at('selectedChat');

        selectedChat.setNull(0);

        chats.setNull([
          {
            title: 'Session',
            messages: [],
            access: ['head', 'expert', 'candidate'],
            lastMessage: ''
          },
          {
            title: 'Experts',
            messages: [],
            access: ['head', 'expert'],
            lastMessage: ''
          }]);

        $scope.selectedChat = selectedChat.get();

        $scope.$watch('selectedChat', function(idx) {
          selectedChat.set(idx);
        });

        selectedChat.on('change', '', function(val, oldVal, passed) {

          if (passed && !passed.local) {

            $timeout(function() {
              $scope.selectedChat = val;
            });
          }
        });

        chats.on('insert', '*.messages', function(chatId, vals, passed) {
          if (passed && !passed.local) {
            $timeout(function() {
              chatId = parseInt(chatId);
              $scope.chats[chatId].messages = chats.at(chatId).at('messages').getCopy();
            });
          }
        });

        $scope.chats = chats.getCopy();

        $scope.submit = function() {
          var chat, message;

          chat = $scope.chats[$scope.selectedChat];

          if (chat.lastMessage) {

            message = {
              message: chat.lastMessage,
              time: Date.now(),
              author: Room.token
            };

            chats.at($scope.selectedChat).at('messages').push(message);

            chat.lastMessage = '';

          }
        };
      },
      link: function(scope, element, attrs) {

      }
    };
  });