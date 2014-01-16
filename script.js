/**
 *  BLiu1.tk
 *  
 *  Avoider Game
 *  http://bliu1.tk/pages/avoider/
 *  
 *  License:
 *  http://opensource.org/licenses/MIT
 *  Copyright (c) 2013-2014 BLiu1
 *  
 */

var playing = false,
    difficulty,
    points = 0,
    lives = 5,
    speed = 1,
    obstaclesAvoided = 0,
    characterPos = 1,
    level = 1,
    paused = false,
    altnr = true,
    collide = false,
    TO,
	getEl = function(el){return document.getElementById(el);},
	cb_addEvent = function(obj, evt, fnc) { // https://gist.github.com/eduardocereto/955642
		if (obj.addEventListener) {
			obj.addEventListener(evt, fnc, false);
			return true;
		} else if (obj.attachEvent) {
			return obj.attachEvent('on' + evt, fnc);
		} else {
			evt = 'on'+evt;
			if(typeof obj[evt] === 'function'){
				fnc = (function(f1,f2){
					return function(){
						f1.apply(this,arguments);
						f2.apply(this,arguments);
					}
				})(obj[evt], fnc);
			}
			obj[evt] = fnc;
			return true;
		}
		return false;
	};;

function hideOverlay(n){
	getEl("overlay" + n).style.display = "none";
}

function showMore(){
	getEl("b1").style.display = "block";
	getEl("b4").style.display = "block";
	getEl("b6").style.display = "block";
	getEl("b7").style.display = "block";
	getEl("showMore").style.display = "none";
}

function sLevel(d){
	hideOverlay(2);
	difficulty = d;
}

function sColor(charColor){
	hideOverlay(3);
	document.getElementsByTagName("style")[0].innerHTML = ".character { background-color:" + charColor + "}";
	startGame();
}

function startGame(){
	getEl("20-" + characterPos).className = "character"; //draws character
	playing = true;
	clearMessage();
	mainGame();
}

function mainGame(){
	
	// Error-Free Console Logging
	function ltc(what) {
		try {console.log(what);}
		catch (e) {}
		finally {return;}
	}
	// from http://css-tricks.com/snippets/javascript/error-free-firebug-logging/
	
	ltc("Difficulty:" + difficulty);
	
	setTimeout(gameTick, 500 * speed);
	
	function gameTick(){
		var c, i, j, k, o, rn, p, a;
		if(playing === false){return;}
		if(paused === true){return;}
		
		// clear character row of obstacles
		for(c=1; c<=10; c++){
			if(getEl("20-" + c).classname === "character"){
				getEl("20-" + c).classname = "character";
			}
			else{
				getEl("20-" + c).classname = "empty";
			}
		}
		
		// move obstacles down one row
		for(i=19; i>0; i--){ //for each row
			for(j=10; j>0; j--){ //for each column/cell
				k = i + 1;
				if(getEl(i + "-" + j).className === "obstacle" && getEl(k + "-" + j).className === "character"){
					collide = true;
				}
				if(getEl(k + "-" + j).className === "character"){ // if there is a character, don't erase it
				}else{
					getEl(k + "-" + j).className = getEl(i + "-" + j).className;  // move obstacle down
				}
				getEl(i + "-" + j).className = "empty";
			}
		}
		
		// draw new obstacles (in every other row)
		if(altnr === true){ // draw
			for(o=0; o< difficulty; o++){
				rn= Math.ceil(Math.random()*10); // random number/position
				if(getEl("1-" + rn).className === "empty"){ // draw a new one
					getEl("1-" + rn).className = "obstacle";
				}else{ // do not count this time
					o--;
				}
			}
			altnr = false;
		}else{ // do not draw
			altnr = true;
		}
		
		// check collision; end game?
		if(collide === true){
			lives--;
			getEl("lives").innerHTML = lives;
			if(lives === 0){
				endGame();
				return;
			}
		}
		
		// add points
		if(collide === false){
			p = true;
			for(a=1; a<=10; a++){
				if(getEl("20-" + a).className === "obstacle" && p === true){  // if there was an obstacle on the last row
					obstaclesAvoided++;
					p = false;
				}
			}
			
			if(p === false){
				points += 5;
				getEl("points").innerHTML = points;
			}
		}
		
		// level up
		if(obstaclesAvoided !== 0 && obstaclesAvoided % 20 === 0 && altnr === true){
			level++;
			speed = speed * 0.95;
			points = level * 10 + points;
			getEl("message").innerHTML = "<h4>Level Up!</h4><p>Level: " + level + "</p><p>+" + level*10 + " points</p>";
			clearMessage();
		}
		
		collide = false; // clear collision
		setTimeout(gameTick, 500 * speed);
	}
}

