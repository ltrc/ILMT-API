var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var translatorHash = {};
var sentences = [];
function toggleDisplay(elementID) {
    (function(style) {
        style.display = style.display === 'none' ? '' : 'none';
    })(document.getElementById(elementID).style);
}
function toggleImage(item) {
    if (item.src.match('down.png')) {
        item.setAttribute('src', "/images/up.png");
    } else {
        item.setAttribute('src', "/images/down.png");
    }
}
function eraseText(id) {
    document.getElementById(id).value = "";
    [].forEach.call(document.querySelectorAll('.ssf'),function(e){
        e.parentNode.removeChild(e);
    });
    [].forEach.call(document.getElementById('translate').children,function(e){
        e.parentNode.removeChild(e);
    });
}
function getUniqID() {
    return 't' + Math.random().toString(36).substring(7);
}
var fillTable = function(sentence, result, src, tgt) {
    var ssfTable = document.createElement("table");
    ssfTable.setAttribute("style", "display:none");
    ssfTable.id = getUniqID();
    for (var k in result) {
        var ssfRow = ssfTable.insertRow();
        ssfRow.insertCell().innerHTML = k;
        ssfRow.id = k;
        var input = document.createElement("textarea");
        input.maxLength = "5000";
        input.cols = "50";
        input.rows = "10";
        input.className = "ssf";
        input.innerHTML = result[k];
        input.id = getUniqID();
        ssfRow.insertCell().appendChild(input);
        var ssfInput = document.createElement("input");
        ssfInput.setAttribute("src", "/images/down.png");
        ssfInput.setAttribute("type", "image");
        ssfInput.setAttribute("alt", "Submit");
        ssfInput.setAttribute("style", "width: 20px;height:20px");
        ssfInput.setAttribute("onClick", "javascript: specialUpdate('" + ssfTable.id+ "','" + k +"','" + input.id + "','" + src + "','" + tgt + "');");
        ssfRow.insertCell().appendChild(ssfInput);
    }
    var moduleCount = pairModuleCounts[src][tgt];
    var worgGenOut = result[pairModuleNames[src][tgt][moduleCount - 1] + '-' + moduleCount].split('\n');
    var tgt_txt = "";
    for (var i in worgGenOut) {
        var ssf = worgGenOut[i].split("\t")
        if (ssf[0].match(/\d+.\d+/) && ssf[1].match('[^(]')) {
            tgt_txt += ssf[1] + " ";
        }
    }
    var table = document.getElementById("translate");
    var row = table.insertRow();
    row.insertCell().innerHTML = sentence;
    var ssfInput = document.createElement("input");
    ssfInput.setAttribute("src", "/images/down.png");
    ssfInput.setAttribute("type", "image");
    ssfInput.setAttribute("alt", "Submit");
    ssfInput.setAttribute("style", "width: 20px;height:20px");
    ssfInput.setAttribute("onClick", "javascript: toggleImage(this); toggleDisplay('" + ssfTable.id + "');");
    row.insertCell().appendChild(ssfInput);
    row.insertCell().innerHTML = tgt_txt;
    row = table.insertRow();
    row.insertCell().appendChild(ssfTable);
    translatorHash[sentence] = tgt_txt;
    fillOutput();
}
function fillOutput() {
    var outputArea = document.getElementById("output");
    var result = "";
    for (var i = 0; i < sentences.length; i++) {
        if (sentences[i] in translatorHash) {
            result += translatorHash[sentences[i]];
        }
    }
    outputArea.innerHTML = result;
}
function specialUpdate(tableid, rowid, textid, src, tgt) {
    var table = document.getElementById(tableid);
    var textArea = table.querySelector('#' + textid);
    var input = textArea.value;
    start = Number(rowid.split('-')[1]);
    var callback = function(sentence, result, src, tgt) {
        for (var k in result) {
            var currRow = document.getElementById(tableid).querySelector('#' + k);
            var input = document.createElement("textarea");
            input.maxLength = "5000";
            input.cols = "50";
            input.rows = "10";
            input.className = "ssf";
            input.innerHTML = result[k];
            input.id = getUniqID();
            currRow.insertCell().appendChild(input);
            var ssfInput = document.createElement("input");
            ssfInput.setAttribute("src", "/images/down.png");
            ssfInput.setAttribute("type", "image");
            ssfInput.setAttribute("alt", "Submit");
            ssfInput.setAttribute("style", "width: 20px;height:20px");
            ssfInput.setAttribute("onClick", "javascript: specialUpdate('" + tableid+ "','" + k +"','" + input.id + "','" + src + "','" + tgt + "');");
            currRow.insertCell().appendChild(ssfInput);
        }
    }
    fetchSentence(input, src, tgt, start + 1, pairModuleCounts[src][tgt], 0, callback);
}
function fetchSentence(sentence, src, tgt, start, end, attempt, callback) {
    if (attempt > 5)
        return;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            var result = JSON.parse(xmlhttp.responseText);
            if ("Error" in result) {
                return;
            }
            for (var k in result) {
                if (result[k].length <= 30) {
                    fetchSentence(sentence, src, tgt, start, end, attempt + 1, callback);
                    return;
                }
            }
            callback(sentence, result, src, tgt);
        }
    }
    var params = "input=" + sentence;
    xmlhttp.open("POST", "/" + src + "/" +tgt + "/" + start + "/" + end + "/", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}
