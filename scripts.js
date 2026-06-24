document.addEventListener('DOMContentLoaded', function () {
  // Simple smooth scroll implementation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Intersection Observer for fade-in effects
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-10');
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
    observer.observe(section);
  });

  // Contact form submission using Fetch API
  var form = document.getElementById('contact-form');
  if (form) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var successEl = document.getElementById('form-success');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var priorText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      var endpoint = form.dataset.endpoint || form.action || 'https://your-form-endpoint.example/submit';
      var formData = new FormData(form);

      try {
        var resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });

        if (!resp.ok) {
          var err = {};
          try { err = await resp.json(); } catch (e) {}
          throw new Error(err.error || err.message || ('Status ' + resp.status));
        }

        // success
        if (successEl) {
          successEl.textContent = 'Message sent. Thank you!';
          successEl.style.display = 'block';
        } else {
          alert('Message sent. Thank you!');
        }
        form.reset();
      } catch (error) {
        alert('Error sending message: ' + (error.message || error));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = priorText;
      }
    });
  }
});
