"use strict"
const spawn = require("child_process").spawn

module.exports.simulateSystem = function(socket, planets){
  
  console.log("sim")
  const simulation = spawn("python", ["server/solar/solar_system.py", planets])
  
  simulation.stdout.setEncoding("utf-8")
  simulation.stdout.on("data", (data) => {
    socket.emit("streaming info", data)
  })

  simulation.stderr.on("data", (data) => {
    console.log("err")
    console.log(`stderr: ${data}`)
  })

  simulation.on("close", (code) => {
    console.log("complete")
    socket.emit("complete")
  })
}

module.exports.fetchSystem = function(socket, name){
  let systems = require("./defined_systems")
  let system = systems.find((sys) => sys.name === name)
  system = JSON.stringify(system)
  socket.emit("system", system)
}