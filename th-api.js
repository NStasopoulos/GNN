function list() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            //console.log(this.responseText);

            var object = JSON.parse(this.responseText);
            var challangesList = document.getElementById("challenges");

            for (var i = 0; i < object.treasureHunts.length; i++) {
                //console.log(object.treasureHunts[i].name);
                var newItem = document.createElement("li");
                var linkItem = document.createElement("a");
                linkItem.innerHTML = object.treasureHunts[i].name;
                linkItem.href = "https://codecyprus.org/th/api/start?player=Homer&app=simpsons-app&treasure-hunt-id=" + object.treasureHunts[i].uuid;
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

function submit() {
    
}