document.onkeydown = function(e){
	var keynum, t;
	if(window.event){keynum = e.keyCode;} // IE
	else if(e.which){keynum = e.which;}   // Firefox/Opera
	
	if(playing === false)               {return;}
	if(paused === true && keynum !== 80){return;}
	
	if(keynum === 37 || keynum === 39 || keynum === 80){
		getEl("20-" + characterPos).className = "empty"; // undraws character
	}else{
		return;
	}
	
	if(keynum === 37){ // move left
		if(characterPos === 1){ // loop around
			if(getEl("20-10").className === "obstacle"){ // checks for obstacle
				getEl("20-" + characterPos).className = "character"; // redraws character
				return;
			}else{
				characterPos = 10;
			}
		}else{
			t = characterPos - 1;
			if(getEl("20-" + t).className === "obstacle"){ // checks for obstacle
				getEl("20-" + characterPos).className = "character"; // redraws character
				return;
			}else{
				characterPos--;
			}
		}
	}else if(keynum === 39){ // move right
		if(characterPos === 10){ // loop around
			if(getEl("20-1").className === "obstacle"){ // checks for obstacle
				getEl("20-" + characterPos).className = "character"; // redraws character
				return;
			}else{
				characterPos = 1;
			}
		}else{
			t = characterPos + 1;
			if(getEl("20-" + t).className === "obstacle"){ // checks for obstacle
				getEl("20-" + characterPos).className = "character"; // redraws character
				return;
			}else{
				characterPos++;
			}
		}
	}else{
		if(paused === false){ // pause
			paused = true;
			getEl("message").innerHTML = "Paused...";
		}else{
			paused = false;
			getEl("message").innerHTML = "";
			mainGame();
		}
	}
	
	getEl("20-" + characterPos).className = "character"; // redraws character
	
};

function clearMessage(){
	TO = setTimeout(function(){getEl("message").innerHTML = "";}, 7000);
}

function displayHelp(){
	alert("Help and Information\n------------------------\n\nThe objective of this game is to use the arrow keys to move the character and avoid the falling obstacles./nFive points are awarded for each row of obstacles avoided./nAfter each twenty rows avoided, you level up. When you level up, the obstacles fall 5% faster, and 10 times the level number is added to your score./nIf you are hit by an obstacle head on, then one life is taken away. If you bump into one from the side, it stops you. Once you have no more lives, the game stops./nTo pause, press p.");
}

function endGame(){
	playing = false;
	clearTimeout(TO);
	getEl("message").innerHTML = "<span id='gameover'>Game Over</span><p><a href='./'>Play Again?</a></p>";
}

function createTable(rows, columns){ // create table
	var tableContent = "", i, j;
	for(i = 1; i <= rows; i++){
		tableContent += "<tr>";
		for(j = 1; j <= columns; j++){
			tableContent += "<td id='" + i + "-" + j + "' class='empty'></td>";
		}
		tableContent += "</tr>";
	}
	getEl("mainTable").innerHTML = tableContent;
}

// create table and add event listeners unobtrusively
createTable(20, 10);
cb_addEvent((getEl("start")),    "click", function(){hideOverlay(1)   });
cb_addEvent((getEl("help1")),    "click", function(){displayHelp()    });
cb_addEvent((getEl("help2")),    "click", function(){displayHelp()    });
cb_addEvent((getEl("showMore")), "click", function(){showMore()       });
cb_addEvent((getEl("b1")),       "click", function(){sLevel(1)        });
cb_addEvent((getEl("b2")),       "click", function(){sLevel(2)        });
cb_addEvent((getEl("b3")),       "click", function(){sLevel(3)        });
cb_addEvent((getEl("b4")),       "click", function(){sLevel(4)        });
cb_addEvent((getEl("b5")),       "click", function(){sLevel(5)        });
cb_addEvent((getEl("b6")),       "click", function(){sLevel(6)        });
cb_addEvent((getEl("b7")),       "click", function(){sLevel(7)        });
cb_addEvent((getEl("c1")),       "click", function(){sColor("#FF0000")});
cb_addEvent((getEl("c2")),       "click", function(){sColor("#00FF00")});
cb_addEvent((getEl("c3")),       "click", function(){sColor("#0000FF")});
cb_addEvent((getEl("c4")),       "click", function(){sColor("#FF00FF")});
cb_addEvent((getEl("c5")),       "click", function(){sColor("#FFFF00")});
cb_addEvent((getEl("c6")),       "click", function(){sColor("#00FFFF")});
cb_addEvent((getEl("c7")),       "click", function(){sColor("#FFFFFF")});
