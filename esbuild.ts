import * as fs from 'fs';
import * as path from 'path';
import {build, Plugin} from 'esbuild';
import {visualizer, TemplateType} from "esbuild-visualizer";
import * as open from "open";

const functionsDir = 'src';
const outDir = 'dist';
const entryPoints = fs
  .readdirSync(path.join(__dirname, functionsDir))
  .filter(entry => entry !== 'common')
  .map(entry => `${functionsDir}/${entry}/handler.ts`);


export type EsbuildFunctionBundlerOptions = {
  /**
   * Defaults to cdk.out/esbuild-visualizer
   */
  outputDir?: string,

  /**
   * Defaults to "treemap"
   */
  template?: TemplateType,

  /**
   * Open the HTML file after bundling
   */
  open?: boolean
}

function esBuildPluginShrinkSourceMap(): Plugin
{
  //https://github.com/evanw/esbuild/issues/1685#issuecomment-944916409
  return {
    name: 'excludeVendorFromSourceMap',
    setup(build) {
      build.onLoad({ filter: /node_modules/ }, args => {
        if (args.path.endsWith('.js') && !args.path.endsWith('.json'))
          return {
            contents: fs.readFileSync(args.path, 'utf8')
              + '\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiJdLCJtYXBwaW5ncyI6IkEifQ==',
            loader: 'default',
          }
        else
          return
      })
    },
  }
}

(async () => {
  for (const entryPoint of entryPoints)
  {
    const resp = await build({
      entryPoints: [entryPoint],
      bundle: true,
      outdir: path.join(__dirname, outDir),
      outbase: functionsDir,
      platform: 'node',
      sourcemap: 'external',
      write: true,
      tsconfig: './tsconfig.json',
      minify: true,
      keepNames: false,
      plugins: [
        esBuildPluginShrinkSourceMap(),
      ],
      metafile: true,
    });

    const bundlerDefaults: EsbuildFunctionBundlerOptions = {
      outputDir: ".esbuild-visualizer",
      template: "treemap"
    };

    /* Analyze Bundle */
    // fs.writeFileSync('meta.json', JSON.stringify(result.metafile));
    // let text = await esbuild.analyzeMetafile(result.metafile, {verbose: true, color: true});
    // console.log(text);
    const htmlContent = await visualizer(resp.metafile, {
      title: entryPoint,
      template: bundlerDefaults.template!,
    });


    const outputFile = path.join(__dirname, bundlerDefaults.outputDir!, entryPoint + ".html")
    const outputDir = path.dirname(outputFile)
    if(!fs.existsSync(outputDir))
      fs.mkdirSync(outputDir, {recursive: true});

    fs.writeFileSync(outputFile, htmlContent, {});

    await open(outputFile);
  }
})().catch(e => {
  console.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});