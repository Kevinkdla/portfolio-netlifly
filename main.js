/* ================================================================
   KEVIN GRANDAY PORTFOLIO — JS
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- NAVBAR ---------- */
    const nav       = document.getElementById('nav');
    const navLinks  = document.querySelectorAll('.nav__link');
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

    // Menu mobile via <dialog> (top layer natif — aucun problème de z-index)
    if (navDialog) {
        navToggle.addEventListener('click', () => {
            if (navDialog.open) {
                navDialog.close();
                navToggle.classList.remove('active');
            } else {
                navDialog.showModal();
                navToggle.classList.add('active');
            }
        });

        // Ferme au clic sur un lien
        navDialog.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navDialog.close();
                navToggle.classList.remove('active');
            });
        });

        // Ferme sur la touche Escape (natif dialog)
        navDialog.addEventListener('cancel', () => {
            navToggle.classList.remove('active');
        });
    }

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
                lightboxPdf.src = 'docs/cv.pdf';
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
