---
title: "Perguntas Frequentes"
icon: lucide/message-circle-question
tags: faq
status: in-progress
hero_image: ../attachments/DSC05966.jpg
hero_title: "FAQ"
hero_subtitle: "Design de Inovação"
hero_height: 40vh
hero_overlay: 0.2
hero_align: center
hero_caption: ""
---

# Perguntas Frequentes

## Entregas no Moodle

??? question "A caixa de texto do Moodle tem limite — como submeto?"
    As entregas de código criativo são **links**, não ficheiros de texto. No Moodle, cola os links pedidos (repositório GitHub + página GitHub Pages) nos campos próprios. Se vês um limite de palavras, verifica que estás a usar o campo correto — normalmente "Submissão online" ou "URL", não a caixa de comentários.

??? question "Qual é a hora limite das entregas?"
    Salvo indicação contrária, **23:59 do dia da aula** indicada como prazo. Consulta as datas no [Calendário](Calendario.md).

## GitHub e Configuração

??? question "Como crio um repositório novo para um exercício?"
    Segue o workflow:

    1. Abrir o [**template base**](https://github.com/steam228/BasicP5jsExample) no GitHub
    2. **Use this template** → **Create a new repository** → dar um nome (ex: `Ex01-mondrian-parteA`)
    3. **Open with GitHub Desktop** → clonar para o computador
    4. Abrir a pasta no **VSCode** → editar `sketch.js` → **Go Live**

    Guia completo com vídeo: [Código Criativo com P5JS](../Recursos/CodigoCriativocomP5JS.md)

??? question "Para a Parte B do Ex01, copio a pasta da Parte A ou uso o template?"
    Usa **sempre o template** para criar um repositório novo. Não copies a pasta da Parte A diretamente. Cada parte é um repositório independente, criado a partir do [template base](https://github.com/steam228/BasicP5jsExample). Depois de criares o novo repo, podes copiar e adaptar o código do `sketch.js` da Parte A como ponto de partida para a Parte B.

??? question "Como ativo o GitHub Pages para ter o link da página?"
    No repositório do GitHub:

    1. Ir a **Settings** (ícone da engrenagem, canto superior direito do repo)
    2. No menu lateral, clicar em **Pages**
    3. Em **Source**, selecionar **Deploy from a branch**
    4. Em **Branch**, escolher `main` e pasta `/ (root)`
    5. Clicar **Save**

    O link ficará disponível em poucos minutos: `https://<teu-username>.github.io/<nome-do-repo>/`

??? question "Já tenho a pasta feita no computador mas sem repositório — como ligo?"
    O mais simples é criar o repositório a partir do template (como acima) e depois substituir o `sketch.js` pelo teu código. Se preferires manter a pasta existente, no **GitHub Desktop**: **File** → **Add Local Repository** → selecionar a pasta → depois **Publish repository** para criar o repo no GitHub.

??? question "O Live Server não funciona quando copio pastas de projeto"
    Verifica que:

    - Abriste a **pasta do projeto** no VSCode (**File → Open Folder**), não um ficheiro solto
    - O ficheiro `index.html` está na raiz dessa pasta
    - Clicas em **Go Live** (barra inferior do VSCode, canto direito)
    - Se copiaste de outro projeto, confirma que o `index.html` referencia `sketch.js` (e não outro nome)

??? question "Qual é o link do template do GitHub usado nas aulas?"
    [github.com/steam228/BasicP5jsExample](https://github.com/steam228/BasicP5jsExample) — é o repositório template a partir do qual se cria cada projeto P5.js novo.

## Exercícios

??? question "Onde está a imagem de referência do Mondrian para o Ex01?"
    A imagem (*Composição nº III*) está no [enunciado do Ex01 — Aula 2](Sumarios/aula2.md#ex01-mondrian). Podes usá-la diretamente como referência para as proporções e cores.

??? question "O que preciso de entregar no Bloco 1?"
    Três exercícios, todos via Moodle:

    | Exercício | Prazo | O que submeter |
    |-----------|-------|----------------|
    | **Ex01 — Mondrian** | Aula 5 (23 Out) | 2 repos GitHub (Parte A + Parte B) + links Pages |
    | **Ex02 — if/else** | Aula 7 (6 Nov) | 1 repo GitHub + link Pages |
    | **Trabalho Final** | Aula 7 (6 Nov) | 1 repo GitHub + link Pages |

    Cada repositório deve incluir um `readme.md` como memória descritiva. Ver detalhes na [Aula 4](Sumarios/aula4.md#entrega-bloco-1).

## Utilização de IA

??? question "Posso usar IA (ChatGPT, Claude, etc.) nos exercícios?"
    Sim, é **permitido e encorajado**. Mas o processo deve ser **transparente**: documenta no `readme.md` do repositório que partes foram geradas ou assistidas por IA. O código gerado deve ser compreendido e iterado — não basta copiar e colar. Ver [Aula 4 — Uso de LLMs](Sumarios/aula4.md#uso-de-llms) e [Avaliação](Avaliacao.md#utilizacao-de-ia).

??? question "Como devo citar o uso de IA nas entregas?"
    No ficheiro `readme.md` do repositório, inclui uma secção (por exemplo, "Uso de IA") onde descreves:

    - Que ferramenta usaste (ChatGPT, Claude, Copilot, etc.)
    - Para que a usaste (gerar código, debugging, explorar variações, etc.)
    - O que alteraste ou iteraste sobre o resultado gerado

    Não é preciso formato formal de citação — basta ser claro(a) e honesto(a).

## Grupos (DPI)

??? question "As questões sobre grupos pertencem a esta UC?"
    Os grupos do projeto (com)FORMA são de **Design de Produto e Interação I**, não de Design de Inovação. Os grupos foram criados pelo professor numa perspetiva de diversificar competências, capacidades e motivações. Se tens questões sobre os grupos, consulta a [FAQ de DPI](../DesignDeProdutoEInteracao/FAQ.md).
