import { chapter, scene, stories } from "./chapter1/scene1/c1-s1-story.js"
export {imgUpdate, imgIndex}

let storyIndex = 0
let story = stories[Object.keys(stories)[storyIndex]]
let xp = 0
let health = 100
let gold = 0
let timeline = 0
let imgIndex = 1
let buttonIndex = 1
let buttonShown = story[Object.keys(story)[Object.keys(story).length - 1]].length

const xpValue = document.getElementById('xp-value')
const healthValue = document.getElementById('health-value')
const goldValue = document.getElementById('gold-value')
const main = document.getElementById('main-container')
const storySection = document.getElementById('story-section')
const storyContainer = document.getElementById('story-container')
const storyText = document.getElementById('story-text')
const btnContainer = document.getElementById('btn-container')
const buttons = document.getElementsByClassName('button')
const button1 = document.getElementById('button1')
const button2 = document.getElementById('button2')
const button3 = document.getElementById('button3')
const move = ['forward', 'backward']
const timelineRec = []

// add event listener to appropriate elements
document.addEventListener('keydown', handler)
document.addEventListener('click', handler)
for (const button of buttons) {
    button.addEventListener('click', handler)
    button.addEventListener('mouseover', handler)
    button.addEventListener('mouseout', handler)
}

// analyze user input
function handler(e) {
    const arrowUp = e.code === 'ArrowUp'
    const arrowDown = e.code === 'ArrowDown'
    const arrowRight = e.code === 'ArrowRight'
    const arrowLeft = e.code === 'ArrowLeft'
    const space = e.code === 'Space'
    const enter = e.code === 'Enter'
    const tab = e.code === 'Tab'
    const click = e.type === 'click'
    const mouseover = e.type === 'mouseover'
    const mouseout = e.type === 'mouseout'

    // input accepted, affecting timeline
    if (arrowUp || arrowRight || enter || space || click) {
        typeof story[timeline + 1] === 'undefined' ? timeline : timeline++
        update(story, move[0], e)
    }
    
    if (arrowLeft || arrowDown) {
        typeof story[timeline -1] === 'undefined' ? timeline : timeline--
        update(story, move[1], e) 
    }
    
    // input accepted, doesn't affecting timeline
    if (tab || mouseover || mouseout) {
        e.preventDefault()
        update(story, move[2], e)
    }

    // divider for every event shown in the console
    console.log('====================================================')
}

// Analyze user behavior and decide how the screen shown
function update(story, move, e) {
    timelineRec.push(timeline)
    
    const nextTimeline = timeline + 1
    const currentTimeline = timeline
    const previousTimeline = timelineRec[timelineRec.length - 2]
    const moveForward = move === 'forward'
    const moveBackward = move === 'backward' 
    const currIsImage = story[currentTimeline] === imgUpdate
    const prevIsImage = story[previousTimeline] === imgUpdate
    const currIsText = story[currentTimeline] !== imgUpdate && typeof story[currentTimeline] !== 'object'
    const prevIsText = story[previousTimeline] !== imgUpdate && typeof story[previousTimeline] !== 'object'
    const currIsButton = typeof story[currentTimeline] === 'object'
    const prevIsButton = typeof story[previousTimeline] === 'object'

    if (currIsText) {
        storyUpdate()
    }

    if (currIsImage && moveForward) {
        imgIndex++
        storyHide()
        imgUpdate()
    }

    if (currIsImage && moveBackward) {
        storyHide()
    }
    
    if (prevIsImage && moveBackward) {
        imgIndex--  
        imgUpdate()
    }

    if (currIsButton) {
        buttonShow()
        buttonChange(e)
    }

    if (prevIsButton && !currIsButton) {
        buttonHide()
    }
}

// Helper functions
function imgUpdate() {
    main.style.backgroundImage = `url(./chapter${chapter}/scene${scene}/images/c${chapter}-s${scene}-img${imgIndex}.jpg)`
}

function storyUpdate() {
    storySection.style.display = 'flex'
    storyText.innerText = story[timeline]
}

function storyHide() {
    storySection.style.display = 'none'
}

function buttonShow() {
    storySection.style.display = 'flex'
    storySection.style.backgroundColor = 'transparent'
    storyContainer.style.display = 'none'
    btnContainer.style.display = 'flex'
    button1.innerText = story[timeline][0]
    button2.innerText = story[timeline][1]
    button3.innerText = story[timeline][2]
    
    if (story[timeline].length === 2) {
        button3.style.display = 'none'
    } else if (story[timeline].length === 1) {
        button3.style.display = 'none'
        button2.style.display = 'none'
    }
}

function buttonHide() {
    storySection.style.display = 'flex'
    storySection.style.backgroundColor = 'black'
    storyContainer.style.display = 'block'
    btnContainer.style.display = 'none'

    // reset buttons to the default appearance
    buttonIndex = 1
    for (const button of buttons) {
            button.classList.remove('active')
        }
}

function buttonChange(e) {
    const buttonHover = e.type === 'mouseover'
    const buttonUnhover = e.type === 'mouseout'
    const tabPressed = e.code === 'Tab'
    let targetId = `button${buttonIndex}`

    // Add or remove .active class from button
    function addClass() {
        for (const button of buttons) {
            button.classList.remove('active')
        }
        document.getElementById(targetId).classList.add('active')
    }

    function removeClass() {
        for (const button of buttons) {
            button.classList.remove('active')
        }
    }
    
    // button appearance when tab was pressed
    if (tabPressed && buttonIndex < buttonShown) {
        buttonIndex++
        addClass()
    } else if (tabPressed && buttonIndex === buttonShown) {
        buttonIndex = 1
        addClass()
    }

    // button appearance when mouse hover it
    if (buttonHover) {
        targetId = e.target.id
        addClass()
    } else if(buttonUnhover) {
        removeClass()
    }
}