



var newLevel = function(walls = [],nrandWalls = 0,targetLength = 50, levelCompleteValue = 100, maxFood = 3, foodValue = 3, width = 20, height = 20, scale = 30) {
  this.walls = walls;
  this.maxFood = maxFood;
  this.foodValue = foodValue;
  this.nrandWalls = nrandWalls;
  this.targetLength = targetLength;
  this.levelCompleteValue = levelCompleteValue;
  this.width = width;
  this.height = height;
  this.scale = scale;
}


var newSnake = function(pos = [111]){
  this.dir = '';
  this.lastDir = '';
  this.length = pos.length;
  this.pos = pos;
}


var newPlayer = function(id = 1, htmlID = 'player1', addlength = 3) {
  this.id = id;
  this.htmlID = htmlID;
  this.addLength = addlength;
  this.grid = [];
  this.food = [];
  this.walls = [];
  this.portal = [];
  this.prevLevelScore = 0;
  this.levelNo = 0;
  this.level = 0;
  this.snake = new newSnake();
}

var levels = {};

levels.singlePlayer = [];
levels.singlePlayer.push(new newLevel([], 0, 30, 50, 5));
levels.singlePlayer.push(new newLevel([], 10, 50, 50));
levels.singlePlayer.push(new newLevel([], 20, 60, 100));
levels.singlePlayer.push(new newLevel([145,146,147,148,149,150,151,152,153,154,155], 10, 70, 75));
levels.singlePlayer.push(new newLevel([140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159], 0, 70, 100, 2));
levels.singlePlayer.push(new newLevel([140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,10,30,50,70,90,110,130,170,190,210,230,250,270,290,310,330,350,370,390], 0, 60, 100, 2));
levels.singlePlayer.push(new newLevel([140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159], 8, 75, 150, 2));
levels.singlePlayer.push(new newLevel([140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,10,30,50,70,90,110,130,170,190,210,230,250,270,290,310,330,350,370,390], 8, 75, 150, 2));
levels.singlePlayer.push(new newLevel([140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,10,30,50,70,90,110,130,170,190,210,230,250,270,290,310,330,350,370,390], 0, 100, 200, 1, 9));
levels.singlePlayer.push(new newLevel([100,101,102,103,104,105,106,107,108,212,213,214,215,216,217,218,219,300,301,302,303,304,305,306,307,308,10,30,50,70,90,110,130,170,190,210,230,250,270,290,310,330,350,370,390], 0, 100, 200, 1, 1));
levels.singlePlayer.push(new newLevel([], 45, 250, 200, 5, 4, 30, 30, 20));
levels.singlePlayer.push(new newLevel([300,301,302,303,304,305,306,307,308,309,310,10,40,70,100,130,160,190,220,250,280,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,620,621,622,623,624,625,626,627,628,629,650,680,710,740,770,800,830,860,890], 0, 250, 200, 3, 4, 30, 30, 20));

levels.cooperative = levels.singlePlayer;
levels.race = levels.singlePlayer;

levels.vs = [];
levels.vs.push(new newLevel([], 0, 30, 400, 5, 1));
levels.vs.push(new newLevel([], 0, 30, 400, 5, 1, 30, 30));

var game = {}

game.score = 0
game.highscore = 0;
game.speed = 120;

game.levelNo = 1;
game.players = 1;
game.cooperative = true;

game.player = [
  new newPlayer(1,'player1'),
  new newPlayer(2,'player2')
]

game.portal = function(player){};

function eatFood(player){};

