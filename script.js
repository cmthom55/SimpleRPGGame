let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");
let text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
let mainAudio = document.querySelector('#mainAudio');
let ambience = document.querySelector('#ambience');
mainAudio.volume = .5;
ambience.volume = 1;
let locationImage = document.querySelector('#bodyToChange');
let monsterToShow = document.querySelector('#monsterToShow');

let storeBell = document.querySelector('#storeBell');
let storeCheckout = document.querySelector('#storeCheckout');
storeCheckout.volume = 1;
let attackSound = document.querySelector('#attackSound');
let defeatMonsterSound = document.querySelector('#defeatMonsterSound');
let dragonAttackSound = document.querySelector('#dragonAttackSound');
let wonRPS = document.querySelector('#wonRPS');
let lostRPS = document.querySelector('#lostRPS');
let lostToDog = document.querySelector('#lostToDog');
let wonAgainstDog = document.querySelector('#wonAgainstDog');

let lastChoice = "";
let numOfLosses = 0;
let roundNum = 0;

const atkPowerMultiplier = 1.5;
let successfulDodgeBlock = false;

mainAudio.play();
ambience.play();

let volume = document.querySelector("#volume-control");
volume.addEventListener("change", function(e) {
mainAudio.volume = e.currentTarget.value / 100;
ambience.volume = e.currentTarget.value / 100;
})

const images = ['town.jpg', 'store.avif', 'cave.jpg', 'caveEntrance.jpg', 'dragonHome.jpg'];
let currentImageIndex = 0;
let intervalId;

let itemToSteal = "";
let correctStealGuesses = 0;
let currentStealNum = 0;
let stealRecognition = false;

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
button4.onclick = winGame;

const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];

const monsters = [
  {
    name: "Slime",
    level: 2,
    health: 15
  },
  {
    name: "Fanged Beast",
    level: 8,
    health: 60
  },
  {
    name: "Dragon",
    level: 20,
    health: 300
  }
]

const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\".",
    mainAudioSrc: "Harvest Dawn.mp3",
    ambienceSrc: "townAmbience.mp3",
    locationSrc: "town.jpg"
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
    mainAudioSrc: "store.mp3",
    ambienceSrc: "storeAmbience.mp3",
    locationSrc: "store.avif"
  },
  {
    name: "cave",
    "button text": ["Fight Slime", "Fight Fanged Beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters.",
    mainAudioSrc: "cave.mp3",
    ambienceSrc: "caveAmbience.mp3",
    locationSrc: "cave.jpg" 
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
    
    mainAudioSrc: "",
    ambienceSrc: "",
    locationSrc: ""
    },
    {
    name: "kill monster",
    "button text": ["Continue to Plunder", "Go to town square", "Go to town square"],
    "button functions": [goCave, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
    mainAudioSrc: "Harvest Dawn.mp3",
    ambienceSrc: "caveAmbience.mp3",
    locationSrc: "cave.jpg"
    },
    {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You died. ☠️",
    mainAudioSrc: "loseMusic.mp3",
    ambienceSrc: "",
    locationSrc: "cave.jpg"
    },
    { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! 🎉",
    mainAudioSrc: "victoryMusic.mp3",
    ambienceSrc: "townCelebrate.mp3",
    locationSrc: "townCelebrate.jpg"
    },
    {
    name: "easter egg",
    "button text": ["Rock 🪨", "Paper 📃", "Scissors ✂️"],
    "button functions": [pickRock, pickPaper, pickScissors],
    text: "While walking out of the cave, You run into a dog! He says he is a rps master. You've been challenged. Round 1...",
    mainAudioSrc: "easterEgg.mp3",
    ambienceSrc: "easterEggAmbience.mp3",
    locationSrc: "caveEntrance.jpg"
    },
    {
      name: "steal",
      "button text": ["Higher", "Lower", "Cancel"],
      "button functions": [guessHigher, guessLower, goTown],
      text: "Guess if the next number will be higher or lower for a successful steal!",
      mainAudioSrc: "steal.mp3",
      ambienceSrc: "storeAmbience.mp3",
      locationSrc: "store.avif"
    }
];

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
  
  if(location.name === "fight"){
    assignMonSounds(fighting);
  } else {
    mainAudio.src = location.mainAudioSrc;
    ambience.src = location.ambienceSrc;
    locationImage.style.backgroundImage = "url('" + location.locationSrc + "')";
  } 

  if(fighting === 2 && location.name !== "win"){
    locationImage.style.backgroundImage = "url('dragonHome.jpg')";
  }

  if(location.name === "easter egg"){
    monsterToShow.src = "dog.gif"
  }

  if(location.name === "lose" || location.name === "win"){
    monsterToShow.src = ""
    startBackgroundChange();
  }

  if(location.name === "store" && stealRecognition === true){
    text.innerText = "Gail: \"HEY I REMEMBER YOU, THIEF! GET OUT OF MY STORE!\" Uh oh, think it's time to go...";
    updateButtonsForTown();
  }
}


