const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // Permite archivos grandes hasta 50mb
  maxHttpBufferSize: 50 * 1024 * 1024
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static(__dirname));

// ── Guardamos los últimos 50 mensajes en memoria ──
const historial = [];

io.on("connection", (socket) => {
  console.log("✅ Un usuario se conectó");

  // Cuando alguien se conecta, le mandamos el historial
  socket.emit("historial", historial);

  // Recibe cualquier mensaje (texto o archivo)
  socket.on("mensaje", (datos) => {
    console.log("💬 Mensaje recibido de: " + datos.nombre);

    // Guardamos el mensaje en el historial
    historial.push(datos);

    // Solo guardamos los últimos 50
    if (historial.length > 50) historial.shift();

    // Lo enviamos a todos
    io.emit("mensaje", datos);
  });

  socket.on("disconnect", () => {
    console.log("❌ Un usuario se desconectó");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en el puerto " + PORT);
});