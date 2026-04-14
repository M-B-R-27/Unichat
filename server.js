// ══════════════════════════════════════════
// PARTE 1: Importar las herramientas
// ══════════════════════════════════════════

// "require" es como decir "necesito esta herramienta"
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// ══════════════════════════════════════════
// PARTE 2: Crear el servidor
// ══════════════════════════════════════════

// express() crea la base de tu aplicación web
const app = express();

// http.createServer convierte tu app en un servidor real
const server = http.createServer(app);

// new Server(server) agrega la magia de Socket.io al servidor
const io = new Server(server);

// ══════════════════════════════════════════
// PARTE 3: Decirle qué archivo mostrar
// ══════════════════════════════════════════

// Cuando alguien entre a tu web, muéstrale el index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static(__dirname));

// ══════════════════════════════════════════
// PARTE 4: La magia del chat en tiempo real
// ══════════════════════════════════════════

// "io.on('connection')" significa:
// "cuando alguien se conecte, haz esto..."
io.on("connection", (socket) => {
  // Esto aparece en TU terminal cuando alguien entra
  console.log("✅ Un usuario se conectó");

  // Escucha mensajes que lleguen con el nombre "mensaje"
  // "socket.on" = "cuando recibas esto, haz aquello"
  socket.on("mensaje", (texto) => {
    // Muestra en la terminal qué mensaje llegó
    console.log("💬 Mensaje recibido: " + texto);

    // Reenvía el mensaje a TODOS los conectados
    // "io.emit" = "manda esto a todos"
    io.emit("mensaje", texto);
  });

  // Cuando alguien se desconecte
  socket.on("disconnect", () => {
    console.log("❌ Un usuario se desconectó");
  });
});

// ══════════════════════════════════════════
// PARTE 5: Encender el servidor
// ══════════════════════════════════════════

// El servidor escuchará en el puerto 3000
// Puerto = como un canal de televisión, el 3000 es el que usaremos
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en el puerto " + PORT);
});
