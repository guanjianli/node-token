
//express 部分
var router = require("express").Router();

let datas = "wellcome dota";
router.get("/", function (req, res) {
    res.end("wellcome");
});

router.get("/set", function (req, res) {
    datas = req.query.txlist;
    res.end("done");
});

router.get("/get", function (req, res) {
    res.end(datas)
});

module.exports = router;