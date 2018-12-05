import { randomBytes } from "crypto";

import * as AWS from "aws-sdk";
import { createLogger } from "bunyan";
import { error } from "util";

const logger = createLogger({ name: "index" });

export function handler(event: any , context: any, callback: (...args: any[]) => void) {
    return callback(null, JSON.stringify({ message: "Hello World!" }));
}
