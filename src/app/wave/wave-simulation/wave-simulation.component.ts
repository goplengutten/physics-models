import { Component, OnInit, OnDestroy } from '@angular/core';


import * as Plotly from 'plotly.js';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-wave-simulation',
  templateUrl: './wave-simulation.component.html',
  styleUrls: ['./wave-simulation.component.css'],
  providers: [SocketService]
})
export class WaveSimulationComponent implements OnInit, OnDestroy {

  loading = false
  connection
  index
  simulation

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    let layout = {
      margin: { l: 20, r: 10, b: 20, t: 10 },
      xaxis: {range: [0, 1]},
      yaxis: {range: [0, 1]}
    }
    Plotly.newPlot("animation", [], layout)
  }

  ngOnDestroy(){
    if(this.connection){
      this.connection.unsubscribe()
    }
  }

  getSimulation(){
    this.loading = true
    this.connection = this.socketService.getSim("wave simulation", { test: "test" }).subscribe((info) => {  
      this.loading = false
      this.index = 0
      this.simulation = info
      this.connection.unsubscribe()
      this.animate()
    })
  }

  animate(){
    let layout = {
      margin: { l: 20, r: 10, b: 20, t: 10 },
      xaxis: {range: [this.simulation.x[0], this.simulation.x[this.simulation.x.length - 1]]},
      yaxis: {range: [this.simulation.y[0], this.simulation.y[this.simulation.y.length - 1]]},
    }

    let data = [{
      x: this.simulation.x,
      y: this.simulation.y,
      z: this.simulation.ut[this.index],
      type: 'contour',
      colorscale: 'Jet',
    }]

    this.draw(layout, data)
  }
  draw(layout, data){
    if(this.index >= this.simulation.ut.length){
      return
    }
    Plotly.newPlot('animation', data, layout)
    this.index++
    setTimeout(() => {
      this.animate()
    }, 50)

  }

}
