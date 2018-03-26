import { Component, OnInit } from '@angular/core';
import { DiffusionSimulationService } from "../diffusion-simulation.service"

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})

export class HeatmapComponent implements OnInit {
  numbers
  holding = false

  constructor(private simSer: DiffusionSimulationService){ }

  ngOnInit(){
    this.numbers = Array(this.simSer.dim).fill(0)
    for(let j = 0; j < this.simSer.dim; j++){
      let row = []
      for(let i = 0; i < this.simSer.dim; i++){
        row.push(this.simSer.temp/10)
      }
      this.simSer.heatmap.push(row)
    }
  }

  color() {
    if(this.simSer.temp < 1) return "#00008B"
    if(this.simSer.temp < 2) return "#0000CD"
    if(this.simSer.temp < 3) return "#4169E1"
    if(this.simSer.temp < 4) return "#009FFF"
    if(this.simSer.temp < 5) return "#00FFFF"
    if(this.simSer.temp < 6) return "#5FFF00"
    if(this.simSer.temp < 7) return "#FFFF00"
    if(this.simSer.temp < 8) return "#FF9500"
    if(this.simSer.temp < 9) return "#FF6C00"
    if(this.simSer.temp < 10) return "#FF0000"
    return "#B22222"
  }
  clicked(event, i, j){
    this.handleClick(event, i, j)
  }
  onHover(event, i, j){
    if(this.holding){
     this.handleClick(event, i, j)
    }
  }
  handleClick(event, i, j){
    event.target.style.backgroundColor = this.color()
    this.simSer.heatmap[i][j] = this.simSer.temp/10
    if(this.simSer.type === "source"){

      event.target.style.border = "solid 1px black"

      let source = this.simSer.sources.find((source) => source[0] === i && source[1] === j)
      if(!source){
        this.simSer.sources.push([i,j])
      }
      
    }else{

      event.target.style.border = "solid 1px rgba(0,0,0,0)"

      for(let k = 0; k < this.simSer.sources.length; k++){
        if(this.simSer.sources[k][0] === i && this.simSer.sources[k][1] === j){
          this.simSer.sources.splice(k, 1)
        }
      }  
    }
  }
}