function reset(player, nextLevel = 0) {
  
  
  
  if(nextLevel === 0){
    game.score = 0
  }
  player.levelNo = nextLevel + 1;
  console.log(player.levelNo)
  
  player.level = JSON.parse(JSON.stringify(levels[game.mode][nextLevel]));

  player.walls = player.level.walls;
  player.food = [];
  player.portal = [];
  player.grid = [];
  player.grid = new Array(player.level.width * player.level.height);
  
  player.snake = new newSnake();
  for(var i in player.walls){
    player.grid[player.walls[i]] = 3;
  }
  for(var i in player.snake.pos){
    player.grid[player.snake.pos[i]] = 2;
  }
  
  if(game.mode === 'cooperative'){
    addFood(player, Math.ceil(player.level.maxFood / 2))
  } else {
    addFood(player, player.level.maxFood)
  }
  
  
  d3.select('#' + player.htmlID)
    .selectAll("*").remove();
  
  var gameUI = d3.select('#' + player.htmlID)
  
  var svg = gameUI.append('svg')
    .attr('width', player.level.width * player.level.scale)
    .attr('height', player.level.height * player.level.scale)
    .attr('background', 'white');
  
  svg.append('g').append('rect')
    .attr('width', player.level.width * player.level.scale)
    .attr('height', player.level.height * player.level.scale)
    .attr('fill', 'white')
  
  svg.append('g')
    .attr('id', "walls")
  
  svg.append('g')
    .attr('id', "food")
  
  svg.append('g')
    .attr('id', "portal")
  
  player.snakeUI = svg.append('g')
    .attr('id', "snake");
  
    player.snakeUI.selectAll('rect').data(player.snake.pos).enter()
    .append('rect')
      .attr('width',  player.level.scale)
      .attr('height', player.level.scale)
      .attr('fill', 'blue')
      .attr('x', function(d) {return( (d % player.level.width) *player.level.scale)})
      .attr('y', function(d) {return( (Math.floor(d / player.level.width)) *player.level.scale)})
    
  randomWalls(player, player.level.nrandWalls);
  wallTransition(player);
}


function getEmptyPosition(player) {
  var j = 0, k = 0, pos;
  while(j == 0 && k < 200){
    k++
    pos = Math.floor(Math.random() * player.level.width * player.level.height);
    if(player.grid[pos] === 0 || player.grid[pos] === undefined){
      j = 1;
    }
  } 
  if(k == 200) {
    return
  }
  return pos;
  
}

function randomWalls(player, n = 10) {
  
  var pos;
  for(var i=0;i < n; i++){
    pos = getEmptyPosition(player);
    if(pos !== undefined) {
      player.grid[pos] = 3;
      player.walls.push(pos)
    }
  }
}

function addFood(player, n = 1){
  var food = d3.select('#' + player.htmlID + ' #food').selectAll('circle').data(player.food);
  food.exit().remove();
  var pos;
  for(var i=0;i < n; i++){
    pos = getEmptyPosition(player);
    if(pos !== undefined) {
      player.grid[pos] = 1
      player.food.push(pos)
    }
  }
}

function addPortal(player, n=1){

  var pos;
  for(var i=0;i < n; i++){
    pos = getEmptyPosition(player);
    if(pos !== undefined) {
      player.grid[pos] = 4;
      player.portal.push(pos)
    }
  }
  
  portalTransition(player)
}

function foodTransition(player) {
  
  var food = d3.select('#' + player.htmlID + ' #food').selectAll('circle').data(player.food);
  
  food
    .attr('cx', function(d) {return (d % player.level.width) * player.level.scale + (player.level.scale / 2)})
    .attr('cy', function(d) {return (Math.floor(d / player.level.width)) * player.level.scale + (player.level.scale / 2)})
    .attr('r', 10)
    .attr('fill', 'green');
  
  food.enter()
    .append('circle')
      .attr('cx', function(d) {return (d % player.level.width) * player.level.scale + (player.level.scale / 2)})
      .attr('cy', function(d) {return (Math.floor(d / player.level.width)) * player.level.scale + (player.level.scale / 2)})
      .attr('r', 0)
      .attr('fill', 'green')
      .transition(1500)
      .ease(function(t){return t})
        .attr('r', 10)
  
  food.exit().remove();
}


function portalTransition(player) {
  
  var portal = d3.select('#' + player.htmlID + ' #portal').selectAll('circle').data(player.portal)
    
  portal.enter()
    .append('circle')
      .attr('cx', function(d) {return (d % player.level.width) * player.level.scale + (player.level.scale / 2)})
      .attr('cy', function(d) {return (Math.floor(d / player.level.width)) * player.level.scale + (player.level.scale / 2)})
    .attr('r', 0)
    .attr('fill', 'green')
    .transition(1500)
      .ease(function(t){return t})
        .attr('r', 10)
    .transition(6000)
      .ease(function(t){ return t})
      .attr('r', 15)
      .attr('fill', 'red');
  
  portal.exit().remove()
}

