angular.module('starter.controllers',[])

.controller('LoginCtrl', function(FirebaseService, $firebaseAuth, $state, $scope){
	
	var fb = $firebaseAuth(FirebaseService);

	$scope.login = function(username, password){

		fb.$authWithPassword({
			email: username,
			password: password
		}).then(function(authData) {
			$state.go('menu.home');
		}).catch(function(error) {
			alert('Error : ' + error);
		})
	}
})

.controller('AduCtrl', function($ionicModal, $state, $scope, FirebaseService, $firebaseObject, $ionicPopup, $cordovaToast, $ionicScrollDelegate, $rootScope){
	
	var fb = FirebaseService.getAuth();
	var path = FirebaseService.child("users").child(fb.uid).child("adu");

	$ionicModal.fromTemplateUrl('templates/_form.html', function(modal) {
		$scope.modalForm = modal;
	},{
		scope: $scope,
		animation: 'slide-in-right'
	});

	$scope.newAdu = function(){
		$scope.modalTitle = "New Complaint";
		$scope.modalForm.show();
	}

	$scope.newModal = function() {
		$scope.modalForm.show();
	}

	$scope.closeModal = function() {
		$scope.modalForm.hide();
	}

	$scope.submitAdu = function(adu){
		$scope.adu = {};
		if(!adu.description.length){
			return;
		}else{
			
			path.push({
				type: adu.type,
				description: adu.description,
				location: adu.location,
				submited_at: Firebase.ServerValue.TIMESTAMP
			});

			$scope.closeModal();
			adu.type = "";
			adu.description = "";
			adu.location = "";
			$cordovaToast.showLongBottom('Complaint submitted').then(function(success) {
			  // success
			}, function (error) {
			  // error
			});
		}
	}
	  

	$scope.list = function(){

		if(fb){
			var syncObject = $firebaseObject(path);
			syncObject.$bindTo($scope, "adus");
		}else{
			$state.go('login');
		}
	}

	$scope.removeAdu = function(key){
		// A confirm dialog
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Complaint',
	     template: 'Are you sure you want to delete this complaint?',
	     okText: 'Delete',
	     okType: 'button-assertive',
	     scope: $scope,
	     cssClass: 'popup-custom'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       path.child(key).remove();
	     } else {
	       return;
	     }
	   });

		
	}

	$scope.logout = function(){
		FirebaseService.unauth();
		$state.go('login');
	}
/*hide FAB when scroll*/

})
