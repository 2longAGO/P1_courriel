// Global variables
let textBar = document.querySelector('#textBar');
let myName = 'unknown';
let currRecipient = '';

// Event handlers
document.getElementsByTagName("body")[0].onload = function() {setup()};
document.getElementById("btnSearch").onclick = function() {loadRecepients(document.querySelector('#searchBar').value)};
document.querySelector('#searchBar').addEventListener("keydown", function(event) { 
                                                            if (event.key === "Enter")
                                                                event.preventDefault();
                                                        });
document.getElementById("btnReset").onclick = function() {loadRecepients();
                                                          document.querySelector('#searchBar').value='';
                                                        };
document.getElementById("btnSearch2").onclick = function() {loadMessages(currRecipient,document.querySelector('#searchBar2').value)};
document.querySelector('#searchBar2').addEventListener("keydown", function(event) { 
                                                            if (event.key === "Enter")
                                                                event.preventDefault();
                                                        });
document.getElementById("btnReset2").onclick = function() {loadMessages(currRecipient);
                                                           document.querySelector('#searchBar2').value='';
                                                        };
                                                        document.getElementById("btnSearch2").onclick = function() {loadMessages(currRecipient,document.querySelector('#searchBar2').value)};
document.getElementById("btnEdit").onclick = function() {editRecepient(currRecipient);};
document.getElementById("btnDel").onclick = function() {deleteRecipient(currRecipient);};
textBar.addEventListener("keydown", function(event) {
    // Check if the enter key is pressed in the field
    if (event.key === "Enter"){
        if(event.shiftKey){
            event.preventDefault();
            sendMessage();
            textBar.style.height = "1em";
        }
        else{
            resizeTextBar();
        }
    }
});
textBar.addEventListener("keyup", function(event) {
    // Check if the backspece key was released in the field
    if (event.key === "Backspace"){
        resizeTextBar();
    }
});
document.getElementById("btnAdd").onclick = function() {addRecepient()};
document.getElementById("btnSend").onclick = function() {
                                                            sendMessage();
                                                            textBar.style.height = "1em";
                                                        };

// functions
function setup() {
    loadRecepients();
    myName = localStorage.getItem('myName')
    if(!myName){
        myName = prompt("Enter your name:","name");
        if (myName == null || myName == "") {
            if(!confirm("No name was entered.\nWas no name desired?")) {
                setup();
            }
            else {
                myName = 'unknown';
            }
        }
        else {
            localStorage.setItem('myName',myName);
        }
    }
}

function resizeTextBar(){
    let newHeight = textBar.value.split('\n').length ;
    newHeight = newHeight < 4 ? newHeight : 4 ;
    textBar.style.height = newHeight.toString() + "em" ;
}

/*
    Recipient code
*/

function loadRecepients(toSearch=''){
    clearChildren(document.getElementById("userBox"));
    let storedNames = parseData("names");
    if(storedNames){
        for (let i = 0; i < storedNames.length; i++) {
            if(storedNames[i].includes(toSearch) || toSearch===''){
                formatRecipient(storedNames[i]);
            }
        }
        const currList = document.getElementById("userBox").children;
        if (currList.length >0){
            for (let i = 0; i < currList.length; i++) {
                if (currRecipient == currList[i].textContent) {
                    loadMessages(currList[i].textContent);
                    return;
                }
            }
            loadMessages(currList[0].textContent);
        }
        else {
            alert("No result found!");
        }

    }
}

function addRecepient() {
    let newName = prompt("Enter new user:","name");
    if (newName == null || newName == "") {
        if(!confirm("No name was entered.\nDo want to cancel?")) {
            addRecepient();
        }
    }
    else {
        // Add to visible list
        formatRecipient(newName);
        // Save to name array
        saveRecipient(newName);
    }
}

function editRecepient(toEdit) {
    let newName = prompt("Enter new name for "+toEdit+" :","name");
    if (newName == null || newName == "") {
        if(!confirm("No name was entered.\nDo want to cancel?")) {
            editRecepient();
        }
    }
    else {
        let editArray = getArray("names");
        editArray.splice(editArray.indexOf(toEdit),1,newName);
        localStorage.setItem("names",JSON.stringify(editArray));
        localStorage.setItem(newName,localStorage.getItem(toEdit));
        localStorage.removeItem(toEdit);
        currRecipient = newName ;
        loadRecepients();
    }
}

