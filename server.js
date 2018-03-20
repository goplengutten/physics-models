"use strict"
const express = require("express")
const path = require("path")
const http = require("http")
const bodyParser = require("body-parser")
const app = express()

const socketController = require("./server/socket/controller")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"))
})

const port = process.env.PORT || "3000"
app.set("port", port)

const server = http.createServer(app)
const io = require('socket.io')(server)

socketController.connected(io)

server.listen(port, () => console.log("Fun with physics running on port:", port))

