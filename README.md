# mpt-updater-template
This repo serves as a template to easily set up you FIka/MPT directory as a Github repository and leverage [smarterskipper's MPT-Updater](https://github.com/smarterskipper/MPT-UPDATER/blob/main/MPT%20Updater/Program.cs). It contains a gitignore template that is setup to ignore anything other than client mods, server mods, and configs. All of which are configrable vai the gitignore. See the "BepInEx config ignore list" as an example.

At the time of writing this [smarterkipper's MPT-UPDATER](https://github.com/smarterskipper/MPT-UPDATER) will delete user/mods, and bepinex/plugins and then place the repo contents, so the ignoring would not give any benefit and in fact could break things especially whne used for mods.

## Setup
The ease of setup is highly dependent on whether or not you have an existing installation of SPT/Fika or not. A fresh setup means that you have a blank location that you intend to install SPT and Fika. An existing installation is where you already have SPT and Fika installed.

Using [Github Desktop](https://desktop.github.com/) can ease the use of git on your local machine, but keep in midn there may be situations where you ahve to run a git command in a teminal especially when configuring an existing installation.

### Fresh install
1. Create a repo based off of this template. https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template
2. Clone your newly created repo to your intended install location for SPT/Fika.
3. Install and configure all of your desired mods as usual.
4. Update the .gitignore file to exclude any mods of config that you don't want your clients to download and potentially be overwritten.
   - These are things like subjective graphical settings etc. Up to the users discretion.
5. Commit all of your mod changes and additions and push to the remote Github repository.
6. Setup [smarterkipper's MPT-UPDATER](https://github.com/smarterskipper/MPT-UPDATER) to point to this newly created remote repository.

### Existing install
1. Don't create a repo based off of this template.
     - Unless you know what you're doing it'll a bit easier to create a local repository copy the gitignore contents and then publish a remote repository.
2. Create a local repository where the contents are your SPT folder.
     - In Github Desktop that means when creating the repo name it the same as you SPT install folder. ![image](https://github.com/lukas-gust/mpt-updater-template/assets/31327300/a07fc1ee-00b4-410d-a4dc-ff6f7390240a)
     - My install is located in D:\MPT
3. It may take aminute to load, it's probably trying to commit the initial commit but we'll undo it anyways. so wait a few seconds and click outside the dialog box.
4. If it was able to finish it likely commited an intial commit. We need to undo that so that the gitignore can take effect.
     - Undo the initial commit shown under history.
5. Add a file called `.gitignore`. you can either do this manually or through Github Desktop via the Repository settings. ![image](https://github.com/lukas-gust/mpt-updater-template/assets/31327300/3f96ca8e-9cb0-4cc7-a6a5-5d8dd2d3d7c7).
6. Paste in the contents of this template repositorie's .gitignore into your own. Don't forget to save.
7. Commit these changes. In the changes section you sohuld only see items from the desired folders, `BepInEx/plugins`, `BepInEx/config`, `user/mods`.
8. Publish this repository to your remote Github repository.
9. Setup [smarterkipper's MPT-UPDATER](https://github.com/smarterskipper/MPT-UPDATER) to point to this newly created remote repository.
