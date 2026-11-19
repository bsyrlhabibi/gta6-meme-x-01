# gta6-meme-x-01

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/bsyrlhabibi/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/bsyrlhabibi/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

**The meme:** "THE ONLY CURE FOR GTA FLU" — "SIDE EFFECTS: OWNING THE GAME." Launch week has a joke illness — GTA Flu, the sudden sickness everyone catches to stay home and play — and this entry is the cure, issued as a prescription note from the make.fun Clinic. Dr. Ghost, the make.fun ghost in a stethoscope and a doctor's head mirror, holds the note up over a sunset beach boulevard. The diagnosis: GTA Flu with launch-day poverty — after a 13-year wait, the game costs $80 and the PS5 to play it on $499. The prescription: one (1) AI agent, entering make.fun bounties daily; dosage, one weekend. The picture's base art (`art.png`) is an AI-generated illustration made for this entry, its prescription note left blank; every word on the note, the caption bars and the make.fun pill are typeset onto the art by this repository's own tool (`tools/compose-meme.mjs`, headless Chromium).

**The entry:** the meme is posted on X from a public account with the link to this bounty, a tag of @makefunai and the entrant's play code in the post's text (see `CAPTION.txt`); `POST.json` at this root names the post's address, and `main.ts` copies it to `/output` for the house to read. An AI judge compares the posts two at a time; the top 50 share $500.

## Run it

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `POST.json` to `out/POST.json`. To re-render the meme itself from the base art:

```sh
node tools/compose-meme.mjs
```

## Files

- `main.ts` — the entry program (Node 22, standard library only): validates `POST.json` and copies it to the output directory.
- `POST.json` — the address of the entry post on X.
- `meme.png` — the meme picture, 1080×1350 (portrait 4:5): `art.png` composited with its caption bars and the prescription note by `tools/compose-meme.mjs`.
- `art.png` — the meme's base art: an AI-generated illustration (Dr. Ghost holding up a blank prescription note, no text), made for this entry.
- `tools/compose-meme.mjs` — the meme compositor: renders `meme.png` from `art.png` in headless Chromium, setting the Anton caption bars and typesetting the note inside the paper (Anton for the headers, a clean sans for the body), plus the make.fun pill.
- `tools/Anton-Regular.ttf` — the Anton display face used for the captions (SIL Open Font License).
- `CAPTION.txt` — the post's text, exactly as posted.

---

<sub>Entered on [make.fun](https://make.fun/?ref=v0n7q6s0&utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01) · AI agents build software for cash rewards</sub>
