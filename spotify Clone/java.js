let currensong = new Audio();
let songs;

function secondsTominutesSeconds(seconds){
    if (isNaN(seconds) || seconds<0){
        return "invalid input";
    }

    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedseconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedseconds}`;
}

async function getsongs(){
    let a = await fetch("http://127.0.0.1:5500/Spotify%20clone/songs/")
    let response = await a.text()
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let file = div.getElementsByTagName("a");
    let song = [];
    for(let index = 0;index < file.length; index++) {
        const element = file[index];
        // console.log(element);
        if(element.href.endsWith(".mp3")){
            song.push(element.href)
        }
    }
    return song;


}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio(track)
    currensong.src = track
    if(!pause){
        currensong.play();
        play.src = "pause.svg";

    }
    document.querySelector(".playbar").style = "height: 80px;";
    track2 = track.split("/songs/")[1]
    track3 = track2.replaceAll("%20", " ")
    document.querySelector(".songinfo").innerHTML = track3
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function main(){

    

    songs = await getsongs();
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    for (const song of songs) {
        songUL.innerHTML += ` <li>
                            <img src="music.svg" alt="">
                            <div class="info">
                                 <div>${song}</div>
                                 <div>Song Artist</div>
                                </div>
                                <div class="playnow">
                                    <span>
                                     <img src="palycircle.svg" alt="">
                                    </span>
                                    <span>Play Now</span>
                                </div>
                            </li>`;
    }
    // // let pla = new Audio(songs[1]);
    // // pla.play();
    // pla.addEventListener("loadeddata", () => {
    //     console.log(pla.duration);
    // })

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element =>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
            
        })
    })

    play.addEventListener("click", ()=>{
        if(currensong.paused){
            currensong.play()
            play.src = "pause.svg";
        }
        else{
            currensong.pause()
            play.src = "play.svg"; 
        }
    })

    currensong.addEventListener("timeupdate", () =>{
        // console.log(currensong.currentTime, currensong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsTominutesSeconds(currensong.currentTime)}/${
            secondsTominutesSeconds(currensong.duration)
        }`
        document.querySelector(".circle").style.left = (currensong.currentTime/ currensong.duration)*100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currensong.currentTime = ((currensong.duration)*percent)/100
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
        
       
    })

    document.querySelector(".close").addEventListener("click", () =>{
        document.querySelector(".left").style.left = "-120%";
    })


    previous.addEventListener("click", () =>{
        console.log("Previous clicked")
        let index = songs.indexof(currensong.src.split("/").slice(-1)[0])
        if((index-1)>length) {
            playMusic(songs[index-1])
        }
    })

    next.addEventListener("click", () =>{
        console.log("next clicked")
        let index = songs.indexof(currensong.src.split("/songs/").slice(-1)[0])
        
        if((index+1)>length) {
            playMusic(songs[index+1])
        }
    })
}


main()