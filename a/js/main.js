// main.js - Vanilla JS logic for mobile menus, accordions and interaction
document.addEventListener('DOMContentLoaded', () => {
    // 0. Fix para altura real no mobile (100vh bug)
    const setVh = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);

    // 1. Inicializar comportamento da Navbar
    initNavbar();
    // 2. Footer e Chatbot
    initFooterAndChatbot();
    // 3. Home Scripts
    initHomeScripts();
});

function initFooterAndChatbot() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const tooltip = document.getElementById('chatbot-tooltip');
    const trigger = document.getElementById('chatbot-trigger');
    const closeBtn = document.getElementById('chatbot-tooltip-close');

    if (trigger && tooltip) {
        let isClosed = false;

        trigger.addEventListener('mouseenter', () => {
            if (!isClosed) {
                tooltip.classList.remove('hidden');
            }
        });

        trigger.addEventListener('mouseleave', () => {
            tooltip.classList.add('hidden');
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                tooltip.classList.add('hidden');
                isClosed = true;
            });
        }
    }
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const brandText = document.getElementById('brand-text');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const isHomePage = document.body.classList.contains('home-page');
    const isUrgencyPage = document.body.classList.contains('urgency-page');
    const isKidsPage = document.body.classList.contains('kids-page');

    let lastScrollY = window.scrollY;
    let ticking = false;

    // Threshold for making it sticky/visible (after scrolling down past the first section)
    const stickyThreshold = 600;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        const navbarBrand = document.getElementById('navbar-brand');

        // Página inicial: padrão estável do teste aprovado.
        // O menu permanece fixed o tempo todo e só some/aparece via transform.
        if (isHomePage || isUrgencyPage || isKidsPage) {
            const goingDown = currentScrollY > lastScrollY;
            const nearTop = currentScrollY < 10;

            if (navbarBrand) {
                navbarBrand.classList.remove('opacity-0', 'pointer-events-none');
            }

            if (nearTop) {
                navbar.classList.remove('navbar-hidden');
            } else if (goingDown) {
                navbar.classList.add('navbar-hidden');
            } else {
                navbar.classList.remove('navbar-hidden');
            }

            lastScrollY = currentScrollY;
            ticking = false;
            return;
        }

        // 1. Top area: Reset to original state (absolute at top)
        if (currentScrollY <= 150) {
            navbar.classList.remove('navbar-fixed', 'navbar-hidden');
            if (navbarBrand) {
                navbarBrand.classList.add('opacity-0', 'pointer-events-none');
            }
        }
        // 2. Beyond threshold: Professional reveal logic
        else if (currentScrollY > stickyThreshold) {
            if (navbarBrand) {
                navbarBrand.classList.remove('opacity-0', 'pointer-events-none');
            }

            if (currentScrollY < lastScrollY) {
                // Scrolling UP - Show it
                if (!navbar.classList.contains('navbar-fixed')) {
                    // Start as hidden to animate in smoothly
                    navbar.classList.add('navbar-hidden');
                    void navbar.offsetHeight; // force reflow
                    navbar.classList.add('navbar-fixed');
                }
                navbar.classList.remove('navbar-hidden');
            } else {
                // Scrolling DOWN - Hide it
                if (navbar.classList.contains('navbar-fixed')) {
                    navbar.classList.add('navbar-hidden');
                }
            }
        }
        // 3. Middle area (between 150 and 600): 
        // Let it behave naturally (scrolls away)
        else {
            if (navbarBrand) {
                navbarBrand.classList.remove('opacity-0', 'pointer-events-none');
            }
            if (currentScrollY > lastScrollY && navbar.classList.contains('navbar-fixed')) {
                navbar.classList.add('navbar-hidden');
            }
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    // Scroll event with throttle via requestAnimationFrame
    function closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const iconMenu = document.getElementById('icon-menu');
        const iconClose = document.getElementById('icon-close');

        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            if (iconMenu) iconMenu.classList.remove('hidden');
            if (iconClose) iconClose.classList.add('hidden');

            // Reativa o scroll do corpo
            document.body.style.overflow = '';

            // Restaura o navbar
            navbar.style.height = '';
            navbar.style.overflowY = '';
            navbar.style.background = '';

            // Caso tenha sido adicionado via JS
            navbar.classList.remove('navbar-fixed-forced');
        }
    }

    // Scroll event with throttle via requestAnimationFrame
    window.addEventListener('scroll', () => {
        const mobileMenu = document.getElementById('mobile-menu');
        // Se o menu estiver aberto e o site estiver rolando (overflow não é hidden),
        // significa que ele cabe na tela e deve fechar no scroll.
        if (mobileMenu && !mobileMenu.classList.contains('hidden') && document.body.style.overflow !== 'hidden') {
            closeMobileMenu();
            return;
        }

        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');

    if (mobileMenuBtn && mobileMenu) {
        // Função para ajustar o comportamento do menu baseado na altura disponível
        function adjustMenuBehavior() {
            if (mobileMenu.classList.contains('hidden')) return;

            const windowHeight = window.innerHeight;
            const menuHeight = mobileMenu.scrollHeight + 100;
            const fits = menuHeight < windowHeight;

            if (!fits) {
                navbar.style.height = '100vh';
                navbar.style.overflowY = 'auto';
                document.body.style.overflow = 'hidden';
            } else {
                navbar.style.height = '';
                navbar.style.overflowY = '';
                document.body.style.overflow = '';
            }

            const isAtTop = window.scrollY < 150;
            if (isHomePage || isUrgencyPage) {
                navbar.style.height = '';
                navbar.style.overflowY = '';
                document.body.style.overflow = '';
                return;
            }

            if (!isAtTop) {
                navbar.classList.add('navbar-fixed');
                navbar.style.background = 'linear-gradient(180deg, #1a2624 0%, #243532 100%)';
                navbar.style.backgroundSize = '100% 88px';
                navbar.style.backgroundRepeat = 'no-repeat';
            } else {
                navbar.style.background = 'transparent';
                navbar.classList.remove('navbar-fixed');
            }
        }

        mobileMenuBtn.addEventListener('click', () => {
            const isMenuHidden = mobileMenu.classList.contains('hidden');
            if (isMenuHidden) {
                mobileMenu.classList.remove('hidden');
                iconMenu.classList.add('hidden');
                iconClose.classList.remove('hidden');
                adjustMenuBehavior();
            } else {
                closeMobileMenu();
            }
        });

        // Reavalia o comportamento se o usuário girar o celular ou redimensionar a tela
        window.addEventListener('resize', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                adjustMenuBehavior();
            }
        }, { passive: true });

        // Cliques em links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }
}

