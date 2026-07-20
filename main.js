/* Clark's Electronic Solutions — shared behavior
   Mobile nav toggle, desktop dropdown nav, mobile submenu accordion, FAQ accordion. */
(function () {
  "use strict";

  /* Mobile nav toggle */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("is-open", !isOpen);
    });
  }

  /* Mobile submenu accordions (Services / Service Areas within mobile nav) */
  var mnavLinks = document.querySelectorAll("[data-mnav-toggle]");
  mnavLinks.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("aria-controls");
      var submenu = document.getElementById(targetId);
      if (!submenu) return;
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isOpen));
      submenu.classList.toggle("is-open", !isOpen);
    });
  });

  /* Desktop dropdown nav (click to open, click outside to close) */
  var dropdownTriggers = document.querySelectorAll("[data-dropdown-toggle]");
  function closeAllDropdowns(except) {
    dropdownTriggers.forEach(function (trigger) {
      if (trigger === except) return;
      trigger.setAttribute("aria-expanded", "false");
      var id = trigger.getAttribute("aria-controls");
      var menu = document.getElementById(id);
      if (menu) menu.classList.remove("is-open");
    });
  }
  dropdownTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var id = trigger.getAttribute("aria-controls");
      var menu = document.getElementById(id);
      var isOpen = trigger.getAttribute("aria-expanded") === "true";
      closeAllDropdowns(trigger);
      trigger.setAttribute("aria-expanded", String(!isOpen));
      if (menu) menu.classList.toggle("is-open", !isOpen);
    });
  });
  document.addEventListener("click", function () {
    closeAllDropdowns(null);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllDropdowns(null);
  });

  /* Desktop dropdown nav also opens on hover, so users don't have to click.
     These triggers are hidden on mobile (.primary-nav is display:none below
     1000px), so the listeners are harmless there. */
  dropdownTriggers.forEach(function (trigger) {
    var li = trigger.closest("li");
    var id = trigger.getAttribute("aria-controls");
    var menu = document.getElementById(id);
    if (!li || !menu) return;
    var closeTimer;
    li.addEventListener("mouseenter", function () {
      clearTimeout(closeTimer);
      closeAllDropdowns(trigger);
      trigger.setAttribute("aria-expanded", "true");
      menu.classList.add("is-open");
    });
    li.addEventListener("mouseleave", function () {
      closeTimer = setTimeout(function () {
        trigger.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      }, 150);
    });
  });

  /* FAQ accordion */
  var faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(function (q) {
    q.addEventListener("click", function () {
      var answerId = q.getAttribute("aria-controls");
      var answer = document.getElementById(answerId);
      var isOpen = q.getAttribute("aria-expanded") === "true";

      q.setAttribute("aria-expanded", String(!isOpen));
      if (answer) {
        answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
      }
    });
  });

  /* Header scroll state (shadow on inner pages, opaque background over the
     floating transparent header on the home hero) */
  var header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle("is-scrolled", y > 8);
    }, { passive: true });
  }

  /* Reviews carousel: prev/next arrows plus a slow auto-advance, both using
     a discrete "jump to card index" scrollTo rather than a continuous
     per-frame scrollLeft change (which reliably failed to repaint newly
     exposed cards in Safari). Index wraps with modulo, so "next" from the
     last card and "prev" from the first both loop with no empty gap. */
  var reviewsMarquee = document.querySelector(".reviews-marquee");
  var reviewsTrack = reviewsMarquee ? reviewsMarquee.querySelector(".reviews-track") : null;
  var reviewsCards = reviewsTrack ? reviewsTrack.querySelectorAll(".review-card") : [];
  if (reviewsMarquee && reviewsTrack && reviewsCards.length > 0) {
    var reviewsIndex = 0;
    var reviewsCount = reviewsCards.length;

    function goToReview(index) {
      reviewsIndex = ((index % reviewsCount) + reviewsCount) % reviewsCount;
      reviewsMarquee.scrollTo({ left: reviewsCards[reviewsIndex].offsetLeft, behavior: "smooth" });
    }

    var prevBtn = document.querySelector(".reviews-nav-prev");
    var nextBtn = document.querySelector(".reviews-nav-next");
    if (prevBtn) prevBtn.addEventListener("click", function () { goToReview(reviewsIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goToReview(reviewsIndex + 1); });

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var reviewsTimer = setInterval(function () { goToReview(reviewsIndex + 1); }, 5000);
      reviewsMarquee.addEventListener("mouseenter", function () { clearInterval(reviewsTimer); });
      reviewsMarquee.addEventListener("mouseleave", function () {
        reviewsTimer = setInterval(function () { goToReview(reviewsIndex + 1); }, 5000);
      });
    }
  }

  /* Hero emblem placement (desktop only): position the image's left edge
     at exactly (copy's right edge + GAP), measured from the real rendered
     layout rather than assumed via CSS calc() — text can wrap narrower
     than its max-width, and viewport scrollbars shift things a few
     pixels, so a hand-tuned calc() can't reliably land on an exact match.
     This keeps the gap to the copy on the left equal to the padding on
     the right at any viewport width or font-load state. */
  var heroContent = document.querySelector(".hero-content");
  var heroEmblemWrap = document.querySelector(".hero-emblem-wrap");
  if (heroContent && heroEmblemWrap) {
    /* The wrapper's own CSS padding-left (56px) already creates the gap
       to the image — the wrapper's *left edge* (not the image) should
       land exactly on the copy's right edge, so don't add the gap twice. */
    function positionHeroEmblem() {
      if (window.innerWidth < 1000) {
        heroEmblemWrap.style.left = "";
        return;
      }
      var contentRight = heroContent.getBoundingClientRect().right;
      heroEmblemWrap.style.left = Math.round(contentRight) + "px";
    }
    positionHeroEmblem();
    window.addEventListener("resize", positionHeroEmblem);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(positionHeroEmblem);
    }
  }
})();
