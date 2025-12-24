/* ======================================================
   GLOBÁLNÍ FUNKCE (PRO HTML ONCLICK ATRIBUTY)
   ====================================================== */

// 1. Přepínání mezi záložkami LOGIN a REGISTER v modalu
function switchTab(tab) {
    // 1. Odebereme 'active' všem tlačítkům a 'active-form' všem formulářům
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active-form'));

    // 2. Aktivujeme správné
    if(tab === 'login') {
        const loginBtn = document.querySelector('.auth-tabs button:first-child');
        if(loginBtn) loginBtn.classList.add('active');
        const loginForm = document.getElementById('loginForm');
        if(loginForm) loginForm.classList.add('active-form');
    } else {
        const regBtn = document.querySelector('.auth-tabs button:last-child');
        if(regBtn) regBtn.classList.add('active');
        const regForm = document.getElementById('registerForm');
        if(regForm) regForm.classList.add('active-form');
    }
}

// 2. Kontrola stavu přihlášení (Spouští se při startu a po akcích)
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUser = JSON.parse(localStorage.getItem('nvidiaUser'));
    
    // Tlačítko v hlavičce
    const authBtns = document.querySelectorAll("#authBtn"); // Může být více (desktop/mobile)
    const nameDisplays = document.querySelectorAll("#userNameDisplay");

    authBtns.forEach(btn => {
        if (isLoggedIn && storedUser) {
            btn.innerText = "LOG OUT";
            btn.style.backgroundColor = "#333";
            btn.style.color = "#fff";
            
            // Po kliknutí na LOG OUT odhlásit
            btn.onclick = function() {
                localStorage.removeItem("isLoggedIn");
                checkLoginStatus(); // Refresh UI
                alert("You have been logged out.");
            };
        } else {
            btn.innerText = "LOG IN / JOIN";
            btn.style.backgroundColor = "#76b900";
            btn.style.color = "#000";
            
            // Po kliknutí otevřít modal
            btn.onclick = function() {
                const modal = document.getElementById("authModal");
                if(modal) modal.style.display = "flex"; // Používáme flex pro centrování
            };
        }
    });

    // Zobrazení jména
    nameDisplays.forEach(display => {
        if (isLoggedIn && storedUser) {
            display.classList.remove("hidden");
            display.innerText = "Hi, " + storedUser.name;
            display.style.color = "#76b900";
            display.style.fontWeight = "bold";
            display.style.marginRight = "15px";
        } else {
            display.classList.add("hidden");
        }
    });
}

/* ======================================================
   HLAVNÍ LOGIKA PO NAČTENÍ STRÁNKY
   ====================================================== */
