/* ==========================================================================
   Nico · Fuera del guion — comportamiento
   No hace falta tocar este archivo: los textos editables están en config.js
   ========================================================================== */
(function () {
  "use strict";

  var S = window.SITIO || {};
  var esPendiente = function (v) { return typeof v === "string" && v.trim().charAt(0) === "["; };
  var limpiar = function (v) { return String(v).replace(/^\[|\]$/g, ""); };

  /* ---------- 1. Rellenar textos desde config.js ---------- */
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var clave = el.getAttribute("data-cfg");
    if (!(clave in S)) return;
    var valor = S[clave];
    el.textContent = valor;
    if (esPendiente(valor)) el.classList.add("pendiente");
    if (el.hasAttribute("data-cfg-mailto")) el.setAttribute("href", "mailto:" + limpiar(valor));
  });

  document.querySelectorAll("[data-logo]").forEach(function (el) {
    var nombre = S.nombreMarca || "Nico · Fuera del guion";
    el.setAttribute("aria-label", nombre);
    if (el.tagName !== "A") el.setAttribute("role", "img");
  });

  document.querySelectorAll("[data-anio]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Redes sociales: se ocultan las que están vacías
  document.querySelectorAll("[data-red]").forEach(function (li) {
    var url = S[li.getAttribute("data-red")];
    if (url) li.querySelector("a").setAttribute("href", url);
    else li.remove();
  });

  /* ---------- 2. Fotos y vídeo ---------- */
  function urlVideo(v) {
    var m = v.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
    if (m) return { tipo: "iframe", src: "https://www.youtube-nocookie.com/embed/" + m[1] + "?rel=0" };
    m = v.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return { tipo: "iframe", src: "https://player.vimeo.com/video/" + m[1] + "?dnt=1" };
    return { tipo: "video", src: v };
  }

  // Líneas opcionales (por ejemplo el NIF): se quitan si el valor está vacío
  document.querySelectorAll("[data-si]").forEach(function (el) {
    if (!S[el.getAttribute("data-si")]) el.remove();
  });

  document.querySelectorAll("[data-media]").forEach(function (hueco) {
    var valor = S[hueco.getAttribute("data-media")];
    if (!valor) {
      if (S.mostrarHuecos === false && !hueco.hasAttribute("data-siempre")) hueco.classList.add("hueco--oculto");
      return;
    }
    var alt = hueco.getAttribute("data-alt") || "";
    var nodo;
    if (hueco.getAttribute("data-media") === "videoManifiesto") {
      var v = urlVideo(valor);
      if (v.tipo === "iframe") {
        nodo = document.createElement("iframe");
        nodo.src = v.src;
        nodo.title = alt;
        nodo.loading = "lazy";
        nodo.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
        nodo.allowFullscreen = true;
      } else {
        nodo = document.createElement("video");
        nodo.src = v.src;
        nodo.controls = true;
        nodo.preload = "metadata";
        nodo.playsInline = true;
        if (S.posterVideo) nodo.poster = S.posterVideo;
        nodo.setAttribute("aria-label", alt);
      }
    } else {
      nodo = document.createElement("img");
      nodo.src = valor;
      nodo.alt = alt;
      nodo.loading = hueco.classList.contains("portada__foto") ? "eager" : "lazy";
      nodo.decoding = "async";
    }
    hueco.innerHTML = "";
    hueco.appendChild(nodo);
    hueco.classList.add("hueco--lleno");
  });

  // Si el manifiesto se queda sin foto ni vídeo, el texto ocupa todo el ancho
  document.querySelectorAll(".manifiesto__medios").forEach(function (medios) {
    if (!medios.querySelector(".hueco:not(.hueco--oculto)")) {
      medios.classList.add("hueco--oculto");
      medios.parentNode.classList.add("manifiesto--solo-texto");
    }
  });

  /* ---------- 3. La barra del tachado se dibuja al aparecer ---------- */
  var conBarra = document.querySelectorAll(".tachado, .logo");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    conBarra.forEach(function (el) { io.observe(el); });
  } else {
    conBarra.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 4. Calculadora del número de libertad ---------- */
  var calc = document.getElementById("calculadora");
  var total = document.getElementById("calculadora-total");
  var usar = document.getElementById("usar-numero");
  var formato = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  var suma = 0;

  if (calc) {
    calc.addEventListener("submit", function (e) { e.preventDefault(); });
    calc.addEventListener("input", function () {
      suma = 0;
      calc.querySelectorAll("input").forEach(function (i) {
        var n = parseFloat(i.value);
        if (!isNaN(n) && n > 0) suma += n;
      });
      total.textContent = formato(Math.round(suma)) + " €";
      usar.disabled = suma <= 0;
    });
    usar.addEventListener("click", function () {
      var campo = document.getElementById("p4");
      campo.value = Math.round(suma);
      campo.dispatchEvent(new Event("input", { bubbles: true }));
      document.getElementById("aplicar").scrollIntoView({ behavior: "smooth" });
      setTimeout(function () { campo.focus({ preventScroll: true }); }, 600);
    });
  }

  /* ---------- 5. Borrador del formulario de aplicación (solo en este navegador) ---------- */
  var CLAVE_BORRADOR = "fdg-aplicacion-borrador";
  var formApp = document.getElementById("form-aplicacion");

  function guardarBorrador() {
    var datos = {};
    formApp.querySelectorAll("input, textarea").forEach(function (c) {
      if (!c.name || c.name === "botcheck" || c.name === "Consentimiento") return;
      if (c.type === "radio") { if (c.checked) datos[c.name] = c.value; }
      else datos[c.name] = c.value;
    });
    try { localStorage.setItem(CLAVE_BORRADOR, JSON.stringify(datos)); } catch (e) { /* sin almacenamiento */ }
  }
  function cargarBorrador() {
    var datos;
    try { datos = JSON.parse(localStorage.getItem(CLAVE_BORRADOR) || "null"); } catch (e) { datos = null; }
    if (!datos) return;
    formApp.querySelectorAll("input, textarea").forEach(function (c) {
      if (!(c.name in datos)) return;
      if (c.type === "radio") c.checked = c.value === datos[c.name];
      else c.value = datos[c.name];
    });
  }
  function borrarBorrador() {
    try { localStorage.removeItem(CLAVE_BORRADOR); } catch (e) { /* sin almacenamiento */ }
  }

  if (formApp) {
    cargarBorrador();
    var temporizador;
    formApp.addEventListener("input", function () {
      clearTimeout(temporizador);
      temporizador = setTimeout(guardarBorrador, 400);
    });
  }

  /* ---------- 6. Envío de formularios (Web3Forms) ---------- */
  function mostrarEstado(form, texto, tipo) {
    var caja = form.querySelector(".estado");
    caja.className = "estado" + (tipo ? " estado--" + tipo : "");
    caja.innerHTML = texto;
  }

  function mostrarGracias(form, titulo, parrafos) {
    var div = document.createElement("div");
    div.className = "gracias";
    div.setAttribute("tabindex", "-1");
    var h = document.createElement("p");
    h.className = "gracias__titulo";
    h.textContent = titulo;
    div.appendChild(h);
    parrafos.forEach(function (t) {
      var p = document.createElement("p");
      p.textContent = t;
      div.appendChild(p);
    });
    form.replaceWith(div);
    div.focus();
  }

  function prepararFormulario(form, alTerminar) {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var datos = {};
      new FormData(form).forEach(function (valor, clave) {
        if (clave !== "botcheck") datos[clave] = typeof valor === "string" ? valor.trim() : valor;
      });
      if (form.querySelector('[name="botcheck"]').checked) return; // bot

      datos["Fecha del consentimiento"] = new Date().toLocaleString("es-ES");
      datos.subject = form.getAttribute("data-asunto") + " — " + (datos.Nombre || "");
      datos.from_name = S.nombreMarca || "Fuera del guion";

      var clave = (S.web3formsKey || "").trim();
      if (!clave) {
        console.info("[Modo de prueba] Esto es lo que se habría enviado:", datos);
        mostrarEstado(form,
          "<strong>Modo de prueba:</strong> el formulario funciona, pero todavía no envía nada. " +
          "Falta pegar la clave de Web3Forms en <code>js/config.js</code>.", "prueba");
        return;
      }
      datos.access_key = clave;

      var boton = form.querySelector('button[type="submit"]');
      var textoBoton = boton.innerHTML;
      boton.disabled = true;
      boton.textContent = "Enviando…";
      mostrarEstado(form, "");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(datos)
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, json: j }; }); })
        .then(function (res) {
          if (!res.ok || !res.json.success) throw new Error(res.json.message || "Error");
          alTerminar(form, datos);
        })
        .catch(function () {
          boton.disabled = false;
          boton.innerHTML = textoBoton;
          var email = limpiar(S.email || "");
          mostrarEstado(form,
            "No se ha podido enviar. Revisa tu conexión y vuelve a intentarlo." +
            (email ? " Si sigue fallando, escríbeme a <a href=\"mailto:" + email + "\">" + email + "</a>." : ""),
            "error");
        });
    });
  }

  prepararFormulario(formApp, function (form, datos) {
    borrarBorrador();
    mostrarGracias(form, "Recibido.", [
      "Gracias, " + (datos.Nombre || "").split(" ")[0] + ". Lo leo yo, entero.",
      "Si pasas a la siguiente fase, te escribo a " + datos.email + " con la prueba de 7 días. " +
      "Las personas elegidas se anuncian el " + (S.fechaAnuncio || "") + "."
    ]);
  });

  prepararFormulario(document.getElementById("form-espera"), function (form) {
    mostrarGracias(form, "Estás dentro de la lista.", [
      "Te escribo cuando abra la comunidad. Mientras tanto, sígueme en redes para ver la " +
      (S.temporada || "Temporada 0") + " en directo."
    ]);
  });
})();
