angular.module('Cloudfader', ['rzModule'])
.controller('CloudfaderController', ['$scope', '$sce', function($scope, searchTitle, $sce) {

  $scope.deckA = {
  	html: '<iframe onload="initializeWidget(1)" width="100%" height="300" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F110730099&show_artwork=true&single_active=false"></iframe>',
  	queue: [],
  	searchResults: [],
  }

  $scope.deckB = {
  	html: '<iframe onload="initializeWidget(2)" width="100%" height="300" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F32850380&show_artwork=true&single_active=false"></iframe>',
  	queue: [],
  	searchResults: [],
  }

  $scope.fader = {
  	value: 50,
  	options: {
  		floor: 0,
  		ceil: 100,
  		onChange: function() {
  			// If fader moves right...
  			if ($scope.fader.value > 50) {
  				$scope.deckB.volume = $scope.fader.value / 100;
  				$scope.deckA.volume = ($scope.fader.options.ceil - $scope.fader.value) / 100;
  			}
  			// If fader moves left...
  			if ($scope.fader.value < 50) {
  				$scope.deckB.volume = $scope.fader.value / 100;
  				$scope.deckA.volume = (50 + $scope.fader.value) / 100;
  			}
  			$scope.deckA.widget().setVolume($scope.deckA.volume);
  			$scope.deckB.widget().setVolume($scope.deckB.volume);
  		}
  	}
  }

  $scope.query = 'Robyn';

  $scope.$watch('query', function(newVal, oldVal) {
  	if ($scope.query !== '') { $scope.search($scope.query) }
  }, true)

  $scope.search = function(query) {
  	$scope.searchResults = [];
		SC.get('/tracks', {
			q: query, embeddable_by: 'all'
		}).then(function(tracks) {
			console.log(tracks);
			angular.forEach(tracks, function(track) {
				if (track.embeddable_by === 'all') { $scope.searchResults.push(track) }
			})
			$scope.$apply();
		})
  }


  $scope.embed = function(deck, track, options) {
  	SC.oEmbed(track.uri, options).then(function(oEmbed) {
  		if (deck === $scope.deckA) { var int = 1 }
  		if (deck === $scope.deckB) { var int = 2 }
  		deck.html = oEmbed.html.replace('<iframe', '<iframe onload=initializeWidget('+int+')');
  		$scope.$apply();
  	})
  }

  $scope.addToQueue = function(deck, track) {
  	console.log(track);
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
			$scope.embed(deck, track, {auto_play: true, single_active: false})
		}
  }

  $scope.play = function(deck, track) {
  	$scope.embed(deck, track, {auto_play: true})
  	$scope.removeFromQueue(deck, track);
  }

  window.initializeWidget = function(int) {
  	if (int === 1) { 
  		var letter = 'a';
  		var deck = $scope.deckA;
  	}
  	if (int === 2) { 
  		var letter = 'b';
  		var deck = $scope.deckB 
  	}
  	// waits for the player to load before adding it to scope
  	window.setTimeout(function() {
  		deck.widget = function(){return SC.Widget(document.querySelector('div#'+letter+'-widget iframe'))};
  		deck.widget().setVolume(0.5);
  		// Plays the next track in queue when the current track finishes
  		deck.widget().bind(SC.Widget.Events.FINISH, function() { $scope.playNextTrack(deck) })

  		$scope.$apply();
  	}, 2000)
  }
}])
.filter('sanitize', ['$sce', function($sce) {
	return function(html) {
		if (html !== undefined) { return $sce.trustAsHtml(html) }
	}
}])