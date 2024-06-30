const form = document.querySelector('#submit-form');
const submitButton = document.querySelector('#submitBtn');
const table1 = document.querySelector('#table1');
const frameToggleButton = document.querySelector('#frameToggleBtn');

function addARow(jsonData = {
        enabled: true,
        name: "",
        url: "",
        opacity: 1,
        maximized: true,
        x: 0,
        y: 0,
        width: 500,
        height: 500,
    }){

    const tr = document.createElement('tr');
    tr.setAttribute("id" , "dynamicTR");
    table1.append(tr);
    
    var td1 = document.createElement('td');
    td1.setAttribute("align", "center");
    const enabled = document.createElement('input');
    enabled.setAttribute("type" , "checkbox");
    enabled.setAttribute("id" , "enabled");
    enabled.checked = jsonData.enabled;
    tr.append(td1);
    td1.append(enabled);

    var td2 = document.createElement('td');
    td2.setAttribute("align", "center");
    const name = document.createElement('input');
    name.setAttribute("size", "12");
    name.setAttribute("type" , "text");
    name.setAttribute("id" , "name");
    name.value = jsonData.name;
    tr.append(td2);
    td2.append(name);

    var td3 = document.createElement('td');
    td3.setAttribute("align", "center");
    const url = document.createElement('input');
    url.setAttribute("size", "12");
    url.setAttribute("type" , "password");
    url.setAttribute("id" , "url");
    url.value = jsonData.url;
    tr.append(td3);
    td3.append(url);

    var td4 = document.createElement('td');
    td4.setAttribute("align", "center");
    const opacity = document.createElement('input');
    opacity.style.width = "3.5em";
    opacity.setAttribute("type" , "number");
    opacity.setAttribute("min" , "0");
    opacity.setAttribute("max" , "1");
    opacity.setAttribute("step" , "0.01");
    opacity.setAttribute("id" , "opacity");
    opacity.value = jsonData.opacity;
    tr.append(td4);
    td4.append(opacity);

    var td5 = document.createElement('td');
    td5.setAttribute("align", "center");
    const maximized = document.createElement('input');
    maximized.setAttribute("type" , "checkbox");
    maximized.setAttribute("id" , "maximized");
    maximized.checked = jsonData.maximized;
    tr.append(td5);
    td5.append(maximized);

    var td6 = document.createElement('td');
    td6.setAttribute("align", "center");
    const x = document.createElement('input');
    x.style.width = "5em";
    x.setAttribute("type" , "number");
    x.setAttribute("min" , "0");
    x.setAttribute("step" , "1");
    x.setAttribute("id" , "x");
    x.value = jsonData.x;
    tr.append(td6);
    td6.append(x);

    var td7 = document.createElement('td');
    td7.setAttribute("align", "center");
    const y = document.createElement('input');
    y.style.width = "5em";
    y.setAttribute("type" , "number");
    y.setAttribute("min" , "0");
    y.setAttribute("step" , "1");
    y.setAttribute("id" , "y");
    y.value = jsonData.y;
    tr.append(td7);
    td7.append(y);

    var td8 = document.createElement('td');
    td8.setAttribute("align", "center");
    const width = document.createElement('input');
    width.style.width = "5em";
    width.setAttribute("type" , "number");
    width.setAttribute("min" , "1");
    width.setAttribute("step" , "1");
    width.setAttribute("id" , "width");
    width.value = jsonData.width;
    tr.append(td8);
    td8.append(width);

    var td9 = document.createElement('td');
    td9.setAttribute("align", "center");
    const height = document.createElement('input');
    height.style.width = "5em";
    height.setAttribute("type" , "number");
    height.setAttribute("min" , "1");
    height.setAttribute("step" , "1");
    height.setAttribute("id" , "height");
    height.value = jsonData.height;
    tr.append(td9);
    td9.append(height);

    var td10 = document.createElement('td');
    td10.setAttribute("align", "center");
    const up = document.createElement('button');
    up.setAttribute("type", "button");
    up.setAttribute("id", "up");
    up.setAttribute("name", "up");
    up.innerText = "▲";
    up.onclick = function(){moveRowUp(up)};
    tr.append(td10);
    td10.append(up);

    var td11 = document.createElement('td');
    td11.setAttribute("align", "center");
    const down = document.createElement('button');
    down.setAttribute("type", "button");
    down.setAttribute("id", "down");
    down.setAttribute("name", "down");
    down.innerText = "▼";
    down.onclick = function(){moveRowDown(down)};
    tr.append(td11);
    td11.append(down);


    var td12 = document.createElement('td');
    td12.setAttribute("align", "center");
    td12.style.paddingLeft = "1em"
    const toggle = document.createElement('button');
    toggle.setAttribute("type", "button");
    toggle.setAttribute("id", "toggle");
    toggle.setAttribute("name", "toggle");
    toggle.innerText = "Make Interactable";
    toggle.onclick = function(){toggleInteractable(toggle)};
    toggle.disabled = true;
    tr.append(td12);
    td12.append(toggle);

    var td13 = document.createElement('td');
    td13.setAttribute("align", "center");
    td13.style.paddingLeft = "1em"
    const remove = document.createElement('button');
    remove.setAttribute("type", "button");
    remove.setAttribute("id", "remove");
    remove.setAttribute("name", "remove");
    remove.innerText = "Remove";
    remove.onclick = function(){removeARow(remove)};
    tr.append(td13);
    td13.append(remove);
}

