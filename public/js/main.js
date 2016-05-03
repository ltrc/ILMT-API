var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var srcLangs = [];
var tgtLangs = [];
var langPairs = {};
var pairModuleCounts = {};
var pairModuleNames = {};
var autosizeEvt = document.createEvent('Event');
var sentenceCount = 0;
var translatedSentences = {};
var ISO_639RevMappings = {
    "hin": "Hindi (हिन्दी)",
    "pan": "Punjabi (ਪੰਜਾਬੀ)",
    "urd": "Urdu (اردو)"
}
var ISO_639_3_to_2Mapping = {
    "hin": "hi",
    "pan": "pa",
    "urd": "ur"
}
/* Unicode Ranges for a given language
 * Info Gathered from: http://jrgraphix.net/research/unicode_blocks.php
 */
var unicodeRanges = {
    "hin": [2304, 2431],
    "pan": [2560, 2687],
    "urd": [1536, 1791],
    "tel": [3072, 3199]
}
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
function eraseTranslateTable() {
    [].forEach.call(document.querySelectorAll('.ssf'),function(e){
        e.parentNode.removeChild(e);
    });
    [].forEach.call(document.getElementById('translate').children,function(e){
        e.parentNode.removeChild(e);
    });
}
function erasePreviousTranslations() {
    eraseTranslateTable();
    clearText('input');
    clearText('output');
    $('#aftermath').addClass('hidden');
    translatedSentences = {};
    updateProgressBar();
}
function getUniqID() {
    return 't' + Math.random().toString(36).substring(7);
}
function fillTable(sentence, result, src, tgt, seqNumber) {
    var ssfTable = document.createElement("table");
    ssfTable.setAttribute("style", "display:none");
    ssfTable.setAttribute("class", "table table-hover");
    ssfTable.id = getUniqID();
    for (var k in result) {
        var ssfRow = ssfTable.insertRow();
        ssfRow.insertCell().innerHTML = k;
        ssfRow.setAttribute("data-moduleid", k.split('-')[1]);
        ssfRow.id = k;
        ssfRow.className = 'ssf-rows';
        var input = document.createElement("textarea");
        input.maxLength = "5000";
        input.cols = "50";
        input.rows = "10";
        input.className = "ssf form-control";
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
    var tgtWords = "";
    var nameTags = {};
    for (var i in worgGenOut) {
        var ssf = worgGenOut[i].split("\t")
        if (ssf[0].match(/\d+.\d+/) && ssf[1] != '((') {
            var nameTag = worgGenOut[i].match(/name='([^']*)'/);
            var classStr = "target-word";
            if (nameTag){
                if (!nameTags[ssf[1]]) {
                    nameTags[ssf[1]] = 0;
                }
                classStr += ' ' + nameTags[ssf[1]] + '_' + nameTag[1];
                nameTags[ssf[1]]++;
            }
            tgtWords += "<span class='" + classStr + "'>" + ssf[1] + "</span>\n";
        }
    }

    var table = document.getElementById("translate");
    var row = table.insertRow();
    row.className = "translator-rows";
    row.setAttribute("data-rowid", seqNumber + '0');
    var cell = row.insertCell();
    var srcWords = sentence.split(' ');
    for (var i = 0; i < srcWords.length; i++) {
        cell.innerHTML += "<span>" + srcWords[i] + "</span>\n";
    }
    cell.className = "col-lg-5 translator-input";
    cell.setAttribute("data-sentenceid", seqNumber);
    var ssfInput = document.createElement("input");
    ssfInput.setAttribute("src", "/images/down.png");
    ssfInput.setAttribute("type", "image");
    ssfInput.setAttribute("alt", "Submit");
    ssfInput.setAttribute("style", "width: 20px;height:20px");
    ssfInput.setAttribute("onClick", "javascript: toggleImage(this); toggleDisplay('" + ssfTable.id + "');");
    cell = row.insertCell();
    cell.appendChild(ssfInput);
    cell.className = "col-lg-1 translator-debug";
    cell.setAttribute("style", "display: none");
    var tgtArea = document.createElement('div');
    tgtArea.className = "form-control translator-output";
    tgtArea.setAttribute("data-sentenceid", seqNumber);
    tgtArea.setAttribute('contenteditable', 'true');
    tgtArea.setAttribute('onfocus', "setKeyboard('tgtLangs')");
    tgtArea.innerHTML = tgtWords;
    $(tgtArea).ime();
    cell = row.insertCell();
    cell.appendChild(tgtArea);
    cell.className = "col-lg-5";
    row = table.insertRow();
    row.className = "translator-rows";
    row.setAttribute("data-rowid", seqNumber + '1');
    cell = row.insertCell();
    cell.setAttribute("colspan", "3");
    cell.appendChild(ssfTable);
    $("#translate").append($("tr.translator-rows").get().sort(function(a, b) {
        return parseInt($(a).attr("data-rowid")) - parseInt($(b).attr("data-rowid"));
    }));

    $(ssfTable).append($("#" + ssfTable.id + " tr.ssf-rows").get().sort(function(a, b) {
        return parseInt($(a).attr("data-moduleid")) - parseInt($(b).attr("data-moduleid"));
    }));

    translatedSentences[seqNumber] = tgtArea.textContent.replace(/(\r\n|\n|\r)/gm," ");
    fillOutput();
    updateProgressBar();
}
function fillOutput() {
    var outputArea = document.getElementById("output");
    var result = [];
    var keys = Object.keys(translatedSentences);
    keys.sort();
    for (i = 0; i < keys.length; i++) {
        result.push(translatedSentences[keys[i]]);
    }
    outputArea.value = result.join('\n');
    outputArea.dispatchEvent(autosizeEvt);
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
            input.className = "ssf form-control";
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
    fetchSentence(input, src, tgt, start + 1, pairModuleCounts[src][tgt], 0, callback, -1);
}
function fetchSentence(sentence, src, tgt, start, end, attempt, callback, seqNumber) {
    if (attempt > 5)
        return;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var result = JSON.parse(xmlhttp.responseText);
            if ("Error" in result) {
                return;
            }
            for (var k in result) {
                if (result[k].length <= 30) {
                    fetchSentence(sentence, src, tgt, start, end, attempt + 1, callback, seqNumber);
                    return;
                }
            }
            callback(sentence, result, src, tgt, seqNumber);
        }
    }
    var params = "input=" + encodeURIComponent(sentence);
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
function fetchTranslations() {
    translatedSentences = {};
    eraseTranslateTable();
    updateProgressBar();
    clearText('output');
    $('#aftermath').addClass('hidden');
    $('#toggle-debug').bootstrapToggle('off');
    sentenceCount = 0;
    var srcLangSelect = document.getElementById('srcLangs');
    var tgtLangSelect = document.getElementById('tgtLangs');
    var srcLang = srcLangSelect.options[srcLangSelect.selectedIndex].value;
    var tgtLang = tgtLangSelect.options[tgtLangSelect.selectedIndex].value;
    var paragraphUnits = document.getElementById("input").value.split('\n');
    var inputSeq = 0;
    for (i = 0; i < paragraphUnits.length; i++) {
        if (paragraphUnits[i].trim().length > 0) {
            tokenizeInput(paragraphUnits[i].trim(), srcLang, tgtLang, 1, pairModuleCounts[srcLang][tgtLang], ++inputSeq);
        }
    }
}
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
            opt.innerHTML = ISO_639RevMappings[opt.value];
            srcLangSelect.appendChild(opt);
        }

        updateTgtLangDropDown(srcLangSelect);
    }
    xmlHttp.open("GET", '/langpairs', true);
    xmlHttp.send(null);
}
function updateTgtLangDropDown() {
    // Safety Check
    var item = document.getElementById('srcLangs');
    if (item.selectedIndex >= 0) {
        var srcLang = item.options[item.selectedIndex].value;
        var availableTgtLangs = langPairs[srcLang];
        var tgtLangSelect = document.getElementById('tgtLangs');
        tgtLangSelect.innerHTML = "";
        for (var i in availableTgtLangs) {
            var opt = document.createElement('option');
            opt.value = availableTgtLangs[i];
            opt.innerHTML = ISO_639RevMappings[opt.value];
            tgtLangSelect.appendChild(opt);
        }
    }
    $('.selectpicker').selectpicker('refresh');
}
function clearText(itemId) {
    var item = document.querySelector('#' + itemId);
    item.value = "";
    item.dispatchEvent(autosizeEvt);
    translatedSentences = {};
}
function tokenizeInput(input, src, tgt, start, end, inputSeq) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var result = JSON.parse(xmlhttp.responseText);
            if ("Error" in result) {
                return;
            }
            var myRegexp = /(<Sentence id=.*?>)(.*?)(<\/Sentence>)/g;
            var tokenizedInput = result["tokenizer-1"].replace(/(\r\n|\n|\r)/gm,"");
            var match = myRegexp.exec(tokenizedInput);
            while (match != null) {
                var sentence = match[2].replace(/\tunk/gm," ").replace(/(\d+\t)/gm,"");
                sentenceCount++;
                fetchSentence(sentence, src, tgt, 1, pairModuleCounts[src][tgt],
                              0, fillTable, (inputSeq * 100000) + sentenceCount);
                match = myRegexp.exec(tokenizedInput);
            }
        }
    }
    var params = "input=" + encodeURIComponent(input);
    xmlhttp.open("POST", "/" + src + "/" +tgt + "/1/1", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}
