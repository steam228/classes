---
title: "Aula 4 — Código Criativo IV"
icon: lucide/book-open
tags: aula
status: in-progress
hero_image: ../../attachments/DSC05966.jpg
hero_title: "Aula 4"
hero_subtitle: "Design de Inovação"
hero_height: 60vh
hero_overlay: 0.2
hero_align: center
hero_caption: ""
---

# Aula 4 — Código Criativo IV

## Data

**16 de outubro de 2026** (6ª feira)

## Sumário

- AI como ferramenta de código criativo: LLMs, Copilot e assistentes de código
- Introdução a bibliotecas em p5.js e estrutura de projetos mais complexos
- Framework "Ingredientes" — fontes de dados, referências e outputs para artefactos digitais
- Demos ao vivo com participação dos alunos (3 turmas)

---

## Notas da Aula

### AI e Código Criativo

A inteligência artificial — em particular os modelos de linguagem (LLMs) como o ChatGPT, Claude ou Gemini — pode ser uma ferramenta poderosa para expandir a nossa capacidade de nos expressarmos através do código. Não se trata de substituir a aprendizagem, mas de amplificar o que conseguimos fazer com o conhecimento que já temos.

#### Como usar AI no processo criativo

- **Geração de código a partir de descrições** — descrever em linguagem natural o que queremos e iterar sobre o resultado
- **Exploração de variações** — pedir ao modelo para gerar variações de um sketch existente
- **Debugging e compreensão** — colar código que não funciona e pedir explicação ou correção
- **Aprendizagem acelerada** — perguntar "como faço X em p5.js?" e obter exemplos funcionais

#### Ferramentas

- **ChatGPT / Claude / Gemini** — conversação com modelos de linguagem para gerar e iterar código
- **GitHub Copilot** — assistente de código integrado no editor (VSCode)
- **Cursor / Windsurf** — editores de código com AI integrada

#### Postura crítica

A AI é um acelerador, não um autor. O valor criativo está nas decisões — que parâmetros explorar, que regras definir, que estética perseguir. O código gerado por AI deve ser compreendido, testado e apropriado.

---

### Bibliotecas em p5.js

Uma **biblioteca** é um conjunto de funcionalidades adicionais que alguém escreveu e que podemos reutilizar nos nossos projetos. Em p5.js, as bibliotecas estendem as capacidades base do framework.

#### Como adicionar uma biblioteca

No `index.html`, adicionar a referência antes do nosso `sketch.js`:

```html
<script src="https://cdn.jsdelivr.net/npm/p5@1/lib/p5.min.js"></script>
<script src="https://unpkg.com/p5.pattern/dist/p5.pattern.js"></script>
<script src="sketch.js"></script>
```

#### Exemplos de bibliotecas úteis

