---
title: "Aula 6 — Computação Física III"
icon: lucide/book-open
tags: aula
status: not-started
hero_image: ../../attachments/DSC05966.jpg
hero_title: "Aula 6"
hero_subtitle: "Design de Inovação"
hero_height: 60vh
hero_overlay: 0.2
hero_align: center
---

# Aula 6 — Computação Física III

## Data

**30 de outubro de 2026** (6ª feira)

## Sumário

- Sensores digitais e utilização de bibliotecas Arduino
- Exemplo: sensor DHT11 (temperatura e humidade)
- Sessão de trabalho: finalização do protótipo de interação
- Apresentação e demonstração dos protótipos em aula
- Discussão: como a computação física se relaciona com o design de produto

## Notas da Aula

### Sensores Digitais + Bibliotecas

#### Exemplo — Sensor DHT11 (Temperatura e Humidade)

Referências:

- [DHT11/DHT22 com Arduino — Random Nerd Tutorials](https://randomnerdtutorials.com/complete-guide-for-dht11dht22-humidity-and-temperature-sensor-with-arduino/)
- [DHT11, DHT22 and AM2302 — Adafruit](https://learn.adafruit.com/dht/using-a-dhtxx-sensor)

```arduino
#include "DHT.h"

float h, t;

DHT dht(7, DHT11); // (pin, TIPO de SENSOR)

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  h = dht.readHumidity();
  t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println(F("Não consegui ler o sensor, bolas!"));
    return;
  }

  Serial.print("Humidade: ");
  Serial.println(h);
  Serial.print("Temperatura: ");
  Serial.println(t);
  Serial.println("||||||||||||||||");

  delay(2000);
}
```

### Ferramentas de simulação

- [Tinkercad Circuits](https://www.tinkercad.com/) — simulação online de circuitos Arduino

### Referências adicionais

- [Smooth Arduino 16x2 Gauge](https://youtu.be/cx9CoGqpsfg?si=0qlAnGIS-e132RMU) — exemplo LCD 16x2
- [Arduino Home](https://www.arduino.cc/)

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