function updateProgressBar() {
    var progress = (Object.keys(translatedSentences).length / sentenceCount) * 100;
    $('.progress-bar').css('width', progress + '%').attr('aria-valuenow', progress);
    if (progress == 100) {
        $('.progress').removeClass('active');
        $('#aftermath').removeClass('hidden');
    } else {
        $('.progress').addClass('active');
    }
}
function setKeyboard(id) {
    var lang = ISO_639_3_to_2Mapping[$('#' + id).val()];
    $.ime.preferences.setLanguage(lang);
    $.ime.preferences.setIM($.ime.languages[lang].inputmethods[0]);
}
function downloadOutput() {
    var text = $('#output').val();
    var filename = "Output_" + new Date().getTime() + '.txt';
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
function unicode2Lang(character) {
    for (lang in unicodeRanges) {
        if (character >= unicodeRanges[lang][0]
            && character <= unicodeRanges[lang][1])
            return lang;
    }
    return "unk";
}
$(document).ready(function() {
    fillLangPairs();
    $('.selectpicker').selectpicker();
    $('#pb').css({
        'background-color': '#A9A9A9',
    });
    autosize(document.querySelector('#input'));
    autosize(document.querySelector('#output'));
    autosizeEvt.initEvent('autosize:update', true, false);
    $('#input').ime();
    $("#input").bind('paste', function(e) {
        var elem = $(this);
        setTimeout(function() {
            var text = elem.val();
            var freq = {}
            for (i = 0; i < text.length; i++) {
                var lang = unicode2Lang(text.charCodeAt(i));
                freq[lang] ? freq[lang]++ : freq[lang] = 1;
            }
            var sortable = [];
            for (var lang in freq) {
                sortable.push([lang, freq[lang]]);
            }
            sortable.sort(function(a, b) {return b[1] - a[1]});
            var highFreqLang = sortable[0][0];
            if ($.inArray(highFreqLang, srcLangs) > -1) {
                $('#srcLangs.selectpicker').selectpicker('val', highFreqLang);
                updateTgtLangDropDown();
            } else if (highFreqLang != 'unk'){
                console.log('The input language ' + highFreqLang + ' is not supported yet!');
            } else {
                console.log('The input language is unknown!');
            }
        }, 100);
    });
    $('#toggle-debug').change(function() {
        $('.translator-debug').each(function(){
            $(this).toggle();
        });
    });
    $('#translate').on('keydown keyup', '.translator-output', function() {
        var sentenceID = this.getAttribute('data-sentenceid');
        if (sentenceID) {
            translatedSentences[sentenceID] = this.textContent.replace(/(\r\n|\n|\r)/gm," ");
            fillOutput();
        }
    });
    $('#translate').on('mouseenter mouseleave', '.target-word', function (evt) {
        var sentenceID = this.parentNode.getAttribute('data-sentenceid');
        if (this.classList.length > 1) {
            var srcWordInfo = this.classList[1].split('_');
            var spanKids = $('.translator-input').filter('[data-sentenceid="'+ sentenceID +'"]').children();
            var reqOccurence = srcWordInfo[0];
            var srcWord = srcWordInfo[1];
            spanKids.filter(function() {
                return $(this).text() == srcWord;
            }).eq(reqOccurence).toggleClass('srcword-highlight', evt.type == 'mouseenter');
        }
    });
});
