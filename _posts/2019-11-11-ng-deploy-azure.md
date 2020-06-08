---
layout: post
title: Deploy Your Angular App to Azure with ng deploy
date: '2019-11-11T15:15:00.002-04:00'
author: Michael D. Callaghan
tags: 
- azure 
- angular
- deployment
layout: post
feature: https://walkingriver.com/assets/img/azure-angular.jpg
thumbnail: https://walkingriver.com/assets/img/azure-angular.jpg
cover_image: https://walkingriver.com/assets/img/azure-angular.jpg
canonical_url: https://walkingriver.com/ng-deploy-azure/
published: true
---

Someone commented on the discussion section of my [Ionic/PWA course at Pluralsight](https://pluralsight.pxf.io/Ly2EY) that there are many examples of deploying to Firebase, but few other services. My immediate reply was that Firebase makes it dead-simple to deploy. But the question got me thinking. My course is almost a year old. Maybe there are other really good deployment hosts, and I might be doing my viewers and readers a disservice by not investigating them. I have always been a big fan of Microsoft Azure, so figured I would see what it takes to deploy my Ionic PWA there.

<!--more-->

# Prerequisites
Naturally, there are things you need to do before starting out.

## Angular Project
First, I have to assume you are using an Angular project. The information in this post only works for Angular projects. I am going to use the Ionic-Angular PWA from my course, Notify.

## Angular CLI and Project
The absolute first thing I had to do with my demo project was upgrade it and Angular CLI from Angular 7 to 8. In fact, you need your Angular CLI to be at least version 8.3. 

Fortunately, the Angular docs provide a comprehensive [upgrade guide](https://update.angular.io/).

## Azure Account
It should go without saying that to deploy an app to any cloud provider, you need to have an account there. Azure is no exception. 

[Sign up for Microsoft Azure](https://azure.microsoft.com/)

# Azure Deploy
Microsoft recently released Azure ng-deploy, a CLI add-on for the angular CLI that makes it easy to deploy your Angular app to Azure. It is installed by the Angular CLI directly into an existing Angular CLI-based project, which includes modern Ionic-Angular apps.

## Installation
```
ng add @azure/ng-deploy
```

This command executed with the following output on my Mac.

```
added 70 packages from 113 contributors in 20.727s

4 packages are looking for funding.
Run "npm fund" to find out more.
Installed packages for tooling via npm.
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code ---------- to authenticate.
```

Opening that URL and entering the code provided, took me to a page that asked me to log into my Microsoft account. Once I did so, the `ng add` command continued, asking me which Azure account to use (yes, I have two). 

```
? Under which subscription should we put this static site? Visual Studio Enterprise – --------------------------------
✔ Creating resource group app-static-deploy at West US (westus)
    Account appstatic already exist on subscription, using existing account
CREATE azure.json (349 bytes)
UPDATE angular.json (5793 bytes)
```

As you can see, it created an Azure Resource Group to hold the web assets. 

Next, it created a file called `azure.json`, and updated my `angular.json` file. The former file contains information about how the project should be built, where the build can be found, and what Azure subscription to use.

It added the following blocks to `angular.json`, which appear to be more Azure configuration for the Angular CLI.

```json
"azureLogout": {
  "builder": "@azure/ng-deploy:logout"
},
"deploy": {
  "builder": "@azure/ng-deploy:deploy",
  "options": {
    "host": "Azure",
    "type": "static",
    "config": "azure.json"
  }
```

## Deployment
Now the fun part. The documentation says that the following command will build and deploy the project.

```
ng deploy
```

Unfortunately, my "stored credentials have expired," so I was asked to sign in again. Once I logged in, which worked exactly like the first time, the process continued on its own. However, I was immediately greeted with an error...

```
Preparing for deployment
Error when trying to deploy: 
The Resource 'Microsoft.Storage/storageAccounts/appstatic' under resource group 'app-static-deploy' was not found.
```

I presume it has to do with the fact that it found an existing account, `appstatic`, on my subscription, and that somehow it did not work properly. 

I logged into the Azure portal and found the resource group called `app-static-deploy`. Sure enough, it had no resources. Digging into the docs a little more, I found an option to specify the name of the account from the command line. So I reran the `ng add` command, as follows:

```
 ng add @azure/ng-deploy -m -a walkingrivernotify
 ```

The `-m` parameter indicates that I want the process to step me through everything manually. The `-a` parameter specifies the name of the storage account I want it to create. That name must be globally unique throughout Azure, so if the name you specify exists, it will be rejected. 

This command resulted in the following output, including my answers to its questions...

```
Skipping installation: Package already installed
? Overwrite existing Azure config for app? Yes
? Under which subscription should we put this static site? Visual Studio Enterprise – --------------------------------
? Under which resource group should we put this static site? app-static-deploy
✔ Retrieving account keys
✔ Creating web container
✔ Setting container to be publicly available static site
✔ Setting container to be publicly available static site
UPDATE azure.json (358 bytes)
UPDATE angular.json (5793 bytes)
```

That looks a little better, so I attempted the `ng deploy` again. This time it seemed to do much better, uploading 227 files in 39 seconds.

```
Preparing for deployment
preparing static deploy
[=======================================================================================================] 227/227 files uploaded | 100% done | 39.0s | eta: 0.0

deploying static site
see your deployed site at https://walkingrivernotify.z22.web.core.windows.net/
```

Notice at the end of the output is the public URL to the newly-deployed site. I appreciate the fact that it is an `https` site, and that Azure provides a valid certificate. Firebase does the same thing for any deployment that does not use custom domains. 

Custom domains are supported, but that is a topic for another time.

# Conclusion
That was not so bad. Other than one hiccup, Angular deployments to Azure seem to be relatively painless. It is good to see that developers have another option than Firebase. As good as Firebase is, competition with Azure will hopefully make them both better. I am eager to find out whether Amazon will catch up on the "ease of use" front with its AWS offerings. 

Most of what I did above would only be suitable for an individual developer. The documentation describes how to integrate deployment into a CICD pipeline, but that will have to wait for another batch of free time. 

