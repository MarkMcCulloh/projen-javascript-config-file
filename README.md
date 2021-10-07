[![npm version](https://badge.fury.io/js/projen-javascript-configuration-file.svg)](https://badge.fury.io/js/projen-javascript-configuration-file)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/MarkMcCulloh/projen-javascript-configuration-file/Release/main)
![License](https://img.shields.io/npm/l/projen-javascript-configuration-file)

# Javascript config file component for projen

WIP and subject to change

## Assumptions

- Config file supports ESM import/export (use `.mjs` file as needed)
- Only a single export, which is a default export
- Works best if export is a function (can work around that)

## Usage

Add `"projen-javascript-configuration-file"` to `devDeps` in `projenrc`

*Note: End a line with `//!` to remove it from the final output*


**In projenrc:**
```typescript
import { Configuration } from "webpack";

const projectName = project.name;
new JavascriptConfigComponent<Configuration>(
    project,
    "webpack.config.mjs",
    (webpackEnv) => {
      console.log("test"); //!
      return {
        name: projectName,
      };
    },
    {
      imports: [
        {
          module: "webpack-merge",
          nameImports: ["merge"],
        },
      ],
      variables: {
        projectName,
      },
    }
  );
```

**Resulting `webpack.config.mjs`**

```javascript
import { merge } from "webpack-merge";
const projectName = "test-project";

export default () => {
    return {
        name: projectName,
    };
};
```