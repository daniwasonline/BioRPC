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
const RPC = require("discord-rpc")
const { promisify } = require('util')
const sleep = promisify(setTimeout)
const procExists = require("process-exists")
const dialogs = require("dialog")
const dialog = require("dialog")

const client = new RPC.Client({ transport: 'ipc' });
const fs = require("fs")
const bio = new (require('discord.bio').Bio)
const yml = require('js-yaml')
const AutoLaunch = require("auto-launch")
const clientId = "623327828875935744"
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

async function reInit() {
  const { spawn } = require("child_process")
  delete process.env.process_restarting;
  spawn(process.argv[0], process.argv.slice(1), {
    detached: true,
    env: { process_restarting: 1 },
    stdio: 'ignore'
  }).unref();
}



async function initReInit() {
  app.quit()
}

async function initTheReInit() {
  try {
    await client.destroy()
  } catch (e) {
    console.log("Error! Client can't be destroyed.")
    reInit()
    sleep(500)
    return initReInit()
  }
  reInit()
  sleep(500)
  initReInit()
}

//require('v8-compile-cache');

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
  fs.writeFile(app.getPath("home") + '\\.biorpc\\biorpc.yml', 'details: Online # The top field, below the "dsc.bio status" thing\nbioUser: autoDetect # Example: By default, this is autoDetect. If BioRPC sees "autoDetect" or "BIO CUSTOM USERNAME HERE" as the value for this key, then it will automatically grab the user URL for the Discord account that has the status. If you need to add a custom dsc.bio user name, change the value from this to the correct user name. If you want to override the entire value of the state field [bioUser field], add csUrl://, followed by the custom value that you want it to be. \nlargeImage: discord # This is the large big image in the Rich Presence.\nsmallImage: discord # This is the small little image in the Rich Presence', function (e) {
    if (e) console.log("ERR: " + e)
    onboarding()
  })
  return;
}

var settings = await yml.safeLoad(fs.readFileSync(app.getPath("home") + "\\.biorpc\\" + "biorpc.yml"))

if (settings.bioUser.includes("BIO CUSTOM USERNAME HERE")) {
  fs.writeFile(app.getPath("home") + '\\.biorpc\\biorpc.yml', 'details: Online # The top field, below the "dsc.bio status" thing\nbioUser: autoDetect # Example: By default, this is autoDetect. If BioRPC sees "autoDetect" as the value for this key, then it will automatically grab the user URL for the Discord account that has the status. If you need to add a custom dsc.bio user name, change the value from this to the correct user name. If you want to override the entire value of the state field [bioUser field], add csUrl://, followed by the custom value that you want it to be. \nlargeImage: discord # This is the large big image in the Rich Presence.\nsmallImage: discord # This is the small little image in the Rich Presence', function (e) {
    initTheReInit()
  })
}

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
  if (settings.bioUser == "BIO CUSTOM USERNAME HERE") {
    console.log("User ID: " + client.user.id)
    var detailsKey = await (await bio.users.details(client.user.id)).user.details.slug
    console.log("Default User: " + detailsKey)
    return `Bio: dsc.bio/${detailsKey}`
  }
  if (settings.bioUser == "autoDetect") {
    console.log("User ID: " + client.user.id)
    var detailsKey = await (await bio.users.details(client.user.id)).user.details.slug
    console.log("Default User: " + detailsKey)
    return `Bio: dsc.bio/${detailsKey}`
  }
  if (settings.bioUser.startsWith("csurl://")) return settings.bioUser.replace("csurl://", "")
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
      await client.destroy()
      initTheReInit()

    }
    if (launchConf.enabled == true) {
      fs.writeFile(app.getPath("home") + '\\.biorpc\\autolaunch.yml', 'enabled: false', function (e) {
      })
      await client.destroy()
      initTheReInit()
    }
  }
}

async function checkForDetails() {
  if (settings.details) return settings.details
}

