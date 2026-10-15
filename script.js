/* =========================================================
   MATEMÁTICA EN RUTA · script.js
   Secciones: 1) Configuración  2) Banco de preguntas
              3) Utilidades     4) Tablero y fichas
              5) Dado           6) Preguntas (ventana)
              7) Flujo del turno 8) Inicio / reinicio
   ========================================================= */

/* ---------- 1) CONFIGURACIÓN (fácil de modificar) ---------- */
const META = 20; // última casilla

// Casillas especiales: número de casilla -> tipo
const ESPECIALES = { 3: "bonus", 6: "timer", 9: "challenge", 12: "bonus", 15: "timer", 18: "challenge" };

// Reglas de cada casilla especial
//  nivel: dificultad de la pregunta (1 normal, 2 difícil) | extra: casillas que se ganan al acertar
const TIPOS = {
  bonus:     { icono: "⭐", nombre: "BONUS",         nivel: 1, extra: 2, segundos: 0  },
  timer:     { icono: "⏱️", nombre: "CONTRARRELOJ",  nivel: 1, extra: 1, segundos: 15 },
  challenge: { icono: "🎯", nombre: "DESAFÍO",       nivel: 2, extra: 3, segundos: 0  }
};

/* ---------- 2) BANCO DE PREGUNTAS (editable) ----------
   Formato: cat (tema), nivel (1 normal / 2 difícil), q (pregunta),
            correcta (texto), incorrectas (3 textos), exp (explicación).
   Las alternativas se mezclan solas, así que solo escribe la correcta aparte. */
