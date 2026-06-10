import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders-settings',
  templateUrl: './orders-settings.component.html',
  styleUrls: ['./orders-settings.component.scss']
})
export class OrdersSettingsComponent implements OnInit {

  tabMenu: { routeLink: string; label: string }[] = [
    // Tabs will be added here
  ];

  constructor() {}

  ngOnInit(): void {}
}
