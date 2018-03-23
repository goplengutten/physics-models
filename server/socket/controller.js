"use strict"
const quantum = require("../quantum/controller")
const solar = require("../solar/controller")
const diffusion = require("../diffusion/controller")
const wave = require("../wave/controller")

module.exports = {
  connected(io){
    io.on("connection", (socket) => {
      console.log("socket connected")
      
      socket.on("disconnect", () => console.log("DISCONNECT"))
      
      socket.on("quantum simulation", (message) => {
        quantum.simulateSystem(socket, message)
      })

      socket.on("diffusion simulation", (message) => {
        diffusion.simulateSystem(socket, message)
      })

      socket.on("wave simulation", (message) => {
        wave.simulateSystem(socket, message)
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