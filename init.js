const init = () => {
    var centerWrapper = document.querySelector("#center-wrapper");
    var leftWrapper = document.querySelector("#left-wrapper");
    var rightWrapper = document.querySelector("#right-wrapper");
    var p1Wrapper = document.querySelector("#p1-wrapper");
    var p2Wrapper = document.querySelector("#p2-wrapper");
    var p1Text = document.querySelector("#p1-text");
    var p2Text = document.querySelector("#p2-text");
    var score1 = document.querySelector("#score1");
    var score2 = document.querySelector("#score2");
    var roundText = document.querySelector("#round-text");
    var roundWrapper = document.querySelector("#round-wrapper");
    var scoreboardValuesContainer = document.querySelector(".scoreboard-values-container");
    var hasAnimated = false;

    var xhr = new XMLHttpRequest();
    var streamJSON = "./sc/streamcontrol.json";
    var scOBJ;
    var cBust = 0;

    xhr.overrideMimeType('application/json');

    const animateTexts = () => {
        let sec = 0.5;
        gsap.fromTo(scoreboardValuesContainer.children,{
            opacity:0 ,
        },{
            opacity:1 ,
            duration:sec,
            delay:(index)=>Math.ceil(index/2)/5,
            ease:"power4.inOut"
        })
    }   

    const animateSides = () => {
        let sec = 0.7;
        gsap.fromTo([leftWrapper,rightWrapper],{
            opacity:0 ,
            xPercent:(index) => index === 0 ? 100 : -100,
        },{
            opacity:1 ,
            xPercent:0,
            duration:sec,
            ease:"power4.inOut",    
            onComplete:  animateTexts ,
        })
    }
    
    const adjustFontSize = (element) => {
        element.style.fontSize = "";
        while(element.scrollWidth > element.getBoundingClientRect().width || element.scrollHeight > element.getBoundingClientRect().height ){
            let newFS = `${parseFloat(window.getComputedStyle(element).fontSize) * 0.95}px`;
            element.style.fontSize = newFS;
        }
    }

    const fillScoreboard = () => {
        roundText.innerText = scOBJ["rounds"]
        p1Text.innerText = scOBJ["pName1"];
        p2Text.innerText = scOBJ["pName2"];
        score1.innerText = scOBJ["pScore1"];
        score2.innerText = scOBJ["pScore2"];
        adjustFontSize(p1Wrapper);
        adjustFontSize(p2Wrapper);
        adjustFontSize(roundWrapper);
        if(hasAnimated) return;
        if(scOBJ["animate"] === "True"){
            gsap.fromTo(centerWrapper,{
                opacity:0,
                yPercent:-100
            },{
                opacity:1,
                yPercent:0,
                duration:0.6,
                ease:"sine.inOut",
                onComplete:animateSides,
            })
        }
        if(scOBJ["animate"] === "False") {
            document.documentElement.style.setProperty("--alpha",1);
        }
        hasAnimated = true;
    }

    const getData = () => {
        xhr.open("GET",`${streamJSON}?v=${cBust}`,true);
        xhr.send();
        cBust++;
    }
    
    getData();

    const parseJSON = () => {
        if(xhr.readyState === 4){
            scOBJ = JSON.parse(xhr.responseText);
            fillScoreboard();
        }
    }

    xhr.onreadystatechange = parseJSON
    
    
    adjustFontSize(p1Wrapper);
    adjustFontSize(p2Wrapper);
    adjustFontSize(roundWrapper);

    setInterval(getData,500)
}

window.onload = init;
