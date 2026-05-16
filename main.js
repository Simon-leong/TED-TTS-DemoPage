const SEGMENT_COLORS = [
  { text: "#b42318", bg: "#fff1f0" },
  { text: "#096dd9", bg: "#e6f4ff" },
  { text: "#7a1fa2", bg: "#f9f0ff" },
  { text: "#237804", bg: "#f6ffed" },
  { text: "#ad6800", bg: "#fffbe6" },
  { text: "#c41d7f", bg: "#fff0f6" },
];

const getSegmentColor = (index) => SEGMENT_COLORS[index % SEGMENT_COLORS.length];

const splitSegments = (text, delimiter) =>
  text.split(delimiter).map((s) => s.trim()).filter(Boolean);

/* ── helpers ── */
const el = (tag, cls, attrs = {}) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  Object.entries(attrs).forEach(([k, v]) => (e[k] = v));
  return e;
};

/* single audio player row inside a card */
const makeAudioRow = (label, src, isOurs = false) => {
  const row = el("div", "ex-audio-row" + (isOurs ? " ex-audio-row--ours" : ""));

  const lbl = el("div", "ex-row-label");
  lbl.textContent = label;
  row.appendChild(lbl);

  const audioWrap = el("div", "ex-row-player");
  const audio = el("audio", null, { controls: true, preload: "none", src });
  audioWrap.appendChild(audio);
  row.appendChild(audioWrap);

  return row;
};

/* reference row — potentially multiple audios side by side with emotion colour tags */
const makeRefRow = (referenceAudio, referenceText, emotionSequence) => {
  const row = el("div", "ex-audio-row");

  const lbl = el("div", "ex-row-label");
  lbl.textContent = referenceAudio ? "Reference" : "Text prompt";
  row.appendChild(lbl);

  const wrap = el("div", "ex-row-player ex-row-player--multi");

  if (referenceAudio) {
    const emotions = emotionSequence
      ? splitSegments(emotionSequence, "->")
      : [];
    Object.entries(referenceAudio).forEach(([key, src], i) => {
      const unit = el("div", "ex-ref-unit");
      if (emotions[i]) {
        const tag = el("span", "ex-ref-tag");
        tag.textContent = emotions[i];
        tag.style.color = getSegmentColor(i).text;
        unit.appendChild(tag);
      }
      const audio = el("audio", null, { controls: true, preload: "none", src });
      unit.appendChild(audio);
      wrap.appendChild(unit);
    });
  } else if (referenceText) {
    Object.entries(referenceText).forEach(([key, text]) => {
      const unit = el("div", "ex-ref-unit ex-ref-unit--text");
      unit.textContent = `"${text}"`;
      wrap.appendChild(unit);
    });
  }

  row.appendChild(wrap);
  return row;
};

/* top emotion pill bar */
const makeEmotionBar = (emotionSequence) => {
  const bar = el("div", "ex-emo-bar");
  if (!emotionSequence) return bar;
  const emotions = splitSegments(emotionSequence, "->");
  emotions.forEach((emo, i) => {
    const pill = el("span", "ex-emo-pill");
    pill.textContent = emo;
    const c = getSegmentColor(i);
    pill.style.color = c.text;
    pill.style.background = c.bg;
    bar.appendChild(pill);
    if (i < emotions.length - 1) {
      const arrow = el("span", "ex-emo-arrow");
      arrow.textContent = "→";
      bar.appendChild(arrow);
    }
  });
  return bar;
};

/* coloured segmented text */
const makeSegmentedText = (text) => {
  const wrap = el("div", "ex-seg-text");
  if (!text) return wrap;
  const segments = splitSegments(text, "|");
  segments.forEach((seg, i) => {
    const span = el("span", "ex-seg");
    span.textContent = seg;
    span.style.color = getSegmentColor(i).text;
    wrap.appendChild(span);
    if (i < segments.length - 1) {
      const div = el("span", "ex-seg-div");
      div.textContent = " / ";
      wrap.appendChild(div);
    }
  });
  return wrap;
};

