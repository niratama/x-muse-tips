/* X Muse Tips public edition v1 — keyword search + category filter.
   Filters the summary table rows and the tip articles together so the
   list and the details always show the same set of tips. */
(function () {
  "use strict";

  var q = document.getElementById("q");
  var clearBtn = document.getElementById("clear");
  var count = document.getElementById("result-count");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var rows = Array.prototype.slice.call(
    document.querySelectorAll("#tips-table tbody tr")
  );
  var articles = Array.prototype.slice.call(
    document.querySelectorAll("article.tip")
  );
  var total = articles.length;
  var activeCat = "";

  function terms() {
    return q.value
      .toLowerCase()
      .split(/[\s\u3000]+/)
      .filter(Boolean);
  }

  function matches(el, words) {
    var text = el.textContent.toLowerCase();
    return words.every(function (w) {
      return text.indexOf(w) !== -1;
    });
  }

  function apply() {
    var words = terms();
    var visible = {};
    var n = 0;
    articles.forEach(function (a) {
      var okCat = !activeCat || a.getAttribute("data-category") === activeCat;
      var show = okCat && matches(a, words);
      a.hidden = !show;
      if (show) {
        visible[a.getAttribute("data-num")] = true;
        n += 1;
      }
    });
    rows.forEach(function (r) {
      r.hidden = !visible[r.getAttribute("data-num")];
    });
    count.textContent = "全" + total + "件中 " + n + " 件を表示";
  }

  function setActiveChip(target) {
    chips.forEach(function (c) {
      c.setAttribute("aria-pressed", String(c === target));
    });
    activeCat = target.getAttribute("data-cat") || "";
  }

  q.addEventListener("input", apply);
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      setActiveChip(chip);
      apply();
    });
  });
  clearBtn.addEventListener("click", function () {
    q.value = "";
    setActiveChip(chips[0]);
    apply();
    q.focus();
  });

  apply();
})();
