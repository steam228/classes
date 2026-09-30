---
title: "Aula 2 — Código Criativo II"
icon: lucide/book-open
tags: aula
status: not-started
hero_image: ../../attachments/DSC05966.jpg
hero_title: "Aula 2"
hero_subtitle: "Design de Inovação"
hero_height: 60vh
hero_overlay: 0.2
hero_align: center
---

# Aula 2 — Código Criativo II

## Data

**2 de outubro de 2026** (6ª feira)

## Sumário

- Revisão dos conceitos da aula anterior (setup/draw, formas primitivas)
- Interatividade com `mouseX` / `mouseY`
- Desenho 2D em P5.js: `circle()`, `line()`, `quad()`, `fill()`, `stroke()`
- Condicionais: `if` / `else`
- Exercício: reprodução de composição de Mondrian em código
- Referências: [The Coding Train](https://thecodingtrain.com/)

## Notas da Aula

### Revisão — "Hello World" em P5.js

```js
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  fill(100, 80, 150);
  circle(mouseX, mouseY, random(50, 100));
}
```

### Interatividade — Quad com `mouseX` / `mouseY`

![Quad interativo](../attachments/Screenshot_2023-11-03_at_12.20.44.png)

```js
function setup() {
  createCanvas(400, 400);
  background(234, 148, 139);
}

function draw() {
  background(234, 148, 139);
  fill(216, 216, 216);
  stroke(0);
  strokeWeight(2);
  quad(width/4, height/4, 3*width/4, height/4, mouseX, mouseY, width/4, 3*height/4);
}
```

### Desenho 2D em P5.js

```js
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  fill(200, 180, 40);
  stroke(40, 180, 200);
  strokeWeight(5);
  circle(width/2, height/2, 200);
  strokeWeight(10);
  line(width/2, 0, width/2, height);
}
```

### Exercício 1 — Mondrian

![Composição nº III — Mondrian](../attachments/mondrian_ref.png)

Crie um sketch que reproduza com rigor as proporções, cores e linhas do quadro de Mondrian "Composição nº III":

- O canvas terá que ter uma proporção adequada e uma largura mínima de 800 px
- As cores terão que reproduzir as cores usadas
- Por fim, terão que introduzir um elemento `random` subtil que anime a composição

### Condicionais — `if` / `else`

![Exemplo if/else com cores por quadrante](../attachments/aula5.jpg)

```js
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(14);
  noFill();
  stroke(0);
}

function draw() {
  background(255);

  if (mouseX < width/2) {
    if (mouseY > height/2) {
      fill(255, 0, 0);
    } else {
      fill(0, 255, 0);
    }
  } else {
    if (mouseY > height/2) {
      fill(0, 0, 255);
    } else {
      noFill();
    }
  }

  strokeWeight(random(2, 20));
  circle(width/2, height/2, height/4);
}
```

#### Variação — desenho cumulativo por quadrante

![Variação com desenho cumulativo](../attachments/Screenshot_2023-11-03_at_13.10.30.png)

```js
function setup() {
  createCanvas(600, 600);
  background(255);
}

function draw() {
  noStroke();
  if (mouseX < width / 2) {
    if (mouseY < height / 2) {
      fill(255, 0, 0);
    } else {
      fill(0, 255, 0);
    }
  } else {
    if (mouseY < height / 2) {
      fill(0, 0, 255);
    } else {
      fill(0);
    }
  }
  circle(mouseX, mouseY, 20);
}
```

## Referências

- [The Coding Train](https://thecodingtrain.com/) — tutoriais de código criativo
- [The Coding Train — Conditional Statements](https://www.youtube.com/watch?v=YsGeMIpEcY4)

### Articulação com DPI

As composições geradas podem explorar as mesmas lógicas de modularidade que o (com)FORMA pede: como uma unidade se repete, roda e combina para gerar configurações distintas.