function wallTransition(player) {
  
  var wall = d3.select('#' + player.htmlID + ' #walls').selectAll('rect').data(player.walls)
    
  /*wall
    .attr('width',  player.level.scale)
    .attr('height', player.level.scale)
    .attr('fill', 'black')
    .attr('x', function(d) {return( (d % player.level.width) *player.level.scale)})
    .attr('y', function(d) {return( (Math.floor(d / player.level.width)) *player.level.scale)});*/
  
  wall.enter()
    .append('rect')
      .attr('width',  0)
      .attr('height', 0)
      .attr('fill', 'black')
      .attr('x', function(d) {return( (d % player.level.width) *player.level.scale + player.level.scale / 2)})
      .attr('y', function(d) {return( (Math.floor(d / player.level.width)) *player.level.scale + player.level.scale / 2)})
      .transition()
        .duration(3000)
        .attr('width',  player.level.scale + 1)
        .attr('height', player.level.scale + 1)
        .attr('x', function(d) {return( (d % player.level.width) *player.level.scale)})
        .attr('y', function(d) {return( (Math.floor(d / player.level.width)) *player.level.scale)});
  
  wall.exit().remove()
}

function moveSnake(player) {
  var cur,nxt;
  // console.log(player.snake.pos)
  // edge cases // currently wrapping
  cur = player.snake.pos[player.snake.pos.length - 1]
  if(player.snake.dir === "up") {
    if(Math.floor(cur / player.level.width) == 0){
      nxt = cur % player.level.width + player.level.width * (player.level.height - 1)
    } else {
      nxt = cur - player.level.width
    }
  } else if(player.snake.dir == "left") {
    if(cur % player.level.width == 0) {
      nxt = cur + player.level.width - 1
    } else {
      nxt = cur - 1
    }
  } else if(player.snake.dir == "right") {
    if(cur % player.level.width == player.level.width - 1) {
      nxt = cur - player.level.width + 1
    } else {
      nxt = cur + 1
    }
  }  else { // down
    if(Math.floor(cur / player.level.width) == player.level.height - 1){
      nxt = cur % player.level.width
    } else {
      nxt = cur + player.level.width
    }
  }
  
  // console.log(nxt + ' grid value: ' + player.grid[nxt])
  player.snake.pos.push(nxt)
  
  if(player.grid[nxt] == 1){ // eat
    player.snake.length += player.level.foodValue;
    game.score += player.level.foodValue;
    var index = player.food.indexOf(nxt);
    player.food.splice(index, 1);
    game.eatFood(player);
  } 
  
  if(player.grid[nxt] == 2) { // hit self
    game.death(player);
    game.score = 0;
    return
  }
  if(player.grid[nxt] == 3) {// walls
    game.death(player);
    game.score = 0;
    return
  }
  if(player.grid[nxt] == 4){//portal
    game.score += player.level.levelCompleteValue;
    reset(player, newLevel = player.levelNo);
    return
  }
  player.grid[nxt] = 2
  
  if(player.snake.length < player.snake.pos.length){
    player.grid[player.snake.pos[0]] = 0
    player.snake.pos.shift()
  }
  
  
  
  var s = player.snakeUI.selectAll('rect').data(player.snake.pos);
  
  var sc = d3.scale.linear()
    .domain([0, 1])
    .range(['#FF0000', '#0000FF'])
  
  s.attr('fill', function(d,i) {
      return player.snake.pos.length > 1 ? sc(i / (player.snake.pos.length -1)) : "#0000FF";
    })
  //.transition()
  //    .duration(player.speed)
  //    .ease(function(t) {return t})
      .attr('width', player.level.scale + 1)
      .attr('height', player.level.scale + 1)
      .attr('x', function(d) {return( (d % player.level.width) *player.level.scale)})
      .attr('y', function(d) {return( (Math.floor(d / player.level.width)) *player.level.scale)})
  
  s.enter()
    .append('rect')
    .attr('fill', '#0000FF')
    .attr('width', (player.snake.dir === "up" || player.snake.dir === "down") ? player.level.scale + 1 : 0)
    .attr('height', (player.snake.dir === "up" || player.snake.dir === "down") ? 0 : player.level.scale + 1)
    .attr('x', function(d) {
      if(player.snake.dir === "left"){
        return( (d % player.level.width) * player.level.scale + player.level.scale);
      } else {
        return( (d % player.level.width) * player.level.scale);
      }
    })
    .attr('y', function(d) {
      if(player.snake.dir === "up"){
        return( (Math.floor(d / player.level.width)) *player.level.scale + player.level.scale);
      } else {
        return( (Math.floor(d / player.level.width)) *player.level.scale);
      }
    })
    //.transition()
    //  .duration(player.speed)
    //  .ease(function(t) {return t})
      .attr('width', player.level.scale + 1)
      .attr('height', player.level.scale + 1)
      .attr('x', function(d) {return( (d % player.level.width) *player.level.scale)})
      .attr('y', function(d) {return( (Math.floor(d / player.level.width)) * player.level.scale)})
    
  
  s.exit()
    .remove();
  
  
  player.snake.lastDir = player.snake.dir;
}



