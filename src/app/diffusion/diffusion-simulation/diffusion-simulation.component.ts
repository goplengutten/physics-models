import { Component, OnInit, OnDestroy } from '@angular/core';

import * as Plotly from 'plotly.js';
import { SocketService } from '../../socket.service';
import { DiffusionSimulationService } from './diffusion-simulation.service';

@Component({
  selector: 'app-diffusion-simulation',
  templateUrl: './diffusion-simulation.component.html',
  styleUrls: ['./diffusion-simulation.component.css'],
  providers: [
    SocketService,
    DiffusionSimulationService
  ]
})

export class DiffusionSimulationComponent implements OnInit, OnDestroy {
  socketConnection
  serviceConnection

  constructor(
    private socketService: SocketService,
    private simSer: DiffusionSimulationService
  ) { 
    this.serviceConnection = this.simSer.getSim.subscribe(() => {
      this.getSimulation()
    })
   }

  getSimulation(){
    this.simSer.loading = true
    this.socketConnection = this.socketService.getSim("diffusion simulation", { heatmap: this.simSer.heatmap, sources: this.simSer.sources }).subscribe((info) => {  
      this.simSer.loading = false
      this.simSer.index = 0
      this.simSer.simulation = info
      this.socketConnection.unsubscribe()
      this.simSer.onReset()
    })
  }

  ngOnInit() {

  }
  
  ngOnDestroy(){
    this.simSer.animating = false
    this.simSer.simulation = null
    this.serviceConnection.unsubscribe()
    if(this.socketConnection){
      this.socketConnection.unsubscribe()
    }
  }
}