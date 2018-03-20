import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as Plotly from 'plotly.js';
import { SocketService } from '../../socket.service';


@Component({
  selector: 'app-quantum-simulation',
  templateUrl: './quantum-simulation.component.html',
  styleUrls: ['./quantum-simulation.component.css'],
  providers: [SocketService]
})

export class QuantumSimulationComponent implements OnInit {
  
  type: string
  potential: string
  params

  frames

  constructor(private route: ActivatedRoute, private socketService: SocketService) { }

  ngOnInit() {
    this.type = this.route.snapshot.params["type"]
    this.potential = "HO"
    this.params = {
      lx: 4,
      ng: 200,
      omega: 1,
      nstates: 4,
      dt: 0.1,
      tfinal: 10,
      coeffs: [1,0,0,0]
    }
  }

  onSetPotential(potential){
    this.params = {
      lx: 4,
      ng: 200,
      nstates: 4,
      dt: 0.1,
      tfinal: 10,
      coeffs: [1,0,0,0]
    }

    if(potential === "HO"){
      this.potential = "HO"
      this.params.omega = 1

    }else if(potential === "DW"){
      this.potential = "DW"
      this.params.omega = 1
      this.params.R = 2
    }
  }

  onAdjustParam(type, direction){
    console.log(typeof type)
    if(type === "lx"){
      if(direction === "up"){
        this.params.lx += 1
      }else{
        if(this.params.lx >= 2){
          this.params.lx -= 1 
        }
      }
    }else if(type === "ng"){
      if(direction === "up"){
        if(this.params.ng <= 2000){
          this.params.ng += 25
        }
      }else{
        if(this.params.ng >= 125){
          this.params.ng -= 25
        }
      }
    }else if(type === "nstates"){
      if(direction === "up"){
        if(this.params.nstates < 9){
          this.params.nstates += 1
          this.params.coeffs.push(0)
        }
      }else{
        if(this.params.nstates > 1){
          this.params.nstates -= 1
          this.params.coeffs.pop()
        }
      }
    }else if(type === "tfinal"){
      if(direction === "up"){
        if(this.params.tfinal < 100){
          this.params.tfinal += 0.25
        }
      }else{
        if(this.params.tfinal > 0.25){
          this.params.tfinal -= 0.25
        }
      }
    }else if(type === "dt"){
      if(direction === "up"){
        if(this.params.dt < 1){
          this.params.dt += 0.01
        }
      }else{
        if(this.params.dt > 0.01){
          this.params.dt -= 0.01
        }
      }
    }else if(type === "omega"){
      if(direction === "up"){
        if(this.params.omega < 10){
          this.params.omega += 0.05
        }
      }else{
        if(this.params.omega > 0.05){
          this.params.omega -= 0.05
        }
      }
    }else if(type === "R"){
      if(direction === "up"){
        if(this.params.R < 10){
          this.params.R += 0.1
        }
      }else{
        if(this.params.R > 0.1){
          this.params.R -= 0.1
        }
      }
    }else if(typeof type === "number"){
      if(direction === "up"){
        this.params.coeffs[type] += 0.1
      }else{
        this.params.coeffs[type] -= 0.1
      }
    }
    
  }

  onGetSimulation(){
    this.frames = []

    let simInfo = {
      simulationType: this.type,
      potential: this.potential,
      params: this.params
    }

    let connection = this.socketService.requestQuantum(simInfo).subscribe((info) => {  
      connection.unsubscribe()
      Plotly.purge("plot")
      Plotly.purge("animation")
      setTimeout(() => {
        this.eigenFunctions(info["x"], info["potential"], info["eigFuncs"])
        this.animation(info["x"], info["potential"], info["animation"])
      }, 1000)
    })
  }


  onRestartAnim(){
    this.startAnimation()
  }
  
  eigenFunctions(x, potential, eigFuncs){        
    let data = []
    eigFuncs.forEach((psi, i) => {
      data.push({
        x: x,
        y: psi,
        name: `Psi${i+1}`,
        type: 'scatter'
      })
    })

    data.push({
      x: x,
      y: potential,
      name: "V(x)",
      type: 'scatter'
    })
    
    let layout = {
      title: "Eigenfunctions",
      xaxis: {
        range: [x[0], x[x.length - 1]],
        autorange: false
      },
      yaxis: {
        range: [0, 1],
        autorange: false
      },
    }
    Plotly.plot("plot", data, layout)
  }

  animation(x, potential, psis){
    
    let nFrames = psis.length
    
    for (let i = 0; i < nFrames; i++) {
      this.frames.push({
        data: [{x: x, y: psis[i]}],
      })
    }

    Plotly.plot('animation', [{
      x: this.frames[0].data[0].x,
      y: this.frames[0].data[0].y,
      mode: 'lines',
      showlegend: false,
      line: {simplify: false}
    }], {
      xaxis: {range: [x[0], x[x.length - 1]]},
      yaxis: {range: [0, 1]}
    })
    this.startAnimation()
  }

  stopAnimation () {
    Plotly.animate('animation', [], {mode: 'next'})
  }
  
  startAnimation () {
    Plotly.animate('animation', this.frames, {
      transition: {
        duration: 50,
        easing: 'linear'
      },
      frame: {
        duration: 50,
        redraw: false,
      },
      mode: "immediate"
    })
  }
}
