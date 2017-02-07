/* A simple interactive math flash card web application for memorizing
 * addition, subtraction, multiplication, and division tables. */

// The characters to use to represent the mathematical expressions
var plus="+";
var minus="-";
var times="\u00d7";
var divide="\u00f7";
var equals="=";

// The display font to use
var font="symbol";

// The font size used for text size calculations, in px
var fontSizeForSizing=32

/* The display alternates between the question screen, identified by
 * 0, and the answer screen, identified by 1. */
var nextScreen=0;

/* The configured minimum and maximum operand values, and the
 * operator */
var fcOperandMin;
var fcOperandMax;
var fcOperator;

/* The two operands and result for the current problem */
var fcOperand1;
var fcOperand2;
var fcResult;

var displayText; // the problem to be displayed

/* the width of the largest possible expression, in characters */
var expressionChars;

/* needed DOM elements */
var buttonsElement;
var problemCanvasElement;
var settingsElement;
var minValueElement;
var maxValueElement;
var operatorElement;

function init() {
    // Get references to the relevant html elements
    buttonsElement=document.getElementById("buttons");
    problemCanvasElement=document.getElementById("problemCanvas");
    settingsElement=document.getElementById("settings");
    minValueElement=document.getElementById("minValue");
    maxValueElement=document.getElementById("maxValue");
    operatorElement=document.getElementById("operator");

    // Compute the width of the widest character to be displayed.
    // This value is used to size the text during rendering.
    var drawingContext=problemCanvasElement.getContext("2d");
    
    drawingContext.font=fontSizeForSizing+"px "+font;
    maxCharWidth=drawingContext.measureText(minus).width;
    maxCharWidth=Math.max(maxCharWidth,drawingContext.measureText(plus).width);
    maxCharWidth=Math.max(maxCharWidth,drawingContext.measureText(times).width);
    maxCharWidth=Math.max(maxCharWidth,drawingContext.measureText(equals).width);
    for (i=0;i<10;i++) {
	maxCharWidth=Math.max(maxCharWidth,drawingContext.measureText(i).width);
    }
    showNextScreen();
}

/* Returns the number of characters in the integer n, including any
 * minus sign */
function intLen(n) {
    return (""+n).length;
}

/* Returns a random integer within the allowed range */
function nextOperand() {
    return Math.floor(Math.random()*(fcOperandMax-fcOperandMin+1)+fcOperandMin);
}

/* Generates and displays the next math problem */
function showNextScreen() {
    if (nextScreen==0) {
	// Generate a new problem
	fcOperandMin=parseInt(minValueElement.value,10);
	if (fcOperandMin<0) {
	    fcOperandMin=0;
	}
	fcOperandMax=parseInt(maxValueElement.value,10);
	if (fcOperandMax<1) {
	    fcOperandMax=1;
	}
	if (fcOperandMin>fcOperandMax) {
	    var temp=fcOperandMax;
	    fcOperandMax=fcOperandMin;
	    fcOperandMin=temp;
	}
	minValueElement.value=fcOperandMin;
	maxValueElement.value=fcOperandMax;

	fcOperator=operatorElement.value;
	fcOperand1=nextOperand();
	fcOperand2=nextOperand();
	if (fcOperator==plus) {
	    fcResult=fcOperand1+fcOperand2;
	} else if (fcOperator==minus) {
	    if (fcOperand1<fcOperand2) {
		var temp=fcOperand1;
		fcOperand1=fcOperand2;
		fcOperand2=temp;
	    }
	    fcResult=fcOperand1-fcOperand2;
	} else if (fcOperator==times) {
	    fcResult=fcOperand1*fcOperand2;
	} else if (fcOperator==divide) {
	    while (fcOperand2==0) {
		fcOperand2=nextOperand();
	    }
	    fcResult=fcOperand1;
	    fcOperand1=fcOperand1*fcOperand2;
	}
	displayText=fcOperand1+fcOperator+fcOperand2+equals+"?";
	nextScreen=1;
    } else {
	displayText=fcOperand1+fcOperator+fcOperand2+equals+fcResult;
	nextScreen=0;
    }

    // expressionChars indicates the number of characters in the full
    // math expression.
    expressionChars=1+1+2*intLen(fcOperandMax);
    if (fcOperator==plus) {
	// could have a carry for addition
	expressionChars+=intLen(fcOperandMax+fcOperandMax);
    } else if (fcOperator==minus) {
	expressionChars+=intLen(fcOperandMax);
    } else {
	// multiplication or division
	expressionChars+=intLen(fcOperandMax*fcOperandMax);
    }

    showCurrentScreen();
}

/* Draw the current problem or answer, using as large a font as will
 * fit all expressions that could be generated. */
function showCurrentScreen() {
    // Resize the canvas to fill the display, except the button bar. 
    problemCanvasElement.width=document.body.clientWidth;
    problemCanvasElement.height=window.innerHeight-buttonsElement.clientHeight;

    // Calculate the size for the expression text
    var textMeasurement=expressionChars*maxCharWidth;
    var desiredFontSize=Math.floor(fontSizeForSizing/textMeasurement*problemCanvasElement.width);
    if (desiredFontSize>problemCanvasElement.height) {
	desiredFontSize=problemCanvasElement.height;
    }
    var drawingContext=problemCanvasElement.getContext("2d");
    drawingContext.textBaseline="top";
    drawingContext.font=desiredFontSize+"px "+font;
    drawingContext.clearRect(0,0,problemCanvasElement.width,problemCanvasElement.height)
    drawingContext.fillText(displayText,0,0);
}

/* Toggle the div containing the settings between visible and hidden */
function toggleSettingsDisplay() {
    if (settingsElement.className=="hidden") {
	settingsElement.className="";
	showCurrentScreen();
    } else {
	settingsElement.className="hidden";
	showCurrentScreen();
    }
}

window.addEventListener("resize",showCurrentScreen);
