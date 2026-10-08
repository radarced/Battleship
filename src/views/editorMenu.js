export default `<div class="editorMenu mainContainer" data-gameState="menu">
      <div class="sTBwrapper">
        <button class="rotate" id="sTB1Rotate" data-board="1">
          Rotate Ships
        </button>
        <div class="shipsToBePlaced horizantal" id="sTBP1" data-board="1"></div>
      </div>
      <!-- player 1's ^ toBePlacedShips container -->
      <div class="boardWrapper">
        <div class="computerOrPlayer">
          <button
            class="playerChooseBtn clicked"
            data-player="1"
            data-choose="player"
          >
            Player
          </button>
          <button
            class="playerChooseBtn"
            data-player="1"
            data-choose="computer"
          >
            Computer
          </button>
        </div>
        <div class="menuBoard board" id="menuBoard1" data-player="1"></div>
      </div>
      <div class="maxParentSizeWrapper">
        <button class="play">Play</button>
      </div>

      <div class="sTBwrapper">
        <button class="rotate" id="sTB2Rotate" data-board="2">
          Rotate Ships
        </button>
        <div class="shipsToBePlaced horizantal" id="sTBP2" data-board="2"></div>
        <!-- player 2's ^ toBePlacedShips container -->
      </div>
      <div class="boardWrapper">
        <div class="computerOrPlayer">
          <button
            class="playerChooseBtn clicked"
            data-player="2"
            data-choose="player"
          >
            Player
          </button>
          <button
            class="playerChooseBtn"
            data-player="2"
            data-choose="computer"
          >
            Computer
          </button>
        </div>
        <div class="menuBoard board" id="menuBoard2" data-player="2"></div>
      </div>
    </div>`;
