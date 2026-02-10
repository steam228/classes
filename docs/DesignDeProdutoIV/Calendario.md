---
title: Calendário
icon: lucide/rocket
tags: projeto
status: not-started
hero_image: ../../images/heroProj.jpeg
hero_title: Calendário
hero_subtitle: Plano de Atividades e Entregas - 2026
hero_height: 60vh
hero_overlay: 0.2
hero_align: center
---

# Calendário

###  Plano de Atividades e Entregas

| **Fase**                                                     | **Datas**                    | **Tarefas**                                                                                                                             | **Fase?**                                                                       | **Tipologia**    |
| ------------------------------------------------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------- |
| **Conceito**                                                 | 11/02/2026 → 06/03/2026      | • Pesquisa de referências tradicionais<br><br>• Análise de materiais disponíveis<br><br>•Desenvolvimento do conceito                    | Fase 1 - Brinquedo - Trab. Individual                                           | Etapa de Projeto |
| **Prancha resumo + Moodboard**                               | **04/03/2026 ou 06/03/2026** | 1 ou 2 PDF's (1920x1080px)                                                                                                              | Fase 1 - Brinquedo - Trab. Individual                                           | **Entrega**      |
| **Design & Making**                                          | 11/03/2026 → 22/05/2026      | •Desenvolvimento paramétrico<br><br>• Ciclos de prototipagem<br><br>• Testes e refinamentos                                             | Fase 1 - Brinquedo - Trab. Individual                                           | Etapa de Projeto |
| **Identidade**                                               | 08/04/2026 → 17/04/2026      | •Desenvolvimento marca<br><br>• Moodboard e pesquisa<br><br>• Sistema visual                                                            | Fase 2 - Id e Embalagem - Trab. de Grupo                                        | Etapa de Projeto |
| **Manual básico de marca**                                   | 15/04/2026 ou 17/04/2026     | - máximo de 4 pranchas PDF, 1920x1080 px                                                                                                | Fase 2 - Id e Embalagem - Trab. de Grupo                                        | **Entrega**      |
| **Protótipo (data de referência)**                           | 20/05/2026 ou 22/05/2026     | idealmente já é fruto de várias iterações e está muito próximo, senão na forma, cores e textura geral pretendida                        | Fase 1 - Brinquedo - Trab. Individual                                           | **Entrega**      |
| **Embalagem**                                                | 22/04/2026 → 05/06/2026      | •Desenvolvimento estrutural<br><br>• Testes materiais<br><br>• Protótipos                                                               | Fase 2 - Id e Embalagem - Trab. de Grupo                                        | Etapa de Projeto |
| **Pausa Letiva**                                             | 30/03/2026 → 11/04/2026      | Pausa de aulas (Páscoa)                                                                                                                 |                                                                                 |                  |
| **Finalização**                                              | 15/05/2026 → 22/05/2026      | • Documentação fotográfica<br><br>• Preparação pranchas finais<br><br>• Organização dossier digital                                     | Fase 1 - Brinquedo - Trab. Individual                                           | Etapa de Projeto |
| **Protótipos finais de Embalagens**                          | 27/05/2026 ou<br>29/05/2026  | Ficheiros Técnicos                                                                                                                      | Fase 2 - Id e Embalagem - Trab. de Grupo                                        | **Entrega**      |
| **Entrega Final**                                            | 27/05/2026 ou<br>29/05/2026  | - Duas pranchas resumo (1920x1080px)<br><br>- Dossier Notion completo<br><br>- Ficheiros paramétricos<br><br>- Documentação do processo | Fase 1 - Brinquedo - Trab. Individual                                           | **Entrega**      |
| **Produção (embalagens de amostra / impressão)**             | 22/05/2026 → 31/05/2026      | • Finalização sistema<br><br>• Impressão<br><br>• Documentação                                                                          | Fase 2 - Id e Embalagem - Trab. de Grupo                                        | Etapa de Projeto |
| **Apresentações Finais com Módulo de Design de Comunicação** | 02/06/2026 ou 05/06/2026     | Sistema completo (Protótipos, Apresentação Slides e Documentação Notion Grupo / Individual)                                             | Fase 1 - Brinquedo - Trab. Individual, Fase 2 - Id e Embalagem - Trab. de Grupo | **Entrega**      |
| **APRESENTAÇÃO**                                             | 05/06/2026                   | Apresentação pública dos projetos                                                                                                       |                                                                                 | **Evento**       |
| **ENTREGA FINAL**                                            | 08/06/2026                   | Última data para entrega de todos os materiais                                                                                          |                                                                                 | **Deadline**     |

