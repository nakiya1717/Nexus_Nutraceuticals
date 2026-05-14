import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Form handling
  const form = document.querySelector('#notify-form');
  const successMsg = document.querySelector('#success-msg');
  const emailInput = document.querySelector('#email');
  const btn = document.querySelector('.btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (emailInput.value) {
      // Simulate API call and success state
      btn.innerHTML = '<span>Submitting...</span>';
      setTimeout(() => {
        form.style.display = 'none';
        successMsg.classList.remove('hidden');
      }, 1000);
    }
  });

  // Particles background for an active, wellness feel
  initParticles();
});

function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  let ripples = [];

  // Colors based on the provided reference
  const colors = [
    '243, 156, 18',   // Orange/Yellow
    '0, 188, 212',    // Cyan
    '231, 76, 60',    // Red
    '52, 152, 219',   // Blue
    '232, 67, 147',   // Pink
    '46, 204, 113',   // Green
  ];

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  
  window.addEventListener('resize', resize);
  resize();

  let mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('click', (e) => {
    let x = e.clientX;
    let y = e.clientY;
    
    // Create an expanding ripple effect
    ripples.push({
      x: x,
      y: y,
      radius: 0,
      opacity: 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    
    // Create explosion of mini particles
    for (let i = 0; i < 15; i++) {
      particles.push(new Particle(x, y, true));
    }
  });

  class Particle {
    constructor(x, y, isExplosion = false) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * height;
      
      // Sizes from reference image are mixed. Some large strokes, some small dots.
      this.baseSize = isExplosion ? (Math.random() * 4 + 2) : (Math.random() * 20 + 5);
      this.size = this.baseSize;
      
      this.speedX = (Math.random() - 0.5) * (isExplosion ? 10 : 1.5);
      this.speedY = (Math.random() - 0.5) * (isExplosion ? 10 : 1.5);
      
      this.color = colors[Math.floor(Math.random() * colors.length)];
      // Randomly choose stroke or filled
      this.isStroked = Math.random() > 0.5;
      
      this.isExplosion = isExplosion;
      this.life = isExplosion ? 100 : Infinity;
    }
    
    update() {
      // Gentle dodge effect on mouse move
      if (mouse.x != null && mouse.y != null && !this.isExplosion) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          this.x -= (dx / dist) * 2;
          this.y -= (dy / dist) * 2;
        }
      }

      this.x += this.speedX;
      this.y += this.speedY;

      if (!this.isExplosion) {
        // Wrap around edges to maintain constant particle count easily
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
      } else {
        this.life -= 2;
        this.speedX *= 0.95; // friction
        this.speedY *= 0.95;
      }
    }
    
    draw() {
      let alpha = this.isExplosion ? Math.max(0, this.life / 100) : 0.6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      if (this.isStroked && !this.isExplosion) {
         ctx.lineWidth = 3;
         ctx.strokeStyle = `rgba(${this.color}, ${alpha + 0.2})`; // Slightly more visible stroke
         ctx.stroke();
      } else {
         ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
         ctx.fill();
      }
    }
  }

  const particleCount = window.innerWidth < 768 ? 40 : 80;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      let r = ripples[i];
      r.radius += 6;
      r.opacity -= 0.03;
      if (r.opacity <= 0) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.color}, ${r.opacity})`;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.update();
      p.draw();
      if (p.isExplosion && p.life <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animate);
  }
  
  animate();
}
