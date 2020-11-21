var outputTxt;
var outputNextTxt;
var inputTxt;

var values;

var letterCount = 0;
var corrWords = 0;
var wrongWords = 0;
var corrSymbols = 0;
var wrongSymbols = 0;
var started = false;

$(function () {
    outputTxt = $("#outputTxt");
    outputNextTxt = $("#outputNextTxt");
    inputTxt = $("#inputTxt");

    $.getJSON("wordsJSON.json", function (data) {
        values = data;
        
        var text = "";
        for (i = 0; i < 5; i++) {
            text += values[Math.floor(Math.random() * Object.keys(values).length + 1)] + " ";
        }
        letterCountNext = text.length;
        var elements = $();
        for (i = 0; i < letterCountNext; i++) {
            elements = elements.add("<span id=\"letter" + i + "\" class=\"default\">" + text.charAt(i) + "</span>");
        }
        outputNextTxt.append(elements);
        printTest();
    });

    inputTxt.on("input", updateValue);


})

function updateValue(e) {
    if (started) {
        let max = e.target.value.length;
        for (index = 0; index < max; index++) {
            if (e.target.value.charAt(index) == $("#letter" + index).text()) {
                changeColor(index, "correct");
            }
            else {
                changeColor(index, "wrong");
            }
        }
        if (max < letterCount)
            for (index = max; index < letterCount; index++)
                changeColor(index, "default");
        else if (max == letterCount)
            verify();
    }
    else {
        started = true;
        inputTxt.attr("placeholder","");
        start();
    }
}



function changeColor(index, style) {
    $("#letter" + index).attr("class", style);
}

function verify() {

    var isValid = true;
    for (index = 0; index < letterCount; index++) {
        var inputChar = inputTxt.val().charAt(index);
        var reqChar = $("#letter" + index).text();
        //Symbols count
        if (inputChar != " " && inputChar == reqChar)
            corrSymbols++;
        else if (inputChar != " " && inputChar != reqChar)
            wrongSymbols++;

        //Words count
        if(reqChar != " "){
            if(isValid && reqChar != inputChar){
                isValid = false;
            }
        } else if (reqChar == " "){
            if(isValid){
                corrWords++;
            } else wrongWords++;
            isValid = true;
        }
    }

        
    printTest();
}

function start() {
    var dateInAMin = new Date(Date.now() + 60 * 1000);
    $("#timerTxt").text("60 seconds left");
    var x = setInterval(() => {
        var delta = dateInAMin - Date.now();
        $("#timerTxt").text(Math.floor((delta) / 1000) + " seconds left");
        if (delta <= 0) {
            clearInterval(x);
            verify();
            finish();
        }
    }, 1000);
}

function finish() {
    var result = "WPM:" + ((corrWords/60)*100).toPrecision(2) + " ("+corrWords+
    "/"+(wrongWords+corrWords)+") Symbols ("+corrSymbols+"/"+(wrongSymbols+corrSymbols)+")";
    $("#timerTxt").text(result);
    inputTxt.prop("disabled", true);
}

function printTest() {
    inputTxt.val("");
    letterCount = letterCountNext;
    outputTxt.empty();
    outputTxt.append(outputNextTxt.html());
    outputNextTxt.empty();
    var text = "";
    for (i = 0; i < 5; i++) {
        text += values[Math.floor(Math.random() * Object.keys(values).length + 1)] + " ";
    }
    letterCountNext = text.length;
    var elements = $();
    for (i = 0; i < letterCountNext; i++) {
        elements = elements.add("<span id=\"letter" + i + "\" class=\"default\">" + text.charAt(i) + "</span>");
    }
    outputNextTxt.append(elements);
}