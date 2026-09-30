(function (global) {
  var HOST_SEL =
    ".drop-cell, .kv__value, .summary__value, .totals__amt, .amount-received__value, .inv-title__no, .pay-kv__value, .cheques-intro__meta, .cheques-intro__note, .cheque-note, .words, .addr-box, .po-words, .po-remarks__text, .po-note, .po-item-name, .po-item-sub, .po-totals__amt, .pr-kpi__value, .pr-just, .lc-metric__value, .lc-notes, .lc-sign__meta, .ii-copy, .cb-copy, .cb-due__value, .cb-sig__meta, .cb-words, .cb-bank__value, .cr-amount__value, .ch-card__value, .cx-compare__value, .cx-step__no";

  function hostOf(el) {
    return el.closest(HOST_SEL) || el.parentElement;
  }

  function applyHostStyles(el) {
    var host = hostOf(el);
    if (!host) {
      return;
    }
    var cs = global.getComputedStyle(host);
    el.style.fontFamily = cs.fontFamily;
    el.style.fontSize = cs.fontSize;
    el.style.fontWeight = cs.fontWeight;
    el.style.fontStyle = cs.fontStyle;
    el.style.lineHeight = cs.lineHeight;
    el.style.letterSpacing = cs.letterSpacing;
    el.style.color = cs.color;
    el.style.textAlign = cs.textAlign;
  }

  function clearHostStyles(el) {
    el.style.fontFamily = "";
    el.style.fontSize = "";
    el.style.fontWeight = "";
    el.style.fontStyle = "";
    el.style.lineHeight = "";
    el.style.letterSpacing = "";
    el.style.color = "";
    el.style.textAlign = "";
  }

  function fillField(el, text) {
    el.textContent = text || "";
    if (text) {
      el.classList.add("is-filled");
      applyHostStyles(el);
    } else {
      el.classList.remove("is-filled");
      clearHostStyles(el);
    }
  }

  function bindDrop(el) {
    if (!el || el.dataset.dropBound === "1") {
      return;
    }
    el.dataset.dropBound = "1";
    el.addEventListener("dragover", function (e) {
      e.preventDefault();
      el.classList.add("is-dragover");
    });
    el.addEventListener("dragleave", function () {
      el.classList.remove("is-dragover");
    });
    el.addEventListener("drop", function (e) {
      e.preventDefault();
      el.classList.remove("is-dragover");
      var text = e.dataTransfer && e.dataTransfer.getData("text/plain");
      if (text) {
        fillField(el, text);
      }
    });
  }

  function bindDrops(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll("[data-drop='true']").forEach(bindDrop);
  }

  global.OrvilleDoc = {
    bindDrop: bindDrop,
    bindDrops: bindDrops,
    fillField: fillField,
    applyHostStyles: applyHostStyles,
  };

  document.addEventListener("DOMContentLoaded", function () {
    bindDrops(document);
  });
})(window);
