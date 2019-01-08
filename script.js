"use strict";

/*
Script-Map:
language storage
global constants declaration
global variable declaration
-User settings
main code
events
event handlers
functions
*/

/*
Identifiers in variable names:
b - boolean
n - number
s - string
a - array
o - object
el - DOM element
ev - event
h - event handler
f - function
ls - local storage
*/

/* LANGUAGE STORAGE */

const o_English = {
  resize: 'Need to restart game because of window resize.',
  settingsUnavaluable: 'Sorry, settings dont avaluable at your browser',
  rotation: 'Need to restart game because of the screen rotation.',
  startInfo: 'Find the treasure by clicking on game field',

  clickMessageStartHot: 'Hot, ',
  clickMessageStartWarm: 'Warm, ',
  clickMessageStartCold: 'Cold, ',
  clickMessageStartEnd: ' attempts left',

  winMessageStart: 'Good game! You found the treasure on ',
  winMessageGuessNumEndingTh: 'th attempt.',
  winMessageGuessNumEndingRd: 'rd attempt.',
  winMessageGuessNumEndingNd: 'nd attempt.',
  winMessageGuessNumEndingSt: 'st attempt.',
  winMessageEndingFirst: ' You a lucky one ;)',
  winMessageEndingLast: ' On last click!',
  winMessageEndingGood: ' Good result!',
  winMessageEndingNice: ' Nice result!',
  winMessageEndingWell: ' Very well!',

  endMessageTimer: `Time is over. You're close. Better luck next time ;)`,
  endMessageOutofAttempts: `Attempts have ended. You're close. Better luck next time ;)`,

  //interface
  title_lang: 'Find the treasure game',
  timer: ' sec.',
  settings_headline_lang: 'Settings',
  option_vivibility_lang: 'Visibility',
  option_language_lang: 'Language',
  option_size_lang: 'Circles size',
  option_audio_lang: 'Audio',
  set_lang: 'Set',
  easteregg: 'created by',
  month_lang: 'dec'
}

const o_Russian = {
  resize: 'Нужен ретарт игры из-за изменения размера окна',
  settingsUnavaluable: 'Извините, настройки не доступны на вашем браузере',
  rotation: 'Нужен ретарт игры из-за изменения ориентации устройства',
  startInfo: 'Найди клад, кликая по игровому полю',

  clickMessageStartHot: 'Горячо, ',
  clickMessageStartWarm: 'Тепло, ',
  clickMessageStartCold: 'Холодно, ',
  clickMessageStartEnd: ' попыток осталось',

  winMessageStart: 'Хорошо сыграно! Клад найден на ',
  winMessageGuessNumEndingTh: 'ой попытке.',
  winMessageGuessNumEndingRd: 'ей попытке.',
  winMessageGuessNumEndingNd: 'ой попытке.',
  winMessageGuessNumEndingSt: 'ой попытке.',
  winMessageEndingFirst: ' Ты счастливчик! ;)',
  winMessageEndingLast: ' На последней попытке!',
  winMessageEndingGood: ' Хороший результат!',
  winMessageEndingNice: ' Отличный результат!',
  winMessageEndingWell: ' Замечательно!',

  endMessageTimer: `Время вышло. Было близко. В следующий раз повезёт ;)`,
  endMessageOutofAttempts: `Попытки закончились. Было близко. В следующий раз повезёт ;)`,

  //interface
  title_lang: 'Игра "найди клад"',
  timer: ' сек.',
  settings_headline_lang: 'Настройки',
  option_vivibility_lang: 'Видимость',
  option_language_lang: 'Язык',
  option_size_lang: 'Размер кругов',
  option_audio_lang: 'Звуки',
  set_lang: 'Настроить',
  easteregg: 'создано',
  month_lang: 'дек'
}

/* LANGUAGE STORAGE END */


/* CONSTANTS DECLARATION */

//DOM element of game field
const el_GAME_FIELD = document.getElementById("gameField");
// top,right,bottom and left boundaries of game field regarding browser window
const o_GAME_FIELD_BOUNDARIES = {
  top: Math.floor(el_GAME_FIELD.getBoundingClientRect().top),
  right: Math.floor(el_GAME_FIELD.getBoundingClientRect().right),
  bottom: Math.floor(el_GAME_FIELD.getBoundingClientRect().bottom),
  left: Math.floor(el_GAME_FIELD.getBoundingClientRect().left)
};
// width and height of game field
const o_GAME_FIELD_SIZE = {
  width: $(el_GAME_FIELD).width(),
  height: $(el_GAME_FIELD).height()
};
// width and height of browser window
const o_WINDOW_SIZE = {
  "width" : $(window).width(),
  "height": $(window).height()
};

