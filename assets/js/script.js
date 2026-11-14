// assets/js/script.js
// Riff's Department Store - Site-wide JavaScript

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==================================================================
     1. MOBILE MENU
  ================================================================== */
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");

  function setMobileMenu(open) {
    if (!menuBtn || !mobileMenu) return;

    mobileMenu.classList.toggle("hidden", !open);
    iconOpen?.classList.toggle("hidden", open);
    iconClose?.classList.toggle("hidden", !open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      setMobileMenu(mobileMenu.classList.contains("hidden"));
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => setMobileMenu(false));
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
        setMobileMenu(false);
        menuBtn.focus();
      }
    });

    document.addEventListener("click", event => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (mobileMenu.classList.contains("hidden")) return;
      if (mobileMenu.contains(target) || menuBtn.contains(target)) return;
      setMobileMenu(false);
    });

    window.addEventListener("resize", () => {
      if (window.getComputedStyle(menuBtn).display === "none") setMobileMenu(false);
    }, { passive: true });
  }

  /* ==================================================================
     2. SMOOTH SCROLLING
  ================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.getElementById(targetId.slice(1));
      if (!target) return;

      event.preventDefault();
      const headerHeight = document.querySelector("header")?.offsetHeight || 80;
      const scrollY = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: scrollY,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });

      if (history.pushState) history.pushState(null, "", targetId);
    });
  });

  /* ==================================================================
     3. FADE-IN ON SCROLL
  ================================================================== */
  const fadeElements = document.querySelectorAll(".fade-in");
  if (fadeElements.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add("visible"));
  }

  /* ==================================================================
     4. HEADER SHADOW ON SCROLL
  ================================================================== */
  const header = document.querySelector("header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ==================================================================
     5. LOCATIONS LIST TOGGLE
  ================================================================== */
  const toggleBtn = document.getElementById("locations-toggle");
  const locationsList = document.getElementById("locations-list");
  const toggleIcon = document.getElementById("toggle-icon");

  function setLocationsList(open) {
    if (!toggleBtn || !locationsList || !toggleIcon) return;

    if (!open && locationsList.contains(document.activeElement)) toggleBtn.focus();
    locationsList.inert = !open;
    locationsList.classList.toggle("open", open);
    locationsList.style.maxHeight = open ? `${locationsList.scrollHeight + 40}px` : "0px";
    toggleIcon.style.transform = open ? "rotate(180deg)" : "rotate(0deg)";
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (toggleBtn && locationsList && toggleIcon) {
    const initializeLocationsList = () => {
      if (locationsList.dataset.initialized === "true" || locationsList.children.length === 0) return;

      locationsList.dataset.initialized = "true";
      setLocationsList(false);

      toggleBtn.addEventListener("click", () => {
        setLocationsList(!locationsList.classList.contains("open"));
      });
    };

    document.addEventListener("riffs:locations-populated", initializeLocationsList);

    const waitForGrid = setInterval(() => {
      initializeLocationsList();
      if (locationsList.dataset.initialized === "true") clearInterval(waitForGrid);
    }, 100);

    setTimeout(() => clearInterval(waitForGrid), 5000);

    window.addEventListener("resize", () => {
      if (locationsList.classList.contains("open")) {
        locationsList.style.maxHeight = `${locationsList.scrollHeight + 40}px`;
      }
    }, { passive: true });
  }

  /* ==================================================================
     6. DEPARTMENT CARDS
  ================================================================== */
  const departmentCards = document.querySelectorAll(".department-card");
  if (departmentCards.length) {
    const syncDepartmentCards = () => {
      const desktop = window.innerWidth >= 1024;
      departmentCards.forEach(card => {
        if (desktop) {
          card.setAttribute("open", "");
        } else {
          card.removeAttribute("open");
        }
      });
    };

    syncDepartmentCards();

    departmentCards.forEach(card => {
      card.querySelector("summary")?.addEventListener("click", event => {
        if (window.innerWidth >= 1024) event.preventDefault();
      });

      card.addEventListener("toggle", () => {
        if (window.innerWidth >= 1024) {
          if (!card.open) requestAnimationFrame(() => card.setAttribute("open", ""));
          return;
        }

        if (!card.open) return;
        departmentCards.forEach(otherCard => {
          if (otherCard !== card) otherCard.removeAttribute("open");
        });
      });
    });

    window.addEventListener("resize", syncDepartmentCards, { passive: true });
  }

  /* ==================================================================
     7. FAQ CARDS
  ================================================================== */
  const faqCards = document.querySelectorAll(".faq-list details");
  if (faqCards.length) {
    const syncFaqCards = () => {
      const desktop = window.innerWidth >= 1024;
      faqCards.forEach(card => {
        if (desktop) {
          card.setAttribute("open", "");
        } else {
          card.removeAttribute("open");
        }
      });
    };

    syncFaqCards();

    faqCards.forEach(card => {
      card.querySelector("summary")?.addEventListener("click", event => {
        if (window.innerWidth >= 1024) event.preventDefault();
      });

      card.addEventListener("toggle", () => {
        if (window.innerWidth >= 1024) {
          if (!card.open) requestAnimationFrame(() => card.setAttribute("open", ""));
          return;
        }

        if (!card.open) return;
        faqCards.forEach(otherCard => {
          if (otherCard !== card) otherCard.removeAttribute("open");
        });
      });
    });

    window.addEventListener("resize", syncFaqCards, { passive: true });
  }

  /* ==================================================================
     8. CONTACT PREVIEW
  ================================================================== */
  const contactDialog = document.getElementById("contact-dialog");
  const contactPanel = contactDialog?.querySelector(".site-dialog-panel");
  let contactReturnFocus = null;

  function openContactDialog(trigger) {
    if (!contactDialog) return;
    contactReturnFocus = trigger;
    contactDialog.hidden = false;
    document.body.classList.add("dialog-open");
    requestAnimationFrame(() => contactPanel?.focus());
  }

  function closeContactDialog() {
    if (!contactDialog || contactDialog.hidden) return;
    contactDialog.hidden = true;
    document.body.classList.remove("dialog-open");
    contactReturnFocus?.focus();
  }

  document.querySelectorAll("[data-contact-open]").forEach(trigger => {
    trigger.addEventListener("click", () => openContactDialog(trigger));
  });

  contactDialog?.querySelectorAll("[data-dialog-close]").forEach(trigger => {
    trigger.addEventListener("click", closeContactDialog);
  });

  /* ==================================================================
     9. NEWSLETTER SIGNUP
  ================================================================== */
  const newsletterBtn = document.getElementById("newsletter-signup");
  const newsletterStatus = document.getElementById("newsletter-status");
  const newsletterFallback = document.getElementById("newsletter-fallback");
  const newsletterDialog = document.getElementById("newsletter-dialog");
  const newsletterPanel = newsletterDialog?.querySelector(".site-dialog-panel");
  const newsletterDialogStatus = document.getElementById("newsletter-dialog-status");
  const newsletterDialogFallback = newsletterDialog?.querySelector(".newsletter-dialog-fallback");
  const newsletterLoader = newsletterDialog?.querySelector(".newsletter-loader");

  function setNewsletterDialog(open) {
    if (!newsletterDialog) return;
    newsletterDialog.hidden = !open;
    document.body.classList.toggle("dialog-open", open);
    if (open) requestAnimationFrame(() => newsletterPanel?.focus());
  }

  function setNewsletterDialogMessage(message, showFallback = false) {
    if (newsletterDialogStatus) newsletterDialogStatus.textContent = message;
    if (newsletterDialogFallback) newsletterDialogFallback.hidden = !showFallback;
    if (newsletterLoader) newsletterLoader.hidden = showFallback;
  }

  function findVisibleMailchimpForm() {
    const candidates = document.querySelectorAll(
      "#PopupSignupForm_0, .mc-modal, .mc-banner, iframe[src*='mailchimp'], iframe[src*='form-assets']"
    );
    return Array.from(candidates).find(element => {
      const style = window.getComputedStyle(element);
      return !element.hidden && style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0;
    });
  }

  function waitForMailchimpForm(timeout = 7000) {
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (findVisibleMailchimpForm()) {
        window.clearInterval(timer);
        setNewsletterDialog(false);
        if (newsletterStatus) newsletterStatus.textContent = "";
        return;
      }

      if (Date.now() - started >= timeout) {
        window.clearInterval(timer);
        if (newsletterBtn) newsletterBtn.disabled = false;
        const label = newsletterBtn?.querySelector("span");
        if (label) label.textContent = "Sign Up for Deals";

        if (document.querySelector("script[data-mailchimp-loader][data-loaded='true']")) {
          setNewsletterDialog(false);
          if (newsletterStatus) newsletterStatus.textContent = "";
          return;
        }

        if (newsletterStatus) newsletterStatus.textContent = "Signup form could not load.";
        if (newsletterFallback) newsletterFallback.hidden = false;
        setNewsletterDialogMessage("The signup form could not load. You can email Riff's to sign up instead.", true);
      }
    }, 150);
  }

  newsletterDialog?.querySelectorAll("[data-newsletter-close]").forEach(trigger => {
    trigger.addEventListener("click", () => {
      setNewsletterDialog(false);
      newsletterBtn?.focus();
    });
  });

  if (newsletterBtn) {
    const mailchimpSrc = newsletterBtn.dataset.mailchimpSrc;
    const defaultLabel = newsletterBtn.querySelector("span")?.textContent || newsletterBtn.textContent.trim();

    const setNewsletterStatus = message => {
      if (newsletterStatus) newsletterStatus.textContent = message;
    };

    const setNewsletterLoading = loading => {
      newsletterBtn.disabled = loading;
      const label = newsletterBtn.querySelector("span");
      if (label) label.textContent = loading ? "Opening Signup" : defaultLabel;
    };

    const showNewsletterFallback = () => {
      if (newsletterFallback) newsletterFallback.hidden = false;
    };

    newsletterBtn.addEventListener("click", () => {
      setNewsletterDialog(true);
      setNewsletterDialogMessage("Connecting securely to Mailchimp…");

      if (!mailchimpSrc) {
        showNewsletterFallback();
        setNewsletterDialogMessage("Mailchimp is not configured right now. You can email Riff's to sign up.", true);
        return;
      }

      const existingScript = document.querySelector("script[data-mailchimp-loader]");
      if (existingScript) {
        if (findVisibleMailchimpForm()) {
          setNewsletterDialog(false);
          return;
        }

        setNewsletterStatus(existingScript.dataset.loaded === "true" ? "Mailchimp is already loaded." : "Signup form is loading.");
        if (existingScript.dataset.loaded === "true") {
          setNewsletterDialog(false);
          setNewsletterStatus("");
        } else {
          waitForMailchimpForm();
        }
        return;
      }

      setNewsletterLoading(true);
      setNewsletterStatus("Signup form is opening.");
      newsletterFallback?.setAttribute("hidden", "");

      const script = document.createElement("script");
      script.src = mailchimpSrc;
      script.async = true;
      script.dataset.mailchimpLoader = "true";

      script.addEventListener("load", () => {
        script.dataset.loaded = "true";
        setNewsletterLoading(false);
        setNewsletterDialog(false);
        setNewsletterStatus("");
      });

      script.addEventListener("error", () => {
        setNewsletterLoading(false);
        setNewsletterStatus("Signup form could not load.");
        showNewsletterFallback();
        setNewsletterDialogMessage("Mailchimp could not load. You can email Riff's to sign up instead.", true);
      });

      document.body.appendChild(script);
      waitForMailchimpForm();
    });
  }

  /* ==================================================================
     10. SALE POPUP
     Auto-detects assets/img/promotions/sale-banner.{avif,webp,png,jpg,...}.
     The default banner is the fallback when no live image is present.
     A sale-banner file replaces it; nav buttons always open the popup.
     It auto-opens once on every page load and stays closed after dismissal
     until the next load.
  ================================================================== */
  const salePopup = document.getElementById("sale-popup");
  const salePopupPanel = salePopup?.querySelector(".sale-popup-panel");
  const salePopupImg = document.getElementById("sale-popup-img");
  const saleTriggers = document.querySelectorAll("[data-sale-trigger]");
  let saleReturnFocus = null;
  let salePopupOpenedAt = 0;
  let salePopupSource = "automatic_popup";
  let saleAutoOpenTimer = null;

  function trackSaleEvent(eventName, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, {
      event_category: "sale_promotion",
      promotion_name: "current_sale",
      promotion_creative: "sale-banner",
      ...params
    });
  }

  function openSalePopup(trigger, source = "automatic_popup") {
    if (!salePopup || !salePopup.hidden) return;
    if (trigger) {
      if (saleAutoOpenTimer !== null) {
        window.clearTimeout(saleAutoOpenTimer);
        saleAutoOpenTimer = null;
      }
    }
    saleReturnFocus = trigger || null;
    salePopupSource = source;
    salePopup.hidden = false;
    document.body.classList.add("dialog-open");
    salePopupOpenedAt = Date.now();
    trackSaleEvent("view_promotion", {
      creative_slot: source
    });
    requestAnimationFrame(() => salePopupPanel?.focus());
  }

  function closeSalePopup(method = "close_button") {
    if (!salePopup || salePopup.hidden) return;
    trackSaleEvent("close_promotion", {
      creative_slot: salePopupSource,
      close_method: method,
      engagement_time_msec: salePopupOpenedAt ? Date.now() - salePopupOpenedAt : 0
    });
    salePopup.hidden = true;
    document.body.classList.remove("dialog-open");
    const openerIsVisible = saleReturnFocus && !saleReturnFocus.hidden && saleReturnFocus.getClientRects().length > 0;
    const visibleSaleTrigger = Array.from(saleTriggers).find(trigger => !trigger.hidden && trigger.getClientRects().length > 0);
    (openerIsVisible ? saleReturnFocus : (visibleSaleTrigger || menuBtn))?.focus();
  }

  salePopup?.querySelectorAll("[data-sale-popup-close]").forEach(trigger => {
    trigger.addEventListener("click", () => closeSalePopup(trigger.classList.contains("site-dialog-backdrop") ? "backdrop" : "close_button"));
  });

  salePopup?.querySelector("[data-sale-location-link]")?.addEventListener("click", () => {
    trackSaleEvent("select_promotion", { creative_slot: "find_local_store" });
    closeSalePopup("find_local_store");
  });
  salePopup?.querySelector("[data-sale-facebook-link]")?.addEventListener("click", () => {
    trackSaleEvent("select_promotion", { creative_slot: "facebook" });
  });

  if (salePopup && salePopupImg && saleTriggers.length) {
    // Prefer highly compressed modern formats, then broadly supported raster
    // formats. The first valid image wins when an owner uploads several.
    const exts = ["avif", "webp", "png", "jpg", "jpeg", "svg", "gif"];
    const saleAlt = "Current sale at Riff's Department Store. Visit your local store for details.";
    // A unique cache key makes each newly uploaded sale image visible promptly.
    const saleCacheKey = Date.now();

    saleTriggers.forEach(trigger => {
      trigger.addEventListener("click", () => {
        const fromMobileMenu = mobileMenu?.contains(trigger) || false;
        if (fromMobileMenu) setMobileMenu(false);
        openSalePopup(fromMobileMenu ? menuBtn : trigger, fromMobileMenu ? "mobile_menu_sale_button" : "header_sale_button");
      });
    });

    // Show on each page load/reload. Closing only affects this page load;
    // the header Sale buttons remain available for an explicit reopen.
    saleAutoOpenTimer = window.setTimeout(() => {
      saleAutoOpenTimer = null;
      openSalePopup(null);
    }, 900);

    (function probe(i) {
      if (i >= exts.length) return;
      const candidate = "/assets/img/promotions/sale-banner." + exts[i] + "?v=" + saleCacheKey;
      const test = new Image();
      test.onload = () => {
        salePopupImg.src = candidate;
        salePopupImg.alt = saleAlt;
      };
      test.onerror = () => probe(i + 1);
      test.src = candidate;
    })(0);
  }

  /* ==================================================================
     10b. BLACK FRIDAY HERO
     Visibility is decided before paint by the inline script in index.html
     (it adds .bf-live to <html>). This highlights today's deal, writes the
     status line, and runs the full-flyer viewer.
  ================================================================== */
  const bfHero = document.getElementById("black-friday");
  const bfDialog = document.getElementById("bf-flyer-dialog");
  const bfDialogPanel = bfDialog?.querySelector(".site-dialog-panel");
  const bfDialogImg = bfDialog?.querySelector("img[data-src]");
  let bfReturnFocus = null;

  function trackBlackFriday(eventName, slot) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, {
      event_category: "sale_promotion",
      promotion_name: "black_friday_2026",
      promotion_creative: "black-friday",
      creative_slot: slot
    });
  }

  function openBfFlyer(trigger) {
    if (!bfDialog || !bfDialog.hidden) return;
    if (saleAutoOpenTimer !== null) {
      window.clearTimeout(saleAutoOpenTimer);
      saleAutoOpenTimer = null;
    }
    if (bfDialogImg && !bfDialogImg.getAttribute("src")) {
      bfDialogImg.src = bfDialogImg.dataset.src;
    }
    bfReturnFocus = trigger || null;
    bfDialog.hidden = false;
    document.body.classList.add("dialog-open");
    trackBlackFriday("select_promotion", "hero_view_flyer");
    requestAnimationFrame(() => bfDialogPanel?.focus());
  }

  function closeBfFlyer(restoreFocus = true) {
    if (!bfDialog || bfDialog.hidden) return;
    bfDialog.hidden = true;
    document.body.classList.remove("dialog-open");
    if (restoreFocus) bfReturnFocus?.focus();
  }

  if (bfHero && document.documentElement.classList.contains("bf-live")) {
    const pad = n => String(n).padStart(2, "0");
    const isoDay = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const toLocalDate = iso => {
      const [y, m, d] = iso.split("-").map(Number);
      return new Date(y, m - 1, d);
    };
    const longDate = iso => toLocalDate(iso).toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });

    // QA hook: ?bf-now=2026-11-18T14:30 simulates a time (with ?bf=preview).
    const simulated = new URLSearchParams(window.location.search).get("bf-now");
    const simulatedMs = simulated ? Date.parse(simulated) : NaN;
    const clockOffset = Number.isNaN(simulatedMs) ? 0 : simulatedMs - Date.now();
    const getNow = () => new Date(Date.now() + clockOffset);

    const start = bfHero.dataset.bfStart || "";
    const end = bfHero.dataset.bfEnd || "";
    const dayCards = Array.from(bfHero.querySelectorAll(".bf-day[data-date]"));
    const statusEl = bfHero.querySelector("[data-bf-status]");
    const daysList = bfHero.querySelector("[data-bf-days]");
    const countdown = bfHero.querySelector("[data-bf-countdown]");
    const countdownLabel = bfHero.querySelector("[data-bf-countdown-label]");
    const unitEls = {};
    bfHero.querySelectorAll("[data-unit]").forEach(el => { unitEls[el.dataset.unit] = el; });
    const daysUnit = bfHero.querySelector("[data-unit-wrap='d']");

    let renderedDay = "";
    let countdownTarget = null;
    let countdownTimer = null;

    const setStatus = (lead, rest) => {
      if (!statusEl) return;
      statusEl.textContent = "";
      const strong = document.createElement("strong");
      strong.textContent = lead;
      statusEl.append(strong, " " + rest);
    };

    const dealsFor = card => Array.from(card.querySelectorAll("li")).map(item => {
      const clone = item.cloneNode(true);
      clone.querySelectorAll("small, .sr-only").forEach(el => el.remove());
      return clone.textContent.replace(/\s+/g, " ").trim();
    });

    function updateCountdown() {
      if (!countdown || !countdownTarget) return;
      const remaining = Math.max(0, countdownTarget - getNow());
      const totalSeconds = Math.floor(remaining / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      const showDays = days > 0;

      if (daysUnit) daysUnit.hidden = !showDays;
      if (unitEls.d) unitEls.d.textContent = pad(days);
      if (unitEls.h) unitEls.h.textContent = pad(hours);
      if (unitEls.m) unitEls.m.textContent = pad(mins);
      if (unitEls.s) unitEls.s.textContent = pad(secs);
    }

    // Rebuilds the day-dependent state. Runs on load and again whenever the
    // local date rolls over, so a page left open at midnight stays correct.
    function renderDay(today) {
      renderedDay = today;
      let todayCard = null;

      dayCards.forEach(card => {
        const date = card.dataset.date;
        const name = card.querySelector(".bf-day-name");
        card.classList.remove("is-today", "is-past");
        card.removeAttribute("aria-current");
        name?.querySelector(".bf-day-note")?.remove();

        let noteText = "";
        if (date === today) {
          todayCard = card;
          card.classList.add("is-today");
          card.setAttribute("aria-current", "date");
          noteText = " (today)";
        } else if (date < today) {
          card.classList.add("is-past");
          noteText = " (ended)";
        }
        if (noteText && name) {
          const note = document.createElement("span");
          note.className = "sr-only bf-day-note";
          note.textContent = noteText;
          name.appendChild(note);
        }
      });

      if (!start || !end) return;

      if (today < start) {
        countdownTarget = toLocalDate(start);
        if (countdownLabel) countdownLabel.textContent = "Sale starts in";
        const daysAway = Math.round((toLocalDate(start) - toLocalDate(today)) / 86400000);
        setStatus(daysAway === 1 ? "Starts tomorrow:" : "Starts", `${longDate(start)}. A new 50% off deal every day through ${longDate(end)}.`);
      } else if (today > end) {
        countdownTarget = null;
        setStatus("Sale ended.", "Thanks for shopping Black Friday at Riff's.");
      } else {
        const tomorrow = toLocalDate(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        countdownTarget = tomorrow;
        const lastDay = today === end;
        if (countdownLabel) countdownLabel.textContent = lastDay ? "Last day! Sale ends in" : "Today's deals end in";
        if (todayCard) {
          const dayNumber = dayCards.indexOf(todayCard) + 1;
          const lead = lastDay ? "Final day, today only:" : `Day ${dayNumber} of ${dayCards.length}, today only:`;
          setStatus(lead, `50% off ${dealsFor(todayCard).join(" and ")}.`);
        }
      }

      if (countdown) countdown.hidden = !countdownTarget;
      updateCountdown();

      // Bring today's card into view inside the swipeable row (no page scroll).
      if (todayCard && daysList && daysList.scrollWidth > daysList.clientWidth) {
        const listRect = daysList.getBoundingClientRect();
        const cardRect = todayCard.getBoundingClientRect();
        const inset = parseFloat(window.getComputedStyle(daysList).paddingLeft) || 0;
        daysList.scrollLeft += cardRect.left - listRect.left - inset;
      }
    }

    function tick() {
      const today = isoDay(getNow());
      if (today !== renderedDay) {
        renderDay(today);
      } else {
        updateCountdown();
      }
      if (!countdownTarget && countdownTimer !== null) {
        window.clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }

    renderDay(isoDay(getNow()));
    if (countdownTarget) countdownTimer = window.setInterval(tick, 1000);

    // Timers are throttled in background tabs; resync as soon as it is visible.
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) tick();
    });

    trackBlackFriday("view_promotion", "homepage_hero");

    bfHero.querySelectorAll("[data-bf-flyer-open]").forEach(trigger => {
      trigger.addEventListener("click", () => openBfFlyer(trigger));
    });
    bfHero.querySelector("[data-bf-store-link]")?.addEventListener("click", () => {
      trackBlackFriday("select_promotion", "hero_find_store");
    });

    // Community chips: scroll to the locator (handled by smooth scrolling)
    // and pick that store in the dropdown so its details and map pin show.
    bfHero.querySelectorAll("[data-bf-store]").forEach(link => {
      link.addEventListener("click", () => {
        const storeSelect = document.getElementById("store-select");
        const option = storeSelect && Array.from(storeSelect.options).find(opt => opt.textContent === link.dataset.bfStore);
        if (option) {
          storeSelect.value = option.value;
          storeSelect.dispatchEvent(new Event("change"));
        }
        trackBlackFriday("select_promotion", "hero_town_" + link.dataset.bfStore.replace(/^Riff's /, "").toLowerCase().replace(/[^a-z]+/g, "_"));
      });
    });
  }

  bfDialog?.querySelectorAll("[data-bf-flyer-close]").forEach(trigger => {
    trigger.addEventListener("click", () => closeBfFlyer());
  });
  bfDialog?.querySelector("[data-bf-flyer-store]")?.addEventListener("click", () => {
    trackBlackFriday("select_promotion", "flyer_find_store");
    closeBfFlyer(false);
  });

  document.addEventListener("keydown", event => {
    const activeDialog = newsletterDialog && !newsletterDialog.hidden
      ? newsletterDialog
      : (bfDialog && !bfDialog.hidden
        ? bfDialog
        : (salePopup && !salePopup.hidden
          ? salePopup
          : (contactDialog && !contactDialog.hidden ? contactDialog : null)));

    if (event.key === "Tab" && activeDialog) {
      const focusable = Array.from(activeDialog.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
      )).filter(element => !element.hidden && element.getClientRects().length > 0);

      if (focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!focusable.includes(document.activeElement)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      return;
    }

    if (event.key !== "Escape") return;
    if (newsletterDialog && !newsletterDialog.hidden) {
      setNewsletterDialog(false);
      newsletterBtn?.focus();
      return;
    }
    if (bfDialog && !bfDialog.hidden) {
      closeBfFlyer();
      return;
    }
    if (salePopup && !salePopup.hidden) {
      closeSalePopup("escape");
      return;
    }
    closeContactDialog();
  });

  /* ==================================================================
     11. SERVICE WORKER
  ================================================================== */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {});
    });
  }
});
