/**
* Instagram Module
*
* Connect Sellsuki with Instagram API
*/

var config = {
	clientId : '64fd550c886a41378ace10ff9008675f',
	redirectUri : 'http://localhost/',
	scope : 'likes+basic'
};

var authenticate = {
	accessToken : null,
	profile : null
};

var url = {
	authenticate : 'https://instagram.com/oauth/authorize/',
	getProfile : 'https://api.instagram.com/v1/users/',
	getSelfFeed : 'https://api.instagram.com/v1/users/self/feed/'
};

var app = angular.module('InstagramApp', []);

app.controller('authenticateController', ['$scope', 'igapi', 'state', function($scope, igapi, state){

	$scope.state = state.init();
	$scope.init = function(){
		console.log('Init function');
		if(igapi.authenticate()){
			igapi.getProfile({
				userId : 'self'
			}, function(res){
				if(res && !res.error){
					console.log(res);
				}else{
					console.log(res);	
				}
			});
		}
	};
	
}]).
factory('igapi', ['$window', '$location', '$http', 'url', 'state', function($window, $location, $http, url, state){
	return {
		authenticate: function(){
			if($location.path().search('access_token=') == 1){
				authenticate.accessToken = $location.path().split('access_token=')[1];
			}
			console.log(authenticate.accessToken);
			if(authenticate.accessToken === null){
				console.log('Go to authenticate');
				state.isAuth(false);
				$window.location.href = url.auth();
				return false;
			}else{
				state.isAuth(true);
				return true;
			}
		},
		getProfile: function(params, callback){
			$http({
				method: 'JSONP',
				url: url.getProfile(params) + '&callback=JSON_CALLBACK'
			}).
			success(function(status) {
				if(status.meta.code == 200){
					$location.path('');
					callback(status.data);
				}else{
					authenticate.accessToken = null;
					$location.path('');
					callback({
						error : status.meta
					});
				}
			}).
			error(function(status) {
				callback({
					error : status
				});
			});
		}
	};
}]).
factory('url', function(){
	return {
		auth: function(){
			return url.authenticate+
			'?client_id='+config.clientId+
			'&response_type=token&scope='+config.scope+
			'&redirect_uri='+config.redirectUri;
		},
		getProfile: function(params){
			return url.getProfile+
			params.userId+
			'?access_token='+authenticate.accessToken;
		},
		getSelfFeed: function(){
			return url.getSelfFeed+
			'?access_token='+authenticate.accessToken;
		}
	};
}).
factory('state', function(){
	var state = {
		isAuth: false
	}
	return {
		init: function(){
			return state;
		},
		isAuth: function(r){
			state.isAuth = r;
		}
	};
});