---

## Gantt

```mermaid
---
config:
  gantt:
    useWidth: 1800
    barHeight: 50
    barGap: 4
    fontSize: 16
    sectionFontSize: 18
    leftPadding: 200
    rightPadding: 75
---
gantt

    dateFormat YYYY-MM-DD
    axisFormat %d/%m

    section Aulas
    Aula 1 - Apresentacao             :a1, 2026-02-11, 2026-02-13
    Aula 2 - Carpintaria Digital      :a2, 2026-02-18, 2026-02-20
    Aula 3 - Funcionalidade e Grafica :a3, 2026-02-25, 2026-02-27
    Aula 4 - Desenho Parametrico      :a4, 2026-03-04, 2026-03-06
    Aula 5 - Processo de Desenho 3D   :a5, 2026-03-11, 2026-04-18
    Pausa letiva                      :crit, pausa, 2026-03-30, 2026-04-11
    Aula 6 - Organizacao no Fablab    :a6, 2026-03-18, 2026-03-20
    Aula 7 - Prototipagem             :a7, 2026-03-18, 2026-06-05

    section Fase 1 - Brinquedo (Individual)
    Conceito                          :active, prod1, 2026-02-11, 2026-03-06
    Design e Making                   :prod2, 2026-03-11, 2026-05-22
    Finalizacao                       :prod3, 2026-05-15, 2026-05-22
    Prototipo (Qua)                   :milestone, prod4, 2026-05-20, 0d
    Prototipo (Sex)                   :milestone, prod5, 2026-05-22, 0d
    Entrega Final (Qua)               :milestone, prod6, 2026-05-27, 0d
    Entrega Final (Sex)               :milestone, prod7, 2026-05-29, 0d

    section Fase 2 - Marca e Embalagem (Grupo)
    Identidade                        :brand1, 2026-04-08, 2026-04-17
    Embalagem                         :brand2, 2026-04-22, 2026-06-05
    Producao                          :brand3, 2026-05-22, 2026-05-31
    Manual basico de marca (Qua)      :milestone, brand4, 2026-04-15, 0d
    Manual basico de marca (Sex)      :milestone, brand5, 2026-04-17, 0d
    Prototipos finais (Qua)           :milestone, brand6, 2026-05-27, 0d
    Prototipos finais (Sex)           :milestone, brand7, 2026-05-29, 0d

    section Entregas e Eventos
    Prancha resumo Moodboard (Qua)    :milestone, prod8, 2026-03-04, 0d
    Prancha resumo Moodboard (Sex)    :milestone, prod9, 2026-03-06, 0d
    Apresentacoes finais (Qua)        :milestone, event1, 2026-06-02, 0d
    Apresentacoes finais (Sex)        :milestone, event2, 2026-06-05, 0d
    APRESENTACAO                      :milestone, event3, 2026-06-05, 0d
    ENTREGA FINAL                     :crit, milestone, event4, 2026-06-08, 0d
```

## Notas Importantes

- **Período letivo:** 11 de Fevereiro - 05 de Junho de 2026 (15 semanas)
- **Pausa Letiva:** 30 de Março - 11 de Abril (semana da Páscoa)
- **Aulas:** Quartas-feiras (2 turmas) e Sextas-feiras (1 turma)


