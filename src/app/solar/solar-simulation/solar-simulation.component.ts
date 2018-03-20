import { Component, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-solar-simulation',
  templateUrl: './solar-simulation.component.html',
  styleUrls: ['./solar-simulation.component.css'],
  providers: [SocketService]
})

export class SolarSimulationComponent implements OnInit {
  status = "choosing"
  preDefinedPlanets
  simulation
  chosenPlanets = []
  frames = []

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    let connection = this.socketService.getPlanets().subscribe((info) => { 
      this.preDefinedPlanets = info 
      connection.unsubscribe()
    })
  }

  onGetSimulation(){
    this.status = "loading"
    let connection = this.socketService.solarSim(this.preDefinedPlanets).subscribe((info) => {  
      this.status = "simulating"
      this.simulation = info
      connection.unsubscribe()
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
    Plotly.plot('animation', [{
      x: this.frames[0].data[0].x,
      y: this.frames[0].data[0].y,
      mode: 'markers',
      showlegend: false    
    }], {
      xaxis: {range: [-50, 50]},
      yaxis: {range: [-50, 50]},
      width: 800,
      height: 800,
    })
    this.startAnimation()
  }


  startAnimation () {
    Plotly.animate('animation', this.frames, {
      transition: {
        duration: 2,
        easing: 'linear'
      },
      frame: {
        duration: 2,
        redraw: false,
      },
      mode: "immediate"
    })
  }
}