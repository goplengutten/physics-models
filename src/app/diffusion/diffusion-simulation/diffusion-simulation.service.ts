import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DiffusionSimulationService {

  animating = false
  loading = false
  connection
  simulation
  index = 0
  temp = 4
  dim = 30
  heatmap = []
  sources = []
  type = "initial"

  constructor(){
    
  }

  getSim = new EventEmitter<any>()
  animate = new EventEmitter<any>()
  draw = new EventEmitter<any>()

  onStop(){
    this.animating = false
  }
  onReset(){
    this.index = 0
    this.draw.emit()
  }
  onStart(){
    this.animating = true
    this.animate.emit()
    
  }

  onSimulate(){
    this.getSim.emit()
  }

  onHeatUp(){
    this.temp += this.temp < 10 ? 1 : 0
  }

  onHeatDown(){
    this.temp -= this.temp > 0 ? 1 : 0
  }
}

