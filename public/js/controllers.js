// TODO: Add directive for iframe onload event
angular.module('Cloudfader', [])
.controller('CloudfaderController', ['$scope', '$sce', function($scope, searchTitle, $sce) {

	$scope.init = function(id) {
		$scope.id = id;
	}
  $scope.searchResults = [];

  $scope.queue = [];

  $scope.deckA = {
  	html: '<iframe onload="initializeWidget(1)" width="100%" height="400" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&amp;url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F53900160&amp;show_artwork=true"></iframe>',
  	queue: [],
  	searchResults: [],
  	query: '',
  }

  $scope.deckB = {
  	html: '<iframe onload="initializeWidget(2)" width="100%" height="400" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&amp;url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F38720262&amp;show_artwork=true"></iframe>',
  	queue: [],
  	searchResults: [],
  	query: '',
  }

  $scope.search = function(deck, query) {
  	deck.searchResults = [];
		SC.get('/tracks', {
			q: query, embeddable_by: 'all'
		}).then(function(tracks) {
			angular.forEach(tracks, function(track) {
				if (track.embeddable_by === 'all') {
					deck.searchResults.push(track);
				}
			})
			$scope.$apply();
			console.log(deck.searchResults);
		})
  }

  $scope.embed = function(deck, track, options) {
  	SC.oEmbed(track.uri, options).then(function(oEmbed) {
  		if (deck === $scope.deckA) {
  			var int = 1;
  		} else if (deck === $scope.deckB) {
  			var int = 2;
  		}
  		deck.html = oEmbed.html.replace('<iframe', '<iframe onload=initializeWidget('+int+')');
  		$scope.$apply();
  	})
  }

  $scope.addToQueue = function(deck, track) {
  	deck.queue.push(track);
  }

  $scope.removeFromQueue = function(deck, track) {
  	var index = deck.queue.indexOf(track);
  	deck.queue.splice(index, 1);
  }

  $scope.playNextTrack = function(deck) {
		if (deck.queue.length > 0) {
			var track = deck.queue.shift();
			$scope.$apply();
			$scope.embed(deck, track, {auto_play: true})
		}
  }

  window.initializeWidget = function(int) {
  	if (int === 1) {
  		var letter = 'a';
  		var deck = $scope.deckA;
  	} else if (int == 2) {
  		var letter = 'b';
  		var deck = $scope.deckB;
  	}
  	window.setTimeout(function() {
  		deck.widget = function(){return SC.Widget(document.querySelector('div#'+letter+'-widget iframe'))};
  		deck.widget().bind(SC.Widget.Events.FINISH, function() {
  			$scope.playNextTrack(deck);
  		})
  		$scope.$apply();
  	}, 2000)
  }



}])
.filter('sanitize', ['$sce', function($sce) {
	return function(html) {
		if (html !== undefined) {
			return $sce.trustAsHtml(html);			
		}
	}
}])