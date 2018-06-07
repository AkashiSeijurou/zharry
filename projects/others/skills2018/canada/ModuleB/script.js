var initial_game = {
	score: 0,
	lives: 3,
	snake: [
		[0,0],
		[0,0],
		[0,0],
	],
	food: {
		exists: false,
		location: [-1, -1],
	},
	walls: [],
	direction: 0, // 0-Up, 1-Down, 2-Left, 3-Right
	sizeUp: 0,
	input: {
		pause: false,
		direction: -1,
		select: false,
	},
	state: {
		paused: true,
		currentMenu: 0, // 0-Welcome, 1-Paused, 2-LostLife, 3-GameOver, 4-Highscore
		selected: 0,
	},
	// Constants
	fps: 60,
	tps: 14,
	width: 0,
	height: 0,
	tileWidth: 24,
};
var game = JSON.parse(JSON.stringify(initial_game));
var canvas = document.getElementById("canvas");
var highscores = document.getElementById("highscores");
var submit = document.getElementById("submit");
var ctx = canvas.getContext('2d');
var i;
var gameActive = false;

function restartGame() {
	var newVars = JSON.parse(JSON.stringify(initial_game));
	game = newVars;
}
function resetSnake() {
	var newVars = JSON.parse(JSON.stringify(initial_game));
	game.snake = newVars.snake;
	game.food = newVars.food;
	game.direction = newVars.direction;
	game.sizeUp = newVars.sizeUp;
	game.input = newVars.input;
}

//0-Game,1-Highscores,2-SubmitHighscore
function showScreen(id) {
	canvas.style.display = "none";
	highscores.style.display = "none";
	submit.style.display = "none";
	gameActive = false;
	switch(id) {
		case 0:
			gameActive = true;
			canvas.style.display = "block";
			break;
		case 1:
			highscores.style.display = "block";
			break;
		case 2:
			submit.style.display = "block";
			break;
    }
}

function onLoad() {
	// Set Game Area
	showScreen(0);
	initial_game.width = parseInt(document.getElementById("gameWidth").innerHTML);
	initial_game.height = parseInt(document.getElementById("gameHeight").innerHTML);
	game = JSON.parse(JSON.stringify(initial_game));
	canvas.setAttribute("width", game.width * game.tileWidth);
	canvas.setAttribute("height", game.height * game.tileWidth + 100);
	
	// Find Walls
	initial_game.walls = JSON.parse(document.getElementById("walls").innerHTML);
	
	// Center Snake and Set as default
	initial_game.snake[0] = [ (game.width - (game.width % 2))/ 2, ((game.height - (game.height % 2))/ 2) - 1];
	initial_game.snake[1] = [ (game.width - (game.width % 2))/ 2, ((game.height - (game.height % 2))/ 2)];
	initial_game.snake[2] = [ (game.width - (game.width % 2))/ 2, ((game.height - (game.height % 2))/ 2) + 1];
	
	// Key Listeners
	window.addEventListener("keydown", function() {
		if (gameActive) {
			if (!game.state.paused) {
				if (event.keyCode == 87 || event.keyCode == 38) {
					// Up
					game.input.direction = 0;
				} else if (event.keyCode == 83 || event.keyCode == 40) {
					// Down
					game.input.direction = 1;
				} else if (event.keyCode == 65 || event.keyCode == 37) {
					// Left
					game.input.direction = 2;
				} else if (event.keyCode == 68 || event.keyCode == 39) {
					// Right
					game.input.direction = 3;
				}
			} else {
				if (event.keyCode == 87 || event.keyCode == 38) {
					// Up
					game.state.selected--;
				} else if (event.keyCode == 83 || event.keyCode == 40) {
					// Down
					game.state.selected++;
				} else if (event.keyCode == 13) {
					game.input.select = true;
				}
			}
			if (event.keyCode == 80) {
				game.input.pause = true;
			}
		}
	});
	
	// Start Game
	game = JSON.parse(JSON.stringify(initial_game));
	
	// Game Loop
	setInterval(function() {
		tick();
	}, 1000/game.tps);
	// Render Loop
	setInterval(function() {
		render();
	}, 1000/game.fps);
}

