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

  /* Sticky header shadow on scroll */
  var header = document.querySelector(".site-header");
  if (header) {
    var lastScroll = 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY || window.pageYOffset;
      if (y > 8) {
        header.style.boxShadow = "0 6px 20px rgba(0,0,0,0.35)";
      } else {
        header.style.boxShadow = "none";
      }
      lastScroll = y;
    }, { passive: true });
  }
})();
