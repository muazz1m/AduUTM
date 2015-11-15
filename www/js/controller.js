angular.module('starter.controllers',[])

.controller('LoginCtrl', function(FirebaseService, $firebaseAuth, $state, $scope, $ionicHistory){
	
	var fb = $firebaseAuth(FirebaseService);

	//Check if user is logged in; one time login
    $scope.user = fb.$getAuth();
    if (!$scope.user) {
        $state.this = 'login';
    }else{
    	$state.go('menu.home');
    	//--to prevent user go back to login when tap the back button--//
    	$ionicHistory.nextViewOptions({
		  disableAnimate: true,
		  disableBack: true,
		  historyRoot: true
		});
		//--//
    }

	$scope.login = function(username, password){

		//allow user to sign with n w/out domain
		var domain = '@live.utm.my';
		if(username.indexOf(domain) >= 0){
			//console.log(username);
		}else{
			username += "@live.utm.my";
		}


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
			}, function(error) {
			  // error
			});
		}
	}
	  

	$scope.list = function(){

		if(fb){
			var syncObject = $firebaseObject(path);
			syncObject.$bindTo($scope, "adus");
			//count total number of complaints
			path.on("value", function(snapshot) {
				var count = 0;
				snapshot.forEach(function(childSnap){
					count++;
			});
					$scope.counts=count;
			});		
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
		// A confirm dialog
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Logout?',
	     template: 'Are you sure you want to logout?',
	     okText: 'Logout',
	     okType: 'button-assertive',
	     scope: $scope,
	     cssClass: 'popup-custom'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       FirebaseService.unauth();
			$state.go('login');
	     } else {
	       return;
	     }
	   });
		
	}

})
