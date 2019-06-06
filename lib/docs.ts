import { Application } from 'typedoc'
import chalk from 'chalk'
import { join } from 'path'
const app = new Application({
  target: 'ES5',
  module: 'commonjs',
  excludeExternals: true,
  includeDeclarations: false,
  ignoreCompilerErrors: true
})

const project = app.convert(app.expandInputFiles([join(__dirname, '../api')]))

if (project) {
  // Project may not have converted correctly
  const outputDir = join(__dirname, '../docs')

  // Rendered docs
  app.generateDocs(project, outputDir)
  // Alternatively generate JSON output
  app.generateJson(project, outputDir + '/documentation.json')
  console.log(chalk.cyan('  Build complete.\n'))
}
