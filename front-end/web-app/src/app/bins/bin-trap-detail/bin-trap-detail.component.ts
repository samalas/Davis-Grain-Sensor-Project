import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Http, Response} from '@angular/http';
import { map, catchError} from 'rxjs/operators';
import { ServerService } from '../../server.service';
import { Record } from '../record.model';
import { Subscription } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { BinService } from '../bins.service';
import { BinListComponent } from '../bin-list/bin-list.component';
import { Injectable} from '@angular/core';
@Component({
  selector: 'app-bin-trap-detail',
  templateUrl: './bin-trap-detail.component.html',
  styleUrls: ['./bin-trap-detail.component.css']
})
@Injectable()
export class BinTrapDetailComponent implements OnInit, OnDestroy {
	showLibrary : boolean = false;
	showImg : boolean = false;
	binId : number;
	trapId : number;
	realTimeRecord : Record;
	private socket; // socket that connect to the socket.io server
  constructor(private route : ActivatedRoute, private serverService : ServerService, private bService : BinService, private bList : BinListComponent) { }

  ngOnInit() {
  	this.route.params.subscribe(
  			(params: Params) => {
  				this.binId = +params['binid'] + 1;
  				this.trapId = +params['trapid'];
  				this.showLibrary = false;
  				this.showImg = false;
  			}
  		);
  	this.realTimeRecord = new Record("", 0, 0, "loading", "https://i.redd.it/ounq1mw5kdxy.gif", 0, "");
  }
  showL() {
  	this.showLibrary = !this.showLibrary;
  }

  showI() {
  	this.showImg = !this.showImg;
  }

  take_photo(sensorId: number) {
  	this.realTimeRecord.imgUrl = "https://i.redd.it/ounq1mw5kdxy.gif";
  	this.realTimeRecord.insectCount = 0;
  	this.realTimeRecord.timestamp = "loading";

  	this.showImg = true;
  	var command = {
  		'command': 'take_and_process_picture',
        'id': sensorId.toString() // Specify which sensor to send to
  	}
  	// this.serverService.take_photo(obj);
  	this.serverService.take_photo()
			.subscribe(
				(res: any) => {
		            console.log(res);
		            var token = res.text();
		            console.log(token);
		              this.socket = io(environment.ws_url, {
		                  path: '/ws',
		                  secure: true,
		                  query: {
		                       'token' : token
		                  },
		                  reconnection : false
		              });
		              this.socket.on('connect',() => {
		                  console.log('connected');
		                  this.socket.emit('user_command', JSON.stringify(command));
		              });
		              this.socket.on('user_command_response', (data: Response) => {
		                console.log("Receive a message from server");
		                const res = JSON.parse(data.toString());
		                const record = res.records[0];
		                console.log(record);
		                this.bService.addRecords(res);
		                this.realTimeRecord.sensorLocation = record.sensorLocation;
		                this.realTimeRecord.sensorID = record.sensorID;
		                this.realTimeRecord.insectCount = record.insectCount;
		                this.realTimeRecord.timestamp = record.timestamp;
		                this.realTimeRecord.imgUrl = record.imgUrl;
		                this.showImg = true;
		                this.bList.getAllRecords();
		              });
		          }
			);
  }

  ngOnDestroy() {
  }
}
