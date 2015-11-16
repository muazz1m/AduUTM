angular.module('starter.controllers',[])

//login controller
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

    //login
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

//main controller
.controller('AduCtrl', function($ionicModal, $state, $scope, FirebaseService, $firebaseObject, $ionicPopup, $cordovaToast, $ionicScrollDelegate, $rootScope){

	var fb = FirebaseService.getAuth();
	var path = FirebaseService.child("users").child(fb.uid).child("adu");

	//init form modal
	$ionicModal.fromTemplateUrl('templates/_form.html', function(modal) {
		$scope.modalForm = modal;
	},{
		scope: $scope,
		animation: 'slide-in-right'
	});

	//problem typeOption
	$scope.typeOptions = [
    { name: 'CIVIL', value: 'civil' }, 
    { name: 'ELECTRICAL', value: 'electrical' },
    { name: 'LOGISTIC', value: 'logistic'}, 
    { name: 'OTHERS', value: 'others' }
    ];
    $scope.adu = {type : $scope.typeOptions[0].value};

    //new complaint
	$scope.newAdu = function(){
		$scope.modalTitle = "New Complaint";
		$scope.modalForm.show();
	}

	$scope.newModal = function() {
		$scope.modalForm.show();
	}

	//close form modal
	$scope.closeModal = function() {
		$scope.modalForm.hide();
	}

	//submit complaint
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
	  
	//initialized complaint list
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

	//remove complaint
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

	//logout
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

//email controller
.controller('EmailCtrl', function($scope){
	//send feedback
	$scope.sendFeedback = function(){
		if(window.plugins && window.plugins.emailComposer){
			window.plugins.emailComposer.showEmailComposerWithCallback(function(result){
				console.log("Email Success");
			},
			"Send Feedback", 		//Subject
			"",						//Body
			["support@kuhosu.com"],	//To
			null,					//CC
			null,					//BCC
			false,					//isHTML
			null,					//Attachments
			null					//Attachment Data
			);
		}
	}
})