function onePlayer(){
  
  d3.select('#gameRegion').selectAll('*').remove()
  
  var region = d3.select('#gameRegion')
  
  var div = region.append('div')
    .classed({'col-xs-2': true, 'col-md-offset-4': true, center: true})
    
  div.append('h3')
      .attr('id','level')
      .html('Level: 1')
  
  div.append('h3')
    .attr('id','length')
    .html('Current Length: 2')

  div = region.append('div')
    .classed({'col-xs-2': true, center: true})
  
    div.append('h3')
      .attr('id','score')
      .html('Current score: 2')
  
  div.append('h3')
    .attr('id','highScore')
    .html('Highscore: 2')
    
  region.append('div')
    .classed({'col-xs-12': true})
    .attr('id','player1')
    .attr('style','text-align: center')
  
  div = region.append('div')
    .classed({'col-xs-4': true, 'col-xs-offset-4': true, center: true})
  
  div.append('div')
    .classed({'col-xs-4': true, center: true})
    .attr('id','player1')
    .attr('style','text-align: center')
    .append('button')
      .attr('id','reset')
      .classed({btn: true, 'btn-warning': true})
      .html('Reset')
  
  div2 = div.append('div')
    .classed({'col-xs-4': true, center: true})
    .attr('id','player1')
    .attr('style','text-align: center; margin-top: 30px;')
  
  div2.append('p')
    .html('Select Level:')
    .append('input')
      .attr('id','startLevel')
      .attr('type','number')
      .attr('min','1')
      .attr('max','12')
      .attr('value','1')
  
  div.append('div')
    .classed({'col-xs-4': true, center: true})
    .append('button')
      .attr('id','back')
      .classed({btn: true, 'btn-warning': true})
      .html('Back')
      .on('click', function(){
        chooseMode();
      })
  
  reset(game.player[0])
  
  game.players = 1;
  game.updateScore = function(player) {
    d3.select('#level').html('Level: ' + player.levelNo);
    d3.select('#length').html('Current Length: ' + (player.snake.length)  + ' / ' + player.level.targetLength);
    d3.select('#score').html('Current score: ' + game.score);

    if(game.score > game.highscore){
      game.highscore = game.score;
    }
    d3.select('#highScore').html(' Highscore: ' + game.highscore);
  }
  
  game.portal = function(player){
    if(player.snake.pos.length >= player.level.targetLength){
      if(player.portal.length < 1){
        addPortal(player);
      }
    }
  }
  game.addFood = function(player){
    if(player.food.length < player.level.maxFood){ 
      addFood(player);
    }
  }
  game.eatFood = eatFood;
  
  game.death = function(player){
    reset(player, player.levelNo - 1);
  };
  
  game.timer = setInterval(runGame, game.speed);
}


function twoPlayerRace(){
  
  d3.select('#gameRegion').selectAll('*').remove()
  
  var region = d3.select('#gameRegion')
  
  var div = region.append('div')
    .classed({'col-xs-6': true, center: true})
  
  div.append('div')
    .attr('style', 'height:40px')
  
  div.append('div')
    .classed({center: true})
    .append('h3')
      .attr('id', 'playerLevel1')
  
  div.append('div')
    .classed({'col-xs-12': true})
    .attr('id','player1')
    .attr('style','text-align: center')
  
  var div = region.append('div')
    .classed({'col-xs-6': true, center: true})
  
  div.append('div')
    .attr('style', 'height:40px')
  
  div.append('div')
    .classed({center: true})
    .append('h3')
      .attr('id', 'playerLevel2')
  
  div.append('div')
    .classed({'col-xs-12': true})
    .attr('id','player2')
    .attr('style','text-align: center')
  
  div = region.append('div')
    .classed({'col-xs-12': true, center: true})
    .append('button')
      .attr('id','back')
      .classed({btn: true, 'btn-warning': true})
      .html('Back')
      .on('click', function(){
        chooseMode();
      })
  
  reset(game.player[0], game.levelNo - 1)
  reset(game.player[1], game.levelNo - 1)
  
  game.players = 2;
  
  
  game.updateScore = function(player) {
    console.log('score')
    d3.select('#level').html('Level: ' + player.levelNo);
    d3.select('#length').html('Current Length: ' + (player.snake.length));
    d3.select('#score').html('Current score: ' + (player.prevLevelScore + player.snake.length));

    if(player.prevLevelScore + player.snake.length > game.highscore){
      game.highscore = player.prevLevelScore + player.snake.length;
    }
    d3.select('#highScore').html(' Highscore: ' + game.highscore);
    
  }
  
  game.death = function(player){
    reset(player, player.levelNo - 1);
  };
  
  game.addFood = function(player){
    if(player.food.length < player.level.maxFood){ 
      addFood(player);
    }
  }
  game.eatFood = eatFood;
  game.timer = setInterval(runGame, game.speed);
}



