import { Component, OnInit, Input } from '@angular/core';
import { Icons } from '../../../core/constants/icons';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RoutesRecognized } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SupportInfoComponent } from '../support-info/support-info.component';
import { SharedService } from '@services/utils/shared.service';
import { HumanResourcesService } from '@services/hr/human-resources.service';

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
  notificationBadgeCount:number = 0;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private hrService: HumanResourcesService,
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
      const raw = res.data; // this is already an array

      // 1. Sort unread first
      const sorted = raw.sort((a, b) => Number(a.read) - Number(b.read));

      // 2. Count unread
      this.notificationBadgeCount = sorted.filter(n => !n.read).length;

      // 3. Build the display list (max 5)
      const unread = sorted.filter(n => !n.read);
      const read = sorted.filter(n => n.read);

      if (unread.length >= 5) {
        // show only unread (max 5)
        this.notifications = unread.slice(0, 5);
      } 
      else {
        // show all unread + fill with read
        const remaining = 5 - unread.length;
        this.notifications = [
          ...unread,
          ...read.slice(0, remaining)
        ];
      }

      console.log('Notifications (processed)', this.notifications);
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

  markAllAsRead() {
    const unread = this.notifications.filter(n => !n.read);
    if (unread.length === 0) return;

    unread.forEach(n => {
      this.sharedService.readNotification(n._id).subscribe((res) => {
        if (res.success) { 
          n.read = true;
          this.notificationBadgeCount--;
        }
      });
    });    
  }

}
