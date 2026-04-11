/* ================================================================
   KEVIN GRANDAY PORTFOLIO — JS
   ================================================================ */

/* ---------- DARK MODE (anti-FOUC) ---------- */
(function () {
    var saved = localStorage.getItem('theme');
    var preferred = (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : saved;
    if (preferred === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- DARK MODE TOGGLE ---------- */
    const themeToggle    = document.getElementById('themeToggle');
    const themeToggleTop = document.getElementById('themeToggleTop');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        [themeToggle, themeToggleTop].forEach(btn => {
            if (!btn) return;
            const icon = btn.querySelector('i');
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                btn.setAttribute('aria-label', 'Thème clair');
            } else {
                icon.className = 'fas fa-moon';
                btn.setAttribute('aria-label', 'Thème sombre');
            }
        });
    }

    const currentTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(currentTheme);

    [themeToggle, themeToggleTop].forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
    });

    /* ---------- NAVBAR ---------- */
    const nav       = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navDialog = document.getElementById('navDialog');

    // Classe scrolled
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Lien actif selon la page courante (nav desktop + dialog mobile)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) link.classList.add('active');
    });

    // Menu mobile — slide-down avec push du contenu
    const hero = document.querySelector('.hero');

    function openMenu() {
        navDialog.showModal();
        navToggle.classList.add('active');
        // Pousse le hero vers le bas après que le dialog soit rendu
        requestAnimationFrame(() => {
            if (hero) {
                const menuH = navDialog.offsetHeight;
                hero.style.paddingTop = `calc(var(--nav-height) + ${menuH}px)`;
            }
        });
    }

    function closeMenu() {
        navDialog.classList.add('closing');
        navToggle.classList.remove('active');
        if (hero) hero.style.paddingTop = '';
        navDialog.addEventListener('animationend', () => {
            navDialog.classList.remove('closing');
            navDialog.close();
        }, { once: true });
    }

    if (navDialog) {
        navToggle.addEventListener('click', () => {
            navDialog.open ? closeMenu() : openMenu();
        });

        navDialog.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        navDialog.addEventListener('cancel', (e) => {
            e.preventDefault();
            closeMenu();
        });
    }

    /* ---------- SCROLL PROGRESS BAR ---------- */
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    }, { passive: true });

    /* ---------- TYPING ANIMATION ---------- */
    const typingEl = document.getElementById('heroTyping');
    if (typingEl) {
        const words = ['Infrastructure & Réseaux', 'Administration Systèmes', 'Cybersécurité'];
        let wordIndex = 0, charIndex = 0, deleting = false;

        function type() {
            const current = words[wordIndex];
            typingEl.textContent = current.slice(0, charIndex);
            if (!deleting) {
                charIndex++;
                if (charIndex > current.length) {
                    deleting = true;
                    setTimeout(type, 2000);
                    return;
                }
            } else {
                charIndex--;
                if (charIndex < 0) {
                    deleting = false;
                    charIndex = 0;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }
            setTimeout(type, deleting ? 35 : 75);
        }
        setTimeout(type, 1400);
    }

    /* ---------- COPY EMAIL ---------- */
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(btn.dataset.copy).then(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Copié';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-copy"></i>';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });

    /* ---------- BACK TO TOP ---------- */
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Retour en haut');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- REVEAL ON SCROLL ---------- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ---------- LIGHTBOX (parcours.html + veille.html) ---------- */
    const lightbox      = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightbox && lightboxClose) {
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            // Reset PDF si présent
            const pdf = document.getElementById('lightboxPdf');
            if (pdf) pdf.src = '';
        };

        // CV (parcours.html)
        const cvPreview   = document.getElementById('cvPreview');
        const lightboxPdf = document.getElementById('lightboxPdf');
        if (cvPreview && lightboxPdf) {
            cvPreview.addEventListener('click', () => {
                lightboxPdf.src = 'docs/kevin-kindiela-cv.pdf';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        // Lab (veille.html)
        const labPreview   = document.getElementById('labPreview');
        const lightboxImg  = document.getElementById('lightboxImg');
        if (labPreview && lightboxImg) {
            labPreview.addEventListener('click', () => {
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        // Thumbnails génériques avec data-img (realisations.html)
        document.querySelectorAll('[data-img]').forEach(el => {
            el.addEventListener('click', () => {
                const img = document.getElementById('lightboxImg');
                if (img) img.src = el.dataset.img;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    /* ---------- TRANSITIONS AU CLIC (nav links) ---------- */
    const PAGES = ['index.html', 'parcours.html', 'realisations.html', 'veille.html', 'projet.html', 'contact.html'];

    /* ---------- VEILLE TABS ---------- */
    const veilleTabBtns = document.querySelectorAll('.veille-tab');
    if (veilleTabBtns.length) {
        veilleTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                veilleTabBtns.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.veille-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const panel = document.getElementById('tab-' + btn.dataset.tab);
                if (panel) {
                    panel.classList.add('active');
                    // Déclenche les animations reveal sur les éléments du panel
                    panel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
                        el.classList.add('visible');
                    });
                }
            });
        });
    }

    /* ---------- INDICATEUR DE PAGE MOBILE (points) ---------- */
    const PAGE_LABELS = ['Accueil', 'Parcours', 'Réalisations', 'Veille', 'Projet', 'Contact'];
    const dotsNav = document.createElement('div');
    dotsNav.className = 'page-dots';
    const currentFilename = window.location.pathname.split('/').pop() || 'index.html';
    const currentDotIdx = PAGES.indexOf(currentFilename);

    PAGES.forEach((page, i) => {
        const dot = document.createElement('span');
        dot.className = 'page-dot' + (i === currentDotIdx ? ' page-dot--active' : '');
        dot.setAttribute('aria-label', PAGE_LABELS[i]);
        dot.title = PAGE_LABELS[i];
        dot.addEventListener('click', () => {
            if (i === currentDotIdx) return;
            const dir = i > currentDotIdx ? 'next' : 'prev';
            sessionStorage.setItem('swipeDir', dir);
            document.body.classList.add(dir === 'next' ? 'swipe-out-left' : 'swipe-out-right');
            setTimeout(() => { window.location.href = page; }, 120);
        });
        dotsNav.appendChild(dot);
    });
    document.body.appendChild(dotsNav);

    // Slide-in : on récupère la direction mémorisée avant la navigation
    const swipeDir = sessionStorage.getItem('swipeDir');
    if (swipeDir) {
        sessionStorage.removeItem('swipeDir');
        document.body.classList.add(swipeDir === 'next' ? 'swipe-in-right' : 'swipe-in-left');
    }

    // Transition fade-slide au clic sur les liens de nav
    const activePage = window.location.pathname.split('/').pop() || 'index.html';
    const currentIdx = PAGES.indexOf(activePage);

    document.querySelectorAll('.nav__link[href]').forEach(link => {
        const target = link.getAttribute('href').split('/').pop();
        if (!PAGES.includes(target) || target === activePage) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetIdx = PAGES.indexOf(target);
            const dir = targetIdx > currentIdx ? 'next' : 'prev';
            sessionStorage.setItem('swipeDir', dir);
            document.body.classList.add(dir === 'next' ? 'swipe-out-left' : 'swipe-out-right');
            setTimeout(() => { window.location.href = link.getAttribute('href'); }, 120);
        });
    });

    let _txStart = 0, _tyStart = 0;

    document.addEventListener('touchstart', (e) => {
        _txStart = e.touches[0].clientX;
        _tyStart = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - _txStart;
        const dy = e.changedTouches[0].clientY - _tyStart;

        // Seulement si swipe clairement horizontal (> 70px et plus horizontal que vertical)
        if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

        // Ne pas déclencher si la lightbox est ouverte
        const lb = document.getElementById('lightbox');
        if (lb && lb.classList.contains('active')) return;

        const filename = window.location.pathname.split('/').pop() || 'index.html';
        const idx = PAGES.indexOf(filename);
        if (idx === -1) return;

        if (dx < 0 && idx < PAGES.length - 1) {
            // Swipe gauche → page suivante
            sessionStorage.setItem('swipeDir', 'next');
            document.body.classList.add('swipe-out-left');
            setTimeout(() => { window.location.href = PAGES[idx + 1]; }, 120);
        } else if (dx > 0 && idx > 0) {
            // Swipe droite → page précédente
            sessionStorage.setItem('swipeDir', 'prev');
            document.body.classList.add('swipe-out-right');
            setTimeout(() => { window.location.href = PAGES[idx - 1]; }, 120);
        }
    }, { passive: true });

    /* ---------- MISSIONS FILTERING (realisations.html uniquement) ---------- */
    const missionsGrid = document.getElementById('missionsGrid');
    const filterCount  = document.getElementById('filterCount');

    if (missionsGrid) {
        const CATS_LABELS = {
            patrimoine: 'Gérer le patrimoine informatique',
            incidents:  'Répondre aux incidents',
            presence:   'Développer la présence en ligne',
            projet:     'Travailler en mode projet',
            service:    'Mettre à disposition un service informatique'
        };

        const MISSIONS = [
            { titre: 'Recenser & identifier les ressources numériques', desc: 'Schéma réseau complet. Cartographie des équipements actifs, serveurs et liens inter-sites.', tag: 'pro', cat: 'patrimoine', ctx: 'SIEC' },
            { titre: 'Exploiter des référentiels', desc: 'Infrastructure conforme aux référentiels en vigueur. Application des normes et bonnes pratiques.', tag: 'pro', cat: 'patrimoine', ctx: 'SIEC' },
            { titre: 'Assurer la continuité de service', desc: 'Mécanismes de redondance pour la haute disponibilité des services critiques.', tag: 'pro', cat: 'patrimoine', ctx: 'Stage / Alternance' },
            { titre: 'Gérer les sauvegardes', desc: 'Politique de sauvegarde complète. Planification, automatisation et vérification des sauvegardes.', tag: 'e6', cat: 'patrimoine', ctx: 'Projet E6' },
            { titre: 'Traitement de tickets (GLPI)', desc: 'Prise en charge, diagnostic et résolution de tickets d\'incidents via GLPI.', tag: 'pro', cat: 'incidents', ctx: 'Stage' },
            { titre: 'Portfolio en ligne', desc: 'Création et déploiement d\'un portfolio professionnel avec outils IA.', tag: 'perso', cat: 'presence', ctx: 'Personnel' },
            { titre: 'Organisation du projet E6', desc: 'Planification et réalisation du dossier E6 en mode projet. Gestion du planning, des livrables et de la documentation.', tag: 'e6', cat: 'projet', ctx: 'Projet E6' },
            { titre: 'Gestion de projet en entreprise', desc: 'Planification, suivi, réunions et livrables en contexte professionnel.', tag: 'pro', cat: 'projet', ctx: 'Stage / Alternance' },
            { titre: 'Déploiement de services réseau', desc: 'Installation et configuration de serveurs, services réseau et outils de supervision.', tag: 'e6', cat: 'service', ctx: 'Projet E6' },
            { titre: 'Mise en place Active Directory et GPO', desc: 'Déploiement d\'un annuaire Active Directory, création d\'unités d\'organisation, utilisateurs et stratégies de groupe.', tag: 'e6', cat: 'service', ctx: 'Projet E6' },
            { titre: 'Configuration DHCP / DNS', desc: 'Installation et paramétrage des services DHCP et DNS sur Windows Server. Attribution dynamique des adresses et résolution de noms.', tag: 'e6', cat: 'service', ctx: 'Projet E6' },
            { titre: 'Déploiement supervision Centreon', desc: 'Installation de Centreon, ajout des hôtes, configuration des sondes SNMP et création de tableaux de bord de monitoring.', tag: 'e6', cat: 'service', ctx: 'Projet E6' },
            { titre: 'Configuration pare-feu pfSense', desc: 'Mise en place de pfSense comme pare-feu et routeur. Règles de filtrage, NAT et segmentation réseau par VLAN.', tag: 'e6', cat: 'patrimoine', ctx: 'Projet E6' },
            { titre: 'Inventaire de parc informatique', desc: 'Déploiement d\'un outil d\'inventaire pour recenser les postes, serveurs et équipements réseau de l\'infrastructure.', tag: 'e6', cat: 'patrimoine', ctx: 'Projet E6' },
            { titre: 'Travaux pratiques réseaux', desc: 'Configuration de switchs, routeurs et VLAN en environnement de travaux pratiques. Adressage IPv4 et routage inter-VLAN.', tag: 'ecole', cat: 'service', ctx: 'TP IPSSI' },
            { titre: 'Travaux pratiques systèmes', desc: 'Installation et administration de Windows Server et Debian. Gestion des utilisateurs, droits et services.', tag: 'ecole', cat: 'service', ctx: 'TP IPSSI' },
            { titre: 'Deploy-ADInfra — Toolkit Windows Server', desc: 'Script PowerShell automatisant le déploiement complet d\'une infrastructure Windows Server : AD DS, DNS, DHCP, GPO, diagnostic réseau et sauvegarde depuis un menu interactif.', tag: 'perso', cat: 'service', ctx: 'Personnel' },
            { titre: 'PentestFR — Framework de pentest', desc: 'Framework Python modulaire couvrant les phases d\'un pentest : reconnaissance nmap/Shodan, brute-force Hydra, post-exploitation KeePass/Hashcat, MITM bettercap et phishing HTTPS.', tag: 'perso', cat: 'incidents', ctx: 'Personnel' },
        ];

        let currentTag = 'all';
        let activeCats = [];

        function renderMissions() {
            let html = '', count = 0;

            MISSIONS.forEach(m => {
                if (currentTag !== 'all' && m.tag !== currentTag) return;
                if (activeCats.length > 0 && !activeCats.includes(m.cat)) return;
                count++;
                html += `
                    <div class="mission-card">
                        <div class="mission-card__head">
                            <h4 class="mission-card__title">${m.titre}</h4>
                            <span class="mission-card__tag mission-card__tag--${m.tag}">${m.tag}</span>
                        </div>
                        <p class="mission-card__desc">${m.desc}</p>
                        <p class="mission-card__meta">${CATS_LABELS[m.cat]} — ${m.ctx}</p>
                    </div>`;
            });

            if (count === 0) {
                const msg = MISSIONS.length === 0
                    ? 'Les fiches de missions seront ajoutées ici prochainement.'
                    : 'Aucune mission ne correspond aux filtres sélectionnés.';
                html = `<p class="missions-grid__empty">${msg}</p>`;
            }

            missionsGrid.innerHTML = html;
        }

        // Projets personnels : visibilité selon filtre
        const persoProjects = document.getElementById('persoProjects');

        function updatePersoVisibility() {
            if (!persoProjects) return;
            const show = currentTag === 'all' || currentTag === 'perso';
            persoProjects.style.display = show ? '' : 'none';
        }

        // Filtres contexte
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTag = btn.dataset.filter;
                renderMissions();
                updatePersoVisibility();
            });
        });

        // Filtres catégories
        const catChecks = document.querySelectorAll('.cat-check input');
        const clearBtn  = document.getElementById('clearCategories');

        catChecks.forEach(cb => {
            cb.addEventListener('change', () => {
                activeCats = Array.from(document.querySelectorAll('.cat-check input:checked')).map(el => el.value);
                if (filterCount) filterCount.textContent = activeCats.length;
                renderMissions();
            });
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                catChecks.forEach(cb => { cb.checked = false; });
                activeCats = [];
                if (filterCount) filterCount.textContent = 0;
                renderMissions();
            });
        }

        renderMissions();
    }

});
