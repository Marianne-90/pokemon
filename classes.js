class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 }, sprites }) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.moving = false;
    this.sprites = sprites;
  }

  draw() {
    // if (this.image.src === "http://127.0.0.1:5501/img/mapBase.png") {
    //   console.log(this.position.x, this.position.y);
    //   c.drawImage(
    //     this.image,
    //     //*argumentos para cortar
    //     this.frames.val * this.width,
    //     0,
    //     this.image.width / this.frames.max,
    //     this.image.height,
    //     //* fin de argumentos para cortar
    //     this.position.x,
    //     this.position.y,
    //     //* tamaño de la imagen achicado para que no se alarge
    //     this.image.width / this.frames.max,
    //     this.image.height
    //   );
    //   return;
    // }

    c.drawImage(
      this.image,

      //*argumentos para cortar
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      //* fin de argumentos para cortar
      //* coordenadas de posición
      this.position.x,
      this.position.y,

      //* tamaño de la imagen achicado para que no se alarge
      this.image.width / this.frames.max,
      this.image.height
    );
    if (!this.moving) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val++;
      } else {
        this.frames.val = 0;
      }
    }
  }
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
    c.fillStyle = "rgba(255, 0 , 0, .0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