/* duration text with ×scale badges */
const makeDurationText = (text) => {
  const wrap = el("div", "ex-seg-text");
  if (!text) { wrap.textContent = "-"; return wrap; }
  const regex = /\[([^\]]+)\]/g;
  let last = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last)
      wrap.appendChild(document.createTextNode(text.slice(last, match.index)));
    const content = match[1].trim();
    const mMatch = content.match(/\(([^)]+)\)/);
    const cleanText = content.replace(/\s*\([^)]*\)\s*/, " ").trim();
    const hl = el("span", "dur-hl");
    hl.appendChild(document.createTextNode(cleanText || content));
    if (mMatch) {
      const badge = el("span", "dur-badge");
      const f = mMatch[1].match(/[\d.]+/);
      badge.textContent = `×${f ? f[0] : mMatch[1]}`;
      hl.appendChild(badge);
    }
    wrap.appendChild(hl);
    last = regex.lastIndex;
  }
  if (last < text.length)
    wrap.appendChild(document.createTextNode(text.slice(last)));
  return wrap;
};

/* build one sample card (emotion) */
const buildEmotionCard = (item, mode) => {
  const card = el("div", "ex-card");

  /* emotion pills */
  if (item.emotion_sequence) {
    card.appendChild(makeEmotionBar(item.emotion_sequence));
  }

  /* text */
  if (item.text) {
    const textWrap = el("div", "ex-text-row");
    textWrap.appendChild(makeSegmentedText(item.text));
    card.appendChild(textWrap);
  }

  /* reference / text prompt row */
  card.appendChild(makeRefRow(item.reference_audio, item.reference_text, item.emotion_sequence));

  /* ours */
  if (item.output_audio) {
    card.appendChild(makeAudioRow("Ours", item.output_audio, true));
  }

  /* baselines */
  if (item.baseline_audio) {
    Object.entries(item.baseline_audio).forEach(([label, src]) => {
      card.appendChild(makeAudioRow(label, src, false));
    });
  }

  return card;
};

/* build one sample card (duration) */
const buildDurationCard = (item) => {
  const card = el("div", "ex-card");

  /* text with duration badges */
  if (item.text) {
    const textWrap = el("div", "ex-text-row");
    textWrap.appendChild(makeDurationText(item.text));
    card.appendChild(textWrap);
  }

  /* timbre reference */
  if (item.reference_audio) {
    card.appendChild(makeAudioRow("Timbre Ref", item.reference_audio));
  }

  /* original */
  if (item.original_audio) {
    card.appendChild(makeAudioRow("Original", item.original_audio));
  }

  /* ours */
  if (item.output_audio) {
    card.appendChild(makeAudioRow("Ours", item.output_audio, true));
  }

  /* baselines */
  if (item.baseline_audio) {
    Object.entries(item.baseline_audio).forEach(([label, src]) => {
      card.appendChild(makeAudioRow(label, src, false));
    });
  }

  return card;
};

/* render emotion section into a container using 2×2 grid */
const renderEmotionSection = (data, containerId) => {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  if (!data.length) {
    const msg = el("p", "muted");
    msg.textContent = "No examples found.";
    container.appendChild(msg);
    return;
  }
  const grid = el("div", "samples-grid");
  data.forEach((item) => grid.appendChild(buildEmotionCard(item, item.mode)));
  container.appendChild(grid);
};

/* render duration section */
const renderDurationSection = (data) => {
  const container = document.getElementById("duration-table");
  container.innerHTML = "";
  if (!data.length) {
    const msg = el("p", "muted");
    msg.textContent = "No examples found.";
    container.appendChild(msg);
    return;
  }
  const grid = el("div", "samples-grid");
  data.forEach((item) => grid.appendChild(buildDurationCard(item)));
  container.appendChild(grid);
};

const loadExamples = async () => {
  try {
    const response = await fetch("examples/data.json");
    if (!response.ok) throw new Error(`Failed to load examples: ${response.status}`);
    const data = await response.json();

    const audioData = (data.emotion || []).filter((i) => i.mode === "audio");
    const textData  = (data.emotion || []).filter((i) => i.mode === "text");

    renderEmotionSection(audioData, "emotion-table-audio");
    renderEmotionSection(textData,  "emotion-table-text");
    renderDurationSection(data.duration || []);
  } catch (error) {
    ["emotion-table-audio", "emotion-table-text", "duration-table"].forEach((id) => {
      const msg = el("p", "muted");
      msg.textContent = `Unable to load examples/data.json: ${error.message}`;
      document.getElementById(id).appendChild(msg);
    });
  }
};

loadExamples();