// Game Loop
function tick() {
	modFix();
	
	// Process Input
	if (game.input.direction != -1) {
		if (game.direction == 0 && game.input.direction != 1) {
			game.direction = game.input.direction;
		}
		if (game.direction == 1 && game.input.direction != 0) {
			game.direction = game.input.direction;
		}
		if (game.direction == 2 && game.input.direction != 3) {
			game.direction = game.input.direction;
		}
		if (game.direction == 3 && game.input.direction != 2) {
			game.direction = game.input.direction;
		}
	}
	game.input.direction = -1;
	if (game.input.pause) {
		if (game.state.currentMenu == 1) {
			game.state.paused = !game.state.paused;
		}
		game.input.pause = false;
	}
	
	// Run Game if not paused
	if (!game.state.paused) {
		// Move Snake
		var snakeLength = game.snake.length - 1;
		if (game.sizeUp > 0) {
			game.snake.push([game.snake[snakeLength][0], game.snake[snakeLength][1]]);
			game.sizeUp--;
		}
		for (i = snakeLength; i > 0; i--) {
			game.snake[i][0] = game.snake[i - 1][0];
			game.snake[i][1] = game.snake[i - 1][1];
		}
		var dx = 0, dy = 0;
		if (game.direction == 0)
			dy = -1;
		else if (game.direction == 1)
			dy = 1;
		else if (game.direction == 2)
			dx = -1;
		else if (game.direction == 3)
			dx = 1;
		game.snake[0][0] = game.snake[0][0] + dx;
		game.snake[0][1] = game.snake[0][1] + dy;

		// Collision
		var tryGameOver = false;
		//Food
		if (game.food.location[0] == game.snake[0][0] && game.food.location[1] == game.snake[0][1]) {
			game.sizeUp += 1;
			game.food.exists = false;
			game.score += 1;
		}
		// Boundaries
		if (game.snake[0][0] < 0 || game.snake[0][0] > game.width - 1 || game.snake[0][1] < 0 || game.snake[0][1] > game.height - 1) {
			tryGameOver = true;
		}
		// Self
		for (i = 1; i < game.snake.length; i++) {
			if (game.snake[0][0] == game.snake[i][0] && game.snake[0][1] == game.snake[i][1])
				tryGameOver = true;
		}
		//Walls
		for (i = 0; i < game.walls.length; i++) {
			if (game.snake[0][0] == game.walls[i][0] && game.snake[0][1] == game.walls[i][1])
				tryGameOver = true;
		}
		
		// Try Game Over
		if (tryGameOver) {
			resetSnake();
			game.lives--;
			game.state.paused = true;
			game.state.currentMenu = 2;
			if (game.lives <= 0) {
				game.state.currentMenu = 3;
			}
			tryGameOver = false;
		}

		// Spawn Food
		if (!game.food.exists) {
			var flag, genX, genY;
			do {
				flag = false;
				genX = (Math.random() * game.width +"").split(".")[0];
				genY = (Math.random() * game.height +"").split(".")[0];

				// Check if Food is overlapping
				for (i = 0; i < game.snake.length; i++) {
					if (game.snake[i][0] == genX && game.snake[i][1] == genY)
						flag = true;
				}
				for (i = 0; i < game.walls.length; i++) {
					if (game.walls[i][0] == genX && game.walls[i][1] == genY)
						flag = true;
				}
			} while (flag);
			game.food.exists = true;
			game.food.location[0] = genX;
			game.food.location[1] = genY;
		}
	} else {
		// Run Menu if game is paused
		if (game.input.select) {
			game.input.select = false;
			if (game.state.currentMenu == 0) {
				var selected = game.state.selected % 2;
				if (selected == 0) {
					game.state.paused = false;
					game.state.currentMenu = 1;
				} else if (selected == 1) {
					showScreen(1);
				}
			} else if (game.state.currentMenu == 1) {
				game.state.paused = false;
			} else if (game.state.currentMenu == 2) {
				game.state.paused = false;
				game.state.currentMenu = 1;
			} else if (game.state.currentMenu == 3) {
				var selected = game.state.selected % 2;
				if (selected == 0) {
					document.getElementById("yourScore").innerHTML = game.score;
					document.getElementById("score").value = game.score;
					showScreen(2);
				} else if (selected == 1) {
					restartGame();
				}
			}
			game.state.selected = 0;
		}
	}
}

