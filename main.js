/*
 * Filename: main.js
 * Author: SaturdayNightDead (BeanedTaco)
 * Created: 11 June 2020
 * Description: Based on Vision's main.js. This is basically the only file that BioRPC uses right now, so..
 * Originally from electron/electron-quick-start
*/

// Load Electron modules
const { app, BrowserWindow, BrowserView, globalShortcut, Menu, screen, MenuItem, ipcMain, Tray, shell } = require('electron')
const os = require('os')
const dialogs = require("dialog")
const dialog = require("dialog")
const fs = require("fs")
const yml = require('js-yaml')
const AutoLaunch = require("auto-launch")
var rpc = require("discord-rich-presence")("623327828875935744")
const { promisify } = require('util')
const sleep = promisify(setTimeout)
const sudoer = require('is-elevated')
let appIcon = null
console.log("Start File: " + require.main.filename)
console.log("Home Directory: " + app.getPath("home"))

//const {autoUpdater} = require("electron-updater");
const Startup = new AutoLaunch({
    name: "BioRPC"
})

const path = require('path')
const url = require('url')
var iconpath = path.join(__dirname, 'icon.ico') // path of y

function reInit() {
    const { spawn } = require("child_process")
    delete process.env.process_restarting;
    spawn(process.argv[0], process.argv.slice(1), {
        detached: true,
        env: { process_restarting: 1 },
        stdio: 'ignore'
    }).unref();
}


function initReInit() {
    app.quit()
}

function initTheReInit() {
    reInit()
    sleep(500)
    initReInit()
}

//require('v8-compile-cache');
if (!os.platform == "win32") return dialogs.err("Oops! You're not using Windows. This program is designed for the Windows platform, and WILL NOT work on Linux or MacOS. Press OK to exit.", "BioRPC", function (exitCode) {
    if (exitCode == 0) return app.quit()
})

