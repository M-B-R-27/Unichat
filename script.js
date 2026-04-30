const socket = io();
let miNombre = "";

// Elementos
const loginContainer = document.getElementById("login-container");
const nombreInput = document.getElementById("nombre-input");
const btnEntrar = document.getElementById("btn-entrar");
const chatContainer = document.getElementById("chat-container");
const input = document.getElementById("input");
const btnEnviar = document.getElementById("btn-enviar");
const mensajes = document.getElementById("mensajes");
const fileInput = document.getElementById("file-input");

// ── Entrar al chat ──────────────────────────
btnEntrar.addEventListener("click", () => {
  const nombre = nombreInput.value.trim();
  if (nombre === "") return;
  miNombre = nombre;
  loginContainer.style.display = "none";
  chatContainer.style.display = "flex";
  input.focus();
});

nombreInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") btnEntrar.click();
});

// ── Hora actual ─────────────────────────────
function obtenerHora() {
  const ahora = new Date();
  const horas = ahora.getHours().toString().padStart(2, "0");
  const minutos = ahora.getMinutes().toString().padStart(2, "0");
  const dia = ahora.getDate().toString().padStart(2, "0");
  const mes = (ahora.getMonth() + 1).toString().padStart(2, "0");
  return `${dia}/${mes} ${horas}:${minutos}`;
}

// ── Mostrar mensaje en pantalla ─────────────
function agregarMensaje(datos) {
  // Info: nombre + hora
  const info = document.createElement("div");
  info.classList.add("info-mensaje");
  info.textContent = `${datos.nombre} · ${datos.hora}`;
  mensajes.appendChild(info);

  // Burbuja
  const burbuja = document.createElement("div");
  burbuja.classList.add("burbuja");

  // Si es texto
  if (datos.tipo === "texto") {
    burbuja.textContent = datos.texto;
  }

  // Si es imagen
  if (datos.tipo === "imagen") {
    const img = document.createElement("img");
    img.src = datos.archivo;
    img.style.maxWidth = "100%";
    img.style.borderRadius = "8px";
    burbuja.appendChild(img);
  }

  // Si es video
  if (datos.tipo === "video") {
    const video = document.createElement("video");
    video.src = datos.archivo;
    video.controls = true;
    video.style.maxWidth = "100%";
    video.style.borderRadius = "8px";
    burbuja.appendChild(video);
  }

  // Si es audio
  if (datos.tipo === "audio") {
    const audio = document.createElement("audio");
    audio.src = datos.archivo;
    audio.controls = true;
    audio.style.width = "100%";
    burbuja.appendChild(audio);
  }

  // Si es documento
  if (datos.tipo === "documento") {
    const link = document.createElement("a");
    link.href = datos.archivo;
    link.download = datos.nombre_archivo;
    link.textContent = "📄 " + datos.nombre_archivo;
    link.style.color = "#e94560";
    burbuja.appendChild(link);
  }

  mensajes.appendChild(burbuja);
  mensajes.scrollTop = mensajes.scrollHeight;
}

// ── Cargar historial al conectarse ──────────
socket.on("historial", (lista) => {
  lista.forEach((datos) => agregarMensaje(datos));
});

// ── Recibir mensaje nuevo ───────────────────
socket.on("mensaje", (datos) => {
  agregarMensaje(datos);
});

// ── Enviar texto ────────────────────────────
btnEnviar.addEventListener("click", () => {
  const texto = input.value.trim();
  if (texto === "") return;
  socket.emit("mensaje", {
    tipo: "texto",
    texto,
    nombre: miNombre,
    hora: obtenerHora(),
  });
  input.value = "";
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") btnEnviar.click();
});

// ── Enviar archivo ──────────────────────────
fileInput.addEventListener("change", () => {
  const archivo = fileInput.files[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result;
    const tipo = archivo.type.startsWith("image") ? "imagen"
               : archivo.type.startsWith("video") ? "video"
               : archivo.type.startsWith("audio") ? "audio"
               : "documento";

    socket.emit("mensaje", {
      tipo,
      archivo: base64,
      nombre_archivo: archivo.name,
      nombre: miNombre,
      hora: obtenerHora(),
    });
  };
  reader.readAsDataURL(archivo);
  fileInput.value = "";
});