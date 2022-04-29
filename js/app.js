/* import {returnPageData} from './pages.js' */

let actualPages = 1; 
let nroPerPage = 30;
const lastPage = 29;

async function getApiData(url){
    let response = await fetch(url);
    let dados = await response.json();
    return dados;
}

async function getPokemonsDataPerPage(actualPages, nroPerPage){
    const promisesArray = insertPromisesIntoArray(actualPages, nroPerPage);
    const dadosPokemons = await Promise.all(promisesArray)
    console.log(dadosPokemons)
    criaHTML(dadosPokemons);
}
function insertPromisesIntoArray(actualPages, nroPerPage){
    let offset = ((actualPages * nroPerPage) - nroPerPage)
    const promisesArray = []    
    for (let i = offset; i < (actualPages * nroPerPage); i++) {
        const promiseNumber = getApiData(`https://pokeapi.co/api/v2/pokemon/${(i + 1)}`);
        promisesArray.push(promiseNumber)
    }
    return promisesArray;
}
/* async function getPokemonDataPerName(){
    const $pokedex = document.querySelector('[data-js="pokedex"]');
    const $textArea = document.querySelector('.pokemon-search');
    if($textArea.value != ''){
        $pokedex.innerHTML = '';
        const url = `https://pokeapi.co/api/v2/pokemon/${$textArea.value.toLowerCase()}`;
        const dados = await getApiData(url)
            .then(result => getPokemonDataPerName_SuccessResult(result))
            .catch(()=>getPokemonDataPerName_ErrorResult($textArea.value))
    }
} */
async function navigateToPokemonPage(){
    const $textArea = document.querySelector('.pokemon-search');
    if($textArea.value != ''){
        window.location.href = `./description.html?pokemon=${$textArea.value.toLowerCase()}`;
    }
}
function getPokemonDataPerName_SuccessResult(result){
    const $errorScreen = document.getElementById("pokemon-name-error-screen");
    $errorScreen.style = 'display: none';
    criaHTML([result])
}
function getPokemonDataPerName_ErrorResult(textAreaValor){
    const $pokedex = document.querySelector('[data-js="pokedex"]');
    const $errorScreen = document.getElementById("pokemon-name-error-screen");
    const $errorSpan = document.getElementById('pokemon-wrong-name');

    $pokedex.innerHTML = '';
    $errorScreen.style = 'display: block';
    $errorSpan.textContent = `"${textAreaValor}"`;
}

function criaHTML(dadosPokemons){
    const $pokedex = document.querySelector('[data-js="pokedex"]')
    
    const arrayDeLis = dadosPokemons.map(elemento => preencheHTML(elemento))
    $pokedex.innerHTML = arrayDeLis.join('');
}

function preencheHTML(pokemon){
    atualizarValoresBtn();
    const types = getPokemonTypes(pokemon.types);
    
    const liTemplate =
    `
        <li class="card ${types[0]}">
        <img class="card-image" alt="${pokemon.name}" src="${pokemon.sprites.front_default}"/>
        <h2 class="card-title"><a href="./description.html?pokemon=${pokemon.name.toLowerCase()}">${pokemon.id}. ${pokemon.name}</a></h2>
        <p class="card-subtitle">${types.join(' | ')}</p>
        </li>
        `
        return liTemplate
        
    }
function getPokemonTypes(types) {
    return types.map((type) => {
        return type.type.name;
    })
}

function resetPage(){
    actualPages = 1;
    const $errorScreen = document.getElementById('pokemon-name-error-screen')
    const $textArea = document.querySelector('.pokemon-search');
    $errorScreen.style = 'display: none'
    $textArea.value = '';
    getPokemonsDataPerPage(actualPages, nroPerPage)
}



// :: Config dos Botões ::

