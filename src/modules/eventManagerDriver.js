import EventManager from "../managers/EventManager.js";
function addGameMenuListeners() {
  EventManager.attachGameMenuHandlers();
}

export { addGameMenuListeners };