const o_SOUND_GUESS = new Audio('sounds/guess.wav');
const o_SOUND_WIN = new Audio('sounds/win.wav');
const o_SOUND_LOSE = new Audio('sounds/lose.wav');
const o_SOUND_CRASH = new Audio('sounds/crash.wav');

/* CONSTANTS DECLARATION END */

/* VARIABLE DECLARATION */

/* User settings (storage-check) */

let b_HideTargetCircle = true; // visibility from start game.true - hide / false - show
let o_Language = {}; // Rus or Eng
/*Means in how many times circles diameter will be
  fewer than lesser side of el_GAME_FIELD */
let n_CircleSize = 15;
let b_Audio = false;
/* User settings (storage-check) end */

/* values is assigned in the function fSetupConfig() 
all of them depends on n_CircleSize */
let o_Config = {
  n_CircleDiameter: 0,
  n_CircleRadius: 0,
  n_HotZone: 0, //count of circle diameters to 'Hot' (Red-color) zone
  n_WarmZone: 0, //count of circle diameters to 'Warm' (Yellow-color) zone
  n_InitialAttemptsCount: 0, //How many attempts player have from start
  n_AttemptsLeft: 0,
  n_TimerInitialValue: 0, // Start value of timer in seconds
  n_TimerSecLeft: 0 //Current state of timer in seconds
}


let b_StopGame = false; // false - game continues; true - current game ends

let o_TreasureCoordinates = { //Coordinates of goal circle
  centerX: 0,
  centerY: 0,
  top: 0,
  left: 0
};
//Distance from current circle centre to goal circle centre in px
let n_DistanceFromLastClickToTargetCircleCenter = 0;
let n_TimerIntevalId;
let b_StorageAvailable;
let b_TimerBackgroundChange = true;

//for shades
const a_SHADE_RANGE = [50,240]; //range color intensity. min 0, max 255
let s_Blue = ''; 
let s_Yellow = '';
let s_Red = ''; 
/* VARIABLE DECLARATION END */  

/*  MAIN CODE */

if ( fIsMobile() ) { fSetSettingsForMoblie(); }
fInitializeGame();
// for (let i = 0; i < 1000; i++)
//   fSpawnTreasure();

/*  MAIN CODE END */

/* EVENTS */

//click on game field
$(el_GAME_FIELD).click(hClickOnGameField);

//click on restart-game button
$(".button-again").click(hClickOnButtonAgain);

//click on settings button
$("#button-settings").click(hClickOnButtonSettings);

//click on settings-window close button 
$("#button-close").click(hClickOnButtonCloseSettings);

//click on span-button language
$("#language").click(hClickOnLanguageSpan);

//click on set-button in settings window
$(".button-set").click(hClickOnButtonSet);

//click on easter-egg span ( in footer '0' in year)
$("#visibility").click(hClickOnEasterEggSpan);

//click on easter-egg span ('by' in footer)
$("#easteregg").click( hEasterEggCrash );

//click on timer-element (Easter egg)
$(".timer").click(hClickOnTimer);

//window resize
window.addEventListener('resize', hResizeWindow);

//orientation of device changing 
window.addEventListener("orientationchange", hMobileOrientationChange, false);

/* EVENTS END*/

/* EVENT HANDLERS */

