/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/shikwasa@2.2.1/dist/shikwasa.es.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
const t = {
    container: () => document.querySelector("body"),
    parser: null,
    fixed: { type: "auto", position: "bottom" },
    download: !1,
    themeColor: "#0d6efd",
    theme: "auto",
    autoPlay: !1,
    muted: !1,
    preload: "metadata",
    speedOptions: [0.5, 0.75, 1, 1.25, 1.5],
    audio: null,
  },
  e = {
    fixedOptions: ["auto", "static", "fixed"],
    audioOptions: {
      title: "Unknown Title",
      artist: "Unknown Artist",
      duration: NaN,
      cover: null,
      chapters: [],
      src: null,
      album: "",
      live: !1,
    },
  };
function i(t) {
  t = Math.round(t);
  let e = Math.floor(t / 3600),
    i = Math.floor((t - 3600 * e) / 60),
    s = Math.floor(t - 3600 * e - 60 * i);
  return (
    (i = i < 10 ? "0" + i : i),
    (s = s < 10 ? "0" + s : s),
    0 === e ? `${i}:${s}` : ((e = e < 10 ? "0" + e : e), `${e}:${i}:${s}`)
  );
}
function s(t, e, i = 60) {
  if (e.offsetWidth - t.offsetWidth > 0) {
    t.setAttribute("data-overflow", "");
    const s = e.offsetWidth / i;
    t.style.animationDuration = `${s}s`;
  } else t.removeAttribute("data-overflow");
}
function a(t = {}, i = {}) {
  let s = Object.assign({}, t);
  return (
    Object.keys(e.audioOptions).forEach((t) => {
      s[t] = s[t] || i[t] || e.audioOptions[t];
    }),
    s
  );
}
async function n(t = {}, e = {}) {
  const { tags: i } =
      (await (function (t, e) {
        return new Promise((i, s) => {
          e.read(t, { onSuccess: i, onError: s });
        });
      })(t.src, e)) || {},
    s = (function (t = {}) {
      let e, i, s;
      const { title: a, artist: n } = t;
      if (t.picture && t.picture.data && t.picture.format) {
        const i = new Uint8Array(t.picture.data),
          s = new Blob([i], { type: t.picture.format });
        e = URL.createObjectURL(s);
      }
      t.TLEN && t.TLEN.data && (s = +t.TLEN.data / 1e3);
      t.CHAP &&
        t.CHAP.length &&
        (i = t.CHAP.filter((t) => "CHAP" === t.id)
          .map(
            (t) =>
              !!(t.data && t.data.subFrames && t.data.subFrames.TIT2) && {
                id: t.data.id,
                startTime: t.data.startTime / 1e3,
                endTime: t.data.endTime / 1e3,
                title: t.data.subFrames.TIT2.data,
              }
          )
          .sort((t, e) => t.id - e.id));
      return { title: a, artist: n, cover: e, duration: s, chapters: i };
    })(i);
  return a(t, s);
}
function r(t) {
  t.tag = t.tag || "div";
  const e = document.createElement(t.tag);
  return (
    t.className &&
      ("string" == typeof t.className
        ? e.classList.add(t.className)
        : t.className.forEach((t) => {
            e.classList.add(t);
          })),
    t.attrs &&
      Object.keys(t.attrs).forEach((i) => {
        e.setAttribute(i, t.attrs[i]);
      }),
    t.innerHTML && (e.innerHTML = t.innerHTML),
    e
  );
}
function o(t, e, i) {
  "boolean" != typeof i
    ? "function" == typeof t.toggleAttribute
      ? t.toggleAttribute(e)
      : t.hasAttribute(e)
      ? t.removeAttribute(e)
      : t.setAttribute(e, "")
    : i
    ? t.setAttribute(e, "")
    : t.removeAttribute(e);
}
function h(t, e, i, s, a, n) {
  const r = (t - e) / 1e3 / i;
  (n.scrollTop = s + a * r),
    r < 1 &&
      window.requestAnimationFrame((t) => {
        h(t, e, i, s, a, n);
      });
}
function d(t, e) {
  var i = !0,
    s = !1,
    a = null;
  function n(t) {
    return !!(
      t &&
      t !== document &&
      "HTML" !== t.nodeName &&
      "BODY" !== t.nodeName &&
      "classList" in t &&
      "contains" in t.classList
    );
  }
  function r(t) {
    t.classList.contains("focus-visible") ||
      (t.classList.add("focus-visible"),
      t.setAttribute("data-focus-visible-added", ""));
  }
  function o() {
    i = !1;
  }
  function h() {
    t.addEventListener("mousemove", d),
      t.addEventListener("mousedown", d),
      t.addEventListener("mouseup", d),
      t.addEventListener("pointermove", d),
      t.addEventListener("pointerdown", d),
      t.addEventListener("pointerup", d),
      t.addEventListener("touchmove", d, !!e && { passive: !0 }),
      t.addEventListener("touchstart", d, !!e && { passive: !0 }),
      t.addEventListener("touchend", d, !!e && { passive: !0 });
  }
  function d() {
    var s;
    (i = !1),
      t.removeEventListener("mousemove", d),
      t.removeEventListener("mousedown", d),
      t.removeEventListener("mouseup", d),
      t.removeEventListener("pointermove", s),
      t.removeEventListener("pointerdown", d),
      t.removeEventListener("pointerup", d),
      t.removeEventListener("touchmove", d, !!e && { passive: !0 }),
      t.removeEventListener("touchstart", d, !!e && { passive: !0 }),
      t.removeEventListener("touchend", d, !!e && { passive: !0 });
  }
  t.addEventListener(
    "keydown",
    function (e) {
      e.metaKey ||
        e.altKey ||
        e.ctrlKey ||
        (n(document.activeElement) &&
          t.contains(document.activeElement) &&
          r(document.activeElement),
        (i = !0));
    },
    !0
  ),
    t.addEventListener("mousedown", o, !0),
    t.addEventListener("pointerdown", o, !0),
    t.addEventListener("touchstart", o, !e || { passive: !0, capture: !0 }),
    t.addEventListener(
      "visibilitychange",
      function () {
        "hidden" === document.visibilityState && (s && (i = !0), h());
      },
      !0
    ),
    h(),
    t.addEventListener(
      "focus",
      function (t) {
        n(t.target) && i && r(t.target);
      },
      !0
    ),
    t.addEventListener(
      "blur",
      function (t) {
        var e;
        n(t.target) &&
          (t.target.classList.contains("focus-visible") ||
            t.target.hasAttribute("data-focus-visible-added")) &&
          ((s = !0),
          window.clearTimeout(a),
          (a = window.setTimeout(function () {
            s = !1;
          }, 100)),
          (e = t.target).hasAttribute("data-focus-visible-added") &&
            (e.classList.remove("focus-visible"),
            e.removeAttribute("data-focus-visible-added")));
      },
      !0
    ),
    t.classList.add("js-focus-visible");
}
let l,
  c = null,
  u = !0;
