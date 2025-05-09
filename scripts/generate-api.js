import { get } from 'http';
import { createWriteStream, existsSync, unlink } from 'fs';
import fsExtra from 'fs-extra';
const { removeSync } = fsExtra;
import { v4 } from 'uuid';
import tempDir from 'temp-dir';
import AdmZip from 'adm-zip';

const sourceUrl = "http://localhost:8080/ts.zip";
const tmpFilePath = tempDir + "/" + v4() + ".zip";
const generatePath = "src/__generated";

console.log("Downloading " + sourceUrl + "...");

const tmpFile = createWriteStream(tmpFilePath);

const request = get(sourceUrl, (response) => {
    response.pipe(tmpFile);
    tmpFile.on("finish", () => {
        tmpFile.close();
        console.log("File save success: ", tmpFilePath);

        // Remove generatePath if it exists
        if (existsSync(generatePath)) {
            console.log("Removing existing generatePath...");
            removeSync(generatePath);
            console.log("Existing generatePath removed.");
        }

        // Unzip the file using adm-zip
        console.log("Unzipping the file...");
        const zip = new AdmZip(tmpFilePath);
        zip.extractAllTo(generatePath, true);
        console.log("File unzipped successfully.");

        // Remove the temporary file
        console.log("Removing temporary file...");
        unlink(tmpFilePath, (err) => {
            if (err) {
                console.error("Error while removing temporary file:", err);
            } else {
                console.log("Temporary file removed.");
            }
        });
    });
});
