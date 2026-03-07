document.addEventListener("DOMContentLoaded", function () {
  const wheel = document.getElementById("Wheel");
  const spinBtn = document.getElementById("spin-btn");
  const result = document.getElementById("result");
  const spinSound = document.getElementById("spinSound");
  const winSound = document.getElementById("winSound");
  const loseSound = document.getElementById("loseSound");
  const cheatBtn = document.getElementById("cheatBtn");

  // Configuración de la rueda
  const SEGMENTS = 9;
  const DEGREES_PER_SEGMENT = 360 / SEGMENTS;
  const WINNING_ANGLE = 40; // Ángulo exacto para el segmento 3 (120°)
  const WINNING_SEGMENTS = [9]; // Segmentos ganadores
  const GUARANTEED_WIN_ANGLE = 50; // Ángulo fijo para ganar cada 5 jugadas

  let playCount = 0;
  let totalRotation = 0;
  let isSpinning = false;

  function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;

    playCount++;
    const forceWin = playCount % 505 === 0;
    if (forceWin) playCount = 0;

    result.textContent = "";
    result.classList.remove("winner");

    // Configurar parámetros del giro
    const MIN_SPINS = 5;
    const EXTRA_SPINS = Math.floor(Math.random() * 5);
    const TOTAL_SPINS = MIN_SPINS + EXTRA_SPINS;

    // Calcular rotación necesaria
    let targetAngle;
    if (forceWin) {
      targetAngle = WINNING_ANGLE; // Ángulo exacto del segmento ganador
      console.log("Forzando ángulo ganador: Segmento " + WINNING_SEGMENTS);
    } else {
      // Generar ángulo aleatorio que NO coincida con el segmento ganador
      let randomSegment;
      do {
        randomSegment = Math.floor(Math.random() * SEGMENTS);
      } while (randomSegment === 1); // Evitar el segmento ganador
      console.log(randomSegment);

      targetAngle =
        randomSegment * DEGREES_PER_SEGMENT + DEGREES_PER_SEGMENT / 2;
    }
    // Cálculo preciso para llegar al ángulo objetivo
    const currentPosition = totalRotation % 360;
    let rotationNeeded = (360 - currentPosition + targetAngle) % 360;
    rotationNeeded += 360 * TOTAL_SPINS;

    // Aplicar rotación
    totalRotation += rotationNeeded;
    wheel.style.transition = "transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)";
    wheel.style.transform = `rotate(${totalRotation}deg)`;

    // Sonido
    spinSound.currentTime = 0;
    spinSound.play();

    // Determinar resultado
    setTimeout(() => {
      const normalizedRotation = (360 - (totalRotation % 360)) % 360;
      const segmentIndex = Math.floor(normalizedRotation / DEGREES_PER_SEGMENT);
      const isWinner = forceWin || WINNING_SEGMENTS.includes(segmentIndex + 1);

      if (isWinner) {
        winSound.play();
        result.classList.add("winner");
      } else {
        loseSound.play();
      }

      console.log(
        `Ángulo final: ${normalizedRotation.toFixed(1)}°`,
        `Segmento: ${segmentIndex + 2}`,
        `Ganador: ${isWinner}`
      );

      isSpinning = false;
      spinBtn.disabled = false;
    }, 4000);
  }

  spinBtn.addEventListener("click", spinWheel);

  // Precargar sonidos
  function preloadSounds() {
    [spinSound, winSound, loseSound].forEach((sound) => {
      sound.volume = sound === spinSound ? 0.5 : 0.7;
      sound.load();
    });
  }
  function cheats() {
    playCount = 504;
    console.log("Trampa activada");
  }
  document.addEventListener("click", preloadSounds, { once: true });
  cheatBtn.addEventListener("click", cheats);
});
