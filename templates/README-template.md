# Title of the sample

## Summary

Short summary on functionality and used technologies.

> Please provide a high-quality screenshot of your Power App below. It should be stored in a folder called `assets`.
> If possible, use a resolution of 1920x1080.
> You can add as many screen shots as you'd like to help users understand your sample without having to download it and install it.
> DELETE THIS PARAGRAPH BEFORE SUBMITTING

![picture of the sample](../samples/assets/preview.png)

## Applies to

* [Sharing is Caring](https://github.com/pnp/sharing-is-caring/)

> Update accordingly as needed.
> DELETE THIS PARAGRAPH BEFORE SUBMITTING

## Compatibility

> Don't worry about this section, we'll take care of it. Unless you really want to...

![Power Apps Source File Pack and Unpack Utility 0.20](https://img.shields.io/badge/Packing%20Tool-0.20-green.svg)
![Premium License](https://img.shields.io/badge/Premium%20License-Not%20Required-green.svg "Premium Power Apps license not required")
![Experimental Features](https://img.shields.io/badge/Experimental%20Features-No-green.svg "Does not rely on experimental features")
![On-Premises Connectors](https://img.shields.io/badge/On--Premises%20Connectors-No-green.svg "Does not use on-premise connectors")
![Custom Connectors](https://img.shields.io/badge/Custom%20Connectors-Not%20Required-green.svg "Does not use custom connectors")

## Authors

> One author per line, please
> DELETE THIS PARAGRAPH BEFORE SUBMITTING

Solution|Author(s)
--------|---------
folder name | [Author Name](../samples/LinkToYourGitHubProfile) ([@yourtwitterhandle](https://twitter.com/yourtwitterhandle)), Company

## Version history

Version|Date|Comments
-------|----|--------
1.1|September 2, 2021|Update comment
1.0|August 29, 2021|Initial release

## Features

> Description of the sample with possible additional details than in short summary.

This sample illustrates the following concepts:

* topic 1
* topic 2
* topic 3

## Prerequisites

> Any special pre-requisites? Include anything that needs to be done for this sample to work (anything in addition to importing the `.msapp` and data sources).
> DELETE THIS PARAGRAPH BEFORE SUBMITTING

## Data Sources

> Please list the individual data sources needed. See example below.
> DELETE THIS PARAGRAPH BEFORE SUBMITTING

### MySample List

This SharePoint list contains blah blah blah.  Set the list up as follows:

|Type|Internal Name|Required|
|---|---|:---:|
|Single line of text|Title|Yes|

## Minimal Path to Awesome

* [Download](../samples/solution/YOURSAMPLENAME.msapp) the `.msapp` from the `solution` folder
* Within **Power Apps Studio**, use the `.msapp` file using **File** > **Open** > **Browse** and select the `.msapp` file you just downloaded.
* Select the **Data** tab
* ...

## Using the Source Code

You can also use the [Power Apps CLI](https://docs.microsoft.com/powerapps/developer/data-platform/powerapps-cli) to pack the source code by following these steps::

* Clone the repository to a local drive
* Pack the source files back into `.msapp` file:
  ```bash
  pac canvas pack --sources pathtosourcefolder --msapp pathtomsapp
  ```
  Making sure to replace `pathtosourcefolder` to point to the path to this sample's `sourcecode` folder, and `pathtomsapp` to point to the path of this solution's `.msapp` file (located under the `solution` folder)
* Within **Power Apps Studio**, use the `.msapp` file using **File** > **Open** > **Browse** and select the `.msapp` file you just packed.

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

## Help

> Note: don't worry about this section, we'll update the links.

We do not support samples, but we this community is always willing to help, and we want to improve these samples. We use GitHub to track issues, which makes it easy for  community members to volunteer their time and help resolve issues.

If you encounter any issues while using this sample, you can [create a new issue](https://github.com/pnp/sharing-is-caring/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Abug-suspected&template=bug-report.yml&sample=YOURSAMPLENAME&authors=@YOURGITHUBUSERNAME&title=YOURSAMPLENAME%20-%20).

For questions regarding this sample, [create a new question](https://github.com/pnp/sharing-is-caring/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Abug-suspected&template=question.yml&sample=YOURSAMPLENAME&authors=@YOURGITHUBUSERNAME&title=YOURSAMPLENAME%20-%20).

Finally, if you have an idea for improvement, [make a suggestion](https://github.com/pnp/sharing-is-caring/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Abug-suspected&template=suggestion.yml&sample=YOURSAMPLENAME&authors=@YOURGITHUBUSERNAME&title=YOURSAMPLENAME%20-%20).

## For more information

- [Overview of creating apps in Power Apps](https://docs.microsoft.com/powerapps/maker/)
- [Power Apps canvas apps documentation](https://docs.microsoft.com/en-us/powerapps/maker/canvas-apps/)


<img src="https://telemetry.sharepointpnp.com/sharing-is-caring/samples/readme-template" />

---
> Note that better pictures and documentation will increase the sample usage and the value you are providing for others. Thanks for your submissions in advance! You rock ❤.
> DELETE THIS PARAGRAPH BEFORE SUBMITTING
