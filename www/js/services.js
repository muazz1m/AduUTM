angular.module('starter.services',[])

.factory('FirebaseService', function(){

	var fireRef = new Firebase('https://aduutm.firebaseio.com/');
	return fireRef;

})