//Click on gameField event handler;
//Draw guess circle (if alowed), change counters, end game (depends on conditions)
function hClickOnGameField(event){ 
  if (b_StopGame) { //if game stop - dont do anything
    return;
  }

  //Distance from current circle centre to goal circle centre in px
  n_DistanceFromLastClickToTargetCircleCenter =
    fGetDistance(o_TreasureCoordinates.centerX,o_TreasureCoordinates.centerY,
    event.pageX,event.pageY); 
  const n_PROXIMITY_ZONE = fGetProximityZone(
    n_DistanceFromLastClickToTargetCircleCenter); 
  const s_GUESS_CIRCLE_COLOR = fGetColor(n_PROXIMITY_ZONE);
  const n_GUESS_CIRCLE_LEFT = event.pageX - o_Config.n_CircleRadius;
  const n_GUESS_CIRCLE_TOP = event.pageY - o_Config.n_CircleRadius;
  const S_GUESS_CIRCLE_CODE = fAssembleCircleCode(s_GUESS_CIRCLE_COLOR,
    n_GUESS_CIRCLE_LEFT, n_GUESS_CIRCLE_TOP);

  //add <div>-circle with filled values on game field
  $(el_GAME_FIELD).append(S_GUESS_CIRCLE_CODE); 
  $("#info").text( fGetClickMessage(n_PROXIMITY_ZONE) );

  //additional circle with shadow to animation effect of blink
  const s_SHADOW_COLOR = fGetColorShadow(n_PROXIMITY_ZONE);
  const s_SPECIFIC_ANIMATION_CODE = `id='animation' style='box-shadow: ` +
    `0px 0px 50px 15px ${s_SHADOW_COLOR};`;
  const s_GUESS_CIRCLE_ANIMATION_CODE = 
    fAssembleCircleCode(s_GUESS_CIRCLE_COLOR, n_GUESS_CIRCLE_LEFT,
    n_GUESS_CIRCLE_TOP, s_SPECIFIC_ANIMATION_CODE);

  if (b_Audio) o_SOUND_GUESS.play();
  fGuessCircleBlink(s_GUESS_CIRCLE_ANIMATION_CODE, 100);
  
  o_Config.n_AttemptsLeft--;

  const GAME_CONDITION = fCheckGameCondition(n_PROXIMITY_ZONE);

  if (GAME_CONDITION === 'continue') {
  	return;
  } else fEndGame(GAME_CONDITION);
}

//rotate img in button 0.5s and F5
function hClickOnButtonAgain() {
  $("#again").css('transform','rotate(360deg) scale(0.8)');
  setTimeout(function fReloadPage(){ location.reload(false) },500);
}

//if localStorage avaliable - show settings window
function hClickOnButtonSettings(){
  //storage check
  if (typeof(Storage) !== "undefined") { // Code for localStorage/sessionStorage.
    b_StorageAvailable = true;
  } else b_StorageAvailable = false;// Sorry! No Web Storage support..

  if (b_StorageAvailable)
    $(".settings-container").css('z-index', 2); /*show settings-window */
  else alert(o_Language.settingsUnavaluable);
}

// Hide Settings window
function hClickOnButtonCloseSettings(){ 
  $(".settings-container").css('z-index', -1); 
}

// Change text in span from "English" on "Русский" and vice versa
function hClickOnLanguageSpan(){
  if ( $("#language").text() === "English" ) $("#language").text("Русский");
    else if ( $("#language").text() === "Русский" )
      $("#language").text("English");
}

// Save settings to local storage, close settings-window and reload page
function hClickOnButtonSet() {
  //target visibility
  if ( $("#checkbox-visibility").prop("checked") === true ) {
    localStorage.setItem('ls_TargetVisibility', 'true');
  } else
    localStorage.setItem('ls_TargetVisibility', 'false');
  
  //language
  if ( $("#language").text() === 'English' ) {
    localStorage.setItem('ls_Language','english');
  } else 
    localStorage.setItem('ls_Language','russian');
  
  //circles size
  localStorage.setItem('ls_CirclesSize',
    document.getElementById("size_range").value);

  if ( $("#checkbox-audio").prop("checked") === true ) {
    localStorage.setItem('ls_Audio', 'true');
  } else
    localStorage.setItem('ls_Audio', 'false');
  
  $(".settings-container").css('z-index', -1); //hide window
  location.reload(false); // reload page, with new settings
}

//Easter egg: if target circle still hidden - show it
function hClickOnEasterEggSpan(){
  $("#treasure").fadeIn(100);
  $("#treasure-effect").fadeIn(100);
}

//ester egg - (Hedar, footer, circles and gameField fall)
function hEasterEggCrash(){
  b_StopGame = true;
  clearInterval(n_TimerIntevalId);
  if (b_Audio) o_SOUND_CRASH.play();
  $(".button-again").css('display', 'flex');

  $("body").css('overflow','hidden');
  $(".settings-container").css('z-index', -1);

  $(".circle").css('transition', '2s');
  $(".circle").css('transform', 'translateY(5000px)');

	$(".information").css('transform-origin', 'top left');
	$(".information").css('animation', 'hang_on_the_corner 2s ease-out forwards');

  $("#gameField").css('transform-origin', 'bottom');
	$("#gameField").css('animation', 'fall 1s cubic-bezier(1,.01,1,1) forwards');
	// setTimeout( function() { $(".button-again").css('display', 'flex'); }, 500)
	
  $(".footer").css('transform-origin', 'top left');
  $(".footer").css('animation', 'hang_on_the_corner 2s ease-out forwards');
}

