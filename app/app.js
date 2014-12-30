/**
 * Created by patricksullivan on 12/5/14.
 */


var app = angular.module("sampleApp", ["firebase"]);

app.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
    var ref = new Firebase("https://pdsullivaftestapp.firebaseio.com/");
    return $firebaseAuth(ref);
}]);

// and use it in our controller
app.controller("SampleController", ["$scope", "Auth","$firebase", function($scope, Auth, $firebase) {

    $scope.auth = Auth;

    //$scope.createUserData = {
    //    email: "",
    //    password: ""
    //};
    //
    //$scope.loginData = {
    //    email: "",
    //    password: ""
    //};

    $scope.user = $scope.auth.$getAuth();

    $scope.ref = new Firebase("https://pdsullivaftestapp.firebaseio.com/");

    var usersRef = null;

    var clearPopulateData = function(){

        $scope.createUserData = {
            email: "",
            password: ""
        };

        $scope.loginData = {
            email: "",
            password: ""
        };
    }

    var loadUserData = function(){
        if($scope.user && $scope.user.uid){
            var usersRef = $scope.ref.child("users" + $scope.user.uid);

            var userSync = $firebase(usersRef);

            // if ref points to a data collection
            $scope.list = userSync.$asArray();

        }
    };



    $scope.addItem = function(text){
        $scope.list.$add(text);
        $scope.addItemText = null;
    }

    $scope.createUser = function(user){
        $scope.auth.$createUser(user.email,user.password)
            .then(function(user){
                // do things if success
                $scope.user = $scope.auth.$getAuth();
                alert('You Are Registered Now Log In.');
                clearPopulateData();

            }, function(error){
                // do things if failure
                console.log(error);
                alert('Error Registering User');
            });
    }

    $scope.logOut = function(){

        $scope.auth.$unauth();
        $scope.user = $scope.auth.$getAuth();
        clearPopulateData();
    }

    $scope.authUser = function(email,password) {
        $scope.auth.$authWithPassword({
            email    : email,
            password : password
        })
            .then(function(user){
                // do things if success
                $scope.user = $scope.auth.$getAuth();
                loadUserData();
                clearPopulateData();
            }, function(error){
                // do things if failure
                console.log(error);
                alert('Error Logging In');
            });


    }

    clearPopulateData();
    loadUserData();

}])