function assignToggleButtonValues(windowIDs){
    var elementsURLs = document.querySelectorAll('[id=url]');
    var elementsEnabled = document.querySelectorAll('[id=enabled]');
    var elementsToggles = document.querySelectorAll('[id=toggle]');
    for(i = 0; i < windowIDs.length; i++){
        for(j = i; j < elementsEnabled.length; j++){
            if(elementsEnabled[j].checked && elementsURLs[j].value.trim() !== ""){
                elementsToggles[j].disabled = false;
                elementsToggles[j].value = windowIDs[i].id;
                break;
            } else{
                elementsToggles[j].disabled = true;
            }
        }
    }
}

function buildJsonFromFormForSaving(){
    https = 'https://';
    var jsonData = {"data":[]};
    var elementsTR = document.querySelectorAll('[id=dynamicTR]');

    for(var i = 0; i < elementsTR.length; i++) {
        var enabled = elementsTR[i].querySelector('#enabled');
        var name = elementsTR[i].querySelector('#name');
        var url = elementsTR[i].querySelector('#url');
        var opacity = elementsTR[i].querySelector('#opacity');
        var maximized = elementsTR[i].querySelector('#maximized');
        var x = elementsTR[i].querySelector('#x');
        var y = elementsTR[i].querySelector('#y');
        var width = elementsTR[i].querySelector('#width');
        var height = elementsTR[i].querySelector('#height');

        var parsedenabled  = enabled.checked;
        var parsedname  = name.value;
        var parsedurl  = url.value;
        var parsedopacity  = opacity.value;
        var parsedmaximized  = maximized.checked;
        var parsedx  = x.value;
        var parsedy  = y.value;
        var parsedwidth = width.value;
        var parsedheight = height.value;

        var parsedurl = url.value;
        parsedurl = parsedurl.trim();
        if (parsedurl !== ''){
            if(!parsedurl.startsWith('http')){
                parsedurl = https.concat(parsedurl);
            }
            data = {
                "enabled": parsedenabled,
                "name": parsedname,
                "url": parsedurl,
                "opacity": +parsedopacity,
                "maximized": parsedmaximized,
                "x": +parsedx,
                "y": +parsedy,
                "width": +parsedwidth,
                "height": +parsedheight,
            }
            jsonData.data.push(data);
        }
    }
    data = jsonData.data;
    ipcRenderer.send('save:json', {
        data
    });
}

function changeSubmitButtonText(){
    submitButton.innerText = 'Re-Launch Overlays';
    frameToggleButton.innerHTML = "Movable Windows";
    createAllOverlays();
}

function createAllOverlays(){
    ipcRenderer.send('delete:windows', {
    });

    https = 'https://';

    var elementsTR = document.querySelectorAll('[id=dynamicTR]');
    for(var i = elementsTR.length - 1; i >= 0; i--) {

        var jsonData = {"data":[]};

        var enabled = elementsTR[i].querySelector('#enabled');
        var name = elementsTR[i].querySelector('#name');
        var url = elementsTR[i].querySelector('#url');
        var opacity = elementsTR[i].querySelector('#opacity');
        var maximized = elementsTR[i].querySelector('#maximized');
        var x = elementsTR[i].querySelector('#x');
        var y = elementsTR[i].querySelector('#y');
        var width = elementsTR[i].querySelector('#width');
        var height = elementsTR[i].querySelector('#height');

        var parsedenabled  = enabled.checked;
        var parsedname  = name.value;
        var parsedurl  = url.value;
        var parsedopacity  = opacity.value;
        var parsedmaximized  = maximized.checked;
        var parsedx  = x.value;
        var parsedy  = y.value;
        var parsedwidth = width.value;
        var parsedheight = height.value;

        var parsedurl = url.value;
        parsedurl = parsedurl.trim();
        if (parsedurl !== ''){
            if(!parsedurl.startsWith('http')){
                parsedurl = https.concat(parsedurl);
            }
            data = {
                "enabled": parsedenabled,
                "name": parsedname,
                "url": parsedurl,
                "opacity": +parsedopacity,
                "maximized": parsedmaximized,
                "x": +parsedx,
                "y": +parsedy,
                "width": +parsedwidth,
                "height": +parsedheight,
            }
            ipcRenderer.send('create:window', {
                data
            });
        }
    }
    getWindowIDsForRenderer();
}

