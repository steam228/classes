---
title: Aula 8 — Exercício Final de Computação Física
icon: lucide/book-open
tags: aula
status: not-started
hero_image: ../attachments/quadro.jpg
hero_title: Aula 8
hero_subtitle: Design de Inovação
hero_height: 60vh
hero_overlay: 0.2
hero_align: center
hero_caption: ""
---

# Aula 8 — Exercício Final de Computação Física

## Data

**13 de novembro de 2026** (6ª feira)

## Sumário

1. Continuação da aula anterior
2. Lançamento do Exercício Final de Computação Física (entrega até 4 de dezembro)
3. Matriz de trabalho para o Exercício Final e discussão de possibilidades:
    - a) Conceito / Motivação
    - b) Referências
    - c) Inputs / Outputs
    - d) MCU + Algoritmo
    - e) Referências técnicas: outros projetos
4. Partilha de referências em aula (conceptuais, artísticas, de design e técnicas)
5. Clarificação da integração entre DPI I e DI e respetiva avaliação

---

## 1. Continuação da aula anterior

Retoma dos conteúdos da [Aula 7](aula7.md): montagem do circuito do LDR na breadboard, leitura analógica, comunicação pela porta série e calibração do sensor com o Serial Monitor.

- Vídeos e notas: [Aula 7 — Computação Física II](aula7.md)
- Configuração do projeto (template, PlatformIO, GitHub): [Computação Física com Arduino](../../Recursos/ComputacaoFisicaArduino.md)

---

## 2. Lançamento do Exercício Final

Em **dupla**, conceber e prototipar um objeto que **sente** o contexto ou o utilizador (input), **decide** (MCU + algoritmo) e **responde** (output), com a eletrónica incorporada no próprio objeto.

