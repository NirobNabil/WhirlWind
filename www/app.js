$(document).ready(function () {
    //making the grid map draggable and resizable
    var map = $(".map_container");

    map.draggable();


    $(".map_container").bind('mousewheel DOMMouseScroll', function (event) {

        let height = parseInt(map.outerHeight());
        let width = parseInt(map.outerWidth());
        let step = 2;

        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            map.css({
                "height": height + ((height * 2) / 100),
                "width": width + ((width * 2) / 100)
            })
        } else {
            map.css({
                "height": height - ((height * 2) / 100),
                "width": width - ((width * 2) / 100)

            })
        }

    })




    /////// highlight on hover


    // define the height, width and bot size in centemeter
    total_width = 200;
    total_height = 200;
    bot_size = 20;
    total_box = (total_height / bot_size) * (total_width / bot_size);
    box_in_x = total_width / bot_size;
    box_in_y = total_height / bot_size;

    document.getElementsByClassName('Xco-ordinate_input')[0].setAttribute('max', box_in_x - 1);
    document.getElementsByClassName('Yco-ordinate_input')[0].setAttribute('max', box_in_y - 1);

    //populating the pixels array
    populate(total_width / bot_size, total_height / bot_size, "UND");

    for (let i = 0; i < total_box; i++) {
        document.getElementsByClassName('map_container')[0].innerHTML += '<div class="pixel"></div>';
    }
    
    $(".gg").on('change',function(){
        console.log(document.getElementsByClassName('gg')[0].value);
    })


    $(".pixel").css({
        "width": 100 / (total_width / bot_size) + "%",
        "height": 100 / (total_height / bot_size) + "%"
    })

    var X_val = 0,
        Y_val = 0;
    
    

    $(".XYsubmit").click(function () {
        X_val = document.getElementsByClassName("Xco-ordinate_input")[0].value;
        Y_val = document.getElementsByClassName("Yco-ordinate_input")[0].value;
        //console.log(X_val + " , " + Y_val);
        MarkObs(X_val, Y_val)
        console.log(GetPixel(X_val, Y_val));
    })
    
    $(".pixel").click(function(){
        let Conates = GetCOordinates($(this).index());
        let x=Conates[0];
        let y=Conates[1];
        if(pixels[getIndex(x,y)].state == "OBS"){
            UnMarkObs(x,y,"DIS");
            unsavepixel(x,y);
        }else{
            savepixel(x,y);
            MarkObs(x,y,"OBS");
        }
    })
    
    console.log(pixels);
    
    current = pixels[0];
    pathfind(pixels, pixels[13], pixels[pixels.length-1]);
})

//jquery code ends here :D















var pixels = []

var obstacles = []

function pixel(X, Y, obs) {
    this.X_co_ordinate = X;
    this.Y_co_ordinate = Y;
    this.state = obs; //availale states OPN, UND, OBS, DIS, NULL
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.last = null;
}

//01719372596

function populate(height, width, obs_val = "UND") {
    
    pixels[0] = new pixel(0, 10, obs_val);
    
    for (h = height, i = 0; h >= 0; h--) {
        for (w = 0; w < width; w++, i++) {
            var temp_obs = new pixel(w, h, obs_val);
            temp_obs.last = pixels[0];
            pixels[i] = temp_obs; //saving temp_pixel object to pixels array
        }
    }
    
    
}


function MarkObs(x = 0, y = 0, obs_val = null) {

    let i = getIndex(x,y);
    console.log(i);
    document.getElementsByClassName('pixel')[i].style.background = "black";

    let pix = GetPixel(x, y);
    console.log(pix);
    pix.state = obs_val;

    return GetPixel(x, y);
}

function UnMarkObs(x=0, y=0, obs_val= "DIS"){
    let i = getIndex(x,y);
    document.getElementsByClassName('pixel')[i].style.background = "white";
    
    let pix = GetPixel(x,y);
    pix.state = obs_val;
    
    return GetPixel(x,y);
}

function GetCOordinates(i) {

    let digit = i.toString().length;
    let denominator;
    if(i>box_in_x){
        for (ii=1, denominator="1" ; ii < digit; ii++) {
            denominator+="0";
        }

        var y = box_in_y-1 - Math.floor(parseInt(i) / parseInt(denominator));
        var x = parseInt(i) % parseInt(denominator);  
        console.log(x);
    }else{
        var x = i;
        var y = box_in_y-1;
    }
    return [x,y];
}

