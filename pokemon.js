`use strict`;

// --------------------DOM ELEMENTS---------------------------

// ---- CONTAINERS
const loading = document.querySelector(`.loading`);
const appContainer = document.querySelector(`.container`);
const tabContainer = document.querySelector(`.info-tab-container`);
const pokeContainer = document.querySelector(`.pokemon`);
const infoCT1Container = document.querySelector(`.info-content--1`);
const infoCT2Container = document.querySelector(`.info-content--2`);
const infoCT3Container = document.querySelector(`.info-content--3`);
const infoCT4Container = document.querySelector(`.info-content--4`);
const infoContainer = document.querySelector(`.info`);
const buttonFigContainer = document.querySelector(`.buttonfig`);

// ---- SEARCH ELEMENTS & BUTTONS
const searchField = document.querySelector(`.search-field`);
const search = document.querySelector(`.search`);
const rightBtn = document.querySelector(`.poke-btn--right`);
const leftBtn = document.querySelector(`.poke-btn--left`);
const switchToBackBtn = document.querySelector(`.x`);
const switchToFrontBtn = document.querySelector(`.y`);
const PokeMoveBtns = document.querySelector(`.poke-btns`);
const pokedexbtn = document.querySelector(`.pokedex-anc`);

// ---- MODAL ELEMENTS
const overlayErr = document.querySelector(`.overlay`);
const modalBtn = document.querySelector(`.modal-btn`);
const errorMsg = document.querySelector(`.error`);

// ---- NODE LIST
const infoTabs = [...document.querySelectorAll(`.info-tab`)];
const contents = [...document.querySelectorAll(`.info-content`)];

// //////////////////////////////////////////////////////

