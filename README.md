<div align="center">

<h1 align="center">
  🎙️ &nbsp;<strong>𝗧𝗘𝗗-𝗧𝗧𝗦</strong>&nbsp; 🎙️
</h1>

### <em>Static companion site for "Training-Free Intra-Utterance Emotion and Duration Control for TTS"</em>

<p>
  <a href="https://simon-leong.github.io/TED-TTS-DemoPage/"><img src="https://img.shields.io/badge/Live-Demo-purple?style=flat-square" alt="Live Demo"></a>
  <a href="https://github.com/Simon-leong/TED-TTS"><img src="https://img.shields.io/badge/Main_Repo-TED--TTS-black?style=flat-square&logo=github" alt="Main Repo"></a>
  <a href="https://arxiv.org/abs/2601.03170"><img src="https://img.shields.io/badge/arXiv-2601.03170-b31b1b?style=flat-square&logo=arxiv&logoColor=white" alt="arXiv"></a>
  <a href="https://img.shields.io/badge/ACL-2026%20Main-blue?style=flat-square"><img src="https://img.shields.io/badge/ACL-2026%20Main-blue?style=flat-square" alt="ACL 2026"></a>
</p>

</div>

---

## About

This repository hosts the **static demo page** for TED-TTS, served via GitHub Pages at <https://simon-leong.github.io/TED-TTS-DemoPage/>. It showcases the paper's abstract, method overview, and a curated set of audio samples that illustrate intra-utterance emotion transitions and segment-level duration control.

This repo contains **only the website assets** — no model code, no inference, no datasets. For the implementation, please refer to the main repository: [Simon-leong/TED-TTS](https://github.com/Simon-leong/TED-TTS).

---

## Contents

```
TED-TTS-DemoPage/
├── index.html       # page markup
├── styles.css       # page styling
├── main.js          # audio loading and tab switching
└── README.md
```

Audio samples and figures referenced by the page are hosted alongside these files in the deployed branch.

---

## Local Preview

The page is fully static — any local HTTP server works:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

---

## Citation

If you find TED-TTS useful, please cite our paper:

```bibtex
@misc{liang2026segmentawareconditioningtrainingfreeintrautterance,
      title={Segment-Aware Conditioning for Training-Free Intra-Utterance Emotion and Duration Control in Text-to-Speech},
      author={Qifan Liang and Yuansen Liu and Ruixin Wei and Nan Lu and Junchuan Zhao and Ye Wang},
      year={2026},
      eprint={2601.03170},
      archivePrefix={arXiv},
      primaryClass={cs.SD},
      url={https://arxiv.org/abs/2601.03170},
}
```

---

## License

Page source (HTML / CSS / JS) is released under Apache-2.0, consistent with the main TED-TTS repository.