const PREGUNTAS = [
  // ----- Operaciones combinadas -----
  { cat: "Operaciones combinadas", nivel: 1, q: "8 + 3 × 4 − 6 ÷ 2 = ?", correcta: "17", incorrectas: ["41", "19", "14"],
    exp: "Primero × y ÷: 3×4 = 12 y 6÷2 = 3. Luego 8 + 12 − 3 = 17." },
  { cat: "Operaciones combinadas", nivel: 1, q: "(15 − 7) × 3 + 2² = ?", correcta: "28", incorrectas: ["26", "32", "20"],
    exp: "Paréntesis: 8. Potencia: 2² = 4. Luego 8×3 + 4 = 24 + 4 = 28." },
  { cat: "Operaciones combinadas", nivel: 1, q: "36 ÷ 4 + 5 × 2 − 3 = ?", correcta: "16", incorrectas: ["19", "12", "24"],
    exp: "36÷4 = 9 y 5×2 = 10. Luego 9 + 10 − 3 = 16." },
  { cat: "Operaciones combinadas", nivel: 1, q: "2³ + 3 × (10 − 6) = ?", correcta: "20", incorrectas: ["32", "44", "14"],
    exp: "2³ = 8 y (10 − 6) = 4. Luego 8 + 3×4 = 8 + 12 = 20." },
  { cat: "Operaciones combinadas", nivel: 1, q: "50 − 4 × (3 + 2) + 6 = ?", correcta: "36", incorrectas: ["26", "46", "66"],
    exp: "Paréntesis: 5. Luego 4×5 = 20 y 50 − 20 + 6 = 36." },
  { cat: "Operaciones combinadas", nivel: 2, q: "3 × [20 − (4 + 2)² ÷ 3] = ?", correcta: "24", incorrectas: ["48", "36", "18"],
    exp: "(4+2)² = 36; 36÷3 = 12; 20 − 12 = 8; finalmente 3×8 = 24." },

  // ----- Números enteros -----
  { cat: "Números enteros", nivel: 1, q: "(−8) + 5 = ?", correcta: "−3", incorrectas: ["3", "−13", "13"],
    exp: "Signos distintos: se restan 8 − 5 = 3 y se conserva el signo del mayor valor absoluto (−). Resultado: −3." },
  { cat: "Números enteros", nivel: 1, q: "(−6) × (−7) = ?", correcta: "42", incorrectas: ["−42", "13", "−13"],
    exp: "Menos por menos da más: 6×7 = 42." },
  { cat: "Números enteros", nivel: 1, q: "4 − (−9) = ?", correcta: "13", incorrectas: ["−5", "5", "−13"],
    exp: "Restar un negativo equivale a sumar: 4 + 9 = 13." },
  { cat: "Números enteros", nivel: 1, q: "(−48) ÷ 6 = ?", correcta: "−8", incorrectas: ["8", "−6", "−42"],
    exp: "Negativo entre positivo da negativo: 48÷6 = 8, entonces −8." },
  { cat: "Números enteros", nivel: 1, q: "−5 + 12 − 9 = ?", correcta: "−2", incorrectas: ["2", "−8", "16"],
    exp: "−5 + 12 = 7 y 7 − 9 = −2." },
  { cat: "Números enteros", nivel: 2, q: "(−3)² − 2 × (−4) + (−10) ÷ 5 = ?", correcta: "15", incorrectas: ["11", "−1", "19"],
    exp: "(−3)² = 9; −2×(−4) = +8; (−10)÷5 = −2. Luego 9 + 8 − 2 = 15." },

  // ----- Fracciones -----
  { cat: "Fracciones", nivel: 1, q: "1/2 + 1/4 = ?", correcta: "3/4", incorrectas: ["2/6", "1/8", "2/4"],
    exp: "1/2 = 2/4. Entonces 2/4 + 1/4 = 3/4." },
  { cat: "Fracciones", nivel: 1, q: "2/3 × 3/4 = ?", correcta: "1/2", incorrectas: ["5/7", "8/9", "1/4"],
    exp: "Se multiplica numerador por numerador y denominador por denominador: 6/12 = 1/2." },
  { cat: "Fracciones", nivel: 1, q: "¿Cuánto es 3/5 de 40?", correcta: "24", incorrectas: ["20", "32", "16"],
    exp: "40 ÷ 5 = 8 (un quinto). Luego 8 × 3 = 24." },
  { cat: "Fracciones", nivel: 1, q: "5/6 − 1/3 = ?", correcta: "1/2", incorrectas: ["4/3", "2/3", "1/3"],
    exp: "1/3 = 2/6. Entonces 5/6 − 2/6 = 3/6 = 1/2." },
  { cat: "Fracciones", nivel: 1, q: "3/4 ÷ 3/8 = ?", correcta: "2", incorrectas: ["1/2", "9/32", "4"],
    exp: "Se multiplica por el inverso: 3/4 × 8/3 = 24/12 = 2." },
  { cat: "Fracciones", nivel: 2, q: "3/4 + 1/2 × 2/3 = ?", correcta: "13/12", incorrectas: ["5/6", "7/12", "11/12"],
    exp: "Primero la multiplicación: 1/2 × 2/3 = 1/3. Luego 3/4 + 1/3 = 9/12 + 4/12 = 13/12." },

  // ----- Porcentajes -----
  { cat: "Porcentajes", nivel: 1, q: "¿Cuánto es el 25% de 80?", correcta: "20", incorrectas: ["25", "15", "32"],
    exp: "25% = 1/4 y 80 ÷ 4 = 20." },
  { cat: "Porcentajes", nivel: 1, q: "Una camisa cuesta S/ 120 y tiene 15% de descuento. ¿Cuánto se paga?", correcta: "S/ 102", incorrectas: ["S/ 18", "S/ 105", "S/ 135"],
    exp: "15% de 120 = 18. Se paga 120 − 18 = S/ 102." },
  { cat: "Porcentajes", nivel: 1, q: "¿Qué porcentaje de 150 es 45?", correcta: "30%", incorrectas: ["3%", "45%", "33%"],
    exp: "45 ÷ 150 = 0,30, es decir, 30%." },
  { cat: "Porcentajes", nivel: 1, q: "Si 250 aumenta en 20%, ¿cuál es el nuevo valor?", correcta: "300", incorrectas: ["270", "50", "275"],
    exp: "20% de 250 = 50. Entonces 250 + 50 = 300." },
  { cat: "Porcentajes", nivel: 1, q: "12 es el 8% de un número. ¿Cuál es ese número?", correcta: "150", incorrectas: ["96", "100", "120"],
    exp: "12 ÷ 0,08 = 150. Comprobación: 8% de 150 = 12." },
  { cat: "Porcentajes", nivel: 2, q: "Un precio sube 20% y luego baja 20%. Respecto al precio original, queda:", correcta: "4% menos", incorrectas: ["igual", "20% menos", "4% más"],
    exp: "Con precio 100: sube a 120; el 20% de 120 es 24; baja a 96. Es 4% menos." },

  // ----- Ecuaciones sencillas -----
  { cat: "Ecuaciones", nivel: 1, q: "x + 9 = 21. ¿Cuánto vale x?", correcta: "12", incorrectas: ["30", "11", "14"],
    exp: "x = 21 − 9 = 12." },
  { cat: "Ecuaciones", nivel: 1, q: "3x − 5 = 16. ¿Cuánto vale x?", correcta: "7", incorrectas: ["5", "9", "11"],
    exp: "3x = 16 + 5 = 21, entonces x = 21 ÷ 3 = 7." },
  { cat: "Ecuaciones", nivel: 1, q: "2(x + 3) = 18. ¿Cuánto vale x?", correcta: "6", incorrectas: ["3", "9", "12"],
    exp: "x + 3 = 18 ÷ 2 = 9, entonces x = 6." },
  { cat: "Ecuaciones", nivel: 1, q: "5x + 4 = 2x + 19. ¿Cuánto vale x?", correcta: "5", incorrectas: ["3", "7", "15"],
    exp: "5x − 2x = 19 − 4 → 3x = 15 → x = 5." },
  { cat: "Ecuaciones", nivel: 1, q: "x/4 + 3 = 8. ¿Cuánto vale x?", correcta: "20", incorrectas: ["44", "5", "32"],
    exp: "x/4 = 8 − 3 = 5, entonces x = 5 × 4 = 20." },
  { cat: "Ecuaciones", nivel: 2, q: "4(x − 2) = 3x + 5. ¿Cuánto vale x?", correcta: "13", incorrectas: ["3", "7", "−13"],
    exp: "4x − 8 = 3x + 5 → 4x − 3x = 5 + 8 → x = 13." }
];

