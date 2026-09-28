import UiManager from "./UiManager.js";
// ^^ this is going to be used to access the DOM references .
// as renderManager itself is not responsible for that it only cares about
// taking space and converting it into a visual display for the user .
// this singleton will essentially take care of all
// functionality which renders something on the DOM based upon state stored
// in code . it is basically an object with public methods
// that take the state - > render it accordingly to whatever state was passed .

// what it knows about : how to render each state .

let RenderManager = (() => {
  // boardNum represents which shipsContainer (1,2) is the one which needs to be rendered.
  function renderShipsContainer(shipsState, boardNum) {
    let domRefs = UiManager.getDomRefs();
    let shipsElKey = "menuShipsContainer" + boardNum;
    let shipsEl = domRefs[shipsElKey]; // this function will assume that this does exist
    shipsEl.innerHTML = ""; // reset it
    for (let ship of shipsState) {
      shipsEl.appendChild(ship.img);
      ship.img.style.transform = `rotate(${ship.rotation}deg)`;
    }
    shipsEl.classList.toggle("horizantal"); // these two lines toggle off the class that was already active and toggles on the one that was not and it matches it
    shipsEl.classList.toggle("vertical");
  }

  function renderRotateShipsContainer(boardNum) {
    let domRefs = UiManager.getDomRefs();
    let shipsElKey = "menuShipsContainer" + boardNum;
    let shipsEl = domRefs[shipsElKey]; // this function will assume that this does exist

    shipsEl.classList.toggle("horizantal"); // these two lines toggle off the class that was already active and toggles on the one that was not and it matches it
    shipsEl.classList.toggle("vertical");
  }

  // the entire menuBoard is going to remain as is the only objects that need to be
  // rendered on top of it or that need to rendered based upon state are the ships
  // that are placed on it.
  function renderMenuBoard(shipsState, boardNum) {}

  return { renderShipsContainer, renderMenuBoard };
})();

export default RenderManager;