class p {
  constructor(t) {
    (this.mounted = !1),
      (this.icons = r({
        className: "shk-icons",
        innerHTML:
          '\n  <svg class="shk-icons" xmlns="http://www.w3.org/2000/svg">\n    <symbol id="shk-icon_play" viewbox="0 0 64 64">\n      <path\n        d="M32 0a32 32 0 1 1 0 64 32 32 0 0 1 0-64zm-9 17.8c-1 0-1.7.6-1.7 1.4v25.6c0 .8.8 1.4 1.7 1.4 0 0 25-12 26.2-13.1 1-1 .3-1.9.1-2.1z" />\n    </symbol>\n\n    <symbol id="shk-icon_pause" viewbox="0 0 64 64">\n      <path fill-rule="nonzero"\n        d="M32 0a32 32 0 1 0 0 64 32 32 0 0 0 0-64zm-4 40a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V24c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v16zm16 0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V24c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v16z" />\n    </symbol>\n\n    <symbol id="shk-icon_download" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">\n      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />\n    </symbol>\n\n    <symbol id="shk-icon_forward" viewbox="0 0 128 139">\n      <path\n        d="M64 11v14h-.8A50 50 0 1 0 114 75h14a64 64 0 1 1-64-64zm16.9 35c6.6 0 11.8 2.7 15.6 8.3a38 38 0 0 1 5.3 21.4c0 9-1.8 16-5.3 21.3-3.8 5.6-9 8.4-15.6 8.4-6.7 0-12-2.8-15.6-8.4A38 38 0 0 1 60 75.7c0-9 1.8-16.1 5.3-21.4C69 48.7 74.2 46 80.9 46zm-32.5 1v57.1H39V58.3a32.3 32.3 0 0 1-13 7V56a34 34 0 0 0 15.4-9h7zm32.5 7c-4.6 0-7.8 2.4-9.6 7.5-1.3 3.5-2 8.2-2 14.2 0 5.9.7 10.6 2 14.1 1.8 5 5 7.6 9.6 7.6 4.5 0 7.7-2.5 9.6-7.6 1.3-3.5 1.9-8.2 1.9-14.1 0-6-.6-10.7-2-14.2-1.8-5.1-5-7.6-9.5-7.6zM64 0l48 19-48 19V0z" />\n    </symbol>\n\n    <symbol id="shk-icon_backward" viewbox="0 0 128 139">\n      <path\n        d="M64 0v11A64 64 0 1 1 0 75h14a50 50 0 1 0 50-50v13L16 19 64 0zm17 45.8c6.6 0 11.8 2.7 15.6 8.3a38 38 0 0 1 5.3 21.3c0 9-1.8 16.1-5.3 21.4a18 18 0 0 1-15.6 8.3c-6.7 0-12-2.8-15.6-8.3a38 38 0 0 1-5.3-21.4c0-9 1.8-16 5.3-21.3 3.7-5.6 8.9-8.3 15.6-8.3zm-32.4 1V104h-9.4V58.2a32.3 32.3 0 0 1-13 7v-9.4a34 34 0 0 0 15.4-9h7zm32.4 7c-4.6 0-7.8 2.5-9.6 7.6-1.3 3.4-2 8.1-2 14.1s.7 10.7 2 14.2c1.8 5 5 7.6 9.6 7.6 4.5 0 7.7-2.6 9.6-7.6 1.3-3.5 2-8.2 2-14.2s-.7-10.7-2-14.1c-2-5.1-5.1-7.6-9.6-7.6z" />\n    </symbol>\n\n    <symbol id="shk-icon_more" viewbox="0 0 64 64">\n      <path\n        d="M8 24a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8zm48 0a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8zm-24 0a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8zm0 0" />\n    </symbol>\n\n    <symbol id="shk-icon_chapter" viewbox="0 0 64 64">\n      <path d="M60.8 55.3H18.1a3.2 3.2 0 1 1 0-6.4h42.8a3.2 3.2 0 0 1 3.1 4.9c-.7 1-1.9 1.6-3.1 1.5zm0-20.2H18.1a3.2 3.2 0 1 1 0-6.4h42.8a3.2 3.2 0 1 1 0 6.4zm0-20H18.1a3.2 3.2 0 1 1 0-6.3h42.8a3.2 3.2 0 0 1 0 6.3zM8.5 12.3a4.2 4.2 0 1 1-8.5 0 4.2 4.2 0 0 1 8.5 0zm0 19.8A4.2 4.2 0 1 1 0 32a4.2 4.2 0 0 1 8.5 0zm0 19.8a4.3 4.3 0 1 1-8.5 0 4.3 4.3 0 0 1 8.5 0zm0 0"/>\n    </symbol>\n\n    <symbol id="shk-icon_unmute" viewBox="0 0 64 66">\n      <path d="M34.3 0c1.5.1 2.6 1.4 2.9 2.8v60.3c-.3 1.4-1.4 2.7-3 2.8-.7.1-1.6-.1-2.6-.7L13.7 50H4.2a4 4 0 0 1-4.1-4V20.6c0-2.2 1.8-4 4-4.1h9.6c.7-.8 17.2-15.1 17.9-15.8 1-.6 1.9-.8 2.6-.7zm6.4 9.3a2 2 0 0 1 2.4-1.6 25.8 25.8 0 0 1 0 50.5l-.4.1a2 2 0 1 1-.4-4.1 21.7 21.7 0 0 0 0-42.5 2 2 0 0 1-1.6-2.4zm4.7 12.8a12.1 12.1 0 0 1 0 21.8 2 2 0 0 1-2.8-1c-.5-1-.1-2.2 1-2.8a8 8 0 0 0 0-14.4 2 2 0 0 1-1-2.7 2 2 0 0 1 2.8-.9zm0 0"/>\n    </symbol>\n\n    <symbol id="shk-icon_mute" viewBox="0 0 64 64">\n      <path d="M33.2 0c-.8 0-1.6.1-2.6.7l-17.4 15H4a4 4 0 0 0-4 4v24.1a4 4 0 0 0 4 4h9.2l17.4 14.5c1 .6 1.8.8 2.6.7 1.4-.1 2.5-1.4 2.8-2.6V2.7C35.7 1.4 34.6 0 33.2 0zm23.2 31.5l6.9-6.8c.7-.6 1-1.5.7-2.4-.2-.8-.9-1.5-1.8-1.7-.8-.2-1.8 0-2.4.7L53 28.1 46 21.3c-.6-.6-1.5-1-2.4-.7-.9.2-1.5.9-1.8 1.7-.2.9.1 1.8.8 2.4l6.9 6.8-7 6.8c-.8 1-.8 2.4.2 3.3.9 1 2.4 1 3.3.1l7-6.8 6.8 6.8c1 .9 2.5.8 3.4 0 1-1 1-2.4 0-3.4l-6.8-6.8zm0 0"/>\n    </symbol>\n\n    <symbol id="shk-icon_triangle" viewbox="0 0 64 64"><path d="M59 29.2L7.8.4A3.2 3.2 0 003 3.2v57.6a3.2 3.2 0 004.8 2.8L59 34.8a3.2 3.2 0 000-5.6z" /></symbol>\n    <symbol id="shk-icon_chart" viewbox="0 0 64 64"><g transform="matrix(1 0 0 -1 0 64)"><rect x="10" width="8" height="54.1" rx="3"><animate attributeName="height" begin="0s" dur="2s" values="64;55;33;5;60;23;58;33;12;14;52;64" calcMode="linear" repeatCount="indefinite"/></rect><rect x="26" width="8" height="32.8" rx="3"><animate attributeName="height" begin="0s" dur="2s" values="50;34;64;23;56;23;34;4;64;54;21;50" calcMode="linear" repeatCount="indefinite"/></rect><rect x="42" width="8" height="42.6" rx="3"><animate attributeName="height" begin="0s" dur="2s" values="30;45;13;64;56;24;45;64;34;23;64;30" calcMode="linear" repeatCount="indefinite"/></rect></g></symbol>\n    <symbol id="shk-icon_close" viewbox="0 0 16 16"><path d="M3.207 14.207a1 1 0 1 1-1.414-1.414l11-11a1 1 0 0 1 1.414 1.414zm11-1.414a1 1 0 0 1-1.414 1.414l-11-11a1 1 0 0 1 1.414-1.414z"></path></symbol>\n  </svg>\n',
      })),
      this.initEl(),
      this.initOptions(t);
  }
  async initEl() {
    (this.el = r({
      className: ["shk", "shikwasa"],
      attrs: { "data-name": "shikwasa" },
      innerHTML:
        '\n  <div class="shk-player">\n    <div class="shk-bar_wrap">\n      <div class="shk-bar" aria-label="progress bar">\n        <div class="shk-bar_loaded"\n          role="progressbar"\n          aria-label="loaded progress"\n          aria-valuenow="0"\n          aria-valuemin="0"\n          aria-valuemax="1"></div>\n        <div class="shk-bar_played"\n          role="progressbar"\n          aria-label="played progress"\n          aria-valuenow="0"\n          aria-valuemin="0"\n          aria-valuemax="1">\n          <button class="shk-bar-handle"\n            role="slider"\n            aria-label="seek progress"\n            aria-valuenow="0"\n            aria-valuemin="0"\n            aria-orientation="horizontal"\n            aria-valuemax="1"></button>\n        </div>\n      </div>\n    </div>\n    <div class="shk-body">\n      <div class="shk-cover">\n        <div class="shk-img"></div>\n      </div>\n      <div class="shk-main">\n        <div class="shk-text">\n          <div class="shk-artist_wrap">\n            <span class="shk-artist"></span>\n          </div>\n          <div class="shk-title_wrap">\n            <div class="shk-title_inner">\n              <span class="shk-title"></span>\n            </div>\n          </div>\n        </div>\n        <div class="shk-controls">\n          <div class="shk-controls_basic">\n            <button class="shk-btn shk-btn_speed"\n              aria-label="toggle playback rate"\n              title="change playback rate"\n              aria-live="polite">1.0x</button>\n            <button class="shk-btn shk-btn_backward"\n              aria-label="rewind 10 seconds"\n              title="rewind 10 seconds">\n              <svg aria-hidden="true">\n                <use xlink:href="#shk-icon_backward" />\n              </svg>\n            </button>\n            <button class="shk-btn shk-btn_toggle" aria-label="toggle play and pause">\n              <svg class="shk-btn_play" aria-hidden="true">\n                <use xlink:href="#shk-icon_play" />\n              </svg>\n              <svg class="shk-btn_pause" aria-hidden="true">\n                <use xlink:href="#shk-icon_pause" />\n              </svg>\n            </button>\n            <button class="shk-btn shk-btn_forward" aria-label="forward 10 seconds" title="forward 10 seconds">\n              <svg aria-hidden="true">\n                <use xlink:href="#shk-icon_forward" />\n              </svg>\n            </button>\n            <button class="shk-btn shk-btn_more" aria-label="more controls" title="more controls">\n              <svg aria-hidden="true">\n                <use xlink:href="#shk-icon_more" />\n              </svg>\n            </button>\n          </div>\n          <div class="shk-controls_extra">\n            <button class="shk-btn shk-btn_volume" aria-label="toggle volume" title="volume">\n              <svg class="shk-btn_unmute" aria-hidden="true">\n                <use xlink:href="#shk-icon_unmute" />\n              </svg>\n              <svg class="shk-btn_mute" aria-hidden="true">\n                <use xlink:href="#shk-icon_mute" />\n              </svg>\n            </button>\n          </div>\n        </div>\n        <div class="shk-display">\n          <span class="shk-loader" aria-live="polite">\n            <span class="shk-visuallyhidden" tabindex="-1">loading</span>\n            <svg aria-hidden="true" aria-label="loading" aria-live="polite" viewbox="0 0 66 66">\n              <circle cx="33" cy="33" r="30" fill="transparent" stroke="url(#shk-gradient)" stroke-dasharray="170"\n                stroke-dashoffset="20" stroke-width="6" />\n              <lineargradient id="shk-gradient">\n                <stop offset="50%" stop-color="currentColor" />\n                <stop offset="65%" stop-color="currentColor" stop-opacity=".5" />\n                <stop offset="100%" stop-color="currentColor" stop-opacity="0" />\n              </lineargradient>\n            </svg>\n          </span>\n          <span class="shk-time">\n            <span class="shk-time_now">00:00</span><span class="shk-time_duration">00:00</span>\n          </span>\n          <div class="shk-live">live</div>\n        </div>\n      </div>\n    </div>\n  </div>\n',
    })),
      (this.playBtn = this.el.querySelector(".shk-btn_toggle")),
      (this.fwdBtn = this.el.querySelector(".shk-btn_forward")),
      (this.bwdBtn = this.el.querySelector(".shk-btn_backward")),
      (this.speedBtn = this.el.querySelector(".shk-btn_speed")),
      (this.moreBtn = this.el.querySelector(".shk-btn_more")),
      (this.muteBtn = this.el.querySelector(".shk-btn_volume")),
      (this.extraControls = this.el.querySelector(".shk-controls_extra")),
      (this.texts = this.el.querySelector(".shk-text")),
      (this.artist = this.el.querySelector(".shk-artist")),
      (this.artistWrap = this.el.querySelector(".shk-artist_wrap")),
      (this.titleWrap = this.el.querySelector(".shk-title_wrap")),
      (this.titleInner = this.el.querySelector(".shk-title_inner")),
      (this.title = this.el.querySelector(".shk-title")),
      (this.currentTime = this.el.querySelector(".shk-time_now")),
      (this.duration = this.el.querySelector(".shk-time_duration")),
      (this.bar = this.el.querySelector(".shk-bar")),
      (this.barWrap = this.el.querySelector(".shk-bar_wrap")),
      (this.audioPlayed = this.el.querySelector(".shk-bar_played")),
      (this.audioLoaded = this.el.querySelector(".shk-bar_loaded")),
      (this.handle = this.el.querySelector(".shk-bar-handle")),
      (this.cover = this.el.querySelector(".shk-cover")),
      (this.seekControls = [this.fwdBtn, this.bwdBtn, this.handle]);
  }
  initOptions(t) {
    (this.el.style = `--color-primary: ${t.themeColor}`),
      this.el.setAttribute("data-theme", t.theme),
      t.download &&
        t.audio &&
        t.audio.src &&
        ((this.downloadBtn = r({
          tag: "a",
          className: ["shk-btn", "shk-btn_download"],
          attrs: {
            title: "download",
            "aria-label": "download",
            href: "string" == typeof t.download ? t.download : t.audio.src,
            download: "",
            target: "_blank",
            rel: "noopener noreferrer",
          },
          innerHTML:
            '\n          <svg aria-hidden="true">\n            <use xlink:href="#shk-icon_download" />\n          </svg>\n        ',
        })),
        this.extraControls.append(this.downloadBtn)),
      this.el.setAttribute("data-fixed-type", t.fixed.type),
      "static" !== t.fixed.type &&
        "top" === t.fixed.position &&
        this.el.setAttribute("data-fixed-pos", t.fixed.position),
      t.autoPlay ? this.setPlaying() : this.setPaused(),
      t.muted && this.setMute(t.muted);
  }
  initEvents(t) {
    this.moreBtn.addEventListener("click", () => {
      o(this.el, "data-extra");
    }),
      Array.from(this.extraControls.children).forEach((t) => {
        this.hideExtraControl(t);
      }),
      d(this.el, t),
      (l = () => {
        u &&
          ((u = !1),
          setTimeout(() => (u = !0), 100),
          s.call(this, this.titleWrap, this.title));
      }),
      window.addEventListener("resize", l);
  }
  setAudioInfo(t = {}) {
    c && (URL.revokeObjectURL(c), (c = null)),
      /blob/.test(t.cover) && (c = t.cover),
      t.cover
        ? (this.cover.style.backgroundImage = `url(${t.cover})`)
        : (this.cover.style.backgroundImage = "none"),
      (this.title.innerHTML = t.title),
      this.titleInner.setAttribute("data-title", t.title),
      (this.artist.innerHTML = t.artist),
      t.duration && (this.duration.innerHTML = i(t.duration)),
      this.downloadBtn && (this.downloadBtn.href = t.src),
      this.setBar("loaded", 0),
      this.setLive(t.live),
      s(this.titleWrap, this.title);
  }
  setPlaying() {
    this.el.setAttribute("data-play", "playing");
  }
  setPaused() {
    this.el.setAttribute("data-play", "paused"), this.setLoading(!1);
  }
  setTime(t, e) {
    this[t].innerHTML = i(e);
  }
  setBar(t, e) {
    const i = "audio" + t.charAt(0).toUpperCase() + t.substr(1);
    (e = Math.min(e, 1)),
      (e = Math.max(e, 0)),
      (this[i].style.width = 100 * e + "%");
    const s = e.toFixed(2);
    this[i].setAttribute("aria-valuenow", s),
      this.handle.setAttribute("aria-valuenow", s);
  }
  setProgress(t = 0, e = 0, i = 0) {
    t && !e ? (e = i ? t / i : 0) : (t = e * (i || 0)),
      this.setTime("currentTime", t),
      this.setBar("played", e);
  }
  setSpeed(t) {
    this.speedBtn.innerHTML =
      (function (t) {
        const e = parseFloat(t).toFixed(2);
        return "0" === e.slice(-1) ? e.slice(0, -1) : e;
      })(t) + "x";
  }
  setMute(t) {
    o(this.el, "data-mute", t);
  }
  setLive(t = !1) {
    o(this.el, "data-live", t);
  }
  setLoading(t) {
    o(this.el, "data-loading", t);
  }
  setSeeking(t) {
    o(this.el, "data-seeking", t);
  }
  setControls(t) {
    this.seekControls.forEach((e) => {
      o(e, "disabled", !t);
    });
  }
  getPercentByPos(t) {
    let e =
      ((t.clientX || (t.changedTouches && t.changedTouches[0].clientX) || 0) -
        this.barWrap.getBoundingClientRect().left) /
      this.barWrap.clientWidth;
    return (e = Math.min(e, 1)), (e = Math.max(0, e)), e;
  }
  hideExtraControl(t) {
    t.addEventListener("click", () => {
      setTimeout(() => {
        this.el.removeAttribute("data-extra");
      }, 800);
    });
  }
  mount(t, e) {
    (t.innerHTML = ""),
      t.append(this.el),
      this.icons && t.append(this.icons),
      (this.mounted = !0),
      this.initEvents(e),
      s(this.titleWrap, this.title);
  }
  destroy() {
    window.removeEventListener("resize", l), c && URL.revokeObjectURL(c);
  }
}
class v {
  constructor() {
    (this.audioEvents = [
      "abort",
      "canplay",
      "canplaythrough",
      "complete",
      "durationchange",
      "emptied",
      "ended",
      "error",
      "loadeddata",
      "loadedmetadata",
      "loadstart",
      "pause",
      "play",
      "playing",
      "progress",
      "ratechange",
      "seeked",
      "seeking",
      "stalled",
      "suspend",
      "timeupdate",
      "volumechange",
      "waiting",
    ]),
      (this.playerEvents = ["audioupdate", "audioparse"]),
      (this.events = {});
  }
  on(t, e) {
    this.type(t) &&
      "function" == typeof e &&
      (this.events[t] || (this.events[t] = []), this.events[t].push(e));
  }
  trigger(t, e = {}) {
    this.events[t] &&
      this.events[t].length &&
      this.events[t].forEach((t) => t(e));
  }
  type(t) {
    return -1 !== this.playerEvents.indexOf(t)
      ? "player"
      : -1 !== this.audioEvents.indexOf(t)
      ? "audio"
      : (console.error(`Shikwasa: unknown event name: ${t}`), null);
  }
  destroy() {
    this.events = {};
  }
}
const m = [],
  b = [],
  k =
    "undefined" != typeof window && /mobile/i.test(window.navigator.userAgent),
  f = k ? "touchstart" : "mousedown",
  g = k ? "touchmove" : "mousemove",
  y = k ? "touchend" : "mouseup";