function initHomeScripts() {
    // Scroll Reveal
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-reveal-up');
                entry.target.classList.remove('opacity-0');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal .stagger-up, .stagger-up').forEach(el => {
        el.classList.add('opacity-0');
        observer.observe(el);
    });

    // FAQs
    const faqBtns = document.querySelectorAll('.faq-container button');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const chevron = btn.querySelector('.chevron');
            const isOpen = content.classList.contains('max-h-48');

            // Close all
            document.querySelectorAll('.faq-container .content').forEach(c => {
                c.classList.remove('max-h-48', 'opacity-100');
                c.classList.add('max-h-0', 'opacity-0');
            });
            document.querySelectorAll('.faq-container .chevron').forEach(c => {
                c.classList.remove('rotate-180');
            });

            if (!isOpen) {
                content.classList.remove('max-h-0', 'opacity-0');
                content.classList.add('max-h-48', 'opacity-100');
                chevron.classList.add('rotate-180');
            }
        });
    });

    // Parent FAQ Toggle (Abrir/Fechar toda a seção)
    const mainFaqToggle = document.getElementById('main-faq-toggle');
    const mainFaqContent = document.getElementById('main-faq-content');
    const mainFaqChevron = document.getElementById('main-faq-chevron');
    const mainFaqText = document.getElementById('main-faq-toggle-text');

    if (mainFaqToggle && mainFaqContent) {
        mainFaqToggle.addEventListener('click', () => {
            const isOpen = mainFaqContent.classList.contains('max-h-[1500px]');

            if (!isOpen) {
                // Open
                mainFaqContent.classList.remove('max-h-0', 'opacity-0');
                mainFaqContent.classList.add('max-h-[1500px]', 'opacity-100');
                if (mainFaqChevron) mainFaqChevron.classList.add('rotate-180');
                if (mainFaqText) mainFaqText.textContent = 'Fechar Perguntas Frequentes';
            } else {
                // Close
                mainFaqContent.classList.remove('max-h-[1500px]', 'opacity-100');
                mainFaqContent.classList.add('max-h-0', 'opacity-0');
                if (mainFaqChevron) mainFaqChevron.classList.remove('rotate-180');
                if (mainFaqText) mainFaqText.textContent = 'Abrir Perguntas Frequentes';
            }
        });
    }

    // Carousel
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    const carouselRoot = document.getElementById('services-carousel');
    if (track && prevBtn && nextBtn && carouselRoot) {
        const sourceItems = Array.from(track.querySelectorAll('.carousel-item')).map(item => item.cloneNode(true));
        const originalCount = sourceItems.length;
        let visibleCount = window.innerWidth >= 768 ? 3 : 1;
        let currentIndex = 0;
        let autoplayInterval = null;
        let isRebuilding = false;

        function rebuildTrack() {
            if (!originalCount) return;
            isRebuilding = true;
            track.innerHTML = '';

            const head = sourceItems.map(item => item.cloneNode(true));
            const body = sourceItems.map(item => item.cloneNode(true));
            const tail = sourceItems.map(item => item.cloneNode(true));

            [...head, ...body, ...tail].forEach(item => {
                item.classList.add('carousel-item-cloned-runtime');
                track.appendChild(item);
            });

            track.style.transition = 'none';
            const itemWidth = getItemWidth();
            const offset = Math.floor(visibleCount / 2);
            // Começamos no set do meio, ajustando o offset para centralizar
            track.style.transform = `translateX(-${(originalCount + currentIndex - offset) * itemWidth}px)`;

            track.offsetHeight;

            requestAnimationFrame(() => {
                track.style.transition = 'transform 500ms ease-out';
                isRebuilding = false;
                updateCarousel(); // Para aplicar as classes iniciais
            });
        }

        function getItemWidth() {
            const container = carouselRoot.querySelector('.overflow-hidden');
            if (!container) return 0;
            return container.getBoundingClientRect().width / visibleCount;
        }

        function renderDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';

            for (let i = 0; i < originalCount; i++) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                    stopAutoplay();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            const activeIndex = ((currentIndex % originalCount) + originalCount) % originalCount;
            dots.forEach((dot, index) => {
                dot.classList.toggle('is-active', index === activeIndex);
            });
        }

        function updateActiveClasses() {
            const items = track.querySelectorAll('.carousel-item');
            const targetTrackIndex = currentIndex + originalCount;
            items.forEach((item, idx) => {
                item.classList.toggle('is-active-item', idx === targetTrackIndex);
            });
        }

        function updateCarousel() {
            const itemWidth = getItemWidth();
            if (!itemWidth) return;
            const offset = Math.floor(visibleCount / 2);

            // Garantir que a largura do item seja aplicada dinamicamente se necessário
            const items = track.querySelectorAll('.carousel-item');
            items.forEach(item => {
                item.style.width = `${itemWidth}px`;
            });

            track.style.transition = 'transform 500ms ease-out';
            track.style.transform = `translateX(-${(currentIndex + originalCount - offset) * itemWidth}px)`;

            updateActiveClasses();
            updateDots();
        }

        function nextSlide() {
            currentIndex++;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex--;
            updateCarousel();
        }

        track.addEventListener('transitionend', () => {
            if (isRebuilding || !originalCount) return;

            if (currentIndex >= originalCount || currentIndex < 0) {
                // Loop Infinito: Saltamos instantaneamente para a posição correlata no set central
                const itemWidth = getItemWidth();
                const offset = Math.floor(visibleCount / 2);

                // Desativa transições temporariamente para evitar piscadas
                carouselRoot.classList.add('no-transition');

                currentIndex = ((currentIndex % originalCount) + originalCount) % originalCount;
                track.style.transform = `translateX(-${(currentIndex + originalCount - offset) * itemWidth}px)`;

                // Atualiza classes ativas sem animação durante o salto
                updateActiveClasses();

                track.offsetHeight; // Força layout

                // Reativa as transições no próximo quadro
                requestAnimationFrame(() => {
                    carouselRoot.classList.remove('no-transition');
                });
            }
            updateDots();
        });

        // Suporte a clique nos itens (centralizar)
        track.addEventListener('click', (e) => {
            const item = e.target.closest('.carousel-item');
            if (!item) return;

            // Encontrar todos os itens na trilha para saber o índice clicado
            const items = Array.from(track.querySelectorAll('.carousel-item'));
            const clickedIndex = items.indexOf(item);

            const targetTrackIndex = currentIndex + originalCount;

            if (clickedIndex !== targetTrackIndex) {
                // Intercepta qualquer link se o card estiver inativo
                e.preventDefault();

                // Descobrir a distância do item clicado para o item central
                const offsetSteps = clickedIndex - targetTrackIndex;
                currentIndex += offsetSteps;
                updateCarousel();
                startAutoplay(); // Reinicia o autoplay após interação
            }
        });

        prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
        nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });

        function startAutoplay() {
            if (autoplayInterval) clearInterval(autoplayInterval);
            autoplayInterval = setInterval(nextSlide, 4000);
        }
        function stopAutoplay() { clearInterval(autoplayInterval); }

        carouselRoot.addEventListener('mouseenter', stopAutoplay);
        carouselRoot.addEventListener('mouseleave', startAutoplay);

        // Suporte a Touch (Arraste com o dedo)
        let touchStartX = 0;
        let touchEndX = 0;

        carouselRoot.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselRoot.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (Math.abs(touchEndX - touchStartX) > 50) {
                if (touchEndX < touchStartX) nextSlide();
                else prevSlide();
                startAutoplay(); // Reinicia o timer após interação manual
            }
        }, { passive: true });

        window.addEventListener('resize', () => {
            const newVis = window.innerWidth >= 768 ? 3 : 1;
            if (newVis !== visibleCount) {
                visibleCount = newVis;
                rebuildTrack();
                renderDots();
                updateCarousel();
            }
        });

        rebuildTrack();
        renderDots();
        startAutoplay();
        updateCarousel();
    }
}

