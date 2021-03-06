import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/data.service';
import { DHT } from '../interfaces/DHT';

import {ViewChild } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {formatDate} from '@angular/common';

interface Room {
  value: string;
  viewValue: string;
}



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {
  errorMessage: any;
  loading: boolean = false;
  sensor!: string;
  response = [];
  
  rooms: Room[] = [
    {value: 'strych/dht', viewValue: 'Strych'},
    {value: 'pokoj/dht', viewValue: 'Pokoj'}
  ];

  data: DHT[] = [];
  temperature: number[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.sensor = 'strych/dht';
    this.getData();
  }

  changeValue(value:any){
   
    this.sensor = value.value;
    this.getData();
    this.lineChartData.labels = this.data.map(a => formatDate(new Date(a.time), 'medium', 'pl-PL'));
    this.lineChartData.datasets[0].data = this.data.map(a => a.temperature);
    this.lineChartData.datasets[1].data = this.data.map(a => a.humidity);

    this.chart?.update();

  }

  filterByTime(value:any){
    this.getData();
    var currentTime = new Date();
    var numberOfMlSeconds = currentTime.getTime();
    var addMlSeconds = (value * 60) * 60 * 1000;
    var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);

    var isoDateString = newDateObj.toISOString();

    
    console.log(this.data);
    var test = this.data.filter(
      a => a.time > isoDateString);

    this.lineChartData.labels = test.map(a => formatDate(new Date(a.time), 'medium', 'pl-PL'));
    this.lineChartData.datasets[0].data = test.map(a => a.temperature);
    this.lineChartData.datasets[1].data = test.map(a => a.humidity);
    this.chart?.update();
  }



  public getData() {
    this.loading = true;
    this.errorMessage = "";
    this.dataService.getAllData(this.sensor)
      .subscribe(
        (response) => {                           //next() callback
          console.log('response received')
          this.response = response; 
          this.data = response;
         
        },
        (error) => {                              //error() callback
          console.error('Request failed with error')
          this.errorMessage = error;
          this.loading = false;
        },
        () => {                                   //complete() callback
          console.log('Request completed')      //This is actually not needed 
          this.loading = false; 
        })
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Temperatura',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin'
      },
      {
        data: [],
        label: 'Wilgotnosc',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin',
      },
      // {
      //   data: [ 180, 480, 770, 90, 1000, 270, 400 ],
      //   label: 'Series C',
      //   yAxisID: 'y-axis-1',
      //   backgroundColor: 'rgba(255,0,0,0.3)',
      //   borderColor: 'red',
      //   pointBackgroundColor: 'rgba(148,159,177,1)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      //   fill: 'origin',
      // }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
        {
          position: 'left',
        },
      //   },
      // 'y-axis-1': {
      //   position: 'right',
      //   grid: {
      //     color: 'rgba(255,0,0,0.3)',
      //   },
      //   ticks: {
      //     color: 'red'
      //   }
      // }
    },

    // plugins: {
    //   legend: { display: true },
    //   annotation: {
    //     annotations: [
    //       {
    //         type: 'line',
    //         scaleID: 'x',
    //         value: 'March',
    //         borderColor: 'orange',
    //         borderWidth: 2,
    //         label: {
    //           position: 'center',
    //           enabled: true,
    //           color: 'orange',
    //           content: 'LineAnno',
    //           font: {
    //             weight: 'bold'
    //           }
    //         }
    //       },
    //     ],
    //   }
    // }
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private static generateNumber(i: number): number {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  public randomize(): void {
    for (let i = 0; i < this.lineChartData.datasets.length; i++) {
      for (let j = 0; j < this.lineChartData.datasets[i].data.length; j++) {
        this.lineChartData.datasets[i].data[j] = HomeComponent.generateNumber(i);
      }
    }
    this.chart?.update();
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public hideOne(): void {
    const isHidden = this.chart?.isDatasetHidden(1);
    this.chart?.hideDataset(1, !isHidden);
  }

  public pushOne(): void {
    this.lineChartData.datasets.forEach((x, i) => {
      const num = HomeComponent.generateNumber(i);
      x.data.push(num);
    });
    this.lineChartData?.labels?.push(`Label ${ this.lineChartData.labels.length }`);

    this.chart?.update();
  }

  public changeColor(): void {
    this.lineChartData.datasets[2].borderColor = 'green';
    this.lineChartData.datasets[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;

    this.chart?.update();
  }

  public changeLabel(): void {
    if (this.lineChartData.labels) {
      this.lineChartData.labels[2] = [ '1st Line', '2nd Line' ];
    }

    this.chart?.update();
  }


}
