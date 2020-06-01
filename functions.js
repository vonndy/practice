var app = "https://script.google.com/macros/s/AKfycby_7stqDT5KaJoMhRS13cwwtc8HJqojtcTnz2NPszhocdyr1vdd/exec";

function fileOutput(json, jsonName, elementId, text){
    var output = "";
    var information = json[jsonName];
    for (var i = 0; i < information.length; i++){
        if (jsonName == "news")
            json[jsonName][i][0] = new Date(json[jsonName][i][0]).toLocaleDateString('en-GB');
        var obj = json[jsonName][i];
        output += "<p class='text'>";
        output += obj.join("<br>") + "<br>";
        output += "</p>";
    }
    document.getElementById(elementId).innerHTML = text + output;
}

function load(){
    document.getElementById("status").innerHTML = "Загрузка...";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', app);
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        if (xhr.status == 200) {
            try {
                document.getElementById("status").innerHTML = "";
                var r = JSON.parse(xhr.responseText);
                sessionStorage.setItem("result", xhr.responseText);
                var settings = r["settings"];
                if(settings["info_table"][0] == "+")
                    fileOutput(r, "info", "info", "<h2>Учебная информация</h2>");
                else if(settings["info_table"][1] == "+") 
                        document.getElementById("links").innerHTML += "<a href='info.html'><h2>Учебная информация</h2></a>";
                if(settings["news_table"][0] == "+")
                    fileOutput(r, "news", "news", "<h2>Новости</h2>");
                else if(settings["news_table"][1] == "+")
                        document.getElementById("links").innerHTML += "<a href='news.html'><h2>Новости</h2></a>";
            } catch(e) {
                alert(e);
                document.getElementById("status").innerHTML = "Ошибка!";
            }
        }                   
    }
    xhr.send();   
}      

function add(){
    $.ajax({
        url: app,
        type: "POST",
        data: {text: document.getElementById("text").value},
        dataType: "json",
        failure: function(errMsg) {alert(errMsg);}
    }); 
    document.getElementById("text").value = "";
}

function send(){
    $.ajax({
        url: app,
        type: "POST",
        data: {bcc: document.getElementById("bcc").value, subject: document.getElementById("subject").value, body: document.getElementById("body").value},
        dataType: "json",
        failure: function(errMsg) {alert(errMsg);}
    }); 
    document.getElementById("bcc").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("body").value = "";
}