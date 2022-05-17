---
title: Sharing is Caring
ms.date: 3/13/2020
author: JoanneHendrickson
ms.reviewer:  jhendr
localization_priority: 
description: This is a page that is modified during the Sharing is Caring workshop
ms.collection:  SPCommunity
---

[!INCLUDE [content-disclaimer](includes/content-disclaimer.md)]

# Sharing is Caring

## Getting started

The best way to get started is to attend a [Sharing is Caring](https://aka.ms/sharing-is-caring) session.

## Sign up for GitHub

If you don't already have a GitHub account, you won't be able to submit any comments, issues, etc., just like most Web sites and SharePoint itself. If you have an account - you get to skip ahead!

Simply click on the **Sign up** link at the top right of the page to create your account.

## Create Your Markdown

The next step is to gather the content. If you want to contribute something you've already written, it will probably require a bit of conversion. The documentation here is all written in markdown and there is a great markdown cheatsheet you can use if you'd like to write new content or convert something you already have.

### Convert Word Documents

If you have your content in a Word document, you can use one of several Word to markdown conversion tools:

- [Word to Markdown Converter](https://word2md.com/)
- [Writage Markdown plugin for Microsoft Word](http://www.writage.com/)

### Convert from an existing blog post

If you're starting with an existing blog post, then you may be able to convert the HTML from the post to markdown.
- [Browserling - Convert HTML to Markdown](https://www.browserling.com/tools/html-to-markdown)
- [Digital Converter - HTML To Markdown](https://convert-tool.com/conversion/html-to-markdown)

### Write from scratch

If you're writing new content from scratch, you can choose whichever editor you like. The important thing is to write in markdown format.

- [Visual Studio Code](https://code.visualstudio.com/Download) is a free editor from Microsoft and is used primarily for code. It also allows you to write markdown with a preview.
- Recommended Extension - Spell Checker - Spell Right - Multilingual, Offline and Lightweight Spell checker for text and markdown files, to help check your files before submission

> NOTE: Many of the tools mentioned above are developed by third parties, thus we cannot vouch for them. Let us know what issues or successes you have in the Issues.

## Add to the Repository

If you know how to work with GitHub, you probably don't need this section. You will have forked the repository, edited your fork, and issued a pull request. If that sounds like Greek to you, then here's the simple route to upload a piece of content.

### Navigate to the Appropriate Location

The repository is organized in a set of folders. The structure will undoubtedly change over time. If you're not sure, just add your content to the `Community` folder.

### Create the New File

Near the top of the screen, you'll see the **Add file** button, then **Create new file**. You'll get a new file, which you can give a name and then start editing.


Ideally, you'll use the [article template](./article-template.md) as your starting point. You can simply copy the markdown in that file and use it as the basis for your article. The simplest way to do this is to:

1. Open the [article template](./article-template.md) page
1. Click on the little pencil at the top right of the content
1. Copy everything in the numbered lines section of the page
1. Paste that content into your new article

The template contains a few main sections:

- Article metadata: This is stored as YAML, but you don't need to concern yourself with that, really. Fill in the appropriate values for title (your article title), author (your GitHub handle), and description (a little longer than the article title or the same as the article title)
- An include statement to pull in a disclaimer about community content. Please leave this as is.
- Example content with headers and sample text. You'll replace this with your amazing work.
- Principal author - This is where you can take credit for your work! Add you name and a link to your LinkedIn profile.

## Name the file

There is only one requirement for the filename, and this is to give it an `md` extension. This indicates that it is a markdown document. It's just the file extension, like `docx` for Word docs. As for the name itself, try to use a name which is descriptive, but not too long. For portability, use a name which has dashes to separate the words, like: my-fantastic-article.md.

## Edit the file

You can paste in the markdown from the Conversion steps above or type directly into the text box. Note the **Preview** tab, which allows you to see what the file will look like once you've saved it.

## Adding images

To add images to your article, you'll need to add them to the repository. This is easier if you get more familiar with GitHub and do pull requests, but here is how you can do it through the UI.

We store images in the media directory (folder). Each article should have its own directory underneath images named like the article's title, e.g., `known-folder-move-benefits-for-endusers`. You then upload your images into that directory.

The first step is to create the directory. GitHub won't store empty directories, so you need to add a new file into the directory you want to create. Navigate into the `media` directory, and then click the **Add file** > **Create new file** button. Type the name of the directory, followed by a forward slash: `/`.

This will show your name as a directory. Add a file by finishing with index.md. You don't need to use this file, but it'll allow you to create the directory. At the bottom of the screen, click the green Commit new file button.

Now you will be in the directory you just created. Click Upload files to add your images and then Commit changes.

If you can't figure out how to add the images to your article, add a comment to your article with instructions explaining where you would like each one added.

## Getting credit

If the content you are contributing is something you are repurposing from your blog or another location, you can add a section at the bottom of your article with information about you and the source. If you've used the article template, you'll already have this and can just edit it to include your name and a link to your profile. Here's an example:

Principal author: Susan Hanley, MVP

## Save the file

When you are done editing, scroll down to the Commit new file section. Add a title and comments about what you are submitting. This is information which becomes part of the "pull request" - basically you're talking to the people who work on the repo. At this point, you can leave the default option to Commit directly to the master branch. Click the Commit new file button.

On the next page, **Comparing changes**, select the **Create pull request** button. In the **Write** tab, edit your pull request details using the template provided. In **Category**, check off whether it is a content fix, new article, or add a category of your own. Delete the unchecked rows and all instructional text (after you've read it!) below to the **Related Issues** header.

Under **Related Issues** you can enter the exact issue number to link this pull request directly to that issue. Delete this section if it does not apply to your pull request. Under **What's in this Pull Request?** add the description you provided in the previous step for **Commit new file**. This text was added to the top of this Write tab automatically so cut and paste here instead. Read the Guidance notes for to ensure your pull request is pointed towards the `master` branch then delete this text. You can select the **Preview** tab to see how your pull request will appear in email notifications to the administrators. Having a clean pull request makes it easier to approve new content and content changes. Select **Create pull request** when you have finished all edits.

## What Happens Next?

Your content will have to be accepted before it will be generally available. If there are any questions about what you've submitted, you'll get comments or questions from others on the pull request. This is usually a quick process, but we may have questions about your content, so please watch for them.

If you provided an email address when you signed up for your GitHub account, you'll get notifications about any comments on your pull request.

Most articles get a light editing pass before they go "live". Most of us end up with typos or grammar mistakes in what we write. Sometimes there may be more significant issues, and we will follow up with you if there are.

Generally, articles go live within a week or so, sometimes more quickly. Be patient: this is all a volunteer effort. Open source FTW.

At this point, you're a contributor! Thanks in advance for making your contribution. Feel free to contribute more!

---

**Principal author**: [Your Name Here](http://www.linkedin.com/in/YourProfileLink)

---
