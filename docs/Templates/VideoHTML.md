<%*
// ─── Templater: Video HTML block ─────────────────────────────────────────────
// Usage:
//   1. Drag a video file into Obsidian — it inserts a link on the current line,
//      e.g.  ![](attachments/myvideo.mp4)
//   2. Keep the cursor on that line and trigger this template (via hotkey).
//   3. The link is replaced with the proper <video> HTML block.
//
// If no video link is found on the current line, a prompt asks for the filename.
// ─────────────────────────────────────────────────────────────────────────────

const editor = app.workspace.activeLeaf.view.editor;
const lineNum = editor.getCursor().line;
const lineText = editor.getLine(lineNum);

// Patterns to detect a video link inserted by Obsidian on drag-drop.
// Covers both wikilink (![[file.mp4]]) and markdown link (![](attachments/file.mp4)).
const patterns = [
  /!\[\[([^\]]+\.mp4)\]\]/i,              // ![[video.mp4]]
  /\[\[([^\]]+\.mp4)\]\]/i,               // [[video.mp4]]
  /!?\[.*?\]\((?:attachments\/)?([^)]+\.mp4)\)/i, // ![](attachments/video.mp4)
];

let filename = null;
for (const pattern of patterns) {
  const match = lineText.match(pattern);
  if (match) {
    filename = match[1];
    break;
  }
}

if (!filename) {
  filename = await tp.system.prompt("Nome do ficheiro de vídeo (ex: myvideo.mp4)");
}

if (!filename) {
  tR = "";
  return;
}

// Strip any leading path — keep only the basename
const basename = filename.split("/").pop().split("\\").pop();

const html = `<video controls width="100%">
    <source src="../attachments/${basename}" type="video/mp4">
    O teu browser não suporta o elemento de vídeo.
</video>`;

// Replace the current line with the HTML block; insert nothing from tR
editor.setLine(lineNum, html);
tR = "";
%>
