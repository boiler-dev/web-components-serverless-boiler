import { basename, join } from "path"
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
  files,
  cwdPath,
}) => {
  const actions = []
  const { appDirName, pkgName } = allAnswers

  for (const file of files) {
    const { name, source } = file

    if (name === "serverless.yml") {
      actions.push({
        action: "write",
        path: join(cwdPath, `serverless.${appDirName}.yml`),
        source: source
          .replace(
            /web-components-serverless-boiler/g,
            pkgName
          )
          .replace(/appDirName/g, appDirName),
      })
    }
  }

  return actions
}
