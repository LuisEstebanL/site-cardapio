/**
 * Sem-Banha Smokehouse & Brasa Brasileira
 * Main Application Logic & Reactive Store
 */

document.addEventListener("DOMContentLoaded", () => {
    // Application State
    const state = {
        activeTab: "menu",
        activeCategory: "todos",
        searchQuery: "",
        cart: JSON.parse(JSON.stringify(RESTAURANT_DATA.initialComanda)),
        splitCount: 4,
        tipPercent: 12,
        paymentMethod: "pix",
        isPaid: false,
        loyaltyStamps: RESTAURANT_DATA.loyalty.currentStamps,
        selectedFrame: "fogo-brasa",
        cameraStream: null,
        capturedPhotoData: null,
        muralList: [...RESTAURANT_DATA.mural],
        activeModalDish: null,
        modalSelectedSide: null,
        modalSelectedSauces: [],
        modalQty: 1
    };

    // DOM Elements
    const elements = {
        // Nav
        navLinks: document.querySelectorAll(".nav-link"),
        mobileNavItems: document.querySelectorAll(".mobile-nav-item"),
        viewPanels: document.querySelectorAll(".view-panel"),
        btnWaiters: document.querySelectorAll(".btn-waiter"),
        
        // Menu
        dishesGrid: document.getElementById("dishes-grid"),
        categoryScroll: document.getElementById("category-scroll"),
        searchInput: document.getElementById("search-input"),
        loyaltyBannerProgress: document.getElementById("loyalty-progress-fill"),
        loyaltyBannerCount: document.getElementById("loyalty-stamp-count"),
        
        // Comanda & Bill
        sidebarComandaList: document.getElementById("sidebar-comanda-items"),
        billItemsList: document.getElementById("bill-items-list"),
        sidebarSubtotal: document.getElementById("sidebar-subtotal"),
        sidebarTotal: document.getElementById("sidebar-total"),
        billSubtotal: document.getElementById("bill-subtotal"),
        billTipAmount: document.getElementById("bill-tip-amount"),
        billDiscountAmount: document.getElementById("bill-discount-amount"),
        billTotalAmount: document.getElementById("bill-total-amount"),
        billSplitVal: document.getElementById("bill-split-value"),
        splitPills: document.querySelectorAll(".split-pill"),
        tipButtons: document.querySelectorAll(".tip-btn"),
        paymentOptions: document.querySelectorAll(".payment-option"),
        pixBox: document.getElementById("pix-box"),
        btnCopyPix: document.getElementById("btn-copy-pix"),
        btnSimulatePix: document.getElementById("btn-simulate-pix"),
        btnCheckoutCta: document.getElementById("btn-checkout-cta"),
        cartBadgeCounters: document.querySelectorAll(".cart-badge-count"),
        floatingStatusPill: document.getElementById("mobile-floating-status"),

        // Camera Studio
        video: document.getElementById("camera-video"),
        canvas: document.getElementById("camera-canvas"),
        capturedImg: document.getElementById("captured-image"),
        shutterBtn: document.getElementById("btn-shutter"),
        btnTimer: document.getElementById("btn-timer"),
        btnFlipCam: document.getElementById("btn-flip-cam"),
        stampOverlay: document.getElementById("stamp-overlay"),
        framePills: document.querySelectorAll(".frame-pill"),
        btnSaveStamp: document.getElementById("btn-save-stamp"),
        btnSkipPhoto: document.getElementById("btn-skip-photo"),
        cameraFlash: document.getElementById("camera-flash"),
        
        // Passport
        stampsGrid: document.getElementById("stamps-grid"),
        passportRewardBox: document.getElementById("passport-reward-box"),
        btnCopyCoupon: document.getElementById("btn-copy-coupon"),
        btnRedeemWaiter: document.getElementById("btn-redeem-waiter"),
        btnShareAchievement: document.getElementById("btn-share-achievement"),
        muralGrid: document.getElementById("mural-grid"),

        // Dish Modal
        modalOverlay: document.getElementById("dish-modal-overlay"),
        modalCloseBtn: document.getElementById("modal-close-btn"),
        modalHeroImg: document.getElementById("modal-hero-img"),
        modalTitle: document.getElementById("modal-title"),
        modalPrice: document.getElementById("modal-price"),
        modalDesc: document.getElementById("modal-desc"),
        modalSidesList: document.getElementById("modal-sides-list"),
        modalSaucesList: document.getElementById("modal-sauces-list"),
        modalNotes: document.getElementById("modal-notes"),
        modalQtyVal: document.getElementById("modal-qty-val"),
        btnModalQtyMinus: document.getElementById("modal-qty-minus"),
        btnModalQtyPlus: document.getElementById("modal-qty-plus"),
        btnModalAdd: document.getElementById("btn-modal-add"),

        // Waiter Modal
        waiterModalOverlay: document.getElementById("waiter-modal-overlay"),
        waiterModalClose: document.getElementById("waiter-modal-close"),
        waiterOptions: document.querySelectorAll(".waiter-option-btn")
    };

    /* ==========================================================================
       Navigation Handling
       ========================================================================== */
    function switchTab(tabId) {
        state.activeTab = tabId;

        // Update nav styling
        elements.navLinks.forEach(link => {
            link.classList.toggle("active", link.dataset.tab === tabId);
        });
        elements.mobileNavItems.forEach(item => {
            item.classList.toggle("active", item.dataset.tab === tabId);
        });

        // Update panels
        elements.viewPanels.forEach(panel => {
            panel.classList.toggle("active", panel.id === `view-${tabId}`);
        });

        // Lifecycle for specific views
        if (tabId === "camera") {
            startCamera();
        } else {
            stopCamera();
        }

        if (tabId === "passport") {
            renderPassport();
        }

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    elements.navLinks.forEach(link => {
        link.addEventListener("click", () => switchTab(link.dataset.tab));
    });
    elements.mobileNavItems.forEach(item => {
        item.addEventListener("click", () => switchTab(item.dataset.tab));
    });

    document.querySelectorAll(".btn-open-comanda").forEach(btn => {
        btn.addEventListener("click", () => switchTab("bill"));
    });
    document.querySelectorAll(".btn-open-menu").forEach(btn => {
        btn.addEventListener("click", () => switchTab("menu"));
    });

    /* ==========================================================================
       Menu Rendering & Search
       ========================================================================== */
    function renderCategories() {
        if (!elements.categoryScroll) return;
        elements.categoryScroll.innerHTML = RESTAURANT_DATA.categories.map(cat => `
            <button class="category-pill ${cat.id === state.activeCategory ? 'active' : ''}" data-category="${cat.id}">
                <span>${cat.icon}</span>
                <span>${cat.label}</span>
            </button>
        `).join("");

        elements.categoryScroll.querySelectorAll(".category-pill").forEach(pill => {
            pill.addEventListener("click", () => {
                state.activeCategory = pill.dataset.category;
                renderCategories();
                renderDishes();
            });
        });
    }

    function renderDishes() {
        if (!elements.dishesGrid) return;

        const filtered = RESTAURANT_DATA.dishes.filter(dish => {
            const matchesCategory = state.activeCategory === "todos" || 
                                    dish.category === state.activeCategory ||
                                    (state.activeCategory === "favoritos" && dish.badges.some(b => b.includes("ASSINATURA") || b.includes("CLÁSSICO")));
            
            const q = state.searchQuery.toLowerCase();
            const matchesSearch = dish.name.toLowerCase().includes(q) ||
                                  dish.description.toLowerCase().includes(q) ||
                                  dish.badges.some(b => b.toLowerCase().includes(q));

            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            elements.dishesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                    <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔍</p>
                    <p style="font-weight: 700; color: #FFF;">Nenhum prato encontrado para "${state.searchQuery}"</p>
                    <p style="font-size: 0.85rem;">Tente buscar por cortes, feijoada, costela ou chopp.</p>
                </div>
            `;
            return;
        }

        elements.dishesGrid.innerHTML = filtered.map(dish => `
            <div class="dish-card" data-id="${dish.id}">
                <div class="dish-media">
                    <img class="dish-image" src="${dish.image}" alt="${dish.name}" onerror="this.onerror=null; this.src='${dish.fallbackImage}';">
                    <div class="dish-badges">
                        ${dish.badges.map(b => `
                            <span class="dish-badge ${b.includes('CLÁSSICO') || b.includes('ASSINATURA') ? 'badge-classic' : 'badge-wood'}">${b}</span>
                        `).join("")}
                    </div>
                </div>
                <div class="dish-body">
                    <div class="dish-meta">
                        <span>${dish.serving}</span>
                        <span>•</span>
                        <span>${dish.weight}</span>
                    </div>
                    <h3 class="dish-name">${dish.name}</h3>
                    <p class="dish-desc">${dish.description}</p>
                    <div class="dish-footer">
                        <div class="dish-price-wrap">
                            <span class="dish-price-label">Preço Individual</span>
                            <span class="dish-price">R$ ${dish.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button class="btn-add btn-open-dish-modal" data-id="${dish.id}">
                            <span>+ Pedir</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join("");

        // Attach listeners to open modal
        elements.dishesGrid.querySelectorAll(".btn-open-dish-modal").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                openDishModal(btn.dataset.id);
            });
        });

        elements.dishesGrid.querySelectorAll(".dish-card").forEach(card => {
            card.addEventListener("click", () => {
                openDishModal(card.dataset.id);
            });
        });
    }

    if (elements.searchInput) {
        elements.searchInput.addEventListener("input", (e) => {
            state.searchQuery = e.target.value.trim();
            renderDishes();
        });
    }

    /* ==========================================================================
       Dish Customizer Modal (iPhone 16 - 5)
       ========================================================================== */
    function openDishModal(dishId) {
        const dish = RESTAURANT_DATA.dishes.find(d => d.id === dishId);
        if (!dish) return;

        state.activeModalDish = dish;
        state.modalSelectedSide = dish.acompanhamentos.length > 0 ? dish.acompanhamentos[0].id : null;
        state.modalSelectedSauces = [];
        state.modalQty = 1;
        if (elements.modalNotes) elements.modalNotes.value = "";

        // Populate fields
        elements.modalHeroImg.src = dish.image;
        elements.modalHeroImg.onerror = () => { elements.modalHeroImg.src = dish.fallbackImage; };
        elements.modalTitle.textContent = dish.name;
        elements.modalDesc.textContent = dish.description;
        
        renderModalSides(dish);
        renderModalSauces(dish);
        updateModalTotal();

        elements.modalOverlay.classList.add("active");
    }

    function renderModalSides(dish) {
        if (!elements.modalSidesList) return;
        if (dish.acompanhamentos.length === 0) {
            elements.modalSidesList.parentElement.style.display = "none";
            return;
        }
        elements.modalSidesList.parentElement.style.display = "block";
        elements.modalSidesList.innerHTML = dish.acompanhamentos.map(side => `
            <div class="custom-option-item ${side.id === state.modalSelectedSide ? 'selected' : ''}" data-side="${side.id}">
                <div class="custom-option-left">
                    <input type="radio" name="side_choice" ${side.id === state.modalSelectedSide ? 'checked' : ''}>
                    <div>
                        <div style="font-size: 0.85rem; font-weight: 700; color: #FFF;">${side.name}</div>
                        <div style="font-size: 0.7rem; color: var(--text-muted);">${side.desc}</div>
                    </div>
                </div>
                <span style="font-size: 0.75rem; color: var(--gold-400); font-weight: 700;">Incluso</span>
            </div>
        `).join("");

        elements.modalSidesList.querySelectorAll(".custom-option-item").forEach(item => {
            item.addEventListener("click", () => {
                state.modalSelectedSide = item.dataset.side;
                renderModalSides(dish);
                updateModalTotal();
            });
        });
    }

    function renderModalSauces(dish) {
        if (!elements.modalSaucesList) return;
        if (dish.molhos.length === 0) {
            elements.modalSaucesList.parentElement.style.display = "none";
            return;
        }
        elements.modalSaucesList.parentElement.style.display = "block";
        elements.modalSaucesList.innerHTML = dish.molhos.map(sauce => {
            const isSelected = state.modalSelectedSauces.includes(sauce.id);
            return `
                <div class="custom-option-item ${isSelected ? 'selected' : ''}" data-sauce="${sauce.id}">
                    <div class="custom-option-left">
                        <input type="checkbox" ${isSelected ? 'checked' : ''}>
                        <div>
                            <div style="font-size: 0.85rem; font-weight: 700; color: #FFF;">${sauce.name}</div>
                            <div style="font-size: 0.7rem; color: var(--text-muted);">${sauce.price > 0 ? '+ R$ ' + sauce.price.toFixed(2).replace('.', ',') : 'Grátis'}</div>
                        </div>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--gold-400); font-weight: 700;">
                        ${sauce.price > 0 ? '+ R$ ' + sauce.price.toFixed(2).replace('.', ',') : 'Grátis'}
                    </span>
                </div>
            `;
        }).join("");

        elements.modalSaucesList.querySelectorAll(".custom-option-item").forEach(item => {
            item.addEventListener("click", () => {
                const sId = item.dataset.sauce;
                if (state.modalSelectedSauces.includes(sId)) {
                    state.modalSelectedSauces = state.modalSelectedSauces.filter(id => id !== sId);
                } else {
                    if (state.modalSelectedSauces.length < 2) {
                        state.modalSelectedSauces.push(sId);
                    } else {
                        showToast("Você pode selecionar no máximo 2 molhos adicionais.");
                    }
                }
                renderModalSauces(dish);
                updateModalTotal();
            });
        });
    }

    function updateModalTotal() {
        if (!state.activeModalDish) return;
        let base = state.activeModalDish.price;
        state.modalSelectedSauces.forEach(sId => {
            const sauce = state.activeModalDish.molhos.find(m => m.id === sId);
            if (sauce) base += sauce.price;
        });

        const total = base * state.modalQty;
        elements.modalPrice.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        elements.modalQtyVal.textContent = state.modalQty;
        elements.btnModalAdd.innerHTML = `<span>ADICIONAR À COMANDA · R$ ${total.toFixed(2).replace('.', ',')}</span>`;
    }

    if (elements.btnModalQtyMinus) {
        elements.btnModalQtyMinus.addEventListener("click", () => {
            if (state.modalQty > 1) {
                state.modalQty--;
                updateModalTotal();
            }
        });
    }

    if (elements.btnModalQtyPlus) {
        elements.btnModalQtyPlus.addEventListener("click", () => {
            state.modalQty++;
            updateModalTotal();
        });
    }

    if (elements.btnModalAdd) {
        elements.btnModalAdd.addEventListener("click", () => {
            const dish = state.activeModalDish;
            if (!dish) return;

            const existing = state.cart.find(item => item.id === dish.id);
            if (existing) {
                existing.qty += state.modalQty;
            } else {
                state.cart.push({
                    id: dish.id,
                    name: dish.name,
                    tag: state.modalSelectedSide ? `Acomp: ${state.modalSelectedSide}` : "Prato Principal",
                    type: dish.serving,
                    price: dish.price,
                    qty: state.modalQty,
                    time: "Pedido Agora",
                    status: "preparing"
                });
            }

            elements.modalOverlay.classList.remove("active");
            updateComandaAndBill();
            showToast(`🔥 ${state.modalQty}x ${dish.name} adicionado à comanda!`);
        });
    }

    if (elements.modalCloseBtn) {
        elements.modalCloseBtn.addEventListener("click", () => {
            elements.modalOverlay.classList.remove("active");
        });
    }
    if (elements.modalOverlay) {
        elements.modalOverlay.addEventListener("click", (e) => {
            if (e.target === elements.modalOverlay) elements.modalOverlay.classList.remove("active");
        });
    }

    /* ==========================================================================
       Comanda & Bill Calculation (Totals, Split, Tips)
       ========================================================================== */
    function updateComandaAndBill() {
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const tipRate = state.tipPercent / 100;
        const tipAmount = subtotal * tipRate;
        const discountRate = state.paymentMethod === "pix" ? 0.05 : 0;
        const discountAmount = subtotal * discountRate;
        const finalTotal = subtotal + tipAmount - discountAmount;
        const perPerson = state.splitCount > 0 ? (finalTotal / state.splitCount) : finalTotal;
        const totalItemsCount = state.cart.reduce((sum, item) => sum + item.qty, 0);

        // Update Cart Badges
        elements.cartBadgeCounters.forEach(counter => {
            counter.textContent = totalItemsCount;
        });

        // Update Summary Texts
        const fmt = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;
        if (elements.sidebarSubtotal) elements.sidebarSubtotal.textContent = fmt(subtotal);
        if (elements.sidebarTotal) elements.sidebarTotal.textContent = fmt(finalTotal);
        if (elements.billSubtotal) elements.billSubtotal.textContent = fmt(subtotal);
        if (elements.billTipAmount) elements.billTipAmount.textContent = fmt(tipAmount);
        if (elements.billDiscountAmount) elements.billDiscountAmount.textContent = `- ${fmt(discountAmount)}`;
        if (elements.billTotalAmount) elements.billTotalAmount.textContent = fmt(finalTotal);
        if (elements.billSplitVal) elements.billSplitVal.textContent = fmt(perPerson);
        if (elements.btnCheckoutCta) {
            elements.btnCheckoutCta.querySelector(".checkout-btn-text").textContent = `Pagar ${fmt(finalTotal)} & Ativar Câmera`;
        }

        renderComandaItems();
    }

    function renderComandaItems() {
        const itemHtml = (item) => `
            <div class="comanda-item" data-id="${item.id}">
                <div class="comanda-item-info">
                    <div class="comanda-item-title">${item.qty}x ${item.name}</div>
                    <div class="comanda-item-tag">${item.tag || item.type}</div>
                    <div class="comanda-item-status">
                        <span>🕒</span>
                        <span>${item.time}</span>
                    </div>
                </div>
                <div class="comanda-item-controls">
                    <span class="comanda-item-price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
                    <div class="qty-stepper">
                        <button class="qty-btn btn-qty-minus" data-id="${item.id}">−</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn btn-qty-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
            </div>
        `;

        if (elements.sidebarComandaList) {
            elements.sidebarComandaList.innerHTML = state.cart.map(itemHtml).join("");
            attachQtyListeners(elements.sidebarComandaList);
        }
        if (elements.billItemsList) {
            elements.billItemsList.innerHTML = state.cart.map(itemHtml).join("");
            attachQtyListeners(elements.billItemsList);
        }
    }

    function attachQtyListeners(container) {
        container.querySelectorAll(".btn-qty-minus").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const item = state.cart.find(i => i.id === id);
                if (item) {
                    item.qty--;
                    if (item.qty <= 0) {
                        state.cart = state.cart.filter(i => i.id !== id);
                    }
                    updateComandaAndBill();
                }
            });
        });

        container.querySelectorAll(".btn-qty-plus").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const item = state.cart.find(i => i.id === id);
                if (item) {
                    item.qty++;
                    updateComandaAndBill();
                }
            });
        });
    }

    // Split buttons
    elements.splitPills.forEach(pill => {
        pill.addEventListener("click", () => {
            elements.splitPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            state.splitCount = parseInt(pill.dataset.split, 10);
            updateComandaAndBill();
        });
    });

    // Tip buttons
    elements.tipButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            elements.tipButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            state.tipPercent = parseInt(btn.dataset.tip, 10);
            updateComandaAndBill();
        });
    });

    // Payment methods
    elements.paymentOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            elements.paymentOptions.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            state.paymentMethod = opt.dataset.method;
            if (elements.pixBox) {
                elements.pixBox.classList.toggle("active", state.paymentMethod === "pix");
            }
            updateComandaAndBill();
        });
    });

    // PIX actions
    if (elements.btnCopyPix) {
        elements.btnCopyPix.addEventListener("click", () => {
            const pixCode = "00020126580014BR.GOV.BCB.PIX0136sembanha-smokehouse-mesa14@bbq.com.br5204000053039865406277.385802BR5925SEMBANHA SMOKEHOUSE6009SAO PAULO62070503***6304E8A2";
            navigator.clipboard.writeText(pixCode).then(() => {
                showToast("🔑 Código PIX Copia e Cola copiado com sucesso!");
            }).catch(() => {
                showToast("Chave PIX: sembanha-smokehouse-mesa14@bbq.com.br");
            });
        });
    }

    if (elements.btnSimulatePix) {
        elements.btnSimulatePix.addEventListener("click", () => {
            processPaymentSuccess();
        });
    }

    if (elements.btnCheckoutCta) {
        elements.btnCheckoutCta.addEventListener("click", () => {
            processPaymentSuccess();
        });
    }

    function processPaymentSuccess() {
        state.isPaid = true;
        state.loyaltyStamps = 8; // Unlock 8th stamp!
        RESTAURANT_DATA.loyalty.stamps[7].completed = true;

        showToast("🎉 Pagamento aprovado! 8º Selo conquistado!");
        triggerConfetti();

        // Unlock banner
        if (elements.loyaltyBannerProgress) elements.loyaltyBannerProgress.style.width = "100%";
        if (elements.loyaltyBannerCount) elements.loyaltyBannerCount.textContent = "8/8 Selos";

        // Redirect to Camera to take the table celebration photo
        setTimeout(() => {
            switchTab("camera");
        }, 1200);
    }

    /* ==========================================================================
       Camera Studio & Canvas Stamping (iPhone 16 - 3 & MacBook Air - 5)
       ========================================================================== */
    function startCamera() {
        if (!elements.video) return;

        // Try accessing real device camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } } 
            }).then(stream => {
                state.cameraStream = stream;
                elements.video.srcObject = stream;
                elements.video.style.display = "block";
                if (elements.capturedImg) elements.capturedImg.style.display = "none";
                elements.video.play();
            }).catch(err => {
                console.log("Webcam access note (using live fallback preview):", err);
                fallbackCameraView();
            });
        } else {
            fallbackCameraView();
        }
    }

    function fallbackCameraView() {
        if (elements.video) elements.video.style.display = "none";
        if (elements.capturedImg) {
            elements.capturedImg.style.display = "block";
            elements.capturedImg.src = "assets/images/toast-friends.jpg";
            elements.capturedImg.onerror = () => {
                elements.capturedImg.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80";
            };
        }
    }

    function stopCamera() {
        if (state.cameraStream) {
            state.cameraStream.getTracks().forEach(track => track.stop());
            state.cameraStream = null;
        }
    }

    // Frame Pill Selection
    elements.framePills.forEach(pill => {
        pill.addEventListener("click", () => {
            elements.framePills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            state.selectedFrame = pill.dataset.frame;
            
            // Update overlay border
            if (elements.stampOverlay) {
                elements.stampOverlay.className = `stamp-overlay frame-${pill.dataset.frame}`;
                const badge = elements.stampOverlay.querySelector(".stamp-top-badge");
                if (badge) badge.textContent = pill.dataset.badge || "🔥 SEM-BANHA BBQ";
            }
        });
    });

    // Shutter Trigger
    if (elements.shutterBtn) {
        elements.shutterBtn.addEventListener("click", () => {
            takePhoto();
        });
    }

    function takePhoto() {
        // Flash animation
        if (elements.cameraFlash) {
            elements.cameraFlash.classList.add("flash-active");
            setTimeout(() => elements.cameraFlash.classList.remove("flash-active"), 150);
        }

        const canvas = elements.canvas;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = 640;
        canvas.height = 480;

        if (state.cameraStream && elements.video && elements.video.videoWidth > 0) {
            ctx.drawImage(elements.video, 0, 0, canvas.width, canvas.height);
        } else if (elements.capturedImg) {
            // Draw fallback image
            ctx.drawImage(elements.capturedImg, 0, 0, canvas.width, canvas.height);
        }

        // Apply Frame & Watermark Stamp onto Canvas
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, canvas.height - 70, canvas.width, 70);

        // Gold border
        ctx.strokeStyle = state.selectedFrame === "fogo-brasa" ? "#E65100" : "#F59E0B";
        ctx.lineWidth = 10;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Stamp Text
        ctx.fillStyle = "#FBBF24";
        ctx.font = "bold 16px -apple-system, sans-serif";
        ctx.fillText("SEM-BANHA BBQ OFICIAL · MESA 14", 20, canvas.height - 40);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12px -apple-system, sans-serif";
        const dateStr = new Date().toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' });
        ctx.fillText(`Passaporte Pitmaster 8/8 • ${dateStr}`, 20, canvas.height - 20);

        // Gold seal
        ctx.fillStyle = "#E65100";
        ctx.fillRect(canvas.width - 140, canvas.height - 55, 120, 36);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 12px -apple-system, sans-serif";
        ctx.fillText("⭐ 8º SELO MESA", canvas.width - 130, canvas.height - 32);

        // Convert canvas to image
        const photoData = canvas.toDataURL("image/jpeg", 0.9);
        state.capturedPhotoData = photoData;

        if (elements.capturedImg) {
            elements.capturedImg.src = photoData;
            elements.capturedImg.style.display = "block";
            if (elements.video) elements.video.style.display = "none";
        }

        showToast("📸 Foto capturada com carimbo temático!");
    }

    if (elements.btnSaveStamp) {
        elements.btnSaveStamp.addEventListener("click", () => {
            const photoUrl = state.capturedPhotoData || "assets/images/toast-friends.jpg";
            // Add new memory to Mural
            state.muralList.unshift({
                id: `mural-new-${Date.now()}`,
                title: "Noite Lendária na Brasa",
                subtitle: "Mesa 14 · Salão Principal",
                date: "Hoje às " + RESTAURANT_DATA.info.openedAt,
                image: photoUrl,
                fallbackImage: photoUrl,
                tag: "#PitmasterFinal #8Selos"
            });

            state.loyaltyStamps = 8;
            RESTAURANT_DATA.loyalty.stamps[7].completed = true;

            triggerConfetti();
            showToast("🎖 Foto eternizada no Mural e 8º Selo carimbado!");
            setTimeout(() => switchTab("passport"), 900);
        });
    }

    if (elements.btnSkipPhoto) {
        elements.btnSkipPhoto.addEventListener("click", () => {
            state.loyaltyStamps = 8;
            RESTAURANT_DATA.loyalty.stamps[7].completed = true;
            showToast("8º Selo carimbado com sucesso!");
            switchTab("passport");
        });
    }

    /* ==========================================================================
       Passport & Loyalty Rendering (iPhone 16 - 4 & MacBook Air - 2)
       ========================================================================== */
    function renderPassport() {
        if (!elements.stampsGrid) return;

        elements.stampsGrid.innerHTML = RESTAURANT_DATA.loyalty.stamps.map(st => `
            <div class="stamp-slot ${st.completed ? 'stamped' : ''}">
                <div class="stamp-icon-circle">
                    ${st.completed ? '🔥' : st.number}
                </div>
                <span class="stamp-date">${st.date}</span>
                <span class="stamp-table">${st.table}</span>
            </div>
        `).join("");

        renderMural();
    }

    function renderMural() {
        if (!elements.muralGrid) return;
        elements.muralGrid.innerHTML = state.muralList.map(item => `
            <div class="mural-card">
                <div class="mural-media">
                    <img class="mural-img" src="${item.image}" alt="${item.title}" onerror="this.onerror=null; this.src='${item.fallbackImage}';">
                    <span class="mural-badge">${item.tag}</span>
                </div>
                <div class="mural-body">
                    <h4 class="mural-card-title">${item.title}</h4>
                    <p class="mural-card-date">${item.date}</p>
                </div>
            </div>
        `).join("");
    }

    if (elements.btnCopyCoupon) {
        elements.btnCopyCoupon.addEventListener("click", () => {
            navigator.clipboard.writeText(RESTAURANT_DATA.loyalty.couponCode).then(() => {
                showToast("📋 Cupom #SEMBANHA-8SELOS-2025 copiado!");
            }).catch(() => {
                showToast("Cupom: #SEMBANHA-8SELOS-2025");
            });
        });
    }

    if (elements.btnRedeemWaiter) {
        elements.btnRedeemWaiter.addEventListener("click", () => {
            showToast("🔔 Garçom Lucas notificado para liberar seu Brinde Lendário!");
        });
    }

    if (elements.btnShareAchievement) {
        elements.btnShareAchievement.addEventListener("click", () => {
            if (navigator.share) {
                navigator.share({
                    title: "Sou Mestre Churrasqueiro no Sem-Banha Smokehouse!",
                    text: "Carimbei os 8 selos da Brasa Viva no Sem-Banha BBQ! Ganhei uma sobremesa na brasa de cortesia!",
                    url: window.location.href
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(window.location.href);
                showToast("Link de conquista copiado para a área de transferência!");
            }
        });
    }

    /* ==========================================================================
       Waiter Call Modal & Support
       ========================================================================== */
    elements.btnWaiters.forEach(btn => {
        btn.addEventListener("click", () => {
            if (elements.waiterModalOverlay) elements.waiterModalOverlay.classList.add("active");
        });
    });

    if (elements.waiterModalClose) {
        elements.waiterModalClose.addEventListener("click", () => {
            elements.waiterModalOverlay.classList.remove("active");
        });
    }
    if (elements.waiterModalOverlay) {
        elements.waiterModalOverlay.addEventListener("click", (e) => {
            if (e.target === elements.waiterModalOverlay) elements.waiterModalOverlay.classList.remove("active");
        });
    }

    elements.waiterOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            const reason = opt.dataset.reason || "Atendimento";
            elements.waiterModalOverlay.classList.remove("active");
            showToast(`🔔 Chamado enviado! Garçom Lucas a caminho da Mesa 14 (${reason}).`);
        });
    });

    /* ==========================================================================
       Toast & Confetti Utilities
       ========================================================================== */
    function showToast(message) {
        const container = document.getElementById("toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<span>🔥</span><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(100%)";
            toast.style.transition = "all 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    function triggerConfetti() {
        const colors = ["#E65100", "#FF6D00", "#FBBF24", "#FFF", "#22C55E"];
        for (let i = 0; i < 40; i++) {
            const el = document.createElement("div");
            el.style.position = "fixed";
            el.style.zIndex = "10000";
            el.style.width = `${Math.random() * 8 + 6}px`;
            el.style.height = `${Math.random() * 12 + 6}px`;
            el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            el.style.left = `${Math.random() * 100}vw`;
            el.style.top = "-20px";
            el.style.borderRadius = "2px";
            el.style.transform = `rotate(${Math.random() * 360}deg)`;
            el.style.pointerEvents = "none";
            document.body.appendChild(el);

            const duration = Math.random() * 2 + 1.5;
            el.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(105vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                easing: "cubic-bezier(0.25, 1, 0.5, 1)"
            }).onfinish = () => el.remove();
        }
    }

    // Initial Boots
    renderCategories();
    renderDishes();
    updateComandaAndBill();
    renderPassport();
});
