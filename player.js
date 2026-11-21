export class Player {
  constructor(opts = {}) {
    const { container, audio = {}, themeColor = "#954747" } = opts;
    this.containerEl = typeof container === "function" ? container() : document.querySelector(container);
    this.audio = new Audio(audio.src || "");
    this.audio.preload = "metadata";
    this._title = audio.title || "Untitled";
    this._artist = audio.artist || "";
    this._theme = themeColor;
    this._speeds = [1, 1.25, 1.5, 2, 0.75];
    this._speedIdx = 0;
    this._seeking = false;

    this._render();
    this._bind();
  }

  get currentTime() {
    return this.audio ? this.audio.currentTime : 0;
  }

  get duration() {
    return this.audio && isFinite(this.audio.duration) ? this.audio.duration : 0;
  }

  get paused() {
    return this.audio ? this.audio.paused : true;
  }

  play() {
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  toggle() {
    return this.audio.paused ? this.play() : this.pause();
  }

  seek(t) {
    const val = Math.max(0, Number(t) || 0);
    if (this.audio.readyState >= 1) {
      this.audio.currentTime = val;
    } else {
      const onMeta = () => {
        this.audio.currentTime = val;
        this.audio.removeEventListener("loadedmetadata", onMeta);
      };
      this.audio.addEventListener("loadedmetadata", onMeta);
    }
  }

  on(event, fn) {
    this.audio.addEventListener(event, fn);
  }

  setMeta({ title, artist } = {}) {
    if (title !== undefined) {
      this._title = title;
      if (this._titleEl) this._titleEl.textContent = title || "Untitled";
    }
    if (artist !== undefined) {
      this._artist = artist;
      if (this._artistEl) this._artistEl.textContent = artist || "";
    }
  }

  _fmt(sec) {
    if (!isFinite(sec) || sec < 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  _render() {
    if (!this.containerEl) return;
    this.containerEl.innerHTML = `
      <div class="em-player" style="--em-theme:${this._theme}">
        <style>
          .em-player{font-family:system-ui,-apple-system,sans-serif;color:#222;display:flex;flex-direction:column;gap:6px;width:100%}
          .em-seek{width:100%;accent-color:var(--em-theme);cursor:pointer;margin:0;height:6px}
          .em-row{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
          .em-meta{min-width:0;flex:1 1 120px}
          .em-artist{font-size:.75rem;color:#555;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .em-title{font-size:.95rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .em-controls{display:flex;align-items:center;gap:6px}
          .em-btn{background:transparent;border:1px solid #d4d4d8;color:#333;border-radius:999px;min-width:34px;height:34px;padding:0 8px;cursor:pointer;font-size:.78rem;font-weight:700;display:inline-flex;align-items:center;justify-content:center}
          .em-btn:hover{background:#f4f4f5}
          .em-play{background:var(--em-theme);border-color:var(--em-theme);color:#fff;width:38px;height:38px;font-size:.95rem}
          .em-play:hover{opacity:.9;background:var(--em-theme)}
          .em-time{font-size:.78rem;font-family:ui-monospace,monospace;color:#555;white-space:nowrap}
        </style>
        <input class="em-seek" type="range" min="0" max="100" step="0.1" value="0" aria-label="Seek audio position">
        <div class="em-row">
          <div class="em-meta">
            <div class="em-artist"></div>
            <div class="em-title"></div>
          </div>
          <div class="em-controls">
            <button type="button" class="em-btn em-speed" aria-label="Playback speed">1.0x</button>
            <button type="button" class="em-btn em-rw" aria-label="Rewind 10 seconds">-10s</button>
            <button type="button" class="em-btn em-play" aria-label="Play or pause">▶</button>
            <button type="button" class="em-btn em-fw" aria-label="Forward 10 seconds">+10s</button>
          </div>
          <div class="em-time">00:00 / 00:00</div>
        </div>
      </div>
    `;
    this._seekEl = this.containerEl.querySelector(".em-seek");
    this._artistEl = this.containerEl.querySelector(".em-artist");
    this._titleEl = this.containerEl.querySelector(".em-title");
    this._playBtn = this.containerEl.querySelector(".em-play");
    this._speedBtn = this.containerEl.querySelector(".em-speed");
    this._rwBtn = this.containerEl.querySelector(".em-rw");
    this._fwBtn = this.containerEl.querySelector(".em-fw");
    this._timeEl = this.containerEl.querySelector(".em-time");
    this.setMeta({ title: this._title, artist: this._artist });
  }

  _bind() {
    if (!this.containerEl) return;
    const syncTime = () => {
      const dur = this.duration;
      const cur = this.currentTime;
      if (!this._seeking && dur > 0) {
        this._seekEl.max = dur;
        this._seekEl.value = cur;
      }
      this._timeEl.textContent = `${this._fmt(cur)} / ${this._fmt(dur)}`;
    };
    const syncPlay = () => {
      this._playBtn.textContent = this.paused ? "▶" : "❚❚";
    };

    this.audio.addEventListener("loadedmetadata", syncTime);
    this.audio.addEventListener("timeupdate", syncTime);
    this.audio.addEventListener("play", syncPlay);
    this.audio.addEventListener("pause", syncPlay);
    this.audio.addEventListener("ended", syncPlay);

    this._playBtn.onclick = () => this.toggle();
    this._rwBtn.onclick = () => this.seek(this.currentTime - 10);
    this._fwBtn.onclick = () => this.seek(this.currentTime + 10);
    this._speedBtn.onclick = () => {
      this._speedIdx = (this._speedIdx + 1) % this._speeds.length;
      const rate = this._speeds[this._speedIdx];
      this.audio.playbackRate = rate;
      this._speedBtn.textContent = `${rate}x`;
    };
    this._seekEl.oninput = () => {
      this._seeking = true;
      this._timeEl.textContent = `${this._fmt(parseFloat(this._seekEl.value))} / ${this._fmt(this.duration)}`;
    };
    this._seekEl.onchange = () => {
      this._seeking = false;
      this.seek(parseFloat(this._seekEl.value));
    };
  }
}
