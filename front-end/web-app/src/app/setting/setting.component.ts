import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
	customize_show : boolean = false;
	img_library_show : boolean = false;
	notification_show : boolean = false;
  constructor() { }

  ngOnInit() {
  }

  onClick(index : number) {
  	if (index == 1) {
  		this.customize_show = !this.customize_show;
  	}
  	if (index == 2) {
  		this.img_library_show = !this.img_library_show;
  	}
  	if (index == 3) {
  		this.notification_show = !this.notification_show;
  	}
  }

}
