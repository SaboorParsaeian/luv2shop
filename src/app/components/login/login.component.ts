import { Component } from '@angular/core';
// import myAppConfig from 'src/app/config/my-app-config';
// import * as OktaSignIn from '@okta/okta-signin-widget'
// import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  oktaSignin: any;

  // constructor(private oktaAuthService: OktaAuthService){
  //   this.oktaSignin = new OktaSignIn()

  // }

  //get email
  // const theEmail = Response.email
  //this.storage.setItem('userEmail', JSON.stringify(theEmail))

}
