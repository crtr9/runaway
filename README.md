# :ghost: *Runaway!* - NPM Scripts Manager

Foregoing the use of a full-featured task-runner for developing JS applications in favor of simple npm scripts is becoming more and more common.  For good reason: *it's simple.*  

**The Problem:** Any reasonably sized project ends up needing a lot of script commands to lint, build, transpile, optimize, etc., etc.  Having an undocumented list of commands in your `package.json` quickly becomes cumbersome.  

**A Solution:** *Runaway!* is a very simple way to manage the list of scripts in your `package.json`.  It's not complex.  It's not something you couldn't build yourself in an hour or two.  But hey, it's here.  And I'm writing the documentation so you don't have to keep explaining it to your team.

By organizing your script commands in individual `.js` files, you're able to provide code-level documentation on what's happening and why.  All *Runaway!* does is rewrite the `scripts: {}` section of your `package.json` based on the "command files" it finds.



# Brief Example

> Partial **package.json** prior to running *Runaway!*
> ```json
> {
>   "scripts": {}
> }
> ```
> (Yes, it's a bit of a contrived example, what with being empty.)

> **./runaway/build.js**
> ```javascript
> module.exports = {
>   command: "tsc src/main.js"
> };
> ```

> Now we run *Runaway!*
> ```
> npx runaway --rebuild
> ```

> Partial **package.json** after *Runningaway!* (See what I did there?)
> ```json
> {
>   "scripts": {
>     "build": "tsc src/main.js"
>   }
> }
> ```


# Getting Started

```  
npm install --save-dev runaway  
```

Or Yarn.  If you're using Yarn, I'm sure you already know what to do. :)

> It's worth noting that you could `npm install -g`.  However, with the availability of the `npx` command, it makes more sense to me to install *Runaway!* as a dev dependency rather than a global.  To each their own.



When *Runaway!* finishes installing, you can get started quickly with:

```
npx runaway --init
```

This will create the `.runaway/` and `.runaway/.bin`directory and initialize a sample command file and .bin script.  Depending on your learning style, you can jump in and take a look at those files or you can continue reading the docs.

Also, you can go take a look in the `example/` directory for a slightly more involved example than what `--init` sets you up with.


# Documentation

- [Available Commands/Options](#available-commandsoptions)
- [The `.runaway/` directory](#runaway-directory)
- [The `.runaway/.bin` directory](#runaway-bin-directory)



## Available Commands/Options

`—init`

Initializes the basic directory structure and files for using *Runaway!*



`—rebuild`

Rebuilds the `script: {}` section of your `package.json` with what's discovered in the `.runaway/` directory.



`—help`

Does what you'd expect.



## `.runaway/` directory

*Runaway!* asks that you organize your command files in a `.runaway/` folder in the root of your project.

```
<your-project-directory>/
    src/
    package.json
    
    .runaway/  <-- This one right here.  
```

Command files are simple.  At their minimum, they're expected to expose an object with a `command` property.

Presuming you want to make a command called `npm run build` (`or yarn build`) you'd create a `build.js` file inside `.runaway/`  

```  
<your-project-directory>/
    ...

    .runaway/
        **build.js**
```

In that `build.js` file, you want to export an object that has a string `command` property:  

> **.runaway/build.js**
> ```javascript  
> module.exports = {
>     command: "babel src/main.js"  
> };  
> ```

That's it.  Now we have to rebuild the `package.json`

## Rebuilding `package.json`  

Unfortunately `package.json` is a JSON file and we can't actually crawl the `.runaway/` directory automatically.  If it were `package.js` we certainly could and that'd be great, but... Carry on.  

Instead, *Runaway!* provides a command for rebuilding the `package.json` based off what it finds in `.runaway/`.  That command is as follows:  

```
npx runaway --rebuild
```

Now if you open up your `package.json` you should see the `scripts: {}` section reflect what's in `.runaway/`.  

> Note that the name of the command that ends up in `package.json` matches the name of the file.  You're able to specify a specific name for the command with the `name` property.  



## `.runaway/.bin` Directory

Often you need to write small scripts that do fairly custom things in your build process.  There's no reason you couldn't just write a runaway command like:  

> **.runaway/build.js**
> ```javascript  
> module.exports = {
>     command: "node build-utils/my-custom-script.js"  
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
>     command: "runaway!my-custom-script.js"  
> }  
> ```

When you run `npx runaway --rebuild`, `runaway` will replace "runaway!" with `node .runaway/.bin/`  

Is this necessary?  Absolutely not.  But it's nice to be able to easily spot "runaway!" and understand that there's some fancier-than-usual stuff going on with whatever your build script is.
