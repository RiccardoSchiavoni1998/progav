export var moveleft=(number:number, dim:number)=>{
    let row = Math.floor((number/10)%10);
    let col = number%10;
    if(col == 1){
        return (row*10)+dim-1
    }else{
        return (row*10)+col-1
    }
}

export var moveright=(number:number, dim:number)=>{
    let row = Math.floor((number/10)%10);
    let col = number%10;
    if(col == dim){
        return (row*10)+1
    }else{
        return (row*10)+col+1
    }
}

export var movedown=(number:number, dim:number)=>{
    let row = Math.floor((number/10)%10);
    let col = number%10;
    if(row<dim){
        return (row+1)*10+col
    }else{
        return 10+col
    }
}

export var moveup=(number:number, dim:number)=>{
    let row = Math.floor((number/10)%10);
    let col = number%10;
    if(row > 0){
        return (row-1)*10+col
    }else{
        return dim+col
    }
}

export var checkmoveleft = (number:number, dim:number)=>{
    let row = Math.floor((number/10)%10);
    return(row==10);
}

export var checkmoveright = (number:number, dim:number)=>{
    let row = Math.floor((number/10)%10);
    return (row==0);
}

export var checkmoveup = (number:number, dim:number)=>{
    let col = number%10;
    return(col==10);
}

export var checkmovedown = (number:number, dim:number)=>{
    let row = Math.floor((number/10)%10);
    return (row==0);
}