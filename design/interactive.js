// Interactive mouse tracking effects for UI panels
document.addEventListener('DOMContentLoaded', function() {
  // Get all interactive panels
  const panels = document.querySelectorAll('[data-interactive="panel"]');

  panels.forEach(panel => {
    const rect = panel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Calculate distance and angle
      const distX = (mouseX - centerX) / 50;
      const distY = (mouseY - centerY) / 50;

      // Apply transform with smooth easing
      const rotateX = Math.max(-15, Math.min(15, -distY * 0.5));
      const rotateY = Math.max(-15, Math.min(15, distX * 0.5));
      const scale = 1 + Math.abs(distX + distY) / 400;

      panel.style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(${Math.min(scale, 1.05)})
      `;

      // Add glow effect near cursor
      const distance = Math.sqrt(distX * distX + distY * distY);
      if (distance < 300) {
        const glowIntensity = Math.max(0, 1 - distance / 300);
        panel.style.boxShadow = `
          inset 0 1px 0 rgba(255,255,255,.08),
          0 0 ${20 + glowIntensity * 30}px rgba(255,138,53,${glowIntensity * 0.6}),
          0 ${10 + distY * 0.3}px ${26 + glowIntensity * 20}px rgba(0,0,0,${0.55 + glowIntensity * 0.1})
        `;
      } else {
        // Reset to default shadow
        panel.style.boxShadow = panel.dataset.defaultShadow || 'inset 0 1px 0 rgba(255,255,255,.08)';
      }
    });

    // Smooth transition on mouse leave
    panel.addEventListener('mouseleave', () => {
      panel.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.320, 1), box-shadow 0.4s ease';
      panel.style.transform = panel.dataset.originalTransform || 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
      panel.style.boxShadow = panel.dataset.defaultShadow || 'inset 0 1px 0 rgba(255,255,255,.08)';
      setTimeout(() => {
        panel.style.transition = '';
      }, 400);
    });

    // Store default values
    panel.dataset.originalTransform = panel.style.transform;
    panel.dataset.defaultShadow = panel.style.boxShadow;
  });
});

// Alternative: Simpler continuous breathing/pulsing effect
document.addEventListener('DOMContentLoaded', function() {
  const breathing = document.querySelectorAll('[data-effect="breathing"]');

  breathing.forEach((element, index) => {
    const duration = 3 + (index % 3) * 0.5;
    element.style.animation = `breathe ${duration}s ease-in-out infinite`;
  });
});

// Add CSS animations if not already present
if (!document.querySelector('style[data-interactive]')) {
  const style = document.createElement('style');
  style.setAttribute('data-interactive', 'true');
  style.textContent = `
    @keyframes breathe {
      0%, 100% {
        opacity: 0.95;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.01);
      }
    }

    @keyframes glow {
      0%, 100% {
        filter: drop-shadow(0 0 8px rgba(255,138,53,0.3));
      }
      50% {
        filter: drop-shadow(0 0 16px rgba(255,138,53,0.6));
      }
    }

    [data-interactive="panel"] {
      transition: transform 0.1s cubic-bezier(0.23, 1, 0.320, 1),
                  box-shadow 0.2s ease;
      cursor: pointer;
      will-change: transform, box-shadow;
    }
  `;
  document.head.appendChild(style);
}
