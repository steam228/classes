# Portfólio de Grupo — Prototipagem Digital

Este repositório é a **entrega final do vosso grupo**. Cada commit no `main` atualiza automaticamente a galeria pública do site da disciplina (~1-2 minutos).

## Componentes da entrega

| Peso | Componente | Onde vive |
|------|------------|-----------|
| 50% | **Tutoriais de Máquinas** (grupo) — 2 tutoriais detalhados, um por máquina | `tutoriais/<nome-da-maquina>/` |
| 50% | **Projeto Integrado** (individual) — um por elemento | `experiencias/<numero>-<nome>/` |

---

## 0. Setup (uma vez por grupo)

### Ferramentas

- **GitHub Desktop** — <https://desktop.github.com>
- **Obsidian** — <https://obsidian.md>

### Conta GitHub

Cada elemento precisa de uma conta: <https://github.com/signup>.

---

## 1. Aceitar a tarefa e clonar o repositório

**Um elemento do grupo** (líder técnico) faz o seguinte:

1. Abre o link da tarefa enviado pelo professor.
2. Cria uma equipa com um nome curto (ex.: `grupo-A`). Os colegas juntam-se.
3. Aceita a tarefa → cria-se um repositório de grupo.
4. No **GitHub Desktop** → *File* → *Clone repository* → escolhe o repositório recém-criado.

Os outros elementos aceitam o link e juntam-se à equipa criada (sem criar equipa nova).

---

## 2. Abrir como Obsidian Vault

1. Abrir **Obsidian** → *Open another vault* → escolher a pasta clonada.
2. Pronto. O vault já está pré-configurado:
   - Imagens arrastadas vão para `attachments/` ao lado do documento.
   - Links em formato Markdown padrão (`![](attachments/foto.jpg)`), nunca em formato Wiki (`![[foto.jpg]]`).

> **Não alterem** as definições em *Settings → Files & Links*.

---

## 3. Fluxo sem conflitos de git

Recomendamos o **líder técnico** como único responsável por commits/pushes. Os colegas entregam conteúdo ao líder (email, drive), que copia para o repositório local, faz commit e push.

Se o grupo souber git, todos podem clonar e editar — mas leiam sobre `git pull` antes de cada push para evitar conflitos.

---

## 4. Estrutura do repositório

```text
.
├── index.md                              # Página de grupo (Home)
├── tutoriais/
│   └── _modelo/                          # DUPLICAR para cada máquina (2 tutoriais)
│       ├── index.md                      # Tutorial detalhado
│       └── attachments/
├── experiencias/
│   └── _modelo/                          # DUPLICAR para cada elemento
│       ├── index.md                      # Projeto individual
│       └── attachments/
├── attachments/                          # Imagens partilhadas do grupo
└── README.md
```

### O que preencher

#### A. Página de grupo (`index.md`)

Atualizem o frontmatter (linhas entre `---`):

```yaml
group_name: "Nome do Grupo"
group_number: "G01"
course: "PrototipagemDigital"
members:
  - number: "20231234"
    name: "Aluno A"
  - number: "20235678"
    name: "Aluno B"
```

Atualizem também a tabela de elementos, e a galeria de tutoriais e de experiências individuais.

#### B. Tutoriais (`tutoriais/`)

Para cada uma das **duas máquinas**:

1. Duplicar `tutoriais/_modelo/` e renomear para `tutoriais/<nome-da-maquina>/` (ex.: `tutoriais/silhouette-cameo/`).
2. Atualizar o frontmatter (`title`, `hero_title`, `hero_subtitle`, `machine_name`).
3. Preencher as 6 secções:
   1. Como desenhar para esta tecnologia
   2. Como preparar um ficheiro
   3. Antes de Começar (Segurança + Ficheiros)
   4. Como operar a máquina passo-a-passo
   5. Resultado e pós-produção
   6. Recursos e Ficheiros
4. Voltar ao `index.md` da raiz e atualizar o card correspondente (substituir `_modelo` em ambos os caminhos por `<nome-da-maquina>`).

> Referência de estrutura: tutorial da CNC do Fablab Benfica — <https://fablabbenfica.gitlab.io/fablabbenficadocs/machines/ouplan/>.

#### C. Projetos individuais (`experiencias/`)

Cada elemento:

1. Duplicar `experiencias/_modelo/` para `experiencias/<numero>-<primeiro-nome>/` (ex.: `experiencias/20231234-maria/`).
2. Atualizar o frontmatter (`title`, `hero_*`, `student_name`, `student_number`).
3. Preencher as secções: Conceito, Tecnologias Usadas, Processo, Resultado Final, Reflexão.
4. Adicionar imagens bem produzidas do resultado final e do processo.
5. Atualizar a galeria de experiências no `index.md` da raiz com um card para o novo projeto.

---

## 5. Imagens — convenção

### No corpo do texto

**Arrastar** para o Obsidian → guarda em `attachments/` ao lado do documento → insere `![](attachments/foto.jpg)` automaticamente. Funciona em qualquer ficheiro.

### Imagem de capa (hero)

A hero **tem de chamar-se sempre `hero.jpg`** (ou `hero.png`), na pasta `attachments/` ao lado do `.md`. Cada nível tem o seu próprio `hero.jpg`:

- `attachments/hero.jpg` ao lado de `index.md` → hero do **grupo**
- `tutoriais/<máquina>/attachments/hero.jpg` → hero do **tutorial**
- `experiencias/<numero>-<nome>/attachments/hero.jpg` → hero do **projeto individual**

Outras imagens podem ter qualquer nome — só a hero é que tem nome obrigatório.

#### Caminho no frontmatter

| Tipo de ficheiro                | `hero_image:`             |
| ------------------------------- | ------------------------- |
| `index.md` (qualquer pasta)     | `attachments/hero.jpg`    |
| Outros ficheiros (sub-páginas)  | `../attachments/hero.jpg` |

O template já está pré-configurado corretamente — basta substituir o `hero.jpg` pela vossa imagem real, mantendo o nome.

### Vídeos e modelos 3D

O site converte automaticamente:

- `![](video.mp4)` → vídeo embebido (também `.webm`, `.mov`, `.ogg`)
- `![](modelo.stl)` → visualizador 3D (também `.step`, `.obj`, `.glb`, `.gltf`)
- Links `https://a360.co/...` → visualizador Autodesk
- Links bare de YouTube (`https://youtu.be/...`) → embed iframe

---

## 6. Commit e push (apenas o líder)

No GitHub Desktop:

1. Ver alterações na coluna esquerda
2. Escrever uma mensagem curta no campo *Summary*
3. *Commit to main*
4. *Push origin*

Espera ~1-2 minutos. A galeria pública atualiza-se sozinha.

---

## 7. Privacidade

- `published: false` no `index.md` da raiz → grupo **não** aparece na galeria pública.
- `published: false` no `index.md` de um tutorial ou projeto individual → esse item **não** é listado.

---

## 8. Resolver problemas comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| Imagens não aparecem na galeria | Links em formato Wiki `![[ ]]` | Usar formato Markdown `![](caminho)` |
| Hero não aparece numa sub-página | Falta `../` | `hero_image: ../attachments/hero.jpg` |
| Hero não aparece no `index.md` | Tem `../` a mais | `hero_image: attachments/hero.jpg` (sem `../`) |
| Grupo não aparece na galeria | `published: false` ou push falhou | Confirmar `published: true` e *Push origin* no GitHub Desktop |
| Conflito de merge | Edições em paralelo | Pedir ao professor. Fluxo do líder técnico evita isto. |
