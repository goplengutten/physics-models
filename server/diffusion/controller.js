"use strict"
const spawn = require("child_process").spawn

module.exports.simulateSystem = function(socket, info){
  
  const simulation = spawn("python", ["server/diffusion/diffusion_equation.py"])

  let bufferString =""

  simulation.stdout.setEncoding("utf-8")
  simulation.stdout.on("data", (data) => {
    bufferString += data
  })

  simulation.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`)
  })

  simulation.on("close", (code) => {
    console.log("complete")
    socket.emit("streaming info", bufferString)
  })

  simulation.stdin.setEncoding("utf-8")
  simulation.stdin.write(info)
  simulation.stdin.end()
}
