const UUID = "ag9nfmNvZGVjeXBydXNvcmdyGQsSDFRyZWFzdXJlSHVudBiAgICAvKGCCgw"

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
                linkItem.href = "login.html";
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

        xhttp.open("GET", "https://codecyprus.org/th/api/start?player=" + Username.value + "&app=" + Aname.value + "&treasure-hunt-id=" + UUID, true);
        xhttp.send();
    };
}

function questions() {
    console.log("en o shistos");
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            object = JSON.parse(this.responseText);

            if (object.requiresLocation === true)
                getLocation();

            console.log(object);
            var qText = document.getElementById("qText");
            qText.innerHTML = object.questionText;

        }
        else {
            //TODO If response not received (error).
        }
    };

    xhttp.open("GET", "https://codecyprus.org/th/api/question?session=" + document.cookie , true);
    xhttp.send();
}