/* ---------- 3) UTILIDADES ---------- */
const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Mezcla aleatoria (Fisher-Yates)
function mezclar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let estado;          // estado de la partida
let timerActivo = null; // intervalo del contrarreloj

const nombre = (i) => $("name" + i).value.trim() || "Jugador " + (i + 1);
// Si se reinició la partida mientras algo estaba en curso, se abandona esa acción
const obsoleto = (id) => id !== estado.id;

/* ---------- 4) TABLERO Y FICHAS ---------- */
const fichas = [];
const DECORACION = ["➕", "➖", "✖️", "➗", "📐", "🧮", "🔢", "📏", "💡", "🧠"];

function construirTablero() {
  const tablero = $("board");
  tablero.innerHTML = "";
  for (let n = 1; n <= META; n++) {
    // Zigzag: fila 0 (abajo) de izq. a der., fila 1 de der. a izq., etc.
    const fila = Math.floor((n - 1) / 5);
    let col = (n - 1) % 5;
    if (fila % 2 === 1) col = 4 - col;

    const celda = document.createElement("div");
    celda.className = "cell";
    celda.id = "cell" + n;
    celda.style.gridRow = 4 - fila;   // la fila 0 se muestra abajo
    celda.style.gridColumn = col + 1;

    // Íconos decorativos de las casillas normales (editables)
    let contenido = `<span class="icon">${DECORACION[n % DECORACION.length]}</span>`;
    celda.classList.add("c" + (n % 5)); // color de la casilla
    if (ESPECIALES[n]) {
      const t = TIPOS[ESPECIALES[n]];
      celda.classList.add(ESPECIALES[n]);
      contenido = `<span class="icon">${t.icono}</span><span class="label">${t.nombre}</span>`;
    }
    if (n === META) { celda.classList.add("meta"); contenido = `<span class="icon">🏆</span><span class="label">META</span>`; }

    celda.innerHTML = `<span class="num">${n}</span><span class="mid">${contenido}</span><div class="tokens"></div>`;
    tablero.appendChild(celda);
  }
}

function crearFichas() {
  fichas.length = 0;
  for (let i = 0; i < 2; i++) {
    const f = document.createElement("span");
    f.className = "token p" + i;
    f.textContent = ["🦊", "🐧"][i]; // personajes de las fichas
    f.title = "Ficha del jugador " + (i + 1);
    fichas.push(f);
  }
}

// Coloca la ficha del jugador i en su casilla actual (0 = INICIO)
function colocarFicha(i, animar) {
  const pos = estado.pos[i];
  const destino = pos === 0 ? $("startTokens") : document.querySelector(`#cell${pos} .tokens`);
  destino.appendChild(fichas[i]); // si coinciden, ambas fichas conviven en la casilla
  if (animar) {
    fichas[i].classList.remove("hop");
    void fichas[i].offsetWidth; // reinicia la animación
    fichas[i].classList.add("hop");
  }
}

// Avanza paso a paso, sin pasar de la meta
async function avanzar(i, pasos, gid) {
  const destino = Math.min(estado.pos[i] + pasos, META);
  while (estado.pos[i] < destino) {
    estado.pos[i]++;
    colocarFicha(i, true);
    actualizarProgreso();
    await sleep(320);
    if (obsoleto(gid)) return;
  }
}

