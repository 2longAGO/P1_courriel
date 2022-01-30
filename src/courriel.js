// Global variables
let textBar = document.querySelector('#textBar');
let myName = 'unknown';
let currRecipient = '';

// Event handlers
document.getElementsByTagName("body")[0].onload = function() {setup()};
document.getElementById("btnSearch").onclick = function() {loadRecepients(document.querySelector('#searchBar').value)};
document.getElementById("btnReset").onclick = function() {loadRecepients();
                                                          document.querySelector('#searchBar').value='';
                                                        };
document.getElementById("btnSearch2").onclick = function() {loadMessages(currRecipient,document.querySelector('#searchBar2').value)};
document.getElementById("btnReset2").onclick = function() {loadMessages(currRecipient);
                                                           document.querySelector('#searchBar2').value='';
                                                        };
document.getElementById("btnSend").onclick = function() {sendMessage()};
document.getElementById("btnAdd").onclick = function() {addRecepient()};
textBar.addEventListener("keyup", function(event) {
    // Check if the enter key is pressed in th field
    if (event.key === "Enter") {
      sendMessage();
    }
}); 

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
                if (currRecipient == currList[i].innerHTML) {
                    loadMessages(currList[i].innerHTML);
                    return;
                }
            }
            loadMessages(currList[0].innerHTML);
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

function clearChildren(parent){
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

function formatRecipient(toFormat){
    let newElement = document.createElement("li");
    newElement.className = "userli";
    newElement.setAttribute("onclick",'loadMessages("'+toFormat+'")');
    newElement.innerHTML = toFormat;
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
        if(users[i].innerHTML == name) 
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
        /*console.log(textBar.value);
        console.log(currRecipient);*/
        // send to recepient (TO-DO) maybe add a check for reception
        let date = new Date();
        console.log(date.getDay());
        date.get
        console.log(date.getUTCDay());
        //Presentation
        let msg = myName +' | '+ date.getDate().toString() + '/' +  (date.getMonth()+1).toString() + '/' + date.getFullYear().toString() +" "+
        date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString() + "<br>" + textBar.value;
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
    let newElement = document.createElement("p");
    const types = ["myMessage","otherMessage"];
    newElement.className = types[msgType];
    newElement.innerHTML = msgData;
    document.getElementById("chatBox").appendChild(newElement);
}

/*
    Save code
    localStorage 
    All the chats will follow this convention
    names matches 1:1 with ips for position for message reception
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

function savetoArray(name,data){
    
    let saveArray = parseData(name);
    if(!saveArray) saveArray = new Array;
    saveArray.push(data);
    localStorage.setItem(name,JSON.stringify(saveArray));
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