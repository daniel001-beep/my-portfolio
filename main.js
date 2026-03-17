
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  
  // Mobile menu toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const navbar = document.querySelector('.navbar');
  
  if (mobileMenu && navbar) {
    mobileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
    
    // Close menu on link click
    document.querySelectorAll('.navbar a').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // Intersection Observer for active nav links
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navbar a');
  
  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-100px 0px -70% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  // Smooth scroll with RAF optimization
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offset = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // Lazy load Typed.js
  if (document.querySelector('.text')) {
    const loadTyped = () => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js';
      script.onload = () => {
        new Typed(".text", {
          strings: ["Frontend Developer", "Web Developer", "React Developer"],
          typeSpeed: 60,
          backSpeed: 40,
          backDelay: 2000,
          loop: true,
          showCursor: false
        });
      };
      document.body.appendChild(script);
    };

    // Load after page render
    if (requestIdleCallback) {
      requestIdleCallback(loadTyped);
    } else {
      setTimeout(loadTyped, 1000);
    }
  }

  // Intersection Observer for skill bars
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('progress-line')) {
          const span = entry.target.querySelector('span');
          if (span) {
            const percentage = span.parentElement?.parentElement?.classList.contains('html') ? 90 :
                              span.parentElement?.parentElement?.classList.contains('css') ? 85 :
                              span.parentElement?.parentElement?.classList.contains('javascript') ? 80 : 75;
            span.style.width = `${percentage}%`;
          }
        } else if (entry.target.classList.contains('radial-bars')) {
          const val = entry.target.style.getPropertyValue('--val') || 85;
          entry.target.style.background = `conic-gradient(#00b4d8 ${val * 3.6}deg, rgba(0, 0, 0, 0.3) 0deg)`;
        }
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3, rootMargin: '50px' });

  document.querySelectorAll('.progress-line, .radial-bars').forEach(el => skillObserver.observe(el));

  // Scroll to top button
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollBtn.className = 'scroll-top-btn';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollBtn);

  const toggleScrollBtn = debounce(() => {
    scrollBtn.style.display = window.scrollY > 500 ? 'flex' : 'none';
  }, 100);

  window.addEventListener('scroll', toggleScrollBtn, { passive: true });
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Optimized Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');
    const result = document.getElementById('result');
    
    // Show loading
    btnText.style.display = 'none';
    if (loading) loading.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        result.innerHTML = '<div class="success-message">✓ Message sent successfully!</div>';
        contactForm.reset();
        setTimeout(() => { result.innerHTML = ''; }, 5000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      result.innerHTML = '<div class="error-message">✗ Error sending message</div>';
    } finally {
      btnText.style.display = 'inline-block';
      if (loading) loading.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
}

// Add CSS for messages
const style = document.createElement('style');
style.textContent = `
  .success-message, .error-message {
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    animation: slideIn 0.3s ease;
  }
  .success-message {
    background: rgba(40, 167, 69, 0.2);
    color: #28a745;
    border: 1px solid #28a745;
  }
  .error-message {
    background: rgba(220, 53, 69, 0.2);
    color: #dc3545;
    border: 1px solid #dc3545;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
