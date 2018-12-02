const Aname =  "GNN";

// This function lists all the available treasure hunts.
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
                linkItem.onclick = function setCookie(){ document.cookie = "uuid=" + object.treasureHunts[i].uuid};
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

// This function gets the username and creates a cookie containing the session id.
function start() {
    document.getElementById("SubmitButton").onclick = function SaveDetails() {
        var Username = document.getElementById("loginname");

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                object = JSON.parse(this.responseText);
                if (object.status === "ERROR") {
                    alert(object.errorMessages);
                }
                else {
                    document.cookie = "session=" + object.session;
                    window.location.href = "questions.html";
                }

            }
            else {
                //TODO If response not received (error).
            }
        };

        xhttp.open("GET", "https://codecyprus.org/th/api/start?player=" + Username.value + "&app=" + Aname + "&treasure-hunt-id=" + getCookie("uuid"), true);
        xhttp.send();
    };
}

// This function checks what each question is and displays the corresponding answer boxes and buttons together and sends the session id.
function questions() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            object = JSON.parse(this.responseText);

            if (object.requiresLocation === true)
                getLocation();

            var qText = document.getElementById("qText");
            qText.innerHTML = "<p>" + object.questionText +"</p>";

            if (object.completed === true) {
                qText.innerHTML = "Well done pirate!";
                qImg.innerHTML = "<img class='welldoneimage' src='Images/reward.png'/>";
                Score();
            }
            else if (object.questionType === "BOOLEAN") {
                var qType = document.getElementById("qType");
                qType.innerHTML = "True <input class='radio' type='radio' name='answer' value='True'>" +
                    "False <input class='radio' type='radio' name='answer' value='False'>" +
                    "<input class='submitBut' type='button' name='submit' value='Submit' onclick='Answer(object)'>" +
                    "<input class='skipBut' type='button' name='Skip' value='Skip Question' onclick='SkipConfirm()'>"
            }
            else if (object.questionType === "INTEGER") {
                var qType = document.getElementById("qType");
                qType.innerHTML = "Your answer: <input class='integer' type='number' name='answer'>" +
                    "<input class='submitBut' type='button' name='submit' value='Submit' onclick='Answer(object)'>" +
                    "<input class='skipBut' type='button' name='Skip' value='Skip Question' onclick='SkipConfirm()'>"
            }
            else if (object.questionType === "NUMERIC") {
                var qType = document.getElementById("qType");
                qType.innerHTML = "Your answer: <input class='integer' type='number' name='answer'>" +
                    "<input class='submitBut' type='button' name='submit' value='Submit' onclick='Answer(object)'>" +
                    "<input class='skipBut' type='button' name='Skip' value='Skip Question' onclick='SkipConfirm()'>"
            }
            else if (object.questionType === "MCQ") {
                var qType = document.getElementById("qType");
                qType.innerHTML = "(A) <input class='radio' type='radio' name='answer' value='A'>" +
                    "(B) <input class='radio' type='radio' name='answer' value='B'>" +
                    "(C) <input class='radio' type='radio' name='answer' value='C'>" +
                    "(D) <input class='radio' type='radio' name='answer' value='D'>" +
                    "<input class='submitBut' type='button' name='submit' value='Submit' onclick='Answer(object)'>" +
                    "<input class='skipBut' type='button' name='Skip' value='Skip Question' onclick='SkipConfirm()'>"
            }
            else if (object.questionType === "TEXT") {
                var qType = document.getElementById("qType");
                qType.innerHTML = "Your answer: <input class='text' type='text' name='answer'>" +
                    "<input class='submitBut' type='button' name='submit' value='Submit' onclick='Answer(object)'>" +
                    "<input class='skipBut' type='button' name='Skip' value='Skip Question' onclick='SkipConfirm()'>"
            }
        }
        else {
            //TODO If response not received (error).
        }
    };

    xhttp.open("GET", "https://codecyprus.org/th/api/question?session=" + getCookie("session") , true);
    xhttp.send();
}

// This function checks which answer has been selected or given or if it has been answered at all or if it was correct or not.
// Afterwards it sends the answer and the session id.
function Answer(object) {
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
    if (ans === undefined || ans === "" || ans.length === 0 || ans == null) {
        alert("Please answer the question in order to proceed!");
    }
    else {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                object = JSON.parse(this.responseText);

                Score();

                if (object.correct === true) {
                    if (object.completed === true)
                        location.reload();
                    questions();
                }
                else if(object.correct === false) {
                    alert("Unfortunately your answer is wrong. You have lost 3 points. Please Try again.");
                    questions();
                }
            }
            else {
                //TODO If response not received (error).
            }

        };

        xhttp.open("GET", "https://codecyprus.org/th/api/answer?session=" + getCookie("session") + "&answer=" + ans, true);
        xhttp.send();
    }
}

