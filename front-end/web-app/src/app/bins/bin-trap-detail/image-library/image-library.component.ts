import { Component, OnInit, Input } from '@angular/core';
import { BinService } from '../../bins.service';
import { Bin } from '../../bin.model';
import { Record } from '../../record.model';

@Component({
  selector: 'app-image-library',
  templateUrl: './image-library.component.html',
  styleUrls: ['./image-library.component.css']
})
export class ImageLibraryComponent implements OnInit {
	@Input() binId : number;
	@Input() trapId : number;
	bins: Bin[];
  map : Map<string, number>;
  bin: Bin;
	records: Record[];
  pos: number;
  subRecords: Record[];
  noNext : boolean = false;
  noPre : boolean = false;
  constructor(private BinService : BinService) { 
  }

  ngOnInit() {
  	this.bins = this.BinService.getBins();
    this.map = this.BinService.getMap();
    this.bin = this.bins[this.map.get("Location " + this.binId)];
    this.records = this.bin.trap_list[this.bin.map.get(this.trapId.toString())].records;
    this.pos = this.records.length;
    this.subRecords = this.records.slice(this.pos - 6 > 0 ? this.pos - 6 : 0, this.pos).reverse();
  }

  update() {
    this.pos = this.records.length;
    this.subRecords = this.records.slice(this.pos - 6 > 0 ? this.pos - 6 : 0, this.pos).reverse();
  }
  next() {
    this.pos -= 6;
    if (this.pos < 0) {
      this.noNext = true;
      this.pos += 6;
    } else {
      this.subRecords = this.records.slice(this.pos - 6 > 0 ? this.pos - 6 : 0, this.pos).reverse();
    }
    //console.log(this.pos);
  }
  pre() {
    this.pos += 6;
    if (this.pos > this.records.length) {
      this.noPre = true;
      this.pos = this.records.length;
    } else {
      this.subRecords = this.records.slice(this.pos - 6 > 0 ? this.pos - 6 : 0, this.pos).reverse();
    }
    //console.log(this.pos);
  }

}