// Floating Chat Visibility & "Landing" in Footer
const floatingChat = document.getElementById('floating-chat-container');
const staticChat = document.getElementById('static-chat-container');

if (floatingChat) {
    const updateChat = () => {
        const scrollY = window.scrollY;
        let showFloating = scrollY > 300;
        let showStatic = false;

        // "Landing" logic for mobile
        if (window.innerWidth < 1024 && staticChat) {
            const staticChatRect = staticChat.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Se a área do botão estático entrar na tela
            if (staticChatRect.top <= viewportHeight + 10) {
                showFloating = false;
                showStatic = true;
            }
        }

        // Apply visibility to floating chat
        if (showFloating) {
            floatingChat.style.opacity = '1';
            floatingChat.style.pointerEvents = 'auto';
        } else {
            floatingChat.style.opacity = '0';
            floatingChat.style.pointerEvents = 'none';
        }

        // Reset floating position (no longer pushed up)
        floatingChat.style.bottom = '1.5rem';

        // Apply visibility to static chat
        if (staticChat) {
            if (showStatic) {
                staticChat.style.opacity = '1';
                staticChat.style.pointerEvents = 'auto';
            } else {
                staticChat.style.opacity = '0';
                staticChat.style.pointerEvents = 'none';
            }
        }
    };

    window.addEventListener('scroll', updateChat, { passive: true });
    window.addEventListener('resize', updateChat, { passive: true });
    updateChat(); // Inicializa o estado
}