!!! info "Entrega até 4 de dezembro (Aula 11)"
    - **Um repositório GitHub por dupla**, criado a partir do [arduinoStarterTemplate](https://github.com/steam228/arduinoStarterTemplate), com o colega adicionado como colaborador
    - **Todos os entregáveis no repositório**, documentados no `README.md`: conceito, referências, inputs/outputs, esquema do circuito, algoritmo, código, referências técnicas, fotografias e vídeo
    - Link do repositório submetido no Moodle

    Enunciado completo: [Exercício Final de Computação Física](../Enunciado.md)

---

## 3. Matriz de trabalho

![Matriz de trabalho do Exercício Final de Computação Física](attachments/matrizExercicioFinalCF.svg)

A matriz organiza o projeto e corresponde às secções do `README.md`. [Descarregar a matriz (SVG)](attachments/matrizExercicioFinalCF.svg)

### Canvas para trabalho em dupla

Para trabalhar a matriz em conjunto, importar este canvas para um board no **Miro** (ou FigJam, Mural, …) e preenchê-lo com post-its, imagens e links, começando pelo **Conceito**, ao centro. Cada bloco corresponde a uma secção do `README.md`, por isso o canvas preenchido é já o rascunho da documentação.

![Canvas do objeto interativo](attachments/canvasExercicioFinalCF.png)

[Descarregar o canvas (PNG, 4200 × 2970 px)](attachments/canvasExercicioFinalCF.png)

### a) Conceito / Motivação

Porquê este objeto? Para quem? O que deve provocar? A motivação pode ser um propósito (resolver, ajudar, informar) ou uma intenção artística/expressiva. É o conceito que orienta todas as escolhas técnicas seguintes.

### b) Referências

Referências conceptuais, artísticas e de design que sustentam o conceito: obras, objetos, instalações, autores. Cada referência deve ter link ou imagem e uma frase sobre o que se retira dela.

### c) Inputs / Outputs

- **Input** — o que o objeto sente: **sensores** (luz, som, toque, distância, movimento, temperatura, …)
- **Output** — o que o objeto faz: **atuadores** que controlam luz (LEDs), movimento (motores), som (colunas), …
- **Computador** — ligado ao Arduino pela **porta série** (cabo USB), pode entrar como input, sair como output, ou ambos. Os periféricos são os mesmos do [Trabalho Final de Código Criativo](aula4.md) em p5.js:

| | Periféricos | Exemplo |
|---|---|---|
| **Computador como input**<br>(porta série → Arduino) | teclado, rato, webcam, microfone, *trackpad*, dados da internet, … | uma tecla ou o volume do microfone, lidos num sketch p5.js, mudam a cor dos LEDs ou a velocidade de um motor |
| **Computador como output**<br>(Arduino → porta série) | ecrã, projetor, saída de áudio (colunas, auscultadores), … | o valor do LDR, enviado com `Serial.println()`, controla uma animação projetada ou um som gerado em p5.js |

### d) MCU + Algoritmo

O **MCU** (o Arduino) é o cérebro: lê os inputs pelo **circuito**, corre o **algoritmo/programa** (`setup()` uma vez, `loop()` para sempre) e controla os outputs. Descrever a lógica: o que acontece a cada volta do `loop()`, que regras e limiares decidem o comportamento.

Tudo isto fica **incorporado no objeto** (*embedded*): o circuito, o MCU e os componentes fazem parte do artefacto final.

### e) Referências técnicas: outros projetos

Projetos e soluções semelhantes, tutoriais e documentação que ajudam a resolver o circuito e o algoritmo. Indicar o que foi aproveitado de cada um.

---

## 4. Partilha de referências em aula

*Referências fornecidas aos diferentes grupos ao longo da aula (conceptuais, artísticas, de design e técnicas).*

### Referências conceptuais e visuais

*Artefactos artísticos, instalações, design, …*

#### Instalações interativas

- [Random International — *Audience* (espelhos que seguem o público)](https://www.random-international.com/audience)

https://vimeo.com/9852175

### Referências técnicas

#### Polargraph

*Desenho com motores (plotter suspenso)*

- [Polargraph Plotter — Instructables](https://www.instructables.com/Polargraph-Plotter/)
- [Drawing Robot Board — Polargraph Plotter — Instructables](https://www.instructables.com/Drawing-Robot-Board-Polargraph-Plotter/)
- [Drawing Robot Board — Polargraph Plotter — Hackster.io](https://www.hackster.io/mertarduino/drawing-robot-board-polargraph-plotter-240e14)
- [Daniel Osika — Fab Academy 2025, Fablab Benfica (semanas 12–13)](https://fabacademy.org/2025/labs/benfica/students/daniel-osika/WEEK12-13/)

#### Ecrã LCD 16x2 + Arduino

https://www.youtube.com/watch?v=Mq0WBPKGRew

!!! tip "Paralelo ou I2C?"
    Há duas versões principais do ecrã 16x2, conforme a ligação: **paralela** ou **I2C**. A versão I2C é muito mais simples, porque só precisa de dois fios de dados — SDA (*serial data*) e SCL (*serial clock*) — e com a biblioteca `LiquidCrystal_I2C` controla-se o ecrã com poucas linhas de código. No PlatformIO, a biblioteca adiciona-se em **PIO Home → Libraries**.

##### Exemplo com I2C

https://www.youtube.com/watch?v=upE17NHrdPc

- [Montagem e código no simulador Wokwi](https://wokwi.com/projects/332701081024856658)

#### Reconhecimento facial (do lado do computador)

![Reconhecimento facial no browser](attachments/Pasted%20image%2020261113144735.png)

- [face-api.js — sistema de reconhecimento facial em JavaScript (Fritz AI)](https://fritz.ai/facial-recognition-system-with-javascript/)
- [face-recognition.js — outro exemplo (GitHub)](https://github.com/justadudewhohacks/face-recognition.js/)
- Em p5.js, a biblioteca [ml5.js](https://ml5js.org/) (*faceMesh*) deteta o rosto no browser; os valores podem seguir para o Arduino pela porta série

---

## 5. Integração entre DPI I e DI e avaliação

| UC | Componente | Modalidade |
|----|------------|------------|
| **DPI I** | Fase individual | Individual |
| | Projeto (com)FORMA, conforme os critérios estabelecidos | Grupo |
| **DI** | Computação Criativa | Individual |
| | Computação Física — Exercício Final | Duplas |
| | Projeto (com)FORMA — avaliado quanto à documentação e à integração dos processos e ferramentas abordados em DI, e à sua pertinência | Grupo |

!!! info "Calendário do (com)FORMA (DPI I, em integração com DI)"
    - **Aula 9 (17 Nov)** — esboçar, modelar e adequar ao processo produtivo
    - **Aula 10 (24 Nov)** — FabLab I e entrega do CAD do molde
    - **Aula 13 (15 Dez)** — protótipo funcional (primeiras peças a partir do molde)
    - **Aula 14 (5 Jan)** — entrega final

    Ver o [calendário completo](../../DesignDeProdutoEInteracao/Calendario.md).
