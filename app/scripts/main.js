var tic = setup();

$(function() {
    // verifyAllThrees('x')

    // set click events for person
    huMove();

    // sets/resets data from one game to the next
    startNewGame()
});

function startNewGame() {

	var clickNewGame = function() {
		// reset all emptySquares, turn, and gameOver
		tic = $.extend(tic, tic.newGame());

		$('.square').html('');
		$('.winner').html('');

		tic.player.switchOrder();

		if(tic.player.check() === 'c') {
			// computer is first player, therefore starts game
			aiMove();
		}
	}

	$('.new-game').click(clickNewGame);

	clickNewGame();
}

function setup() {
	return {

		// all properties in object returned from newGame must be reset upon each new game
		newGame: function() {
			return {
				emptySquares:  emptySquares(),
				turn:          turnOrder(),
				sequence:      currentSequence(),
				rotation:      rotation(initiateRotation),
				x:             recordTakenSquares(),
				o:             recordTakenSquares(),
				// aiFPSequences: tic.firstPlayerSequences.check('wins'),
				// aiSPSequences: tic.secondPlayerSequences.check('wins'),
				gameOver:      false
			}
		},

		// all other properties must not be reset
		setsOfThree:           [[1,2,3], [1,5,9], [1,4,7], [2,5,8], [3,6,9], [3,5,7], [4,5,6], [7,8,9]],
		player:                playerOrder(),
		firstPlayerSequences:  allSequences(),
		secondPlayerSequences: allSequences(),
	}
}

// begin me them closures for setup

function emptySquares() {
	var emptySquares = [1,2,3,4,5,6,7,8,9];

	return {
		checkSquare: function(square) {
			var index = emptySquares.indexOf(square);

			if (index > -1) {
				return true;
			}
			return false;
		},

		remove: function(square) {
			var index = emptySquares.indexOf(square);
			emptySquares.splice(index, 1);
		},

		checkEmpty: function() {
			return emptySquares;
		}
 	}
}

function turnOrder() {
	var turnOrder = 0;

	return {
		increment: function() {
			turnOrder += 1;
		},

		check: function(player) {
			return turnOrder;
		}
	}
}

function currentSequence() {
	var sequence = [];

	return {
		add: function(square) {
			sequence.push(square)
		},

		check: function() {
			return sequence;
		}
	}
}

function allSequences(player) {
	var wins = [];
	var draws = [];

	return {
		add: function(list, item) {
			var sequence = findMatch(list, item, 0, [], item.length)

			if (sequence.length > 0) {
				// should only ever be one object inside sequence. All duplicate sequences have a frequency property that is incremented on each occurence
				sequence[0].frequency += 1;
			} else {
				list.push({
					sequence:  item,
					frequency: 1
				})
			}
		},

		arrange: function(list) {
			list = list.sort(function(a, b) {
				return b.frequency - a.frequency;
			})
		},

		check: function(list) {
			return list === 'wins' ? wins : draws;
		}
	}
}

function findMatch(list, sequence, index, current, length) {

	if (sequence.length === 0 || list.length === 0) {
		return list;
	}

	if (index >= length) {
		return list;
	}

	_.each(list, function(item) {
		console.log('exact:    ',item.sequence[index] + ' ' + sequence[index])
		console.log('oriented: ',handleOrientaion(item.sequence[0], item.sequence[index]) + ' ' + sequence[index])
		// if sequences aren't exactly the same, maybe they are a mirror of eachother -> check for orientation
		if (item.sequence[index] === sequence[index] || handleOrientaion(item.sequence[0], item.sequence[index]) === sequence[index]) {

			current.push(item)
		}
	})

	return findMatch(current, sequence, index + 1, [], length)
}

function handleOrientaion(orientation, square) {
	var indexFirst;
	var indexSecond;

	// if 5 is first, may need to check for that

	var corner = {
		first:  [1,2,3,5,6,9],
		second: [1,4,7,5,8,9]
	}

	var side = {
		first:  [1,2,4,5,7,8],
		second: [3,2,6,5,9,8]
	}

	// corner orientation
	if ([1,3,7,9].indexOf(orientation) > -1) {
		return returnRelated(corner)
	}

	if ([2,4,6,8].indexOf(orientation) > -1) {
		return returnRelated(side)
	}

	function returnRelated(o) {
		indexFirst  = o.first.indexOf(square)
		indexSecond = o.second.indexOf(square)
		return indexFirst > -1 ? o.second[indexFirst] : o.first[indexSecond];
	}
}


function playerOrder() {
	// playerOrder will be switched at the very beginning, so computer is set to first position initially
	var playerOrder = ['c', 'h']

	return {
		switchOrder: function() {
			playerOrder = playerOrder.reverse();
		},

		check: function() {
			return playerOrder[0];
		}
	}
}

function rotation(pred) {
	var rotation = [];

	var rotations = [
		{
			squares:  [1,2],
			rotation: [1,2,3,4,5,6,7,8,9]
		},
		{
			squares:  [3,6],
			rotation: [3,6,9,2,5,8,1,4,7]
		},
		{
			squares:  [9,8],
			rotation: [9,8,7,6,5,4,3,2,1]
		},
		{
			squares:  [7,4],
			rotation: [7,4,1,8,5,2,9,6,3]
		}
	]

	return {
		set: function(square) {
			if (pred()) {
				rotation = _.find(rotations, function(o){return o.squares.indexOf(square) > -1}).rotation
			}

		},

		check: function() {
			return rotation;
		}
	}
}

// the pred for rotation
function initiateRotation() {
	var sequence = tic.sequence.check()
	return (sequence.length === 1 && sequence[0] !== 5) || (sequence.length === 2 && sequence[0] === 5)
}

