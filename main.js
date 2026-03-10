// Typed.js animation for the home screen text
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Typed.js
  if (document.querySelector('.text')) {
    new Typed(".text", {
      strings: ["Frontend Developer", "Web Developer", "UI Enthusiast", "React Developer"],
      typeSpeed: 80,
      backSpeed: 60,
      backDelay: 1500,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });
  }

  // Mobile menu toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const navbar = document.querySelector('.navbar');
  
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function(e) {
      e.stopPropagation();
      navbar.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target) && navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // Active link switching on scroll with Intersection Observer
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navbar a');
  
  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
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
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // Smooth scroll for anchor links with offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Lazy loading images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Add current year to footer
  const yearElements = document.querySelectorAll('.current-year');
  yearElements.forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Initialize skill bars animation on scroll
  const skillBars = document.querySelectorAll('.progress-line span');
  const radialBars = document.querySelectorAll('.radial-bars');

  const animateSkills = () => {
    skillBars.forEach(bar => {
      const barPosition = bar.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (barPosition < screenPosition) {
        bar.style.animation = 'fillSkillBar 1.5s ease-in-out forwards';
      }
    });

    radialBars.forEach(bar => {
      const barPosition = bar.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (barPosition < screenPosition) {
        bar.style.animation = 'fillRadialBar 1.5s ease-out forwards';
      }
    });
  };

  window.addEventListener('scroll', animateSkills);
  animateSkills(); // Run once on load

  // Add page transition animation
  document.body.classList.add('fade-in');
});

// Web3Forms Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const loading = submitBtn.querySelector('.loading');
        const result = document.getElementById('result');
        
        // Show loading state
        btnText.style.display = 'none';
        loading.style.display = 'inline-block';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        result.style.display = 'none';
        
        // Get form data
        const formData = new FormData(this);
        
        // Add timestamp
        formData.append('timestamp', new Date().toISOString());
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                result.innerHTML = `
                    <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 10px; border-left: 4px solid #28a745;">
                        <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
                        Thank you! Your message has been sent successfully. I'll get back to you soon.
                    </div>
                `;
                contactForm.reset();
                
                // Track form submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'event_category': 'contact',
                        'event_label': 'contact_form'
                    });
                }
            } else {
                throw new Error(data.message || 'Form submission failed');
            }
        } catch (error) {
            result.innerHTML = `
                <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 10px; border-left: 4px solid #dc3545;">
                    <i class="fas fa-exclamation-circle" style="margin-right: 10px;"></i>
                    Error: ${error.message}. Please try again or email me directly at idowuisdaniel1@gmail.com
                </div>
            `;
            console.error('Form error:', error);
        } finally {
            // Reset button state
            btnText.style.display = 'inline-block';
            loading.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            result.style.display = 'block';
            
            // Auto-hide success message after 10 seconds
            if (result.innerHTML.includes('successfully')) {
                setTimeout(() => {
                    result.style.transition = 'opacity 0.5s';
                    result.style.opacity = '0';
                    setTimeout(() => {
                        result.style.display = 'none';
                        result.style.opacity = '1';
                    }, 500);
                }, 10000);
            }
        }
    });
}

// Performance optimization
window.addEventListener('load', function() {
  // Preload critical resources
  const criticalResources = [
    { rel: 'preload', as: 'style', href: 'style.css' }
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = resource.rel;
    link.as = resource.as;
    link.href = resource.href;
    document.head.appendChild(link);
  });

  // Load non-critical CSS after page load
  setTimeout(() => {
    const nonCriticalCSS = [
      'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'
    ];
    
    nonCriticalCSS.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    });
  }, 100);

  // Add scroll to top button functionality
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #0984e3;
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 5px 15px rgba(9, 132, 227, 0.3);
    z-index: 99;
    transition: all 0.3s ease;
  `;

  scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'translateY(-5px)';
    scrollTopBtn.style.boxShadow = '0 10px 25px rgba(9, 132, 227, 0.4)';
  });

  scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'translateY(0)';
    scrollTopBtn.style.boxShadow = '0 5px 15px rgba(9, 132, 227, 0.3)';
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.style.display = 'flex';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  });
});

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.log('Service Worker registration failed:', error);
    });
  });
}

// Add page visibility change handling
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    document.title = 'Idowu Daniel - Portfolio';
  }
});

// Add error tracking
window.addEventListener('error', (e) => {
  console.error('Page error:', e.error);
  // You could send this to an error tracking service
});

// Add performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    const timing = performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page loaded in ${pageLoadTime}ms`);
    
    // You could send this to analytics
    if (pageLoadTime > 3000 && typeof gtag !== 'undefined') {
      gtag('event', 'slow_page_load', {
        'event_category': 'performance',
        'event_label': 'page_load',
        'value': pageLoadTime
      });
    }
  });
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Press '?' to show help
  if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
    e.preventDefault();
    alert(`
      Keyboard Shortcuts:
      • Home: Press 'H'
      • About: Press 'A'
      • Skills: Press 'S'
      • Projects: Press 'P'
      • Contact: Press 'C'
      • Scroll to top: Press 'T'
    `);
  }

  // Single letter navigation
  const shortcuts = {
    'h': '#home',
    'a': '#about',
    's': '#skills',
    'p': '#projects',
    'c': '#contact'
  };

  if (shortcuts[e.key.toLowerCase()] && !e.ctrlKey && !e.altKey && !e.metaKey) {
    e.preventDefault();
    const target = document.querySelector(shortcuts[e.key.toLowerCase()]);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Press 'T' to scroll to top
  if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.altKey && !e.metaKey) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});