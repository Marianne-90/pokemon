const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/figth/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let draggle;
let emby;
let renderedSprites; //*! esto es para dibujar cosas ya sea temporales o fijas, así da más control tanto para que desaparezcan como para el órden por ejemplo si quieres que algo esté detrás
let queue;
let battleAnimationId;

function initBattle() {
  //  AJUSTES HTML
  document.querySelector("#userInterfece").style.display = "block";
  document.querySelector("#dialogBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#playerHealthBar").style.width = "100%";
  document.querySelector("#attacksBox").replaceChildren();

  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);

  renderedSprites = [draggle, emby];

  emby.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector("#attacksBox").append(button);
  });

  queue = [];

  // los event listeners para los botones de ataque
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];

      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites,
      });

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint();
        });
        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector("#userInterfece").style.display = "none";
              gsap.to("#overlappingDiv", {
                opacity: 0,
              });

              battle.initiated = false;
              audio.Map.play()
            },
          });
        });
        return;
      }
      //DRAGGLE OR ENEMY ATACKS RIGHT HERE
      const randomAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites,
        });
      });

      //*! esto es como para ver en el futuro porque se añade en la tabla de ejecución después de que se evalua esto por lo que la vida se salta un turno
      if (emby.health - randomAttack.damage <= 0) {
        queue.push(() => {
          emby.faint();
        });

        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector("#userInterfece").style.display = "none";
              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
              
              audio.Map.play()
              battle.initiated = false;
            },
          });
        });

        return;
      }
    });

    button.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector("#attackType").innerHTML = selectedAttack.type;
      document.querySelector("#attackType").style.color = selectedAttack.color;
    });
  });
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);

  battleBackground.draw();
  emby.draw();
  draggle.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

document.querySelector("#dialogBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else {
    e.currentTarget.style.display = "none";
  }
});
