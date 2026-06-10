import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Icons } from '../../../core/constants/icons';
import { navbarData, navbarDataReg, navbarDataManager, navbarDataAceErp, navbarDataOrders, navbarDataAccounting } from '../../../core/constants/nav-data';
import { AuthenticationService } from '../../services/utils/authentication.service';
import { NotificationService } from '../../services/utils/notification.service';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() userDetails:any;
  collapsed = true;
  icons = Icons;
  adminMenuData = navbarData;
  regMenuData = navbarDataReg;
  managerMenuData = navbarDataManager;
  aceerpMenuData = navbarDataAceErp;
  ordersMenuData = navbarDataOrders;
  accountingMenuData = navbarDataAccounting;
  activeModule:string;

  currentLink = 'Human Resources';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer, 
    private authService: AuthenticationService, 
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    // console.log(this.userDetails);
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
      this.collapsed = false;
      this.currentLink = 'Human Resources';
    };
  }


  //Logout function
  logout() {
    this.notifyService.confirmAction({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout();
      }
    });
  }

  public transformSvg(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
