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
    this.drawPot()
  }

  drawPot(){
    let info = this.getPot()
    let layout = {
      margin: { l: 15, r: 0, b: 20, t: 0 }
    }
    
    Plotly.newPlot("animation", [info], layout, {displayModeBar: false})
    Plotly.newPlot("plot", [info], layout, {displayModeBar: false})
  }

  getPot(){
    let y = []
    let x = []
    if(this.potential === "HO"){
      let dx = 2*this.params.lx/(this.params.ng - 1)
      for(let i = 0; i < this.params.ng; i++){
        let xi = (-this.params.lx + i*dx)
        x.push(xi)
        y.push(0.5*this.params.omega*this.params.omega*xi*xi)
      }
    }else if(this.potential === "DW"){
      let dx = 2*this.params.lx/(this.params.ng - 1)
      for(let i = 0; i < this.params.ng; i++){
        let xi = (-this.params.lx + i*dx)
        x.push(xi)
        y.push(0.5*this.params.omega*this.params.omega*xi*xi +0.5*this.params.omega*this.params.omega*(0.25*this.params.R*this.params.R - this.params.R*Math.abs(xi)))
      }
    }
    return { x: x, y: y }
  }

  onSetPotential(potential){
    if(potential === "HO"){
      this.potential = "HO"
      this.params.omega = 1

    }else if(potential === "DW"){
      this.potential = "DW"
      this.params.omega = 1
      this.params.R = 2
    }
    this.drawPot()
  }

  onLxUp(){
    this.params.lx += 1
  }
  onLxDown(){
    this.params.lx -= this.params.lx > 1 ? 1 : 0
  }
  onNgUp(){
    this.params.ng += this.params.ng < 2000 ? 25 : 0
  }
  onNgDown(){
    this.params.ng -= this.params.ng > 100 ? 25 : 0
  }
  onNstatesUp(){
    if(this.params.nstates < 12){
      this.params.nstates += 1 
      this.params.coeffs.push(0)
    }
  }
  onNstatesDown(){
    if(this.params.nstates > 1){
      this.params.nstates -= 1 
      this.params.coeffs.pop(0)
    }
  }
  onTfinalUp(){
    this.params.tfinal += this.params.tfinal < 100 ? 0.25 : 0
  }
  onTfinalDown(){
    this.params.tfinal -= this.params.tfinal > 5 ? 0.25 : 0
  }
  onDtUp(){
    this.params.dt += this.params.dt < 1 ? 0.01 : 0
  }
  onDtDown(){
    this.params.dt -= this.params.dt > 0.02 ? 0.01 : 0
  }
  onOmegaUp(){
    this.params.omega += this.params.omega < 10 ? 0.05 : 0
  }
  onOmegaDown(){
    this.params.omega -= this.params.omega > 0.05 ? 0.05 : 0
  }
  onRUp(){
    this.params.R += this.params.R < 10 ? 0.05 : 0
  }
  onRDown(){
    this.params.R -= this.params.R > 0.1 ? 0.05 : 0
  }
  onCUp(i){
    this.params.coeffs[i] += 0.1
  }
  onCDown(i){
    this.params.coeffs[i] -= 0.1
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
      this.eigenFunctions(info["x"], info["potential"], info["eigFuncs"])
      this.animation(info["x"], info["potential"], info["animation"])
    })
  }

  eigenFunctions(x, potential, eigFuncs){        
    let data = []
    eigFuncs.forEach((psi, i) => {
      data.push({
        x: x,
        y: psi,
        name: `Psi${i+1}`,
        type: 'lines'
      })
    })

    data.push({
      x: x,
      y: potential,
      name: "V(x)",
      type: 'lines'
    })
    
    let layout = {
      margin: { l: 20, r: 10, b: 20, t: 30 },
      legend: {
        x: 0,
        y: 1
      },
      xaxis: {
        range: [x[0], x[x.length - 1]],
        autorange: false,
      },
      yaxis: {
        //range: [0, 1],
        autorange: true
      },
    }
    
    Plotly.newPlot("plot", data, layout, {displayModeBar: false})
  }

  animation(x, potential, psis){
    
    let nFrames = psis.length
    
    for (let i = 0; i < nFrames; i++) {
      this.frames.push({
        data: [{x: x, y: psis[i]}, {x: x, y: potential}, {x: x, y: psis[0]}]
      })
    }

    let trace1 = {
      x: this.frames[0].data[0].x,
      y: this.frames[0].data[0].y,
      mode: 'lines',
      name: "|Psi(x,t)|^2",
      line: {simplify: false}
    }

    let trace2 = { 
      x: this.frames[0].data[1].x, 
      y: this.frames[0].data[1].y,
      name: "V(x)",
      mode: 'lines',
    }

    let trace3 = {
      x: this.frames[0].data[2].x, 
      y: this.frames[0].data[2].y,
      name: "|Psi(x,0)|^2",
      mode: 'lines',
    }

    let data = [trace1, trace2, trace3]
    
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
    Plotly.animate('animation', this.frames, layout, {displayModeBar: false})
  }
}
