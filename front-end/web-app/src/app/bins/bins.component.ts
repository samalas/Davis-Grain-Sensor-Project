import { Component, OnInit } from '@angular/core';
import { BinService } from './bins.service';
import { BinListComponent } from './bin-list/bin-list.component';

@Component({
  selector: 'app-bins',
  templateUrl: './bins.component.html',
  styleUrls: ['./bins.component.css'],
  providers: [BinService, BinListComponent]
})
export class BinsComponent implements OnInit {
  constructor(private BinService : BinService) {
  	//this.BinService.requestForBinsData();
  }

  ngOnInit() {
  }

}
