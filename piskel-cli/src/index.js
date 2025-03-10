#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const childProcess = require('child_process');
const phantomjs = require('phantomjs2');
const JSZip = require('jszip');
const binPath = phantomjs.path;

// Parse command args
let args = minimist(process.argv.slice(2), {
    default: {
        crop: false,
        dataUri: false,
        debug: false,
        pixiMovie: false,
        quiet: false,
        scale: 1
    }
});

if (args.debug) console.log(args);

// Ensure a path for the src file was passed
if (!args._ || (args._ && !args._.length)) {
    console.error('Path to a .piskel file is required');

    process.exit(1);
}

let src = args._[0];

// Ensure src file name has exactly one '.piskel'
src = src.replace('.piskel', '') + '.piskel';

// Ensure the src file exists
if (!fs.existsSync(src)) {
    console.error('No such file: ' + src);

    process.exit(1);
}

// Read src piskel file
const piskelFile = fs.readFileSync(src, 'utf-8');

let output;

if (args.output) {
    // Ensure output arg has no extension
    output = args.output.replace(path.extname(args.output), '');
} else {
    // Use fallback output of same folder with same name as src (without the extension)
    output = path.basename(src, '.piskel');
}

// Trim any trailing slashes
output = output.replace(/[\\/]$/, '');

// Get path to Piskel's app js bundle
let piskelAppJsDir = path.resolve(__dirname, '../piskel');
let minJsFiles = fs.readdirSync(piskelAppJsDir).filter(filename => filename.indexOf('min') > -1);
let piskelAppJsFileName = minJsFiles[0];
let piskelAppJsPath = (piskelAppJsFileName) ? path.join(piskelAppJsDir, piskelAppJsFileName) : '';

if (!fs.existsSync(piskelAppJsPath)) {
    console.error(`Piskel's application JS file not found in: ${piskelAppJsDir}. Run prod build and try again.`);

    process.exit(1);
}

// Prepare args to pass to phantom script
const options = {
    piskelAppJsPath,
    output,
    zoom: args.scale,
    crop: !!args.crop,
    rows: args.rows,
    columns: args.columns,
    frame: args.frame,
    dataUri: !!args.dataUri,
    debug: args.debug,
    scaledWidth: args.scaledWidth,
    scaledHeight: args.scaledHeight,
    pixiMovie: !!args.pixiMovie
};

const childArgs = [
    path.join(__dirname, 'piskel-export.js'),
    piskelFile,
    JSON.stringify(options)
];

if (args.debug) {
    childArgs.unshift(
        '--remote-debugger-port=9035',
        '--remote-debugger-autorun=yes'
    );

    console.log('\nDebug console: http://localhost:9035/webkit/inspector/inspector.html?page=1\n');
}

if (!args.quiet) console.log('Piskel CLI is exporting...');

// Run phantom script
const phantomProcess = childProcess.execFileSync(binPath, childArgs);

// Print phantom script output
console.log(phantomProcess.toString());

if (args.pixiMovie) {
    // Create final zip for PixiJS Movie export
    const zipManifest = JSON.parse(fs.readFileSync('zip-manifest.json', 'utf-8'));

    const zip = new JSZip();

    zipManifest.forEach(function (filename) {
        if (filename.indexOf('.png') > -1) {
            zip.file(path.basename(filename), fs.readFileSync(options.output + '.png'), { binary: true });
        } else {
            fs.writeFileSync(options.output + ".json", fs.readFileSync(filename), 'utf-8');
            fs.unlinkSync(filename);
        }
    });


    fs.unlinkSync('zip-manifest.json');
}

if (!args.quiet) console.log('Export complete...');

process.exit(0);
