/* javascript rock paper scissors */

var number_of_games = 0;
var player_score = 0;
var computer_score = 0;
var player_name = "";
function start_game(player_name){
    $("li").removeClass("selected");
    $(this).addClass("selected");
    rps_game(player_name);
}
$('#rock').click(function(){
  player_name = "rock";
  start_game(player_name);
});
$('#paper').click(function(){
  player_name = "paper";
  start_game(player_name);
});
$('#scissors').click(function(){
  player_name = "scissors";
  start_game(player_name);
});
  // player's choice name to a number
function name_to_number(player_name){
    if(player_name === "rock") {
      player_name = 0;
      return player_name;
  } else if (player_name === "paper") {
      player_name = 1;
      return player_name;
  } else if (player_name === "scissors") {
      player_name = 2;
      return player_name;
  }
}
  // computer's number to a name
function number_to_name(computer_number){
    var computer_name;
    if (computer_number === 0) {
      computer_name = "rock";
      return computer_name;
    } else if (computer_number === 1){
        computer_name = "paper";
        return computer_name;
    } else if (computer_number === 2){
        computer_name = "scissors";
        return computer_name;
    }
}
// GAME
function rps_game(player_name) {
    var computer_choice;
    var difference;
    var player_number;
    player_number = name_to_number(player_name);
    var computer_number = Math.floor(Math.random(0, 3) * 3);
    computer_choice = number_to_name(computer_number);
    difference = ((player_number-computer_number)-(Math.floor((player_number-computer_number)/3)*3));
    number_of_games +=1;

//  output winner message
    var outcome = $('.outcome h2');
    var win = $('.win h2');
    var loss = $('.loss h2');
    if (difference === 0 || difference === 1) {
        player_score += 1;
        win.html(player_score);
        loss.html(computer_score);
    } else if (difference === 2 || difference === 3) {
        computer_score +=1;
        win.html(player_score);
        loss.html(computer_score);
    }
    // reset game scores
    $('.reset').click(function() {
        number_of_games = 0;
        player_score = 0;
        computer_score = 0;
        $("li").removeClass("selected");
        win.html(player_score);
        loss.html(computer_score);
    });
}
