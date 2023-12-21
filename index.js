
var settings = {
    width: 500,
    height: 500,
    rows: 3,
    cols: 3,
    imgPath: './lol.png',
    dom: document.getElementById('myGamer'),
    isOver: false,
}
settings.fragWidth = settings.width / settings.cols;
settings.fragHeight = settings.height / settings.rows;
settings.fragNumber = settings.rows * settings.cols;

function init(){
    //1. init outer container
    initContainer();
    //2. init inner fragments
    var fragList = [];
    initFrags();
    //3. shuffle the fragments
    shuffle();
    //4. add click event
    registerEvent();

    function initContainer(){
        var container = settings.dom;
        container.style.width = settings.width + 'px';
        container.style.height = settings.height + 'px';
        container.style.margin = '30px auto';
        container.style.border = '1px solid #333';
        container.style.position = 'relative';
    }

    function Fragment(x, y, visible){
        this.left = x; // current x coordinator
        this.top = y; // current y coordinator
        this.correctLeft = this.left;
        this.correctTop = this.top;
        this.visible = visible;
        this.div = document.createElement('DIV');
        this.div.style.width = settings.fragWidth + 'px';
        this.div.style.height = settings.fragHeight + 'px';
        this.div.style.boxSizing = 'border-box';
        this.div.style.border = '1px solid #fff';
        this.div.style.position = 'absolute';
        this.div.style.background = `url(${settings.imgPath}) no-repeat -${this.correctLeft}px -${this.correctTop}px`;
        this.div.style.cursor = 'pointer';
        this.div.style.transition = '0.4s';
        if (!visible){
            this.div.style.display = 'none';
        }
    
        this.allocate = function () {
            this.div.style.left = this.left + 'px';
            this.div.style.top = this.top + 'px';
        }
        // check if the fragment is in correct position
        this.inCorrectPosition = function () {
            return isEqual(this.left, this.correctLeft) && isEqual(this.top, this.correctTop);
        }

        this.allocate();
    
        settings.dom.appendChild(this.div);
    }

    function initFrags(){
        fragList = [];
        var visible;
        for(var i = 0; i < settings.rows; i++){
            for(var j = 0; j < settings.cols; j++){
                // make the last one invisible
                visible = (i === settings.rows - 1 && j === settings.cols - 1) ? false : true;
                fragList.push(new Fragment(j * settings.fragWidth, i * settings.fragHeight, visible));
            }
        }
    }

    function shuffle() {
        // shulffle but not including the last one
        for(var i = 0; i < fragList.length - 1; i++){
            // random index
            var randIndex = generateRand(0, fragList.length - 2);
            // exchange current left/top with the random fragment's left/top
            exchange(fragList[i], fragList[randIndex]);
        }
    }

    function generateRand(min, max){
        return Math.floor(Math.random() * (max + 1 - min) + min);
    }

    function registerEvent(){
        var invisibleFrag = fragList.find(function (f) {
            return !f.visible;
        });
        var winHeader = document.querySelector('h2');
        console.log(invisibleFrag);
        fragList.forEach(function (f) {
            f.div.onclick = function () {
                if (settings.isOver) {
                    return;
                }
                // check if current frag is next to the invisible frag
                if (f.top === invisibleFrag.top && isEqual(Math.abs(f.left - invisibleFrag.left), settings.fragWidth) 
                || f.left === invisibleFrag.left && isEqual(Math.abs(f.top - invisibleFrag.top), settings.fragHeight)){
                    // exchange current frag with the 'display: none' frag
                    exchange(f, invisibleFrag);
                }
                
                // // backdoor for testing
                // exchange(f, invisibleFrag);
                
                // check if win
                if (isWin()){
                    settings.isOver = true;
                    winHeader.innerText = 'You win !!!';
                    fragList.forEach(function (f) {
                        f.div.style.border = 'none';
                        f.div.style.display = 'block';
                    });
                }
            }
        });
    }

    /**
     * 
     * @param {Fragment} frag1 
     * @param {Fragment} frag2 
     */
    function exchange(frag1, frag2){
        // exchange left
        var temp = frag1.left;
        frag1.left = frag2.left;
        frag2.left = temp;
        // exchange top
        temp = frag1.top;
        frag1.top = frag2.top;
        frag2.top = temp;

        // after exchanging, re-allocating two frags
        frag1.allocate();
        frag2.allocate();
    }

    /**
     * 
     * @param {Number} num1 
     * @param {Number} num2 
     */
    function isEqual(num1, num2){
        return parseInt(num1) === parseInt(num2);
    }

    function isWin(){
        var wrongFrags = fragList.filter(function (f) {
            return !f.inCorrectPosition();
        });
        console.log(wrongFrags.length);
        if (wrongFrags.length === 0) {
            return true;
        }
        return false;
    }
}

init();
