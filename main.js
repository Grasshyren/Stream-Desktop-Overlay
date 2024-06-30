const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const isDev = false;
const isMac = process.platform === 'darwin';

var firstClose = true;
var firstSave = true;

var settingsWindow;
var listOfOpenWindows = [];

if (!fs.existsSync(path.join(__dirname, 'data.json'))){
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify({"data":[]}));
}

const data = fs.readFileSync(path.join(__dirname, 'data.json'));
const jsonData = JSON.parse(data);


function addToJson(){
    jsonData.data.push({
        enabled: true,
        name: "",
        url: "",
        opacity: 1,
        maximized: true,
        x: 0,
        y: 0,
        width: 500,
        height: 500,
    });
}

function removeFromJson(inputIndex){
    jsonData.data.splice(inputIndex, 1);
}

function writeJsonToComputer(data){
    console.log('saving JSON');
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data));
}

function onLoadCreateUIFromJson(){
    if(jsonData.data.length === 0){
        settingsWindow.webContents.executeJavaScript(`addARow()`);
    }
    for (const key in jsonData.data) {
        settingsWindow.webContents.executeJavaScript(`addARow(${JSON.stringify(jsonData.data[key])})`);
    }
}




// Menu Template
const menu = [

    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                click: () => settingsWindow.close(),
                accelerator: 'CmdOrCtrl+W' //Shortcut to quit app
            }
        ]
    }
]

function closeOpenOverlayWindows(){
    var windows = BrowserWindow.getAllWindows();
    for(var i = 0; i < windows.length; i++){
        if(windows[i].title !== 'Stream Desktop Overlay'){
            windows[i].close();
        }
    }
    if(listOfOpenWindows.length !== 0){
        listOfOpenWindows.splice(0, listOfOpenWindows.length);
    }
}

function createOverlayWindow(sentvariables) {

    sentvariables = sentvariables.data;
    if(!sentvariables.enabled){
        return;
    }

    if (typeof sentvariables.frame !== 'undefined') {
        
    } else{
        sentvariables.frame = false;
    }
    
    const createOverlayWindow = new BrowserWindow({
        title: sentvariables.name,
        width: sentvariables.width,
        height: sentvariables.height,
        show: false,
        frame: sentvariables.frame,
        //Important dev note about transparent setting, see Limitations: https://www.electronjs.org/docs/latest/tutorial/window-customization#create-transparent-windows
        transparent: !sentvariables.frame,
        x: sentvariables.x,
        y: sentvariables.y,
    });
    if(sentvariables.maximized){
        createOverlayWindow.maximize();
    }
    createOverlayWindow.setIgnoreMouseEvents(!sentvariables.frame) // Allow clicking through the app
    createOverlayWindow.setMinimizable(sentvariables.frame); // Can't be minimized, in case you do a windows drag to minimize all windows it will stay on top

    // Attempt to keep window on top, even on fullscreen apps (May only work on Mac)
    // Allows MacOS to display on top of full screen mode
    if(isMac && sentvariables.frame === false) {
        app.dock.hide();
    }
    createOverlayWindow.setVisibleOnAllWorkspaces(!sentvariables.frame, { visibleOnFullScreen: !sentvariables.frame }); // may need to add:, { visibleOnFullScreen: true }
    createOverlayWindow.setAlwaysOnTop(!sentvariables.frame, 'screen-saver', 1); // may need to add:, 1
    createOverlayWindow.setResizable(true);
    createOverlayWindow.resizable = sentvariables.frame;
    createOverlayWindow.setFullScreenable(sentvariables.frame);
    
    createOverlayWindow.setOpacity(sentvariables.opacity);
    
    createOverlayWindow.loadURL(sentvariables.url);
    
    createOverlayWindow.show();
    listOfOpenWindows.push(createOverlayWindow);
}

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        title: 'Stream Desktop Overlay',
        width: isDev ? 1800 : 1300,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
          },
    });

    // Show devtools automatically if in development
    if (isDev) {
        settingsWindow.webContents.openDevTools();
    }

    settingsWindow.loadFile(path.join(__dirname, './renderer/index.html'));

    onLoadCreateUIFromJson();

    settingsWindow.on('close', function(){
        if (firstSave === true){
            firstSave = false;
            quit();
        }
    });
}

function getAllOpenWindowProperties(){
    var windowPropertiesInJson = [];
    for(i = listOfOpenWindows.length - 1; i >= 0; i--){
        const x = listOfOpenWindows[i].getPosition()[0]
        const y = listOfOpenWindows[i].getPosition()[1]
        const width = listOfOpenWindows[i].getSize()[0]
        const height = listOfOpenWindows[i].getSize()[1]
        windowPropertiesInJson.push({
            x: x,
            y: y,
            width: width,
            height: height,
        });
    }
    settingsWindow.webContents.executeJavaScript(`inputOpenWindowPositions(${JSON.stringify(windowPropertiesInJson)})`);
}

function getWindowIDsAndSendToRenderer(){
    var idsToSendToRenderer = [];
    for(i = listOfOpenWindows.length - 1; i >= 0; i-- ){
        var windowID = listOfOpenWindows[i].id;
        idsToSendToRenderer.push({
            id: windowID,
        })
    }
    settingsWindow.webContents.executeJavaScript(`assignToggleButtonValues(${JSON.stringify(idsToSendToRenderer)})`);
}

function quit() {
    if (firstClose === true){
        firstClose = false;
        if (!isMac){
            app.quit();
        }
    }
}

function windowInteractionDisable(windowID){

    for(i = 0; i < listOfOpenWindows.length; i++){
        if(listOfOpenWindows[i].id === windowID){
            listOfOpenWindows[i].setIgnoreMouseEvents(true);
            listOfOpenWindows[i].setAlwaysOnTop(true, 'screen-saver', 1);
        }
    }
}

function windowInteractionEnable(windowID){
    for(i = 0; i < listOfOpenWindows.length; i++){
        if(listOfOpenWindows[i].id === windowID){
            listOfOpenWindows[i].setIgnoreMouseEvents(false);
            listOfOpenWindows[i].setAlwaysOnTop(false, 'screen-saver', 1)
        }
    }
}

app.whenReady().then(() => {
    createSettingsWindow();
    
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createSettingsWindow();
        }
    })
})


// Respond to the events from renderer.js
ipcMain.on('create:window', (e, sentvariables) => {
    createOverlayWindow(sentvariables);
});
ipcMain.on('delete:windows', (e, options) => {
    closeOpenOverlayWindows();
});
ipcMain.on('get:windowIDs', (e, options) => {
    getWindowIDsAndSendToRenderer();
});
ipcMain.on('save:json', (e, sentJSON) => {
    writeJsonToComputer(sentJSON);
});
ipcMain.on('enable:interactable', (e, windowID) => {
    windowInteractionEnable(+windowID.windowID);
});
ipcMain.on('disable:interactable', (e, windowID) => {
    windowInteractionDisable(+windowID.windowID);
});
ipcMain.on('save:positions', (e, options) => {
    getAllOpenWindowProperties();
});