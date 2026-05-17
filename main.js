(function () {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    const navLabel = navToggle.querySelector(".sr-only");
    const firstNavLink = nav.querySelector("a");

    function setNavState(isOpen, moveFocus) {
      nav.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Navigation schließen" : "Navigation öffnen");
      if (navLabel) navLabel.textContent = isOpen ? "Navigation schließen" : "Navigation öffnen";
      if (isOpen && moveFocus && firstNavLink) firstNavLink.focus();
    }

    navToggle.setAttribute("aria-label", "Navigation öffnen");

    navToggle.addEventListener("click", () => {
      const isOpen = !nav.classList.contains("is-open");
      setNavState(isOpen, true);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setNavState(false, false);
        navToggle.focus();
      }
    });
  }

  const cart = [];
  const cartList = document.querySelector("[data-cart-list]");
  const cartTotal = document.querySelector("[data-cart-total]");
  const cartStatus = document.querySelector("[data-cart-status]");

  function renderCart() {
    if (!cartList || !cartTotal) return;

    cartList.innerHTML = "";
    if (cart.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "Noch kein Paket ausgewählt.";
      cartList.append(empty);
      cartTotal.textContent = "Kein Paket";
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cart.forEach((item) => {
      const li = document.createElement("li");
      const name = document.createElement("span");
      const price = document.createElement("strong");
      name.textContent = item.name;
      price.textContent = `EUR ${item.price} / Monat`;
      li.append(name, price);
      cartList.append(li);
    });
    cartTotal.textContent = `EUR ${total} / Monat`;
  }

  document.querySelectorAll("[data-add-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      cart.length = 0;
      cart.push({
        name: button.dataset.plan || "Paket",
        price: Number(button.dataset.price || 0),
      });
      renderCart();
      if (cartStatus) {
        cartStatus.textContent = `${button.dataset.plan} ist für die Anfrage vorgemerkt.`;
      }
    });
  });
  renderCart();

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = contactForm.querySelector("[data-form-status]");
      const requiredFields = contactForm.querySelectorAll("[required]");
      let isValid = true;
      let firstInvalid = null;

      requiredFields.forEach((field) => {
        const error = contactForm.querySelector(`[data-error-for="${field.id}"]`);
        const isEmpty = !field.value.trim();
        const hasFormatError = !isEmpty && field.type === "email" && !field.checkValidity();

        if (isEmpty || hasFormatError) {
          isValid = false;
          if (!firstInvalid) firstInvalid = field;
          field.setAttribute("aria-invalid", "true");
          if (error) {
            error.textContent = hasFormatError
              ? "Bitte eine gültige E-Mail-Adresse eingeben."
              : "Dieses Pflichtfeld muss ausgefüllt werden.";
          }
        } else {
          field.removeAttribute("aria-invalid");
          if (error) error.textContent = "";
        }
      });

      if (status) {
        status.textContent = isValid
          ? "Nachricht im Mock-Formular erfasst. Es wurden keine Daten versendet."
          : "Bitte alle Pflichtfelder ausfüllen.";
      }

      if (!isValid && firstInvalid) firstInvalid.focus();
    });
  }

  const soundButton = document.querySelector("[data-sound-demo]");
  const soundStatus = document.querySelector("[data-sound-status]");
  if (soundButton) {
    soundButton.addEventListener("click", () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        if (soundStatus) soundStatus.textContent = "Der Browser unterstützt die Sound-Demo nicht.";
        return;
      }

      const context = new AudioContext();
      const frequencies = [392, 523.25, 659.25, 880];
      frequencies.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = frequency;
        oscillator.type = index % 2 === 0 ? "sine" : "triangle";
        gain.gain.setValueAtTime(0, context.currentTime + index * 0.16);
        gain.gain.linearRampToValueAtTime(0.11, context.currentTime + index * 0.16 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + index * 0.16 + 0.14);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(context.currentTime + index * 0.16);
        oscillator.stop(context.currentTime + index * 0.16 + 0.16);
      });
      if (soundStatus) soundStatus.textContent = "Hörmarke abgespielt: vier kurze, aufsteigende Töne.";
    });
  }
})();
