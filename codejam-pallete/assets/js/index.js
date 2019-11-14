draw(frame_4x4, false); //default picture

function draw(frame, isImage){
    var canvas=document.getElementById('canvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let canvas_length=512; //width and height of canvas for calculate item

    if(canvas.getContext){
      var ctx=canvas.getContext('2d');
      if (isImage){        
          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      }else{
        let item_length=canvas_length/frame.length;
          frame.forEach((row, i) => {
              row.forEach((column, j)=>{
              if (frame[0][0].length==4){
                  ctx.fillStyle="rgba("+column[0]+","+column[1]+","+column[2]+","+column[3]/255+")";
              }else{
                  ctx.fillStyle="#"+column;
              }
              ctx.fillRect(i*item_length, j*item_length, item_length, item_length);
              })
          });
        }
    }
}

function paint(type, frame){
    if (type=="image"){
        var img = new Image();
        img.src = '../codejam-pallete/assets/data/image.png';
        // console.log(img.src);
        img.addEventListener("load", function() {
          draw(img, true);
        });
    }else if(type=="frame"){
        draw(frame, false);
    }
}