// +1s to timer and animation
function hClickOnTimer(event){
  if (b_StopGame === true) return;
  b_TimerBackgroundChange = false;
  $("#timer-lang").text( ++o_Config.n_TimerSecLeft + o_Language.timer);
  $(".timer").css('background', `rgb(192,192,192)`);
  //add animated img "+1" and delete it after 1s
  const sCode = `<img id="one" style="position: absolute; width: 40px;` +
  `left: ${event.pageX-20}px; top: ${event.pageY-20}px; ` +
  `animation: example 1s linear forwards;" src="images/one.png">`;
  $(".timer").append(sCode);
  setTimeout( function(){ $("#one").remove() } , 1000);
}

//stop game after resize window
function hResizeWindow(){
  if (fIsMobile()) return;
  b_StopGame = true;
  clearInterval(n_TimerIntevalId);
  $("#info").text(o_Language.resize);
  $(".circle").remove();
  $(".button-again").css('display', 'flex'); //show button "again"
 
}

//stop game after orientation change
function hMobileOrientationChange() {
  b_StopGame = true;
  clearInterval(n_TimerIntevalId);
  $("#info").text(o_Language.rotation);
  $(".circle").remove();
  $(".button-again").css('display', 'flex');
}

/* EVENT HANDLERS END */


/* FUNCTIONS */

//check is it device mobile (with touchscreen). True - mobile/ false - desctop
function fIsMobile() { return ('ontouchstart' in document.documentElement); }


//special settings for mobile devices
function fSetSettingsForMoblie() {
  //difference - 'tapping' instead 'clicking'
  o_English.startInfo = 'Find the treasure by tapping on game field';
  o_Russian.startInfo = 'Найдите клад, тапая по игровому полю';
  //settings-window proportions and size, depends on orientation
  if (o_WINDOW_SIZE.height > o_WINDOW_SIZE.width) {
    $(".settings-window").css('width','60%');
    $(".settings-window").css('height','35%');
  } else {
    $(".settings-window").css('width','35%');
    $(".settings-window").css('height','60%');
  }
  //Increasing text and small images
  $("body").css('font-size','1.2em'); //if bigger than 1.2 - gap in bottom
  if (o_WINDOW_SIZE.width < o_WINDOW_SIZE.height) {
  	$(".settings-window").css('font-size','1.5em');
  } else $(".settings-window").css('font-size','1.2em');
  $("#button-settings").css('height','45px');
  $("#checkbox-visibility").css('transform','scale(3)');
  $("#button-close").css('transform-origin', 'right top');
  $("#size_range").css('transform-origin', 'left');
  $("#size_range").css('transform', 'scale(1.5,3)');
  $("#button-close").css('transform','scale(2)');
}

//Initializing game (set values to some global variables, clear all circles, 
//hide button 'restart game', reset click counters etc.)
function fInitializeGame(){
  //global variables assigned: b_HideTargetCircle, o_Language, n_CircleSize
  fSetDefaultOrUserSettings();
  //global variables used: o_Config
  fSetupConfig(n_CircleSize);
  //interface lang setting
  fSetLanguageForInterface();
  $("#gameField").css('margin',`10px ${o_Config.n_CircleRadius}px`);
  //remove from DOM all objects with class .circle
  $(".circle").remove();
  fSpawnTreasure();
  $(".button-again").css('display', 'none'); //Hide 'new game' button
  $("#info").text(o_Language.startInfo); //reset info
  $("#timer-lang").text(o_Config.n_TimerInitialValue + o_Language.timer);
  b_StopGame = false;
  fTimerWork();
}

