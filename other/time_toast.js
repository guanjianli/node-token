//exec是等完成执行才返回输出
const {spawn, exec} = require("child_process");

let showToast = (title, content) =>{
    const ls = spawn("py", ["show_toast.py", title, content]);

    ls.stdout.on("data", (data) =>{
        console.log("output", `${data}`);
        exec("echo out", (...agrs) =>{
            console.log(...agrs);
        });
    });

    ls.stderr.on("data", (data) =>{
        console.log(`stderr: ${data}`);
    });

    ls.on("close", (code) =>{
        console.log(`child process exited with code ${code}`);
    });
};

let delayTimeDo = (timeFormat, cb) =>{
    let t = timeFormat.split(":");
    t.reverse();
    let sec = parseInt(t[0]);
    let min = parseInt(t[1]) || 0;
    let hour = parseInt(t[2]) || 0;
    let total = hour * 3600 + min * 60 + sec;
    setTimeout(cb, total * 1000);
};

delayTimeDo(process.argv[4] || 0, () =>{
    showToast(process.argv[2], process.argv[3]);
});