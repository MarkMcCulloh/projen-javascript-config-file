import { TypeScriptProject } from "projen";

const project = new TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "projen-javascript-configuration-file",
  projenrcTs: true,
  peerDeps: ["prettier", "projen"],
  devDeps: ["webpack"],
  eslintOptions: {
    dirs: ["src", "test"],
    prettier: true,
  },
});

project.synth();