/* if user already applied settings (match local storage variable exist) - set
that setting to global variable and to setting window. Or set default if user
did not set the settings yet
global variables used: b_HideTargetCircle, o_Language, n_CircleSize*/
function fSetDefaultOrUserSettings(){
  //Check and set settings for option Visability of goal-circle
  const b_SETTINGS_TREASURE_VISIBILITY =
    localStorage.getItem('ls_TargetVisibility');
  // user select - show target circle
  if ( b_SETTINGS_TREASURE_VISIBILITY === 'true' ) {
    b_HideTargetCircle = false;
    document.getElementById("checkbox-visibility").checked = true;
  } else { // false or null - hide target circle (null = (user dont do choise))
    b_HideTargetCircle = true;
    document.getElementById("checkbox-visibility").checked = false;
  }

  //Check and set settings for option Language
  const b_SETTINGS_LANGUAGE = localStorage.getItem('ls_Language');
  //option default (null) or user choise 'English'
  if ( b_SETTINGS_LANGUAGE === null || b_SETTINGS_LANGUAGE === 'english' ){
    o_Language = o_English;
    $("#language").text('English');
  } else if ( b_SETTINGS_LANGUAGE === 'russian') {
    o_Language = o_Russian;
    $("#language").text('Русский');
  }

  //Check and set settings for option Circle size
  const b_SETTINGS_CIRCLES_SIZE = localStorage.getItem('ls_CirclesSize');
  //User set something already
  if ( b_SETTINGS_CIRCLES_SIZE !== null){
    //( 30 -) is inversion for correct-logick adjustment "size_range" in setting
    n_CircleSize = 30 - b_SETTINGS_CIRCLES_SIZE;
    document.getElementById("size_range").value = b_SETTINGS_CIRCLES_SIZE;
  } else n_CircleSize = 15; //default

  //Check and set settings for option Audio
  const b_SETTINGS_AUDIO =
    localStorage.getItem('ls_Audio');
  //user select - show target circle
  if ( b_SETTINGS_AUDIO === 'true' ) {
    b_Audio = true;
    document.getElementById("checkbox-audio").checked = true;
  } else { // false or null - hide target circle (null = (user dont do choise))
    b_Audio = false;
    document.getElementById("checkbox-audio").checked = false;
  }
}

//assign values to global variables that depends on circle size
function fSetupConfig(Circle_Size) {
  o_Config.n_CircleDiameter = Math.floor(
    Math.min(o_GAME_FIELD_SIZE.width,o_GAME_FIELD_SIZE.height) / Circle_Size);
  o_Config.n_CircleRadius = o_Config.n_CircleDiameter / 2;
  o_Config.n_HotZone = Math.floor(Circle_Size / 5);
  o_Config.n_WarmZone = Math.floor(Circle_Size / 3 * 2);
  o_Config.n_InitialAttemptsCount = Math.floor(Circle_Size / 3 * 2);  //
  o_Config.n_AttemptsLeft = o_Config.n_InitialAttemptsCount;
  o_Config.n_TimerInitialValue = Circle_Size;
  o_Config.n_TimerSecLeft = o_Config.n_TimerInitialValue;
}

function fSetLanguageForInterface() {
  $("#title_lang").text(o_Language.title_lang);
  $("#settings_headline_lang").text(o_Language.settings_headline_lang);
  $("#option_visibility_lang").text(o_Language.option_vivibility_lang);
  $("#option_language_lang").text(o_Language.option_language_lang);
  $("#option_size_lang").text(o_Language.option_size_lang);
  $("#option_audio_lang").text(o_Language.option_audio_lang);
  $("#set_lang").text(o_Language.set_lang);
  $("#easteregg").text(o_Language.easteregg);
  $("#month_lang").text(o_Language.month_lang);
}

// Spawn ramdom-placed goal-circle with animated effect on game field. 
function fSpawnTreasure(){
  const s_TREASURE_CIRCLE_COLOR = 
    'radial-gradient(rgba(255,255,255,0.5) 10%, black 50%, green 60%, black 80%)';
  o_TreasureCoordinates.left = fGetRandomBetween(o_GAME_FIELD_BOUNDARIES.left
    + o_Config.n_CircleRadius, o_GAME_FIELD_BOUNDARIES.right
    - o_Config.n_CircleRadius);
  o_TreasureCoordinates.top = fGetRandomBetween(o_GAME_FIELD_BOUNDARIES.top,
    o_GAME_FIELD_BOUNDARIES.bottom);
  const s_SPECIFIC_TREASURE_CODE = `id='treasure' style='z-index: 2;`;

  const s_TREASURE_CIRCLE_CODE = fAssembleCircleCode(s_TREASURE_CIRCLE_COLOR,
    o_TreasureCoordinates.left, o_TreasureCoordinates.top,
    s_SPECIFIC_TREASURE_CODE);

  const s_EFFECT_CODE_SIZE = o_Config.n_CircleDiameter
    + o_Config.n_CircleDiameter / 4;
  const s_EFFECT_CODE_LEFT = o_TreasureCoordinates.left
    - o_Config.n_CircleDiameter / 8;
  const s_EFFECT_CODE_TOP = o_TreasureCoordinates.top
    - o_Config.n_CircleDiameter / 8;

  const s_TREASURE_EFFECT_CODE = 
    `<div class='rotate-shadows circle' id="treasure-effect" style='z-index:1;`+
    ` width: ${s_EFFECT_CODE_SIZE}px; height:${s_EFFECT_CODE_SIZE}px; ` +
    `top:${s_EFFECT_CODE_TOP}px; left:${s_EFFECT_CODE_LEFT}px'></div>`;

  $(el_GAME_FIELD).append(s_TREASURE_CIRCLE_CODE);
  $(el_GAME_FIELD).append(s_TREASURE_EFFECT_CODE);

  if (b_HideTargetCircle) {
    $("#treasure").hide();
    $("#treasure-effect").hide();
  } 

  o_TreasureCoordinates.centerX = o_TreasureCoordinates.left
    + o_Config.n_CircleRadius;
  o_TreasureCoordinates.centerY = o_TreasureCoordinates.top
    + o_Config.n_CircleRadius;
}

