let body = document.body;
let inputFile = document.querySelector("#input");
let videoBox = document.querySelector("#videoBox");
let durationBox = document.querySelector("#duration");
let timePlayedBox = document.querySelector("#timeplayed");
let imgBox = document.querySelector("#imgBox");
let playBox = document.querySelector("#playBox");
let stopBtn = document.querySelector("#stop");
let slider = document.querySelector("#slider");
let VolumeUp = document.querySelector("#volumeUp");
let VolumeDown = document.querySelector("#volumeDown");
let speedUp = document.querySelector("#speedUp");
let speedDown = document.querySelector("#speedDown");
let forwardBtn = document.querySelector("#forward");
let backwardBtn = document.querySelector("#backward");
let fullScreenBtn = document.querySelector("#fullScreen");
let displayMsg = document.querySelector("#displayMsg");
let video;
// let video = document.createElement("video");
// video.setAttribute("class", "video");
let currentPlayTime;
let duration;
let vidVolume = 1;
let playbackRate = 1;
let timmerObj;
let state = "";

inputFile.addEventListener("change", function (e) {
    video = document.createElement("video");    
    video.setAttribute("class", "video");
    let src = URL.createObjectURL(e.target.files[0]);
    let videoSrc = src;
    setVideos(videoSrc);
})

function setVideos(videoSrc) {
    video.src = videoSrc;
    video.play();
    videoBox.appendChild(video);

    video.addEventListener("loadedmetadata", function () {
        duration = Math.round(video.duration);
        let time = timeFormat(duration);
        durationBox.innerText = time;
        slider.setAttribute("max", duration);
    })
    getCurrTime();
    state = "play";
    stateChange();
}

playBox.addEventListener("click", function (e) {
    if (video) {
        state == "play" ? state = "pause" : state = "play";
        stateChange();
    }
})

stopBtn.addEventListener("click", function () {
    if (video) {
        video.remove();
        state = "pause";
        stateChange();
        stopTimmer();
        slider.value = 0;
        durationBox.innerText = '--/--';
        timePlayedBox.innerText = '00:00';
        slider.setAttribute("value", 0);
        currentPlayTime = 0;
        video = "";
    }
})

forwardBtn.addEventListener("click", forward);
backwardBtn.addEventListener("click", backward);

fullScreenBtn.addEventListener("click", fullScreen);
videoBox.addEventListener("dblclick", fullScreen);

slider.addEventListener("change", function(e){
    let value = e.target.value;
    video.currentTime = value;
})

VolumeUp.addEventListener("click", function () {
    if (vidVolume < 1) {
        vidVolume += 0.1;
        video.volume = vidVolume;
        msgDisplay("Volume", Math.round(vidVolume * 100) + "%");
    }
})

VolumeDown.addEventListener("click", function () {
    if (vidVolume > 0) {
        vidVolume -= 0.1;
        video.volume = vidVolume;
        msgDisplay("Volume", Math.round(vidVolume * 100) + "%");
    }
})

speedUp.addEventListener("click", function () {
    if (playbackRate < 3) {
        playbackRate += 0.5;
        video.playbackRate = playbackRate;
        msgDisplay("Speed", playbackRate + "x");
    }
})

speedDown.addEventListener("click", function () {
    if (playbackRate > 0) {
        playbackRate -= 0.5;
        video.playbackRate = playbackRate;
        msgDisplay("Speed", playbackRate + "x");
    }
})

// shortcut through keyboard
body.addEventListener("keyup", function (e) {
    if (e.code == "Space") {
        if(video){
            state == "play" ? state = "pause" : state = "play";
            stateChange();
        }
    }
    else if (e.key == "ArrowUp" && vidVolume < 1) {
        if (vidVolume < 1) {
            vidVolume += 0.1;
            video.volume = vidVolume;
            msgDisplay("Volume", Math.round(vidVolume * 100) + "%");
        }
    }
    else if (e.key == "ArrowDown" && vidVolume > 0) {
        if (vidVolume > 0) {
            vidVolume -= 0.1;
            video.volume = vidVolume;
            msgDisplay("Volume", Math.round(vidVolume * 100) + "%");
        }
    }
    else if (e.key == "+") {
        if (playbackRate < 3) {
            playbackRate += 0.5;
            video.playbackRate = playbackRate;
            msgDisplay("Speed", playbackRate + "x");
        }
    }
    else if (e.key == "-") {
        if (playbackRate > 0) {
            playbackRate -= 0.5;
            video.playbackRate = playbackRate;
            msgDisplay("Speed", playbackRate + "x");
        }
    }
    else if (e.key == "ArrowRight") {
        forward();
    }
    else if (e.key == "ArrowLeft") {
        backward();
    }
})

function forward() {
    currentPlayTime = Math.round(video.currentTime) + 5;
    video.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    msgDisplay("Forward by 5 sec");
    let time = timeFormat(currentPlayTime);
    timePlayedBox.innerText = time;
}

function backward() {
    currentPlayTime = Math.round(video.currentTime) - 5;
    video.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    msgDisplay("Backward by 5 sec");
    let time = timeFormat(currentPlayTime);
    timePlayedBox.innerText = time;
}

function stateChange() {
    if (state === "play") {
        playBox.innerHTML = `<i class="fas fa-pause state"></i>`;
        video.play();
    }
    else {
        playBox.innerHTML = `<i class="fas fa-play state"></i>`;
        video.pause();
    }
}

function fullScreen() {
    if (videoBox.requestFullscreen) {
        videoBox.requestFullscreen();
    }
}

function timeFormat(timeCount) {
    let time = '';
    const sec = parseInt(timeCount, 10);
    let hours   = Math.floor(sec / 3600); 
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60); 
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    time = `${hours}:${minutes}:${seconds}`;
    return time;
}

function getCurrTime() {
    timmerObj = setInterval(function () {
        currentPlayTime = Math.round(video.currentTime);
        slider.value = currentPlayTime;
        let time = timeFormat(currentPlayTime);
        timePlayedBox.innerText = time;

        if (currentPlayTime == duration) {
            state = "pause";
            stateChange();
            stopTimmer();
            video.remove();
            slider.value = 0;
            timePlayedBox.innerText = "00:00";
            durationBox.innerText = '--/--';
        }
    }, 1000);
}

function stopTimmer() {
    clearInterval(timmerObj);
}

function msgDisplay(domain, value) {
    displayMsg.style.display = 'block';
    if (value) {
        displayMsg.innerText = `${domain} : ${value}`;
    }
    else {
        displayMsg.innerText = `${domain}`;
    }
    setTimeout(function () {
        displayMsg.style.display = 'none';
    }, 2000);
}