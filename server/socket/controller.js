"use strict"
const quantum = require("../quantum/controller")
const solar = require("../solar/controller")

module.exports = {
  connected(io){
    io.on("connection", (socket) => {
      console.log("socket connected")
      
      socket.on("disconnect", () => console.log("DISCONNECT"))
      
      socket.on("quantum simulation", (message) => {
        quantum.simulateSystem(socket, message)
      })

      socket.on("solar simulation", (message) => {
        solar.simulateSystem(socket, message)      
      })

      socket.on("get system", (name) => {
        solar.fetchSystem(socket, name)
      })
    })
  }
}