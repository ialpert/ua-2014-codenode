'use strict';

/**
 * @ngdoc directive
 * @name interviewer.directive:videoConference
 * @description
 */

angular.module('interviewer')
  .directive('videoConference', [function() {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'components/videoConference/videoConference.directive.html',
      controller: function($scope, config, WebRTC, Room) {
        $scope.localVideoEnabled = false;
        $scope.micEnabled = false;
        $scope.peers = {};

        $scope.webrtc = new WebRTC({
          url: config.webrtcSignalingUrl,
          // the id/element dom element that will hold "our" video
          localVideoEl: 'conference-local-video',
          // the id/element dom element that will hold remote videos
          remoteVideosEl: '',
          // immediately ask for camera access
          autoRequestMedia: true,
          debug: false,
          detectSpeakingEvents: true,
          autoAdjustMic: false
        });

        var events = {
          readyToCall: function() {
            $scope.webrtc.joinRoom(Room.interview);
            $scope.localVideoEnabled = true;
            $scope.micEnabled = true;
          },
          videoAdded: function(video, peer) {
            console.log('Peer connected', peer);
            $scope.peers[peer.id] = peer;
          },
          videoRemoved: function(video, peer) {
            console.log('Peer disconnected', peer);
            delete $scope.peers[peer.id];
          },
          channelMessage: function(peer, label, data) {
            switch (data.type) {
              case 'volume':
                var percent = 0;
                if (data.volume < -45) { // vary between -45 and -20
                  percent = 0;
                } else {
                  if (data.volume > -20) {
                    percent = 100;
                  } else {
                    percent = Math.floor((data.volume + 100) * 100 / 25 - 220);
                  }
                }

                $scope.peers[peer.id]['volume'] = percent;
                break;
              default:
                break;
            }
          },
          localScreenAdded: angular.noop
        };

        angular.forEach(events, function(callback, eventName) {
          $scope.webrtc.on(eventName, function() {
            var args = Array.prototype.slice.call(arguments, 0);
            $scope.$apply(function() {
              callback.apply(null, args);
            });
          });
        });

        $scope.toggleLocalVideo = function() {
          $scope.webrtc[['resumeVideo', 'pauseVideo'][+$scope.localVideoEnabled]]();
          $scope.localVideoEnabled ^= true;
        };

        $scope.toggleMic = function() {
          $scope.webrtc[['unmute', 'mute'][+$scope.micEnabled]]();
          $scope.micEnabled ^= true;
        };
      }
    };
  }]);
