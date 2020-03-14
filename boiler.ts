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
    path: `deploy/serverless.${appDirName}.yml`,
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

export const absorb: ActionBoiler = async ({
  allAnswers,
  writes,
}) => {
  const { appDirName, pkgName } = allAnswers

  return writes.map(({ path, sourcePath }) => ({
    action: "write",
    sourcePath: path,
    path: sourcePath,
    modify: (src: string): string =>
      src
        .replace(
          new RegExp(`: ${pkgName}`, "g"),
          ": web-components-serverless-boiler"
        )
        .replace(
          new RegExp(`${appDirName}:`, "g"),
          "appDirName:"
        )
        .replace(
          new RegExp(`/${appDirName}/`, "g"),
          "/appDirName/"
        ),
  }))
}
