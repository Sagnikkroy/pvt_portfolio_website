(function() {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Responsive sizing
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const text = 'Get in touch '.repeat(50);

  let offset1 = 0;
  let offset2 = 0;
  let offset3 = 0;

  function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textBaseline = 'middle';
    ctx.font = '32px Arial';

    // Three independent wave layers
    const waves = [
      {
        speed: 0.010,
        amplitude: 35,
        opacity: 1,
        offset: offset1,
        frequency: 0.004 * (1400 / canvas.width),
        phase: 0 // top layer
      },
      {
        speed: 0.007,
        amplitude: 45,
        opacity: 0.3,
        offset: offset2,
        frequency: 0.0028 * (1400 / canvas.width),
        phase: Math.PI / 6 // middle layer
      },
      {
        speed: 0.1,
        amplitude: 55,
        opacity: 0.15,
        offset: offset3,
        frequency: 0.002 * (1800 / canvas.width),
        phase: Math.PI / 4 // bottom layer
      }
    ];

    // Draw all waves
    waves.forEach((wave, i) => {
      let x = -50;
      let charIndex = 0;
      wave.offset += wave.speed;

      const frequency = wave.frequency;
      const phase = wave.phase;

      while (x < canvas.width + 50) {
        const char = text[charIndex % text.length];

        const organicWave1 = Math.sin((x + wave.offset * 50) * frequency + phase);
        const organicWave2 = Math.sin((x + wave.offset * 30) * frequency * 1.7 + phase) * 0.4;
        const organicWave3 = Math.cos((x + wave.offset * 40) * frequency * 0.8 + phase) * 0.3;

        const amplitude = wave.amplitude * (1 + Math.sin(wave.offset + x * 0.005) * 0.3);
        const y =
          canvas.height / 2 +
          (organicWave1 + organicWave2 + organicWave3) * amplitude;

        const distanceFromCenter = Math.abs(x - canvas.width / 2);
        const maxDistance = canvas.width / 2;
        const fade = 1 - (distanceFromCenter / maxDistance) * 0.6;

        ctx.fillStyle = `rgba(255, 255, 255, ${wave.opacity * fade})`;

        ctx.save();

        const nextX = x + 5;
        const nextOrganicWave1 = Math.sin((nextX + wave.offset * 50) * frequency + phase);
        const nextOrganicWave2 = Math.sin((nextX + wave.offset * 30) * frequency * 1.7 + phase) * 0.4;
        const nextOrganicWave3 = Math.cos((nextX + wave.offset * 40) * frequency * 0.8 + phase) * 0.3;
        const nextAmplitude =
          wave.amplitude * (1 + Math.sin(wave.offset + nextX * 0.005) * 0.3);
        const nextY =
          canvas.height / 2 +
          (nextOrganicWave1 + nextOrganicWave2 + nextOrganicWave3) * nextAmplitude;

        const angle = Math.atan2(nextY - y, nextX - x);

        // vertically stagger the layers
        const verticalOffset = i === 1 ? 10 : i === 2 ? 20 : 0;

        ctx.translate(x, y + verticalOffset);
        ctx.rotate(angle);
        ctx.fillText(char, 0, 0);
        ctx.restore();

        const metrics = ctx.measureText(char);
        x += metrics.width + 2;
        charIndex++;
      }
    });

    offset1 += 0.01;
    offset2 += 0.007;
    offset3 -= 0.0045;

    requestAnimationFrame(drawWave);
  }

  drawWave();
})();
