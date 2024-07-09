import platformImg from "./assets/platform.png";
import hillsImg from "./assets/hills.png";
import backgroundImg from "./assets/background.png";
import platformSmallTallImg from "./assets/platformSmallTall.png";

//
import spriteRunLeft from "./assets/spriteRunLeft.png";
import spriteRunRight from "./assets/spriteRunRight.png";
import spriteStandLeft from "./assets/spriteStandLeft.png";
import spriteStandRight from "./assets/spriteStandRight.png";

const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
) as HTMLCanvasElement;

canvas.width = innerWidth;
canvas.height = innerHeight;

const canvasContext = canvas.getContext("2d");

// INTERFACE
interface PositionInterface {
  x: number;
  y: number;
}
interface VelocityInterface {
  x: number;
  y: number;
}

// Variables
const gravity = 0.5;
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};
let scrollOfSet: number = 0;
let lastKey: string = "";

function createImage(imageSrc: string): HTMLImageElement {
  const image = new Image();
  image.src = imageSrc;

  return image;
}

const platformImage = createImage(platformImg);
const hillsImage = createImage(hillsImg);
const backgroundImage = createImage(backgroundImg);
const platformSmallTallImage = createImage(platformSmallTallImg);

const spriteRunLeftImage = createImage(spriteRunLeft);
const spriteRunRightImage = createImage(spriteRunRight);
const spriteStandLeftImage = createImage(spriteStandLeft);
const spriteStandRightImage = createImage(spriteStandRight);

// PLAYER CLASS
class Player {
  position: PositionInterface;
  width: number;
  height: number;
  speed: number;
  velocity: VelocityInterface;
  frame: number;
  image: HTMLImageElement;
  sprites: {
    stand: {
      right: HTMLImageElement;
      left: HTMLImageElement;
      cropWidth: number;
      width: number;
    };
    run: {
      right: HTMLImageElement;
      left: HTMLImageElement;
      cropWidth: number;
      width: number;
    };
  };
  currentSprite: HTMLImageElement;
  currentCropWidth: number;

  constructor(
    position: PositionInterface,
    width: number,
    height: number,
    velocity: VelocityInterface
  ) {
    this.sprites = {
      stand: {
        right: spriteStandRightImage,
        left: spriteStandLeftImage,
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: spriteRunRightImage,
        left: spriteRunLeftImage,
        cropWidth: 341,
        width: 127.875,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;

    this.position = position;
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.speed = 10;
    this.frame = 0;
    this.image = this.currentSprite;
  }

  draw() {
    // canvasContext!.fillStyle = "red";
    // canvasContext?.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.width,
    //   this.height
    // );

    canvasContext?.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frame,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frame++;

    if (
      this.frame > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frame = 0;
    } else if (
      this.frame > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frame = 0;
    }

    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height < canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

class Platform {
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  image: HTMLImageElement;

  constructor({
    x,
    y,
    image,
  }: {
    x: number;
    y: number;
    image: HTMLImageElement;
  }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = 5;
  }

  draw() {
    // canvasContext!.fillStyle = "blue";
    // canvasContext?.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.width,
    //   this.height
    // );

    canvasContext?.drawImage(this.image, this.position.x, this.position.y);
  }
}
class GenericObject {
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  image: HTMLImageElement;

  constructor({
    x,
    y,
    image,
  }: {
    x: number;
    y: number;
    image: HTMLImageElement;
  }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = 5;
  }

  draw() {
    canvasContext?.drawImage(this.image, this.position.x, this.position.y);
  }
}

let player = new Player({ x: 100, y: 100 }, 30, 30, { x: 0, y: 0 });
let platforms: Platform[] = [];
let genericObjects: GenericObject[] = [];

function init() {
  player = new Player({ x: 100, y: 100 }, 66, 130, { x: 0, y: 0 });
  platforms = [
    new Platform({
      x:
        platformImage.width * 4 +
        300 +
        platformImage.width -
        platformSmallTallImage.width,
      y: canvas.height - platformSmallTallImage.height,
      image: platformSmallTallImage,
    }),
    new Platform({
      x: -1,
      y: canvas.height - platformImage.height,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width - 5,
      y: canvas.height - platformImage.height,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: canvas.height - platformImage.height,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 3 + 300,
      y: canvas.height - platformImage.height,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 4 + 300 - 3,
      y: canvas.height - platformImage.height,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 5 + 600,
      y: canvas.height - platformImage.height,
      image: platformImage,
    }),
  ];
  genericObjects = [
    new GenericObject({ x: 0, y: 0, image: backgroundImage }),
    new GenericObject({
      x: 0,
      y: 0,
      image: hillsImage,
    }),
  ];
  scrollOfSet = 0;
}

function animate() {
  requestAnimationFrame(animate);
  canvasContext?.clearRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });

  // the last thing we draw has the higher z-index
  player.update();

  if (
    keys.right.pressed &&
    player.position.x + player.width <= canvas.width / 2
  ) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOfSet === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    // Moving platform
    if (keys.right.pressed) {
      scrollOfSet += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.6;
      });
    } else if (keys.left.pressed && scrollOfSet > 0) {
      scrollOfSet -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.6;
      });
    }
  }

  // Platform collision detection
  // stopping player on the platform
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // Sprite switching
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frame = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  // win condition
  if (scrollOfSet > platformImage.width * 5 + 500) {
    console.log("win!!");
  }

  // Lose condition
  if (player.position.y + player.height > canvas.height) {
    console.log("you lose");
    init();
  }
}

init();
animate();

// Eventlistener
addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case "d":
      keys.right.pressed = true;
      lastKey = "right";
      break;
    case "s":
      break;
    case "w":
      player.velocity.y -= 10;
      break;
    case "ArrowUp":
      player.velocity.y -= 10;
      break;
    case "ArrowLeft":
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case "ArrowRight":
      keys.right.pressed = true;
      lastKey = "right";
      break;

    default:
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.left.pressed = false;
      break;
    case "d":
      keys.right.pressed = false;
      break;
    case "s":
      break;
    case "w":
      player.velocity.y -= 0;
      break;
    case "ArrowUp":
      player.velocity.y -= 0;
      break;
    case "ArrowLeft":
      keys.left.pressed = false;
      break;
    case "ArrowRight":
      keys.right.pressed = false;
      break;

    default:
      break;
  }
});
