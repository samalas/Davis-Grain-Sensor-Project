import { Component, OnInit, Injectable } from '@angular/core';
import { Bin } from '../bin.model';
import { ActivatedRoute, Params } from '@angular/router';
import { BinService } from '../bins.service';
import { Chart } from 'chart.js';
import { Record } from '../record.model';
import { CharData } from './charData.model';
import { Data } from './data.model';
import * as moment from 'moment';
import * as filesaver from 'file-saver';
//import * as excel from 'exceljs';
import * as excel from "exceljs/dist/exceljs.js";
import 'chartjs-plugin-zoom';

@Component({
  selector: 'app-bin-image-detail',
  templateUrl: './bin-image-detail.component.html',
  styleUrls: ['./bin-image-detail.component.css']
})
@Injectable()
export class BinImageDetailComponent implements OnInit {
	bin: Bin;
	id: number;
  chart;
  datasets: Data[];
  constructor(private binService : BinService, 
  	private route : ActivatedRoute) { }

  ngOnInit() {
  	this.route.params.subscribe(
  			(params: Params) => {
  				this.id = +params['id'] + 1;
  				this.bin = this.binService.getBin("Location " + this.id);
          var data = new CharData("trap 1", "red");
          this.datasets = new Array();
          for (let trap of this.bin.trap_list) {
            var item = new Data(trap.name, this.dynamicColors());
            var records = trap.records.slice();
            for (let record of records.reverse()) {
              item.addPoint({x : moment(record.newUnixTimeStamp).format('YYYY/MM/DD h:mm:ss a') , y : record.insectCount});
            }
            this.datasets.push(item);
          }
    var ctx = document.getElementById("canvas");
    this.chart = new Chart('canvas', {
      type: 'scatter',
      data: {
          //labels: Array.from(data.set.values()),
            datasets: this.datasets
          },
        options: {
          // Container for pan options
          pan: {
              // Boolean to enable panning
              enabled: true,
       
              // Panning directions. Remove the appropriate direction to disable 
              // Eg. 'y' would only allow panning in the y direction
              mode: 'x',
          },
    
            // Container for zoom options
           zoom: {
                  enabled: true,
                  drag: false,
                  mode: 'x',
                },
            legend: {
              display: true,
            },
            scales: {
              xAxes: [{
                type: 'time',
                //zoomEnable: true,
                distribution: 'series',
                //unit: 'second'
            }],
              yAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Insect Count'
                }
              }],
            }
          }
        });
    }
    );
  }

  dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  createExcel() {
    var workbook = new excel.Workbook();
    for (let trap of this.bin.trap_list) {
      var sheet = workbook.addWorksheet(trap.name);
      var id = 0;
      sheet.columns = [
          { header: 'Id', key: 'id', width: 10 },
          { header: 'time', key: 'time', width: 32 },
          { header: 'Insect Count.', key: 'count', width: 10}
      ];
      for (let record of trap.records) {
        sheet.addRow({id: id, time: record.timestamp, count: record.insectCount});
        id++;
      }
    }

    workbook.xlsx.writeBuffer().then(function (data) {
      var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      filesaver.saveAs(blob, "test.xlsx");
    });
    // var blob = new Blob([JSON.stringify(workbook)], {
    //         type: "application/vnd.ms-excel;charset=charset=utf-8"
    //     })
    // filesaver.saveAs(blob, "test.xlsx");
   // workbook.xlsx.saveFile("test.xlsx");
  }
}
