'use strict';

(function() {

function UserResource($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  },
  {
    changePassword: {
      method: 'PUT',
      params: {
        controller:'password'
      }
    },
    saveProfile: {
      method: 'PUT',
      params: {
        controller:'saveProfile'
      }
    },
    get: {
      method: 'GET',
      params: {
        id:'me'
      }
    }
  });
}

angular.module('appApp.auth')
  .factory('User', UserResource);

})();