function applyButtonsEvent(){
    const $ButtonsContainer = document.querySelectorAll('.buttons-container');
    const $resetBtn = document.getElementById('reset-btn');
    const $searchBtn = document.querySelector('.search-btn');
    const $homeBtn = document.querySelector('.home-btn')
    const $textArea = document.querySelector('.pokemon-search');
    const $pagesLista = document.querySelector(".pages-lista")

    for (let i = 0; i < $ButtonsContainer.length; i++) {
        const element = $ButtonsContainer[i];
        element.addEventListener('click', resolveNavClickEvent);}
    $resetBtn.addEventListener('click', resetPage)
    $searchBtn.addEventListener('click', navigateToPokemonPage)
    $homeBtn.addEventListener('click', resetPage)
    $textArea.addEventListener('keypress',(e)=>{(e.keyCode == 13)?navigateToPokemonPage():()=>{}})
    $textArea.addEventListener('input', (e)=>{$textArea.value = $textArea.value.replace(/\n/g,'')})
    $pagesLista.addEventListener('click',navegarValoresBtn)
}
   
function resolveNavClickEvent(e){
    const classArrowBtn = e.target.classList[0];
    const avancarOrRecuar = e.target.classList[1];

    if(classArrowBtn == 'arrow-btn'){
        alteratePageNumberValues(avancarOrRecuar)
        if(window.pageYOffset > 500){
            window.scrollTo(0, 0)
        }
    }
}
async function alteratePageNumberValues(classType){
    if(classType == 'avancar' && !(actualPages == lastPage)){
        actualPages += 1;
        await getPokemonsDataPerPage(actualPages,nroPerPage);
    }
    if(classType == 'recuar' && !(actualPages == 1)){
        actualPages -= 1;
        await getPokemonsDataPerPage(actualPages,nroPerPage);
    }
}

// :: Config da lista de pags ::

function atualizarValoresBtn(){
    const $firstPageBtn = document.getElementById("first-page")
    const $lastPageBtn = document.getElementById("last-page")
    const $pageBtn1 = document.getElementById("page-btn-1")
    const $pageBtn2 = document.getElementById("page-btn-2")
    const $pageBtn3 = document.getElementById("page-btn-3")
    const $pageBtn4 = document.getElementById("page-btn-4")
    const $pageBtn5 = document.getElementById("page-btn-5")
    let pagesArray = [$pageBtn1, $pageBtn2, $pageBtn3, $pageBtn4, $pageBtn5]
    
    $firstPageBtn.innerHTML = 1;
    $lastPageBtn.innerHTML = lastPage;

    if(actualPages <= 3){
        for (let i = 0; i < pagesArray.length; i++) {
            pagesArray[i].innerText = i+1
            pagesArray[i].classList.remove('actual-page')
        }
        if(actualPages == 1){
            $pageBtn1.classList.add('actual-page')
        } else if (actualPages == 2){
            $pageBtn2.classList.add('actual-page')
        } else {
            $pageBtn3.classList.add('actual-page')
        }
    }
    if(actualPages < (lastPage - 2) && actualPages > 3){
        for (let i = 0; i < pagesArray.length; i++) {
            pagesArray[i].innerText = (actualPages + (i - 2))
            pagesArray[i].classList.remove('actual-page')
        }
        $pageBtn3.classList.add('actual-page')
    }
    if(actualPages >= (lastPage - 2)){
        for (let i = 0; i < pagesArray.length; i++) {
            pagesArray[i].innerText = (i - 4) + lastPage;
            pagesArray[i].classList.remove('actual-page')
        }
        if(actualPages == 27){
            $pageBtn3.classList.add('actual-page')
        } else if (actualPages == 28){
            $pageBtn4.classList.add('actual-page')
        } else {
            $pageBtn5.classList.add('actual-page')
        }
    }
}
function navegarValoresBtn(e){
    var target = e.target;
    if(target.classList[0] == "element-page-style"){
        actualPages = parseInt(target.innerText);
    }
    getPokemonsDataPerPage(actualPages,nroPerPage);
}
applyButtonsEvent()
atualizarValoresBtn()
await getPokemonsDataPerPage(actualPages,nroPerPage);