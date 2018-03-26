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
  alpha = 0.7
  L = 1
  V = 15
  x = -4
  p = 7

  

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    let layout = { margin: { l: 20, r: 10, b: 20, t: 10 } }
    Plotly.newPlot('animation', [], layout)
  }

  ngOnDestroy(){
    if(this.connection){
      this.connection.unsubscribe()
    }
  }

  onVUp(){
    this.V += this.V < 100 ? 5 : 0
  }
  onVDown(){
    this.V -= this.V > 10 ? 5 : 0
  }
  onpUp(){
    this.p += this.p < 15 ? 0.5 : 0
    this.p = this.p > 15 ? 15 : this.p
  }
  onpDown(){
    this.p -= this.p > -15 ? 0.5 : 0
    this.p = this.p < -15 ? -15 : this.p
  }
  onLUp(){
    this.L += this.L < 3 ? 0.2 : 0
    this.L = this.L > 3 ? 3 : this.L
  }
  onLDown(){
    this.L -= this.L > 0.2 ? 0.2 : 0
    this.L = this.L < 0.2 ? 0.2 : this.L
  }
  onxUp(){
    this.x += this.x < 7 ? 0.5 : 0
    this.x = this.x > 7 ? 7 : this.x
  }
  onxDown(){
    this.x -= this.x > -7 ? 0.5 : 0
    this.x = this.x < -7 ? -7 : this.x
  }
  onalphaUp(){
    this.alpha += this.alpha < 2 ? 0.1 : 0
    this.alpha = this.alpha > 2 ? 2 : this.alpha
  }
  onalphaDown(){
    this.alpha -= this.alpha > 0.1 ? 0.1 : 0
    this.alpha = this.alpha < 0.1 ? 0.1 : this.alpha
  }

  onGetSimulation(){
    let simInfo = {
      simulationType: this.type,
      params: {
        L: this.L,
        p: this.p,
        alpha: this.alpha,
        x: this.x,
        V: this.V
      }
    }
    this.connection = this.socketService.getSim("quantum simulation", simInfo).subscribe((info) => {  
      this.connection.unsubscribe()
      this.animation(info)
    })
  }

  animation(info){
    let psis = info["psi_t"]
    let x = info["x"]
    let potential = info["V"]

    let frames = []
    
    for (let i = 0; i < psis.length; i++) {
      frames.push({
        data: [{x: x, y: psis[i]}, {x: x, y: potential}]
      })
    }

    let initTrace = {
      x: frames[0].data[0].x,
      y: frames[0].data[0].y,
      mode: 'lines',
      name: "Psi",
      line: {simplify: false}
    }

    let potTrace = { 
      x: frames[0].data[1].x, 
      y: frames[0].data[1].y,
      name: "V(x)",
      mode: 'lines',
    }

    let data = [initTrace, potTrace]
    
    let layout = {
      xaxis: {range: [x[0], x[x.length - 1]]},
      yaxis: {range: [0, 1]},
      margin: {l: 20, r: 10, b: 20, t: 30},
      transition: {duration: 50,easing: 'linear'},
      frame: {duration: 50,redraw: false},
      mode: "immediate",
      legend: {
        x: 0,
        y: 1
      }
    }

    Plotly.newPlot('animation', data, layout, {displayModeBar: false})
    Plotly.animate('animation', frames, layout, {displayModeBar: false})
  }

}
