class Panel{
    activetool="";
    removetool="";
    activecolor="";
    prevcolor="";
    tools=["fill", "picker", "pencil"];

    constructor(){
        if (localStorage.getItem("activetool")==null){
            this.setActiveTool("pencil");
            //localStorage.setItem("activetool", "pencil");
        }
        if (localStorage.getItem("activecolor")==null){
            localStorage.setItem("activecolor", "black");
        }
        if (localStorage.getItem("prevcolor")==null){
            localStorage.setItem("prevcolor", "black");
        }
        this.activetool=localStorage.getItem("activetool");
        this.activecolor=localStorage.getItem("activecolor");
        this.prevcolor=localStorage.getItem("prevcolor");
        this.addActiveTool();
        this.updateStorage();
        //this.addToolsListener();
    }

    updateStorage(){
        console.log("updateStorage " + this.activetool);
        localStorage.setItem("activetool", this.activetool);
    }

    addActiveTool(){
        document.getElementsByClassName(this.activetool)[0].classList.add("active");
    }
    
    removeActiveTool(){
        //console.log("remove "+this.removetool);
        document.getElementsByClassName(this.removetool)[0].classList.remove("active");
    }

    changeTool(){
        let key=(this.getAttribute("id"));
        //console.log(key);
        panel.removetool=panel.activetool;
        panel.activetool=key;
        panel.updateStorage();
        panel.removeActiveTool();
        panel.addActiveTool();
    }
}

