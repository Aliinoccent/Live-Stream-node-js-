const socket = io('/');
const myPeer = new Peer(undefined, {
    host: "/",
    port: '3001'
})

myPeer.on('open', id => {
    socket.emit('joinRoom', Room_Id, id)
})
let peers = {}
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
const muteBtn = document.getElementById('mute')
const videoCam = document.getElementById('videoCam')

let myStream
// myVideo.muted=true
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {

    myStream = stream;
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {

        call.answer(stream);
        console.log('new user are connected ',call.peer)
        const video = document.createElement('video')
        console.log('first persone come ')
        call.on('stream', userVideoStream => {
            console.log('Media stream acquired')
            addVideoStream(video, userVideoStream)
        })
        peers[call.peer] = call;
    })

    socket.on('user-connected', (userId) => {
        setTimeout(() => { connectToNewUser(userId, stream) }, 2000)
        console.log("user connected", userId)
    })

    socket.on('user-disconnected', userId => {
        console.log(peers[userId], "userid");
        if (peers[userId]) {
            setTimeout(() => {
                peers[userId].close();
                delete peers[userId];
            }, 1000)
        }

    })


})
function addVideoStream(video, stream) {
    video.srcObject = stream;
    // console.log('stream here',stream);
    video.addEventListener("loadedmetadata", () => {
        video.play()
    })

    videoGrid.append(video);
}

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video')
    console.log("call", call)
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
    peers[userId] = call;
    console.log(peers[userId], "this get user id want to immidieatly remove")


    call.on('close', () => {
        video.remove();

    });
}

// muted and unmuted, setup camara permision on off

let muted = false
muteBtn.addEventListener('click', () => {
    myStream.getAudioTracks().forEach(track => track.enabled = !muted)
    muted = !muted
    console.log("click howa", myStream)
})

let videocamara = true;
videoCam.addEventListener('click', () => {
    myStream.getVideoTracks().forEach(track => track.enabled = !videocamara)
    videocamara = !videocamara;
})



// messege stup

const sendMsg = document.getElementById('sendMsg');
const messegeInput = document.getElementById('messegeInput')
const ul = document.getElementById('ul');
sendMsg.addEventListener('click', () => {
    const message = messegeInput.value;
    console.log("messege go to send", message)
    if (message)
        socket.emit('sendToUsers', message);
    messegeInput.value = ''

})
let isfirstMsg=true;
socket.on('otherReciver', (data) => {
    
    
    if (isfirstMsg) {
        data.forEach(msg => {
            const li = document.createElement('li');
            li.innerText = msg
            ul.appendChild(li);
            li.style.listStyle='none'

        })
        isfirstMsg=false;
        console.log(isfirstMsg)
    }
    else {
        const li = document.createElement('li');
        li.innerText = data[data.length - 1]
        li.style.listStyle='none'
        ul.appendChild(li);
        console.log(data[length], ' data[length-1]')
    }


}) 