// Render Loop
function render() {
	modFix();
					
	// Clear Frame
	ctx.clearRect(0, 0, game.width * game.tileWidth, game.height * game.tileWidth);
	
	// Draw Grid
	ctx.beginPath();
	ctx.strokeStyle = "lightgrey";
	for (i = 0; i < game.width + 1; i++) {
		ctx.moveTo(game.tileWidth * i ,0);
		ctx.lineTo(game.tileWidth * i , game.height * game.tileWidth);
	}
	for (i = 0; i < game.height + 1; i++) {
		ctx.moveTo(0, game.tileWidth * i);
		ctx.lineTo(game.width * game.tileWidth, game.tileWidth * i);
	}
	ctx.stroke();
	
	// Draw Snake
	ctx.fillStyle = "black";
	for (i = 0;i < game.snake.length; i++) {
		ctx.fillRect(game.snake[i][0] * game.tileWidth + 1, game.snake[i][1] * game.tileWidth + 1, game.tileWidth - 2, game.tileWidth - 2);
	}
	
	// Draw Food
	if (game.food.exists) {
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.arc(game.food.location[0] * game.tileWidth + game.tileWidth/2, game.food.location[1] * game.tileWidth + game.tileWidth/2, game.tileWidth / 2, 0, 2 * Math.PI);
		ctx.fill();
	}
	
	// Draw Walls
	ctx.fillStyle = "grey";
	for (i = 0;i < game.walls.length; i++) {
		ctx.fillRect(game.walls[i][0] * game.tileWidth + 1, game.walls[i][1] * game.tileWidth + 1, game.tileWidth - 2, game.tileWidth - 2);
	}
	
	// Draw HUD
	ctx.fillStyle = "white";
	ctx.fillRect(0, game.height * game.tileWidth, game.width * game.tileWidth, 100);
	ctx.fillStyle = "black";
	ctx.font = "18px 'Segoe UI'";
	ctx.fillText("Lives: " + game.lives, game.width / 2 * game.tileWidth, game.height * game.tileWidth + 40);
	ctx.fillText("Score: " + game.score, game.width / 2 * game.tileWidth, game.height * game.tileWidth + 65);
	
	// Draw Paused Menu
	if (game.state.paused) {
		ctx.fillStyle = "rgba(0,0,0,0.7)";
		ctx.textAlign= "center";
		
		// Draw backdrop
		ctx.fillRect(0, 0, game.width * game.tileWidth, game.height * game.tileWidth + 100);
		ctx.beginPath();
		if (game.state.currentMenu == 0) {
			// Title
			ctx.fillStyle = "white";
			ctx.font = "48px 'Segoe UI'";
			ctx.fillText("Snake!", game.width / 2 * game.tileWidth, 80)
			// Menu
			ctx.font = "18px 'Segoe UI'";
			ctx.fillText("Start Game", game.width / 2 * game.tileWidth, 150);
			ctx.fillText("High Scores", game.width / 2 * game.tileWidth, 200);
			ctx.fillText("____________", game.width / 2 * game.tileWidth, 150 + (50 * (game.state.selected % 2)));
			// Controls
			ctx.font = "28px 'Segoe UI'";
			ctx.fillText("Controls", game.width / 2 * game.tileWidth, 325);
			ctx.font = "18px 'Segoe UI'";
			ctx.fillText("WASD/Arrow Keys - Movement", game.width / 2 * game.tileWidth, 370);
			ctx.fillText("P - Pause Game", game.width / 2 * game.tileWidth, 400);
			ctx.fillText("Enter - Select Menu Item", game.width / 2 * game.tileWidth, 430);
		} else if (game.state.currentMenu == 1) {
			// Title
			ctx.fillStyle = "white";
			ctx.font = "38px 'Segoe UI'";
			ctx.fillText("Paused", game.width / 2 * game.tileWidth, 80)
			// Menu
			ctx.font = "18px 'Segoe UI'";
			ctx.fillText("Resume", game.width / 2 * game.tileWidth, 150);
			ctx.fillText("_________", game.width / 2 * game.tileWidth, 150);
		} else if (game.state.currentMenu == 2) {
			// Title
			ctx.fillStyle = "white";
			ctx.font = "38px 'Segoe UI'";
			ctx.fillText(game.lives + " Lives Remaining!", game.width / 2 * game.tileWidth, 80)
			// Menu
			ctx.font = "18px 'Segoe UI'";
			ctx.fillText("Resume", game.width / 2 * game.tileWidth, 150);
			ctx.fillText("_________", game.width / 2 * game.tileWidth, 150);
		} else if (game.state.currentMenu == 3) {
			// Title
			ctx.fillStyle = "white";
			ctx.font = "38px 'Segoe UI'";
			ctx.fillText("Game Over!", game.width / 2 * game.tileWidth, 80)
			// Menu
			ctx.font = "18px 'Segoe UI'";
			ctx.fillText("Submit Score", game.width / 2 * game.tileWidth, 150);
			ctx.fillText("Restart", game.width / 2 * game.tileWidth, 200);
			ctx.fillText("________", game.width / 2 * game.tileWidth, 150 + (50 * (game.state.selected % 2)));
		}
		ctx.stroke();
	}
}

function modFix () {
	game.state.selected = Math.abs(game.state.selected);
}