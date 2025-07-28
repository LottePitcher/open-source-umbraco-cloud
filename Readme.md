# open-source-umbraco-cloud

I have an Umbraco (16) Cloud site running at https://opensourcecloud.lotte.dev. *Or least I do for now, I won't keep this site running for ever!*

I'm using this public GitHub repository as the "working" directory for that project: all development on the site should be done here, not committed directly to the Cloud git repo. There's a GitHub Action that, fingers crossed, gets everything it needs from GitHub Secrets to push to Cloud and update the live site!

*BTW I've written [this blog post](https://dev.to/lottepitcher/open-sourcing-an-umbraco-cloud-site-mjj) explaining how I set all this up in case you want to give it a go yourself.*

But first we'd love people to try running the site locally and contributing back - see the steps below. Would a workflow like this enable the community to contribute to the new Umbraco Community site that we're currently building on Cloud?

## Working Locally

1. Fork this repository
1. Clone locally
1. Open `OpenSourceTest.sln` in Rider|Visual Studio and start the website project
1. In the browser click the `Open Umbraco without restore` link
1. Log in using `community@umbraco.com` and `community!`
1. Settings section > Deploy dashboard > press the `Update Umbraco schema from data files` button
1. Content section > Click ... top-left > select the `Import` option
1. Select `\content-import\20250721-home.zip`, leave all options ticked and press `Import`
1. Confirm that now have a working home page at `https://localhost:44390`
1. If there are other files in the `\content-import` folder, import each one separately in alphabetical (i.e. date) order so that you have all the other content that people have contributed thus far. In a real project, we would recreate the initial import zip every so often and delete the separate ones.

## Contributing Back

I've raised issues for specific things I'd like people to test. But you're welcome to try whatever you like to have a go at the workflow contribution yourself.

In your fork, please work in a branch and a raise a pull request targetting the default branch of `develop`.

If you're creating new Document Types, Templates or Data Types you should see a corresponding .uda file for each item in your list of changes to commit. Make sure you commit those!

If you have new/updated content in the content tree that would be useful to share with others to review/test your changes, then find the content node in the Content section and:

1. Click the three dots ...
1. Select `Export`
1. Tick `Include all items below`, `Include content dependencies`, and `Include content file dependencies`. Do not tick the schema-related options as these you should have already committed.
1. Download the resulting zip file and save in the `content-import` folder using the naming convention of `YYYYMMDD-nodename.zip`
1. Commit this zip file and create your pull request!

If you have issues, or any thoughts in general on this set up, please let me know!

SuperTak 😀