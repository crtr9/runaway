# Runaway! - NPM Scripts Manager
  
## Overview  
  
Foregoing the use of a full-featured task-runner for developing JS applications in favor of simple npm scripts is becoming more and more common.  For good reason: *it's simple.*  
  
**The Problem:** Any reasonably sized project ends up needing a lot of script commands to lint, build, transpile, optimize, etc., etc.  Having an undocumented list of commands in your `package.json` quickly becomes cumbersome.  

**A Solution:** *Runaway!* is a very simple way to manage the list of scripts in your `package.json`.  It's not complex.  It's not something you couldn't build yourself in an hour or two.  But hey, it's here.  And I'm writing the documentation so you don't have to keep explaining it to your team mates.  

By organizing your script commands in individual `.js` files, you're able to provide code-level documentation on what's happening and why.  All *Runaway!* does is rewrite the `scripts: {}` section of your `package.json` based on the "command files" it finds.  
  
  
# Installation  
  
```  
npm install --save-dev runaway  
```  
  
Or Yarn.  If you're using Yarn, I'm sure you already know what to do. :)  
  
  
# .runaway/

*Runaway!* asks that you organize your command files in a `.runaway/` folder in the root of your project.

Command files are simple.  At their minimum, they're expected to expose an object with a `command` property.
  
```  
<your-project-directory>/
    src/
    package.json
    
    .runaway/  <-- This one right here.  
```  
  
Presuming you want to make a command called `build` you'll now create a `build.js` file inside `.runaway/`  
  
```  
<your-project-directory>/
    ...

    .runaway/
        build.js
```  
  
In that `build.js` file, you want to export an object that has a string `command` property:  
  
> **.runaway/build.js**
> ```javascript  
> module.exports = {
>   command: "babel src/main.js"  
> };  
> ```
  
That's it.  Now we have to rebuild the `package.json`
  
  
# Rebuilding `package.json`  
  
Unfortunately `package.json` is a JSON file and we can't actually crawl the `.runaway/` directory automatically.  If it were `package.js` we certainly could and that'd be great, but... Carry on.  
  
Instead, *Runaway!* provides a command for rebuilding the `package.json` based off what it finds in `.runaway/`.  That command is as follows:  
  
```
npx runaway --rebuild
```
  
Now if you open up your `package.json` you should see the `scripts: {}` section reflect what's in `.runaway/`.  
  
> Note that the name of the command that ends up in `package.json` matches the name of the file.  You're able to specify a specific name for the command with the `name` property.  
  
  
# .runaway/.bin  
  
Often you need to write small scripts that do fairly custom things in your build process.  There's no reason you couldn't just write a runaway command like:  
  
> **.runaway/build.js**
> ```javascript  
> module.exports = {
>   command: "node build-utils/my-custom-script.js"  
> }  
> ```  
  
But you've already started organizing your "build stuff" in `.runaway/` so why not those custom scripts too?  
  
Make a new directory `.bin/` inside the `.runaway/` directory, and move your `my-custom-script.js` into it.  
  
```
<your-project-directory>/
    .runaway/ .bin/my-custom-script.js
 ```  
  
Now you can change your script command:  
  
> **.runaway/build.js**
> ```javascript
> module.exports = {
>   command: "runaway!my-custom-script.js"  
> }  
> ```  
  
When you run `npx runaway --rebuild`, `runaway` will replace "runaway!" with `node .runaway/.bin/`  
  
Is this necessary?  Absolutely not.  But it's nice to be able to easily spot "runaway!" and understand that there's some fancier-than-usual stuff going on with whatever your build script is.
