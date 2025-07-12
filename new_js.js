// const url = 'http://127.0.0.1:5500/songs/';
// const xhr = new XMLHttpRequest();

// xhr.open('GET', url, true);

// xhr.onreadystatechange = function () {
//   if (xhr.readyState === 4 && xhr.status === 200) {
//     const html = xhr.responseText;
//     console.log("hello");
//     console.log(html);
//   }
// };

// xhr.send();


let songs;

function secondsTominutesSeconds(seconds){
    if (isNaN(seconds) || seconds<0){
        return "00:00";
    }

    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedseconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedseconds}`;
}






let currentsong = new Audio();
const playbtn = document.getElementsByClassName('playbtn')[0];
async function getSongs(){
    const a = await fetch('http://127.0.0.1:5500/songs/');
    const respo = await (a.text());
    // console.log(respo);
    let div = document.createElement('div');
    div.innerHTML = respo;
    const arr = div.getElementsByTagName('a');
    const songs = [];
    for(let i = 0; i < arr.length; i++){
        if(arr[i].href.endsWith('mp3')){
            songs.push(arr[i]);
        }
    }
    return songs;

}


function playMusic(track){
    
    currentsong.src = '/songs/' + track;

    currentsong.play(); 
    playbtn.src = 'spotify Clone/pause.svg';
    let track2 = track.replaceAll('%20', ' ').split(',');
    document.getElementsByClassName('songinfo')[0].innerHTML  =  track2[0];
   
}


async function main() {
    songs = await getSongs();
    currentsong.src = songs[0];
    
    const area = document.querySelector('.songList').getElementsByTagName('ul')[0];

    
    songs.forEach(element => {
        let songname = element.title.split(",");
        area.innerHTML +=  `<li> <img src="/spotify Clone/music.svg" alt="">
                            <div class="musicinfo">
                                <div>${songname}</div>
                               
                            </div>
                            <div class="playnow">
                                
                                <img src="/spotify Clone/play.svg" alt="">
                            </div></li>`
    });

    const arr2 = document.querySelector('.songList').getElementsByTagName('li');
    Array.from(arr2).forEach(element=>{
        element.addEventListener('click', (e) =>{
            let url = e.target.textContent.trim();
            let audio = (url.replaceAll(' ', '%20'));
            playMusic(audio);
        }) 
    })

    playbtn.addEventListener('click', (e)=>{
        if(currentsong.paused){
            currentsong.play();
            playbtn.src = 'spotify Clone/pause.svg';
        }else{
            currentsong.pause();
            playbtn.src = 'spotify Clone/play.svg';
        }
    })

    currentsong.addEventListener('timeupdate', () =>{
        document.querySelector('.songtime').innerHTML  =  `${secondsTominutesSeconds(currentsong.currentTime)}/${secondsTominutesSeconds(currentsong.duration)}`;

         document.querySelector('.circle').style.left = (currentsong.currentTime/currentsong.duration)*100 + '%';
         if(currentsong.currentTime == currentsong.duration){
             let url = currentsong.src.split('songs/')[1];
        let index;
        for(let i = 0; i < songs.length; i++){
            let arrurl = songs[i].href.split('songs/')[1];
            if((decodeURIComponent(url) === decodeURIComponent(arrurl))){
                index = i;
                break;
            }
        }

        if(index + 1 < songs.length){
            playMusic(songs[index+1].title);
        }else{
            playMusic(songs[0].title);
        }
         }
    })

    document.querySelector('.seekbar').addEventListener('click', (e)=>{
        let per = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector('.circle').style.left = per + '%';
        currentsong.currentTime = ((currentsong.duration)*per)/100;
    })

    const hamburger = document.getElementsByClassName('hamburger')[0];

    hamburger.addEventListener('click', () => {
        document.getElementsByClassName('left')[0].style.left = '0%';
        document.getElementsByClassName('left')[0].style.zIndex = "1";
    })

    // const close = document.querySelector('logo');
    // close.addEventListener('click', () => {
    //      document.getElementsByClassName('left')[0].style.left = '-120%';
    //      document.getElementsByClassName('left')[0].style.zIndex = "0";
    // })

    const prev = document.querySelector('.prev');
    prev.addEventListener('click', () => {
        let url = currentsong.src.split('songs/')[1];
        let index;
        for(let i = 0; i < songs.length; i++){
            let arrurl = songs[i].href.split('songs/')[1];
            if((decodeURIComponent(url) === decodeURIComponent(arrurl))){
                index = i;
                break;
            }
        }

        if(index - 1 >= 0){
            playMusic(songs[index-1].title);
        }else{
            playMusic(songs[songs.length-1].title);
        }
    
    })

    let next = document.querySelector('.next');
    next.addEventListener('click', () => {
        let url = currentsong.src.split('songs/')[1];
        let index;
        for(let i = 0; i < songs.length; i++){
            let arrurl = songs[i].href.split('songs/')[1];
            if((decodeURIComponent(url) === decodeURIComponent(arrurl))){
                index = i;
                break;
            }
        }

        if(index + 1 < songs.length){
            playMusic(songs[index+1].title);
        }else{
            playMusic(songs[0].title);
        }
    })

    const card = (document.querySelectorAll('.card'));
    for(let name of card){
        name.addEventListener('click', (e) => {
                let songtitle = name.getElementsByTagName('p')[0].textContent;
                for(let i = 0; i < songs.length; i++){
                    let arrtitle = songs[i].title;
                        if(songtitle == arrtitle){
                            index = i;
                            break;
                    }
                }
                playMusic(songs[index].title);
                
        })
    }
}

main(); 