async function init() {
  try {
    const rich = await client.setActivity({
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

async function checkApp() {
  if (await procExists("Discord.exe")) return "BioRPC Control Centre"
  if (!await procExists("Discord.exe")) return "[DISCONNECTED] BioRPC"
  if (await procExists("DiscordCanary.exe")) return "BioRPC Control Centre"
  if (!await procExists("DiscordCanary.exe")) return "[DISCONNECTED] BioRPC"
  if (await procExists("DiscordPTB.exe")) return "BioRPC Control Centre"
  if (!await procExists("DiscordPTB.exe")) return "[DISCONNECTED] BioRPC"
}

app.on('ready', async () => {
  if (!os.platform == "win32") return dialogs.err("Oops! You're not using Windows. This program is designed for the Windows platform, and WILL NOT work on Linux or MacOS. Press OK to exit.", "BioRPC", function (exitCode) {
    if (exitCode == 0) return app.quit()
  })

  async function tray() {
    var contextMenu = Menu.buildFromTemplate([
      {
        label: await checkApp(), enabled: false
      },
      {
        label: "Separator", type: "separator"
      },
      {
        label: 'Reconnect Status', click: function () {
          sleep(500).then(e => {
            client.clearActivity()
          })
          sleep(1500).then(e => {
            initTheReInit()
          })
        }
      },
      {
        label: 'Onboarding', click: function () {
          onboarding()
        }
      },
      {
        label: 'Edit Config', click: function () {
          app.isQuiting = false;
          shell.openExternal(app.getPath("home") + "\\.biorpc\\biorpc.yml")

        }
      },
      {
        label: "Separator", type: "separator"
      },
      {
        label: "Documentation", click: function () {
          shell.openExternal("https://github.com/BeanedTaco/BioRPC/wiki")

        }
      },
      {
        label: await StartFunctions("name"), click: function () {
          StartFunctions("toggle")

        }
      },
      {
        label: 'Quit', click: function () {
          app.isQuiting = true;
          app.quit();
          process.exit()
        }
      },
    ]);
    appIcon = null
    appIcon = new Tray(iconpath)
    appIcon.setContextMenu(contextMenu)
    appIcon.setToolTip("BioRPC")
    appIcon.setTitle("BioRPC Control Panel")
  }

  tray()
  /*
          setInterval(async function () {
              console.log("running check")
              if (appIcon == null) {
                  console.log("null")
                  return initTheReInit()
              }
              else if (appIcon.isDestroyed()) {
                  console.log("destroyed")
                  sleep(10000).then(e => {
                      tray()
                  })
              } else {
                  console.log("nothing")
                  return;
              }
          }, 10800000)
  */
  const ready = async function () {

    init();

  }
  //await yml.safeLoad(
  try {
    client.on("ready", ready)
  } catch (e) {
    sleep(15000).then(e => {
      initTheReInit()
    })
  }

  if (!await procExists("Discord.exe")) {
    if (!await procExists("DiscordCanary.exe")) {
      if (!await procExists("DiscordPTB.exe")) {
        console.log("Oop! Discord's not open. Retrying in 15 seconds..")
        return sleep(1000)
          .then(_ => console.log("15"))
          .then(_ => sleep(1000))
          .then(_ => console.log("14"))
          .then(_ => sleep(1000))
          .then(_ => console.log("13"))
          .then(_ => sleep(1000))
          .then(_ => console.log("12"))
          .then(_ => sleep(1000))
          .then(_ => console.log("11"))
          .then(_ => sleep(1000))
          .then(_ => console.log("10"))
          .then(_ => sleep(1000))
          .then(_ => console.log("9"))
          .then(_ => sleep(1000))
          .then(_ => console.log("8"))
          .then(_ => sleep(1000))
          .then(_ => console.log("7"))
          .then(_ => sleep(1000))
          .then(_ => console.log("5"))
          .then(_ => sleep(1000))
          .then(_ => console.log("4"))
          .then(_ => sleep(1000))
          .then(_ => console.log("3"))
          .then(_ => sleep(1000))
          .then(_ => console.log("2"))
          .then(_ => sleep(1000))
          .then(_ => console.log("1"))
          .then(_ => sleep(1000))
          .then(_ => console.log("0"))
          .then(_ => initTheReInit())
          .catch(console.error)
      }
    }
  }


});
client.login({ clientId }).catch(console.error);

setInterval(async function () {
  if (await procExists("Discord.exe")) return;
  if (!await procExists("Discord.exe")) return initTheReInit()
  else if (!await procExists("DiscordPTB.exe")) return initTheReInit()
  else if (!await procExists("DiscordCanary.exe")) return initTheReInit()
  else {
    console.log("Still alive?")
  }
}, 60000)

app.on('close', async () => {
  client.destroy()
  appIcon.destroy()
  app.quit()
  process.exit()
})