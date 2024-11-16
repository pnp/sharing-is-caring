# Contribution Guidance

If you'd like to contribute to this repository, please read the following guidelines. Contributors are more than welcome to share their learnings with others in this centralized location.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

Remember that this repository is maintained by community members who volunteer their time to help. Be courteous and patient.

## Question or Problem?

Please do not open GitHub issues for general support questions as the GitHub list should be used for feature requests and bug reports. This way we can more easily track actual issues or bugs from the code and keep the general discussion separate from the actual code.


## Typos, Issues, Bugs and contributions

Whenever you are submitting any changes to the PnP repositories, please follow these recommendations.

* Always fork the repository to your own account before making your modifications
* Do not combine multiple changes to one pull request. For example, submit any samples and documentation updates using separate PRs
* If your pull request shows merge conflicts, make sure to update your local main to be a mirror of what's in the main repo before making your modifications
* If you are submitting multiple samples, please create a specific PR for each of them
* If you are submitting typo or documentation fix, you can combine modifications to single PR where suitable

## Sample Naming and Structure Guidelines

When you are submitting a new sample, it has to follow up below guidelines

* You will need to have a `README.md` file for your contribution, which is based on [the provided template](../samples/README-template.md) under the `samples` folder. Please copy this template to your project and update it accordingly. Your `README.md` must be named exactly `README.md` -- with capital letters -- as this is the information we use to make your sample public.
  * You will need to have a screenshot picture of your sample in action in the `README.md` file ("pics or it didn't happen"). The preview image must be located in the `/assets/` folder in the root of your solution.
* The `README` template contains a specific tracking image at the bottom of the file with an `img` tag, where the `src` attribute points to `https://telemetry.sharepointpnp.com/sharing-is-caring/samples/readme-template`. This is a transparent image which is used to track viewership of individual samples in GitHub.
  * Update the image `src` attribute according with the repository name and folder information. For example, if your sample is named `my-awesome-sample` in the `samples` folder, you should update the `src` attribute to `https://telemetry.sharepointpnp.com/sharing-is-caring/samples/my-awesome-sample`
* If you find an existing sample which is similar to yours, please extend the existing one rather than submitting a new similar sample
  * For example, if you use Office Graph with React, please add a new web part to the existing solution, rather than introducing a completely new solution
  * When you update existing samples, please update also `README.md` file accordingly with information on provided changes and with your author details
* When submitting a new sample solution, please name the sample solution folder accordingly
  * Folder names should be all lowercase
* Do not use period/dot in the folder name of the provided sample

## Before you submit your pull request

Before you submit your pull request consider the following guidelines:

* Search [issues](https://github.com/pnp/sharing-is-caring/issues) to make sure that no other contributor is working on a similar sample
* If you want to create a new sample, [create an issue](https://github.com/pnp/sharing-is-caring/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Asample-idea%2CHelp+wanted+%F0%9F%AA%A7&projects=&template=sample-idea.yml&title=My%20Awesome%20Sample%20Idea&description=I%20have%20a%20great%20idea%20for%20a%20new%20sample.%20Please%20assign%20me%20to%20it&labels=sample%20idea) to propose your idea, and ask to be assigned to it.


## Submitting Pull Requests

Before you submit your pull request, make sure that you [read the guidance on how to create your pull request](https://github.com/pnp/sharing-is-caring/wiki/How-to-submit-a-Power-App-sample).

Here's a high-level process for submitting new samples or updates to existing ones.

1. Sign the Contributor License Agreement (see below)
2. Fork this repository [pnp/sharing-is-caring](https://github.com/pnp/sharing-is-caring) to your GitHub account
3. Create a new branch **from the `main` branch** for your fork for the contribution
4. Include your changes to your branch
5. Commit your changes using descriptive commit message 
6. Create a pull request in your own fork and **target the `main` branch**
7. Fill up the provided PR template with the requested details. Make sure to associate your PR with the issue you are addressing


Thank you for your contribution.

> Sharing is caring.

<img src="https://telemetry.sharepointpnp.com/sharing-is-caring/CONTRIBUTING.md" />