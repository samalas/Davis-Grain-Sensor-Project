import { Component } from '@angular/core';
import { SettingService } from './setting/setting.service';
import { ServerService } from './server.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SettingService, ServerService]
})
export class AppComponent {
	loadedFeature = "bin";
  	title = 'app';
  	onNavigate(feature : string) {
  		this.loadedFeature = feature;
  	}
}