function clearChildren(parent){
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

function formatRecipient(toFormat){
    let newElement = document.createElement("li");
    newElement.className = "userli";
    newElement.setAttribute("onclick",'loadMessages("'+toFormat+'")');
    newElement.textContent = toFormat;
    document.getElementById("userBox").appendChild(newElement);
}

/*
    Message code
*/

function loadMessages(name,toSearch=''){
    currRecipient = name;
    clearChildren(document.getElementById("chatBox"));
    let users = document.getElementById("userBox").children;
    for (let i = 0; i < users.length; i++) {
        if(users[i].textContent == name)
            users[i].setAttribute("style","background-color: blue");
        else
            users[i].setAttribute("style","background-color: initial");
    }
    let messages = parseData(name);
    if(messages){
        for (let i = 0; i < messages.length; i++) {
            const element = messages[i].split('\0');
            if(element[1].includes(toSearch)||toSearch=='')
                formatMessage(parseInt(element[0]),element[1]);
        }
    }
}

function sendMessage() {
    if ((textBar.value != '' && currRecipient != '')) {
        // send to recepient (TO-DO) maybe add a check for reception
        let date = new Date();
        //Presentation
        let msg = myName +' | '+ date.getDate().toString() + '/' +  (date.getMonth()+1).toString() + '/' + date.getFullYear().toString() +" "+
                  formatTime(date.getHours().toString()) + ':' + formatTime(date.getMinutes().toString()) + ':' + formatTime(date.getSeconds().toString()) + "\n" + textBar.value;
        msg = msg.replace(/\0/g,'');
        formatMessage(0,msg);
        textBar.value = '';
        // Save to localStorage
        saveMessage(0,msg,currRecipient);
    }
    /*else {
        alert("Nothing was written!");
    }*/
}

function formatTime(time){
    let retVal = time;
    while(retVal.length < 2){
        retVal = '0'+retVal ;
    }
    return retVal;
}

function receiveMessage() {
    // decode 
    const recUser = "mom"; // temporary
    const recMsg = "sup"; // temporary
    // Presentation
    formatMessage(1,recMsg);
    // Save to localStorage
    saveMessage(0,recMsg,recUser);
}

function formatMessage(msgType,msgData) {
    let newElement = document.createElement("textarea");
    const types = ["myMessage","otherMessage"];
    newElement.className = types[msgType];
    let array = msgData.split('\n');
    let width = 0;
    for (let i = 0; i < array.length; i++) {
        width = (array[i].length > width) ? array[i].length : width ;
    }
    newElement.setAttribute("cols",(width).toString());
    newElement.setAttribute("rows",(array.length-1).toString());
    newElement.addEventListener("keypress", function(event) {
        event.preventDefault();
    });
    newElement.value = msgData;
    document.getElementById("chatBox").appendChild(newElement);
}

/*
    Save code
    localStorage 
    All the chats will follow this convention
    names matches 1:1 with address keys for position for message reception
    chat name of recepient will contain the entire history using the null(\0) character to seperate eachEntry 
    Entry formatting typeMessage\0Msg\0 next
    Save as JSON
*/

function saveMessage(msgType,msgData,recName){
    savetoArray(recName,msgType.toString()+'\0'+msgData);
}

function saveRecipient(toSave){
    savetoArray("names",toSave);
}

function deleteRecipient(toDel){
    let deleteArray = getArray("names");
    deleteArray.splice(deleteArray.indexOf(toDel),1);
    localStorage.setItem("names",JSON.stringify(deleteArray));
    localStorage.removeItem(toDel);
    loadRecepients();
}

function savetoArray(name,data){
    let saveArray = getArray(name);
    saveArray.push(data);
    localStorage.setItem(name,JSON.stringify(saveArray));
}

function getArray(name) {
    let saveArray = parseData(name);
    if(!saveArray) saveArray = new Array;
    return saveArray;
}

function parseData(key){
    let data = null;
    try {
        data = JSON.parse(localStorage.getItem(key));
    } catch (error) {
        alert(key+"("+error.name+"): "+error.message);
        localStorage.setItem(key,"[]");
        data = null
    }
    return data;
}