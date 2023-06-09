export const Playnow = () => {
  // CARGAR LA RUTA O COMPONENTE
  /* fetch("./components/PlayNow/PlayNow.html")
    .then((response) => response.text())
    .then((htmlPlayNow) => { */
  // Insertar el contenido del archivo en el elemento con el id "header"
  /* document.getElementById("content").innerHTML = htmlPlayNow; */

  //* * LOGICA DE EL JUEGO **//
  //* * GAME LOOP **//
  //* * ESTA CORREINDO SOBRE LA RUTA MOVER A SCRIPT INDEPENDIENTE **//
  //* * GAME LOOP **//
  let time = new Date();
  let deltaTime = 0;

  // esta funcion nos sirve para que se gargue todo el ecenario antes de comenzar el juego
  if (
    document.readyState === "complete" ||
          document.readyState === "interactive"
  ) {
    setTimeout(Init, 1);
  } else {
    document.addEventListener("DOMContentLoaded", Init);
  }

  // funcion inial para cargar el start del juego y el ciclo de panpalla de movimiento
  function Init() {
    time = new Date();
    /* Start(); */
    Loop();

    generarPecesFondo();
  }

  // crea el ciclo con delay de tiempo que simula el movimiento de la pantalla
  function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
  }

  //* * GAME LOGIC **//
  /*  let gameOver = document.querySelector(".game-over"); */
  const suelo = document.querySelector(".espacio");
  const contenedor = document.querySelector(".contenedor");
  /* let textoScore = document.querySelector(".score"); */
  const objeto = document.querySelector(".objeto");
  document.addEventListener("keydown", HandleKeyDown);
  const parado = false;
  const gravedad = 2500;
  let sueloX = 0;
  const velEscenario = 1280 / 3;
  const gameVel = 1;
  let velY = 0;
  let objetoMoved = 480;

  let tiempoHastaObstaculo = 2;
  const tiempoObstaculoMin = 0.7;
  const tiempoObstaculoMax = 1.8;
  /* const obstaculoPosY = 16; */
  const obstaculos = [];
  let score = 0;
  let paused = false;

  // aqui cargamos todas las funcionalidades que tiene el juego
  function Update() {
    console.log(parado);
    if (paused) return;
    score += deltaTime;
    const roundedScore = Math.floor(score);
    const scoreElement = document.querySelector(".score");
    scoreElement.textContent = `Score: ${roundedScore}`;
    if (parado) return;
    MoverSuelo();
    DecidirCrearObstaculos();
    MoverObstaculos();

    if (velY) velY -= gravedad * deltaTime;
  }
  /* boton no se esta usando
        const transitionDuration = 0.3;  */ // Duración de la transición en segundos
  let isTransitioning = false; // Variable de estado para controlar la transición en curso
  const velocity = 1000; // Velocidad de movimiento en píxeles por segundo, ajusta este valor según tus preferencias

  let startTime = null;
  let previousTime = null;
  let animationFrameId = null;

  function HandleKeyDown(event) {
    if (isTransitioning) return; // Si hay una transición en curso, salimos de la función

    if (event.key === "ArrowRight") {
      console.log("Tecla derecha presionada");
      startMoving(1);
    } else if (event.key === "ArrowLeft") {
      console.log("Tecla izquierda presionada");
      startMoving(-1);
    }
  }

  function HandleKeyUp(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      console.log("Tecla soltada");
      stopMoving();
    }
  }

  function startMoving(direction) {
    if (isTransitioning) return;

    startTime = performance.now();
    previousTime = startTime;

    function move(currentTime) {
      const deltaTime = (currentTime - previousTime) / 1000;
      previousTime = currentTime;

      const displacement = velocity * deltaTime * direction;
      objetoMoved = Math.max(
        0,
        Math.min(
          objetoMoved + displacement,
          contenedor.clientWidth - objeto.clientWidth
        )
      );
      objeto.style.left = objetoMoved + "px";

      if (
        objetoMoved <= 0 ||
              objetoMoved >= contenedor.clientWidth - objeto.clientWidth
      ) {
        stopMoving();
      } else {
        animationFrameId = requestAnimationFrame(move);
      }
    }

    isTransitioning = true;
    animationFrameId = requestAnimationFrame(move);
  }

  function stopMoving() {
    if (!isTransitioning) return;

    cancelAnimationFrame(animationFrameId);
    isTransitioning = false;
  }

  document.addEventListener("keydown", HandleKeyDown);
  document.addEventListener("keyup", HandleKeyUp);

  // funcion para simular movimiento de las busbujas
  // la cual es solo una imagen png que se recarga varias
  // y corre en el eje y para simular movimiento
  function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.top = -(sueloX % contenedor.clientHeight) + "px";
  }

  // funcion calcular el desplazamiento de la pantalla o los obstaculos.
  function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
  }

  // funcionalidad para determinar cada cuanto tiempo aparecen los obstaculos es rambom
  function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if (tiempoHastaObstaculo <= 0) {
      CrearObstaculo();
    }
  }
  // funcion para crear obstaculso radomn si nececida de estarlos creando uno por uno
  // se pueden crean tantos obstaculos como sena necesarios
  function CrearObstaculo() {
    const obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("medusa");
    if (Math.random() > 0.5) obstaculo.classList.add("pulpo");
    else if (Math.random() < 0.5) obstaculo.classList.add("tiburon");
    obstaculo.posY = contenedor.clientHeight;
    obstaculo.style.top = contenedor.clientHeight + "px";

    const randomDirection = Math.random() * 2 - 1; // Número aleatorio entre -1 y 1
    obstaculo.velocidadX = randomDirection * 200; // Ajusta la velocidad horizontal

    const initialPosition = randomDirection < 0 ? 750 : 250; // Posición inicial según la dirección
    obstaculo.style.left = initialPosition + "px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo =
            tiempoObstaculoMin +
            (Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin)) / gameVel;
  }

  // funcionalidad para que los obstaculos aparencan en distintas posisines de la pantalla es rambon
  // por ahora solo tiene tres movimientos 250px, 480px 750px se pueden cear mas.
  function getRandomLeft() {
    const randomNumber = Math.floor(Math.random() * 3); // Genera un número aleatorio entre 0 y 2

    if (randomNumber === 0) {
      return 250;
    } else if (randomNumber === 1) {
      return 500;
    } else {
      return 750;
    }
  }
  // funcionalidad que permite que los obstaculos se puevan hacia arriba simulando desplazamiento de la pantalla
  // la velocidad es paralela a la pantalla y puede ser modificable
  // funcionalidad que permite que los obstaculos se puevan hacia arriba simulando desplazamiento de la pantalla
  // la velocidad es paralela a la pantalla y puede ser modificable

  function MoverObstaculos() {
    for (let i = obstaculos.length - 1; i >= 0; i--) {
      if (obstaculos[i].posY < -obstaculos[i].clientHeight) {
        obstaculos[i].parentNode.removeChild(obstaculos[i]);
        obstaculos.splice(i, 1);
        /* GanarPuntos(); */
      } else {
        obstaculos[i].posY -= CalcularDesplazamiento();
        obstaculos[i].style.top = obstaculos[i].posY + "px";
        obstaculos[i].style.left =
                parseFloat(obstaculos[i].style.left) +
                obstaculos[i].velocidadX * deltaTime +
                "px";
      }
    }
  }

  // mas javascript hecho por SARA.
  // Crear botones de restart, pause y sonido.
  const restartButton = document.getElementById("restartButton");
  /*       const pauseButton = document.getElementById("pauseButton");
        const soundButton = document.getElementById("soundButton"); */
  // Agregarle la opción de poder clicar encima.
  restartButton.addEventListener("click", () => {
    console.log("init");
    score = 0;
  });

  /*       estan declaradas pero no se utilizan por ahora genera error
        pauseButton.addEventListener("click", pauseGame);
        soundButton.addEventListener("click", toggleSound); */

  /*       function restartGame() {

        } */

  function generarPecesFondo() {
    const cantidadPeces = 25;
    const contenedor = document.getElementById("contenedor");
    for (let i = 0; i < cantidadPeces; i++) {
      const pez = document.createElement("div");
      pez.classList.add("fish");
      pez.style.left = getRandomLeft() + "px"; // Utiliza getRandomLeft() para obtener una posición aleatoria
      /* hay un error aqui / / pez.style.top = getRandomTop() + "px"; */ // Utiliza getRandomTop() para obtener una posición aleatoria

      contenedor.appendChild(pez);
    }
  }
  /* Hacer que los botones de pause y sound-on se cambien por
           play y sound-off cuando se hace click sobre ellos */
  console.log("pause", paused);
  const pauseButton = document.getElementById("pauseButton");
  pauseButton.addEventListener("click", function () {
    if (pauseButton.classList.contains("pauseButton")) {
      pauseButton.classList.remove("pauseButton");
      pauseButton.classList.add("pauseButtonTwo");
      paused = true;
      console.log("pause click si", paused);
    } else {
      pauseButton.classList.remove("pauseButtonTwo");
      pauseButton.classList.add("pauseButton");
      paused = false;
      console.log("pause click no", paused);
    }
  });

  // Crear elemento de audio
  const audio = new Audio("/assets/audio/soundtrack.mp3");
  const soundButton = document.getElementById("soundButton");
  soundButton.addEventListener("click", function () {
    if (soundButton.classList.contains("soundButton")) {
      /*  soundButton.style.backgroundImage =
              "url(\"/assets/icons/sound-on.svg\")"; */
      soundButton.classList.remove("soundButton");
      soundButton.classList.add("soundButtonTwo");
      audio.play(); // Reproducir el audio
    } else {
      /* soundButton.style.backgroundImage =
              "url(\"/assets/icons/sound-off.svg\")"; */
      soundButton.classList.remove("soundButtonTwo");
      soundButton.classList.add("soundButton");
      audio.pause();
    }
  });

  /*   let soundOn = true;

  function toggleSound() {
    if (soundOn) {
      audio.pause();
      soundOn = false;
    } else {
      audio.play();
      soundOn = true;
    }
  }

  soundButton.addEventListener("click", toggleSound); */

  const returnButton = document.getElementById("returnButton");

  returnButton.addEventListener("click", function () {
    location.href = "https://aquagout.github.io/AquaGoat/";
  });
  /* });
 */
  // mas javascript
  // mas javascript hecho por SARA.
  // Crear botones de restart, pause y sonido.
  /*   const restartButton = document.getElementById("restartButton");
    const pauseButton = document.getElementById("pauseButton");
    const soundButton = document.getElementById("soundButton");

    restartButton.addEventListener("click", Init);
    pauseButton.addEventListener("click", pauseGame);
    soundButton.addEventListener("click", toggleSound); */

  console.log("Playnow");
};

/* ejecucion de play now */
/* ejecucion de play now */
Playnow();
console.log("ejecucion");
