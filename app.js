// OK requisitar e tratar os dados da API
// percorrer a array = nroperpage
// guardo os dados percorridos em uma variavel
// percorrer os dados da variavel
// chama função que percorre o array de itens chamando a cada interação a função que cria lis 
// transformar os dados da variavel em HTML

let actualPages = 1; 
let nroPerPage = 150;


async function getApiData(url){
    let response = await fetch(url);
    let dados = await response.json();
    return dados;
}

const getPokemonsDataPerPage = async (actualPages, nroPerPage) => {
    let limiteInferiorDaPagina = ((actualPages * nroPerPage) - nroPerPage)
    /* let limiteSuperiorDaPagina = (actualPages * nroPerPage) */
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${limiteInferiorDaPagina}&limit=${nroPerPage}`
    const dados = await getApiData(url);
    const promisesPokemons = dados.results.map( async (element)=>{
        return await getApiData(element.url);
    })
    const dadosPokemons = await Promise.all(promisesPokemons)
    criaHTML(dadosPokemons);
}

function criaHTML(dadosPokemons){
    // cria a array de lis
    const liArrays = dadosPokemons.map(elemento => preencheHTML(elemento))
    const $pokedex = document.querySelector('[data-js="pokedex"]')
    $pokedex.innerHTML = liArrays.join('');

}
function getPokemonTypes(types){
    return types.map((type)=>{
        return type.type.name;
    })
}

function preencheHTML(pokemon){
    const types = getPokemonTypes(pokemon.types);

    const liTemplate =
    `
        <li class="card ${types[0]}">
        <img class="card-image" alt="${pokemon.name}" src="${pokemon.sprites.front_default}"/>
        <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
        <p class="card-subtitle">${types.join(' | ')}</p>
        </li>
     `
    return liTemplate

}

await getPokemonsDataPerPage(actualPages,nroPerPage);
applyButtonsEvent()
// :: Config dos Botões para mudar de página ::

function applyButtonsEvent(){
    const $buttonsContainer = document.querySelector('.buttons-container'); 
    $buttonsContainer.addEventListener('click', resolveNavClickEvent);
}   
function resolveNavClickEvent(e){
    if(e.target.classList[0] == 'btn'){
        alteratePageNumberValues(e.target.classList[1])
    }
}
async function alteratePageNumberValues(classType){
    if(classType == 'avancar' && (actualPages * nroPerPage) <= 1126){
        actualPages += 1;
        await getPokemonsDataPerPage(actualPages,nroPerPage);
    }
    if(classType == 'recuar' && !(actualPages == 1)){
        actualPages -= 1;
        await getPokemonsDataPerPage(actualPages,nroPerPage);
    }
}

// :: Config da lista de pags ::

//definindo cada botão e nav
/* const $navPageBtns = document.getElementById('pages-lista')

const $firstPage = document.getElementById('first-page');
const $lastPage = document.getElementById('last-page');

const $actualPage = document.getElementById('actual-page');
const $2PageBack = document.getElementById('2-page-back');
const $1PageBack = document.getElementById('1-page-back');
const $1PageFront = document.getElementById('1-page-front');
const $2PageFront = document.getElementById('2-page-front');

$actualPage.innerText = actualPages;

$navPageBtns.addEventListener('click', navegarValoresBtn)

const atualizarValoresBtn = () => {
    $actualPage.innerText = actualPages;

    if(actualPages >= 3){
        $2PageBack.style.display = 'inline-flex'
        $2PageBack.innerText = actualPages -2
    } else {
        $2PageBack.style.display = 'none'
    }
    if(actualPages >= 2){
        $1PageBack.style.display = 'inline-flex'
        $1PageBack.innerText = actualPages -1
    } else {
        $1PageBack.style.display = 'none'
    }
    if(actualPages <= 14){
        $1PageFront.style.display = 'inline-flex'
        $1PageFront.innerText = actualPages +1
    } else {
        $1PageFront.style.display = 'none'
    }
    if(actualPages <= 13){
        $2PageFront.style.display = 'inline-flex'
        $2PageFront.innerText = actualPages +2
    } else {
        $2PageFront.style.display = 'none'
    }

}
function navegarValoresBtn(e){
    var target = e.target;
    console.log(target)
    if(target.className == "element-page-style"){
        actualPages = parseInt(target.innerText);
    }
    atualizarValoresBtn();
    applyDataOnPage();
}

atualizarValoresBtn(); */
