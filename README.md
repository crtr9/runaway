# :ghost: *Runaway!* - NPM Scripts Manager

Foregoing the use of a full-featured task-runner for developing JS applications in favor of simple npm scripts is becoming more and more common.  For good reason: *it's simple.*  

**The Problem:** Any reasonably sized project ends up needing a lot of script commands to lint, build, transpile, optimize, etc., etc.  Having an undocumented list of commands in your `package.json` quickly becomes cumbersome.  

**A Solution:** *Runaway!* is a very simple way to manage the list of scripts in your `package.json`.  It's not complex.  It's not something you couldn't build yourself in an hour or two.  But hey, it's here.  And I'm writing the documentation so you don't have to keep explaining it to your team.

By organizing your script com/mands in individual `.js` files, you're able to provide code-level documentation on what's happening and why.  All *Runaway!* does is rewrite the `scripts: {}` section of your `package.json` based on the "command files" it finds.



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
npm install --save-dev @crtr9/runaway  
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
- [Rebuilding `package.json`](#rebuilding-packagejson)
  - [Command Names](#a-note-on-command-names)
- [The `.runaway/.bin` directory](#runawaybin-directory)



## Available Commands/Options

`--init`

Initializes the basic directory structure and files for using *Runaway!*



`--rebuild`

Rebuilds the `script: {}` section of your `package.json` with what's discovered in the `.runaway/` directory.



`--help`

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
        build.js
```

`build.js` needs to export an object that has a string `command` property representing what gets put into your `package.json`

> **.runaway/build.js**
> ```javascript  
> module.exports = {
>     command: "tsc src/main.js"  
> };  
> ```

## Rebuilding `package.json`  

Unfortunately `package.json` is a JSON file and we can't crawl the `.runaway/` directory automatically.  If it were `package.js` we certainly could, and that'd be great because doing so would eliminate the `--rebuild` command, but as I'm sure you know by now, the world is against you -- it's a scary place.  That why you have to... (yes, I'm doing it) *Runaway!* :grimacing: :woman_facepalming:

Since that happened... *Runaway!* provides a command for rebuilding the `package.json` based off what it finds in `.runaway/`.  That command is as follows:  

```
npx runaway --rebuild
```

> The need to run `--rebuild` means that whenever you change or add command files, you'll have to rerun `--rebuild`.  Again, yes, it's less than ideal.  Maybe it's possible to hook into `npm run` and run rebuild automatically?  If y'all know anything about this, make a PR or log an issue, that way we can remove this entire documentation section which also means the joke will disappear as well.

After running `--rebuild` if you open up your `package.json` you should see the `scripts: {}` section reflect what's in `.runaway/`.  

### A note on command names

The name of the command that ends up in `package.json` matches the name of the file that supplied it.  `build.js` turns into `npm run build`.  If you're not a fan of this, you're able to specify a specific name for the command with the `name` property.

> **.runaway/build.js**
> ```javascript  
> module.exports = {
>     command: "tsc src/main.js",
>     name: "build/typescript"
> };  
> ```

## `.runaway/.bin` Directory

Often you need to write small scripts that do fairly specific things for your build process.  There's no reason you couldn't just write a command like:  

> **.runaway/do-something.js**
> ```javascript  
> module.exports = {
>     command: "node build-utils/my-custom-script.js"  
> }  
> ```

But you've already organized your "build stuff" in `.runaway/` so why not those custom scripts too?  

*Runaway!* supports calling custom scripts in the `.runaway/.bin/` directory with a nice little shorthand syntax.

Make a new directory `.bin/` inside the `.runaway/` directory, and move your `my-custom-script.js` into it.
> ```
> <your-project-directory>/
>     .runaway/ .bin/my-custom-script.js
> ```

Now you can change your script command:  
> **.runaway/build.js**
> ```javascript
> module.exports = {
>     command: "runaway!my-custom-script.js"  
> }  
> ```

When you `--rebuild`, *Runaway!* will replace "runaway!" with `node .runaway/.bin/`  

Is this necessary?  Absolutely not.  But it's nice.
