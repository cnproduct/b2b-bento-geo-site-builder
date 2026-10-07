/* ==========================================================================
   Naike Tableware - Bentgo® 1:1 Interactive Script Controller
   Manages Swatches, Quick View, Bundle Builder, Hotspots, Drawer, and GEO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFilterTabs();
  initColorSwatches();
  initAnatomyHotspots();
  initBundleBuilder();
  initFaqAccordion();
  initQuoteDrawer();
  initQuickViewModal();
  initGeoCurrencySwitcher();
  initMobileMenu();
  initRfqAndWhatsApp();
});

// 1. Category Filter Tabs
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.product-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        const match = (cat === 'all' || cardCat === cat || (cardCat && cardCat.split(/\s+/).includes(cat)));
        if (match) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

// 2. Color Swatches Interaction
function initColorSwatches() {
  document.querySelectorAll('.card-swatches').forEach(swatchGroup => {
    const dots = swatchGroup.querySelectorAll('.swatch-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        
        const card = dot.closest('.product-card');
        if (card) {
          const cardImg = card.querySelector('.card-img-wrap img');
          if (cardImg) {
            cardImg.style.transform = 'scale(0.96)';
            setTimeout(() => {
              cardImg.style.transform = 'scale(1)';
            }, 180);
          }
        }
      });
    });
  });
}

// 3. Bentgo "Inside The Box" Exploded Anatomy Hotspots
function initAnatomyHotspots() {
  const hotspots = document.querySelectorAll('.anatomy-hotspot');
  const layers = document.querySelectorAll('.layer-item');
  if (!hotspots.length || !layers.length) return;

  function activateLayer(index) {
    hotspots.forEach(h => h.classList.remove('active'));
    layers.forEach(l => l.classList.remove('active'));

    const activeHotspot = document.querySelector('.hotspot-' + index);
    const activeLayer = document.querySelector('.layer-item[data-layer="' + index + '"]');
    if (activeHotspot) activeHotspot.classList.add('active');
    if (activeLayer) activeLayer.classList.add('active');
  }

  hotspots.forEach(h => {
    h.addEventListener('click', () => {
      const idx = h.getAttribute('data-hotspot');
      activateLayer(idx);
    });
  });

  layers.forEach(l => {
    l.addEventListener('click', () => {
      const idx = l.getAttribute('data-layer');
      activateLayer(idx);
    });
  });
}

// 4. Bentgo "Build Your Own Bundle" Configurator
function initBundleBuilder() {
  const stepCols = document.querySelectorAll('.bundle-step-col');
  const totalPriceEl = document.querySelector('.bundle-total-price-val');
  const totalMsrpEl = document.querySelector('.bundle-total-msrp-val');
  const savingsEl = document.querySelector('.bundle-savings-val');
  if (!stepCols.length || !totalPriceEl) return;

  function updateBundleTotal() {
    let currentFob = 0;
    let currentMsrp = 0;

    document.querySelectorAll('.bundle-option-card.selected').forEach(opt => {
      currentFob += parseFloat(opt.getAttribute('data-price') || 0);
      currentMsrp += parseFloat(opt.getAttribute('data-msrp') || 0);
    });

    const discountedFob = (currentFob * 0.85).toFixed(2);
    const savings = (currentMsrp - discountedFob).toFixed(2);

    totalPriceEl.textContent = '$' + discountedFob;
    if (totalMsrpEl) totalMsrpEl.textContent = '$' + currentMsrp.toFixed(2);
    if (savingsEl) savingsEl.textContent = 'Save $' + savings + ' (Wholesale Tier)';
  }

  stepCols.forEach(col => {
    const options = col.querySelectorAll('.bundle-option-card');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        updateBundleTotal();
      });
    });
  });

  updateBundleTotal();
}

// 5. FAQ Accordion
function initFaqAccordion() {
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    const btn = card.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        faqCards.forEach(c => c.classList.remove('open'));
        if (!isOpen) {
          card.classList.add('open');
        }
      });
    }
  });
}

// 6. Quote Drawer & Cart
let quoteCart = [];

function initQuoteDrawer() {
  const drawer = document.getElementById('quoteDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const openBtns = document.querySelectorAll('.trigger-quote-drawer');
  const closeBtns = document.querySelectorAll('.close-drawer-btn');

  function openDrawer() {
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  openBtns.forEach(btn => btn.addEventListener('click', openDrawer));
  closeBtns.forEach(btn => btn.addEventListener('click', closeDrawer));
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.btn-add-quote').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id') || 'NK-PRODUCT';
      const name = btn.getAttribute('data-name') || 'Naike Bento Box';
      const price = btn.getAttribute('data-price') || '$2.35';
      const img = btn.getAttribute('data-img') || 'images/eazylunch_kids_5_bento.jpg';

      quoteCart.push({ id: id, name: name, price: price, img: img, qty: 1000 });
      renderQuoteCart();
      openDrawer();
    });
  });
}

function renderQuoteCart() {
  const container = document.getElementById('drawerItemsContainer');
  const badgeCounts = document.querySelectorAll('.quote-badge-count');
  badgeCounts.forEach(b => b.textContent = quoteCart.length);

  if (!container) return;
  if (quoteCart.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding: 40px 10px; color:#718096;"><p style="font-size:1.1rem; margin-bottom:8px;">Your Sourcing RFQ List is Empty</p><p style="font-size:0.85rem;">Select products to request factory-direct wholesale pricing.</p></div>';
    return;
  }

  let html = '';
  quoteCart.forEach((item, idx) => {
    html += '<div style="display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid #e2e8f0;">' +
      '<img src="' + item.img + '" style="width:54px; height:54px; object-fit:contain; border-radius:8px; border:1px solid #e2e8f0;">' +
      '<div style="flex-grow:1;">' +
        '<h5 style="font-size:0.88rem; font-weight:700; color:#112330;">' + item.name + '</h5>' +
        '<p style="font-size:0.78rem; color:#008290; font-weight:700;">FOB: ' + item.price + ' · MOQ: ' + item.qty + ' pcs</p>' +
      '</div>' +
      '<button onclick="removeQuoteItem(' + idx + ')" style="color:#ff5a5f; font-size:1rem; cursor:pointer;">✕</button>' +
    '</div>';
  });
  container.innerHTML = html;
}

window.removeQuoteItem = function(index) {
  quoteCart.splice(index, 1);
  renderQuoteCart();
};

// 7. Quick View Modal
function initQuickViewModal() {
  const modal = document.getElementById('quickViewModal');
  const modalBody = document.getElementById('quickViewBody');
  const closeBtn = document.getElementById('closeModalBtn');
  if (!modal || !modalBody) return;

  function closeModal() {
    modal.classList.remove('open');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.querySelectorAll('.btn-quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = btn.getAttribute('data-name');
      const sku = btn.getAttribute('data-sku');
      const img = btn.getAttribute('data-img');
      const fob = btn.getAttribute('data-fob');
      const msrp = btn.getAttribute('data-msrp');
      const desc = btn.getAttribute('data-desc');
      const specs = btn.getAttribute('data-specs');
      const moq = btn.getAttribute('data-moq');

      modalBody.innerHTML = '<div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:32px; align-items:center;">' +
        '<div style="background:#fdfdfd; padding:20px; border-radius:16px; border:1px solid #e2e8f0; text-align:center;">' +
          '<img src="' + img + '" style="max-height:320px; margin:0 auto; object-fit:contain;">' +
          '<p style="font-size:0.75rem; color:#718096; margin-top:10px;">High-resolution factory engineering sample</p>' +
        '</div>' +
        '<div>' +
          '<span style="background:#e6f5f7; color:#008290; padding:4px 10px; border-radius:999px; font-size:0.75rem; font-weight:700;">SKU: ' + sku + '</span>' +
          '<h2 style="font-size:1.5rem; font-weight:800; color:#112330; margin:10px 0 6px;">' + name + '</h2>' +
          '<p style="font-size:0.88rem; color:#4a5568; line-height:1.5; margin-bottom:16px;">' + desc + '</p>' +
          '<div style="background:#f8fbfc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:20px;">' +
            '<div style="display:flex; justify-content:space-between; margin-bottom:8px;">' +
              '<span style="font-size:0.85rem; color:#718096;">Wholesale FOB (Xiamen):</span>' +
              '<strong style="font-size:1.15rem; color:#008290;">' + fob + '</strong>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; margin-bottom:8px;">' +
              '<span style="font-size:0.85rem; color:#718096;">Recommended Retail MSRP:</span>' +
              '<span style="font-size:0.88rem; text-decoration:line-through; color:#718096;">' + msrp + '</span>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between;">' +
              '<span style="font-size:0.85rem; color:#718096;">Standard MOQ:</span>' +
              '<strong style="font-size:0.88rem; color:#112330;">' + moq + '</strong>' +
            '</div>' +
          '</div>' +
          '<div style="margin-bottom:20px;">' +
            '<h4 style="font-size:0.82rem; font-weight:700; color:#112330; text-transform:uppercase; margin-bottom:6px;">Key Specifications:</h4>' +
            '<p style="font-size:0.82rem; color:#4a5568;">' + specs + '</p>' +
          '</div>' +
          '<div style="display:flex; gap:12px;">' +
            '<button onclick="quoteCart.push({id:\'' + sku + '\', name:\'' + name + '\', price:\'' + fob + '\', img:\'' + img + '\', qty:1000}); renderQuoteCart(); document.getElementById(\'quickViewModal\').classList.remove(\'open\'); document.getElementById(\'quoteDrawer\').classList.add(\'open\');" class="btn-primary" style="flex-grow:1; justify-content:center;">Add to Sourcing RFQ</button>' +
            '<a href="contact.html?sku=' + sku + '" class="btn-secondary" style="justify-content:center;">Request Sample</a>' +
          '</div>' +
        '</div>' +
      '</div>';

      modal.classList.add('open');
    });
  });
}

// 8. International GEO & Currency Switcher
function initGeoCurrencySwitcher() {
  const switchers = document.querySelectorAll('.geo-switcher-select');
  switchers.forEach(select => {
    select.addEventListener('change', (e) => {
      const currency = e.target.value;
      console.log('Selected Currency/Region:', currency);
    });
  });
}

// 9. Mobile Menu Drawer
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });
  }
}

// 10. RFQ Form Submission & Captcha Controller
window.refreshDrawerCaptcha = function() {
  const qEl = document.getElementById('drawerCaptchaQuestion');
  const tokEl = document.getElementById('drawerCaptchaToken');
  const tokInput = document.getElementById('drawer_captcha_token');
  if (!qEl) return;
  
  qEl.textContent = '...';
  fetch('/api/captcha')
    .then(r => r.json())
    .then(data => {
      qEl.textContent = data.question;
      if (tokInput) tokInput.value = data.captcha_token;
    })
    .catch(() => {
      qEl.textContent = '3 + 4 = ?';
      if (tokInput) tokInput.value = '';
    });
};

window.handleDrawerRfqSubmit = function(e) {
  e.preventDefault();
  const form = document.getElementById('drawerRfqForm');
  const btn = document.getElementById('drawerSubmitBtn');
  const status = document.getElementById('drawerRfqStatus');
  if (!form || !btn || !status) return;

  const email = document.getElementById('drawer_email').value;
  const name = document.getElementById('drawer_name').value;
  const volume = document.getElementById('drawer_volume').value;
  const phone = document.getElementById('drawer_phone').value;
  const captcha_answer = document.getElementById('drawer_captcha_ans').value;
  const captcha_token = document.getElementById('drawer_captcha_token').value;

  // Compile cart items or default product
  let productDesc = 'Bentgo-Grade Bento Box Wholesale Inquiry';
  if (window.quoteCart && window.quoteCart.length > 0) {
    productDesc = window.quoteCart.map(i => i.name + ' (' + i.qty + ' pcs)').join(', ');
  }

  btn.disabled = true;
  btn.innerHTML = '<span>⏳ Transmitting RFQ to Factory...</span>';
  status.className = 'rfq-status-banner';
  status.style.display = 'none';

  const payload = {
    email: email,
    name: name,
    volume: volume,
    phone: phone,
    product: productDesc,
    captcha_answer: captcha_answer,
    captcha_token: captcha_token,
    source_page: window.location.href
  };

  fetch('/api/submit-rfq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(res => {
    btn.disabled = false;
    btn.innerHTML = '<span>⚡ Send Instant Factory RFQ</span>';
    if (res.success) {
      status.className = 'rfq-status-banner success';
      status.innerHTML = '<strong>✅ RFQ Received (' + res.rfq_id + ')</strong><br>Our engineering sales desk has been notified and will email you a tailored quote within 12 hours.';
      form.reset();
      refreshDrawerCaptcha();
  refreshContactCaptcha();
      // Track lead generation in GA4
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          'event_category': 'B2B Sourcing',
          'event_label': productDesc,
          'value': 1
        });
      }
    } else {
      status.className = 'rfq-status-banner error';
      status.textContent = res.error || 'Submission error. Please check your information.';
      refreshDrawerCaptcha();
  refreshContactCaptcha();
    }
  })
  .catch(err => {
    // Dual Insurance Fallback directly to FormSubmit (info@naikegroup.com)
    const fallbackData = new FormData();
    fallbackData.append('name', name || 'B2B Procurement Buyer');
    fallbackData.append('email', email);
    fallbackData.append('volume', volume || '1,000 pcs');
    fallbackData.append('phone', phone || 'Not provided');
    fallbackData.append('product', productDesc);
    fallbackData.append('source_page', window.location.href);
    fallbackData.append('_subject', '[Custom Bento Factory] Drawer RFQ Sourcing Inquiry (' + volume + ')');
    fallbackData.append('_captcha', 'false');
    fallbackData.append('_template', 'table');

    fetch('https://formsubmit.co/ajax/info@naikegroup.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: fallbackData
    }).then(() => {
      btn.disabled = false;
      btn.innerHTML = '<span>⚡ Send Instant Factory RFQ</span>';
      status.className = 'rfq-status-banner success';
      status.style.display = 'block';
      status.innerHTML = '<strong>✅ RFQ Transmitted to info@naikegroup.com</strong><br>Our engineering sales desk has received your requirements and will reply within 12 hours.';
      form.reset();
      refreshDrawerCaptcha();
    }).catch(() => {
      btn.disabled = false;
      btn.innerHTML = '<span>⚡ Send Instant Factory RFQ</span>';
      status.className = 'rfq-status-banner error';
      status.style.display = 'block';
      status.innerHTML = 'Network notice: Please contact us directly via WhatsApp <a href="https://wa.me/8613599220505" style="color:#15803d; font-weight:700;">+86 135 9922 0505</a> or email <a href="mailto:info@naikegroup.com" style="color:#008290; font-weight:700;">info@naikegroup.com</a>.';
      refreshDrawerCaptcha();
    });
  });
};

function initRfqAndWhatsApp() {
  refreshDrawerCaptcha();
  refreshContactCaptcha();

  // Track WhatsApp clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'contact', {
          'method': 'WhatsApp',
          'event_category': 'Direct Messaging'
        });
      }
    });
  });
}

// Contact Page RFQ & Captcha Controller
window.refreshContactCaptcha = function() {
  const qEl = document.getElementById('contactCaptchaQuestion');
  const tokInput = document.getElementById('contact_captcha_token');
  if (!qEl) return;
  qEl.textContent = '...';
  fetch('/api/captcha')
    .then(r => r.json())
    .then(data => {
      qEl.textContent = data.question;
      if (tokInput) tokInput.value = data.captcha_token;
    })
    .catch(() => {
      qEl.textContent = '4 + 5 = ?';
      if (tokInput) tokInput.value = '';
    });
};

window.handleContactRfqSubmit = function(e) {
  e.preventDefault();
  const form = document.getElementById('contactRfqForm');
  const btn = document.getElementById('contactSubmitBtn');
  const status = document.getElementById('contactRfqStatus');
  if (!form || !btn || !status) return;

  const name = document.getElementById('contact_name').value;
  const email = document.getElementById('contact_email').value;
  const company = document.getElementById('contact_company').value;
  const phone = document.getElementById('contact_phone').value;
  const product = document.getElementById('contact_product').value;
  const volume = document.getElementById('contact_volume').value;
  const message = document.getElementById('contact_message').value;
  const captcha_answer = document.getElementById('contact_captcha_ans').value;
  const captcha_token = document.getElementById('contact_captcha_token').value;

  btn.disabled = true;
  btn.innerHTML = '<span>⏳ Transmitting RFQ Dossier to Factory Desk...</span>';
  status.className = 'rfq-status-banner';
  status.style.display = 'none';

  const payload = {
    name: name,
    email: email,
    company: company,
    phone: phone,
    product: product,
    volume: volume,
    message: message,
    captcha_answer: captcha_answer,
    captcha_token: captcha_token,
    source_page: window.location.href
  };

  fetch('/api/submit-rfq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(res => {
    btn.disabled = false;
    btn.innerHTML = '<span>⚡ Submit Formal Sourcing RFQ &rarr;</span>';
    if (res.success) {
      status.className = 'rfq-status-banner success';
      status.innerHTML = '<strong>✅ RFQ Ingested Successfully (' + res.rfq_id + ')</strong><br>Our engineering sales desk has received your requirements and dispatched a notification. We will respond with pricing, tool specs, and catalog within 12 hours.<br><small style="margin-top:6px; display:inline-block;">Need instant reply? <a href="https://wa.me/8613599220505?text=Hello%2C%20I%20just%20submitted%20RFQ%20' + res.rfq_id + '" target="_blank" style="color:#15803d; font-weight:700;">Ping us on WhatsApp &rarr;</a></small>';
      form.reset();
      refreshContactCaptcha();
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          'event_category': 'Contact Page RFQ',
          'event_label': product,
          'value': 1
        });
      }
    } else {
      status.className = 'rfq-status-banner error';
      status.textContent = res.error || 'Submission error. Please check your information.';
      refreshContactCaptcha();
    }
  })
  .catch(err => {
    // Dual Insurance Fallback directly to FormSubmit (info@naikegroup.com)
    const fallbackData = new FormData();
    fallbackData.append('name', name);
    fallbackData.append('email', email);
    fallbackData.append('company', company);
    fallbackData.append('phone', phone || 'Not provided');
    fallbackData.append('product', product);
    fallbackData.append('volume', volume);
    fallbackData.append('message', message);
    fallbackData.append('source_page', window.location.href);
    fallbackData.append('_subject', '[Custom Bento Factory] Contact Page RFQ - ' + product);
    fallbackData.append('_captcha', 'false');
    fallbackData.append('_template', 'table');

    fetch('https://formsubmit.co/ajax/info@naikegroup.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: fallbackData
    }).then(() => {
      btn.disabled = false;
      btn.innerHTML = '<span>⚡ Submit Formal Sourcing RFQ &rarr;</span>';
      status.className = 'rfq-status-banner success';
      status.style.display = 'block';
      status.innerHTML = '<strong>✅ RFQ Transmitted to Factory Desk (info@naikegroup.com)</strong><br>Our engineering sales desk has received your requirements and will reply within 12 hours.<br><small style="margin-top:6px; display:inline-block;">Need instant reply? <a href="https://wa.me/8613599220505" target="_blank" style="color:#15803d; font-weight:700;">Ping us on WhatsApp &rarr;</a></small>';
      form.reset();
      refreshContactCaptcha();
    }).catch(() => {
      btn.disabled = false;
      btn.innerHTML = '<span>⚡ Submit Formal Sourcing RFQ &rarr;</span>';
      status.className = 'rfq-status-banner error';
      status.style.display = 'block';
      status.innerHTML = 'Network notice: Please WhatsApp us directly at <a href="https://wa.me/8613599220505" style="color:#15803d; font-weight:700;">+86 135 9922 0505</a> or email <a href="mailto:info@naikegroup.com" style="color:#008290; font-weight:700;">info@naikegroup.com</a>.';
      refreshContactCaptcha();
    });
  });
};

// 7. Footer Newsletter Subscription Controller
window.handleNewsletterSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input[name="email"]') || form.querySelector('.newsletter-input');
  const btn = form.querySelector('button[type="submit"]') || form.querySelector('.newsletter-btn');
  if (!input) return;
  const email = input.value.trim();
  if (!email || !email.includes('@')) return;

  const originalBtnText = btn ? btn.textContent : 'Subscribe';
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Subscribing...';
  }

  // Dual dispatch: FormSubmit to info@naikegroup.com + /api/submit-rfq
  const fd = new FormData();
  fd.append('email', email);
  fd.append('_subject', '[Custom Bento Factory] New Sourcing Catalog Newsletter Subscription');
  fd.append('_captcha', 'false');
  fd.append('_template', 'table');

  fetch('/api/submit-rfq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      name: 'Newsletter Subscriber',
      company: 'Wholesale Catalog Subscriber',
      product: '2026 Bento Sourcing Catalog Newsletter',
      volume: 'Subscription',
      message: 'Subscribed to 2026 Wholesale Sourcing Catalog updates',
      source_page: window.location.href
    })
  }).catch(() => {});

  fetch('https://formsubmit.co/ajax/info@naikegroup.com', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: fd
  }).then(() => {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Subscribed ✓';
    }
    alert('Thank you for subscribing! Our 2026 Sourcing Catalog and updates will be sent to ' + email + '.');
    form.reset();
  }).catch(() => {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalBtnText;
    }
    alert('Thank you for subscribing! Our 2026 Sourcing Catalog has been sent to your email.');
    form.reset();
  });
};

// 8. Executive Titanium Bento Corporate Gifting Form Controller
window.handleTitaniumQuoteSubmit = function(e) {
  e.preventDefault();
  const form = document.getElementById('titaniumQuoteForm') || e.target;
  const btn = document.getElementById('titaniumSubmitBtn');
  const status = document.getElementById('titaniumStatusBanner');

  const name = form.querySelector('[name="name"]')?.value || '';
  const company = form.querySelector('[name="company"]')?.value || '';
  const email = form.querySelector('[name="email"]')?.value || '';
  const quantity = form.querySelector('[name="quantity"]')?.value || '';
  const notes = form.querySelector('[name="notes"]')?.value || '';

  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Transmitting Corporate RFQ to Factory...';
  }
  if (status) {
    status.style.display = 'none';
  }

  // Local daemon logging
  fetch('/api/submit-rfq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      company: company,
      email: email,
      volume: quantity + ' Sets',
      product: 'Executive TA1 Pure Titanium Bento Suite',
      message: notes,
      source_page: window.location.href
    })
  }).catch(() => {});

  const fd = new FormData(form);
  if (!fd.has('_subject')) fd.append('_subject', '[Custom Bento Factory] Executive Pure Titanium Bento Gifting RFQ');
  if (!fd.has('_captcha')) fd.append('_captcha', 'false');
  if (!fd.has('_template')) fd.append('_template', 'table');

  fetch('https://formsubmit.co/ajax/info@naikegroup.com', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: fd
  }).then(() => {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Submit Corporate Inquiry (Direct Factory Response)';
    }
    if (status) {
      status.className = 'rfq-status-banner success';
      status.style.display = 'block';
      status.innerHTML = '<strong>✅ Corporate RFQ Received</strong><br>Our executive accounts team at <strong>info@naikegroup.com</strong> has received your project details and will send a formal quote within 6 hours.';
    }
    form.reset();
  }).catch(() => {
    form.submit();
  });
};

// 9. Article Sidebar Quick Inquiry Controller
window.handleSidebarInquirySubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('#sidebarInquiryBtn') || form.querySelector('button[type="submit"]');
  const status = form.querySelector('#sidebarInquiryStatus') || form.querySelector('.rfq-status-banner');

  const name = form.querySelector('[name="name"]')?.value || '';
  const company = form.querySelector('[name="company"]')?.value || '';
  const email = form.querySelector('[name="email"]')?.value || '';
  const message = form.querySelector('[name="message"]')?.value || '';

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending...';
  }
  if (status) {
    status.style.display = 'none';
  }

  // Local daemon logging
  fetch('/api/submit-rfq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      company: company,
      email: email,
      product: 'Article Quick Inquiry: ' + document.title,
      volume: '1,000 pcs (Standard)',
      message: message,
      source_page: window.location.href
    })
  }).catch(() => {});

  const fd = new FormData(form);
  if (!fd.has('_subject')) fd.append('_subject', '[Custom Bento Factory] Article Sidebar Quick Inquiry');
  if (!fd.has('_captcha')) fd.append('_captcha', 'false');
  if (!fd.has('_template')) fd.append('_template', 'table');

  fetch('https://formsubmit.co/ajax/info@naikegroup.com', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: fd
  }).then(() => {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Send Quick Inquiry';
    }
    if (status) {
      status.className = 'rfq-status-banner success';
      status.style.display = 'block';
      status.innerHTML = '<strong>✅ Inquiry Received</strong><br>Transmitted to <strong>info@naikegroup.com</strong>. We will reply within 12 hours.';
    }
    form.reset();
  }).catch(() => {
    form.submit();
  });
};

