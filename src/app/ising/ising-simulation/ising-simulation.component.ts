import { Component, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js';

@Component({
  selector: 'app-ising-simulation',
  templateUrl: './ising-simulation.component.html',
  styleUrls: ['./ising-simulation.component.css']
})
export class IsingSimulationComponent implements OnInit {

  simulating = false

  constructor() { }

  onHUp(){
    this.H += this.H < 2 ? 0.01 : 0
  }
  onHDown(){
    this.H -= this.H > -2 ? 0.01 : 0
  }

  onTimeUp(){
    this.time += this.time < 200 ? 1 : 0
  }
  onTimeDown(){
    this.time -= this.time > 5 ? 1 : 0
  }

  onTempUp(){
    this.temp += this.temp < 5 ? 0.01 : 0
  }
  onTempDown(){
    this.temp -= this.temp > 0 ? 0.01 : 0
  }

  /*
  ========== ISING ============
  */
  counter
  temp
  time
  H
  n_spins
  spin_matrix
  E
  M
  avgM
  avgE

 
  ngOnInit(){
    this.initialize()
  }

  //function for periodic boundary conditions
  periodic(i,limit,add){
    return (i + limit + add) % limit
  }

  metropolis(){

    // loop over all spins
    for(let y = 0; y < this.n_spins; y++){
      for(let x = 0; x < this.n_spins; x++){
        
        let ix = Math.floor(Math.random() * this.n_spins)
        let iy = Math.floor(Math.random() * this.n_spins)
        
        let deltaE =  2*this.spin_matrix[iy][ix]*(this.spin_matrix[iy][this.periodic(ix, this.n_spins, -1)] + 
                      this.spin_matrix[this.periodic(iy, this.n_spins, -1)][ix] + 
                      this.spin_matrix[iy][this.periodic(ix, this.n_spins, 1)] + 
                      this.spin_matrix[this.periodic(iy, this.n_spins, 1)][ix] +
                      this.H)
        if(deltaE < 0 || Math.random() <= Math.exp(-deltaE/this.temp)){
          this.spin_matrix[iy][ix] *= -1  // flip one spin and accept new spin config
          this.M += 2*this.spin_matrix[iy][ix]
          this.E += deltaE
        }          
      }
    }
    this.avgM += this.M
    this.avgE += this.E
    

  }

  start(){
    this.simulating = true
    this.animate()
  }

  stop(){
    this.simulating = false
  }

  initialize(){ 
    this.counter = 0
    this.temp = 2.27
    this.time = 40
    this.H = 0
    this.n_spins = 64
    this.spin_matrix = []
    this.E = 0
    this.M = 0
    this.avgM = 0
    this.avgE = 0


    for(let i = 0; i < this.n_spins; i++){
      this.spin_matrix.push(Array(this.n_spins).join('0').split('').map(parseFloat))
    }

    // setup spin matrix and intial magnetization
    for(let y = 0; y < this.n_spins; y++){
      for(let x = 0; x < this.n_spins; x++){
        this.spin_matrix[y][x] = Math.random() >= 0.5 ? 1 : -1
        this.M += this.spin_matrix[y][x]   
      }
    }

    for(let y = 0; y < this.n_spins; y++){
      for(let x = 0; x < this.n_spins; x++){
        this.E -= this.spin_matrix[y][x]*(this.spin_matrix[this.periodic(y, this.n_spins, -1)][x] + this.spin_matrix[y][this.periodic(x, this.n_spins, -1)])
      }
    }
    
    this.plot()
  }

  animate(){
    this.plot()
    this.metropolis()


    setTimeout(() => {
      if(this.simulating){
        this.animate()
      }
    }, this.time)
  
  }

  plot(){
    let layout = {
      width: 500,
      height: 500,
      margin: { l: 0, r: 0, t: 0, b: 0 }
    }

    let data = [{
      z: this.spin_matrix,
      type: 'heatmap',
      showscale: false,
      colorscale: "YlOrRd"
    }]
    this.counter++
    Plotly.newPlot('animation', data, layout)
  }
}
