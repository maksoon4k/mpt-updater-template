# mpt-updater-template
This repo serves as a template to easily set up you FIka/MPT directory as a Github repository and leverage [smarterskipper's MPT-Updater](https://github.com/smarterskipper/MPT-UPDATER/blob/main/MPT%20Updater/Program.cs). It contains a gitignore template that is setup to ignore anything other than client mods, server mods, and configs. All of which are configrable vai the gitignore. See the "BepInEx config ignore list" as an example.

At the time of writing this smarterkipper's MPT-UPDATER will delete user/mods, bepinex/plugins, and bepinex/config and then place the repo contents, so the ignoring would not give any benefit and in fact could break things especially whne used for mods.

## Setup
1. Create a repo based off of this template. https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template


