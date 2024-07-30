document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const gameContainer = document.getElementById('game-container');
    const timeEl = document.getElementById('time');
    const scoreEl = document.getElementById('score');
    const message = document.getElementById('message');
    const levelEl = document.createElement('h3');
    levelEl.className = 'level';
    gameContainer.appendChild(levelEl);
  
    let seconds = 0;
    let score = 0;
    let baseScore = 0; // Base score to maintain the score across levels
    let selectedInsect = {};
    let level = 1;
    let insectInterval = 2000; // Initial interval for new insects
    let insectTimeout;
    let gameInterval;
    let missedInsects = 0;
    const maxMissedInsects = 10; // Game over condition
    const maxLevels = 10; // Total levels
  
    levelEl.textContent = `Level: ${level}`;
  
    document.getElementById('start-btn').addEventListener('click', () => {
      screens[0].classList.add('up');
    });
  
    document.querySelectorAll('.choose-insect-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedInsect = {
          src: btn.querySelector('img').src,
          alt: btn.querySelector('img').alt
        };
        screens[1].classList.add('up');
        setTimeout(createInsect, 1000);
        startGame();
      });
    });
  
    function startGame() {
      gameInterval = setInterval(increaseTime, 1000);
      insectTimeout = setInterval(createInsect, insectInterval);
    }
  
    function increaseTime() {
      seconds++;
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      timeEl.textContent = `Time: ${m}:${s}`;
    }
  
    function createInsect() {
      if (missedInsects >= maxMissedInsects) {
        endGame(false);
        return;
      }
  
      const insect = document.createElement('div');
      insect.classList.add('insect');
      const { x, y } = getRandomLocation();
      insect.style.top = `${y}px`;
      insect.style.left = `${x}px`;
      insect.innerHTML = `<img src="${selectedInsect.src}" alt="${selectedInsect.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;
  
      insect.addEventListener('click', catchInsect);
      insect.addEventListener('animationend', () => {
        if (!insect.classList.contains('caught')) {
          missedInsects++;
          insect.remove();
          checkMissedInsects();
        }
      });
      gameContainer.appendChild(insect);
    }
  
    function getRandomLocation() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = Math.random() * (width - 200) + 100;
      const y = Math.random() * (height - 200) + 100;
      return { x, y };
    }
  
    function catchInsect() {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      this.classList.add('caught');
      setTimeout(() => this.remove(), 2000);
  
      if (score - baseScore === 10) { // Check if 10 points have been scored in the current level
        clearInterval(gameInterval);
        clearInterval(insectTimeout);
        promptNextAction();
      }
    }
  
    function promptNextAction() {
      message.textContent = `Level ${level} complete! Replay level or proceed to the next level?`;
      message.classList.add('visible');
      
      const replayButton = document.createElement('button');
      const nextButton = document.createElement('button');
      
      replayButton.textContent = "Replay Level";
      nextButton.textContent = "Next Level";
      
      replayButton.addEventListener('click', () => {
        message.classList.remove('visible');
        replayButton.remove();
        nextButton.remove();
        resetLevel();
      });
      
      nextButton.addEventListener('click', () => {
        message.classList.remove('visible');
        replayButton.remove();
        nextButton.remove();
        advanceLevel();
      });
      
      gameContainer.appendChild(replayButton);
      gameContainer.appendChild(nextButton);
    }
  
    function resetLevel() {
      // Keep score and time as they are
      scoreEl.textContent = `Score: ${score}`;
      timeEl.textContent = `Time: ${formatTime(seconds)}`;
      gameContainer.querySelectorAll('.insect').forEach(insect => insect.remove()); // Remove all insects
      missedInsects = 0; // Reset missed insects count
  
      // Restart the insect creation
      gameInterval = setInterval(increaseTime, 1000);
      insectTimeout = setInterval(createInsect, insectInterval);
    }
  
    function advanceLevel() {
      if (level >= maxLevels) {
        endGame(true);
        return;
      }
  
      level++;
      levelEl.textContent = `Level: ${level}`;
      baseScore = score; // Update base score to the current score for the new level
      missedInsects = 0;
  
      // Remove only insects, not the entire game container content
      gameContainer.querySelectorAll('.insect').forEach(insect => insect.remove());
  
      // Increase difficulty
      if (insectInterval > 800) insectInterval -= 200; // Reduce interval for insect spawn rate
      clearInterval(gameInterval);
      clearInterval(insectTimeout);
      gameInterval = setInterval(increaseTime, 1000);
      insectTimeout = setInterval(createInsect, insectInterval);
  
      // Display level up message
      message.textContent = `Level ${level} - Ready for the next challenge?`;
      message.classList.add('visible');
      setTimeout(() => message.classList.remove('visible'), 3000);
    }
  
    function checkMissedInsects() {
      if (missedInsects >= maxMissedInsects) {
        endGame(false);
      }
    }
  
    function endGame(isVictory) {
      clearInterval(gameInterval);
      clearInterval(insectTimeout);
  
      if (isVictory) {
        message.textContent = `Congratulations! You've completed all ${maxLevels} levels! You won!`;
      } else {
        message.textContent = `Game Over! You missed ${missedInsects} insects.`;
      }
      message.classList.add('visible');
      setTimeout(() => message.classList.remove('visible'), 5000);
    }
  
    function formatTime(totalSeconds) {
      const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
      const s = (totalSeconds % 60).toString().padStart(2, '0');
      return `Time: ${m}:${s}`;
    }
  });
  