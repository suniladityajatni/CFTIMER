try {

    const url = window.location.href;
    let div = document.createElement("div")
    div.innerHTML = `
    <div class="cebody">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
    <span class="material-symbols-outlined">hourglass_bottom</span>
        <h3 id="timeTaken">00:00:00</h3>
        <div class="timerButtons">
            <button id="startButton" type="button" class="btn btn-primary">Start</button>
            <br/>
            <button id="stopButton" type="button" class="btn btn-primary">Stop</button>
        </div>
        <div class="subtractForm">
            <div>
                    <label for="exampleInputEmail1">How much to subtract?</label>
                    <input type="number" id="valueTobeSubtracted" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                        placeholder="Enter the number in seconds" style="width: 250px;" >
            </div>
            <button id="subtractButton" type="button" class="btn btn-primary">Submit</button>
        </div>
    </div>
    `

    var header = document.querySelectorAll(".problem-statement > .header")[0];
    if (!header)
        throw "Cannot find the header";
    header.appendChild(div);





    let seconds = 0;
    let flag = 0;
    let prev = Date.now();
    let interval = null;
    const startTimer = document.getElementById("startButton");
    const stopTimer = document.getElementById("stopButton");
    const subtractTimer = document.getElementById("subtractButton");

    startTimer.addEventListener("click", start);
    stopTimer.addEventListener("click", stop);
    subtractTimer.addEventListener("click", subtract);

    (function () {
        chrome.storage.local.get([url], function (result) {
            // alert(seconds);
            if (result[url]) {
                seconds = result[url];
                display(seconds);
            }
            return true;
        });
    })();

    function save() {
        const obj = {};
        obj[url] = seconds;
        chrome.storage.local.set(obj, function () {
            console.log('Value is set to ');
            console.log(obj);
        });
    }

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            flag = 1;
            if (interval)
                clearInterval(interval);
            prev = Date.now();
            // seconds+=Date.now()-prevTime;
        }
        else {
            if (flag && interval)
                seconds += Math.ceil((Date.now() - prev) / 1000);
            if (interval)
                interval = window.setInterval(timer, 1000);
            flag = 0;
        }
    });



    function formatToHHMMSS(val) {
        const nval = new Date(val * 1000).toISOString().substr(11, 8);
        return nval;
    }


    function display(val) {
        let timeTaken = document.getElementById("timeTaken");
        timeTaken.innerText = formatToHHMMSS(seconds);
    }
    function timer() {
        seconds++;

        const obj = {};
        obj[url] = seconds;
        chrome.storage.local.set(obj, function () {
            console.log('Value is set to ' + seconds);
        });


        console.log(seconds);
        display(seconds);
    }
    function start() {
        if (interval)
            return;
        interval = window.setInterval(timer, 1000);
    }

    function stop() {
        save();
        if (!interval)
            return;
        clearInterval(interval);
        interval = null;
    }

    function subtract() {
        stop();
        let val = document.getElementById("valueTobeSubtracted").value;
        document.getElementById("valueTobeSubtracted").value="";
        console.log(val);
        val = parseInt(val);
        console.log(val);
        seconds -= val;
        display(seconds);
        save();
    }


    window.onbeforeunload = function () {
        // stop();
        if (!interval)
            ;
        else
            return "Are you sure to leave this page?";
    };

}
catch (err) {
    console.log("This error is from timely chrome extension pls ignore this");
    console.log(err);
}