//This function skips the current question and sends the session id.
function Skip() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            location.reload();

        } else {
            //TODO If response not received (error).
        }
    };

    xhttp.open("GET", "https://codecyprus.org/th/api/skip?session=" + getCookie("session"), true);
    xhttp.send();
}

// This function confirms with the user if they want to skip the current question and makes sure it was not pressed accidentally.
function SkipConfirm() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            if (object.canBeSkipped === false) {

                alert("Unfortunately, this question cannot be skipped.");
                questions();

            } else if (object.canBeSkipped === true) {

                if (confirm("If you skip the question you will lose 5 points. Would you like to proceed?")) {
                    Skip();
                } else {

                }
                //TODO If response not received (error).
            }
        }
    };

    xhttp.open("GET", "https://codecyprus.org/th/api/question?session=" + getCookie("session"), true);
    xhttp.send();
}

// This function shows the current and the final score to the user while and after the game and sends the session id.
function Score() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            object = JSON.parse(this.responseText);

            var CurrentScore = document.getElementById("Score");

            if (object.completed === false) {

                    CurrentScore.innerHTML = "<p>" + 'Your current score is: ' + object.score + "</p>";
                }

            if (object.completed === true) {

                if (object.score === 1 || object.score === -1) {

                    CurrentScore.innerHTML = "<p>" + 'You have scored ' + object.score + ' point!' + "</p>";
                } else {

                    CurrentScore.innerHTML = "<p>" + 'You have scored ' + object.score + ' points!' + "</p>";
                }
            }
        } else {

            //TODO If response not received (error).
        }
    };

        xhttp.open("GET", "https://codecyprus.org/th/api/score?session=" + getCookie("session"), true);
        xhttp.send();
}

// This function gets the location from the user.
function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
    function showPosition(position) {
        sendLocation(position.coords.latitude, position.coords.longitude);
    }
}

// This function sends the location to the server with the latitude, longitude and the session id.
function sendLocation(latitude,longitude) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
        }
        else {
            //TODO If response not received (error).
        }
    };
    xhttp.open("GET", "https://codecyprus.org/th/api/location?" +
        "session=" + getCookie("session") + "&latitude=" + latitude + "&longitude=" + longitude, true);
    xhttp.send();
}

// This function diplays the leaderboard in a table and sends the uuid and the number of players.
function Leaderboard() {
    var numOfPlayersLimit = 10;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);

            var leaderboard = document.getElementById("leaderboard");

            var tableBody = document.createElement('TBODY');
            leaderboard.appendChild(tableBody);

            for (var i = 0; i < 3; i++) {
                var th = document.createElement('TH');
                th.style.fontSize = '22px';
                tableBody.appendChild(th);
                if (i === 0) {
                    th.appendChild(document.createTextNode("Place"));
                }
                else if (i === 1) {
                    th.appendChild(document.createTextNode("Username"));
                }
                else if (i === 2) {
                    th.appendChild(document.createTextNode("Score"));
                }
            }

            for (var z = 0; z < numOfPlayersLimit; z++) {
                var tr = document.createElement('TR');
                tableBody.appendChild(tr);

                for (var j = 0; j < 3; j++) {
                    var td = document.createElement('TD');
                    td.width = '120';
                    if (j === 0) {
                        td.appendChild(document.createTextNode(z + 1));
                        tr.appendChild(td);
                    }
                    else if (j === 1) {
                        td.appendChild(document.createTextNode(object.leaderboard[z].player));
                        tr.appendChild(td);
                    }
                    else if (j === 2) {
                        td.appendChild(document.createTextNode(object.leaderboard[z].score));
                        tr.appendChild(td);
                    }
                }
            }
        }
    };

    xhttp.open("GET", "https://codecyprus.org/th/api/leaderboard?treasure-hunt-id=" + getCookie("uuid") + "&sorted&limit=" + numOfPlayersLimit, true);
    xhttp.send();
}

//Taken from - https://stackoverflow.com/questions/10730362/get-cookie-by-name
// This function gets the name of the cookie.
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

// This function checks if the user left an uncompleted session and if the user declines the cookie is deleted.
function checkSession() {
    if (getCookie("session") !== undefined) {
        if (confirm('It seems that you have left a game in progress there pirate. Pressing cancel will delete your left of session. Would you like to continue where you left of?')) {
            window.location.href = "questions.html";
        }
        else {
            delete_cookie();
        }
    }
}

//Taken from - https://stackoverflow.com/questions/2144386/how-to-delete-a-cookie
// This function deletes the session cookie.
function delete_cookie() {
    document.cookie = 'session' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}