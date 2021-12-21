# Brunel's Pokédex

------- OBJECTIVE:

MVP:

To create a user-friendly Pokédex that renders a Pokemon on screen with the ability for users to see the information about the Pokémon, it's fighting moves, class type and evolution chain. The Pokédex should allow users to move to the next/ previous Pokémon after their initial search input and have that Pokémon's information rendered on screen, as well as where possible to create a button that when clicked (labelled B) shows the back of the Pokémon and another that returns it to the front. The goal is to create a Pokédex close to the one from the anime.

------- TASKS:

DESIGN:
Create Pokédex in HTML and CSS emulating the Pokédex in the anime.
Decide on colours and create a root base for colours to be used.
Decide on how Pokédex will look at different screen sizes

BUILD PROJECT:
Study and finalise the API's needed in the project:

- https://pokeapi.co/api/v2/pokemon/
- https://pokeapi.co/api/v2/pokemon-species/
- https://pokeapi.co/api/v2/evolution-chain/

Set where the Data from these API's would be used in the application
Test different parts of the Pokémon API to find limitations and disjointments
Search for the Pokémon with the longest name and use to create a uniform look in design.

- Fletchinder.


Limit the number of moves rendered on screen using filter array method.
Split and take the first entry from the habitat array to keep habitat to one word.

------- PROBLEMS:

The Evolution chain API is disjointed so it would show the current Pokémon as its next form, sometimes having no information to render. This led to the next form part in the EVO tab showing up as undefined.

Solution: write some lines of code that would check a series of instances to see where the API became disjointed and have it return `FINAL FORM`.

API is due to update the information (mainly the moves) of Pokémon with an ID of 810+ so as of now it's an empty tab. When API updates this will update automatically.

Some Pokémon are missing back images and require an update from the API.

------- FUTURE PLANS:

Rebuild this project using React.
Implement Lazy loading or spinner for Pokémon Image Load.
Find a way to limit the number a clicks a user do going backwards/ forwards to reduce the number of fetch calls to the server.

CHECK IT OUT HERE -----> https://bruneljohnson.github.io/BrunelPokedex/