async function onboarding() {
    dialogs.info("Thanks for using BioRPC! We assume you've already created a dsc.bio, but if you haven't, head over to dsc.bio and create a bio before coming back here.\n\n To start the guide, press OK to continue.", "BioRPC Onboarding", function (exitCode) {
        if (exitCode == 0) {
            dialogs.info("Currently, the status that you would have would be plain. Let's fix that. Press OK and it'll take you to your default text editor.", "BioRPC Onboarding", function (exitCode) {
                if (exitCode == 0) {
                    async function execShell() {
                        await sleep(1000)
                        await shell.openExternal(app.getPath("home") + "\\.biorpc\\biorpc.yml")
                    }
                    execShell()
                    dialogs.info("Now, customize this file to your liking. Once you're done, click File, then click Save [or press Ctrl+S]. Press OK once you've done that.", "BioRPC Onboarding", function (exitCode) {
                        if (exitCode == 0) {
                            dialogs.info("Alright, before we let you start using BioRPC, here are some tips.\n\n\nIf at any time you want to stop having BioRPC as your status, you can always go to the system tray [the little up arrow on the right side of your taskbar, right click the Discord logo with the yellow-coloured background, and click Quit. You can always get your status back by reopening BioRPC [it's in the start menu too, so that makes things easier].\n\nIf your status somehow disappeared, you can always relaunch the program by opening the system tray, right clicking the yellow-background Discord logo, and hitting Reconnect Status.\n\nIf you want to change your status details? Right click the BioRPC yellow-Discord icon in the system tray and click the Edit Config button.\n\nIf you want to have BioRPC launch on startup, you can enable that in the system tray control centre.\n\nAnd finally, if you ever stumble across a bug, report an issue by going to GitHub.com/BeanedTaco/BioRPC/issues and clicking `New issue`.", "BioRPC Onboarding", function (exitCode) {
                                if (exitCode == 0) {
                                    dialogs.info("If you ever need to come back here, just click the Onboarding button in BioRPC's right-click panel in the system tray!\n\nReady to start using BioRPC? Press OK when you're ready!", "BioRPC Onboarding", function (exitCode) {
                                        if (exitCode == 0) {
                                            initTheReInit()
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}


app.on('ready', async () => {
    let appIcon = new Tray(iconpath)
    if (!fs.existsSync(app.getPath("home") + "\\.biorpc\\autolaunch.yml")) {
        if (!fs.existsSync(app.getPath("home") + "\\.biorpc\\")) fs.mkdirSync(app.getPath("home") + "\\.biorpc\\")
        fs.writeFile(app.getPath("home") + '\\.biorpc\\autolaunch.yml', 'enabled: false', function (e) {
        })
    }

    if (fs.existsSync(app.getPath("home") + "\\.biorpc\\autolaunch.yml")) {
        const autolaunch_config = await yml.safeLoad(fs.readFileSync(app.getPath("home") + "\\.biorpc\\" + "autolaunch.yml"))
        if (autolaunch_config.enabled == false) {
            Startup.isEnabled().then(function (isEnabled) {
                console.log("Startup: Disabled")
                if (isEnabled) {
                    Startup.disable()
                } if (!isEnabled) return;
            })
        } if (autolaunch_config.enabled == true) {
            Startup.isEnabled().then(function (isEnabled) {
                console.log("Startup: Enabled")
                if (isEnabled) {
                    return;
                } if (!isEnabled) Startup.enable()
            })
        }
    }
    



    if (sudoer() == true) return dialogs.err("BioRPC can't run with sudoer [administrator/elevated] privileges. Try again without using administrator privileges.", "BioRPC", function (exitCode) {
        if (exitCode == 0) return app.quit()
    })



    if (!fs.existsSync(app.getPath("home") + "\\.biorpc\\biorpc.yml")) {
        console.log("uhh")
        if (!fs.existsSync(app.getPath("home") + "\\.biorpc\\")) fs.mkdirSync(app.getPath("home") + "\\.biorpc\\")
        sleep(5)
        fs.writeFile(app.getPath("home") + '\\.biorpc\\biorpc.yml', 'details: Online\nbioUser: BIO CUSTOM USERNAME HERE # Example: Adding dannykun here would make the status "Bio: dsc.bio/dannykun".\nlargeImage: sad_box\nsmallImage: jords_eye', function (e) {
            if (e) console.log("ERR: " + e)
            onboarding()
        })
        
        
        
        
        return;
        
    } else if (fs.existsSync(app.getPath("home") + "\\.biorpc\\biorpc.yml")) {
        const settings = await yml.safeLoad(fs.readFileSync(app.getPath("home") + "\\.biorpc\\" + "biorpc.yml"))

        async function checkForLarge() {
            var myArgs = process.argv.slice(3)
            if (settings.largeImage) return settings.largeImage
        }
        async function checkForSmall() {
            var myArgs = process.argv.slice(4)
            if (settings.smallImage) return settings.smallImage
        }
        
        async function checkForBio() {
            var myArgs = process.argv.slice(5)
            if (settings.bioUser == "BIO CUSTOM USERNAME HERE") return `No dsc.bio user entered`
            if (settings.bioUser) return `Bio: dsc.bio/${settings.bioUser}`
        }
        
        async function largeProcess() {
            if (settings.largeImage == "demon-tomioka") return "T o m i o k a"
            if (settings.largeImage == "discord") return "Ey, Discord's logo! Hi, Wumpus!"
            if (settings.largeImage == "jords_eye") return "Jord is always watching."
            if (settings.largeImage == "osamu_dazai_flat") return "OSAMUUUUUU"
            if (settings.largeImage == "sad_box") return "this is sad amazon box rip"
            if (settings.largeImage == "skep") return "skeppu is a bald jif peanut butter"
            if (settings.largeImage == "dazai-kun") return "AHHHHHHHH MORE OSAMUUUU"
            if (settings.largeImage == "chibi-akutagawa") return "Oh, a cute anime character!"
            if (settings.largeImage == "kermit") return "muppets"
            if (settings.largeImage == "pedrald") return "Piraffe lmao"
            if (settings.largeImage == "carpet") return "dog on carpet. aww!!!!"
        }
        async function smallProcess() {
            if (settings.smallImage == "demon-tomioka") return "T o m i o k a"
            if (settings.smallImage == "discord") return "Ey, Discord's logo! Hi, Wumpus!"
            if (settings.smallImage == "jords_eye") return "Jord is always watching."
            if (settings.smallImage == "osamu_dazai_flat") return "OSAMUUUUUU"
            if (settings.smallImage == "sad_box") return "this is sad amazon box rip"
            if (settings.smallImage == "skep") return "skeppu is a bald jif peanut butter"
            if (settings.smallImage == "dazai-kun") return "AHHHHHHHH MORE OSAMUUUU"
            if (settings.smallImage == "chibi-akutagawa") return "Oh, a cute anime character!"
            if (settings.smallImage == "kermit") return "muppets"
            if (settings.smallImage == "pedrald") return "Piraffe lmao"
            if (settings.smallImage == "carpet") return "dog on carpet. aww!!!!"
        }
        

        async function StartFunctions(opt) {
            const launchConf = await yml.safeLoad(fs.readFileSync(app.getPath("home") + "\\.biorpc\\" + "autolaunch.yml"))
            if (opt == "name") {
                if (launchConf.enabled == false) return "Enable Launch on Startup"
                if (launchConf.enabled == true) return "Disable Launch on Startup"
            } else if (opt == "toggle") {
                if (launchConf.enabled == false) {
                    fs.writeFile(app.getPath("home") + '\\.biorpc\\autolaunch.yml', 'enabled: true', function (e) {
                    })
                    initTheReInit()

                }
                if (launchConf.enabled == true) {
                    fs.writeFile(app.getPath("home") + '\\.biorpc\\autolaunch.yml', 'enabled: false', function (e) {
                    })
                    initTheReInit()
                }
            }
        }
        
        async function checkForDetails() {
            if (settings.details) return settings.details
        }
        
        async function init() {
            try {
                const rich = await rpc.updatePresence({
                    state: await checkForBio(),
                    details: `${await checkForDetails()}`,
                    startTimestamp: Date.now(),
                    largeImageKey: `${await checkForLarge()}`,
                    smallImageKey: `${await checkForSmall()}`,
                    largeImageText: `${await largeProcess()}`,
                    smallImageText: `${await smallProcess()}`,
                    instance: true,
                })
                console.log("Logged into RPC successfully!")
            } catch (e) {
                console.log("Failed to apply RPC!")
                console.log(`Error: ${e}`)
            }
        }


        var contextMenu = Menu.buildFromTemplate([
            {
            label: "BioRPC Control Centre", enabled: false
            },
            {
            label: "Separator", type: "separator"
            },
            {
            label: 'Reconnect Status', click: function () {
                    app.isQuiting = false;
                    initTheReInit()

            }},
            { label: 'Onboarding', click: function () {
                onboarding()

            }},
            { label: 'Edit Config', click: function () {
                app.isQuiting = false;
                shell.openExternal(app.getPath("home") + "\\.biorpc\\biorpc.yml")

            }},
            {
            label: "Separator", type: "separator"
            },
            {
                label: await StartFunctions("name"), click: function () {
                    StartFunctions("toggle")

            }},
            { label: 'Quit', click:  function(){
                app.isQuiting = true;
                app.quit();
                process.exit()
            }},
        ]);
        appIcon.setContextMenu(contextMenu)
        appIcon.setToolTip("BioRPC")
        init()
        appIcon.setTitle("BioRPC Control Panel")
    }



//await yml.safeLoad(

    
});


app.on('close', async () => {
    appIcon.destroy()
    app.quit()
    process.exit()
})