import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { NgForm } from '@angular/forms';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-customize-rt-display',
  templateUrl: './customize-rt-display.component.html',
  styleUrls: ['./customize-rt-display.component.css']
})
export class CustomizeRTDisplayComponent implements OnInit {
	@Output() submit = new EventEmitter<void>();
  constructor(private settingService : SettingService) { }

  ngOnInit() {
  }

  onSetThreashold(form : NgForm) {
  	const value = form.value;
  	this.settingService.setGL(value.greenLine);
  	this.settingService.setRL(value.redLine);
  	this.submit.emit();
  }
}
