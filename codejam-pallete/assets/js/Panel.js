class Panel{
    activetool="";
    removetool="";
    currentColor="";
    prevColor="";
    tools=["fill", "picker", "pencil"];

    constructor(){
        if (localStorage.getItem("activetool")==null){
            this.setActiveTool("pencil");
            //localStorage.setItem("activetool", "pencil");
        }
        if (localStorage.getItem("currentColor")==null){
            localStorage.setItem("currentColor", document.getElementById("currentColor").value);
        }
        if (localStorage.getItem("prevColor")==null){
            localStorage.setItem("prevColor", document.getElementById("prevColor").value);
        }
        this.activetool=localStorage.getItem("activetool");
        this.currentColor=localStorage.getItem("currentColor");
        this.prevColor=localStorage.getItem("prevColor");
        document.getElementById("currentColor").value=this.currentColor;
        document.getElementById("prevColor").value=this.prevColor;
        console.log("set prev to "+ this.prevColor);

        this.setStorageTool();
        this.addActiveTool();
    }

    setStorageTool(){
        console.log("localStorage.getItem(\"activetool\",\"" + this.activetool +"\")");
        localStorage.setItem("activetool", this.activetool);
    }

    addActiveTool(){
        document.getElementsByClassName(this.activetool)[0].classList.add("active");
    }
    
    removeActiveTool(){
        //console.log("remove "+this.removetool);
        document.getElementsByClassName(this.removetool)[0].classList.remove("active");
    }

}

