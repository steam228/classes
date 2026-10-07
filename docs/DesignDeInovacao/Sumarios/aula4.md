---
title: "Aula 4 — Código Criativo IV"
icon: lucide/book-open
tags: aula
status: not-started
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
- Expandir a capacidade de expressão através do código com auxílio de AI
- Introdução a bibliotecas em p5.js
- Estrutura de projetos mais complexos: múltiplos ficheiros, classes e objetos
- Sessão de trabalho: Trabalho Final do Bloco 1

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

### Entrega — Bloco 1

A entrega do Bloco 1 inclui três exercícios:

| Exercício | Descrição | Entrega |
|-----------|-----------|---------|
| **Ex01 — Mondrian** | Reprodução fiel + destabilização generativa (enunciado na [Aula 2](aula2.md)) | sketch, captura e reflexão (Partes A e B) |
| **Ex02 — if/else** | Composição interativa com condicionais (enunciado na [Aula 3](aula3.md)) | sketch + captura |
| **Trabalho Final** | Output generativo com potencial de aplicação no projeto de DPI | sketch + imagem/vídeo + texto descritivo (máx. 200 palavras) |

**Entrega via Moodle até à Aula 5 (23 de outubro).**