/*sub-function to fSpawnTreasure(), return random number betwen min and max,
 minus circle diameter (to avoid treasure circle going beyond gameField)*/
function fGetRandomBetween(min,max) {  
  var nRandomNumber = (max - min + 1 - o_Config.n_CircleDiameter)
    * Math.random() + min;
  nRandomNumber = Math.floor(nRandomNumber);
  return nRandomNumber; 
}

/*return div code of circle with styles.
 Ability add html code and stiles through inSpecific*/
function fAssembleCircleCode(inColor, inLeft, inTop, inSpecific) {
  if (inSpecific === undefined) {
  	inSpecific = `style='`;
  }
  const s_ASSEMBLED_STRING = 
    `<div class='circle' ${inSpecific} position: absolute; background-image:` +
    ` ${inColor}; width: ${o_Config.n_CircleDiameter}px; height: ` +
    `${o_Config.n_CircleDiameter}px; border-radius: ` +
    `${o_Config.n_CircleDiameter}px; top: ${inTop}px; left: ${inLeft}px'></div>`;
  return s_ASSEMBLED_STRING;
}

//Timer start work, with changing background-color every secoond
//if user added time with clicking on timer - color dont changing
//if time up - end game 
function fTimerWork(){
  const n_Shade_Color_Min = 192;
  const n_Shade_Color_Max = 255;
  const ShadeStep = (n_Shade_Color_Max - n_Shade_Color_Min) / 100;
  const SecondsStep = 100 / o_Config.n_TimerInitialValue;
  let Shade = n_Shade_Color_Min;
  let Color;
  
  function fTimerChange(){
    $("#timer-lang").text(--o_Config.n_TimerSecLeft + o_Language.timer);
    if (b_TimerBackgroundChange){
      Shade += Math.floor(SecondsStep * ShadeStep);    
      Color = `rgb(${Shade},${Shade},${Shade})`;
      $(".timer").css('background', Color);
    }
    if (o_Config.n_TimerSecLeft === 0) fEndGame('timer');
  }

  n_TimerIntevalId = setInterval(fTimerChange, 1000); 
}

//return distance between 2 points in px;
//Calculating by using Pythagorean theorem (c^2 = a^2 + b^2). 
function fGetDistance(x1,y1,x2,y2) { 
  var aSquared = (x1 - x2) ** 2;
  var bSquared = (y1 - y2) ** 2;
  return Math.floor(Math.sqrt(aSquared + bSquared));
}

// return: 'found' - treasure found;
//'hot' - click within o_Config.n_HotZone diameters
//'warm' - click within o_Config.n_WarmZone diameters;
//'cold' - click out of o_Config.n_WarmZone diameters
function fGetProximityZone(distance) {
  if (distance < o_Config.n_CircleDiameter) return 'found'; // treasure found

  const n_DIAMETERS_TO_TREASURE = Math.floor(distance / o_Config.n_CircleDiameter);
  if (n_DIAMETERS_TO_TREASURE < o_Config.n_HotZone) { // Red (Hot) zone
    return 'hot';
  } else if (n_DIAMETERS_TO_TREASURE < o_Config.n_WarmZone) { // Yellow (Warm) zone
    return 'warm';
  } else return 'cold'; // Blue (Cold) zone
}