function updateModuleCount(srcLang, tgtLang) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        pairModuleCounts[srcLang][tgtLang] = xmlHttp.responseText;
    }
    xmlHttp.open("GET", '/' + srcLang + '/' + tgtLang, true);
    xmlHttp.send(null);
}
function updateModuleNames(srcLang, tgtLang) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        pairModuleNames[srcLang][tgtLang] = JSON.parse(xmlHttp.responseText);
    }
    xmlHttp.open("GET", '/' + srcLang + '/' + tgtLang + '/modules', true);
    xmlHttp.send(null);
}
function fetchTranslations()
{
    translatorHash = {};
    sentences = document.getElementById("input").value.replace(/(\r\n|\n|\r)/gm,"").match(/\(?(.*?)[^।\?!]+[।!\?]\)?/g);
    var srcLangSelect = document.getElementById('srcLangs');
    var tgtLangSelect = document.getElementById('tgtLangs');
    var srcLang = srcLangSelect.options[srcLangSelect.selectedIndex].value;
    var tgtLang = tgtLangSelect.options[tgtLangSelect.selectedIndex].value;
    for (i = 0; i < sentences.length; i++) {
        sentences[i] = sentences[i].trim();
        if (sentences[i].length > 0) {
            //console.log(sentences[i]);
            fetchSentence(sentences[i], srcLang, tgtLang, 1, pairModuleCounts[srcLang][tgtLang], 0, fillTable);
        }
    }
}
var srcLangs = [];
var tgtLangs = [];
var langPairs = {};
var pairModuleCounts = {};
var pairModuleNames = {};
function fillLangPairs() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        langPairs = JSON.parse(xmlHttp.responseText);
        for (var src in langPairs) {
            srcLangs.push(src);
            pairModuleCounts[src] = {};
            pairModuleNames[src] = {};
            for (var tgtIndex in langPairs[src]) {
                var tgt = langPairs[src][tgtIndex];
                tgtLangs.push(tgt);
                updateModuleCount(src, tgt);
                updateModuleNames(src, tgt);
            }
        }
        var srcLangSelect = document.getElementById('srcLangs');
        for (var i in srcLangs) {
            var opt = document.createElement('option');
            opt.value = srcLangs[i];
            opt.innerHTML = srcLangs[i];
            srcLangSelect.appendChild(opt);
        }
        updateTgtLangDropDown(srcLangSelect);
    }
    xmlHttp.open("GET", '/langpairs', true);
    xmlHttp.send(null);
}
function updateTgtLangDropDown(item) {
    // Safety Check
    if (item.selectedIndex >= 0) {
        var srcLang = item.options[item.selectedIndex].value;
        var availableTgtLangs = langPairs[srcLang];
        var tgtLangSelect = document.getElementById('tgtLangs');
        tgtLangSelect.innerHTML = "";
        for (var i in availableTgtLangs) {
            var opt = document.createElement('option');
            opt.value = availableTgtLangs[i];
            opt.innerHTML = availableTgtLangs[i];
            tgtLangSelect.appendChild(opt);
        }
    }
}
function clearText(id) {
    document.getElementById(id).innerHTML = "";
}
window.onload = fillLangPairs;
