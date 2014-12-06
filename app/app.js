/**
 * Created by patricksullivan on 12/5/14.
 */


var app = angular.module("sampleApp", ["firebase"]);

app.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
    var ref = new Firebase("https://ChkBook.firebaseio.com/");
    return $firebaseAuth(ref);
}]);

// and use it in our controller
app.controller("SampleController", ["$scope", "Auth","$firebase", function($scope, Auth, $firebase) {
    $scope.auth = Auth;

    $scope.user = $scope.auth.$getAuth();

    $scope.ref = new Firebase("https://ChkBook.firebaseio.com/");
    var usersRef = $scope.ref.child("users");

    var userSync = $firebase(usersRef);

    // if ref points to a data collection
    $scope.list = userSync.$asArray();

    $scope.createUserData = {
        email: "",
        password: ""
    };
    $scope.loginData = {
        email: "",
        password: ""
    };

    $scope.addItem = function(text){
        $scope.list.$add(text);
    }

    $scope.createUser = function(user){
        $scope.auth.$createUser(user.email,user.password)
            .then(function(user){
                // do things if success
                $scope.user = $scope.auth.$getAuth();

            }, function(error){
                // do things if failure
                console.log(error);
            }); ;
    }

    $scope.logOut = function(){
        $scope.auth.$unauth();
        $scope.user = $scope.auth.$getAuth();
    }

    $scope.authUser = function(email,password) {
        $scope.auth.$authWithPassword({
            email    : email,
            password : password
        })
            .then(function(user){
                // do things if success
                $scope.user = $scope.auth.$getAuth();
            }, function(error){
                // do things if failure
                console.log(error);
            }); ;


    }


}])
