
$(function () {
    results = { corrWords: 0, wrongWords: 0, corrSymbols: 0, wrongSymbols: 0 };
    started = false;
    $("#inputTxt").on("input", updateValue);
    $.getJSON("wordsJSON.json", function (data) {
        values = data.words;
        totalWordCount = data.wordCount;
        refreshBottomRow();
        printTest();
    });
})


function updateValue(e) {
    if (!started) {
        start();
        started = true;
    }
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
        verify(false);
}


function changeColor(index, style) {
    $("#letter" + index).attr("class", style);
}

function verify(isLastCheck) {
    var isValid = true;
    for (index = 0; index < $("#inputTxt").val().length; index++) {
        var inputChar = $("#inputTxt").val().charAt(index);
        var reqChar = $("#letter" + index).text();
        //Symbols count
        if (reqChar != " " && inputChar == reqChar)
            results.corrSymbols++;
        else if (reqChar != " " && inputChar != reqChar)
            results.wrongSymbols++;
        //Words count
        if (reqChar != " ") {
            if (isValid && reqChar != inputChar) {
                isValid = false;
            }
        } else if (reqChar == " ") {
            if (isValid) {
                results.corrWords++;
            } else results.wrongWords++;
            isValid = true;
        }
    }
    if (!isLastCheck) {
        printTest();
    }
}

function start() {
    $("#label").text("Type away!");
    var dateInAMin = Date.now() + 60000;
    $("#timerTxt").text("59 seconds left");
    var x = setInterval(() => {
        var delta = Math.floor((dateInAMin - Date.now()) / 1000);
        $("#timerTxt").text(delta + " seconds left");
        if (delta <= 0) {
            clearInterval(x);
            verify(true);
            finish();
        }
    }, 1000);
}

function finish() {
    var resultWords = "WPM:" + results.corrWords + " (" + results.corrWords +
        "/" + (results.wrongWords + results.corrWords) + ")";
    var resultsSymbols = "Symbols (" + results.corrSymbols + "/"
        + (results.wrongSymbols + results.corrSymbols) + ")";

    $("#inputTxt").val("");
    $("#label").text("Refresh the page to play again!");
    $("#timerTxt").text("Time's up!");
    $("#outputTxt").text(resultWords);
    $("#outputNextTxt").text(resultsSymbols);
    $("#inputTxt").prop("disabled", true);
}


function printTest() {
    $("#inputTxt").val("");
    letterCount = letterCountNext;
    $("#outputTxt").empty();
    $("#outputTxt").append($("#outputNextTxt").html());
    $("#outputNextTxt").empty();
    refreshBottomRow();
}

function refreshBottomRow() {
    var text = "";
    for (i = 0; i < 5; i++) {
        text += values[Math.floor(Math.random() * totalWordCount)] + " ";
    }
    letterCountNext = text.length;
    var elements = $();
    for (i = 0; i < letterCountNext; i++) {
        elements = elements.add("<span id=\"letter" + i + "\" class=\"default\">" + text.charAt(i) + "</span>");
    }
    $("#outputNextTxt").append(elements);
}