- **[p5.sound](https://p5js.org/reference/p5.sound/)** — áudio, análise de frequência, microfone
- **[p5.pattern](https://github.com/SYM380/p5.pattern)** — padrões geométricos e texturas
- **[ml5.js](https://ml5js.org/)** — machine learning acessível (deteção de pose, classificação de imagens)
- **[p5.SVG](https://github.com/zenozeng/p5.js-svg)** — exportar para SVG (útil para corte laser e vinil)

---

### Estrutura de projetos mais complexos

Até agora trabalhámos com um único ficheiro `sketch.js`. À medida que os projetos crescem, convém organizar o código.

#### Múltiplos ficheiros

Separar responsabilidades em ficheiros diferentes:

```
projeto/
├── index.html
├── sketch.js        ← setup() e draw()
├── particula.js     ← classe Particula
└── utils.js         ← funções auxiliares
```

No `index.html`, carregar todos os ficheiros:

```html
<script src="particula.js"></script>
<script src="utils.js"></script>
<script src="sketch.js"></script>
```

#### Classes e objetos

As **classes** permitem criar "moldes" para entidades que partilham comportamentos:

```js
class Particula {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.tamanho = random(5, 20);
  }

  mover() {
    this.x += this.vel.x;
    this.y += this.vel.y;
  }

  desenhar() {
    noStroke();
    fill(255, 150);
    circle(this.x, this.y, this.tamanho);
  }
}
```

Utilização no `sketch.js`:

```js
let particulas = [];

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 100; i++) {
    particulas.push(new Particula(random(width), random(height)));
  }
}

function draw() {
  background(0, 25);
  for (let p of particulas) {
    p.mover();
    p.desenhar();
  }
}
```

---

### Ingredientes

A aula foi estruturada em torno de uma pergunta: **que ingredientes precisamos para construir um artefacto digital em código criativo?** Organizámos esses ingredientes em três categorias — inputs, referências e outputs — e em cada turma explorámos combinações diferentes.

### Inputs — fontes de dados

| #   | Fonte                          | Exemplos                                                                                                                        |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Dados públicos**             | Dados meteorológicos (históricos ou em tempo real)                                                                              |
| 2   | **Interação com o computador** | Rato, teclado, acelerómetro e sensores dos dispositivos móveis                                                                  |
| 3   | **Imagens estáticas**          | qualquer imagem: (explo de interesse particular de aluna: trabalhar e animar Imagens médicas (ressonâncias, TACs), fotografias) |
| 4   | **Vídeo**                      | Capturado previamente ou em tempo real                                                                                          |
| 5   | **Som**                        | Gravado ou em tempo real (exeplo em aula: https://hacktoimprove.com/scully2midi/)                                               |
| 6   | **Sensores**                   | Dependentes do próximo bloco (Computação Física)                                                                                |
| 7   | **Tempo**                      | O relógio como variável generativa                                                                                              |
| 8   | **`random()` e progressões**   | Funções matemáticas, simulações biológicas — ver [Nature of Code](https://natureofcode.com/)                                    |
| 9   | **Texto(s)**                   | Conteúdo escrito como matéria-prima                                                                                             |

### Referências / Expressões

Formas de expressão a explorar — e para as quais procurar código:

1. Transformação de imagem em tempo real para mapeamento ASCII — [asciiart.eu](https://www.asciiart.eu) (retro, arqueologia informática)
2. Bot com emulação de voz humana
3. Animação 3D / sólidos 3D generativos
4. Relação som ↔ imagem
5. Mensagens encriptadas (criptografia visual)
6. Tratamento de imagem em tempo real — espaço negativo, captura de posições, sobreposição e registo ao longo do tempo

### Output — a fórmula

> **Conceito + Input + Expressão = Artefacto Digital**

O resultado pode ser uma web app, uma instalação, uma visualização de dados, uma experiência interativa — o formato é aberto. O importante é que exista uma intenção clara na combinação dos ingredientes.

---

## Demos — resultados por turma

Em cada turma, discutimos coletivamente que inputs e referências usar, e construímos um sketch ao vivo.

### Turma J — Acelerómetro + visualização

**Input:** acelerómetro do telemóvel (com fallback para rato no desktop)
**Expressão:** três elipses sobrepostas que respondem à inclinação do dispositivo

```js
function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#121358");
  textSize(20);
  noStroke();

  // iOS 13+ só disponibiliza dados de movimento após toque (e apenas via HTTPS)
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    const btn = createButton("Tap to enable motion");
    btn.position(width / 2 - 100, height / 2 - 25);
    btn.size(200, 50);
    btn.style("font-size", "18px");
    btn.elt.addEventListener("click", () => {
      DeviceMotionEvent.requestPermission()
        .then((state) => {
          if (state === "granted") btn.remove();
          else btn.html("Motion denied - reload to retry");
        })
        .catch(console.error);
    });
  }
}

function draw() {
  background("#121358");
  let ax = accelerationX,
    ay = accelerationY,
    az = accelerationZ;
  if (ax === 0 && ay === 0 && az === 0) {
    ax = map(mouseX, 0, width, 0, 300);
    ay = map(mouseY, 0, height, 0, 300);
    az = map(mouseX + mouseY, 0, width + height, 0, 300);
  }

  fill("#232F7280");
  ellipse(width / 2, height / 2, ax * 1.7, ay * 1.7);
  fill("#2F578A80");
  ellipse(width / 2, height / 2, ay * 1.7, az * 1.7);
  fill("#36ADA380");
  ellipse(width / 2, height / 2, az * 1.7, ax * 1.7);
  fill(255);
  text("Acceleration X: " + ax, 10, 30);
  text("Acceleration Y: " + ay, 10, 60);
  text("Acceleration Z: " + az, 10, 90);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
```

Paleta de cores utilizada: `#121358` · `#232F72` · `#2F578A` · `#36ADA3`

---

### Turma L — Pose detection + grelha de imagens

**Input:** imagens da Openverse (API pública) + deteção de pose com ml5.js (MoveNet)
**Expressão:** grelha de fotografias "holding Pisa tower" com stickmen sobrepostos

O processo começou com a ideia de buscar imagens de uma pesquisa pública e aplicar-lhes deteção de pose — transformando fotografias de turistas numa composição generativa de figuras articuladas.

Para este sketch, o `index.html` precisa de carregar P5.js, ml5.js e p5.sound:

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ml5@1.4.0/dist/ml5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/p5.sound@0.4.1/dist/p5.sound.min.js"></script>
```

```js
const QUERY = "holding pisa tower";
const ROWS = 6;
const RATIO = 3 / 4;
const CONF = 0.1;

const BONES = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];

let imgs = [];
let poses = [];
let cols = 0;
let cellW = 0;
let cellH = 0;
let loaded = false;
let detected = 0;
let queue = Promise.resolve();

async function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  computeGrid();

  const needed = ROWS * cols;
  const modelP = loadPoseModel();

  const addImage = (img) => {
    if (imgs.length >= needed) return;
    const i = imgs.length;
    imgs.push(img);
    poses.push([]);
    redraw();
    queue = queue.then(async () => {
      poses[i] = await detectPoses(await modelP, img);
      detected++;
      redraw();
    });
  };
  const pages = Array.from(
    { length: min(7, ceil(needed / 20) + 1) },
    (_, n) => n + 1
  );
  await Promise.all(pages.map((page) => loadPage(QUERY, page, addImage)));
  loaded = true;
  redraw();
}

function loadPoseModel() {
  return new Promise((resolve) => {
    const m = ml5.bodyPose(
      "MoveNet",
      {
        modelType: "MULTIPOSE_LIGHTNING",
        enableSmoothing: false,
        minPoseScore: 0.2,
      },
      () => resolve(m)
    );
  });
}

function detectPoses(model, img) {
  return new Promise((resolve) => model.detect(img, resolve));
}

function computeGrid() {
  cellH = windowHeight / ROWS;
  cols = max(1, round(windowWidth / (cellH * RATIO)));
  cellW = windowWidth / cols;
}

async function loadPage(query, page, onImage) {
  const url =
    "https://api.openverse.org/v1/images/?q=" +
    encodeURIComponent(query) +
    "&aspect_ratio=tall&page_size=20&page=" +
    page;
  let results = [];
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    results = (await res.json()).results;
  } catch (e) {
    console.error(e);
    return;
  }
  await Promise.allSettled(
    results.map((r) => loadImage(r.thumbnail || r.url).then(onImage))
  );
}

function draw() {
  background(0);
  const total = ROWS * cols;
  if (imgs.length === 0) {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    text("loading...", width / 2, height / 2);
    return;
  }
  for (let i = 0; i < total; i++) {
    if (!loaded && i >= imgs.length) break;
    const k = i % imgs.length;
    const img = imgs[k];
    const x = floor(i / ROWS) * cellW;
    const y = (i % ROWS) * cellH;
    for (const person of poses[k])
      drawStickman(person, img, x, y, cellW, cellH);
  }
  if (detected < imgs.length || !loaded) {
    noStroke();
    fill(120);
    textAlign(LEFT, BOTTOM);
    textSize(12);
    text(
      `photos ${imgs.length}/${total} · analysed ${detected}`,
      8,
      height - 6
    );
  }
}

function toCell(kp, img, x, y, w, h) {
  const s = max(w / img.width, h / img.height);
  const sx = (img.width - w / s) / 2;
  const sy = (img.height - h / s) / 2;
  return createVector(x + (kp.x - sx) * s, y + (kp.y - sy) * s);
}

function drawStickman(person, img, x, y, w, h) {
  const pts = {};
  for (const kp of person.keypoints) {
    if (kp.confidence >= CONF) pts[kp.name] = toCell(kp, img, x, y, w, h);
  }
  stroke(255);
  strokeWeight(max(2, w * 0.02));
  strokeCap(ROUND);
  noFill();
  for (const [a, b] of BONES) {
    if (pts[a] && pts[b]) line(pts[a].x, pts[a].y, pts[b].x, pts[b].y);
  }
  const ls = pts.left_shoulder,
    rs = pts.right_shoulder;
  const lh = pts.left_hip,
    rh = pts.right_hip;
  let neck = null;
  if (ls && rs) neck = p5.Vector.lerp(ls, rs, 0.5);
  if (neck && lh && rh) {
    const pelvis = p5.Vector.lerp(lh, rh, 0.5);
    line(neck.x, neck.y, pelvis.x, pelvis.y);
  }
  const nose = pts.nose;
  const eyes =
    pts.left_eye && pts.right_eye
      ? p5.Vector.lerp(pts.left_eye, pts.right_eye, 0.5)
      : null;
  const center = nose || eyes;
  if (center) {
    let r;
    if (pts.left_ear && pts.right_ear)
      r = pts.left_ear.dist(pts.right_ear) * 0.6;
    else if (pts.left_eye && pts.right_eye)
      r = pts.left_eye.dist(pts.right_eye) * 1.5;
    else if (ls && rs) r = ls.dist(rs) * 0.3;
    else r = w * 0.05;
    circle(center.x, center.y, r * 2);
    if (neck) line(center.x, center.y + r, neck.x, neck.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeGrid();
  redraw();
}
```

---

### Turma M — Som ↔ Imagem

**Input:** som (gravado ou em tempo real)
**Expressão:** relação som ↔ imagem — análise e síntese de áudio

Referência principal explorada em aula: [Synthesizing & Analyzing Sound — Creative Coding](https://creative-coding.decontextualize.com/synthesizing-analyzing-sound/)

---

### Resultados publicados

Os sketches construídos ao vivo estão publicados:

- [Demo Turma J — Acelerómetro](https://hacktoimprove.com/CodCriativoAulaF001)
- [Demo Turma L — Pose Detection](https://hacktoimprove.com/CodCriativoAulaF002)
- [Demo Turma M — Som](https://hacktoimprove.com/CodCriativoAulaF003)

---

## Trabalho Final — Artefacto Digital

### Enunciado

Criar um **artefacto digital interativo** em p5.js, aplicando o framework dos **Ingredientes** explorado nesta aula: escolher um ou mais **inputs** (fontes de dados), cruzá-los com **referências/expressões** visuais ou sonoras, e formular um **conceito** que resulte num artefacto digital com potencial de aplicação no projeto de Design de Produto e Interação I ((com)FORMA).

!!! info "Prazo e ferramenta"
    **Entrega via Moodle até à Aula 7 (6 de novembro).**

    Trabalha em **p5.js no VSCode**, a partir do template base (ver [Configuração Base P5JS](../../Recursos/CodigoCriativocomP5JS.md)).

#### Ingredientes

Seguir a lógica dos ingredientes trabalhada em aula:

1. **Input** — escolher pelo menos uma fonte de dados (ver [tabela de inputs](#inputs--fontes-de-dados)): acelerómetro, som, imagem, vídeo, dados públicos, tempo, `random()`, texto...
2. **Referência / Expressão** — definir a forma de expressão: mapeamento ASCII, relação som ↔ imagem, visualização 3D, deteção de pose, animação generativa...
3. **Output** — formular o conceito: **Input + Expressão = Artefacto Digital** — web app, instalação, visualização, experiência interativa...

As demos construídas em aula podem servir de ponto de partida ou inspiração:

- Turma J — acelerómetro → elipses sobrepostas
- Turma L — imagens Openverse + pose detection → grelha de stickmen
- Turma M — som → análise e síntese de áudio

#### Uso de LLMs

É permitido o recurso a LLMs (ChatGPT, Claude, Copilot, etc.) como ferramenta de aceleração, desde que:

- O processo seja **transparente** — documentar no `readme.md` que partes foram geradas ou assistidas por AI
- O processo seja **acompanhado** — o código gerado deve ser compreendido, testado e iterado (não basta copiar e colar)
- O resultado fique em **p5.js** — não se aceitam outputs noutras plataformas ou linguagens

#### Possibilidades

- Padrões modulares que se repetem, rotam e combinam em configurações distintas
- Formas orgânicas ou geométricas geradas por algoritmos (noise, fractais, sistemas de partículas)
- Composições paramétricas onde variáveis controlam proporções, escala ou densidade
- Texturas ou grafismos gerados por código para aplicação em superfícies
- Visualizações de dados em tempo real
- Experiências interativas que respondem a inputs do corpo ou do ambiente

### Entrega

Via **[Moodle](https://moodle2627.ipl.pt/course/section.php?id=9701)**, até à Aula 7 (6 de novembro).

O exercício é um **repositório GitHub**, criado a partir do template base. Submeter no Moodle:

| O que submeter | Descrição |
| -------------- | --------- |
| Link do repositório | ex: `https://github.com/username/TF-nome` |
| Link da página (GitHub Pages) | ex: `https://username.github.io/TF-nome/` |

O repositório deve incluir um **`readme.md`** como memória descritiva (máx. 200 palavras): conceito, ingredientes escolhidos (input, expressão, output), relação com o projeto de DPI, e eventuais recursos a LLMs utilizados.

---

## Entrega — Bloco 1

A entrega do Bloco 1 inclui três exercícios:

| Exercício | Prazo | Entrega |
|-----------|-------|---------|
| **Ex01 — Mondrian** ([Aula 2](aula2.md)) | Aula 5 (23 Out) | 2 repos GitHub (Parte A + Parte B), cada um com `readme.md` |
| **Ex02 — if/else** ([Aula 3](aula3.md)) | Aula 7 (6 Nov) | repo GitHub com `readme.md` |
| **Trabalho Final** (Aula 4) | Aula 7 (6 Nov) | repo GitHub com `readme.md` (máx. 200 palavras) |

Todas as entregas são via **[Moodle](https://moodle2627.ipl.pt/course/section.php?id=9701)** — submeter os links dos repositórios e das respetivas GitHub Pages. Cada repo é criado a partir do [template base](../../Recursos/CodigoCriativocomP5JS.md) e inclui um `readme.md` como memória descritiva.

## Recursos

- [Nature of Code](https://natureofcode.com/) — simulações biológicas e físicas em código
- [The Coding Train](https://thecodingtrain.com/) — tutoriais de código criativo
- [Synthesizing & Analyzing Sound](https://creative-coding.decontextualize.com/synthesizing-analyzing-sound/) — áudio em código criativo
- [Climate Change Tracker](https://climatechangetracker.org/global-warming/yearly-average-temperature) — dados climáticos públicos
- [ASCII Art](https://www.asciiart.eu/animations) — referência para mapeamento ASCII
