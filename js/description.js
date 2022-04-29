const urlParams = new URLSearchParams(window.location.search);
const pokemon = urlParams.get('pokemon');
const $pokemonDataArea = document.querySelector('.pokemonDataArea');

const $textArea = document.querySelector('.pokemon-search');


async function getApiData(url){
    let response = await fetch(url);
    let dados = await response.json();
    return dados;
}

async function getPokemonData(){
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const dados = await getApiData(url)
        .then(pokemonData => criaHTML(pokemonData))
        .catch(pokemonData => giveError(pokemonData));
}
function giveError(){
    $pokemonDataArea.innerHTML = 
    `
    <div class="errorScreenContainer">
        <div class="errorScreen">
        <p>O resultado <span id="pokemon-wrong-name">"${pokemon}"</span> não foi encontrado. Tente revisar os caracteres ou escreva o nome do Pokemon em inglês!</p>
        </div>
    </div>
    `
}
async function criaHTML(pokemonData){
    const species = await getSpecies(pokemonData.species.url);
    const generationData = await getGeneration(species.generation.url);
    const types = getPokemonTypes(pokemonData.types);
    const stats = getPokemonStatsArray(pokemonData);
    console.log(stats)

    console.log(pokemonData);

    const pokemonName = pokemonData.name
    const sprite = pokemonData.sprites.front_default;
    const generation = generationData.names[5].name.replace('Generation', '')
    const description = species.flavor_text_entries[0].flavor_text;

    /* console.log(species); */

    $pokemonDataArea.innerHTML = 
    `
    <div class="bigFrame ${types[0]}">
        <div class="titleContainer">
            <h1>${pokemonName}</h1>
            <p class="typesDescription">${types.join(' | ')}</p>
        </div>
        <div class="imageContainer">
            <img class="card-image" alt="${pokemon.name}" src="${sprite}"/>
        </div>
        <div class="dataArea card">
            <h1>Description:</h1>
            <p class="pokemonDescription">${description}</p> 
            <p><span class="elementTitle">Generation:</span> ${generation} </p>
            <p><span class="elementTitle">Shape:</span> ${species.shape.name}</p>
            <p><span class="elementTitle">Habitat:</span> ${species.habitat.name}</p>
        </div>
        <div class="statsArea card">
            <h1>Stats:</h1>
            <table class="statsTable">
                <tr>
                    <th>Stat</th>
                    <th>Value</th>
                </tr>
                <tr><td>HP</td><td>${stats[0]}</td></tr>
                <tr><td>Attack</td><td>${stats[1]}</td></tr>
                <tr><td>Defense</td><td>${stats[2]}</td></tr>
                <tr><td>SP Attack</td><td>${stats[3]}</td></tr>
                <tr><td>SP Defense</td><td>${stats[4]}</td></tr>
                <tr><td>Speed</td><td>${stats[5]}</td></tr>
            </table>
        </div>
    </div>
    `

}
function getPokemonStatsArray(pokemonData){
    const array = [];
    for (let i = 0; i < pokemonData.stats.length; i++) {
        array.push(pokemonData.stats[i].base_stat)
    }
    return array
}
async function getSpecies(url){
    const data =  await getApiData(url);
    return data;
}
async function getGeneration(url){
    const data = await getApiData(url);
    return data;
}
function getPokemonTypes(types) {
    return types.map((type) => {
        return type.type.name;
    })
}
getPokemonData();
applyButtonsEvent();

//::: Config dos botões :::

function applyButtonsEvent(){
    const $searchBtn = document.querySelector('.search-btn');
    const $homeBtn = document.querySelector('.home-btn');

    /* $searchBtn.addEventListener('click', getPokemonDataPerName) */
    $textArea.addEventListener('input', (e)=>{$textArea.value = $textArea.value.replace(/\n/g,'')});
    $homeBtn.addEventListener('click', returnToHomePage);
    $searchBtn.addEventListener('click', searchNewPokemon);
}

function returnToHomePage(){
    window.location.href = './index.html';
}
function searchNewPokemon(){
    window.location.href = `./description.html?pokemon=${$textArea.value.toLowerCase()}`;
}
