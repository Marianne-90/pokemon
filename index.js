const canvas = document.querySelector("canvas");

canvas.width = 1024;
canvas.height = 576;

const c = canvas.getContext("2d");

const collitionsMap = [];
//*! en el for loop usamos 70 porque en el mapa hay 70 cubitos horizonatalmente entonces recoreremos en las hileras y vamos a separarlas en arrays
for (let i = 0; i < collitions.length; i += 70) {
  collitionsMap.push(collitions.slice(i, i + 70));
}

class Boundary {
  // esto lo ponemos para poder acceder incluso sin habler iniciado la clase, esoto para la parte donde estamos interando
  static width = 48;
  static height = 48;

  constructor({ position }) {
    this.position = position;
    this.width = 48; // es 48 poruqe hicimos zoom de 400% entonces de 12 pasó a 48
    this.height = 48;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];

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
            x: j * Boundary.width,
            y: i * Boundary.height,
          },
        })
      );
    }
  });
});

const image = new Image();
image.src = "./img/map/map.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

class Sprite {
  constructor({ position, velocity, image }) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

const background = new Sprite({
  position: {
    x: -1025,
    y: -800,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  image: image,
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

const animate = () => {
  window.requestAnimationFrame(animate);
  background.draw();
  c.drawImage(
    playerImage,

    //*argumentos para cortar
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    //* fin de argumentos para cortar

    //* coordenadas de posición

    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height / 2,

    //* tamaño de la imagen achicado para que no se alarge
    playerImage.width / 4,
    playerImage.height
  );

  if (keys.w.pressed && lastKey === "w") {
    background.position.y += 3;
  } else if (keys.a.pressed && lastKey === "a") {
    background.position.x += 3;
  } else if (keys.d.pressed && lastKey === "d") {
    background.position.x -= 3;
  } else if (keys.s.pressed && lastKey === "s") {
    background.position.y -= 3;
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
