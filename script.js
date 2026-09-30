(() => {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  const heroVisual = document.querySelector('.hero-visual');

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.classList.toggle('is-open', isOpen);
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if (heroVisual && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVisual.addEventListener('pointermove', (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.setProperty('--pointer-x', `${x * 10}px`);
      heroVisual.style.setProperty('--pointer-y', `${y * 7}px`);
    });

    heroVisual.addEventListener('pointerleave', () => {
      heroVisual.style.setProperty('--pointer-x', '0px');
      heroVisual.style.setProperty('--pointer-y', '0px');
    });
  }
})();

// Formulario: Web3Forms
const contactoForm = document.getElementById('contacto-form');
const contactoStatus = document.getElementById('contacto-status');

if (contactoForm && contactoStatus) {
  contactoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactoForm.checkValidity()) {
      contactoForm.reportValidity();
      return;
    }

    const submit = contactoForm.querySelector('button[type="submit"]');
    const data = new FormData(contactoForm);
    const payload = {
      access_key: '50b51bc6-7ea2-4607-8cc9-3e31a7843fcb',
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      message: String(data.get('message') || '').trim(),
      subject: `Nuevo contacto web - ${String(data.get('name') || '').trim()}`,
from_name: 'Unai Ayora - Asesor Financiero',
      botcheck: String(data.get('website') || '')
    };

    if (payload.botcheck) return;

    

    submit.disabled = true;
    contactoStatus.textContent = 'Enviando…';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'No se pudo enviar');
      }
      fetch('https://script.google.com/macros/s/AKfycbxlH68FRoH93Ty8VMSEAbq-kN3BjmrPYcVpeT4aQBSLkJ80a6Qoj06FywX42iUMkqKkIg/exec', {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'text/plain;charset=utf-8'
  },
  body: JSON.stringify(payload)
}).catch(() => {});
      contactoForm.reset();
      window.location.href = 'gracias.html';
    } catch (error) {
      contactoStatus.textContent = 'No hemos podido enviar el mensaje. Inténtalo de nuevo en unos minutos.';
    } finally {
      submit.disabled = false;
    }
  });
}
