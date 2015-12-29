/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

function saveOptions()
{
    var select = document.getElementById("host_url");
    var url = select.value;
    if (ValidURL(url))
    {
        document.getElementById("confirm_message").innerHTML="";
        localStorage.setItem ('api_host', stripTrailingSlash(url));
        document.getElementById("host_url").value = localStorage['api_host'];
        document.getElementById("confirm_message").innerHTML="<font color='green'>Settings successfully saved.</font>";
        chrome.extension.getBackgroundPage().window.location.reload();
    }
    else
    {
       document.getElementById("confirm_message").innerHTML="<font color='red'>Provided URL is not valid.</font>";
    }
}

function ValidURL(url) {
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (!re.test(url)) {
        return false;
    } else {
        return true;
    }
}

function stripTrailingSlash(str) {
    if(str.substr(-1) == '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

function clickHandler(e) {
    setTimeout(saveOptions, 1000);
}

function main() {
    // Initialization work goes here.
    document.getElementById("host_url").value = localStorage['api_host'];
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
                          document.querySelector('button').addEventListener('click', clickHandler);
                          main();
                          });