const epX = {
  arr: [],
  config: { max: 150, start: 1, labelMain: "Series" },
  getDate(t) {
    if (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(t)) {
      var e = t.substring(0, 4),
        a = t.substring(5, 7),
        i = t.substring(8, 10),
        s = [];
      return (
        (s[1] = "يناير"),
        (s[2] = "فبراير"),
        (s[3] = "مارس"),
        (s[4] = "أبريل"),
        (s[5] = "ماي"),
        (s[6] = "يونيو"),
        (s[7] = "يوليو"),
        (s[8] = "أغسطس"),
        (s[9] = "سبتمبر"),
        (s[10] = "أكتوبر"),
        (s[11] = "نوفمبر"),
        (s[12] = "ديسمبر"),
        i + " " + s[parseInt(a, 10)] + " " + e
      );
    }
    return !1;
  },
  sort: (t) => t.sort((t, e) => t.title.localeCompare(e.title, void 0, { numeric: !0 })),
  compile: function () {
    let t = this.sort(this.arr).reverse(),
      e = this.config,
      a = "",
      i,
      s;
    $.each(t, function (t, l) {
      if (!l.cat.includes("Series")) {
        let n = ["الفصل"].find((t) => l.title.includes(t)),
          r = n
            ? l.title.split(n)[1].replace(/[^0-9\.-]+/g, "")
            : l.title.replace(/\D/g, "");
        if (l.content) {
          let c = $(l.content.replaceAll("src=", "scr=")).find("#downloadBtn");
          l.dLink = c.length ? c.attr("href") : "";
        }
        l.titleModified = n ? n + " " + r : l.title;
        l.titleNumeric = parseInt(r);
        a += `<li data-numb="${r}"><div class="chbox"><div class="eph-num"><a href="${l.url}" style="display: flex;gap: 10px;justify-content: center;align-items: center;">
  <span><span class="chapternum">${l.titleModified}</span>
  <span class="chapterdate">${l.date}</span></span></a>
</div>`;
        l.dLink && (a += `<div class="dt"><a href="${l.dLink}" rel="nofollow" class="dload" target="_blank"><i class="fa-solid fa-cloud-arrow-down"></i></a></div>`);
        a += "</div></li>";
        if ("الفصل" == n) {
          (!i || l.titleNumeric < i.titleNumeric) && (i = l);
          (!s || l.titleNumeric > s.titleNumeric) && (s = l);
        }
      }
    });
    if (i) {
      let l = i.title.replace(/\D/g, ""),
        n = `<div class="inepcx" data-id="1"><a href="${i.url}"><span>بداية العمل: فـ . </span><span class="epcur epcurfirst">${l}</span></a></div>`;
      $("#firstLastChapters").append(n);
    }
    if (a.length > 0) {
      $("#epX").append(`<ul class="clstyle">${a}</ul>`);
    }
    if (s) {
      let r = s.title.replace(/\D/g, ""),
        c = `<div class="inepcx" data-id="2"><a href="${s.url}"><span> آخـر إصـدار: فـ . </span><span class="epcur epcurlast">${r}</span></a></div>`;
      $("#firstLastChapters").append(c);
    }
  },
  xhr: function () {
    let t = this,
      e = t.config;
    $.ajax({
      type: "get",
      url: `${e.site || ""}/feeds/posts/default/-/${e.cat}`,
      data: { alt: "json", "start-index": e.start, "max-results": e.max },
      dataType: "jsonp",
      success: function (a) {
        if ("entry" in a.feed) {
          $.each(a.feed.entry, function (e, a) {
            t.arr.push({
              title: a.title.$t,
              date: t.getDate(a.published.$t),
              url: a.link.find((t) => "alternate" == t.rel).href,
              cat: a.category.map((t) => t.term),
              content: "content" in a && a.content.$t,
            });
          });
          if (a.feed.entry.length >= e.max) {
            e.start += e.max;
            t.xhr();
          } else {
            t.compile();
          }
        } else {
          t.compile();
        }
      },
      error: function () {
        $("#epX").html(`<p>${e.textError || "Error"}</p>`);
      },
    });
  },
  run: function () {
    if (typeof jQuery == "function") {
      this.config.cat = $("#epX").data("label") || !1;
      if (this.config.cat == 0 || this.config.cat == this.config.labelMain) {
        this.config.labelMain = this.config.cat;
      }
      this.xhr();
    } else {
      console.log("jquery not found");
    }
  },
  search: function (t) {
    let e = $(t).val().toUpperCase(),
      a = $("#epX .clstyle").find("li");
    $.each(a, function (t, a) {
      $(a)
        .data("numb")
        .toString()
        .toUpperCase()
        .indexOf(e) > -1
        ? $(a).show()
        : $(a).hide();
    });
  },
};