//sub-function to hClickOnGameField().
//return color (string-code) for circle, depends on distance. 3 zones: blue-yellow-red
//and shade of color more intensive when close to target-circle 
function fGetColor(zone){
  const n_HotZone_LENGTH = o_Config.n_HotZone * o_Config.n_CircleDiameter;
  const n_WARM_ZONE_LENGTH = o_Config.n_WarmZone * o_Config.n_CircleDiameter;
  const n_MAX_LENGTH = fGetMaxDistance() - o_Config.n_CircleRadius;
  const n_COLD_ZONE_LENGTH = n_MAX_LENGTH - n_WARM_ZONE_LENGTH - n_HotZone_LENGTH;
  const n_ONE_PERCENT_Of_SHADE_RANGE = (a_SHADE_RANGE[1] - a_SHADE_RANGE[0]) / 100;
  const n_ONE_PERCENT_OF_MAX_LENGTH = n_MAX_LENGTH / 100;
  const n_PERCENT_OF_CURRENT_POINT = Math.floor(
    n_DistanceFromLastClickToTargetCircleCenter / n_ONE_PERCENT_OF_MAX_LENGTH);
  //shade intensity in range from a_SHADE_RANGE[0] to a_SHADE_RANGE[1],
  //depends on distantion from click (n_PERCENT_OF_CURRENT_POINT) to target circle
  const colorShade = Math.floor( n_ONE_PERCENT_Of_SHADE_RANGE *
    (100 - n_PERCENT_OF_CURRENT_POINT) + a_SHADE_RANGE[0]);
  
  s_Blue = `rgb(0,0,${colorShade})`;
  s_Yellow = `rgb(${colorShade},${colorShade},0)`;
  s_Red = `rgb(${colorShade},0,0)`;
     
  var sBlankCircleBlue = `radial-gradient(rgba(255,255,255,0.5), ${s_Blue}, black 95%)`;
  var sBlankCircleYellow = `radial-gradient(rgba(255,255,255,0.5), ${s_Yellow}, black 95%)`;
  var sBlankCircleRed = `radial-gradient(rgba(255,255,255,0.5), ${s_Red}, black  95%)`;
   
  if (zone === 'hot' || zone === 'found') return sBlankCircleRed;
  if (zone === 'warm') return sBlankCircleYellow;
  if (zone === 'cold') return sBlankCircleBlue;
}

//return maximal distance from center of target circle to the gameField corner
function fGetMaxDistance() {
  const oCornersOfGameField = {
    left_top : [o_GAME_FIELD_BOUNDARIES.left, o_GAME_FIELD_BOUNDARIES.top],
    right_top : [o_GAME_FIELD_BOUNDARIES.right, o_GAME_FIELD_BOUNDARIES.top],
    right_bottom : [o_GAME_FIELD_BOUNDARIES.right,
      o_GAME_FIELD_BOUNDARIES.bottom],
    left_bottom : [o_GAME_FIELD_BOUNDARIES.left, o_GAME_FIELD_BOUNDARIES.bottom]
  }

  return Math.max(
    fGetDistance(o_TreasureCoordinates.centerX,
      o_TreasureCoordinates.centerY, oCornersOfGameField.left_top[0],
      oCornersOfGameField.left_top[1]),
    fGetDistance(o_TreasureCoordinates.centerX,
      o_TreasureCoordinates.centerY, oCornersOfGameField.right_top[0],
      oCornersOfGameField.right_top[1]),
    fGetDistance(o_TreasureCoordinates.centerX,
      o_TreasureCoordinates.centerY, oCornersOfGameField.right_bottom[0],
      oCornersOfGameField.right_bottom[1]),
    fGetDistance(o_TreasureCoordinates.centerX,
      o_TreasureCoordinates.centerY, oCornersOfGameField.left_bottom[0],
      oCornersOfGameField.left_bottom[1])
  	);
}

// return info-message, depends on click zone
function fGetClickMessage(zone) {
  if (zone === 'found') return;
  if ( (o_Config.n_AttemptsLeft - 1) < 5)
    o_Russian.clickMessageStartEnd = ' попытки осталось';
  if ( (o_Config.n_AttemptsLeft - 1) === 1)
    o_Russian.clickMessageStartEnd = ' попытка осталось';

  if (zone === 'hot') return (o_Language.clickMessageStartHot +
    (o_Config.n_AttemptsLeft - 1) + o_Language.clickMessageStartEnd);
  if (zone === 'warm') return (o_Language.clickMessageStartWarm +
    (o_Config.n_AttemptsLeft - 1) + o_Language.clickMessageStartEnd);
  if (zone === 'cold') return (o_Language.clickMessageStartCold +
    (o_Config.n_AttemptsLeft - 1) + o_Language.clickMessageStartEnd);
}

