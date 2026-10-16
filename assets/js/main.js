/**
 * Royal Enan Security Services - Interactive Scripts
 * Provides working Hero Slider, Clients Carousel, ISO Certificate Modal & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Hero Slider Implementation
     ========================================================================== */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const counterBtns = document.querySelectorAll('.hero-counter-btn');
  const prevHeroBtn = document.getElementById('prevHeroBtn');
  const nextHeroBtn = document.getElementById('nextHeroBtn');
  const heroSection = document.getElementById('heroSection') || document.querySelector('.hero-slider-container');

  let currentSlideIndex = 0;
  let heroTimer = null;
  const slideInterval = 6000; // 6 seconds per slide

  function showSlide(index) {
    if (heroSlides.length === 0) return;

    // Normalize index
    if (index >= heroSlides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = heroSlides.length - 1;
    else currentSlideIndex = index;

    // Update slide classes
    heroSlides.forEach((slide, i) => {
      if (i === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update 01 / 02 / 03 indicators
    counterBtns.forEach((btn, i) => {
      if (i === currentSlideIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    showSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    showSlide(currentSlideIndex - 1);
  }

  function startHeroAutoplay() {
    stopHeroAutoplay();
    heroTimer = setInterval(nextSlide, slideInterval);
  }

  function stopHeroAutoplay() {
    if (heroTimer) clearInterval(heroTimer);
  }

  // Event Listeners for Hero Controls
  if (nextHeroBtn) {
    nextHeroBtn.addEventListener('click', () => {
      nextSlide();
      startHeroAutoplay();
    });
  }

  if (prevHeroBtn) {
    prevHeroBtn.addEventListener('click', () => {
      prevSlide();
      startHeroAutoplay();
    });
  }

  counterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetIndex = parseInt(btn.getAttribute('data-slide-index'), 10);
      showSlide(targetIndex);
      startHeroAutoplay();
    });
  });

  // Pause on hover
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopHeroAutoplay);
    heroSection.addEventListener('mouseleave', startHeroAutoplay);

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopHeroAutoplay();
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startHeroAutoplay();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (swipeDistance > 45) {
        prevSlide(); // Swipe Right
      } else if (swipeDistance < -45) {
        nextSlide(); // Swipe Left
      }
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && !isModalOpen()) {
      nextSlide();
    } else if (e.key === 'ArrowLeft' && !isModalOpen()) {
      prevSlide();
    }
  });

  startHeroAutoplay();

  /* ==========================================================================
     2. Clients Logo Carousel
     ========================================================================== */
  const clientsTrack = document.getElementById('clientsTrack');
  const prevClientBtn = document.getElementById('prevClientBtn');
  const nextClientBtn = document.getElementById('nextClientBtn');

  if (clientsTrack) {
    let clientPosition = 0;
    const scrollStep = 220; // px to scroll

    function getTrackMaxScroll() {
      return clientsTrack.scrollWidth - clientsTrack.parentElement.clientWidth;
    }

    if (nextClientBtn) {
      nextClientBtn.addEventListener('click', () => {
        const maxScroll = getTrackMaxScroll();
        if (maxScroll <= 0) return;
        clientPosition += scrollStep;
        if (clientPosition > maxScroll) {
          clientPosition = 0; // Loop back
        }
        clientsTrack.style.transform = `translateX(-${clientPosition}px)`;
      });
    }

    if (prevClientBtn) {
      prevClientBtn.addEventListener('click', () => {
        const maxScroll = getTrackMaxScroll();
        if (maxScroll <= 0) return;
        clientPosition -= scrollStep;
        if (clientPosition < 0) {
          clientPosition = maxScroll; // Loop to end
        }
        clientsTrack.style.transform = `translateX(-${clientPosition}px)`;
      });
    }

    // Auto scroll client logos gently
    let clientAutoTimer = setInterval(() => {
      const maxScroll = getTrackMaxScroll();
      if (maxScroll > 0) {
        clientPosition += 180;
        if (clientPosition > maxScroll) clientPosition = 0;
        clientsTrack.style.transform = `translateX(-${clientPosition}px)`;
      }
    }, 4000);

    const clientViewport = document.querySelector('.clients-carousel-viewport');
    if (clientViewport) {
      clientViewport.addEventListener('mouseenter', () => clearInterval(clientAutoTimer));
      clientViewport.addEventListener('mouseleave', () => {
        clientAutoTimer = setInterval(() => {
          const maxScroll = getTrackMaxScroll();
          if (maxScroll > 0) {
            clientPosition += 180;
            if (clientPosition > maxScroll) clientPosition = 0;
            clientsTrack.style.transform = `translateX(-${clientPosition}px)`;
          }
        }, 4000);
      });
    }
  }

  /* ==========================================================================
     3. ISO Certificate Modal / Lightbox
     ========================================================================== */
  const certModal = document.getElementById('certModal');
  const openCertBtns = document.querySelectorAll('.open-cert-modal');
  const closeCertBtn = document.getElementById('closeCertBtn');

  function openModal() {
    if (certModal) {
      certModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (certModal) {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function isModalOpen() {
    return certModal && certModal.classList.contains('active');
  }

  openCertBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeCertBtn) {
    closeCertBtn.addEventListener('click', closeModal);
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen()) {
      closeModal();
    }
  });

  /* ==========================================================================
     4. Mobile Navigation Drawer
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeMobileDrawer = document.getElementById('closeMobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeMobileDrawer && mobileDrawer) {
    closeMobileDrawer.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileDrawer) {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  /* ==========================================================================
     5. Newsletter Subscription Handling
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  const toastNotice = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value.trim() !== '') {
        showToast(`Thank you! ${input.value.trim()} has been subscribed.`);
        input.value = '';
      }
    });
  }

  function showToast(msg) {
    if (!toastNotice) return;
    if (toastMessage) toastMessage.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4000);
  }

  /* ==========================================================================
     6. Scroll to Top Button Functionality
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    let isScrolling = false;

    window.addEventListener('scroll', () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 260) {
            scrollTopBtn.classList.add('visible');
          } else {
            scrollTopBtn.classList.remove('visible');
          }
          isScrolling = false;
        });
        isScrolling = true;
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
