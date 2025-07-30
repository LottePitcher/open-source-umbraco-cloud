# Open-sourcing your own Umbraco Cloud site

> [!IMPORTANT]
> A quick Public Service Announcement before we start … please remember that you can’t just delete already committed sensitive data and make the repository public: that sensitive data will still be visible in the commit history! You knew this, right?! If you need to remove committed sensitive data, [GitHub has guidance on this](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

## Steps To Follow

1. Switch on the Umbraco CI/CD Flow for the site in the Umbraco Cloud Portal:  

   - Configuration > Advanced > Umbraco CI/CD Flow - toggle to Activate  
   - Copy the Project ID and API key as you’ll need them later  

1. Clone your Cloud site locally. If your site has multiple environments then clone the left-most main environment.

1. Create a new GitHub repository with only a MIT license file - it is always a good idea to have a license file in an open-source repo!  

1. Clone this GitHub repo locally  

1. Note do NOT commit anything in this new repo locally until you have completed all the steps and have been told to!  

1. Copy the `\src` folder and the root files from your local Cloud repo to this new repo. Do not copy the .git folder or ‘pull’ from your local repo as you’ll get sensitive info in the commit history! For the avoidance of doubt... all the remaining steps refer to updating **your new repo**.

1. In your website folder delete the following (if they exist):  

   - `\bin\` folder  
   - `\obj\` folder  
   - `\umbraco\Data\` folder  
   - `\umbraco\Licenses\umbracoDeploy.lic` file  
   - `\umbraco\Licenses\umbracoForms.lic` file  
   - `\umbraco-cloud.json` file  

1. In your website `umbraco\Licenses` folder, create an empty file called `.gitkeep`. .gitkeep is not a special git file, it’s just a naming convention used to indicate a file whose sole purpose is to force git to create an otherwise empty folder. My GitHub action will fail when creating the license files if that folder does not exist, unless someone improves that for me ;-)  

1. You want users to log in with a local database backoffice user, not  with Umbraco ID. So update the website `.csproj` and comment out (not delete) the `Umbraco.Cloud.Cms` package reference line. Now when you work locally you will only be prompted to log in as a backoffice user.  

1. You will need Umbraco Deploy to be running locally so that contributors can import your schema and content, and also contribute new doc types etc back. Umbraco Deploy for Cloud does not support running on localhost without a license. However the On-premises version of Umbraco Deploy does. So update your website `.csproj` to comment out the `Umbraco.Deploy.Cloud` package reference line and add a new reference to the `Umbraco.Deploy.OnPrem` package of the same version. Your `.csproj` should look like [mine](src/OpenSourceTest.Site/OpenSourceTest.Site.csproj). Do not just overwrite the package reference as then the GitHub action that we suggest you use won’t work properly!  

1. To make contributing as easy as possible, you should update `appSettings.Development.json` to support unattended installs and have a default connection string (see [here](src/OpenSourceTest.Site/appsettings.Development.json#L31-L42) if you need help on that).  

1. Update the root `.gitignore` file with [these extra lines](.gitignore#L418-L431). These rules ensure that no-one will accidentally commit sensitive files. If you’re wondering about `Trigger.ps1`, this is a file that Deploy On-Prem might create locally on start-up. We don’t need/want that committed either.  

1. You should now test this by running your local site. If all goes to plan, the install process will happen without prompting, and you can log in to your backoffice using the credentials you specified in `appSettings.Development.json`.  

1. From the Settings section > Deploy dashboard, use the “Update Umbraco schema from data files” feature. Any document types, templates etc that you already had should now exist locally too  

1. One final thing I suggest you do is update your `Readme.md` file in the root and delete all instructions about working with Cloud: not relevant for this working repository.

So you now have a working local site running the latest codebase, with no sensitive files. You can now commit your changes, push to GitHub, share your code with the world and even accept pull requests from contributors 🎉

### But two questions remain:

1. How do changes get deployed back to the Cloud site? This is obviously rather fundamental as you should be working in this GitHub repository from this point onwards!  

1. How do you share content and media without having the Cloud ‘transfer’ features in the backoffice?

## Getting Changes Back to Cloud

We're using a GitHub Action that uses the V2 Umbraco Cloud API endpoints.

In your GitHub repository go to Settings > Security > Secrets and Variables > Actions. There are two tabs, one for Secrets and one for Variables.

On the Secrets tab, create the following Repository Secrets:

* `UMBRACO_CLOUD_API_KEY`: the API Key value from the Cloud Portal  
* `PROJECT_ID`: the Project ID value  from the Cloud Portal  
* `UMBRACO_CLOUD_JSON`: contents of the `umbraco.cloud.json` file in your Cloud repo website folder
* `DEPLOY_LICENSE_KEY`: contents of the `\umbraco\License\umbracoDeploy.lic` file in your Cloud repo website folder 
* `FORMS_LICENSE_KEY`: contents of the `\umbraco\License\umbracoForms.lic` file in your Cloud repo website folder

Now do the following updates to your repository:

1. Copy the Cloud API v1 powershell scripts from [here](.github/powershell/APIv2) into the same folder location in your repo (.github\powershell\APIv2)  

1. Copy all the .yml files from [here](.github/workflows) into the same folder location in your repo (.github\workflows)

1. Update the `cloud-artifact` job in `main-v2.yml`:

   - Set the `pathToWebsite` parameter
   - Set the `csProjFile` parameter
   - Set the `pathToFrontendClient` parameter (see ** Note below)

1. Update the `cloud-deployment` job in `main-v2.yml`:

   - Set the `targetEnvironmentAlias` to the left-most main environment alias (check this in the Cloud Portal > Configuration > Advanced > Umbraco CI/CD Flow > CI/CD Environment Targets). Of course you may prefer to switch to use a Repository variable here.

1. In the root of your repository add the `cloud.zipignore` file that you can copy from [here](cloud.zipignore) 
 
1. Copy your `.gitignore` file in the root of your repository and rename the copy to be `cloud.gitignore`  

1. Edit `cloud.gitignore` and remove the “CUSTOM rules” section that you added earlier

> [!NOTE]
> ** If you do NOT have a separate project which needs a npm build task then delete the `pathToFrontendClient` line, and update `cloud-artifact.yml` and delete the `Setup Node.js` and `Build frontend assets` steps.

Now you have a GitHub Action that will push to Cloud whenever the `main` branch is updated, or when it’s manually triggered (via the GitHub website Actions tab). 

You will probably now want to create a new branch called `develop` and set this as your default branch. But your branching strategy is up to you, just make sure that you understand when your GitHub action is going to run!

### Debugging

Please be warned that if there’s something wrong with the GitHub action, it might take down your target site. If that happens (and it did for me several times whilst working on it!) then I debugged by looking at the commit that was made to the Cloud repository during the deployment. The website `.csproj` is a good place to check first!

## Sharing Content and Media Updates

We're using the Umbraco Deploy Import and Export features for this. There are instructions in the [Contributing Back section](Readme.md?tab=readme-ov-file#contributing-back) of the readme on how to create Export zip files. From my live site backoffice, I created a zip file with the Home page, and committed it to a folder called `content-import`. The [Working Locally section](Readme.md?tab=readme-ov-file#working-locally) of the readme has instructions for people on how to import it. I suggest you will want to do something similar yourself so that people have actual content to work with locally. Just remember to give good guidance in your readme! 

## Version Upgrades

You can configure Cloud to NOT automatically do minor version updates. Patch updates however will always be done automatically. If this happens your next deployment would fail as your Umbraco version is out of sync. The solution to this is to manually update your working repository to use the latest packages, test locally (of course!) and try another deployment.

> [!NOTE]
> If you change the configuration of your environments via the Umbraco Cloud portal, Cloud will automatically update and commit those changes to the `umbraco-cloud.json` file. You must update your GitHub `UMBRACO_CLOUD_JSON` secret value with the updated contents of that file, otherwise future deployments will break!

## A Final Disclaimer!

The above all worked on our machines, your mileage may vary…

As we are asking the community for feedback on this approach, things might have changed a bit since these instructions were posted. We’ll endeavour to keep them up-to-date as we go! Please raise an issue here if anything isn't clear or not working for you.

If you want to message us about any of this, why not post a message in the \#contact-devrel channel in the [Umbraco Discord server](https://discord.umbraco.com). Or if you'd prefer, you can send us a message via https://umbra.co/contact-devrel.