function recordTakenSquares() {
	var takenSquares = [];

	return {
		add: function(square) {
			takenSquares.push(square)
		},

		check: function() {
			return takenSquares;
		}
	}
}

// end me them closures
// end
// end
// end

// begin Human functionality

function huMove() {

	$('.square').click(function() {	

		var square = parseInt($(this).attr('id'));

		if (tic.emptySquares.checkSquare(square) && !tic.gameOver) {

			processMove(square, 'x');

			// if game isn't over, have computer move
			if (!tic.gameOver) {
				aiMove();
			}
		}
	})
}

// end Human functionality
// end
// end
// end

// begin AI functionality

function aiMove() {
	var forced = aiForced('o').concat(aiForced('x'))
	var wins = aiWins();
	var winningMove = (wins[0] && wins[0].sequence[tic.turn.check()])
	console.log('winning move: ', winningMove)

	// if forced contains any squares, if a win is forced, a winning square will be at index 0, otherwise a blocking square will be at index 0. (Win takes priority over block)
	// var square = forced[0] || (wins[0] && wins[0].sequence[0]) || aiRandom();
	var square = forced[0] || winningMove || aiRandom();
	processMove(square, 'o');
}

// choose random square since computer cannont make intelligent move
function aiRandom() {
	var emptySquares = tic.emptySquares.checkEmpty().slice();
	var choice = Math.floor(Math.random() * (emptySquares.length));
	var square = emptySquares[choice];

	return square;
}

// a forced block or win
function aiForced(piece) {
	var forced = [];

	_.each(tic.setsOfThree, function(set){
		var diff =  _.difference(set, tic[piece].check())
		if (diff.length === 1 && tic.emptySquares.checkEmpty().indexOf(diff[0]) > -1) {
			forced.push(diff[0])
		}
	})

	return forced;
}

// function aiTactical() {
// 	var wins = tic.firstPlayerSequences.check('wins');
// 	var loss = tic.secondPlayerSequences.check('wins');

// 	findMatch(wins, tic.sequence.check(), 0, [], tic.sequence.length);

// 	if (tic.emptySquares.checkEmpty().length === 9) {
// 		if (wins.length > 0) {
// 			return wins[0].sequence[0];
// 		}
// 	}
// }

function aiWins() {
	var wins = tic.firstPlayerSequences.check('wins');
	console.log('wins: ', wins)
	console.log('sequence: ', tic.sequence.check())
	console.log('converted sequence: ', convertSequence(tic.sequence.check() , true))
	var matches = findMatch(wins, convertSequence(tic.sequence.check(), true), 0, [], tic.sequence.check().length);
	console.log('matches: ', matches)
	return matches
}

// end AI functionality
// end
// end
// end

// processing to be performed after square is chosen by human or computer
function processMove(square, piece) {
	appendPiece('#' + square, determineTemplate(piece));
	tic.emptySquares.remove(square);
	tic.sequence.add(square)
	tic.rotation.set(square)
	tic[piece].add(square)

	console.log('rotation: ', tic.rotation.check())

	gameOver(piece)

	tic.turn.increment()
}

// game over

function gameOver(piece) {
	if (checkForThree(tic.setsOfThree, 0, 0, piece)) {
		$('.winner').text(piece.toUpperCase() + ' Wins!')

		record('wins');

	} else if (tic.emptySquares.checkEmpty().length === 0) {
		$('.winner').text('Draw!')

		record('draws');
	}	
}

// records sequence of moves as a win or draw for first or second player and converts that sequence to a normal rotation
function record(list) {
	tic.gameOver = true;

	if (tic.turn.check() % 2 === 0) {
		tic.firstPlayerSequences.add(tic.firstPlayerSequences.check(list), convertSequence(tic.sequence.check(), true))
	} else {
		tic.secondPlayerSequences.add(tic.secondPlayerSequences.check(list), convertSequence(tic.sequence.check(), true))
	}
}

// game over ^^

function checkForThree(allSets, set, order, piece) {

	if (order === 3) {
		// console.log('MATCH')
		return true;
	}

	if (set >= allSets.length) {
		// console.log('NO GOOD')
		return false;
	}

	var square = allSets[set][order]

	if ($('#' + square).children().hasClass(piece)) {
		// console.log('match',set,order)
		return checkForThree(allSets, set, order + 1, piece)
	} else {
		return checkForThree(allSets, set + 1, 0, piece)
	}
}

// takes a sequence and rotates it'
function convertSequence(sequence, direction) {
	var conversion = [];

	_.each(sequence, function(square) {
		conversion.push(direction ? tic.rotation.check().indexOf(square) + 1 : tic.rotation.check()[square - 1])
	})
	return conversion;
}

// functions just for checking tic.setsOfThree array -> example:
// var bumpSet = runEachSet(tic.setsOfThree, displaySet)
// bumpSet('o')

function verifyAllThrees(piece) {
	var bumpSet = runEachSet(tic.setsOfThree, displaySet);

	setInterval(function() {
    	bumpSet(piece)
    	checkForThree(tic.setsOfThree, 0, 0, piece)
    },1500)
}

function runEachSet(allSets, fun) {
	var i = 0;

	return function(piece) {
		i = i < allSets.length ? i : 0;

		$('.square').html('');

		fun(allSets[i], piece)
		i++;
	}
}

function displaySet(set, piece) {
	set.forEach(function(square) {
		var target = '#' + square;
		var template = determineTemplate(piece)
		appendPiece(target, template)
	})
}

function determineTemplate(piece) {
	return _.template($('#' + piece).text());
}

function appendPiece(target, template) {
	$(target).append(template)
}






