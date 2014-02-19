function updateBoards(){var a=["rotated-normal","rotated-90","rotated-180","rotated-270"],b=["oriented-normal","oriented-90","oriented-180","oriented-270"],c=rotateSequence(tic.sequence.check(),!0).slice(),d=[1,3,9,7];_.each(a,function(a,b){tic.rotation.setManually(d[b]);var e=rotateSequence(c,!1);putInDOM(e[tic.turn.check()],a)}),_.each(b,function(a,b){tic.rotation.setManually(d[b]);var e=handleOrientation(c[0],c[tic.turn.check()]);putInDOM(rotateSequence([e],!1),a)}),tic.rotation.set()}function putInDOM(a,b){$("#"+b).find("."+a).append(determineTemplate("sm-"+whatPiece()))}function whatPiece(){var a=tic.player.check(),b=tic.turn.check()%2===0,c="";return b?c="h"===a?"x":"o":b||(c="h"===a?"o":"x"),c}function dOMinate(){var a=["rotated-normal","rotated-90","rotated-180","rotated-270","oriented-normal","oriented-90","oriented-180","oriented-270"],b=_.template($("#sm-board").text());_.each(a,function(a){$(".sm-boards").append(b({_id:a}))})}function gameOver(a){if(checkForThree(tic.setsOfThree,0,0,a))return tic.turn.check()%2===0?endGame(a+" Wins","firstPlayerWins"):endGame(a+" Wins","secondPlayerWins");if(0===tic.emptySquares.check().length)return endGame("draw","draws");tic.turn.increment();var b=forcedMove("x").concat(forcedMove("o"));if(b.length>0){var c=9/tic.turn.check();tic.forced.increment(c)}}function endGame(a,b){tic.gameOver=!0,tic.stats.update("gamesPlayed"),tic.stats.update(a.split(" ").join("")),statsInDOM(),$(".winner").text(a.toUpperCase()+"!"),tic[b].add(rotateSequence(tic.sequence.check(),!0)).updateStat(tic.sequence.check(),"success"),tic.firstPlayerWins.updateStat(tic.sequence.check(),"overall"),tic.secondPlayerWins.updateStat(tic.sequence.check(),"overall"),tic.draws.updateStat(tic.sequence.check(),"overall")}function statsInDOM(){$("#wins").text(tic.stats.check("xWins")),$("#loss").text(tic.stats.check("oWins")),$("#draws").text(tic.stats.check("draw"))}function checkForThree(a,b,c,d){if(3===c)return!0;if(b>=a.length)return!1;var e=a[b][c];return $("#"+e).children().hasClass(d)?checkForThree(a,b,c+1,d):checkForThree(a,b+1,0,d)}function rotateSequence(a,b){var c=[];return _.each(a,function(a){c.push(b?tic.rotation.check().indexOf(a)+1:tic.rotation.check()[a-1])}),c}function squareType(a){var b=[1,3,7,9],c=[2,4,6,8];return b.indexOf(a)>-1?b:c.indexOf(a)>-1?c:[5]}function determineTemplate(a){return _.template($("#"+a).text())}function appendPiece(a,b){$(a).append(b)}function aiMove(){var a=forcedMove("o").concat(forcedMove("x")),b=a[0]||aiTactical()||aiRandom(tic.emptySquares.check().slice());processMove(b,"o")}function aiRandom(a){console.log("randomly form these squares: ",a);var b=Math.floor(Math.random()*a.length),c=a[b];return c}function forcedMove(a){var b=[];return _.each(tic.setsOfThree,function(c){var d=_.difference(c,tic[a].check());1===d.length&&tic.emptySquares.check().indexOf(d[0])>-1&&b.push(d[0])}),b}function aiTactical(){var a=rotateSequence(tic.sequence.check(),!0),b=findMatch(determineSequences().wins,a),c=findMatch(determineSequences().loss,a),d=findMatch(tic.draws.check(),a);return proVersesAnti(b,c)||proVersesAnti(d,c)||anti(c)}function proVersesAnti(a,b){return a.length>0&&b.length>0&&(a=compareMatches(a,b,tic.sequence.check().length)),a.length>0?processSquares(orientMactches(filterMatches(a))):void 0}function anti(a){if(a.length>0){console.log("we are avoiding a loser");var b=orientMactches(a),c=rotateSequence(b,!1);return 0===_.difference(tic.emptySquares.check(),c).length&&c.pop(),aiRandom(_.difference(tic.emptySquares.check(),c))}}function compareMatches(a,b,c){if(0===a.length)return a;var d=findMatch(b,_.first(a).sequence,0,[],c+1);return d.length>0?(console.log("some evil is afoot:  ",_.first(a).sequence[c]+" same as "+d[0].sequence[c]),console.log("compare the success: ",_.first(a).success[c]+" same as "+d[0].success[c]),_.first(a).success[c]>d[0].success[c]||_.first(a).success[c]===d[0].success[c]&&_.first(a).forced>d[0].forced?(console.log("force is strong in this one: ",_.first(a).forced+" vs "+d[0].forced),a):(console.log("weak sauce: ",_.first(a).forced+" vs "+d[0].forced),compareMatches(_.rest(a),b,c))):(console.log("no evil here"),a)}function filterMatches(a){return a=_.filter(a,function(b){return b.forced===a[0].forced})}function orientMactches(a){var b=[];return console.log("matches after filter: ",a),_.each(a,function(a){var c=tic.turn.check(),d=a.sequence[c];console.log("oriented mirror: ",a.oriented.mirror),console.log("oriented normal: ",a.oriented.normal),console.log("index at:    ",c),a.oriented.mirror>c&&a.oriented.normal>c?(console.log("this is when we allow for orientation swap"),b.push(handleOrientation(a.sequence[0],d),d)):a.oriented.mirror<c?(console.log("orientation is permanently mirror"),b.push(handleOrientation(a.sequence[0],d))):b.push(d),console.log("square(s) to choose from: ",rotateSequence(_.uniq(_.flatten(b)),!1))}),_.uniq(_.flatten(b))}function processSquares(a){return console.log("squares after push: ",a),0===tic.turn.check()?(console.log("first move",squareType(aiRandom(a))),aiRandom(squareType(aiRandom(a)))):(console.log("squares after orientation: ",a),aiRandom(_.intersection(tic.emptySquares.check(),rotateSequence(a,!1))))}function determineSequences(){return"c"===tic.player.check()?{wins:tic.firstPlayerWins.check(),loss:tic.secondPlayerWins.check()}:{wins:tic.secondPlayerWins.check(),loss:tic.firstPlayerWins.check()}}function huMove(){$(".square").click(function(){var a=parseInt($(this).attr("id"));tic.emptySquares.empty(a)&&!tic.gameOver&&(processMove(a,"x"),tic.gameOver||aiMove())})}function findMatch(a,b,c,d,e){return c=c||0,d=d||[],e=e||b.length,0===b.length||0===a.length||c>=e?a:(_.each(a,function(a){console.log("exact:    ",a.sequence[c]+" "+b[c]),console.log("oriented: ",handleOrientation(a.sequence[0],a.sequence[c])+" "+b[c]),a.sequence[c]===b[c]&&a.oriented.mirror>c?(10===a.oriented.normal&&(a.oriented.normal=handleOrientation(b[0],b[c])===a.sequence[c]?10:c),d.push(a)):handleOrientation(b[0],b[c])===a.sequence[c]&&(a.oriented.mirror=10===a.oriented.mirror?c:a.oriented.mirror,d.push(a))}),findMatch(d,b,c+1,[],e))}function handleOrientation(a,b){var c={input:[1,2,3,4,5,6,7,8,9],output:[1,4,7,2,5,8,3,6,9]},d={input:[1,2,3,4,5,6,7,8,9],output:[3,2,1,6,5,4,9,8,7]};return[1,3,7,9].indexOf(a)>-1?c.output[b-1]:[2,4,6,8].indexOf(a)>-1?d.output[b-1]:5===b?5:1===tic.sequence.check().length?squareType(b):handleOrientation(tic.sequence.check()[1],b)}function stats(a,b,c,d,e){if(!(d>=c)){var f=findMatch(a,rotateSequence(b,!0),d,[],d+1),g=_.max(_.map(f,function(a){return a[e][d]+1}));return _.each(f,function(a){a[e][d]=g}),stats(f,b,c,d+1,e)}}function setup(){return{newGame:function(){return{emptySquares:emptySquares(),turn:incrementInt(),forced:incrementInt(),sequence:currentSequence(),rotation:rotation(),x:recordTakenSquares(),o:recordTakenSquares(),gameOver:!1}},setsOfThree:[[1,2,3],[1,5,9],[1,4,7],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]],player:playerOrder(),firstPlayerWins:allSequences(),secondPlayerWins:allSequences(),draws:allSequences(),stats:gameStats()}}function emptySquares(){var a=[1,2,3,4,5,6,7,8,9];return{empty:function(b){var c=a.indexOf(b);return c>-1?!0:!1},remove:function(b){var c=a.indexOf(b);a.splice(c,1)},check:function(){return a}}}function incrementInt(){var a=0;return{increment:function(b){a+=b||1},check:function(){return a}}}function currentSequence(){var a=[];return{add:function(b){a.push(b)},check:function(){return a}}}function allSequences(){var a=[];return{add:function(b){addedTo=!0;var c=findMatch(a,b);return c.length>0?c[0].frequency+=1:a.push({sequence:b,frequency:1,forced:tic.forced.check(),success:zerosArray(tic.sequence.check()),overall:zerosArray(tic.sequence.check()),oriented:{normal:10,mirror:10}}),this},arrange:function(){return a=a.sort(function(a,b){return b.forced-a.forced}),this},updateStat:function(b,c){return stats(a,b,b.length,0,c),this},orient:function(){return _.each(a,function(a){a.oriented.normal=10,a.oriented.mirror=10}),this},check:function(){return a}}}function zerosArray(a){for(var b=[],c=0;c<a.length;c++)b.push(0);return b}function playerOrder(){var a=["c","h"];return{switchOrder:function(){a=a.reverse()},check:function(){return a[0]}}}function rotation(){var a=[],b=[{squares:[1,2],rotation:[1,2,3,4,5,6,7,8,9]},{squares:[3,6],rotation:[3,6,9,2,5,8,1,4,7]},{squares:[9,8],rotation:[9,8,7,6,5,4,3,2,1]},{squares:[7,4],rotation:[7,4,1,8,5,2,9,6,3]}];return{set:function(){var c=tic.sequence.check();a=1===c.length&&5===c[0]?b[Math.floor(4*Math.random())].rotation:c.length>1&&5===c[0]?_.find(b,function(a){return a.squares.indexOf(c[1])>-1}).rotation:_.find(b,function(a){return a.squares.indexOf(c[0])>-1}).rotation},setManually:function(c){5!==c&&(a=_.find(b,function(a){return a.squares.indexOf(c)>-1}).rotation)},check:function(){return a}}}function recordTakenSquares(){var a=[];return{add:function(b){a.push(b)},check:function(){return a}}}function gameStats(){var a={gamesPlayed:incrementInt(),xWins:incrementInt(),oWins:incrementInt(),draw:incrementInt()};return{update:function(b){a[b].increment()},check:function(b){return a[b].check()}}}function processMove(a,b){appendPiece("#"+a,determineTemplate("lg-"+b)),tic.emptySquares.remove(a),tic.sequence.add(a),tic.rotation.set(a),tic[b].add(a),updateBoards(),gameOver(b)}function startNewGame(){var a=function(){console.log("-- NEW GAME --"),tic=$.extend(tic,tic.newGame()),$(".square").html(""),$(".winner").html(""),tic.player.switchOrder(),tic.firstPlayerWins.arrange().orient(),tic.secondPlayerWins.arrange().orient(),tic.draws.arrange().orient(),"c"===tic.player.check()&&aiMove()};$(".new-game").click(a),a()}var tic=setup();$(function(){dOMinate(),huMove(),startNewGame()});