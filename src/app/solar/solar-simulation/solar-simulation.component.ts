import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Plotly from 'plotly.js';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-solar-simulation',
  templateUrl: './solar-simulation.component.html',
  styleUrls: ['./solar-simulation.component.css'],
  providers: [SocketService]
})

export class SolarSimulationComponent implements OnInit, OnDestroy {
  loading = false
  preDefinedPlanets
  simulation
  chosenPlanets = []
  frames = []
  connection


  constructor(private socketService: SocketService) { }

  ngOnInit() {
    let connection = this.socketService.getPlanets().subscribe((info) => { 
      this.preDefinedPlanets = info 
      connection.unsubscribe()
    })
    let layout = {
      margin: { l: 0, r: 0, b: 0, t: 0 }
    }
    Plotly.newPlot("animation", [], layout)
  }

  ngOnDestroy(){
    if(this.connection){
      this.connection.unsubscribe()
    }
  }

  onGetSimulation(){
    this.loading = true
    this.connection = this.socketService.solarSim(this.preDefinedPlanets).subscribe((info) => {  
      this.loading = false
      this.simulation = info
      this.connection.unsubscribe()
      this.animation()
    })
  }
  animation(){

    let nFrames = this.simulation.length

    for (let i = 0; i < nFrames; i++) {
      this.frames.push({
        data: [{x: this.simulation[i].x, y: this.simulation[i].y}],
      })
    }    

    let trace = {
      x: this.frames[0].data[0].x,
      y: this.frames[0].data[0].y,
      mode: 'markers',
      showlegend: false    
    }

    let layout = {
      xaxis: {range: [-50, 50]},
      yaxis: {range: [-50, 50]},
      transition: {
        duration: 2,
        easing: 'linear'
      },
      frame: {
        duration: 2,
        redraw: false,
      },
      mode: "immediate"
    }

    Plotly.plot('animation', [trace], layout)
    Plotly.animate('animation', this.frames, layout)
  }
}