const App = class {
  constructor() {
    // INIT APP
    document.addEventListener(`DOMContentLoaded`, this._initApp.bind(this));
    // SEARCH HANDLER
    search.addEventListener(`submit`, this._searchpokemon.bind(this));
    // POKEMON INFO/CONTENT TAB
    tabContainer.addEventListener(`click`, this._tabs.bind(this));
    tabContainer.addEventListener(`mouseover`, this._fade.bind(0.5));
    tabContainer.addEventListener(`mouseout`, this._fade.bind(1));
    // HIDE POKEMON UI
    pokedexbtn.addEventListener(`click`, this._switchOff.bind(this));
    // CLOSE MODAL WINDOW
    modalBtn.addEventListener(`click`, this._closeModal.bind(this));
    overlayErr.addEventListener(`click`, this._closeModal.bind(this));
    document.addEventListener(`keydown`, this._clearModalEsc.bind(this));

    // NEXT & PREV BUTTONS

    rightBtn.addEventListener(`click`, this._nextPokemon.bind(this));
    leftBtn.addEventListener(`click`, this._prevPokemon.bind(this));
    switchToBackBtn.addEventListener(
      `click`,
      this._switchImageToBack.bind(this)
    );
    switchToFrontBtn.addEventListener(
      `click`,
      this._switchImageToFront.bind(this)
    );
  }
  async _initApp() {
    try {
      appContainer.classList.add(`hidden`);
      await this._wait(2);
      loading.style.display = `none`;
      appContainer.classList.remove(`hidden`);
    } catch (err) {
      this._renderError(err);
    }
  }
  async _searchpokemon(event) {
    try {
      event.preventDefault();
      this.currentPokemon = searchField.value;
      const pokemon =
        typeof this.currentPokemon === `string`
          ? this.currentPokemon.toLowerCase()
          : typeof this.currentPokemon === `number`
          ? this.currentPokemon
          : undefined;

      if (!pokemon) throw new Error(`Pokemon Not Found.`);

      [this.pokeData, this.pokeSpecies] = await Promise.all([
        this._pokemonJSON(pokemon),
        this._pokeSpeciesJSON(pokemon),
      ]);

      // console.log(`pokeData:`, this.pokeData, `pokeSpecies:`, this.pokeSpecies);

      const html = `
            <figure class="pokemon-screen flex-col" >
              <img src="${this.pokeData?.sprites.front_default}" alt="${
        `${this.pokeData?.name}`.toUpperCase().split(`-`)[0]
      }" class="pokemon-img" />
              <h1 class="pokemon-name">
                <span>${
                  `${this.pokeData?.name}`.toUpperCase().split(`-`)[0]
                }</span>
              </h1>
            </figure>
            
      `;

      const html2 = `
              <h5 class="info-header">
              ${`${this.pokeData?.name}`.toUpperCase().split(`-`)[0]}'S INFO.
              </h5>
              <ul class="info-list grid">
                <li class="info-stat">Index No.     [<span> ${
                  this.pokeData?.id
                } </span>]</li>
                <li class="info-stat">Height.     [<span> ${
                  this.pokeData?.height
                } </span>]</li>
                <li class="info-stat">Experience.     [<span> ${
                  this.pokeData?.base_experience
                } </span>]</li>
                <li class="info-stat">Weight.     [<span> ${
                  this.pokeData?.weight
                } </span>]</li>
                <li class="info-stat">Capture Rate.     [<span> ${
                  this.pokeSpecies?.capture_rate
                } </span>]</li>
                <li class="info-stat">Happiness.     [<span> ${
                  this.pokeSpecies?.base_happiness
                } </span>]</li>
                <li class="info-stat">Habitat.     [<span>${
                  `
                  ${this.pokeSpecies?.habitat?.name ?? `n/a`}`
                    .toUpperCase()
                    .split(`-`)[0]
                } </span>]</li>
                <li class="info-stat">Colour.     [<span> ${`
                ${this.pokeSpecies?.color.name}`.toUpperCase()} </span>]</li>
                <li class="info-stat">Legendary.     [<span> ${
                  this.pokeSpecies?.is_legendary === true ? `YES` : `NO`
                } </span>]</li>
                <li class="info-stat">Mythical.     [<span> ${
                  this.pokeSpecies?.is_mythical === true ? `YES` : `NO`
                } </span>]</li>
              </ul>
      `;

      const html3 = `
        <h5 class="info-header">
      ${`${this.pokeData?.name}`.toUpperCase().split(`-`)[0]}'S MOVES.
              </h5>
              <ul class="info-list grid">
      ${this.pokeData?.moves
        .filter((_, i) => i < 10)
        .map((attack) => {
          return ` 
          <li class="info-stat moves">${attack.move.name}</li>
        `;
        })
        .join(``)}
        </ul>
      </div>`;

      const html4 = `
      <h5 class="info-header">
      ${`${this.pokeData?.name}`.toUpperCase().split(`-`)[0]}'S TYPE(S).
              </h5>
              <div class="pokemon-types grid">
              ${this.pokeData?.types
                .map((type) => {
                  return ` 
                  <div class="pokemon-type types--${
                    type.type.name
                  }">${`${type.type.name}`.toUpperCase()}</div>
                `;
                })
                .join(``)}
                </div>
              </div>`;

      const pokeEvo = await this._pokeEvolutionJSON(
        this.pokeSpecies?.evolution_chain.url
      );

      // console.log(`pokeEvo:`, pokeEvo);

      const html5 = `
      <h5 class="info-header">
      ${`${this.pokeData?.name}`.toUpperCase().split(`-`)[0]}'S EVOLUTION CHAIN.
              </h5>
              <h6 class="evo-state">
              <p>&darr; PREVIOUS FORM</p>
              <p class="next-form">NEXT FORM &darr;</p>
              </h6>
              <div class="pokemon-types grid-sm">
              <div class="evolution-header evo-from">
              ${`${
                this.pokeSpecies?.evolves_from_species?.name ?? `origin Form`
              }`.toUpperCase()} </div>
              <div class="evolution-header evo-to">
              ${`${
                (pokeEvo?.chain.evolves_to?.[0]?.evolves_to?.[0]?.species
                  .name !== this.pokeData.name &&
                this.pokeSpecies?.evolves_from_species?.name
                  ? pokeEvo?.chain.evolves_to?.[0]?.evolves_to?.[0]?.species
                      .name
                  : pokeEvo?.chain.evolves_to?.[0]?.species.name ===
                    this.pokeData.name
                  ? `Final Form`
                  : typeof pokeEvo?.chain.evolves_to?.[0]?.species.name ===
                    `undefined`
                  ? `Final form`
                  : pokeEvo?.chain.evolves_to?.[0]?.species.name ===
                    this.pokeSpecies?.evolves_from_species?.name
                  ? `final form`
                  : pokeEvo?.chain.evolves_to?.[0]?.species.name ===
                    this.pokeData.species?.name
                  ? `final form`
                  : pokeEvo?.chain.evolves_to?.[0]?.species.name) ??
                `final form`
              }`.toUpperCase()} </div>
            </div>`;

      this._showComponents();
      buttonFigContainer.innerHTML = ``;
      buttonFigContainer.insertAdjacentHTML(`afterbegin`, html);
      infoCT1Container.innerHTML = ``;
      infoCT1Container.insertAdjacentHTML(`afterbegin`, html2);
      infoCT2Container.innerHTML = ``;
      infoCT2Container.insertAdjacentHTML(`afterbegin`, html3);
      infoCT3Container.innerHTML = ``;
      infoCT3Container.insertAdjacentHTML(`afterbegin`, html4);
      infoCT4Container.innerHTML = ``;
      infoCT4Container.insertAdjacentHTML(`afterbegin`, html5);
      searchField.value = ``;
      return this.pokeData;
    } catch (err) {
      // console.error(err);
      this._renderError(err);
    }
  }

  _wait(seconds) {
    return new Promise(function (resolve) {
      setTimeout(resolve, seconds * 1000);
    });
  }

  _timeout(seconds) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(
          new Error(`Request took too long! Timeout after ${seconds} second`)
        );
      }, seconds * 1000);
    });
  }

  async _pokemonJSON(pokemon) {
    // MOVES ARRAY NOT AVAILABLE FROM ID:808
    try {
      const pokeResponse1 = await Promise.race([
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`),
        this._timeout(10),
      ]);
      if (!pokeResponse1.ok) throw new Error(`Pokemon doesn't exist!`);
      return await pokeResponse1.json();
    } catch (err) {
      throw err;
    }
  }

  async _pokeSpeciesJSON(pokemon) {
    try {
      const pokeResponse2 = await Promise.race([
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`),
        this._timeout(10),
      ]);
      if (!pokeResponse2.ok) throw new Error(`Pokemon doesn't exist!`);
      return await pokeResponse2.json();
    } catch (err) {
      throw err;
    }
  }

  async _pokeEvolutionJSON(url) {
    // EVOLVE TO CHAIN DISJOINTED
    try {
      const pokeResponse3 = await Promise.race([fetch(url), this._timeout(10)]);
      if (!pokeResponse3.ok) throw new Error(`Pokemon doesn't exist!`);
      return await pokeResponse3.json();
    } catch (err) {
      throw err;
    }
  }

  async _pokeResourceListJSON() {
    try {
      const pokeResponse4 = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=1118/`
      );
      if (!pokeResponse4.ok)
        throw new Error(`${pokeResponse4.status}
         Pokemon doesn't exist!`);
      return await pokeResponse4.json();
    } catch (err) {
      throw err;
    }
  }

  _tabs(event) {
    event.preventDefault();

    const clicked = event.target.closest(`.info-tab`);

    // Guard Clause
    if (!clicked) return;

    // Clear Tab + Content Area
    infoTabs.forEach((tab, i, arr) => tab.classList.remove(`info-tab--active`));
    contents.forEach((oc, i, arr) =>
      oc.classList.remove(`info-content--active`)
    );

    // Activate Tab
    clicked.classList.add(`info-tab--active`);

    // Link Tab + Content
    document
      .querySelector(`.info-content--${clicked.dataset.tab}`)
      .classList.add(`info-content--active`);

    return this;
  }

  _fade(event) {
    if (event.target.classList.contains(`info-tab`)) {
      const link = event.target;
      const linkClosestParent = link.closest(`.info-tab-container`);
      const siblings = linkClosestParent.querySelectorAll(`.info-tab`);

      siblings.forEach((sibling, i, arr) => {
        if (sibling !== link) sibling.style.opacity = this;
      });
    }
    return this;
  }

  async _renderError(err) {
    const error = `
    <div class="error">ERROR<span>${err.message} \n Please try again! </span>
    <button class="modal modal-btn">X</button>
    </div>
    `;
    overlayErr.classList.remove(`hidden`);
    overlayErr.insertAdjacentHTML("afterbegin", error);
    this._hideSwitchBtns();
    searchField.value = ``;
    return this;
  }

  _switchOff() {
    infoContainer.classList.add(`hidden`);
    pokeContainer.classList.add(`hidden`);
    this._hideSwitchBtns();
    searchField.value = ``;
    return this;
  }

  _clearModalEsc(e) {
    if (e.key === "Escape" && !overlayErr.classList.contains("hidden")) {
      this._closeModal();
    }
    return this;
  }

  _closeModal() {
    overlayErr.classList.add("hidden");
    overlayErr.innerHTML = ``;

    return this;
  }

  _nextPokemon(event) {
    searchField.value = this.pokeData.id === 898 ? 1 : this.pokeData.id + 1;
    // console.log(searchField.value);
    this._searchpokemon(event, searchField.value);
  }

  _prevPokemon(event) {
    searchField.value = this.pokeData.id === 1 ? 898 : this.pokeData.id - 1;
    // console.log(searchField.value);
    this._searchpokemon(event, searchField.value);
  }

  async _switchImageToBack() {
    const html = `
             <figure class="pokemon-screen flex-col" >
               <img src="${this.pokeData?.sprites?.back_default}" alt="${
      `${this.pokeData?.name}`.toUpperCase().split(`-`)[0]
    }'S BACK IMAGE NOT AVAILABLE." class="pokemon-img" />
               <h1 class="pokemon-name">
                 <span>${
                   `${this.pokeData?.name}`.toUpperCase().split(`-`)[0]
                 }</span>
               </h1>
             </figure>
             
       `;

    buttonFigContainer.innerHTML = ``;
    buttonFigContainer.insertAdjacentHTML(`afterbegin`, html);

    return this;
  }

  _switchImageToFront() {
    const html = `
            <figure class="pokemon-screen flex-col" >
              <img src="${this.pokeData.sprites?.front_default}" alt="${
      `${this.pokeData?.name}`.toUpperCase().split(`-`)[0]
    }" class="pokemon-img" />
              <h1 class="pokemon-name">
                <span>${
                  `${this.pokeData?.name}`.toUpperCase().split(`-`)[0]
                }</span>
              </h1>
            </figure>
            
      `;

    buttonFigContainer.innerHTML = ``;
    buttonFigContainer.insertAdjacentHTML(`afterbegin`, html);

    return this;
  }

  _hideSwitchBtns() {
    switchToBackBtn.classList.add(`hidden`);
    switchToFrontBtn.classList.add(`hidden`);
    return this;
  }
  _showSwitchBtns() {
    switchToBackBtn.classList.remove(`hidden`);
    switchToFrontBtn.classList.remove(`hidden`);
    return this;
  }
  _showComponents() {
    infoContainer.classList.remove(`hidden`);
    pokeContainer.classList.remove(`hidden`);
    PokeMoveBtns.classList.remove(`hidden`);
    switchToBackBtn.classList.remove(`hidden`);
    switchToFrontBtn.classList.remove(`hidden`);
    return this;
  }
};

const pokemonApp = new App();
