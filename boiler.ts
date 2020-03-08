import { basename, join } from "path"
import {
  InstallBoiler,
  PromptBoiler,
  GenerateBoiler,
} from "boiler-dev"

export const install: InstallBoiler = async () => {
  const actions = []

  actions.push({
    action: "npmInstall",
    dev: true,
    source: ["serverless", "serverless-offline"],
  })

  return actions
}

export const prompt: PromptBoiler = async ({
  cwdPath,
  allAnswers,
}) => {
  const prompts = []

  if (!allAnswers.pkgName) {
    prompts.push({
      type: "input",
      name: "pkgName",
      message: "project name (kebab-case)",
      default: basename(cwdPath),
    })
  }

  return prompts
}

export const generate: GenerateBoiler = async ({
  allAnswers,
  files,
  cwdPath,
}) => {
  const actions = []

  for (const file of files) {
    const { name, source } = file

    if (name === "serverless.yml") {
      actions.push({
        action: "write",
        path: join(cwdPath, name),
        source: source.replace(
          /web-components-serverless-boiler/g,
          allAnswers.pkgName
        ),
      })
    }
  }

  return actions
}
