import { expect } from "chai";
import { handler } from "../src/index";

const event = { message: "Hello World!" };

describe("index", () => {

    describe("#handler", () => {
        it("should invoke callback", (cb) => {
            handler(event, {}, cb);
        });

        it("should return a successful result", (cb) => {
            handler(event, {}, (error, result) => {
                expect(error).to.be.null;
                expect(JSON.parse(result)).to.deep.equal(event);
                cb();
            });
        });
    });
});
