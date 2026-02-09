---
title: Estrutura e Modelo
icon: lucide/layout-template
tags: documentacao
status: not-started
---

# Estrutura de Documentação

## Overview

Esta documentação está organizada em duas unidades curriculares principais:

### 1. **Design de Produto IV** ✅ Produção
- Estrutura completa com 6 aulas
- Calendário detalhado com fases e entregas
- Sumários com conteúdos para cada aula
- Avaliação com critérios específicos

### 2. **Unidade Curricular - Modelo** 🔄 Template
- Estrutura paralela pronta para personalizar
- 3 aulas como exemplo
- Arquivos vazios para preenchimento direto em Obsidian
- Pronto para ser duplicado e adaptado

## Estrutura de Arquivos

Cada unidade curricular segue este padrão:

```
UnidadeCurricular/
├── index.md                 # Página inicial
├── Avaliacao.md            # Critérios e componentes
├── Calendario.md           # Cronograma e entregas
├── Enunciado.md            # Descrição do projeto
└── Sumarios/
    ├── index.md            # Tabela com lista de aulas
    ├── aula1.md            # Aula (data, sumário, referências)
    ├── aula1_conteudos.md  # Conteúdos/Exercícios para aula 1
    ├── aula2.md
    ├── aula2_conteudos.md
    └── ...
```

## Frontmatter Padrão

### Para Aulas
```yaml
---
title: Aula N
icon: lucide/book-open
tags: aula
status: not-started      # not-started | in-progress | completed
hero_image: ../../images/hero.png
hero_title: Aula N
hero_subtitle: Data ou Descrição
hero_height: 60vh
hero_overlay: 0.2
hero_align: center
---
```

### Para Conteúdos/Exercícios
```yaml
---
title: "Aula N - Conteúdos"
icon: lucide/copy
tags: exercicio
status: not-started
hero_image: ../../images/hero.png
hero_title: "Conteúdos"
hero_subtitle: "Aula N"
hero_height: 60vh
hero_overlay: 0.2
hero_align: center
---
```

### Para Calendário
```yaml
---
title: "Calendário"
icon: lucide/rocket
tags: projeto
status: not-started
hero_image: ../images/hero.png
hero_title: Calendário
hero_subtitle: Plano de Atividades
hero_height: 60vh
hero_overlay: 0.2
hero_align: center
---
```

## Hierarquia de Headers

### Exemplo Completo

```markdown
# Titulo Principal (H1)

## Seção Principal (H2)

### Subsseção (H3)

#### Detalhes (H4)
```

## Status de Documentação

- **not-started**: Ainda não foi iniciado
- **in-progress**: Em desenvolvimento
- **completed**: Concluído

## Fluxo de Trabalho

### Criar Nova Unidade Curricular

1. Duplicar pasta `UnidadeCurricular/` 
2. Renomear arquivos conforme necessário
3. Atualizar `hero_title`, `hero_subtitle` em cada arquivo
4. Preencher conteúdo em Obsidian (estrutura já está pronta)
5. Adicionar seção em `zensical.toml` na navegação

### Adicionar Novas Aulas

1. Copiar `UnidadeCurricular/Sumarios/aula1.md`
2. Renomear para `aulaN.md`
3. Copiar `UnidadeCurricular/Sumarios/aula1_conteudos.md`
4. Renomear para `aulaN_conteudos.md`
5. Atualizar `Sumarios/index.md` com links para novas aulas
6. Atualizar `zensical.toml` se navegação mudar

## Observações

- Todos os ficheiros sem conteúdo estão prontos para edição em Obsidian
- A estrutura de pastas facilita sincronização automática de anexos
- Mantenha as paths relativas dos `hero_image` para portabilidade
- Use status "not-started" para documentos em preparação
