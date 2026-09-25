// Para trabalhar com o JS nesse projeto, precisamos criar 4 funções, para:
// 1. Chamar a API dos Digimons 
// 2. Um filtro para busca dos Digimons 
// 3. Renderizar 
// 4. E uma função main

// Base da DAPI (digi-api.com) - possui CORS liberado:
const API_BASE = "https://digi-api.com/api/v1/digimon";


// CHAMADA DA API:
// Função assíncrona que monta a URL conforme os parâmetros recebidos:
async function getDigimonsAPI(params = ""){

// O fetch faz a requisição assincrona e o await irá pedir para aguardar a resposta;
const response = await fetch(`${API_BASE}${params}`);

// Caso a API responda com erro (404, 500...), interrompemos com o status:
if (!response.ok) {
    const erro = new Error(`Erro na requisição: ${response.status}`);
    erro.status = response.status;
    throw erro;
}

// Aqui estamos retornando e convertendo a resposta para o JSON;
return await response.json();

}

// FILTRO PARA A BUSCA DO DIGIMON:
// A digi-api devolve uma lista paginada no formato { content: [...] };
async function filtroDigimons(digimonsList, digimonId){

const lista = Array.isArray(digimonsList?.content) ? digimonsList.content : [];
const termo = String(digimonId).toLowerCase().trim();

//Busca pelo id (quando o termo é numérico) ou pelo nome completo:
const digimon = lista.find((monster) =>
    monster.id === Number(digimonId) || monster.name.toLowerCase() === termo
);

return digimon;

}


async function renderDigimons(digimon){

// Manipulei o DOM aqui para exibir as informações de nome e imagem dos Digimons:
//É importante sempre observar a API e como está definidio suas propriedades.
const nomeDigimonElement = document.getElementById("t-nome__bt");
nomeDigimonElement.textContent = digimon.name;

// Na digi-api a imagem vem em images[0].href (lista de imagens):
const imgDigimonElement = document.querySelector(".i-card__digimon img");
imgDigimonElement.style.display = "block";
imgDigimonElement.alt = digimon.name;
imgDigimonElement.onerror = () => { imgDigimonElement.style.display = "none"; };
imgDigimonElement.src = digimon.images?.[0]?.href ?? "";

// MODIFICAR O NÍVEL, ATRIBUTO E TIPO
// Alguns digimons (fanmade) não trazem esses dados, então usamos "—" como padrão:
document.getElementById("t-nivel__bt").textContent = digimon.levels?.[0]?.level ?? "—";
document.getElementById("t-atributo__bt").textContent = digimon.attributes?.[0]?.attribute ?? "—";
document.getElementById("t-tipo__bt").textContent = digimon.types?.[0]?.type ?? "—";

}


// Mensagem de erro/aviso exibida dentro do card:
function exibirMensagem(texto){
document.getElementById("t-erro__busca").textContent = texto;
}


// FUNÇÃO PRINCIPAL MAIN:
async function main(termo = "Agumon"){

    try {
        exibirMensagem("");

        let digimonEscolhido;

        // Se o termo for numérico, buscamos direto pelo id:
        if (/^\d+$/.test(termo)) {
            digimonEscolhido = await getDigimonsAPI(`/${termo}`);
        } else {
            // Preciso chamar a API dos digimons primeiro, buscando pelo nome:
            const digimons = await getDigimonsAPI(`?name=${encodeURIComponent(termo)}&exact=true&pageSize=10`);

            // Preciso chamar/filtrar o digimon escolhido:
            digimonEscolhido = await filtroDigimons(digimons, termo);

            if (!digimonEscolhido) {
                exibirMensagem(`Digimon "${termo}" não encontrado.`);
                return;
            }

            // A lista não traz level/attribute/type, então buscamos o detalhe:
            digimonEscolhido = await getDigimonsAPI(`/${digimonEscolhido.id}`);
        }

        await renderDigimons(digimonEscolhido);

    } catch (erro) {
        exibirMensagem(erro.status === 404
            ? "Digimon não encontrado."
            : "Não foi possível carregar os dados da API.");
    }

}


// Busca disparada pelo formulário do card:
document.getElementById("form-busca").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const termo = document.getElementById("input-busca").value.trim();
    if (termo) main(termo);
});

main();
