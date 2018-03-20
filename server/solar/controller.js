"use strict"
const spawn = require("child_process").spawn

module.exports.simulateSystem = function(socket, planets){
  
  console.log("sim")
  const calcuation = spawn("python", ["server/solar/solar_system.py", planets])
  
  calcuation.stdout.setEncoding("utf-8")
  calcuation.stdout.on("data", (data) => {
    socket.emit("streaming info", data)
  })

  calcuation.stderr.on("data", (data) => {
    console.log("err")
    console.log(`stderr: ${data}`)
  })

  calcuation.on("close", (code) => {
    console.log("complete")
    socket.emit("complete")
  })
}

module.exports.fetchPlanets = function(socket){
  let planets = require("./defined_planets")
  planets = JSON.stringify(planets)
  socket.emit("planets", planets)
}