function actualizarProgreso() {
  for (let i = 0; i < 2; i++) {
    $("bar" + i).style.width = (estado.pos[i] / META) * 100 + "%";
    $("prog" + i).textContent = estado.pos[i] === 0 ? "En INICIO" : `Casilla ${estado.pos[i]} / ${META}`;
  }
}

function mostrarTurno() {
  $("turnName").textContent = nombre(estado.turno);
  $("card0").classList.toggle("active", estado.turno === 0);
  $("card1").classList.toggle("active", estado.turno === 1);
}

function mensaje(txt) { $("mensaje").textContent = txt; }

/* ---------- 5) DADO ---------- */
const CARAS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

function dibujarDado(valor) {
  const dado = $("dice");
  dado.innerHTML = "";
  for (let k = 0; k < 9; k++) {
    const p = document.createElement("i");
    if (CARAS[valor].includes(k)) p.className = "on";
    dado.appendChild(p);
  }
  dado.setAttribute("aria-label", "Dado: " + valor);
}

// Animación: caras al azar y valor final aleatorio del 1 al 6
async function lanzarDado(gid) {
  const dado = $("dice");
  dado.classList.add("rolling");
  for (let k = 0; k < 8; k++) {
    dibujarDado(1 + Math.floor(Math.random() * 6));
    await sleep(75);
    if (obsoleto(gid)) return 0;
  }
  const valor = 1 + Math.floor(Math.random() * 6);
  dibujarDado(valor);
  dado.classList.remove("rolling");
  return valor;
}

/* ---------- 6) PREGUNTAS ---------- */
// Elige una pregunta no usada del nivel pedido; si se agotan, reinicia el conjunto
function elegirPregunta(nivel) {
  let lista = PREGUNTAS.map((p, idx) => idx).filter((idx) => PREGUNTAS[idx].nivel === nivel && !estado.usadas.has(idx));
  if (lista.length === 0) lista = PREGUNTAS.map((p, idx) => idx).filter((idx) => !estado.usadas.has(idx));
  if (lista.length === 0) { estado.usadas.clear(); return elegirPregunta(nivel); }
  const idx = lista[Math.floor(Math.random() * lista.length)];
  estado.usadas.add(idx);
  return PREGUNTAS[idx];
}

/* Muestra la ventana de pregunta. Devuelve una promesa con true (acierto) o false.
   opciones: { nivel, etiqueta, claseChip, segundos, textoAcierto } */
function preguntar({ nivel, etiqueta, claseChip, segundos, textoAcierto }) {
  return new Promise((resolve) => {
    const q = elegirPregunta(nivel);
    const alternativas = mezclar([q.correcta, ...q.incorrectas]);
    let respondida = false; // evita responder dos veces
    let resultado = false;

    $("qTag").textContent = etiqueta;
    $("qTag").className = "chip " + claseChip;
    $("qCat").textContent = q.cat;
    $("qText").textContent = q.q;
    $("feedback").hidden = true;
    $("btnContinuar").hidden = true;
    const cont = $("qOptions");
    cont.innerHTML = "";

    function cerrar(acerto, textoFeedback) {
      if (respondida) return;
      respondida = true;
      resultado = acerto;
      clearInterval(timerActivo);
      cont.querySelectorAll("button").forEach((b) => {
        b.disabled = true;
        if (b.dataset.valor === q.correcta) b.classList.add("correct");
      });
      const fb = $("feedback");
      fb.hidden = false;
      fb.className = "feedback " + (acerto ? "ok" : "bad");
      fb.textContent = textoFeedback;
      $("btnContinuar").hidden = false;
      $("btnContinuar").focus();
    }

    alternativas.forEach((texto) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.textContent = texto;
      b.dataset.valor = texto;
      b.onclick = () => {
        if (respondida) return;
        if (texto === q.correcta) {
          cerrar(true, "✅ ¡Correcto! " + textoAcierto);
        } else {
          b.classList.add("wrong");
          cerrar(false, "❌ Incorrecto. La respuesta correcta es " + q.correcta + ". " + q.exp);
        }
      };
      cont.appendChild(b);
    });

    // Contrarreloj
    const caja = $("timerWrap"), barra = $("timerBar");
    clearInterval(timerActivo);
    if (segundos > 0) {
      caja.hidden = false;
      barra.className = "";
      const inicio = Date.now();
      timerActivo = setInterval(() => {
        const resta = segundos * 1000 - (Date.now() - inicio);
        barra.style.width = Math.max(0, (resta / (segundos * 1000)) * 100) + "%";
        barra.classList.toggle("low", resta < 5000);
        if (resta <= 0) cerrar(false, "⏱️ ¡Se acabó el tiempo! La respuesta correcta es " + q.correcta + ". " + q.exp);
      }, 100);
    } else {
      caja.hidden = true;
    }

    $("btnContinuar").onclick = () => {
      $("modal").hidden = true;
      resolve(resultado);
    };
    $("modal").hidden = false;
  });
}

