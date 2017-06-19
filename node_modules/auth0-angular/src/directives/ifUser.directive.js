
angular.module('auth0.directives')
    .directive('ifUser', ['$rootScope', function($rootScope){
        return {
            link: function(scope, element){
                $rootScope.$watch('isAuthenticated',function(isAuth){
                    if(isAuth){
                        element.removeClass('ng-hide');
                    }else{
                        element.addClass('ng-hide');
                    }
                });
            }
        };
    }]);