document.addEventListener("DOMContentLoaded", () => {
    
    // Spustit kontrolu přihlášení hned po načtení
    checkLoginStatus();

    // --- 1. RESPONSIVE MENU (HAMBURGER) ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('is-active');
        });
    }

    // --- 2. MEGA MENU LOGIKA (DESKTOP & MOBILE) ---
    const menuWrappers = document.querySelectorAll('.nav-item-wrapper');

    menuWrappers.forEach(wrapper => {
        const triggerLink = wrapper.querySelector('.nav-item');
        
        if (triggerLink) {
            triggerLink.addEventListener('click', (e) => {
                // Zabraň prokliku, pokud to má otevírat menu
                e.preventDefault();
                e.stopPropagation();

                // Zavřít ostatní otevřená menu
                menuWrappers.forEach(w => {
                    if (w !== wrapper) w.classList.remove('open');
                });

                // Přepnout stav aktuálního menu
                wrapper.classList.toggle('open');
            });
        }
    });

    // Zavření menu kliknutím vedle
    document.addEventListener('click', (e) => {
        menuWrappers.forEach(wrapper => {
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove('open');
            }
        });
    });

    // --- 3. PŘEPÍNÁNÍ ZÁLOŽEK UVNITŘ MEGA MENU ---
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    if (sidebarItems.length > 0) {
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation(); // Aby se menu nezavřelo
                
                const parentMenu = item.closest('.mega-menu');
                if (!parentMenu) return;

                // Deaktivovat ostatní v sidebaru
                parentMenu.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Zobrazit obsahový panel
                const targetId = item.getAttribute('data-tab');
                parentMenu.querySelectorAll('.content-panel').forEach(panel => panel.classList.remove('active'));
                
                // Hledáme panel uvnitř stejného menu
                const targetPanel = parentMenu.querySelector(`#${targetId}`);
                // Pokud není uvnitř (někdy bývá globálně podle ID), zkusíme document
                const finalPanel = targetPanel || document.getElementById(targetId);
                
                if (finalPanel) {
                    finalPanel.classList.add('active');
                }
            });
        });
    }

    // --- 4. FORMULÁŘE - REGISTRACE A PŘIHLÁŠENÍ ---
    
    // a) Registrace
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const pass = document.getElementById('regPass').value;
            const msg = document.getElementById('regMsg');

            if(name && email && pass) {
                // Uložit uživatele
                const user = { name: name, email: email, pass: pass };
                localStorage.setItem('nvidiaUser', JSON.stringify(user));
                
                // OKAMŽITÉ PŘIHLÁŠENÍ PO REGISTRACI
                localStorage.setItem('isLoggedIn', 'true');
                
                // Reset formuláře
                regForm.reset();
                
                // Zavřít modal
                document.getElementById('authModal').style.display = 'none';
                
                // Aktualizovat UI
                checkLoginStatus();
                
                alert("Registration Successful! You are now logged in.");
            } else {
                msg.innerText = "Please fill all fields.";
            }
        });
    }

    // b) Přihlášení
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const pass = document.getElementById('loginPass').value;
            const msg = document.getElementById('loginMsg');
            
            const storedUser = JSON.parse(localStorage.getItem('nvidiaUser'));

            if (storedUser && email === storedUser.email && pass === storedUser.pass) {
                localStorage.setItem('isLoggedIn', 'true');
                loginForm.reset();
                document.getElementById('authModal').style.display = 'none';
                checkLoginStatus();
                alert("Welcome back, " + storedUser.name + "!");
            } else {
                msg.innerText = "Invalid credentials or no account found.";
                msg.style.color = "red";
            }
        });
    }

    // Zavírání modalu křížkem
    const closeBtns = document.querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('authModal').style.display = 'none';
        });
    });

    // --- 5. INFO POPUP (DEMO) ---
    const infoModal = document.getElementById('infoModal');
    const infoCloseBtns = document.querySelectorAll('.info-close-btn, .info-ok-btn');
    const triggers = document.querySelectorAll('.trigger-popup');

    if (infoModal) {
        triggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Ignorovat social linky
                if (btn.closest('.social-icons') || btn.classList.contains('social-link')) return;
                
                e.preventDefault();
                infoModal.style.display = 'flex'; // Flex pro centrování
                
                // Zavřít menu, pokud je otevřené
                menuWrappers.forEach(w => w.classList.remove('open'));
            });
        });

        infoCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                infoModal.style.display = 'none';
            });
        });
    }

    // Zavření při kliknutí mimo okno
    window.addEventListener('click', (e) => {
        const authModal = document.getElementById('authModal');
        if (e.target == authModal) authModal.style.display = 'none';
        if (e.target == infoModal) infoModal.style.display = 'none';
    });

    // --- 6. ANIMACE TEXTU (HERO) ---
    const titleParts = document.querySelectorAll(".reveal-text");
    const subtitle = document.querySelector(".hero-subtitle");
    if(titleParts.length > 0) {
        setTimeout(() => {
            titleParts.forEach(part => part.classList.add("visible"));
            if(subtitle) subtitle.classList.add("visible");
        }, 300);
    }

    // --- 7. SHOP CAROUSEL ---
    const carouselContainer = document.querySelector('.hero-carousel-container');
    if (carouselContainer) {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.dot');
        const slideInterval = 8000;
        let currentSlide = 0;
        let autoSlideTimer;

        function goToSlide(index) {
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;
            
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() { goToSlide(currentSlide + 1); }

        function startTimer() {
            if(autoSlideTimer) clearInterval(autoSlideTimer);
            autoSlideTimer = setInterval(nextSlide, slideInterval);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                clearInterval(autoSlideTimer);
                const index = parseInt(e.target.getAttribute('data-index'));
                goToSlide(index);
                startTimer();
            });
        });

        startTimer();
    }
});