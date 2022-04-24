//Nro da página
var nroPerPage = 10;
var actualPages = 1;
//

const GetPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${id}`

const Pokemonteste = fetch(GetPokemonUrl(1)).then(response => response.json());
console.log(Pokemonteste)


/* const generatePokemonPromises = () => 
Array(150).fill().map((_, index) => 
fetch(GetPokemonUrl(index + 1)).then(response => response.json())) */

const generatePokemonPromises = () => 
    Array(150).fill().map((_, index) => 
        fetch(GetPokemonUrl(index + 1))
            .then(response => response.json()))

const generatePokeArrays = pokemons => {
    const pokeArrays =  pokemons.map((pokemon) => {
    
        const types = pokemon.types.map(typeInfo => typeInfo.type.name);
        
        const elemento = `
        <li class="card ${types[0]}">
        <img class="card-image" alt="${pokemon.name}" src="${pokemon.sprites.front_default}"/>
        <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
        <p class="card-subtitle">${types.join(' | ')}</p>
        </li>
        `
        return elemento
    })
    return pokeArrays
}
//criar uma função que remove os 10 primeiros index das arrays e revela os 10 próximos
//adicionar eventos em botões


const pokeArraysToHtml = (pokeArrays) => {
    return pokeArrays.join('')
}
const selectActualPokemons = (pokemons) => {

    var newPokemonList = [];
    for(var i=((actualPages * nroPerPage) - 10); i<(actualPages * nroPerPage); i++){
        newPokemonList.push(pokemons[i]);
    }
    return newPokemonList;
}
const insertPokemonsIntoPage = pokemons => {
    const $ul = document.querySelector('[data-js="pokedex"]')
    const actualLenght = selectActualPokemons(pokemons);
    const generatedHTML = pokeArraysToHtml(actualLenght);
    $ul.innerHTML = generatedHTML;
}
const applyDataOnPage = () => {
    Promises.then(generatePokeArrays)
    .then(insertPokemonsIntoPage)
}

const Promises = Promise.all(generatePokemonPromises())
applyDataOnPage();


// :: Config dos Botões para mudar de página ::

const buttonDesignate = () => {
    const $btnRecuar = document.getElementById('recuar');
    const $btnAvancar = document.getElementById('avancar');

    $btnAvancar.addEventListener('click',alteratePageNumber);
    $btnRecuar.addEventListener('click',alteratePageNumber);
    
}

const alteratePageNumber = (e) => {
    const idValue = e.target.attributes.id.value;
    
    if(idValue == 'avancar' && !(actualPages == 15)){
        actualPages += 1;
    }
    if (idValue == 'recuar' && !(actualPages == 1)) {
        actualPages -= 1;
    }
    atualizarValoresBtn()
    applyDataOnPage()
}

buttonDesignate();

// :: Config da lista de pags ::

//definindo cada botão e nav
const $navPageBtns = document.getElementById('pages-lista')

const $firstPage = document.getElementById('first-page');
const $lastPage = document.getElementById('last-page');

const $actualPage = document.getElementById('actual-page');
const $2PageBack = document.getElementById('2-page-back');
const $1PageBack = document.getElementById('1-page-back');
const $1PageFront = document.getElementById('1-page-front');
const $2PageFront = document.getElementById('2-page-front');

$actualPage.innerText = actualPages;

//associar evento
$navPageBtns.addEventListener('click', navegarValoresBtn)

//gerar valores nos botões
const atualizarValoresBtn = () => {
    /* debugger */
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
    /* debugger */
    var target = e.target;
    console.log(target)
    if(target.className == "element-page-style"){
        actualPages = parseInt(target.innerText);
    }
    atualizarValoresBtn();
    applyDataOnPage();
}

atualizarValoresBtn();