function twoPlayerCooperative(){
  
  d3.select('#gameRegion').selectAll('*').remove()
  
  var region = d3.select('#gameRegion')
  
  var div = region.append('div')
    .classed({'col-xs-6': true, center: true})
  
  div.append('div')
    .attr('style', 'height:40px')
  
  div.append('div')
    .classed({center: true})
    .append('h3')
      .attr('id', 'level')
  
  div.append('div')
    .classed({center: true})
    .append('h3')
      .attr('id', 'combinedLength')
  
  div.append('div')
    .classed({'col-xs-12': true})
    .attr('id','player1')
    .attr('style','text-align: center')
  
  var div = region.append('div')
    .classed({'col-xs-6': true, center: true})
  
  div.append('div')
    .attr('style', 'height:40px')
  
  div.append('div')
    .classed({center: true})
    .append('h3')
      .attr('id', 'score')
  
  div.append('div')
    .classed({center: true})
    .append('h3')
      .attr('id', 'highScore')
  
  div.append('div')
    .classed({'col-xs-12': true})
    .attr('id','player2')
    .attr('style','text-align: center')
  
  div = region.append('div')
    .classed({'col-xs-12': true, center: true})
    .append('button')
      .attr('id','back')
      .classed({btn: true, 'btn-warning': true})
      .html('Back')
      .on('click', function(){
        chooseMode();
      })
  
  reset(game.player[0], game.levelNo - 1)
  reset(game.player[1], game.levelNo - 1)
  
  game.players = 2;
  
  
  game.updateScore = function(player) {
    d3.select('#level').html('Level: ' + player.levelNo);
    d3.select('#combinedLength').html('Combined Length: ' + (game.player[0].snake.length + game.player[1].snake.length) + ' / ' + (2 * player.level.targetLength));
    d3.select('#score').html('Current score: ' + game.score);

    if(game.score > game.highscore){
      game.highscore = game.score;
    }
    d3.select('#highScore').html(' Highscore: ' + game.highscore);
  }
  
  game.portal = function(player){};
  
  game.addFood = function(player, n = 1){}
  game.eatFood = function(player, n = 1){
    addFood(game.player[2 - player.id], n)
  }
  
  game.death = function(player){
    reset(player, player.levelNo - 1);
  };
  
  game.timer = setInterval(runGame, game.speed);
}


function twoPlayerVs(){
  
  d3.select('#gameRegion').selectAll('*').remove()
  
  var region = d3.select('#gameRegion')
  
  var div = region.append('div')
    .classed({'col-xs-6': true, center: true})
  
  div.append('div')
    .attr('style', 'height:40px')
  
  div.append('div')
    .classed({center: true})
    .append('h3')
      .attr('id', 'playerScore1')
  
  div.append('div')
    .classed({'col-xs-12': true})
    .attr('id','player1')
    .attr('style','text-align: center')
  
  var div = region.append('div')
    .classed({'col-xs-6': true, center: true})
  
  div.append('div')
    .attr('style', 'height:40px')
  
  div.append('div')
    .classed({center: true})
    .append('h3')
      .attr('id', 'playerScore2')
  
  div.append('div')
    .classed({'col-xs-12': true})
    .attr('id','player2')
    .attr('style','text-align: center')
  
  div = region.append('div')
    .classed({'col-xs-12': true, center: true})
    .append('button')
      .attr('id','back')
      .classed({btn: true, 'btn-warning': true})
      .html('Back')
      .on('click', function(){
        chooseMode();
      })
  
  reset(game.player[0], game.levelNo - 1)
  reset(game.player[1], game.levelNo - 1)
  
  game.players = 2;
  
  
  game.updateScore = function(player) {
    if(player.score === undefined){
      player.score = 0;
    }
    console.log('score')
    d3.select('#playerScore' + player.id).html('Score: ' + player.score);
  }
  
  game.addFood = function(player){
    if(player.food.length < player.level.maxFood){ 
      addFood(player);
    }
  }
  
  game.death = function(player){
    var player2 = game.player[2-player.id]
    
    player2.score ++
    reset(player, player.levelNo - 1);
    reset(player2, player.levelNo - 1);
  };
  
  game.eatFood = function(player) {
    randomWalls(game.player[2 - player.id], 1);
    wallTransition(game.player[2 - player.id]);
  }
  game.timer = setInterval(runGame, game.speed);
}


