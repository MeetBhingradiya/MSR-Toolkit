const fs = require('fs');
const path = require('path');
const sass = require('sass');

const Config = {
    Source: 'src',
    OutputDir: 'MSR_ToolkitProduction',
}

function OutConfig() {
    return {
        Source: path.join(__dirname, '..', Config.Source),
        OutputDir: path.join(__dirname, '..', Config.OutputDir),
    }
}

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

process.exit(0);