//Get color for blink-effect
function fGetColorShadow(zone){
  var sBlankCircleBlue = s_Blue;
  var sBlankCircleYellow = s_Yellow;
  var sBlankCircleRed = s_Red;

  if (zone === 'hot' || zone === 'found') return sBlankCircleRed;
  if (zone === 'warm') return sBlankCircleYellow;
  if (zone === 'cold') return sBlankCircleBlue;
}

//append div with shadow and delete it after ms miliseconds
let fGuessCircleBlink = (inCircleBlinkCode, ms) => {
  $(el_GAME_FIELD).append(inCircleBlinkCode);
  setTimeout( () => $("#animation").remove(), ms);
}

// return: true - win, false - lose, 'continue' - proceed game
let fCheckGameCondition = (zone) => {
  if (zone === 'found') {
    return true;
  } else if (o_Config.n_AttemptsLeft === 0) {
    return false;
  } else return 'continue';
}

//ending game
let fEndGame = (game_condition) => {
  b_StopGame = true;
  clearInterval(n_TimerIntevalId);
  $("#treasure").fadeIn(1000);
  $("#treasure-effect").fadeIn(1000);
  $(".button-again").css('display', 'flex'); //show button "again"
  fWriteEndMessage(game_condition);
  setTimeout(hEasterEggCrash, 60000);
}

//each message for win and loose
let fWriteEndMessage = (game_condition) => {
  if (o_WINDOW_SIZE.width < 900 || fIsMobile() )
    $("#info").css('font-size','1.5em');

  if (game_condition === true){
    $("#info").text(fGetWinMessage());
    if (b_Audio) o_SOUND_WIN.play();
  } else if (game_condition === 'timer'){
      $("#info").text(o_Language.endMessageTimer);
      if (b_Audio) o_SOUND_LOSE.play();
  } else {
      $("#info").text(o_Language.endMessageOutofAttempts);
      if (b_Audio) o_SOUND_LOSE.play();
    }  
}

//Assemling string of win outcome. Basic + №click + ending + performance comment
//return message to victory, depends on number of win click
function fGetWinMessage (){
  const n_ATTEMPTS_DONE = o_Config.n_InitialAttemptsCount - o_Config.n_AttemptsLeft;
  let sWinMessage = o_Language.winMessageStart + n_ATTEMPTS_DONE;
  let sGuessNumEnding = '';
  if (o_Config.n_AttemptsLeft < o_Config.n_InitialAttemptsCount - 3)
  	sGuessNumEnding = o_Language.winMessageGuessNumEndingTh;
    else if (o_Config.n_AttemptsLeft === o_Config.n_InitialAttemptsCount - 3)
    	sGuessNumEnding = o_Language.winMessageGuessNumEndingRd;
    else if (o_Config.n_AttemptsLeft === o_Config.n_InitialAttemptsCount - 2)
    	sGuessNumEnding = o_Language.winMessageGuessNumEndingNd;
    else if (o_Config.n_AttemptsLeft === o_Config.n_InitialAttemptsCount - 1)
    	sGuessNumEnding = o_Language.winMessageGuessNumEndingSt;

  sWinMessage += sGuessNumEnding;

  //on each zone own performance comment
  let n_ZONES = o_Config.n_InitialAttemptsCount / 3; 
  // has been found in first click
  if (o_Config.n_AttemptsLeft === o_Config.n_InitialAttemptsCount - 1)
    return sWinMessage + o_Language.winMessageEndingFirst;
  if (o_Config.n_AttemptsLeft === 0)  // has been found in last click
    return sWinMessage + o_Language.winMessageEndingLast;
   //has been found in last 1/3 of remaining clicks
  if (o_Config.n_AttemptsLeft < n_ZONES) {
    return sWinMessage + o_Language.winMessageEndingGood;
  } else if (o_Config.n_AttemptsLeft < (n_ZONES * 2) ){ //has been found in 2/3 of remaining clicks
    return sWinMessage + o_Language.winMessageEndingNice;
  } else return sWinMessage + o_Language.winMessageEndingWell; //has been found in first 1/3 of remaining clicks
}

/* FUNCTIONS END */