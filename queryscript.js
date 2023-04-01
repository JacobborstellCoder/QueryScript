var textOnScreen;
var isTextOnScreen = true;


function loadCode(){
    const params = new URLSearchParams(window.location.search);
    if (params.has('cmd')){
        const codeStr = params.get("cmd");
        const codeArray = codeStr.split(";");
        codeArray.length = codeArray.length - 1;
        return codeArray

    }
    else{
        throw "No script to execute";
    }
}


function scrPopup(text){
    alert(text);
}


function scrMsg(text){
    document.title = text;
    if (isTextOnScreen){
        textOnScreen.innerHTML = text;
    }
}


function scrSetCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function scrSetSCookie(cname, cvalue, exdays) {
    const d = new Date();
    document.cookie = cname + "=" + cvalue + ";" + "path=/";
}


function scrGetCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function scrRedirect(url){
    window.location.replace(url);
}



function runCode(){
    try {
        textOnScreen = document.getElementById("queryscript_msg");
    }
    catch(err){
        isTextOnScreen = false;
    }
    code = loadCode();
    console.log(code);
    var codeIsRunning = true;
    var currentLineId = 0;
    var ifinverted = false;

    while (codeIsRunning) {
        console.log(code[currentLineId], currentLineId)
        const currentLine = code[currentLineId].split(",");

        switch(currentLine[0]) {
            case "popup":
                scrPopup(currentLine[1]);
                break;
            
            case "msg":
                scrMsg(currentLine[1]);
                break;
            
            case "redirect":
                scrRedirect(currentLine[1]);
                break;
            
            case "reload":
                location.reload();
                break;
            
            case "back":
                history.back();
                break;
            
            case "setcookie":
                if (currentLine.length == 4){
                    scrSetCookie(currentLine[1], currentLine[2], currentLine[3]);
                }
                else {
                    scrSetSCookie(currentLine[1], currentLine[2]);
                }
                break;
            
            case "not":
                ifinverted = true;
                break;
            
            case "endif":
                break;
            
            case "if":
                var res;
                switch (currentLine[1]){
                    case "checkcookie":
                        res = (scrGetCookie(currentLine[2]) == currentLine[3]);
                    case "confirm":
                        res = confirm(currentLine[2]);
                }
                if (ifinverted){
                    res = !res;
                    ifinverted = false;
                }
                if (!res){
                    inif = 1;
                    while (inif != 0){
                        currentLineId = currentLineId + 1;
                        switch (code[currentLineId].split(",")[0]){
                            case "if":
                                inif = inif + 1;
                                break;
                            case "endif":
                                inif = inif - 1;
                                break;
                        }
                    }
                }
                break;
            default:
                throw "Invalid command: " + currentLine[0];
        }
        currentLineId = currentLineId + 1;
        if (currentLineId == code.length){
            break;
        }
    }
}