import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Plotly from 'plotly.js';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-solar-simulation',
  templateUrl: './solar-simulation.component.html',
  styleUrls: ['./solar-simulation.component.css'],
  providers: [SocketService]
})

export class SolarSimulationComponent implements OnInit, OnDestroy {
  loading = false
  connection
  name
  names
  simulation
  planets
  frames = []

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.getSystem("The Solar System")
    let layout = {
      margin: { l: 20, r: 10, b: 20, t: 10 },
      xaxis: {range: [-2, 2]},
      yaxis: {range: [-1.5, 1.5]}
    }
    Plotly.newPlot("animation", [], layout)
  }

  ngOnDestroy(){
    if(this.connection){
      this.connection.unsubscribe()
    }
  }

  getSystem(name){
    let connection = this.socketService.getSystem(name).subscribe((info) => {
      this.name = info["name"]
      this.planets = info["planets"].slice()
      this.planets.forEach((planet) => {
        planet.show = true
      })
        
      connection.unsubscribe()
    })
  }

  onMassUp(i){
    this.planets[i].mass *= 1.05
  }
  onMassDown(i){
    this.planets[i].mass *= 0.95
  }

  onGetSimulation(){
    this.loading = true
    let chosenPlanets = this.planets.filter((planet) => planet.show)
    this.names = chosenPlanets.map((planet) => planet.name)
    this.connection = this.socketService.getSim("solar simulation", chosenPlanets).subscribe((info) => {  
      this.loading = false
      this.simulation = info

      
      this.connection.unsubscribe()
      this.animation()
    })
  }
  animation(){
    this.frames = []
    let nFrames = this.simulation.length

    for (let i = 0; i < nFrames; i++) {
      this.frames.push({
        data: [{x: this.simulation[i].x, y: this.simulation[i].y}],
      })
    }    

    let trace = [{
      x: this.frames[0].data[0].x,
      y: this.frames[0].data[0].y,
      mode: 'markers+text',
      showlegend: false,
      text: this.names,
      textposition: 'top center'
    }]

    let layout = {
      margin: { l: 20, r: 10, b: 20, t: 10 },
      xaxis: {range: [-2, 2]},
      yaxis: {range: [-1.5, 1.5]},
      transition: {
        duration: 2,
        easing: 'linear'
      },
      frame: {
        duration: 2,
        redraw: false,
      },
      mode: "immediate"
    }

    Plotly.newPlot('animation', trace, layout)
    Plotly.animate('animation', this.frames, layout)
  }
}