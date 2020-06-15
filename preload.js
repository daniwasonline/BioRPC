/*
 * Filename: preload.js
 * Author: SaturdayNightDead (BeanedTaco)
 * Created: 13 June 2020
 * Some code is used from my earlier Vision project
*/
const { contextBridge, ipcRenderer, app } = require('electron');
contextBridge.exposeInMainWorld(
    "api", {
        ipc: {
            handoff: (channel, data) => {
                let validHandoffs = ["largeImage", "smallImage", "details", "bioUser", "close"]
                if (validHandoffs.includes(channel)) {
                    ipcRenderer.send(channel, data)
                }
            },
            handback: (channel, func) => {
                let validHandbacks = ["largeImage", "smallImage", "details", "bioUser"];
                if (validHandbacks.includes(channel)) {
                        ipcRenderer.on(channel, (event, ...args) => func(...args));
                    }
            }   
        },

        core: {
              
        },

   /* newerClass: {
    }
    */
    }
);