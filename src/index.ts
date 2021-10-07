import { format } from "prettier";
import { TextFile, Project, TextFileOptions } from "projen";

export interface JavascriptConfigComponentOptions extends TextFileOptions {
  /**
   * Text to prepend to the function
   */
  preFunction?: string;

  /**
   * Text to append to the function
   */
  postFunction?: string;

  /**
   * Text added to the top of the file, above any imports
   */
  header?: string;

  /**
   * Text added to the bottom of the file
   */
  footer?: string;

  /**
   * variable to add into the scope of the file.
   * These are added as `const` declarations near the top of the file.
   * The key is the variable name, the value with be serialized with `JSON.stringify()`.
   * @example `{ test: 'cool' }` turns into `const test = 'cool';`
   */
  variables?: { [key: string]: any };

  /**
   * Import statements to add near the top of the file
   */
  imports?: ImportStatement[];
}

export interface ImportStatement {
  /**
   * Name of the module being imported, e.g. 'projen'
   * @example If `'projen'`, then result is `import * from 'projen'`
   */
  readonly module?: string;

  /**
   * List of named objects to destructure from module.
   *
   * @example If `['Cool', 'Stuff']`, then `import { Cool, Stuff } from 'projen'`
   */
  readonly nameImports?: string[];

  /**
   * Use wildcard for import. Will alias wildcard to `name` property.
   */
  readonly isWildcard?: boolean;

  /**
   * Name of alias for imports.
   *
   * @example If 'Projen', then result is `import * as Projen from 'projen'`
   */
  readonly alias?: string;

  /**
   * Use double quotes instead of single quotes around module
   */
  readonly useDoubleQuotes?: boolean;

  /**
   * Custom import statement
   */
  readonly raw?: string;
}

export class JavascriptConfigComponent<TConfig> extends TextFile {
  preFunction?: string;
  postFunction?: String;
  configFunction: (..._: any) => TConfig;
  header?: string;
  footer?: string;
  imports: ImportStatement[];
  variables: { [key: string]: any };

  constructor(
    project: Project,
    filePath: string,
    configFunction: (..._: any) => TConfig,
    options?: JavascriptConfigComponentOptions
  ) {
    super(project, filePath, options);

    this.configFunction = configFunction;
    this.preFunction = options?.preFunction;
    this.postFunction = options?.postFunction;
    this.header = options?.header;
    this.footer = options?.footer;
    this.imports = options?.imports ?? [];
    this.variables = options?.variables ?? {};
  }

  getFileContents() {
    const preFunction = this.preFunction ?? "";
    const postFunction = this.postFunction ?? "";
    const header = this.header ?? "";
    const footer = this.footer ?? "";
    let variableContent = "";

    if (this.variables) {
      Object.entries(this.variables).forEach((entry) => {
        const key = entry[0];
        const obj = entry[1];
        if (typeof obj === "function") {
          variableContent += `const ${key} = ${obj.toString()};\n`;
        } else {
          variableContent += `const ${key} = ${JSON.stringify(obj)};\n`;
        }
      });
    }

    let functionText = this.configFunction.toString();
    if (functionText.includes("//!")) {
      functionText = functionText
        .split("\n")
        .map((t) => {
          if (t.endsWith("//!")) {
            return undefined;
          } else {
            return t;
          }
        })
        .filter((t) => t !== undefined)
        .join("\n");
    }

    const imports = this.imports
      ?.map((i) => {
        if (i.raw) {
          return i.raw;
        }
        const quoteString = i.useDoubleQuotes ? '"' : "'";
        const moduleString = `${quoteString}${i.module}${quoteString}`;
        let startImport = "";
        if (i.isWildcard) {
          startImport = `* as ${i.alias}`;
        } else if (i.nameImports) {
          startImport = `{ ${i.nameImports.join(", ")} }`;
        } else if (i.alias) {
          startImport = i.alias!;
        } else {
          return `import ${moduleString};`;
        }
        return `import ${startImport} from ${moduleString};`;
      })
      .join("\n");

    const fileContents = format(
      `${header}${imports}\n${variableContent}\nexport default ${preFunction}${functionText}${postFunction};\n${footer}`,
      {
        filepath: this.absolutePath,
      }
    );

    return fileContents;
  }

  synthesize() {
    this.addLine(this.getFileContents());
    super.synthesize();
  }
}
