import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

export default async function (page, filepath, name) {
    const fs = createFsFromVolume(new Volume());
    await new Promise((resolve, reject) => {
        const compiler = webpack({
            entry: filepath,
            output: {
                library: {
                    name,
                    type: 'var',
                    export: 'default'
                },
                path: '/',
                filename: `${name}.bundle.js`
            },
            module: {
                rules: [
                    {
                        test: /\.css$/i,
                        use: ["style-loader", "css-loader"]
                    }
                ]
            }
        });

        compiler.outputFileSystem = fs;
        compiler.run((err, stats) => {
            if(err) {
                reject(err);
                return;
            }

            const info = stats.toJson();
            if (stats.hasErrors()) {
                reject(info.errors);
                return;
            }
            resolve();
        });
    });

    return await page.addScriptTag({
        content: fs.readFileSync(`/${name}.bundle.js`, 'utf8'),
        id: name
    });
}