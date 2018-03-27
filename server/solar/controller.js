"use strict"
const spawn = require("child_process").spawn

module.exports.simulateSystem = function(socket, planets){
  
  const simulation = spawn("python", ["server/solar/solar_system.py", planets])
  
  let bufferString = "" 

  simulation.stdout.setEncoding("utf-8")
  simulation.stdout.on("data", (data) => {
    bufferString += data
  })

  simulation.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`)
  })

  simulation.on("close", (code) => {
    console.log("closed")
    socket.emit("streaming info", bufferString)
  })
}

module.exports.fetchSystem = function(socket, name){
  let systems = require("./defined_systems")
  let system = systems.find((sys) => sys.name === name)
  system = JSON.stringify(system)
  socket.emit("system", system)
}