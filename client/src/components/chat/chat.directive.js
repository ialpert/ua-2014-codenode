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
      link: function($scope, element) {
        var chats, selectedChat;

        /**
         * Recalculation height for holder box
         */
        function recalculationBoxHeight() {
          var chatHolder = element.find('.chat'),
            chatContent = element.find('.md-tabs-content'),
            headerTabs = element.find('.md-header-items'),
            height, DEFAULT_HEIGHT = 400;


         height = ((chatHolder.height() - headerTabs.outerHeight(true)) <= headerTabs.outerHeight(true)) ? DEFAULT_HEIGHT : (chatHolder.height() - headerTabs.outerHeight(true));

          chatContent.css({
            height: height
          });
        }
        recalculationBoxHeight();

        $(window).on('resize', function(){
          recalculationBoxHeight();
        });



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
          console.log(passed);
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

          $scope.goToEnd();
        };

        /**
         * After add new post scroll holder to the end
         */
        $scope.goToEnd = function() {
          var scrollBlock = element.find('.list-group');

          scrollBlock.each(function() {
            var box = $(this);

            box.stop().animate({
              scrollTop: box[0].scrollHeight
            }, 200);
          });
        };
      }
    };
  });
