import { Component, OnInit, Input } from '@angular/core';
import { Icons } from '../../../core/constants/icons';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RoutesRecognized } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SupportInfoComponent } from '../support-info/support-info.component';
import { SharedService } from '@services/utils/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  icons = Icons;
  activeModule: string;

  @Input() userDetails:any;
  userName:string;
  userRole:string;
  profilePhoto: string;

  notifications:any[] = [];

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    public dialog: MatDialog, 
  ) { }

  ngOnInit(): void {
    let urlsplit = this.router.url?.split("/");
    this.activeModule = urlsplit[2];
    // console.log(this.activeModule)

    this.router.events.subscribe(events => {
      if (events instanceof RoutesRecognized) {
        let urlPath = events.url.split("/");
        this.activeModule = urlPath[2];
      }
    });

    if(this.userDetails.data.isSuperAdmin) {
      this.userName = this.userDetails.data.companyName;
      this.userRole = 'Super Admin';
    }
    else if(this.userDetails.data.email == 'aceerp@aceall.io') {
      this.userName = this.userDetails.data.companyName;
      this.userRole = 'AceERP Admin';
    }
    else {
      this.userName = this.userDetails.data.fullName;
      this.userRole = this.userDetails.data.companyRole;
      this.profilePhoto = this.userDetails.data.profilePic;
    }

    this.sharedService.pollNotifications(600000).subscribe(res => { 
      this.notifications = res.data; 
      console.log('Notifications', this.notifications)
    });
  }

  public transformSvg(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  //Create a new support message
  createMessage() {
    console.log('Clicked')
    this.dialog.open(SupportInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false
      },
    });
  }
}