/* ---------- 7) FLUJO DEL TURNO ---------- */
async function jugarTurno() {
  // Candados: no se puede lanzar si hay turno/pregunta en curso o la partida terminó
  if (estado.ocupado || estado.terminada) return;
  estado.ocupado = true;
  $("btnLanzar").disabled = true;

  const gid = estado.id;
  const i = estado.turno;
  mensaje(nombre(i) + " lanza el dado…");

  const dado = await lanzarDado(gid);
  if (obsoleto(gid)) return;

  // Pregunta normal
  mensaje(`Salió ${dado}. ¡Responde para avanzar!`);
  await sleep(450);
  const acierto = await preguntar({
    nivel: 1, etiqueta: `Dado: ${dado}`, claseChip: "normal", segundos: 0,
    textoAcierto: `Avanzas ${dado} casilla${dado > 1 ? "s" : ""}.`
  });
  if (obsoleto(gid)) return;

  if (acierto) {
    mensaje(`¡Bien! ${nombre(i)} avanza ${dado}.`);
    await avanzar(i, dado, gid);
    if (obsoleto(gid)) return;
    if (estado.pos[i] >= META) return terminar(i);

    // Casilla especial (solo se activa al caer; el avance extra NO activa otra especial)
    const tipo = ESPECIALES[estado.pos[i]];
    if (tipo) {
      const t = TIPOS[tipo];
      mensaje(`${t.icono} ¡Casilla ${t.nombre}!`);
      await sleep(700);
      const ok2 = await preguntar({
        nivel: t.nivel, etiqueta: `${t.icono} ${t.nombre}`, claseChip: tipo, segundos: t.segundos,
        textoAcierto: `Avanzas ${t.extra} casilla${t.extra > 1 ? "s" : ""} extra.`
      });
      if (obsoleto(gid)) return;
      if (ok2) {
        mensaje(`¡${nombre(i)} gana ${t.extra} casillas extra!`);
        await avanzar(i, t.extra, gid);
        if (obsoleto(gid)) return;
        if (estado.pos[i] >= META) return terminar(i);
      } else {
        mensaje("Sin avance extra. ¡Sigue practicando!");
        await sleep(600);
      }
    }
  } else {
    mensaje(nombre(i) + " se queda en su casilla.");
    await sleep(500);
  }

  // Cambio de turno
  estado.turno = 1 - i;
  estado.ocupado = false;
  $("btnLanzar").disabled = false;
  mostrarTurno();
  mensaje("Turno de " + nombre(estado.turno) + ". ¡Lanza el dado!");
}

function terminar(ganador) {
  estado.terminada = true;
  mensaje("");
  $("winName").textContent = nombre(ganador);
  // Confeti sencillo
  const conf = $("confetti");
  conf.innerHTML = "";
  const colores = ["#2563EB", "#E4572E", "#F4B400", "#0E9AA7", "#7C4DFF"];
  for (let k = 0; k < 50; k++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "vw";
    s.style.background = colores[k % colores.length];
    s.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    s.style.animationDelay = Math.random() * 1.2 + "s";
    conf.appendChild(s);
  }
  $("winScreen").hidden = false;
}

/* ---------- 8) INICIO / REINICIO ---------- */
function nuevaPartida() {
  clearInterval(timerActivo);
  estado = {
    id: (estado ? estado.id : 0) + 1, // identifica la partida (cancela acciones pendientes)
    pos: [0, 0],
    turno: Math.random() < 0.5 ? 0 : 1, // empieza un jugador al azar
    usadas: new Set(),
    ocupado: false,
    terminada: false
  };
  $("modal").hidden = true;
  $("winScreen").hidden = true;
  $("btnLanzar").disabled = false;
  dibujarDado(1);
  colocarFicha(0, false);
  colocarFicha(1, false);
  actualizarProgreso();
  mostrarTurno();
  mensaje("Comienza " + nombre(estado.turno) + ". ¡Lanza el dado!");
}

$("btnLanzar").onclick = jugarTurno;
$("btnReiniciar").onclick = nuevaPartida;
$("btnNueva").onclick = nuevaPartida;
$("name0").oninput = $("name1").oninput = () => { if (estado) mostrarTurno(); };

construirTablero();
crearFichas();
nuevaPartida();
