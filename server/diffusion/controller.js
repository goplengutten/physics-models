"use strict"
const spawn = require("child_process").spawn

module.exports.simulateSystem = function(socket, info){
  const simulation = spawn("python", ["server/diffusion/diffusion_equation.py", info])
  
  simulation.stdout.setEncoding("utf-8")
  simulation.stdout.on("data", (data) => {
    socket.emit("streaming info", data)
  })

  simulation.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`)
  })

  simulation.on("close", (code) => {
    console.log("complete")
    socket.emit("complete")
  })
}
