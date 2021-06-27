/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const markdownLinkCheck = require("markdown-link-check");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

const statusLabels = {
    alive: chalk.green("✓"),
    dead: chalk.red("✖"),
    ignored: chalk.gray("/"),
    error: chalk.yellow("⚠"),
};

const options = {
    // ignorePatterns: [{ pattern: "^http(s)://" }],
    retryOn429: true,
    retryCount: 2,
    fallbackRetryDelay: "30s",
    aliveStatusCodes: [200, 206],
};

function getFiles(dir, extension, result = []) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) getFiles(res, extension, result);
        else if (res.endsWith(extension)) result.push(res);
    }
    return result;
}

function checkFile(file) {
    return new Promise((resolve, reject) => {
        const opts = {
            ...options,
            baseUrl: `file://${path.dirname(file)}`,
        };
        markdownLinkCheck(fs.readFileSync(file, "utf-8"), opts, (err, results) => {
            const relativeFile = path.relative(process.cwd(), file);
            if (err) {
                console.log(relativeFile, err);
                reject(err);
            } else if (results.length) {
                const failed = results.filter((result) => result.status !== "alive" && result.status !== "ignored");
                console.log(relativeFile);
                if (failed.length) {
                    for (const result of failed) {
                        console.log("- [%s] %s", statusLabels[result.status], result.link);
                    }
                    reject();
                } else {
                    resolve();
                }
            }
        });
    });
}

async function checkAllFiles() {
    const results = await Promise.allSettled(getFiles("docs", ".md").map(checkFile));
    if (results.some(({ status }) => status !== "fulfilled")) {
        process.exit(-1);
    }
}

checkAllFiles();
