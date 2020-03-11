import { basename } from "path"
import { ActionBoiler, PromptBoiler } from "boiler-dev"

export const install: ActionBoiler = async () => {
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

export const generate: ActionBoiler = async ({
  allAnswers,
}) => {
  const actions = []
  const { appDirName, pkgName } = allAnswers

  actions.push({
    action: "write",
    path: `serverless.${appDirName}.yml`,
    sourcePath: "serverless.yml",
    modify: (src: string) =>
      src
        .replace(
          /web-components-serverless-boiler/g,
          pkgName
        )
        .replace(/appDirName/g, appDirName),
  })

  return actions
}
