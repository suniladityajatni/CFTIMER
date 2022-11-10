try {

    const url = window.location.href;

    var header = undefined;

    

    let seconds = 0;
    let flag = 0;
    let prev = undefined;
    let interval = null;
    let newInterval = null;
    let tried=0;

    function f() {

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
                        placeholder="Enter the number in seconds" style="width: 210px;" >
            </div>
            <button id="subtractButton" type="button" class="btn btn-primary">Submit</button>
        </div>
    </div>
    `

        if (url.includes("https://leetcode.com/problems")) {

            header = document.querySelectorAll(".css-101rr4k")[0];
        }
        else {
            header = document.querySelectorAll(".problem-statement > .header")[0];
        }
        if (!header) {
            if(tried==1000000)
            {
                throw "cannot find header";
            }
            if (url.includes("leetcode") || url.includes("codeforces"))
            {
                tried++;
                requestIdleCallback(f);
            }
            else
            {
                alert(document.readyState);
                alert("throwing");
                throw "Cannot find the header";
            }
        }
        header.appendChild(div);

        (function () {
            chrome.storage.local.get([url], function (result) {
                // alert(seconds);
                if (result[url]) {
                    seconds = result[url][0];
                    prev = result[url][1];
                    display(seconds);
                }
                return true;
            });
        })();

        const startTimer = document.getElementById("startButton");
        const stopTimer = document.getElementById("stopButton");
        const subtractTimer = document.getElementById("subtractButton");

        startTimer.addEventListener("click", start);
        stopTimer.addEventListener("click", stop);
        subtractTimer.addEventListener("click", subtract);
    }

    requestIdleCallback(f);



    function save() {
        const obj = {};
        obj[url] = [seconds, prev];
        chrome.storage.local.set(obj, function () {
            // console.log('Value is set to ');
            // console.log(obj);
        });
    }

    // document.addEventListener('visibilitychange', function () {
    //     if (document.hidden) {
    //         flag = 1;
    //         newInterval=interval;
    //         if (interval)
    //             interval=null;
    //         prev = Date.now();
    //         // seconds+=Date.now()-prevTime;
    //     }
    //     else {
    //         if (flag && newInterval)
    //             seconds += Math.ceil((Date.now() - prev) / 1000);
    //         // if (interval)
    //         //     interval = window.setInterval(timer, 1000);
    //         flag = 0;
    //     }
    // });



    function formatToHHMMSS(val) {
        const nval = new Date(val * 1000).toISOString().substr(11, 8);
        return nval;
    }


    function display(val) {
        let timeTaken = document.getElementById("timeTaken");
        timeTaken.innerText = formatToHHMMSS(seconds);
    }
    function timer() {
        if (interval) {
            seconds += (Date.now() - prev) / 1000;
            prev = Date.now();
            save();
            // console.log(seconds);
            display(seconds);
            window.requestAnimationFrame(timer);
        }
        else
            return;
    }
    function start() {
        if (interval)
            return;
        interval = 1;
        prev = Date.now();
        window.requestAnimationFrame(timer);
        // interval = window.setInterval(timer, 1000);
    }

    function stop() {
        if (!interval)
            return;
        prev = undefined;
        save();
        interval = null;
    }

    function subtract() {
        stop();
        let val = document.getElementById("valueTobeSubtracted").value;
        document.getElementById("valueTobeSubtracted").value = "";
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
    alert("Recieved an error");
    console.log("This error is from timely chrome extension pls ignore this");
    console.log(err);
}