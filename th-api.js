// function Answer() {
//     var xhttp = new XMLHttpRequest();
//
//     xhttp.onreadystatechange = function () {
//         if (this.readyState === 4 && this.status === 200) {
//
//             object = JSON.parse(this.responseText);
//
//             //code here
//
//         }
//         else {
//             //TODO If response not received (error).
//         }
//
//     };
//
//     xhttp.open("GET", "https://codecyprus.org/th/api/question?session=" + document.cookie , true);
//     xhttp.send();
// }

function list() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            //TODO If response not received (success).

            var object = JSON.parse(this.responseText);
            var challangesList = document.getElementById("challenges");
            for (var i = 0; i < object.treasureHunts.length; i++) {

                var newItem = document.createElement("li");
                var linkItem = document.createElement("a");
                linkItem.innerHTML = object.treasureHunts[i].name;
                linkItem.href = "login.html?uuid=" + object.treasureHunts[i].uuid;
                newItem.appendChild(linkItem);
                challangesList.appendChild(newItem);

            }
        }
        else {
            //TODO If response not received (error).
        }
    };
    xhttp.open("GET", "https://codecyprus.org/th/api/list", true);
    xhttp.send();
}

function start() {
    document.getElementById("SubmitButton").onclick = function SaveDetails() {
        var Username = document.getElementById("loginname");
        var Aname = document.getElementById("loginappname");
        var url = new URL(window.location.href);
        var uuid = url.searchParams.get('uuid');
        console.log(uuid);

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                object = JSON.parse(this.responseText);
                if (object.status === "ERROR") {
                    alert(object.errorMessages);
                }
                else {
                    document.cookie = object.session;
                    window.location.href = "questions.html";
                }
            }
            else {
                //TODO If response not received (error).
            }
        };

        xhttp.open("GET", "https://codecyprus.org/th/api/start?player=" + Username.value + "&app=" + Aname.value + "&treasure-hunt-id=" + uuid, true);
        xhttp.send();
    };
}

function questions() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            object = JSON.parse(this.responseText);

            //console.log(object.questionType);
            var qText = document.getElementById("qText");
            qText.innerHTML = "<p>" + object.questionText +"</p>";

            if (object.questionType === "BOOLEAN") {
                var qType = document.getElementById("qType");
                qType.innerHTML = "True <input class='radio' type='radio' name='answer' value='True'>" +
                    "False <input class='radio' type='radio' name='answer' value='False'>" +
                    "<input class='submitBut' type='button' name='submit' value='Submit' onclick='Answer(object)'>" +
                    "<input class='skipBut' type='button' name='Skip' value='Skip Question' onclick='Skip()'>"
            }
            else if (object.questionType === "INTEGER") {
                var qType = document.getElementById("qType");
                qType.innerHTML = "Your answer: <input class='integer' type='number' name='answer'>" +
                    "<input class='submitBut' type='button' name='submit' value='Submit' onclick='Answer(object)'>" +
                    "<input class='skipBut' type='button' name='Skip' value='Skip Question' onclick='Skip()'>"
            }
            else if (object.questionType === "NUMERIC") {
                var qType = document.getElementById("qType");
                qType.innerHTML = "Your answer: <input class='integer' type='number' name='answer'>" +
                    "<input class='submitBut' type='button' name='submit' value='Submit' onclick='Answer(object)'>" +
                    "<input class='skipBut' type='button' name='Skip' value='Skip Question' onclick='Skip()'>"
            }
            else if (object.questionType === "MCQ") {
                var qType = document.getElementById("qType");
                qType.innerHTML = "(A) <input class='radio' type='radio' name='answer' value='A'>" +
                    "(B) <input class='radio' type='radio' name='answer' value='B'>" +
                    "(C) <input class='radio' type='radio' name='answer' value='C'>" +
                    "(D) <input class='radio' type='radio' name='answer' value='D'>" +
                    "<input class='submitBut' type='button' name='submit' value='Submit' onclick='Answer(object)'>" +
                    "<input class='skipBut' type='button' name='Skip' value='Skip Question' onclick='Skip()'>"
            }
            else if (object.questionType === "TEXT") {
                var qType = document.getElementById("qType");
                qType.innerHTML = "Your answer: <input class='text' type='text' name='answer'>" +
                    "<input class='submitBut' type='button' name='submit' value='Submit' onclick='Answer(object)'>" +
                    "<input class='skipBut' type='button' name='Skip' value='Skip Question' onclick='Skip()'>"
            }

        }
        else {
            //TODO If response not received (error).
        }
    };

    xhttp.open("GET", "https://codecyprus.org/th/api/question?session=" + document.cookie , true);
    xhttp.send();
}

function Answer(object) {
    console.log(object.questionType);
    if (object.questionType === "TEXT") {
        var answer = document.getElementsByClassName("text");
        var ans = answer[0].value;
    }
    else if (object.questionType === "BOOLEAN" || object.questionType === "MCQ") {
        var answer = document.getElementsByClassName("radio");
        var ans;
        var length = answer.length;
        for (let i = 0; i < length; i++) {
            if (answer[i].checked)
                ans = answer[i].value;
        }
    }
    else if (object.questionType === "NUMERIC" || object.questionType === "INTEGER") {
        var answer = document.getElementsByClassName("integer");
        var ans = answer[0].value;
    }
    console.log(ans);


    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            object = JSON.parse(this.responseText);

            if (object.correct === true)
                location.reload();
            else if (ans === undefined || ans === "" || ans.length === 0 || ans == null) {
                alert("Please answer the question in order to proceed!");
            }
            else if(object.correct === false) {
                alert("Unfortunately your answer is wrong. Please Try again.");
            }
        }
        else {
            //TODO If response not received (error).
        }

};

    xhttp.open("GET", "https://codecyprus.org/th/api/answer?session=" + document.cookie + "&answer=" + ans, true);
    xhttp.send();
}

function Skip() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            object = JSON.parse(this.responseText);

            //code here

        }
        else {
            //TODO If response not received (error).
        }

    };

    xhttp.open("GET", "https://codecyprus.org/th/api/question?session=" + document.cookie , true);
    xhttp.send();
}