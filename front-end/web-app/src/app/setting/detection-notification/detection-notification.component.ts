import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-detection-notification',
  templateUrl: './detection-notification.component.html',
  styleUrls: ['./detection-notification.component.css']
})
export class DetectionNotificationComponent implements OnInit {
	notification_allow : boolean = false;
  text_allow : boolean = false;
  email_allow : boolean = false;
  constructor(private settingService : SettingService) { }

  ngOnInit() {
  }

  onSetDates(form : NgForm) {
  	const value = form.value;
  }

  onClick(index : number) {
    if (index == 0) {
      this.notification_allow = !this.notification_allow;
      console.log(this.notification_allow);
    }
    if (index == 1) {
      this.text_allow = !this.text_allow;
    }
    if (index == 2) {
      this.email_allow = !this.email_allow;
    }

  }

}
