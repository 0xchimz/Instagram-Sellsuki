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
	authenticateUrl : 'https://instagram.com/oauth/authorize/',
	userUrl : 'https://api.instagram.com/v1/users/',
	mediaPath : '/media/recent/',
	mediaUrl : 'https://api.instagram.com/v1/media/'
};

var app = angular.module('InstagramApp', []);

app.controller('igController', ['$scope', 'igapi', 'state', function($scope, igapi, state){

	$scope.state = state.init();
	$scope.feeds = {
		pagination: {
			next_max_id: ''
		},
		data: []
	};
	$scope.currentMedia = state.getCurrentMedia();

	$scope.init = function(){
		console.log('Init function');
		if(igapi.authenticate()){
			
			igapi.getProfile({
				userId : 'self'
			}, profileResult);

			$scope.getUserMedia();
		}
	};

	$scope.getUserMedia = function(){
		igapi.getUserMedia({
			maxId : $scope.feeds.pagination.next_max_id,
			userId : 'self'
		}, selfMediaResult);
	};

	$scope.loadMedia = function(media){
		$scope.currentMedia = media;
		state.isShowMedia(true);
		console.log(media);
	};

	var selfMediaResult = function(res){
		console.log(res);
		if(res && !res.error){
			console.log("Get Self Media success.");
			$scope.feeds.data.push.apply($scope.feeds.data, res.data);
			$scope.feeds.pagination = res.pagination;
		}else{
			console.log(res);
		}
	};

	var profileResult = function(res){
		if(res && !res.error){
			console.log("Get Profile success.");
		}else{
			console.log(res);
		}
	};
	
}]);

app.controller('submitComment', ['$scope', 'igapi', 'state', function($scope, igapi, state){
	$scope.currentMedia = state.getCurrentMedia();
	$scope.sendComment = function(){
		
	};
}]);

app.factory('igapi', ['$window', '$location', '$http', 'url', 'state', function($window, $location, $http, url, state){

	return {
		authenticate: function(){
			if($location.path().search('access_token=') == 1){
				authenticate.accessToken = $location.path().split('access_token=')[1];
				$location.path('');
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
			success(function(res) {
				if(res.meta.code == 200){
					callback(res.data);
				}else{
					authenticate.accessToken = null;
					callback({
						error : res.meta
					});
				}
			}).
			error(function(res) {
				callback({
					error : res
				});
			});
		},
		getUserMedia: function(params, callback){
			$http({
				method: 'JSONP',
				url: url.getUserMedia(params) + '&callback=JSON_CALLBACK'
			}).
			success(function(res) {
				if(res.meta.code == 200){
					console.log("Success to get user feed.");
					callback({
						data : res.data,
						pagination : res.pagination
					});
				}else{
					callback({
						error : res.meta
					});
				}
			}).
			error(function(res) {
				callback({
					error : res
				});
			});
		},
		getMedia: function(params, callback){
			$http({
				method: 'JSONP',
				url: url.getMedia(params) + '&callback=JSON_CALLBACK'
			}).
			success(function(res) {
				if(res.meta.code == 200){
					console.log("Success to get media with id "+ params.mediaId);
					callback({
						data : res.data
					});
				}else{
					callback({
						error : res.meta
					});
				}
			}).
			error(function(res) {
				callback({
					error : res
				});
			});
		}
	};
}]);

app.factory('url', function(){
	return {
		auth: function(){
			return url.authenticateUrl+
			'?client_id='+config.clientId+
			'&response_type=token&scope='+config.scope+
			'&redirect_uri='+config.redirectUri;
		},
		getProfile: function(params){
			return url.userUrl+
			params.userId+
			'?access_token='+authenticate.accessToken;
		},
		getUserMedia: function(params){
			return url.userUrl+
			params.userId+
			url.mediaPath+
			'?access_token='+authenticate.accessToken+
			'&max_id='+params.maxId;
		},
		getMedia: function(params){
			return url.getMedia+
			params.mediaId+
			'?access_token='+authenticate.accessToken;
		}
	};
});

app.factory('state', function(){

	var state = {
		isAuth: false,
		isShowMedia: false
	};

	var currentMedia = '';

	return {
		init: function(){
			return state;
		},
		isAuth: function(r){
			state.isAuth = r;
		},
		isShowMedia: function(r){
			state.isShowMedia = r;
		},
		getCurrentMedia: function(){
			return currentMedia;
		}
	};
});