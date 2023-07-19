const canvas = document.querySelector("canvas");

canvas.width = 1024;
canvas.height = 576;

const c = canvas.getContext("2d");

const collitionsMap = [];
//*! en el for loop usamos 70 porque en el mapa hay 70 cubitos horizonatalmente entonces recoreremos en las hileras y vamos a separarlas en arrays
for (let i = 0; i < collitions.length; i += 70) {
  collitionsMap.push(collitions.slice(i, i + 70));
}

const battleZonesMap = [];
//*! estamos haciendo el mismo proceso que en los límites
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

const boundaries = [];

//*! esto es lo que movemos el mapa para que no se comience a dibujar desde la esquina 0,0 si no desde la casita

const offset = {
  x: -100,
  y: -700,
};

//*! en esta parte vamos a primero dividir los líneas y o sea las 40 columnas hacia abajo
//*! recordemos que cada una contiene 70 cubitos luego vamo a analicar las filas de los 70 cubitos por quada línea
//*! con eso camos a entregar las coordenadas de cada límite que pusimos que está marcado con un 1025
//*! y luego haremos un nuevo objeto que añadiremos a boundaries :)

collitionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

//*! lo mismo que los límites pero para battle zone

const battleZones = [];

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const image = new Image();
image.src = "./img/mapBase.png";

const foregroundObjsImage = new Image();
foregroundObjsImage.src = "./img/foregroundObjects.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/player/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/player/playerUp.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/player/playerRight.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/player/playerLeft.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - playerDownImage.width / 4 / 2,
    y: canvas.height / 2 - playerDownImage.height / 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: playerUpImage,
    right: playerRightImage,
    left: playerLeftImage,
    down: playerDownImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  image: image,
});

const foregroundObjs = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  image: foregroundObjsImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, foregroundObjs, ...boundaries, ...battleZones];

const rectangularCollition = ({ rectangle1, rectangle2 }) => {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y >= rectangle2.position.y - rectangle2.height
  );
};

const battle = {
  initiated: false,
};

const animate = () => {
  const animationId = window.requestAnimationFrame(animate); //*! funciona igual que antes solo guardamos el animation Frame dentro de ese const para despues detenerlo con window.cancelAnimationFrame para cambiar de escenario

  background.draw();

  //*! recuerda los pasos que hiciste en boundaries ya contiene objetos con la función de dibujo en el canvas

  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  //*! lo mismo pero para las zonas de batalla

  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });

  player.draw();
  foregroundObjs.draw();

  let moving = true; // los límites comienza como que sí se puede mover al menos que toque un límite
  player.animate = false;

  //*! detener toda esta animación si inició una batalla
  if (battle.initiated) return;

  //ACTIVATE BATTLE

  //*! esto es para detectar si cualquiera de las teclas está dentro de el battle zone y así evitas copiar y pegar código en cada tecla
  if (keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) * //*! esta primera parte  nos va a dar el ancho de el rectángulo que surge de la colición de las dos figuras
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y)); //*! lo mismo pero con la altura y con eso se calcula el rectángulo que a su vez debe ser mayor a la mitad del área para activarse como lo indica el if statement más adelante
      if (
        rectangularCollition({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 && // se divide entre dos para que sea el tamaño del personaje a la mitad lo que debe de rebazar y no el personaje completo
        Math.random() < 0.05 //* esto es para que no siempre ocurra la batalla si no que de cierta forma sea un evento inusual
      ) {
        //DEACTIVATE CURRENT ANIMATION LOOP
        window.cancelAnimationFrame(animationId); //*! esto está aquí y no abajo porque estamos manejando animaciones frame por frame entonces al poner lo de la pantalla que parpadea ya pasaron varios frames por lo que estaríamos intentando desactivar el frame pasado

        audio.Map.stop();
        audio.initBattle.play();
        audio.battle.play();

        battle.initiated = true;
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                //ACTIVATE NEW ANIMATION LOOP
                initBattle();
                animateBattle();
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "w") {
    player.image = player.sprites.up;
    player.animate = true;

    //*! el for loop es para marcar dónde son los límites
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollition({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      //*! esto mueve la posición de todos los objetos de movables hacia arriba solo si es positivo si hay colisión se marca en false
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.image = player.sprites.left;
    player.animate = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollition({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.image = player.sprites.right;
    player.animate = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollition({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    player.image = player.sprites.down;
    player.animate = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollition({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  }
};

animate();

// initBattle();
// animateBattle();
let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;

    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;

    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;

    default:
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    case "s":
      keys.s.pressed = false;
      break;

    case "d":
      keys.d.pressed = false;
      break;

    default:
      break;
  }
});

let clicked = false;

window.addEventListener("click", (e) => {
  if (!clicked) {

    audio.Map.play();
    clicked = true;
  }
});
