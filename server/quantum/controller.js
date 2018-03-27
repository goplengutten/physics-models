"use strict"
const spawn = require("child_process").spawn

module.exports.simulateSystem = function(socket, message){

  let system

  message = JSON.parse(message)


  if(message.simulationType === "1dEigenfunctions"){
    let params = {
      potential: message.potential,
      potentialParams: [],
      gridParams: [message.params.lx, message.params.ng],
      timeParams: [message.params.dt, message.params.tfinal],
      coeffs: message.params.coeffs,
      nrOfEigFuncs: message.params.nstates
    }
    if(params.potential === "HO"){
      params.potentialParams.push(message.params.omega)
    }else if(params.potential === "DW"){
      params.potentialParams.push(message.params.omega)
      params.potentialParams.push(message.params.R)
    }

    params = JSON.stringify(params)
    system = spawn("python", ["server/quantum/oneDimEigFuncs.py", params])

  }else if(message.simulationType === "tunneling"){

    let params = JSON.stringify(message.params)
    system = spawn("python", ["server/quantum/tunneling.py", params])

  }

  let bufferString = ""

  system.stdout.setEncoding("utf-8")
  system.stdout.on("data", (data) => {
    bufferString += data
  })

  system.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`)
  })

  system.on("close", (code) => {
    socket.emit("streaming info", bufferString)
  })
}