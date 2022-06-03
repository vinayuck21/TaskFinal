const cards= document.querySelectorAll(".cards .card");
const selected= document.querySelector('selected');
const correct=document.querySelector('correct');

var clickSound = new Audio("click.mp3");

var gameoverSound= new Audio("game over.mp3");
gameoverSound.volume=0.05;


const NO_OF_HIGH_SCORES = 3;
const HIGH_SCORES = 'highScores';
const highScoreString = localStorage.getItem(HIGH_SCORES);
const highScores = JSON.parse(highScoreString) ?? [];
const lowestScore = highScores[NO_OF_HIGH_SCORES-1]?.score ?? 0;



function checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    const lowestScore = highScores[NO_OF_HIGH_SCORES-1]?.score ?? 0;
    if (score > lowestScore) {

      saveHighScore(score, highScores);
      showHighScores();
    }
    document.getElementById("show").style.display = "block";
}


function saveHighScore(score, highScores) {
    const name = prompt('You got a highscore! Enter name:');
    const newScore = { score, name };
    
    // 1. Add to list
    highScores.push(newScore);
  
    // 2. Sort the list
    highScores.sort((a, b) => b.score - a.score);
    
    // 3. Select new list
    highScores.splice(NO_OF_HIGH_SCORES);
    
    // 4. Save to local storage
    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
};


function showHighScores() {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    const highScoreList = document.getElementById(HIGH_SCORES);
    
    highScoreList.innerHTML = highScores
      .map((score) => `<li>${score.score} - ${score.name}`)
      .join('');    
}




let order=[];
let answer=[];
let answerKey=[];
let i=0;
let score=0;
//let player=0;
var player = prompt("0 for single player, 1 for multiplayer");

function setOrder()
{
if(player==0)
{
order=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
order.sort(() => 0.5 - Math.random());
showHighScores()
document.getElementById("show").style.display = "none";
gamePlay(player)
}
else if(player==1)
{
alert("player 1 sets the round")
document.getElementById("show").style.display = "none";
order=[]
answer=[]
answerKey=[]
cards.forEach(card => {
    card.addEventListener("click",() => {
        
        card.classList.add("multiRoundcards1")
        if(order.indexOf(card.getAttribute("id")-1)==-1){
            //console.log(card.getAttribute("id"))
            order.push(card.getAttribute("id")-1)
            if(order.length==36)     
            {
               gamePlay(1)
               player++
               return
            }
        }
    })
})
}
else if(player==2)
{
    console.log(player)
    cards.forEach(card => {
        card.classList.remove("multiRoundcards1")
    })
    alert("player 2 sets the round")
    document.getElementById("show").style.display = "none";
    order=[]
    cards.forEach(card => {
        card.addEventListener("click",() => {
            
            card.classList.add("multiRoundcards2")
            if(order.indexOf(card.getAttribute("id")-1)==-1){
                //console.log(card.getAttribute("id"))
                order.push(card.getAttribute("id")-1)
                if(order.length==36)     
                {
                   gamePlay(2)
                   player--
                   return
                }
            }
        })
    })
}

}





function nextSquare(order){
    let r=order[i]
    i++
    if(answerKey.indexOf(cards[r].getAttribute("id"))==-1)
    {
        answerKey.push(cards[r].getAttribute("id"))
    }

    for(let j=0;j<answerKey.length;j++)
    {
        window.setTimeout( () => {
                let x=cards[order[j]].getAttribute("id")
                if(answerKey.indexOf(x)!=-1){cards[order[j]].classList.add("roundCards")} 
            }, j*500)    
    }
}


function roundSetup(){

window.setTimeout(() => {
document.getElementById("show").style.display = "none";
},2000)
cards.forEach(card => {

card.classList.remove("clicked")
card.classList.remove("selected")
}) 

answer=[]
window.setTimeout(nextSquare(order),500)

}




function gamePlay(n){

cards.forEach(card => {
    card.classList.remove("roundCards1")
    card.classList.remove("roundCards2")
})
document.getElementById("show").style.display = "block";
roundSetup()
check(n)
//window.localStorage.clear()

}


function check(n){
    cards.forEach(card => {
        card.addEventListener("click", () => {
           
            s=card.getAttribute("id")
            if(answer.indexOf(s)==-1 && answerKey.indexOf(s)!=-1) //checks if block is correct and if it isnt repeating
            {
                card.classList.add("clicked")
                answer.push(s) 
                //console.log (i)
                if(answer.indexOf(s)==answerKey.indexOf(s)){      //checks order

                    clickSound.play()

                    if(answer.length==i){                         //if last block of that round
               
                    score+=10
                    window.setTimeout(roundSetup,250)

                    cards.forEach(card => {
                        card.classList.remove("roundCards")
                    })

                    if(answer.length==36)                         //if final round
                    {
                        score+=10
                        window.setTimeout( () => {
                            cards.forEach(card => {
                                card.classList.remove("clicked")
                            },1000)
                        })
                        checkHighScore(score);   
                        if(n==0){        
                        alert("Congrats! You've beat this game\n Score = "+score)
                        window.setTimeout(() => {location.reload()},1000)
                        }  
                        else{
                            alert("current player has completed the stage")
                            setOrder()
                            return;
                        }
                        
                    }
                }
                }
                else{                                            //if wrong order
                    //console.log("Game Over")
                    gameoverSound.play() 
                    if(n==0){
                    alert("Wrong Order :( Game Over \n Score = "+score)
                    }
                    else if(n==1){
                        alert("player 1 wins")
                    }
                    else if(n==2){
                        alert("player 2 wins")
                    }
                    checkHighScore(score);
                    cards.forEach(card => {
                        card.classList.remove("clicked")
                        card.removeEventListener
                    })

                    window.setTimeout(() => {location.reload()},1000)
                }
            }
            else if(answer.indexOf(s)==-1){                       //if wrong block
                gameoverSound.play() 
                if(n==0)
                {
                    alert("Game Over!\n score = "+ score) 
                }  
                if(n==1){
                    alert("player 1 wins")
                }
                else if(n==2){
                    alert("player 2 wins")
                }
                checkHighScore(score);
                location.reload()
            }             
        })
    })    
}




//timer



const startingMinutes=10
let time = startingMinutes*60
var seconds

const countdownEl = document.getElementById("countdown");

updateCountdown()
window.setInterval(updateCountdown,1000)

function updateCountdown(){
    const minutes = Math.floor(time/60);
    let seconds = time%60;
    seconds = seconds<10 ? '0'+seconds : seconds;
    //console.log(minutes)
    //console.log(seconds)
    countdownEl.innerHTML = `${minutes}: ${seconds}`;
    time--;
    score--;
}


setOrder()