const draggleImage = new Image();
draggleImage.src = "./img/figth/draggleSprite.png";

const embyImage = new Image();
embyImage.src = "./img/figth/embySprite.png";

const monsters = {
  Emby: {
    position: {
      x: 300,
      y: 320,
    },
    image: embyImage,
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    name: "Emby",
    attacks:[attacks.Fireball, attacks.Tackle],
  },
  Draggle: {
    position: {
      x: 800,
      y: 100,
    },
    image: draggleImage,
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Draggle",
    attacks:[attacks.Fireball, attacks.Tackle],
  },
};
