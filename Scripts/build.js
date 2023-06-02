const path = require('path');
const fs = require('fs');
const zip = require('archiver');
const sass = require('sass');

const Config = {
    Name: 'MSR_Toolkit',
    Version: 2.5,
    Old_Version: 2.4,

    Source: 'src',
    Delete_OutputDir: true,
    Replace_Cloudbuild: false,
    Create_Zip: false,
    Delete_Old_Zip: false,
    Delete_Old_Folders: false,
}

function OutConfig() {
    return {
        Name: Config.Name,
        Version: Config.Version,
        Source: path.join(__dirname, '..', Config.Source),

        OutputDir: path.join(__dirname,'..', `${Config.Name}_v${Config.Version}`),
        OutputFile: path.join(__dirname, '..', `${Config.Name}_v${Config.Version}.zip`),

        CloudDir: path.join(__dirname, `../../../TeamSM/Development/API/Cloud/`),

        Manifest: path.join(__dirname, '..', 'manifest.json'),
        ManifestOut: path.join(__dirname, '..', `${Config.Name}_v${Config.Version}`, 'manifest.json'),

        RootDir: path.join(__dirname, '..'),

        LocalDir: path.join(__dirname, '..', 'MSR_ToolkitProduction'),
    }
}


// @ File System API

function CreateDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

function DeleteDir(dir) {
    try {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach((file, index) => {
                const curPath = path.join(dir, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    DeleteDir(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dir);
        }
    } catch (error) {
        console.log(error);
    }
}

function DeleteFile(file) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}

// Copy Files and Folders with Excludes
function CopyFiles(src, dest, excludes = []) {
    if (fs.existsSync(src)) {
        fs.readdirSync(src).forEach((file, index) => {
            const curPath = path.join(src, file);
            const destPath = path.join(dest, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                if (!excludes.includes(file)) {
                    CopyDir(curPath, destPath);
                }
            } else {
                if (!excludes.includes(file)) {
                    fs.copyFileSync(curPath, destPath);
                }
            }
        });
    }
}

function CopyDir(src, dest) {
    fs.mkdirSync(dest);
    CopyFiles(src, dest);
}

function DeleteFileWithExtension(dir, extension) {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file, index) => {
            const curPath = path.join(dir, file);
            if (file.includes(extension)) {
                fs.unlinkSync(curPath);
            }
        });
    }
}

function CreateZIP(dir, output) {
    const archive = zip.create('zip', {});
    var output = fs.createWriteStream(output);
    archive.pipe(output);
    archive.directory(dir, false);
    archive.finalize();
}

const FsApi = {
    CreateDir: CreateDir,
    DeleteDir: DeleteDir,
    DeleteFile: DeleteFile,
    CopyFiles: CopyFiles,
    CopyDir: CopyDir,
    DeleteFileWithExtension: DeleteFileWithExtension,
    CreateZIP: CreateZIP,
}

const Sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ! Build

async function Build() {
    console.log('[MSR Toolkit] Starting...')

    // ? Delete OutputDir
    if (Config.Delete_OutputDir) {
        console.log('[MSR Toolkit] [Worker] Deleting Exists OutputDirs...')
        FsApi.DeleteDir(OutConfig().OutputDir);
        FsApi.DeleteDir(OutConfig().LocalDir);
    }


    // ? Create OutputDir
    console.log('[MSR Toolkit] [Worker] Creating OutputDirs...')
    FsApi.CreateDir(OutConfig().OutputDir);

    // ? Copy Source to OutputDir Exclude .sass
    console.log('[MSR Toolkit] [Compile] Copying Source to OutputDir...')
    FsApi.CopyFiles(OutConfig().Source, OutConfig().OutputDir, ['index.sass']);

    // ? Update Version
    console.log('[MSR Toolkit] [Worker] Updating Index.js Version...')
    const IndexJS_Content = fs.readFileSync(path.join(OutConfig().Source, 'index.js'), 'utf8');
    const RegExp_Version = new RegExp(Config.Old_Version, 'g');
    const IndexJS_NewContent = IndexJS_Content.replace(RegExp_Version, Config.Version);
    fs.writeFileSync(path.join(OutConfig().OutputDir, 'index.js'), IndexJS_NewContent);

    // ? Compile Sass
    console.log('[MSR Toolkit] [Worker] Compiling Sass...')
    const sassResult = sass.renderSync({
        file: path.join(OutConfig().Source, 'index.sass'),
        outFile: path.join(OutConfig().OutputDir, 'index.css'),
        outputStyle: 'compressed',
        sourceMap: false,
    });

    // ? Write Compiled Sass to OutputDir
    fs.writeFileSync(path.join(OutConfig().OutputDir, 'index.css'), sassResult.css);

    // ? Compile Manifest With replace all src/ to " "
    console.log('[MSR Toolkit] [Compile] Compiling Manifest...')
    let manifest = fs.readFileSync(OutConfig().Manifest, 'utf8');
    manifest = manifest.replace(/src\//g, '');
    fs.writeFileSync(OutConfig().ManifestOut, manifest);

    await Sleep(100);

    // ? Copy OutputDir to LocalDir
    console.log('[MSR Toolkit] [Worker] Generating LocalDir...')
    FsApi.CopyDir(OutConfig().OutputDir, OutConfig().LocalDir);

    await Sleep(100);

    // ? Create Zip
    if (Config.Create_Zip) {
        console.log('[MSR Toolkit] [Compile] Creating Zip...')
        FsApi.CreateZIP(OutConfig().OutputDir, OutConfig().OutputFile);
    }

    // ? Delete OutputDir
    if (Config.Delete_OutputDir) {
        console.log('[MSR Toolkit] [Worker] Deleting OutputDir...')
        FsApi.DeleteDir(OutConfig().OutputDir);
    }

    await Sleep(100);

    // ? Replace CloudBuild
    if (Config.Replace_Cloudbuild) {
        console.log('[MSR Toolkit] [Worker] Replacing CloudBuild...')
        FsApi.DeleteDir(OutConfig().CloudDir);
        FsApi.CreateDir(OutConfig().CloudDir);
        // ! Create Zip
        FsApi.CreateZIP(OutConfig().OutputDir, path.join(OutConfig().CloudDir, `${Config.Name}_v${Config.Version}.zip`));
    }

    await Sleep(100);

    // ? Delete All Old .Zip 
    if (Config.Delete_Old_Zip) {
        console.log('[MSR Toolkit] [Worker] Deleting Old Zips...')
        fs.readdirSync(OutConfig().RootDir).forEach((file, index) => {
            const curPath = path.join(OutConfig().RootDir, file);
            if (file.includes('.zip')) {
                FsApi.DeleteFile(curPath);
            }
        });
    }

    await Sleep(100);

    // ? Delete All Old Version Folders
    if(Config.Delete_Old_Folders) {
        console.log('[MSR Toolkit] [Worker] Deleting Old Folders...')
        fs.readdirSync(OutConfig().RootDir).forEach((file, index) => {
            const curPath = path.join(OutConfig().RootDir, file);
            if (file.includes(Config.Name)) {
                if (file.includes('v')) {
                    FsApi.DeleteDir(curPath);
                }
            }
        });
    }

    await Sleep(100);
    console.log('[MSR Toolkit] Done!')
}

Build();