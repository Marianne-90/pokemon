class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    isEnemy = false,
    rotation = 0,
  }) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.health = 100;
    this.isEnemy = isEnemy;
    this.rotation = rotation;
  }

  draw() {
    c.save(); //*! este y el restore se están añadiendo porque se va a añadir una variable que afecta todo el canvas y con esto y el restore más abajo lo que va a hacer es afectar solo esta parte
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    ); //*! esto modifica el pundo central, lo que en  photoshop sería la tachita, de esta forma ya no está por default en una esquina si no a la mitad del elemento y podemos rotarmo sin efectos raros
    c.rotate(this.rotation);

    //*! hay que regresar el punto central si no los otros elementos hacen cosas raras
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );

    c.globalAlpha = this.opacity;

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
    c.restore();
    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val++;
      } else {
        this.frames.val = 0;
      }
    }
  }

  attack({ attack, recipient, renderedSprites }) {

    document.querySelector('#dialogBox').style.display = "block";

    let movementDistance = 20;
    let healthBar = "#enemyHealthBar";
    let rotation = 1;

    if (this.isEnemy) {
      healthBar = "#playerHealthBar";
      movementDistance = -20;
      rotation = -2.2;
    }

    recipient.health -= attack.damage;

    switch (attack.name) {
      case "Tackle":
        // MOVER ATACADOR
        const tl = gsap.timeline(); //*! esto sirve para hacer línea del tiempo

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              // enemy gets hit in de health bar
              gsap.to(healthBar, {
                width: recipient.health + "%",
              });

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });

              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });

        break;
      case "Fireball":
        // hacemos el Sprite de la bola de fuego

        const fireballImage = new Image();
        fireballImage.src = "./img/figth/fireball.png";

        const fireball = new Sprite({
          position: { x: this.position.x, y: this.position.y },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation,
        });

        renderedSprites.splice(1, 0, fireball);

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            // enemy gets hit in de health bar
            gsap.to(healthBar, {
              width: recipient.health + "%",
            });

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            });
            renderedSprites.splice(1, 1);
          },
        });

        break;
      default:
        break;
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
