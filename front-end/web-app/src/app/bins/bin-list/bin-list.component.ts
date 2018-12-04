import { Component, OnInit} from '@angular/core';
import { Bin } from '../bin.model';
import { BinService } from '../bins.service';
import { ServerService } from '../../server.service';
import { Injectable} from '@angular/core';
@Component({
  selector: 'app-bin-list',
  templateUrl: './bin-list.component.html',
  styleUrls: ['./bin-list.component.css']
})
@Injectable()
export class BinListComponent implements OnInit {
	bins: Bin[];
  	constructor(private BinService : BinService, private serverService : ServerService) { }

  	ngOnInit() {
      this.getAllRecords();
  		this.bins = this.BinService.getBins();
  	}

  	getSensors() {
  		this.serverService.getSensors()
			.subscribe(
				(response : any) => console.log(response),
				(error) => console.log(error)
			);
  	}

    getAllRecords() {
      this.serverService.getAllRecords()
      .subscribe(
        (response : any) => {
          for (let record of response.records) {
            this.BinService.addRecords(record);
          }
          this.bins = this.BinService.getBins();
          //console.log(this.bins);
        },
        (error) => console.log(error)
      );
    }

}
