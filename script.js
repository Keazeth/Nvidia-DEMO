document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. RESPONSIVE MENU ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('is-active');
        });
    }

    // --- 2. MEGA MENU LOGIKA (UNIVERZÁLNÍ PRO VÍCE MENU) ---
    // Najdeme všechny wrappery, které mají v sobě mega menu
    const menuWrappers = document.querySelectorAll('.nav-item-wrapper');

    menuWrappers.forEach(wrapper => {
        const triggerLink = wrapper.querySelector('.nav-item'); // Odkaz (Products, Solutions...)
        const megaMenu = wrapper.querySelector('.mega-menu');   // To rozbalovací okno

        if (triggerLink && megaMenu) {
            // Kliknutí na odkaz otevře/zavře toto konkrétní menu
            triggerLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Pokud klikám na menu, zavřu všechna OSTATNÍ otevřená menu
                menuWrappers.forEach(w => {
                    if (w !== wrapper) w.classList.remove('open');
                });

                // Přepnu stav tohoto menu
                wrapper.classList.toggle('open');
            });
        }
    });

    // Kliknutí jinam zavře všechna menu
    document.addEventListener('click', (e) => {
        menuWrappers.forEach(wrapper => {
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove('open');
            }
        });
    });


    // --- 2b. PŘEPÍNÁNÍ ZÁLOŽEK (TABŮ) UVNITŘ MENU ---
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    if (sidebarItems.length > 0) {
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation(); // Aby se menu nezavřelo

                // Najdeme rodičovské Mega Menu, ve kterém jsme klikli
                const parentMenu = item.closest('.mega-menu');
                if (!parentMenu) return;

                // Uvnitř tohoto menu najdeme všechny položky a panely
                const siblings = parentMenu.querySelectorAll('.sidebar-item');
                const contentPanels = parentMenu.querySelectorAll('.content-panel');

                // 1. Deaktivovat ostatní položky v sidebaru (jen v tomto menu)
                siblings.forEach(i => i.classList.remove('active'));
                // 2. Aktivovat kliknutou
                item.classList.add('active');

                // 3. Zjistit cíl (ID panelu)
                const targetId = item.getAttribute('data-tab');

                // 4. Skrýt všechny panely (jen v tomto menu)
                contentPanels.forEach(panel => panel.classList.remove('active'));

                // 5. Zobrazit ten správný (hledáme ho globálně podle ID, nebo uvnitř)
                // Poznámka: ID panelů musí být na stránce unikátní!
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // --- 3. ANIMACE TEXTU (HERO) ---
    const titleParts = document.querySelectorAll(".reveal-text");
    const subtitle = document.querySelector(".hero-subtitle");
    if(titleParts.length > 0) {
        setTimeout(() => {
            titleParts.forEach(part => part.classList.add("visible"));
            if(subtitle) subtitle.classList.add("visible");
        }, 300);
    }

    // --- 4. LOGIN LOGIKA ---
    const authModal = document.getElementById("authModal");
    const authBtn = document.getElementById("authBtn");
    const closeAuth = document.querySelector(".close-btn");

    if (authBtn) {
        authBtn.onclick = function() {
            if(localStorage.getItem("isLoggedIn") === "true") {
                localStorage.removeItem("isLoggedIn");
                checkLoginStatus();
                alert("You have been logged out.");
            } else {
                authModal.style.display = "block";
            }
        }
    }
    if (closeAuth) closeAuth.onclick = function() { authModal.style.display = "none"; }
    window.onclick = function(event) {
        if (event.target == authModal) authModal.style.display = "none";
    }
    checkLoginStatus();

    // --- 5. POPUP DEMO VERZE ---
    const infoModal = document.getElementById('infoModal');
    const closeInfoBtn = document.querySelector('.info-close-btn');
    const okInfoBtn = document.querySelector('.info-ok-btn');
    const triggers = document.querySelectorAll('.trigger-popup');

    if (infoModal) {
        triggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.closest('.social-icons') || btn.classList.contains('social-link')) {
                    return; 
                }

                e.preventDefault();
                infoModal.style.display = 'flex';
                
                // Zavřít všechna otevřená mega menu
                menuWrappers.forEach(w => w.classList.remove('open'));
            });
        });

        function closePopup() {
            infoModal.style.display = 'none';
        }

        if (closeInfoBtn) closeInfoBtn.addEventListener('click', closePopup);
        if (okInfoBtn) okInfoBtn.addEventListener('click', closePopup);
        
        window.addEventListener('click', (e) => {
            if (e.target == infoModal) closePopup();
        });
    }

    // --- 6. PŘEKLAD JAZYKŮ ---
    const langSelect = document.getElementById('support-lang');
    
    const translations = {
        en: {
            mainTitle: "NVIDIA Support",
            subTitle: "Designed to meet the needs of both consumer and enterprise customers.",
            instructionText: "Please select the appropriate option below to learn more about our services and support options.",
            consumerTitle: "Consumer Support",
            consumerDesc: "Find support for products such as:",
            exploreBtn: "Explore Support Options ›",
            enterpriseTitle: "Enterprise Support",
            enterpriseDesc: "Find support for enterprise-level products such as:",
            fileCaseBtn: "File a Support Case ›"
        },
        cs: {
            mainTitle: "Podpora NVIDIA",
            subTitle: "Navrženo tak, aby vyhovovalo potřebám spotřebitelů i firemních zákazníků.",
            instructionText: "Níže vyberte vhodnou možnost, abyste se dozvěděli více o našich službách a možnostech podpory.",
            consumerTitle: "Zákaznická podpora",
            consumerDesc: "Najděte podporu pro produkty jako:",
            exploreBtn: "Prozkoumat možnosti podpory ›",
            enterpriseTitle: "Firemní podpora",
            enterpriseDesc: "Najděte podporu pro podniková řešení jako:",
            fileCaseBtn: "Založit případ podpory ›"
        },
        de: {
            mainTitle: "NVIDIA Support",
            subTitle: "Entwickelt, um die Anforderungen von Privat- und Unternehmenskunden zu erfüllen.",
            instructionText: "Bitte wählen Sie unten die entsprechende Option aus, um mehr über unsere Dienste zu erfahren.",
            consumerTitle: "Verbraucher-Support",
            consumerDesc: "Unterstützung für Produkte wie:",
            exploreBtn: "Support-Optionen ansehen ›",
            enterpriseTitle: "Unternehmens-Support",
            enterpriseDesc: "Unterstützung für Unternehmensprodukte wie:",
            fileCaseBtn: "Support-Fall erstellen ›"
        }
    };

    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            const content = translations[selectedLang];

            if (content) {
                document.querySelectorAll('[data-i18n]').forEach(element => {
                    const key = element.getAttribute('data-i18n');
                    if (content[key]) {
                        element.innerText = content[key];
                    }
                });
            }
        });
    }

    // --- 7. SHOP CAROUSEL (SLIDER) ---
    // Zkontrolujeme, zda jsme na stránce shopu a zda existuje karusel
    const carouselContainer = document.querySelector('.hero-carousel-container');
    
    if (carouselContainer) {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.dot');
        const slideInterval = 10000; // 10 sekund (v milisekundách)
        let currentSlide = 0;
        let autoSlideTimer;

        // Funkce pro zobrazení konkrétního snímku
        function goToSlide(index) {
            // Ošetření indexu (aby se točilo dokola)
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;

            // 1. Odstranit 'active' třídu ze všech snímků a teček
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // 2. Přidat 'active' třídu novému snímku a tečce
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            // 3. Aktualizovat aktuální index
            currentSlide = index;
        }

        // Funkce pro automatický posun na další snímek
        function nextSlideAuto() {
            goToSlide(currentSlide + 1);
        }

        // Spuštění automatického časovače
        function startTimer() {
            // Pro jistotu nejprve vyčistíme předchozí interval
            if (autoSlideTimer) clearInterval(autoSlideTimer);
            autoSlideTimer = setInterval(nextSlideAuto, slideInterval);
        }

        // Zastavení časovače (při manuální interakci)
        function stopTimer() {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
        }

        // --- EVENT LISTENERS ---

        // Kliknutí na tečky
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                stopTimer(); // Zastavíme automatiku, když uživatel klikne
                const index = parseInt(e.target.getAttribute('data-index'));
                goToSlide(index);
                startTimer(); // Po kliknutí znovu spustíme časovač
            });
        });

        // Spustíme to celé na začátku
        startTimer();
    }
});

// Helpery
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active-form'));
    if(tab === 'login') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active-form');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active-form');
    }
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUser = JSON.parse(localStorage.getItem('nvidiaUser'));
    const btn = document.getElementById("authBtn");
    const nameDisplay = document.getElementById("userNameDisplay");

    if(btn && isLoggedIn && storedUser) {
        btn.innerText = "LOG OUT";
        btn.style.backgroundColor = "#333";
        btn.style.color = "#fff";
        nameDisplay.classList.remove("hidden");
        nameDisplay.innerText = "Hi, " + storedUser.name;
    } else if (btn) {
        btn.innerText = "LOG IN / JOIN";
        btn.style.backgroundColor = "#76b900";
        btn.style.color = "#000";
        if(nameDisplay) nameDisplay.classList.add("hidden");
    }
}