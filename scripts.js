const dino = document.getElementById("dino");

function jump() {
  // Only add the jump class if it isn't already added
  if (dino.classList != "jump") {
    dino.classList.add("jump");

    setTimeout(function () {
      dino.classList.remove("jump");
    }, 300)
  }
}

let isAlive = setInterval(function () {
  // Pixel integer value equal to the position of the top of the trex
  let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
  
  // Px integer value equal to the position of the cactus
  let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

  // End game if cactus is over trex and the trex isn't high enough in the air
  if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {
    alert("Game Over!")
  }
}, 10)

// Run the jump method when spacebar is pressed
document.addEventListener("keydown", function (event) {
  if (event.keyCode === 32) {
    jump();
  }
});


// Hightscore and score count