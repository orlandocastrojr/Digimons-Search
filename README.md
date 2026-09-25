# Digimons-Search

Projeto Front-End utilizando HTML, CSS e JavaScript que exibe um card interativo de Digimons com busca por nome ou id.

## Sobre

A página consulta a [DAPI - Digimon API](https://digi-api.com/) e renderiza no card:

- Nome e imagem do Digimon
- Nível (ex.: Child, Adult)
- Atributo (ex.: Vaccine, Data)
- Tipo (ex.: Reptile, Mammal)

Os dados de nível, atributo e tipo vêm do endpoint de detalhes da API. Digimons sem essas informações (fanmade) exibem `—`.

## Funcionalidades

- **Busca por nome**: usa `?name={nome}&exact=true` e mostra mensagem quando não encontra.
- **Busca por id**: se o termo for numérico, consulta direto `/{id}`.
- **Erro de API**: exibe uma mensagem dentro do card quando a requisição falha.
- **Imagem quebrada**: a imagem é ocultada caso a URL não carregue.

## Estrutura

```
.
├── index.html
└── src/
    ├── assets/
    │   └── logo.png
    ├── scripts/
    │   └── script.js
    └── styles/
        ├── reset.css
        ├── bg__digimons.css
        ├── atb__digimons.css
        └── card__digimons.css
```

## Funções do JavaScript

| Função | Responsabilidade |
| --- | --- |
| `getDigimonsAPI(params)` | Monta a URL e faz o `fetch` da DAPI, verificando o status da resposta. |
| `filtroDigimons(lista, termo)` | Filtra a lista paginada (`content`) por id ou nome. |
| `renderDigimons(digimon)` | Atualiza nome, imagem, nível, atributo e tipo no DOM. |
| `main(termo)` | Orquestra a busca, o detalhe e a renderização, com tratamento de erros. |

## Como executar

Basta abrir o `index.html` no navegador (funciona via `file://`), ou subir um servidor local:

```bash
npx serve .
```
