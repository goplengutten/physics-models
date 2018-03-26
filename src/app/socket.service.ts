import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from "rxjs/Observable"
import { Subject } from "rxjs/Subject"

@Injectable()
export class SocketService {


  getSim(type: string, params: object){
    let simulation = ""

    let stringified = JSON.stringify(params)
    
    let observable = new Observable(observer => {
      let socket = io()

      
      socket.emit(type, stringified)

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

  getSystem(name){
    let observable = new Observable(observer => {
      let socket = io()

      socket.emit("get system", name)

      socket.on("system", (data) => {
        let system = JSON.parse(data)
        observer.next(system)
      })
      return () => { socket.disconnect() }
    })  
    return observable
  }
}

