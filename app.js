//APAGAR - FUNÇÕES DE TESTE
function mostrarTarget(){
    window.addEventListener('click',(e)=>{
        console.log(e.target);
    })
}
/* mostrarTarget(); */
console.log('teste \n teste')

let actualPages = 1; 
let nroPerPage = 5;

async function getApiData(url){
    let response = await fetch(url);
    let dados = await response.json();
    return dados;
}

async function getPokemonsDataPerPage(actualPages, nroPerPage){
    const promisesArray = insertPromisesIntoArray(actualPages, nroPerPage);
    const dadosPokemons = await Promise.all(promisesArray)
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
async function getPokemonDataPerName(){
    const $pokedex = document.querySelector('[data-js="pokedex"]');
    const $textArea = document.querySelector('.pokemon-search');
    if($textArea.value != ''){
        $pokedex.innerHTML = '';
        const url = `https://pokeapi.co/api/v2/pokemon/${$textArea.value}`;
        const dados = await getApiData(url)
            .then(result => getPokemonDataPerName_SuccessResult(result))
            .catch(()=>getPokemonDataPerName_ErrorResult($textArea.value))
        console.log(dados)
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
function getPokemonTypes(types) {
    return types.map((type) => {
        return type.type.name;
    })
}

await getPokemonsDataPerPage(actualPages,nroPerPage);
applyButtonsEvent()


// :: Config dos Botões ::

function applyButtonsEvent(){
    const $ButtonsContainer = document.querySelectorAll('.buttons-container');
    const $resetBtn = document.getElementById('reset-btn');
    const $searchBtn = document.querySelector('.search-btn');
    const $homeBtn = document.querySelector('.home-btn')
    const $textArea = document.querySelector('.pokemon-search');

    for (let i = 0; i < $ButtonsContainer.length; i++) {
        const element = $ButtonsContainer[i];
        element.addEventListener('click', resolveNavClickEvent);
    }
    $resetBtn.addEventListener('click', resetPage)
    $searchBtn.addEventListener('click', getPokemonDataPerName)
    $homeBtn.addEventListener('click', resetPage)
    $textArea.addEventListener('keypress',(e)=>{(e.keyCode == 13)?getPokemonDataPerName():()=>{}})
    $textArea.addEventListener('input', (e)=>{$textArea.value = $textArea.value.replace(/\n/g,'')})
}
   
function resetPage(){
    const $errorScreen = document.getElementById('pokemon-name-error-screen')
    const $textArea = document.querySelector('.pokemon-search');
    $errorScreen.style = 'display: none'
    $textArea.value = '';
    getPokemonsDataPerPage(actualPages, nroPerPage)
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
