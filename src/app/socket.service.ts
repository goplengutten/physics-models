import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from "rxjs/Observable"
import { Subject } from "rxjs/Subject"

@Injectable()
export class SocketService {

  private url = "http://localhost:3000"

  requestQuantum(params: object){
    let simulation = ""

    let stringified = JSON.stringify(params)
    
    let observable = new Observable(observer => {
      let socket = io(this.url)

      
      socket.emit("quantum simulation", stringified)

      socket.on("streaming info", (data) => {
        simulation += data
      })
      socket.on("complete", () => {
        simulation = JSON.parse(simulation)
        
        observer.next(simulation)
      })
      return () => { socket.disconnect() }
    })  
    return observable
  }

  getPlanets(){
    let observable = new Observable(observer => {
      let socket = io(this.url)

      socket.emit("get planets")

      socket.on("planets", (data) => {
        let planets = JSON.parse(data)
        observer.next(planets)
      })
      return () => { socket.disconnect() }
    })  
    return observable
  }

  solarSim(params: object){
    let simulation = ""

    let stringified = JSON.stringify(params)
    
    let observable = new Observable(observer => {
      let socket = io(this.url)

      
      socket.emit("solar simulation", stringified)

      socket.on("streaming info", (data) => {
        simulation += data
      })
      socket.on("complete", () => {
        simulation = JSON.parse(simulation)
        
        observer.next(simulation)
      })
      return () => { socket.disconnect() }
    })  
    return observable
  }
}

