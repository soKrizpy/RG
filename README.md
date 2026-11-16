# Ruang Karya — Scratch Lesson Engine

Static, modular lesson player for Scratch classes. Built with HTML, CSS, Vanilla JavaScript, and JSON content; deployable to Vercel as a static site.

## Features
- Session catalog and direct lesson links.
- Modular lesson player with section navigation and progress.
- Content blocks: text, callout, terms, examples, steps, checklists, worksheets, pitch preview, quiz, reflection, and illustrations.
- Worksheet answers, checklist state, quiz answers, and progress are stored locally in the student's browser (localStorage). They are not sent to the teacher and do not sync across devices.
- Responsive desktop/mobile layout and original SVG illustrations.

## Run locally
Use VS Code Live Server or another static web server. Do not open HTML through `file://`; the browser needs HTTP to fetch JSON.

## Add a session
1. Add `data/lessons/sesi-21.json` following `sesi-20.json`.
2. Add its metadata to `sessions` in `data/curriculum.json`.
3. Compose sections with supported blocks: `text`, `image`, `callout`, `terms`, `example`, `steps`, `checklist`, `worksheet`, `pitch-preview`, `quiz`, `reflection`.
4. Publish. Direct URL: `/lesson.html?id=sesi-21`.

## Architecture
No login, database, backend, or remote grade collection. Student work is saved only in the local browser. Final project submission follows teacher instructions (LMS/class folder).
