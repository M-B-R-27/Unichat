const socket = io();

let miNombre = "";

// Elementos del login
const loginContainer = document.getElementById("login-container");
const nombreInput = document.getElementById("nombre-input");
const btnEntrar = document.getElementById("btn-entrar");

// Elementos del chat
const chatContainer = document.getElementById("chat-container");
const input = document.getElementById("input");
const btnEnviar = document.getElementById("btn-enviar");
const mensajes = document.getElementById("mensajes");

// ── Entrar al chat ──────────────────────────
btnEntrar.addEventListener("click", () => {
  const nombre = nombreInput.value.trim();
  if (nombre === "") return;
  miNombre = nombre;
  loginContainer.style.display = "none"; // Oculta el login
  chatContainer.style.display = "flex"; // Muestra el chat
  input.focus();
});

nombreInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") btnEntrar.click();
});

// ── Función para obtener la hora actual ─────
function obtenerHora() {
  const ahora = new Date();
  const horas = ahora.getHours().toString().padStart(2, "0");
  const minutos = ahora.getMinutes().toString().padStart(2, "0");
  const dia = ahora.getDate().toString().padStart(2, "0");
  const mes = (ahora.getMonth() + 1).toString().padStart(2, "0");
  return `${dia}/${mes} ${horas}:${minutos}`;
}

// ── Mostrar mensaje en pantalla ─────────────
function agregarMensaje(texto, nombre, hora) {
  // Info arriba de la burbuja (nombre + hora)
  const info = document.createElement("div");
  info.classList.add("info-mensaje");
  info.textContent = `${nombre} · ${hora}`;

  // Burbuja con el texto
  const burbuja = document.createElement("div");
  burbuja.classList.add("burbuja");
  burbuja.textContent = texto;

  mensajes.appendChild(info);
  mensajes.appendChild(burbuja);
  mensajes.scrollTop = mensajes.scrollHeight;
}

// ── Enviar mensaje ──────────────────────────
btnEnviar.addEventListener("click", () => {
  const texto = input.value.trim();
  if (texto === "") return;

  const hora = obtenerHora();

  // Manda al servidor: texto + nombre + hora
  socket.emit("mensaje", { texto, nombre: miNombre, hora });
  input.value = "";
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") btnEnviar.click();
});

// ── Recibir mensaje del servidor ────────────
socket.on("mensaje", ({ texto, nombre, hora }) => {
  agregarMensaje(texto, nombre, hora);
});
