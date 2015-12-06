'use strict';

class SettingsController {
  
  //start-non-standard
//  errors = {};
//  submitted = false;
//  //end-non-standard
//  submittedProfile = false;

  constructor(Auth) {
    this.errors = {};
    this.submitted = false;
    this.submittedProfile = false;
    this.Auth = Auth;
    this.user = this.Auth.getCurrentUser();
  }

  changePassword(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }


  changeProfile(form) {
    this.submittedProfile = true;

    if (form.$valid) {
      this.Auth.saveProfile(this.user.city, this.user.state)
        .then(() => {
          this.profileFormMessage = 'Profile successfully saved.';
          this.user = this.Auth.getCurrentUser();
//          console.log('New user', this.user);
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.profileFormMessage = 'Error saving profile.';
        });
    }
  }


}

angular.module('appApp')
  .controller('SettingsController', SettingsController);
