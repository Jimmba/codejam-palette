class Panel{
    activeTool="";
    removeTool="";
    currentColor="";
    prevColor="";
    tools=["fill", "picker", "pencil"];

    constructor(){
        if (localStorage.getItem("activeTool")==null){
            this.activeTool="pencil";
            this.setStorageTool();
            //localStorage.setItem("activeTool", "pencil");
        }
        if (localStorage.getItem("currentColor")==null){
            localStorage.setItem("currentColor", document.getElementById("currentColor").value);
        }
        if (localStorage.getItem("prevColor")==null){
            localStorage.setItem("prevColor", document.getElementById("prevColor").value);
        }
        this.activeTool=localStorage.getItem("activeTool");
        this.currentColor=localStorage.getItem("currentColor");
        this.prevColor=localStorage.getItem("prevColor");
        document.getElementById("currentColor").value=this.currentColor;
        document.getElementById("prevColor").value=this.prevColor;
        //console.log("set prev to "+ this.prevColor);

        this.setStorageTool();
        this.addActiveTool();
    }

    setStorageTool(){
        console.log("localStorage.getItem(\"activeTool\",\"" + this.activeTool +"\")");
        localStorage.setItem("activeTool", this.activeTool);
    }

    addActiveTool(){
        document.getElementsByClassName(this.activeTool)[0].classList.add("active");
    }
    
    removeActiveTool(){
        //console.log("remove "+this.removeTool);
        document.getElementsByClassName(this.removeTool)[0].classList.remove("active");
    }
}

