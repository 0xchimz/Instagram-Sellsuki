/**
* Instagram Module
*
* Connect Sellsuki with Instagram API
*/

var config = {
	clientId : '64fd550c886a41378ace10ff9008675f',
	redirectUri : 'http://localhost:8000/',
	scope : 'likes+basic'
};

var authenticate = {
	accessToken : null
};

var url = {
	authenticate : 'https://instagram.com/oauth/authorize/',
	getProfile : 'https://api.instagram.com/v1/users/'
};

var app = angular.module('InstagramApp', []);

app.controller('authenticateController', ['$scope', '$window', '$location', function($scope, $window, $location ){

	$scope.init = function(){
		var _url = url.authenticate+'?client_id='+config.clientId+'&response_type=token&scope='+config.scope+'&redirect_uri='+config.redirectUri;
		console.log('Init function');

		if($location.path().search('access_token=') == 1){
			authenticate.accessToken = $location.path().split('access_token=')[1];
		}

		if(authenticate.accessToken === null){
			$window.location.href = _url;
		}else{
			console.log('Token not null.');
			console.log(authenticate.accessToken);
		}
	};
	
}]);