let w = !1;
if ("undefined" != typeof window)
  try {
    const t = Object.defineProperty({}, "passive", {
      get: function () {
        return (w = !0), !1;
      },
    });
    window.addEventListener("testPassvie", null, t),
      window.removeEventListener("testPassvie", null, t);
  } catch (t) {
    w = !1;
  }
const _ = w && k;
class L {
  constructor(i) {
    (this.id = m.length),
      m.push(this),
      (this.comps = {}),
      (this._audio = {}),
      (this._hasMediaSession = !1),
      (this._initSeek = 0),
      (this.live = !1),
      (this._canplay = !1),
      (this._dragging = !1),
      (this.events = new v()),
      (this.options = (function (i) {
        const s = Object.assign({}, i);
        return (
          (s.audio = Object.assign({}, i.audio)),
          Object.keys(t).forEach((e) => {
            s[e] = s[e] || "boolean" == typeof s[e] ? s[e] : t[e];
          }),
          "function" == typeof s.container && (s.container = s.container()),
          e.fixedOptions.find((t) => t === s.fixed.type) ||
            (s.fixed.type = t.fixed.type),
          Array.isArray(s.speedOptions) || (s.speedOptions = [s.speedOptions]),
          -1 === s.speedOptions.indexOf(1) && s.speedOptions.push(1),
          (s.speedOptions = s.speedOptions
            .map((t) => parseFloat(t))
            .filter((t) => !isNaN(t))),
          s.speedOptions.length > 1 && s.speedOptions.sort((t, e) => t - e),
          s
        );
      })(i)),
      this.renderComponents(),
      this.initUI(this.options),
      this.initAudio(),
      this.ui.mount(this.options.container, w);
  }
  get duration() {
    return this.audio && this.audio.duration
      ? this.audio.duration
      : this._audio.duration;
  }
  get seekable() {
    return !this.live && Boolean(this.duration);
  }
  set seekable(t) {
    this.ui.setControls(t);
  }
  get currentTime() {
    return this.audio ? this.audio.currentTime : void 0;
  }
  get playbackRate() {
    return this.audio ? this.audio.playbackRate : void 0;
  }
  set playbackRate(t) {
    this.audio &&
      ((this.audio.playbackRate = t),
      (this.audio.defaultPlaybackRate = t),
      this.ui.setSpeed(t));
  }
  get muted() {
    return this.audio ? this.audio.muted : void 0;
  }
  set muted(t) {
    this.audio &&
      ((this.audio.muted = t),
      (this.audio.defaultMuted = t),
      this.ui.setMute(t));
  }
  initUI() {
    (this.ui = new p(this.options)),
      (this.el = this.ui.el),
      this.initControlEvents(),
      this.initBarEvents();
  }
  initControlEvents() {
    this.ui.playBtn.addEventListener("click", () => {
      this.toggle();
    }),
      this.ui.muteBtn.addEventListener("click", () => {
        this.muted = !this.muted;
      }),
      this.ui.fwdBtn.addEventListener("click", () => {
        this.seekBySpan();
      }),
      this.ui.bwdBtn.addEventListener("click", () => {
        this.seekBySpan({ forward: !1 });
      }),
      this.ui.speedBtn.addEventListener("click", () => {
        const t = this.options.speedOptions.indexOf(this.playbackRate),
          e = this.options.speedOptions;
        this.playbackRate = t + 1 >= e.length ? e[0] : e[t + 1];
      });
  }
  initBarEvents() {
    let t = 0;
    const e = (t) => {
        this.ui.setProgress(null, this.ui.getPercentByPos(t), this.duration);
      },
      i = (s) => {
        s.preventDefault(),
          document.removeEventListener(g, e),
          document.removeEventListener(y, i),
          (t = this.ui.getPercentByPos(s) * this.duration),
          this.seek(t),
          (this._dragging = !1),
          setTimeout(() => this.ui.setSeeking(!1), 50);
      };
    this.ui.barWrap.addEventListener(f, (t) => {
      this.seekable &&
        (t.preventDefault(),
        this.ui.setSeeking(!0),
        (this._dragging = !0),
        document.addEventListener(g, e, !!_ && { passive: !0 }),
        document.addEventListener(y, i));
    }),
      this.ui.handle.addEventListener("keydown", (t) => {
        if (!this.seekable) return;
        const e = t.key.replace("Arrow", ""),
          i = ["PageDown", "PageUp"],
          s = ["Home", "End"],
          a = -1 !== ["Left", "Down"].indexOf(e),
          n = -1 !== ["Right", "Up"].indexOf(e),
          r = e === i[0],
          o = e === i[1],
          h = e === s[0],
          d = e === s[1];
        if (!a && !n && -1 === i.indexOf(e) && -1 === s.indexOf(e)) return;
        if (h) return void this.seek(0);
        if (d) return void this.seek(this.duration);
        const l = (o || r ? 0.1 : 0.01) * (n || o ? 1 : -1),
          c = this._canplay ? this.currentTime : this._initSeek,
          u = l * this.duration + c;
        this.seek(u);
      });
  }
  initAudio() {
    this.options.audio.src &&
      ((this.audio = new Audio()),
      this.initAudioEvents(),
      this.events.audioEvents.forEach((t) => {
        this.audio.addEventListener(t, (e) => {
          this.events.trigger(t, e);
        });
      }),
      (this.audio.preload = this.options.preload),
      (this.muted = this.options.muted),
      this.update(this.options.audio));
  }
  initAudioEvents() {
    this.on("play", () => {
      this.ui.setPlaying(),
        m.forEach((t) => {
          t.id !== this.id && t.audio && !t.audio.paused && t.pause();
        });
    }),
      this.on("pause", () => {
        this.ui.setPaused();
      }),
      this.on("ended", () => {
        this.ui.setPaused(), this.seek(0);
      }),
      this.on("waiting", () => {
        this.ui.setLoading(!0);
      }),
      this.on("durationchange", () => {
        this.duration !== 1 / 0 && this.live && (this.live = !1),
          this.duration &&
            1 !== this.duration &&
            this.duration !== 1 / 0 &&
            ((this.seekable = !0), this.ui.setTime("duration", this.duration));
      }),
      this.on("canplay", () => {
        this._canplay ||
          ((this._canplay = !0),
          this._initSeek && (this.seek(this._initSeek), (this._initSeek = 0))),
          this.duration !== 1 / 0 ||
            this.live ||
            ((this.live = !0), this.ui.setLive(this.live));
      }),
      this.on("canplaythrough", () => {
        this.ui.setLoading(!1);
      }),
      this.on("progress", () => {
        if (this.audio.buffered.length) {
          const t = this.audio.buffered.length
            ? this.audio.buffered.end(this.audio.buffered.length - 1) /
              this.duration
            : 0;
          this.ui.setBar("loaded", t);
        }
      }),
      this.on("timeupdate", () => {
        this._dragging ||
          this.ui.setProgress(this.audio.currentTime, null, this.duration);
      }),
      this.on("abort", () => {
        this.ui.setPaused();
      }),
      this.on("audioupdate", (t) => {
        (this.seekable = t.duration && t.duration !== 1 / 0),
          this.updateMetadata(t);
      }),
      this.on("audioparse", (t) => {
        (this.seekable = t.duration && t.duration !== 1 / 0),
          this.updateMetadata(t);
      });
  }
  initMediaSession() {
    const t = this;
    if ("mediaSession" in navigator) {
      (this._hasMediaSession = !0), this.setMediaMetadata(this._audio);
      const e = {
        play: this.play.bind(t),
        pause: this.pause.bind(t),
        seekforward: this.seekBySpan.bind(t),
        seekbackward: () => this.seekBySpan({ forward: !1 }),
        seekto: this.seek.bind(t),
      };
      Object.keys(e).forEach((t) => {
        navigator.mediaSession.setActionHandler(t, e[t]);
      });
    }
  }
  setMediaMetadata(t) {
    const e = t.cover ? [{ src: t.cover, sizes: "150x150" }] : void 0;
    "MediaMetadata" in window &&
      (navigator.mediaSession.metadata = new window.MediaMetadata({
        title: t.title,
        artist: t.artist,
        album: t.album,
        artwork: e,
      }));
  }
  on(t, e) {
    this.events.on(t, e);
  }
  play() {
    if (!this.audio.paused) return;
    const t = this.audio.play();
    return (
      t instanceof Promise
        ? (t.then(() => {
            this.initMediaSession();
          }),
          t.catch((t) => {
            ("NotAllowedError" !== t.name && "NotSupportedError" !== t.name) ||
              this.pause();
          }))
        : this.initMediaSession(),
      t
    );
  }
  pause() {
    this.audio.paused || this.audio.pause();
  }
  toggle() {
    return this.audio.paused ? this.play() : this.pause();
  }
  seek(t) {
    this.seekable &&
      ((t = parseInt(t)),
      isNaN(t) && console.error("Shikwasa: seeking time is NaN"),
      (t = Math.min(t, this.duration)),
      (t = Math.max(t, 0)),
      this.ui.setProgress(t, null, this.duration),
      this._canplay ? (this.audio.currentTime = t) : (this._initSeek = t));
  }
  seekBySpan({ time: t = 10, forward: e = !0 } = {}) {
    const i =
      (this._canplay ? this.audio.currentTime : this._initSeek) +
      t * (e ? 1 : -1);
    this.seek(i);
  }
  update(t) {
    if (!t || !t.src)
      throw new Error("Shikwasa: audio source is not specified");
    {
      (this._audio = a(t)),
        (this.live = this._audio.live),
        (this._canplay = !1),
        (this.audio.src = this._audio.src),
        this.events.trigger("audioupdate", this._audio);
      const e = !(t.title && t.artist && t.cover && t.chapters);
      !this.live &&
        this.options.parser &&
        e &&
        n(Object.assign({}, t), this.options.parser).then((t) => {
          (this._audio = t || this._audio),
            this.events.trigger("audioparse", this._audio);
        });
    }
  }
  updateMetadata(t) {
    (this.audio.title = t.title),
      this.ui.setAudioInfo(t),
      this._hasMediaSession && this.setMediaMetadata(t);
  }
  destroyAudio() {
    this.audio.pause(),
      (this.audio.src = ""),
      this.audio.load(),
      (this.audio = null);
  }
  destroy() {
    this.events.destroy(),
      this.destroyAudio(),
      this.ui.destroy(),
      Object.keys(this.comps).forEach((t) => {
        this.comps[t].destroy &&
          "function" == typeof this.comps[t].destroy &&
          this.comps[t].destroy();
      }),
      (this.comps = null),
      (this.options.container.innerHTML = "");
  }
  renderComponents() {
    b.length &&
      b.forEach((t) => {
        this.comps[t._name] = new t(this);
      });
  }
}
L.use = function (t) {
  b.push(t);
};
let E;
class x {
  constructor(t) {
    (this.ctx = t),
      (this.list = []),
      this.initEvents(),
      (this.current = null),
      (this._currentSrc = null),
      (this._chapterPatched = !1);
  }
  init() {
    this.patchPlayer(),
      (this.ui = new M(this.ctx)),
      this.ctx.on("chapterchange", (t) => {
        const e = t && t.newVal ? t.newVal.id : null;
        this.ui.setChapterActive(e);
      });
  }
  initEvents() {
    this.ctx.on("audioupdate", (t) => {
      this._chapterPatched || (this.init(), (this._chapterPatched = !0)),
        this.updateList(t);
    }),
      this.ctx.on("audioparse", (t) => {
        this.updateList(t);
      }),
      this.ctx.on("timeupdate", this.onTimeupdate.bind(this));
  }
  clearList() {
    (this.ui.chapterList.innerHTML = ""),
      (this.list = []),
      (this.current = null);
  }
  updateList(t) {
    this.list.length && this.clearList(),
      t.chapters.length &&
        ((this.list = this.handleChapters(t)),
        this.ui.renderChapterList(this.ctx.chapters),
        this.clickChapterHandler()),
      this.ui.handleChapterPanel(this.ctx, t);
  }
  handleChapters(t) {
    if (t.chapters && t.chapters.length)
      return t.chapters.map(
        (t, e) => (/^ch\d+$/.test(t.id) || (t.id = `ch${e}`), t)
      );
  }
  patchPlayer() {
    const t = this;
    Object.defineProperties(this.ctx, {
      chapters: { get: () => t.list },
      currentChapter: { get: () => t.current },
    }),
      this.ctx.events.playerEvents.push("chapterchange"),
      (this.ctx.updateChapter = function (t) {
        this.setCurrent(this.list[t]),
          this.ctx.seek(this.current.startTime),
          this.ctx.play();
      }.bind(t));
  }
  setCurrent(t) {
    const e = this.current ? { ...this.current } : null;
    (this.current = t),
      this.ctx.events.trigger("chapterchange", {
        newVal: this.current,
        oldVal: e,
      });
  }
  onTimeupdate(t) {
    if (this._currentSrc !== t.currentTarget.src)
      return void (this._currentSrc = t.currentTarget.src);
    const e = this.searchDirection(this.ctx.currentTime, this.current);
    if (e) {
      let t;
      const i = this.list.indexOf(this.current);
      t =
        -1 === i
          ? this.list
          : 1 === e
          ? this.list.slice(i)
          : this.list.slice(0, i + 1);
      const s = t.find((t) => !this.searchDirection(this.ctx.currentTime, t));
      this.setCurrent(s);
    }
  }
  searchDirection(t, e) {
    return (
      (t = Math.round(t)),
      !e || "object" != typeof e || e.endTime <= t
        ? 1
        : e.startTime > t
        ? -1
        : 0
    );
  }
  clickChapterHandler() {
    Array.from(this.ui.chapterList.children).forEach((t) => {
      t.addEventListener("click", () => {
        if (!this.ctx.seekable) return;
        let e = t.getAttribute("data-id").match(/\d+$/);
        e && this.ctx.updateChapter(+e[0]);
      });
    });
  }
  destroy() {
    this.ui.destroy();
  }
}
class M {
  constructor(t, e) {
    this.initEl(t),
      this.initEvents(t, e),
      this.renderChapterList(t.chapters),
      t.ui.el.append(this.el),
      (this.activeChapterEl = null);
  }
  initEl(t) {
    this.el = r({
      className: "shk-chapter",
      innerHTML:
        '\n  <div class="shk-chapter_main">\n    <ol class="shk-chapter_list"></ol>\n  </div>\n  <button class="shk-btn shk-btn_close" aria-label="close chapter panel" title="close chapter panel">\n    <svg class="shk-icon_close" aria-hidden="true">\n      <use xlink:href="#shk-icon_close" />\n    </svg>\n  </button>\n',
    });
    const e = { title: "view chapters", "aria-label": "view chapters" };
    t.seekable || (e.disabled = ""),
      (this.chapterBtn = r({
        tag: "button",
        className: ["shk-btn", "shk-btn_chapter"],
        attrs: e,
        innerHTML:
          '\n        <svg aria-hidden="true">\n          <use xlink:href="#shk-icon_chapter" />\n        </svg>\n      ',
      })),
      t.ui.seekControls.push(this.chapterBtn),
      t.ui.extraControls.append(this.chapterBtn),
      (this.closeBtn = this.el.querySelector(".shk-btn_close")),
      (this.chapterList = this.el.querySelector(".shk-chapter_list")),
      (this.overflowLayer = this.el.querySelector(".shk-chapter_main"));
  }
  initEvents(t) {
    this.chapterBtn.addEventListener("click", () => {
      o(t.el, "data-show-chapter");
    }),
      t.ui.hideExtraControl(this.chapterBtn),
      this.closeBtn.addEventListener("click", () => {
        t.el.removeAttribute("data-show-chapter");
      }),
      (E = () => {
        if (!this.activeChapterEl) return;
        const t = this.activeChapterEl.querySelector(".shk-chapter_title_wrap"),
          e = this.activeChapterEl.querySelector(".shk-chapter_title");
        s.call(this, t, e);
      }),
      window.addEventListener("resize", E);
  }
  handleChapterPanel(t, e) {
    e.chapters.length
      ? t.el.setAttribute("data-has-chapter", "")
      : t.el.removeAttribute("data-has-chapter"),
      (e.chapters.length && t.seekable) ||
        t.el.removeAttribute("data-show-chapter");
  }
  renderChapterList(t) {
    t.length &&
      t.forEach((t) => {
        const e = this.renderChapterItem(t);
        this.chapterList.append(e);
      });
  }
  renderChapterItem(t) {
    const e = i(t.startTime);
    return r({
      tag: "li",
      className: "shk-chapter_item",
      innerHTML: `\n      <button class="shk-btn shk-chapter_btn" title="seek chapter: ${t.title}" aria-label="seek chapter: ${t.title}">\n        <div class="shk-icon_chapter" aria-hidden="true">\n          <span class="shk-icon_playing"></span>\n          <span class="shk-icon_triangle">\n            <svg>\n              <use xlink:href="#shk-icon_triangle" />\n            </svg>\n          </span>\n        </div>\n        <div class="shk-chapter_duration">${e}</div>\n        <div class="shk-chapter_title_wrap">\n          <div class="shk-chapter_title_inner" data-chapter="${t.title}">\n            <div class="shk-chapter_title">${t.title}</div>\n          </div>\n        </div>\n      </button>\n    `,
      attrs: { "data-id": t.id },
    });
  }
  setChapterActive(t) {
    this.chapterList.querySelectorAll(".shk-chapter_item").forEach((e) => {
      if (e.getAttribute("data-id") === t) {
        e.setAttribute("data-active", ""),
          this.scrollIntoView(e),
          (this.activeChapterEl = e);
        const t = e.querySelector(".shk-chapter_title");
        s(e.querySelector(".shk-chapter_title_wrap"), t);
      } else e.removeAttribute("data-active");
    });
  }
  scrollIntoView(t) {
    if ("hidden" === this.el.style.visibility) return;
    const e = window.getComputedStyle(this.overflowLayer).marginTop,
      i = window.getComputedStyle(this.chapterList).marginTop,
      s = parseInt(e) + parseInt(i),
      a =
        this.overflowLayer.scrollTop + s - t.offsetTop > 0 ||
        t.offsetTop -
          this.overflowLayer.scrollTop -
          this.overflowLayer.offsetHeight >
          0,
      n = this.overflowLayer.scrollTop,
      r = t.offsetTop - n - s,
      o = performance.now();
    a && h(o, o, 0.2, n, r, this.overflowLayer);
  }
  destroy() {
    window.removeEventListener("resize", E);
  }
}
(x._name = "chapter"),
  console.log(
    "%c🍊%c Shikwasa Podcast Player v2.2.1 %c https://shikwasa.js.org",
    "background-color:#00869B40;padding:4px;",
    "background:#00869B80;color:#fff;padding:4px 0",
    "padding: 2px 0;"
  );
export { x as Chapter, L as Player };
export default null;
//# sourceMappingURL=/sm/ea8e39f61a29750427d161fb574423b99c25a548d69bf3b5c4dc3e8829db66d5.map