function goTown() {
  monsterToShow.src = "";
  successfulDodgeBlock = false;
  fighting = 0;
  update(locations[0]);
}

function goStore() {
  storeBell.play();
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if(gold >= 10){
    gold-=10;
    health+=10;
    goldText.innerText = gold; 
    healthText.innerText = health;
    storeCheckout.play();
  } else {
    text.innerText = "You don't have enough gold, traveler.";
    button1.innerText = "Steal Health";
    button1.onclick = stealHealth;
  } 
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
      storeCheckout.play();
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
      button2.innerText = "Steal Weapon";
      button2.onclick = stealWeapon;
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
    storeCheckout.play();
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function stealWeapon(){
  correctStealGuesses = 0;
  currentStealNum = Math.floor(Math.random() * 10) + 1
  itemToSteal = "weapon";
  update(locations[8]);
  text.innerText += " The current number is " + currentStealNum + ".";
}

function stealHealth(){
  correctStealGuesses = 0;
  currentStealNum = Math.floor(Math.random() * 10) + 1
  itemToSteal = "health";
  update(locations[8]);
  text.innerText += " The current number is " + currentStealNum + ".";
}

function guessHigher(){
  startStealGame("higher");
}

function guessLower(){
  startStealGame("lower");
}

function startStealGame(guess){
  startMoveStealCursor(guess);
}

function startMoveStealCursor(guess) {
  const numToCompare = Math.floor(Math.random() * 10) + 1;
  if((guess === "higher" && numToCompare >= currentStealNum) || (guess === "lower" && numToCompare <= currentStealNum)){
      correctStealGuesses++;
    
    if (correctStealGuesses === 2) {
      text.innerText = "Correct! The number was " + numToCompare + "."
        if (itemToSteal === "health") {
            text.innerText += " You successfully stole two health potions! +20HP";
            health += 20;
            healthText.innerText = health;
        } else if (itemToSteal === "weapon") {
            currentWeapon++;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText += " You successfully stole a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
        }
      wonAgainstDog.play();
      updateButtonsForTown();
      stealRecognition = true;
    } else {
      text.innerText = "Correct! The number was " + numToCompare + ". One more guess and you'll be home free!";
      currentStealNum = Math.floor(Math.random() * 10) + 1;
      text.innerText+=" The current number now is " + currentStealNum + ".";
      wonRPS.play();
    }
  } else {
    text.innerText = " Incorrect! The number was " + numToCompare + ". Gail caught you red-handed!! You were forcibly kicked out of the store!! -10HP";
    health -= 10;
    healthText.innerText = health;
    lostToDog.play();
    if (health <= 0) {
        lose();
    }
    updateButtonsForTown();
    stealRecognition = true;
  }
}

function updateButtonsForTown() {
    button1.innerText = "Go to town square";
    button1.onclick = goTown;
    button2.innerText = "Go to town square";
    button2.onclick = goTown;
    button3.innerText = "Go to town square";
    button3.onclick = goTown;
}

function fightSlime() {
  monsterToShow.src = "slime.png";
  fighting = 0;
  goFight();
}

function fightBeast() {
  monsterToShow.src = "fangedBeast.png";
  fighting = 1;
  goFight();
}

function fightDragon() {
  monsterToShow.src = "dragon.png";
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    if(successfulDodgeBlock){
      monsterHealth -= (weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1) * atkPowerMultiplier;
      successfulDodgeBlock = false;
    } else {
      monsterHealth -= (weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1);
    }
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;   
    attackSound.play();
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if(fighting === 2){
    dragonAttackSound.play();
  }
  if (health <= 0) {
    monsterToShow.src = "";
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      monsterToShow.src = "";
      winGame();
    } else {
      monsterToShow.src = "";
      defeatMonsterSound.play();
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  const outcome = Math.floor(Math.random()*4);
  if(outcome <= 1) {
    if(xp > 19 && outcome === 1) {
      text.innerText = "You barely dodge the attack from the " + monsters[fighting].name + "! You feel alive!! +10 HP";
      health+=10;
      healthText.innerText = health;
    } else {
      health -= getMonsterAttackValue(monsters[fighting].level);
      healthText.innerText = health;
      if (health <= 0) {
        lose();
      } else {
        text.innerText = "You failed to dodge the attack from the " + monsters[fighting].name + "! You were hit!!";
      }
    }
  } else if (outcome === 2) {
   text.innerText = "You completely dodged the attack from the " + monsters[fighting].name + "! You recover while the monster is dazed!! +20 HP";
    health+=20;
    healthText.innerText = health;
  } else if (outcome === 3) {
    text.innerText = "You dodge the first hit from the " + monsters[fighting].name + " but it goes for another attack. You barely block it!! This fills you with the strength to keep going!! +ATK";
    successfulDodgeBlock = true;
  }
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  stealRecognition = false;
  update(locations[4]);
}

function assignMonSounds(){
  if(fighting == 0){
    mainAudio.src = "fight.mp3";
    ambience.src = "slime.mp3";
    locationImage.style.backgroundImage = "url('cave.jpg')";
  } else if (fighting == 1){
    mainAudio.src = "fight.mp3";
    ambience.src = "fangedBeast.mp3";
    locationImage.style.backgroundImage = "url('cave.jpg')";
  } else if (fighting == 2){
    mainAudio.src = "dragonFight.mp3";
    ambience.src = "dragonAmbience.mp3";
    locationImage.style.backgroundImage = "url('cave.jpg')";
  }
}

function lose() {
  update(locations[5]);
}

function changeBackground() {
    document.body.style.backgroundImage = `url('${images[currentImageIndex]}')`;
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

function startBackgroundChange() {
    locationImage.classList.add('animated-body');
    button1.classList.add('replayButton');
    button2.classList.add('replayButton');
    button3.classList.add('replayButton');
  
  const replayButtons = document.getElementsByClassName('replayButton');
  for (let i = 0; i < replayButtons.length; i++) {
      replayButtons[i].addEventListener('click', function() {
          stopBackgroundChange();
          currentImageIndex = 0;
      });
  }
    intervalId = setInterval(changeBackground, 5000); 
}

function stopBackgroundChange() {
  locationImage.classList.remove('animated-body');
  removeReplayButtonListeners();
  button1.classList.remove('replayButton');
  button2.classList.remove('replayButton');
  button3.classList.remove('replayButton');
  clearInterval(intervalId);
}

function removeReplayButtonListeners() {
    const replayButtons = document.getElementsByClassName('replayButton');
    for (let i = 0; i < replayButtons.length; i++) {
        const button = replayButtons[i];
        button.removeEventListener('click', replayButtonClickHandler);
    }
}

function replayButtonClickHandler() {
    stopBackgroundChange();
    currentImageIndex = 0;
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  roundNum = 0;
  numOfLosses = 0;
  lastChoice = "";
  update(locations[7]);
}

function pickRock() {
  pick("rock");
}

function pickPaper() {
  pick("paper");
}

function pickScissors() {
  pick("scissors");
}

function pick(guess) {
  let guesses = [];
  let cpuPick = "";
  if(lastChoice === "") {
    guesses = ["rock", "paper", "scissors"];
    cpuPick = guesses[Math.floor(Math.random() * 3)];
  } else if (lastChoice === "paper") {
    guesses = ["paper", "scissors"];
    cpuPick = guesses[Math.floor(Math.random() * 2)];
  } else if (lastChoice === "scissors") {
    guesses = ["scissors", "rock"];
    cpuPick = guesses[Math.floor(Math.random() * 2)];
  } else if (lastChoice === "rock"){
    guesses = ["rock", "paper"];
    cpuPick = guesses[Math.floor(Math.random() * 2)];
  }


    if(cpuPick === guess){
      text.innerText = "You tied with the dog.";
      numOfLosses+=0.5;
    } else if (cpuPick === "rock" && guess === "paper" || cpuPick === "paper" && guess === "scissors" || cpuPick === "scissors" && guess === "rock"){
      text.innerText = "You beat the dog!!";
      wonRPS.play();
    } else if (cpuPick === "rock" && guess === "scissors" || cpuPick === "paper" && guess === "rock" || cpuPick === "scissors" && guess === "paper"){
      text.innerText = "You lost to the dog.";
        numOfLosses++;
        lostRPS.play();
        }
  
  roundNum++;
  const nextRoundNum = roundNum + 1;
  
  if(roundNum !== 3){
    text.innerText += " Now onto Round " + nextRoundNum + "!"
  } else if(numOfLosses > 1) {
    text.innerText += " The dog has beaten you! You lose ten health. :(";
    health-=10;
    healthText.innerText = health;
    lostToDog.play();
    if (health <= 0){
      lose();
    }
  } else if (numOfLosses === 0){
    text.innerText += " You have beaten the dog with all wins!! Great job! +60 gold. +20 Health :)";
    gold+=60;
    goldText.innerText = gold;
    health+=20;
    healthText.innerText = health;
    wonAgainstDog.play();
  } else {
    text.innerText += " You have held your own!! Good job!! +30 gold. :)"
    gold+=30;
    goldText.innerText = gold;
    wonAgainstDog.play();
  }
  
  if(roundNum === 3){
    updateButtonsForTown();
  }
}
