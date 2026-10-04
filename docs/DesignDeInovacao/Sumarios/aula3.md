---
title: "Aula 3 — Código Criativo III"
icon: lucide/book-open
tags: aula
status: not-started
hero_image: ../../attachments/DSC05966.jpg
hero_title: "Aula 3"
hero_subtitle: "Design de Inovação"
hero_height: 60vh
hero_overlay: 0.2
hero_align: center
---

# Aula 3 — Código Criativo III

## Data

**9 de outubro de 2026** (6ª feira)

## Sumário

- Interação e animação: parâmetros que mudam com o tempo ou com o utilizador
- Exportação de resultados: imagem, vídeo, SVG
- Sessão de trabalho: finalização do exercício
- Apresentação e discussão dos resultados em aula

## Notas da Aula

### Conceitos introduzidos

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



- `mouseX`, `mouseY` — interação com o rato
- `frameCount`, `sin()`, `cos()` — animação e movimento cíclico
- `save()`, `saveCanvas()` — exportar imagens
- Exportação SVG para fabricação (corte laser, vinil)

### Entrega — Bloco 1

A entrega do Bloco 1 é o **Ex01 — Mondrian** (enunciado na [Aula 2](aula2.md)). Nesta aula mostras o que tens para comentário; a entrega final é via **Moodle até à Aula 4 (16 de outubro)**: sketch, captura e reflexão das Partes A e B.
