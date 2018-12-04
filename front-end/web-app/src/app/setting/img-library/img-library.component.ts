import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-img-library',
  templateUrl: './img-library.component.html',
  styleUrls: ['./img-library.component.css']
})
export class ImgLibraryComponent implements OnInit {
	@Output() submit = new EventEmitter<void>();
	dates = [];
	times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00'
	, '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', 
	'19:00', '20:00', '21:00', '22:00', '23:00'];
	spans = ['1 week', '2 weeks', '1 month'];
  constructor(private settingService : SettingService) { }

  ngOnInit() {
  }

  onSetDates(form : NgForm) {
  	const value = form.value;
  	console.log("form " + value.date);
  	if (value.Sunday == true) {
  		this.dates.push('Sunday');
  	}
  	if (value.Monday == true) {
  		this.dates.push('Monday');
  	}
  	if (value.Tuesday == true) {
  		this.dates.push('Tuesday');
  	}
  	if (value.Wednesday == true) {
  		this.dates.push('Wednesday');
  	}
  	if (value.Thursday == true) {
  		this.dates.push('Thursday');
  	}
  	if (value.Friday == true) {
  		this.dates.push('Friday');
  	}
  	if (value.Saturday == true) {
  		this.dates.push('Saturday');
  	}
  	this.settingService.setDates(this.dates);
  	this.settingService.setTime(value.time);
  	this.settingService.setSpan(value.span);
  	this.submit.emit();
  }
}
