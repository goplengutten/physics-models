import { Component, OnInit, OnDestroy } from '@angular/core';

import * as Plotly from 'plotly.js';
import { DiffusionSimulationService } from '../diffusion-simulation.service';


@Component({
  selector: 'app-diffusion-animation',
  templateUrl: './diffusion-animation.component.html',
  styleUrls: ['./diffusion-animation.component.css']
})
export class DiffusionAnimationComponent implements OnInit, OnDestroy {

  drawConnection 
  animateConnection

  constructor(private simSer: DiffusionSimulationService) { 
    this.drawConnection = this.simSer.draw.subscribe(() => {
      this.draw()
    })
    this.animateConnection = this.simSer.animate.subscribe(() => {
      this.animate()
    })
   }

  ngOnInit() {
    let layout = {
      margin: { l: 20, r: 10, b: 20, t: 10 },
      xaxis: {range: [0, 1]},
      yaxis: {range: [0, 1]}
    }
    Plotly.newPlot("animation", [], layout)
  }

  ngOnDestroy(){
    this.drawConnection.unsubscribe()
    this.animateConnection.unsubscribe()
  }

  animate(){
    if(!this.simSer.animating){
      return
    }else if(this.simSer.index >= this.simSer.simulation.ut.length){
      this.simSer.animating = false
      this.simSer.index = 0
      return
    }
    this.draw()
    this.simSer.index++
    setTimeout(() => {
      this.animate()
    }, 50)
  }

  draw(){
    let layout = {
      margin: { l: 20, r: 10, b: 20, t: 10 },
      xaxis: {range: [this.simSer.simulation.x[0], this.simSer.simulation.x[this.simSer.simulation.x.length - 1]]},
      yaxis: {range: [this.simSer.simulation.y[0], this.simSer.simulation.y[this.simSer.simulation.y.length - 1]]},
    }

    let data = [{
      x: this.simSer.simulation.x,
      y: this.simSer.simulation.y,
      z: this.simSer.simulation.ut[this.simSer.index],
      type: 'heatmap',
      colorscale: 'Jet',
      zmin: 0,
      zmax: 1,
      zsmooth: "fast"
    }]

    Plotly.newPlot('animation', data, layout)
  }
}