function getWindowIDsForRenderer(){
    //resets buttons to default state
    var elementsToggle = document.querySelectorAll('[id=toggle]');

    for(i = 0; i < elementsToggle.length; i++){
        elementsToggle[i].disabled = true;
        elementsToggle[i].innerText = "Make Interactable";
    }

    ipcRenderer.send('get:windowIDs', {
        
    });
}

function moveRowDown(triggeringButton){
    var elements = document.querySelectorAll('[id=down]');
    for(var i = 0; i < elements.length; i++){
        if(elements[i] === triggeringButton){
            if(i === elements.length - 1){
                break;
            }
            var elementsTR = document.querySelectorAll('[id=dynamicTR]');
            elementsTR[i + 1].insertAdjacentElement("afterend", elementsTR[i]);
            break;
        }
    }
}

function moveRowUp(triggeringButton){
    var elements = document.querySelectorAll('[id=up]');
    for(var i = 0; i < elements.length; i++){
        if(elements[i] === triggeringButton){
            if(i === 0){
                break;
            }
            var elementsTR = document.querySelectorAll('[id=dynamicTR]');
            elementsTR[i - 1].insertAdjacentElement("beforebegin", elementsTR[i]);
            break;
        }
    }
}

function removeARow(triggeringButton){
    var elementsRemove = document.querySelectorAll('[id=remove]');
    for(var i = 0; i < elementsRemove.length; i++){
        if(elementsRemove[i] === triggeringButton){
            table1.deleteRow(i + 1);
            break;
        }
    }
}

function rendererFrameToggle(){
    if(frameToggleButton.innerHTML !== "Movable Windows"){
        frameToggleButton.innerHTML = "Movable Windows";
        saveOpenWindowPosititions();
        return;
    }
    ipcRenderer.send('delete:windows', {
    });

    https = 'https://';

    var elementsTR = document.querySelectorAll('[id=dynamicTR]');
    for(var i = elementsTR.length - 1; i >= 0; i--) {

        var jsonData = {"data":[]};

        var enabled = elementsTR[i].querySelector('#enabled');
        var name = elementsTR[i].querySelector('#name');
        var url = elementsTR[i].querySelector('#url');
        var opacity = elementsTR[i].querySelector('#opacity');
        var maximized = elementsTR[i].querySelector('#maximized');
        var x = elementsTR[i].querySelector('#x');
        var y = elementsTR[i].querySelector('#y');
        var width = elementsTR[i].querySelector('#width');
        var height = elementsTR[i].querySelector('#height');

        var parsedenabled  = enabled.checked;
        var parsedname  = name.value;
        var parsedurl  = url.value;
        var parsedopacity  = opacity.value;
        var parsedmaximized  = maximized.checked;
        var parsedx  = x.value;
        var parsedy  = y.value;
        var parsedwidth = width.value;
        var parsedheight = height.value;

        var parsedurl = url.value;
        parsedurl = parsedurl.trim();
        if (parsedurl !== ''){
            if(!parsedurl.startsWith('http')){
                parsedurl = https.concat(parsedurl);
            }
            data = {
                "enabled": parsedenabled,
                "name": parsedname,
                "url": parsedurl,
                "opacity": +parsedopacity,
                "maximized": parsedmaximized,
                "x": +parsedx,
                "y": +parsedy,
                "width": +parsedwidth,
                "height": +parsedheight,
                "frame": true,
            }
            ipcRenderer.send('create:window', {
                data
            });
        }
    }
    frameToggleButton.innerHTML = "Save Window Positions";
    getWindowIDsForRenderer();
}

function saveOpenWindowPosititions(){
    ipcRenderer.send('save:positions', {
        
    });
}

function inputOpenWindowPositions(sentJSON){
    var elementsURLs = document.querySelectorAll('[id=url]');
    var elementsEnabled = document.querySelectorAll('[id=enabled]');
    var elementsX = document.querySelectorAll('[id=x]');
    var elementsY = document.querySelectorAll('[id=y]');
    var elementsWidth = document.querySelectorAll('[id=width]');
    var elementsHeight = document.querySelectorAll('[id=height]');

    for(i = 0; i < sentJSON.length; i++){
        for(j = i; j < elementsEnabled.length; j++){
            if(elementsEnabled[j].checked && elementsURLs[j].value.trim() !== ""){
                elementsX[j].value = sentJSON[i].x;
                elementsY[j].value = sentJSON[i].y;
                elementsWidth[j].value = sentJSON[i].width;
                elementsHeight[j].value = sentJSON[i].height;
                break;
            }
        }
    }
    changeSubmitButtonText();
}

function toggleInteractable(triggeringButton){
    const windowID = triggeringButton.value;
    if(triggeringButton.innerText === "Make Interactable"){
        triggeringButton.innerText = "Disable Interactable";
        ipcRenderer.send('enable:interactable', {
                windowID
            });
        return;
    }
    if(triggeringButton.innerText === "Disable Interactable"){
        triggeringButton.innerText = "Make Interactable";
        ipcRenderer.send('disable:interactable', {
            windowID
        });
        return;
    }
}