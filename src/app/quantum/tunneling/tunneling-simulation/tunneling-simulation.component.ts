import { Component, OnInit } from '@angular/core';

import * as Plotly from 'plotly.js';
import { SocketService } from '../../../socket.service';

@Component({
  selector: 'app-tunneling-simulation',
  templateUrl: './tunneling-simulation.component.html',
  styleUrls: ['./tunneling-simulation.component.css'],
  providers: [SocketService]
})

export class TunnelingSimulationComponent implements OnInit {

  connection
  type: string = "tunneling"
  simulation
  index = 0

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    let layout = {
      margin: { l: 20, r: 10, b: 20, t: 10 },
    }

    Plotly.newPlot('animation', [], layout)
  }

  ngOnDestroy(){
    if(this.connection){
      this.connection.unsubscribe()
    }
  }

  onGetSimulation(){
    let simInfo = {
      simulationType: this.type,
      params: {
        a: "1"
      }
    }
    this.connection = this.socketService.getSim("quantum simulation", simInfo).subscribe((info) => {  
      this.simulation = info
      this.connection.unsubscribe()
      this.animate()
    })
  }

  animate(){
    let layout = {
      margin: { l: 20, r: 10, b: 20, t: 10 },
      xaxis: { range: [this.simulation.x[0], this.simulation.x[this.simulation.x.length - 1]] },
      yaxis: { range: [0, 1.5] }
    }


    let trace1 = {
      x: this.simulation.x,
      y: this.simulation.V,
      name: "V(x)",
      type: 'lines'
    }
    
    let trace2 = {
      x: this.simulation.x,
      y: this.simulation.psi_t[this.index],
      type: 'lines'
    }

    this.draw(layout, [trace1, trace2])
  }


  draw(layout, data){
    if(this.index >= this.simulation.psi_t.length){
      return
    }
    Plotly.newPlot('animation', data, layout)
    this.index++
    setTimeout(() => {
      this.animate()
    }, 50)

  }

}
