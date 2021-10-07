import { Project } from "projen";
import { UserConfig } from "vite";
import { Configuration } from "webpack";
import { JavascriptConfigComponent } from "../src";

test("vite test", () => {
  const project = new Project({
    name: "test-project",
    outdir: "test-project",
  });
  const comp = new JavascriptConfigComponent<UserConfig>(
    project,
    "vite.config.js",
    ({ command, mode }) => {
      console.log(command, mode); //!
      return {
        css: {
          modules: false,
        },
      };
    },
    {
      preFunction: "defineConfig(",
      postFunction: ")",
      imports: [
        {
          module: "vite",
          nameImports: ["defineConfig"],
        },
      ],
    }
  );

  console.log(comp.getFileContents());
});

test("webpack test", () => {
  const project = new Project({
    name: "test-project",
    outdir: "test-project",
  });
  const projectName = project.name;
  const comp = new JavascriptConfigComponent<Configuration>(
    project,
    "webpack.config.mjs",
    () => {
      console.log("test"); //!
      return {
        bail: true,
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

  console.log(comp.getFileContents());
});
