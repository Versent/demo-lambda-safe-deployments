"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("../index");
var event = {
    message: "Hello World!",
    operation: "echo",
};
describe("index", function () {
    describe("#handler", function () {
        it("should invoke callback", function (cb) {
            index_1.handler(event, {}, cb);
        });
        it("should return a successful result", function (cb) {
            index_1.handler(event, {}, function (error, result) {
                chai_1.expect(error).to.be.null;
                chai_1.expect(result).to.equal(event.message);
                cb();
            });
        });
    });
});
