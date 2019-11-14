let panel=new Panel();

// document.getElementById("tools").addEventListener('click', function(e){
//     console.log(e.target);
// });


// function addActiveTool(key){
//     document.getElementsByClassName("active_item" + key)[0].classList.add("active_btn");
// }

// function removeActiveTool(key){
//     document.getElementsByClassName("keyboard_btn_" + key)[0].classList.remove("active_btn");
// }

//  add panel listener
let elem=document.getElementsByClassName("tools_item");
for (let i=0; i<panel.tools.length; i++){
    elem[i].addEventListener('click', changeTool);
}

function changeTool(e){
        let key=(this.getAttribute("id"));
        //console.log(key);
        panel.removetool=panel.activetool;
        panel.activetool=key;
        panel.updateStorage();
        panel.removeActiveTool();
        panel.addActiveTool();
    }