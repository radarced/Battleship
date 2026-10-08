import EventManager from "../managers/EventManager.js";
function addGameMenuListeners() {
  EventManager.attachGameMenuHandlers();
}

function addEditorMenuListeners() {
  EventManager.attachInitialHandlers();
}

export { addGameMenuListeners, addEditorMenuListeners };
