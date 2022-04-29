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
    const evolutionChain = await getApiData(species.evolution_chain.url);
    const types = getPokemonTypes(pokemonData.types);
    const stats = getPokemonStatsArray(pokemonData);
    const games = getPokemonGames(pokemonData);
    /* const evolutions = dataEvolution(evolutionChain); */

    
    const pokemonName = pokemonData.name
    const sprite = pokemonData.sprites.front_default;
    const generation = generationData.names[5].name.replace('Generation', '')
    const description = species.flavor_text_entries[0].flavor_text;
    
    /* console.log(pokemonData); */
        /* console.log(species); */
            console.log(evolutionChain);
            /* console.log(evolutions); */

    $pokemonDataArea.innerHTML = 
    `
    <div class="bigFrame ${types[0]}">
        <div class="titleContainer">
            <h1>${pokemonData.id}: ${pokemonName}</h1>
        </div>
        <div class="imageContainer">
            <img class="card-image" alt="${pokemonName}" src="${sprite}"/>
        </div>
        <div class="dataArea card">
            <h1>Description</h1>
            <p class="pokemonDescription">${description}</p> 
            <div class="miniCardsArea">
            <div class="miniCard">
                <div class="miniTitle">Types</div>
                <div class="miniContent">${types.join(' | ')}</div>
            </div>
            <div class="miniCard">
                <div class="miniTitle">Shape</div>
                <div class="miniContent">${species.shape.name}</div>
            </div>
            <div class="miniCard">
                <div class="miniTitle">Habitat</div>
                <div class="miniContent">${species.habitat.name}</div>
            </div>
            <div class="miniCard">
                <div class="miniTitle">height</div>
                <div class="miniContent">${pokemonData.height}</div>
            </div>
            <div class="miniCard">
                <div class="miniTitle">Generation</div>
                <div class="miniContent">${generation}</div>
            </div>
            <div class="miniCard">
                <div class="miniTitle">Base Experience</div>
                <div class="miniContent">${pokemonData.base_experience}</div>
            </div>
            <div class="miniCard">
                <div class="miniTitle">Capture rate</div>
                <div class="miniContent">${species.capture_rate}</div>
            </div>
        </div>
        </div>
        <div class="evolution card">
            <h1>Evolution chain</h1>
            <div class="evoMiniCard">
                <div class="evoMiniTitle">1º Form</div>
                <div class="evoMiniContent">
                    <div class="pokeMiniCard">
                        <div class="pokeCardTitle">${pokemonData.name}</div>
                        <div class="pokeCardContent">
                        <img src="${pokemonData.sprites.front_default}">
                        </div>
                    </div>
            </div> 
        </div>
        <div class="statsArea card">
            <h1>Stats</h1>
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
        <div class="card">
            <h1>Games</h1>
            ${games.join(', ')}
        </div>
    </div>
    `

}
async function returnPokeCards(speciesArray){
    /* console.log(speciesArray) */
    /* const arr = await speciesArray.map(returnPokeCardHTML) */
    const arr = [];
    for (let i = 0; i < speciesArray.length; i++) {
        const data = await returnPokeCardHTML(speciesArray[i])
        arr.push(data)
    }
    return arr.join('');
}
async function returnPokeCardHTML(element){
    const pokemonSpecie = await getApiData(element.species.url)
    const pokemon = await getApiData(`https://pokeapi.co/api/v2/pokemon/${pokemonSpecie.id}`)
   /*  console.log(element) */
    /* console.log(pokemonSpecie) */
    /* console.log(pokemon) */
    const htmlContent = 
    `
    <div class="pokeMiniCard">
            <div class="pokeCardTitle">${pokemonSpecie.name}</div>
            <div class="pokeCardContent">
                <img src="${pokemon.sprites.front_default}">
            </div>
    </div>
    `
    ;
    return htmlContent;
}
function getPokemonGames(pokemonData){
    const array = pokemonData.game_indices.map(element => {
        return element.version.name
    });
    return array;
}
function getPokemonMoves(pokemonData){
    const array = pokemonData.moves.map(element => {
        return element.move.name
    })
    return array;
}
function getPokemonStatsArray(pokemonData){
    const array = [];
    for (let i = 0; i < pokemonData.stats.length; i++) {
        array.push(pokemonData.stats[i].base_stat)
    }
    return array
}
function dataEvolution(data){
    return data.chain;
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
    $textArea.addEventListener('keypress', searchAreaEnterPress)
    $homeBtn.addEventListener('click', returnToHomePage);
    $searchBtn.addEventListener('click', searchNewPokemon);
}

function returnToHomePage(){
    window.location.href = './index.html';
}
function searchNewPokemon(){
    if($textArea.value != ''){
        window.location.href = `./description.html?pokemon=${$textArea.value.toLowerCase()}`;
    }
}
function searchAreaEnterPress(e){
    (e.keyCode == 13)?searchNewPokemon():()=>{}
}