function getIndex(x, y) {
    return (box_in_x * (box_in_y - y - 1)) + (parseInt(x));
}

function GetPixel(x, y) {

    return pixels[getIndex(x, y)];
}


var obs_array_index = 0;

function savepixel(x = 0, y = 0) {

    let bulletString = obs_array_index;
    let valString = "(" + x + "," + y + ")";
    document.getElementsByClassName("val_container_mother")[0].innerHTML += '<div class="val_container"><span class="bullet">' + "" + '</span><span class="val">' + valString + '</span> </div>';
    obstacles[obs_array_index] = GetPixel(x,y);
    obs_array_index++;
    //obstacles[obs_array_index] = 
}

function unsavepixel(x=0,y=0){
    obs_array_index--;
    let i = obstacles.indexOf(pixels[getIndex(x,y)]);
    console.log(i);
    obstacles.splice(i,1);
    let ToRemove = document.getElementsByClassName('val_container')[i];
    ToRemove.remove();
    console.log(ToRemove);
}






///////////////////////////////////////////////////////////

function getG(currentgh, start){
    let g = 1;
    while(currentgh != start && currentgh.last != start && currentgh){
        currentgh = currentgh.last;
        g++;
    }
    
    return g;
}

function getH(currentg, end){
    let I = Math.abs(currentg.X_co_ordinate - end.X_co_ordinate) + Math.abs(currentg.Y_co_ordinate - end.Y_co_ordinate);
    return I;
}

function getF(start,current,end){
    let G = getG(current,start);
    let H = getH(current,end);
    return G + H;
}

function lowFinArray(arr,start,end){
    let current_low = arr[0];
    for(let i=0; i<arr.length; i++){
        let getF1 = getF(start, current_low, end);
        let getF2 = getF(start, arr[i], end);
        if(getF1 < getF2){
            current_low = arr[i];
        }
    }
    
    console.log("current low");
    console.log(current_low);
    
    return current_low;
}

function getneighbours(grid, current){
    
    let neightbours = [];
    
    neightbours.push(grid[getIndex(current.X_co_ordinate-1, current.Y_co_ordinate)]);
    neightbours.push(grid[getIndex(current.X_co_ordinate+1, current.Y_co_ordinate)]);
    neightbours.push(grid[getIndex(current.X_co_ordinate, current.Y_co_ordinate-1)]);
    neightbours.push(grid[getIndex(current.X_co_ordinate, current.Y_co_ordinate+1)]);
    
    /*
    for(i=0; i<neightbours.length; i++){
        neightbours[i].last = current;
    }*/
    console.log("neightbours");
    console.log(neightbours);
    return neightbours;
}

function pathfind(grid, start, end){
    
    let closedSet = [];
    let openSet = [];
    openSet.push(start);
    let current = start;
    console.log("low F in arr");
    console.log(lowFinArray(grid, start, end));
    
    
    /*
    console.log(start);
    console.log(current);
    console.log(end);
    console.log(grid);
    */
    
    let x=0;
    while(openSet.length > 0){
        
        console.log("executed " + (x++));
        console.log("openset");
        console.log(openSet);
        
        current = lowFinArray(grid, start, end);
        console.log("current");
        console.log(current);
        
        if(current == end){
           
            console.log(getPath(current));
        }
        
        let neighbours = getneighbours(grid, current);
        for(let i=0; i<neighbours.length; i++){
            
            let neighbour = neighbours[i];
            
            if(closedSet.includes(neighbour)){
                continue;
            }
            
            if(!openSet.includes(neighbours)){
                openSet.push(neighbours);
            }
            
            //console.log(current);
            let getg = getG(current, start);
            let geth = getH(current, end);
            //console.log(getg);
            let tGscore = getg + geth ; //here getH is being used as a distance funtion
            
            if(tGscore >= getg){
                continue;
            }
            
            neighbour.last = current;
            neighbour.g = tGscore;
            neighbour.f = getF(neighbour);
            
        }
        if(x>10){return 0;};
    }
    
}

function getPath(current){
    
    let path = [current];
    while(current.last != null){
        path.push(current.last);
    }
    
    return path;
}
























