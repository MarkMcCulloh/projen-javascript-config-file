import { Project } from "projen";
import { Configuration } from "webpack";
import { JavascriptConfigComponent } from "../src";

test("hello", () => {
  const project = new Project({
    name: "test-project",
    outdir: "test-project",
  });
  const projectName = project.name;
  const comp = new JavascriptConfigComponent<Configuration>(
    project,
    "test.config.js",
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
