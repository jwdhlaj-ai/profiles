document.addEventListener('DOMContentLoaded', function () {
  // التحكم في شاشة التحميل
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingImage = document.getElementById('loadingImage');
  const navLogo = document.getElementById('navLogo');
  const navbar = document.querySelector('.navbar');
  
  // حساب موقع النافبار الدقيق
  const navbarRect = navbar.getBoundingClientRect();
  const logoRect = navLogo.getBoundingClientRect();
  
  // موقع الصورة في النافبار بالنسبة لوسط الشاشة
  const targetX = logoRect.left + (logoRect.width / 2) - (window.innerWidth / 2);
  const targetY = logoRect.top + (logoRect.height / 2) - (window.innerHeight / 2);
  
  // إخفاء شاشة التحميل بعد 1 ثانية مع الانميشن الأولى
  setTimeout(() => {
    // انيميشن تحريك الصورة من المنتصف لمكان النافبار
    const moveTimeline = gsap.timeline();
    
    moveTimeline
      // المرحلة 1: تكبير الصورة قليلاً
      .to(loadingImage, {
        scale: 1.3,
        duration: 0.8,
        ease: "power2.out"
      })
      // المرحلة 2: تحريك الصورة وتصغيرها تدريجياً لمكان النافبار
      .to(loadingImage, {
        scale: 0.1,
        x: targetX,
        y: targetY,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: function() {
          // تقليل الشفافية تدريجياً أثناء الحركة
          const progress = this.progress();
          loadingImage.style.opacity = 1.5 - (progress * 0.8);
        },
        onComplete: function() {
          // إخفاء شاشة التحميل بعد اكتمال الحركة
          loadingScreen.style.display = 'none';
          // إظهار صورة النافبار
          navLogo.style.opacity = '1';
          // بدء انيميشن الهيرو
          startHeroAnimation();
        }
      });

  }, 1000); // 1 ثانية بدل 3 ثواني

  function startHeroAnimation() {
    const heroImage = document.getElementById('hero-image');
    
    const heroTimeline = gsap.timeline();
    
    heroTimeline
      .fromTo(heroImage, 
        {
          opacity: 0,
          scale: 0.3,
          rotationY: 180,
          rotationX: 30
        },
        {
          opacity: 1,
          scale: 1.1,
          rotationY: 0,
          rotationX: 0,
          duration: 0.8,
          ease: "back.out(1.5)"
        }
      )
      .to(heroImage, {
        scale: 0.95,
        rotationY: 10,
        duration: 0.2,
        ease: "power2.inOut"
      })
      .to(heroImage, {
        scale: 1.05,
        rotationY: -5,
        duration: 0.15,
        ease: "power2.inOut"
      })
      .to(heroImage, {
        scale: 1,
        rotationY: 0,
        duration: 0.3,
        ease: "power2.out"
      });
  }

  // باقي الكود يبقى كما هو...
  // Initialize Swiper
  const swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    slidesPerView: 1,
    spaceBetween: 0,
    mousewheel: false,
    effect: 'slide',
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: 'bullets'
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    speed: 600,
    grabCursor: true,
    allowTouchMove: true,
    resistance: true,
    resistanceRatio: 0.85,
    loop: false,
  });

  // Animation for section 1 image
  gsap.fromTo('.s1 .the-img img', 
    {
      opacity: 0,
      x: 100
    },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.s1',
        start: 'top 70%',
        end: 'bottom 30%',
        toggleActions: "play none none reverse"
      }
    }
  );

  // Animation for section 2 image
  gsap.fromTo('.s2 .the-img img', 
    {
      opacity: 0,
      x: -100
    },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.s2',
        start: 'top 70%',
        end: 'bottom 30%',
        toggleActions: "play none none reverse"
      }
    }
  );

  // التحكم في السكرول للسويبر
  let isInSwiperSection = false;
  let swiperScrollLock = false;
  let lastScrollY = window.scrollY;
  const projectsSection = document.querySelector('.projects-section');
  const sectionTop = projectsSection.offsetTop;
  const sectionHeight = projectsSection.offsetHeight;

  function handleSwiperScroll() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    const inSwiperSection = currentScrollY >= sectionTop && 
                           currentScrollY <= sectionTop + sectionHeight - window.innerHeight;

    if (inSwiperSection && !isInSwiperSection) {
      isInSwiperSection = true;
      swiperScrollLock = true;
      window.scrollTo(0, sectionTop);
    } else if (!inSwiperSection && isInSwiperSection) {
      isInSwiperSection = false;
      swiperScrollLock = false;
    }

    if (isInSwiperSection && swiperScrollLock) {
      if (scrollDelta > 20 && !swiper.isEnd) {
        swiper.slideNext();
        lastScrollY = currentScrollY;
      } else if (scrollDelta < -20 && !swiper.isBeginning) {
        swiper.slidePrev();
        lastScrollY = currentScrollY;
      } else {
        window.scrollTo(0, sectionTop);
      }
    } else {
      lastScrollY = currentScrollY;
    }
  }

  let isScrolling = false;
  function throttleScroll() {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(function() {
        handleSwiperScroll();
        isScrolling = false;
      });
    }
  }

  window.addEventListener('scroll', throttleScroll, { passive: false });

  ScrollTrigger.refresh();
});