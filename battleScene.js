const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/figth/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

const draggle = new Monster(monsters.Draggle);

const emby = new Monster(monsters.Emby);

const renderedSprites = [draggle, emby]; //*! esto es para dibujar cosas ya sea temporales o fijas, así da más control tanto para que desaparezcan como para el órden por ejemplo si quieres que algo esté detrás

emby.attacks.forEach((attack) => {
  const button = document.createElement("button");
  button.innerHTML = attack.name;
  document.querySelector("#attacksBox").append(button);
});

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  emby.draw();
  draggle.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

const queue = [];

// los event listeners para los botones de ataque
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];

    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites,
    });

    if(draggle.health <= 0){
      queue.push(() => {
        draggle.faint();
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
  });

  button.addEventListener("mouseenter", (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    document.querySelector('#attackType').innerHTML = selectedAttack.type;
    document.querySelector('#attackType').style.color = selectedAttack.color;
  });
});

document.querySelector("#dialogBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else {
    e.currentTarget.style.display = "none";
  }
});
