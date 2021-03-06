$(function() {
	// putting small boards in the DOM
	dOMinate();
    // set click events for person
    huMove();

    // sets/resets data from one game to the next
    startNewGame();
});

function startNewGame() {

	var clickNewGame = function() {
		console.log('-- NEW GAME --')
		// reset all emptySquares, turn, and gameOver
		tic = $.extend(tic, tic.newGame());

		$('.square').html('');
		$('.winner').html('');

		// changes order of which player goes first
		tic.player.switchOrder();

		// arrange and orient sequences
		tic.firstPlayerWins.arrange().orient();
		tic.secondPlayerWins.arrange().orient();
		tic.draws.arrange().orient();

		if(tic.player.check() === 'c') {
			// computer is first player, therefore starts game
			aiMove();
		}
	}

	$('.new-game').click(clickNewGame);

	clickNewGame();
}