function chooseMode() {
  
  clearInterval(game.timer);
  
  d3.select('#gameRegion').selectAll('*').remove()

  var region = d3.select('#gameRegion')
  
  div = region.append('div')
    .classed({'col-xs-4': true, 'col-xs-offset-4': true, center: true})
  
  div.append('button')
      .attr('id','onePlayer')
      .classed({btn: true, 'btn-success': true})
      .html('one Player')
      .on('click', function() {
        game.mode = "singlePlayer"
        onePlayer();
      })
  
  div.append('button')
      .attr('id','twoPlayerRace')
      .classed({btn: true, 'btn-success': true})
      .html('Two Player Race')
      .on('click', function(){
        game.mode = "race";
        twoPlayerRace();
  })
  
  div.append('button')
      .attr('id','twoPlayerCoop')
      .classed({btn: true, 'btn-success': true})
      .html('Two Player Co-op')
      .on('click', function(){
        game.mode = "cooperative";
        twoPlayerCooperative();
  })
  
  div.append('button')
      .attr('id','twoPlayerVs')
      .classed({btn: true, 'btn-success': true})
      .html('Two Player Vs')
      .on('click', function(){
        game.mode = "vs";
        twoPlayerVs();
      })
  
  div.append('div')
    .attr('style','height: 40px')
  
  div.append('p')
    .html('Time between moves (milliseconds): ')
    .append('input')
      .attr('id', 'gameSpeed')
      .attr('type', 'number')
      .attr('value', 120)
      .on("input", function() {
        game.speed = Number(this.value);
      })
  
    div.append('div')
    .attr('style','height: 40px')
  
  div.append('p')
    .html('Start level: ')
    .append('input')
      .attr('id', 'startLevel')
      .attr('type', 'number')
      .attr('value', game.levelNo)
      .on("input", function() {
        game.levelNo = Number(this.value);
      })
}

function runPlayer(player){
  
  // console.log(player.snake.dir)
  
  if(player.snake.dir !== ""){
    moveSnake(player);
  }

  game.addFood(player, 1);
  foodTransition(player);
  
  game.updateScore(player);
  
  
  game.portal(player);

}




function runGame() { 
  runPlayer(game.player[0], game.player[0].levelNo);
  if(game.players == 2) {
    runPlayer(game.player[1], game.player[1].levelNo);
  }
}



chooseMode();




$( document ).bind('keydown','w', function(){
  var player = game.player[0];
  player.snake.dir = player.snake.lastDir == 'down' ? player.snake.dir : 'up';
})



$( document ).bind('keydown','a', function(){
  var player = game.player[0];
  player.snake.dir = player.snake.lastDir == 'right' ? player.snake.dir : 'left';
})



$( document ).bind('keydown','s', function(){
  var player = game.player[0];
  player.snake.dir = player.snake.lastDir == 'up' ? player.snake.dir : 'down';
})


$( document ).bind('keydown','d', function(){
  var player = game.player[0];
  player.snake.dir = player.snake.lastDir == 'left' ? player.snake.dir : 'right';
})



$( document ).bind('keydown','up', function(){
  var player = game.player[game.players - 1];
  player.snake.dir = player.snake.lastDir == 'down' ? player.snake.dir : 'up';
})

$( document ).bind('keydown','left', function(){
  var player = game.player[game.players - 1];
  player.snake.dir = player.snake.lastDir == 'right' ? player.snake.dir : 'left';
})

$( document ).bind('keydown','down', function(){
  var player = game.player[game.players - 1];
  player.snake.dir = player.snake.lastDir == 'up' ? player.snake.dir : 'down';
})

$( document ).bind('keydown','right', function(){
  var player = game.player[game.players - 1];
  player.snake.dir = player.snake.lastDir == 'left' ? player.snake.dir : 'right';
})

$( document ).bind('keydown','p', function(){
  var player = game.player1;
  game.player[0].snake.dir = '';
  game.player[1].snake.dir = '';
})

d3.select('#reset').on('click', function(){
  var player = game.player[0];
  reset(player, d3.select('#startLevel').node().value - 1);
  d3.select('#startLevel').attr('max', levels.length);
})