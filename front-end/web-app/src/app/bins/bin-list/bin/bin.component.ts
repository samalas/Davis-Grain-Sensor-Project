import { Component, OnInit, Input, EventEmitter} from '@angular/core';
import { Bin } from '../../bin.model';
import { BinService } from '../../bins.service';
@Component({
  selector: 'app-binlist-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css']
})
export class BinComponent implements OnInit {
	
	@Input() bin: Bin;
  @Input() index: number;
  	constructor(private BinService : BinService) { }

  	ngOnInit() {
  		//console.log(this.index);
  	}

}
