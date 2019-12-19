#!/bin/node
require("http").createServer(function (req, res) {
    const cookies = new require("cookies")(req, res);
    let lastVisit = cookies.get("LastVisit", {signed: false});
    cookies.set("LastVisit", new Date().getTime(), {signed: false});
    cookies.set("k1", "v1", {signed: false, maxAge: 0});
    cookies.set("k3", "v3", {signed: false, maxAge: -1});
    cookies.set("k2", "v2", {signed: false, maxAge: 60000 * 600 * 24 * 7});
    if (!lastVisit) {
        res.setHeader("Content-Type", "text/plain:charset=utf8");
        res.end("hello,first visit");
    } else {
        res.setHeader("Content-Type", "text/plain:charset=utf8");
        res.end("last visit is " + lastVisit + ".");
    };
}).listen(8003);