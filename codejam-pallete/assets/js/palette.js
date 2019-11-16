let panel=new Panel();

//  add panel listener
let elem=document.getElementsByClassName("tools_item");
for (let i=0; i<panel.tools.length; i++){
    elem[i].addEventListener('click', mouseChangeTool);
}

function mouseChangeTool(){
    let key=(this.getAttribute("id"));
    changeTool(key);
}

function keyboardChangeTool(key){
    changeTool(key);
}

function changeTool(key){
    //console.log(key);
    panel.removetool=panel.activetool;
    panel.activetool=key;
    panel.setStorageTool();
    panel.removeActiveTool();
    panel.addActiveTool();
}

/********* COLOR PANEL *********/
// add color listener
document.getElementById("currentColor").addEventListener('change', function(){
    let newColor=document.getElementById("currentColor").value;
    updateColor(newColor);
});

document.getElementById("prev").addEventListener('mouseup', function(){
    let color=(document.getElementById("prevColor").value);
    // console.log(color);
    updateColor(color, true);
});

document.getElementById("red").addEventListener('mouseup', function(){
    let color=(document.getElementById("redColor").value);
    updateColor(color, true);
});

document.getElementById("blue").addEventListener('mouseup', function(){
    let color=(document.getElementById("blueColor").value);
    updateColor(color, true);
});


function updateColor(newColor, toUpdatePrevColor=false){
    if (toUpdatePrevColor){
        panel.prevColor=panel.currentColor;
        document.getElementById("prevColor").value=panel.prevColor;
        localStorage.setItem("prevColor", document.getElementById("prevColor").value);
    }
    panel.currentColor=newColor;
    document.getElementById("currentColor").value=panel.currentColor;
    //console.log("change " + panel.prevColor + " to " + panel.currentColor);
    localStorage.setItem("currentColor", document.getElementById("currentColor").value);
}
/********* COLOR PANEL *********/