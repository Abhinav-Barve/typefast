const data = import('./words.js');
const keys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", " ", "-", "'"]


var touched;
window.onload = () => {
    $("#text").addClass("untouched");
    touched = false
}


function Line() {

    let line = "";

    for (var i = 0; i < 8; i++) {
        var random_word = words[Math.floor(Math.random() * 3000)] + "␣";

        for (j = 0; j < random_word.length; j++) {
            line += ("<span class='input-letters'>" + random_word[j] + "</span>");
        }
    }
    let line_updated = "";
    line_updated = line.substring(0, line.length - 36);
    document.getElementById("text").innerHTML = line_updated
    // document.getElementById("text").innerHTML += ("<wbr>"); 

}

Line();

// ---------------------------------------
// Max Heap for speeds.
class MaxHeap {
    constructor(){
        // this is where the array that represents our heap will be stored
        this.values = [];
    }

    parent(index) {
        return Math.floor((index - 1) / 2);
    }

    // index of the left child node
    leftChild(index) {
        return (index * 2) + 1;
    }

    // index of the right child node
    rightChild(index) {
        return (index * 2) + 2;
    }

    // returns true if index is of a node that has no children
    isLeaf(index) {
        return (
            index >= Math.floor(this.values.length / 2) && index <= this.values.length - 1
        )
    }

    swap(index1, index2) {
        [this.values[index1], this.values[index2]] = [this.values[index2], this.values[index1]];
    }
    
    add(element) {
        // add element to the end of the heap
        this.values.push(element);
        // move element up until it's in the correct position
        this.heapifyUp(this.values.length - 1);
    }

    heapifyUp(index) {
        let currentIndex = index,
            parentIndex = this.parent(currentIndex);

        // while we haven't reached the root node and the current element is greater than its parent node
        while (currentIndex > 0 && this.values[currentIndex] > this.values[parentIndex]) {
            // swap
            this.swap(currentIndex, parentIndex);
            // move up the binary heap
            currentIndex = parentIndex;
            parentIndex = this.parent(parentIndex);
        }
    }

    peek() {
        return this.values[0];
    }

    size() {
        return this.values.length;
    }

}

// -------------------------------------------------------



$(".textBox").click(() => {
    touched = !touched;
    if (touched) {
        
        $("#text").removeClass("untouched").addClass("touched");

        $(".input-letters").removeClass("typed wrong-typed currentKey").addClass("untyped");

        $(".untyped").first().addClass("currentKey");
        
    } else{
        $("#text").removeClass("touched").addClass("untouched");
        $(".input-letters").removeClass("typed wrong-typed currentKey untyped");
    }

    // const right = new Audio("media/right.mp3");
    const wrong = new Audio("media/wrong.mp3");
    let time_started;
    let time_ended;
    var speeds = new MaxHeap();
    var sum_speeds = 0, sum_error = 0;
    var errors = [];
    $(document).off().on("keydown", (e) => {

        var cur_letter = $(".currentKey").get(0).textContent;
        var cur_key = e.key;
        console.log(cur_key);

        if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        }
        
        if (keys.includes(cur_key)) {

            // calculate the time of start
            if ( $(".typed").first().length === 0 && $(".wrong-typed").first().length === 0 ) {
                time_started = new Date().getTime();
            }
            

            // correct key
            if ( (cur_key === " " && cur_letter === "␣") || (cur_key === cur_letter) ) {

                $(".currentKey").addClass("typed").removeClass("untyped");
                $(".typed").removeClass("currentKey");

                if ($(".untyped").first().length === 0) {

                
                var errorColor = {
                    color: ""
                    }
                var speedColor = {
                    color: ""
                    }
                    
                    // display speed
                    time_ended = new Date().getTime();

                    // speed formulae
                    var speed = Math.floor(($(".input-letters").get().length * 60000) / ( 4.7 *(time_ended - time_started))*100)/100
                    $(".speed").html(speed + "<span style='font-size:1rem'> wpm</span>")
                    speeds.add(speed); 
                    sum_speeds += speed;


                    // getting max speed
                    var max = speeds.peek();
                    
                    // speed-gain formulae
                    var speed_gain = (Math.floor((speed - (sum_speeds / speeds.size())) * 100)) / 100
                    
                    // ṣet speed-gain color
                    if (speed_gain >= 0) {
                        speedColor.color = "#00b100"
                    } else {
                        speedColor.color = "rgb(255, 53, 53)";
                    }


                    $(".speed-gain").html("<span style='color: " + speedColor.color + "'>" + speed_gain + "<span style='font-size:1rem'> wpm</span>")
                    $(".max").html(max + "<span style='font-size:1rem'> wpm</span>")
                    
                    
                    // error formulae
                    var error = $(".wrong-typed").get().length
                    $(".error").html(error)
                    errors.push(error); 
                    sum_error += error;
                    // error-gain formulae
                    var error_gain =(Math.floor((error -  (sum_error / errors.length))*100))/100
                    
                    // set error-gain color
                    if (error_gain <= 0) {
                        errorColor.color = "#00b100"
                    } else {
                        errorColor.color = "rgb(255, 53, 53)";
                    }

                    $(".error-gain").html("<span style='color :" + errorColor.color + "'>" + error_gain + "</span>")
                    
                    Line();
                    $(".input-letters").addClass("untyped").removeClass("typed wrong-typed currentKey");

                }

                $(".untyped").first().addClass("currentKey");

            }

            // wrong key
            else {

                wrong.play();
                $(".currentKey").addClass("wrong-typed").removeClass("untyped");

            }

        }
    })


})