const npX2 = {
  arr: new Array,
  config: {
    max: 150,
    start: 1,
    labelMain: "Series"
  },
  sort: e => e.sort((e, t) => e.title.localeCompare(t.title, void 0, { numeric: !0 })),
  compile: function () {
    let e = this.sort(this.arr).reverse(),
      t = this.config,
      a = (window || document).location.pathname,
      r = $('<select id="nPL_select" onchange="this.options[this.selectedIndex].value&&window.open(this.options[this.selectedIndex].value, \'_self\')" name="nPL_list"></select>'),
      n = "",
      i = "",
      l = "";

    const settingBtn = $('<button class="red-button" id="open-option" onclick="openSettings()"><i class="fas fa-cog mt-5"></i>الإعدادات</button>');

    const linkElement = $("#link");
    const downloadBtn = linkElement.length > 0 ? $('<button class="red-button" id="dl"><i class="fas fa-download mt-5"></i>تحميل</button>') : null;
    if (downloadBtn) {
      downloadBtn.click(() => {
        window.open(linkElement.attr("href"), "_blank");
      });
    }

$.each(e, (o, s) => {
  s.url.includes(a) &&
    (e[o + 1] &&
      (!s.cat.includes('Series') && !e[o + 1].cat.includes('Series') ?
        (i = $(`<a rel="prev" href="${e[o + 1].url}"><i class="fa fa-arrow-right"></i>${t.prev||" السابق"}</a>`)) : ""
      ),
      e[o - 1] &&
      (!s.cat.includes('Series') && !e[o - 1].cat.includes('Series') ?
        (l = $(`<a rel="next" href="${e[o - 1].url}">${t.next||"التالي "}<i class="fas fa-arrow-left"></i></a>`)) : ""
      )
    );
});


$.each(e, (o, s) => {
  const postNumber = s.title.match(/\d+/);
  const optionText = postNumber ? `الفصل ${postNumber[0]}` : s.title;
  s.cat.some(e => t.labelMain == e) ? n = $(`<a rel="home" href="${s.url}"><i class="fas fas fa-home"></i>${t.home||" الفصول"}</a>`) :
    (r.append($(`<option ${s.url.includes(a) ? 'selected="selected"' : ""} value="${s.url}">${optionText}</option>`)));
});



    let o = $('<div class="inner_nPL"></div>');
    o.append(settingBtn);
    if (downloadBtn) {
      o.append(downloadBtn);
    }
    o.append(i).append(n).append(l);

  const contSDS = $('<div class="contSDS"></div>');
    contSDS.append(settingBtn).append(downloadBtn).append(r);

    $("#nPL").html(contSDS).append(o);
  },
  jqCheck: () => "function" == typeof jQuery,
  xhr: function () {
    const e = this,
      t = e.config;
    $.ajax({
      type: "get",
      url: `${t.site||""}/feeds/posts/summary/-/${t.cat}`,
      data: { alt: "json", "start-index": t.start, "max-results": t.max },
      dataType: "jsonp",
      success: a => {
        "entry" in a.feed ?
          ($.each(a.feed.entry, (t, a) => {
            e.arr.push({ title: a.title.$t, url: a.link.find(e => "alternate" == e.rel).href, cat: a.category.map(e => e.term) });
          }),
            a.feed.entry.length >= t.max ?
              (e.config.start += e.config.max, e.xhr()) :
              e.compile()
          ) : 0 != e.arr.length && e.compile();
      },
      error: () => {
        $("#nPL").html(`<p>${t.textError||"Error"}</p>`);
      }
    });
  },
  run: function () {
    return this.jqCheck() ? 0 == $("#nPL").length ? "element tidak ada" : (this.config.cat = $("#nPL").data("label") || !1, 0 == this.config.cat ? "Category Tidak ada" : void this.xhr()) : "jquery tidak ada";
  }
};
npX2.run();
npX2.run();const npX = {
  arr: new Array,
  config: {
    max: 150,
    start: 1,
    labelMain: "Series"
  },
  sort: e => e.sort((e, t) => e.title.localeCompare(t.title, void 0, { numeric: !0 })),
  compile: function () {
    let e = this.sort(this.arr).reverse(),
      t = this.config,
      a = (window || document).location.pathname,
      r = $('<select id="nPL_select" onchange="this.options[this.selectedIndex].value&&window.open(this.options[this.selectedIndex].value, \'_self\')" name="nPL_list"></select>'),
      n = "",
      i = "",
      l = "";
    const settingBtn = $('<button id="showButton" onclick="showFloatingDiv()"><i class="fas fa-comment-alt mt-5"></i>التعليقات</button>');

    const linkElement = $("#link");
    const downloadBtn = null;
$.each(e, (o, s) => {
  s.url.includes(a) &&
    (e[o + 1] &&
      (!s.cat.includes('Series') && !e[o + 1].cat.includes('Series') ?
        (i = $(`<a rel="prev" href="${e[o + 1].url}"><i class="fa fa-arrow-right"></i>${t.prev||" السابق"}</a>`)) : ""
      ),
      e[o - 1] &&
      (!s.cat.includes('Series') && !e[o - 1].cat.includes('Series') ?
        (l = $(`<a rel="next" href="${e[o - 1].url}">${t.next||"التالي "}<i class="fas fa-arrow-left"></i></a>`)) : ""
      )
    );
});


$.each(e, (o, s) => {
  const postNumber = s.title.match(/\d+/);
  const optionText = postNumber ? `الفصل ${postNumber[0]}` : s.title;
  s.cat.some(e => t.labelMain == e) ? n = $(`<a rel="home" href="${s.url}"><i class="fas fas fa-home"></i>${t.home||" الفصول"}</a>`) :
    (r.append($(`<option ${s.url.includes(a) ? 'selected="selected"' : ""} value="${s.url}">${optionText}</option>`)));
});



    let o = $('<div class="inner_nPL"></div>');
    o.append(settingBtn);
    if (downloadBtn) {
      o.append(downloadBtn);
    }
    o.append(i).append(n).append(l);

  const contSDS = $('<div class="contSDS"></div>');
    contSDS.append(settingBtn).append(downloadBtn).append(r);

    $("#nPL2").html(contSDS).append(o);
  },
  jqCheck: () => "function" == typeof jQuery,
  xhr: function () {
    const e = this,
      t = e.config;
    $.ajax({
      type: "get",
      url: `${t.site||""}/feeds/posts/summary/-/${t.cat}`,
      data: { alt: "json", "start-index": t.start, "max-results": t.max },
      dataType: "jsonp",
      success: a => {
        "entry" in a.feed ?
          ($.each(a.feed.entry, (t, a) => {
            e.arr.push({ title: a.title.$t, url: a.link.find(e => "alternate" == e.rel).href, cat: a.category.map(e => e.term) });
          }),
            a.feed.entry.length >= t.max ?
              (e.config.start += e.config.max, e.xhr()) :
              e.compile()
          ) : 0 != e.arr.length && e.compile();
      },
      error: () => {
        $("#nPL2").html(`<p>${t.textError||"Error"}</p>`);
      }
    });
  },
  run: function () {
    return this.jqCheck() ? 0 == $("#nPL2").length ? "element tidak ada" : (this.config.cat = $("#nPL2").data("label") || !1, 0 == this.config.cat ? "Category Tidak ada" : void this.xhr()) : "jquery tidak ada";
  }
};
npX.run();
