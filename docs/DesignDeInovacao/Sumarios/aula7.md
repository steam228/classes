---
title: Aula 7 — Computação Física II
icon: lucide/book-open
tags: aula
status: not-started
hero_image: ../attachments/coverAula6DI.jpg
hero_title: Aula 7
hero_subtitle: Design de Inovação
hero_height: 60vh
hero_overlay: 0.2
hero_align: center
hero_caption: img by https://github.com/katspaugh/arduino-modular-synth
---

# Aula 7 — Computação Física II

## Data

**6 de novembro de 2026** (6ª feira)

## Sumário

- Conversão Analógico-Digital (ADC) — leitura de sensores analógicos
- Comunicação pela porta série (`Serial`)
- Potenciómetro: leitura e mapeamento de valores
- LDR (sensor de luz): leitura e tomada de decisão
- Introdução ao conceito de protótipo de interação
- Entrega dos exercícios do Bloco 1 (Código Criativo)

!!! info "Criar novo projeto Arduino — passo a passo"
    1. Abrir o [**template base**](https://github.com/steam228/arduinoStarterTemplate) no GitHub
    2. **Use this template** → **Create a new repository** → dar um nome
    3. **Open with GitHub Desktop** → clonar para o computador
    4. No VSCode: **PIO Home** → **Projects** → **Add Existing** → abrir a pasta
    5. Editar `src/main.cpp` → **Upload** para a placa

    Guia completo com vídeo: [Computação Física com Arduino](../../Recursos/ComputacaoFisicaArduino.md)

## Notas da Aula

### Analog to Digital — ADC + Comunicação Porta Série

![Esquema ADC](../attachments/Screenshot_2023-02-02_at_19.42.59.png)

### Potenciómetro

```arduino
#define ledPin 13

int sensorValue = 0;
int angulo = 0;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
}

void loop() {
  sensorValue = analogRead(A0);
  angulo = map(sensorValue, 0, 1023, 0, 360);
  if (angulo >= 180) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }

  Serial.println(angulo);
  delay(1);
}
```

![Esquema potenciómetro](../attachments/Screenshot_2023-02-07_at_19.22.09.png)

### LDR — Sensor de Luz

Referências:

- [How to use an LDR with Arduino](https://maker.pro/arduino/tutorial/how-to-use-an-ldr-sensor-with-arduino)
- [Photocells — Adafruit](https://learn.adafruit.com/photocells/connecting-a-photocell)

![Esquema LDR com divisor de tensão](../attachments/Screenshot_2023-02-07_at_22.53.15.png)

Versão simples — ler o sensor e acender LED quando escurece:

![Esquema LDR simples](../attachments/ldr_circuit_simple.png)

```arduino
#define sensLuz A0
#define ledPin 13

int valorSensLuz = 0;
int asEscuras = 200;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
}

void loop() {
  valorSensLuz = analogRead(sensLuz);
  Serial.println(valorSensLuz);
  if (valorSensLuz < asEscuras) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
  delay(1);
}
```

### Conceitos-chave

- `analogRead()` — leitura de valor analógico (0–1023)
- `map()` — traduzir um intervalo de sensor para um intervalo de atuador
- `Serial.println()` — comunicação com o computador pela porta série
- Divisor de tensão — princípio base dos sensores resistivos (LDR, termístor, FSR)

### Articulação com DPI

Pensar como os módulos do (com)FORMA poderiam incorporar eletrónica simples: um módulo com LED, um módulo sensível ao toque, um módulo que reage à luz.

---

### Entrega — Bloco 2

**Exercício: Protótipo de Interação**

Criar um protótipo funcional que responde a um estímulo do ambiente ou do utilizador.

Entregar:

- Protótipo funcional (apresentado em aula)
- Vídeo de demonstração (máx. 60 segundos)
- Texto descritivo (máx. 200 palavras)

### Balanço dos blocos 1 e 2

Discussão coletiva: que ferramentas e conceitos dos dois primeiros blocos são úteis para o (com)FORMA? Como integrar código criativo e computação física no design de produto?
