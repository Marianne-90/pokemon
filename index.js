const canvas = document.querySelector("canvas");

canvas.width = 1024;
canvas.height = 576;

const c = canvas.getContext("2d");

const collitionsMap = [];
//*! en el for loop usamos 70 porque en el mapa hay 70 cubitos horizonatalmente entonces recoreremos en las hileras y vamos a separarlas en arrays
for (let i = 0; i < collitions.length; i += 70) {
  collitionsMap.push(collitions.slice(i, i + 70));
}

const boundaries = [];

//*! esto es lo que movemos el mapa para que no se comience a dibujar desde la esquina 0,0 si no desde la casita
// const offset = {
//   x: -1000,
//   y: -820,
// };

const offset = {
  x: -100,
  y:-700,
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

const movables = [background, foregroundObjs, ...boundaries];

const rectangularCollition = ({ rectangle1, rectangle2 }) => {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y >= rectangle2.position.y - rectangle2.height
  );
};

const animate = () => {
  window.requestAnimationFrame(animate);
  background.draw();

  //*! recuerda los pasos que hiciste en boundaries ya contiene objetos con la función de dibujo en el canvas

  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  player.draw();
  foregroundObjs.draw();

  let moving = true; // los límites comienza como que sí se puede movel al menos que toque un límite
  player.moving = false;

  if (keys.w.pressed && lastKey === "w") {
    player.image = player.sprites.up;
    player.moving = true;
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
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.image = player.sprites.left;
    player.moving = true;
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
    player.moving = true;
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
    player.moving = true;
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
