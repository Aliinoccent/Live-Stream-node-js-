const createMeet=document.getElementById('createMeet');
const joinMeet=document.getElementById("joinMeet");
const roomId=document.getElementById("roomId");

console.log("this si", Room_Id)
console.log(window.location)
createMeet.addEventListener("click",()=>{
   const values=roomId.value;
 window.location.href = `/${values ? values : Room_Id}`;
})


joinMeet.addEventListener('click',()=>{

    const values=roomId.value;

    if(Room_Id ){
        
        window.location.href= `/${values }`
    }
    else{
        console.log('room is not exist');
    }
})
