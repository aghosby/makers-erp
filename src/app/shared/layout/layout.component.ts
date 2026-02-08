import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/utils/authentication.service';
import { NotificationService } from '../services/utils/notification.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  private readonly TOKEN_NAME = 'user_auth';
  authDetails: any;
  userDetails: any;
  showGeneralNotice:boolean = false;

  constructor(
    private router: Router, 
    private auth: AuthenticationService, 
    private notify: NotificationService
  ) {
    let urlsplit = this.router.url.split("/");
    // console.log(urlsplit);
    if(urlsplit[2] && urlsplit[2].includes('.')) {
      console.log(JSON.parse(atob(urlsplit[2].split('.')[1])))
      this.authDetails = JSON.parse(atob(urlsplit[2].substring(1).split('.')[1]))
      // console.log(urlsplit);
      let info = {
        token: urlsplit[2]
      }
      this.auth.verifyEmail(info).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.notify.showSuccess("Your email has been verified");
            let authInfo = {
              email: this.authDetails.email,
              password: this.authDetails.password
            }
            this.auth.login(authInfo).subscribe({
              next: res => {
                console.log(res);
                if(res.status == 200) {
                  this.userDetails = res.data;
                  if(res.data.isSuperAdmin) this.router.navigate(['app/settings']);
                  else this.router.navigate(['set-password']);
                }
              },
              error: err => {
                console.log(err)
                //this.notify.showError(err.error.error);
              }          
            })
          }
        },
        error: err => {
          console.log(err)
          this.notify.showError(err.error.error);
          this.router.navigate(['login']);
        }          
      })
    }
    else {
      this.userDetails = this.auth.loggedInUser;
      // if(this.userDetails.data.firstTimeLogin) {
        
      //   //console.log(userParam);
      // }
    }
  }

  ngOnInit(): void {
    //console.log(this.router.url.split("/dashboard/"));
    
  }

  // ngAfterViewInit() {
    
  // }

  get token() {
    return localStorage.getItem(this.TOKEN_NAME);
  }

}
