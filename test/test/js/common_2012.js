function getCookie(h) {
    var i = document.cookie.match("(?:^|;)\\s*" + h + "=([^;]*)");
    return i ? unescape(i[1]) : "";
}

function getCookies(objName, keyName) {
    var result = "";
    if (document.cookie.length > 0) {
        var objArray = document.cookie.split(";");
        var objSearch = objName + "=";
        var nameSearch = keyName + "=";
        for (var objItem in objArray) {
            if (objArray[objItem].indexOf(objSearch) != -1) {
                begin = objArray[objItem].indexOf(nameSearch);
                if (begin != -1) {
                    begin += nameSearch.length;
                    end = objArray[objItem].indexOf("&", begin);
                    if (end == -1) {
                        end = objArray[objItem].length;
                    }
                    result = decodeURIComponent(objArray[objItem].substring(begin, end));
                }
            }
        }
    }
    return result;
}

var xmlhttp = null;
function createXmlHttp() {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else if (!xmlhttp && window.ActiveXObject) {
        var IEXMLHttpVersion = [
			"Msxml2.XMLHttp.5.0",
			"Msxml2.XMLHttp.4.0",
			"Msxml2.XMLHttp.3.0",
			"Msxml2.XMLHttp",
			"Microsoft.XMLHttp"
		];
        for (var i = 0; i < IEXMLHttpVersion.length; i++) {
            try {
                xmlhttp = new ActiveXObject(IEXMLHttpVersion[i]);
            } catch (e) {
            }
        }
    }
}

function jsAddEvent(o_id, o_name, o_fun) {
    if (!document.getElementById(o_id)) { return; }
    var o_o = document.getElementById(o_id);
    if (window.attachEvent) { o_o.attachEvent(o_name, o_fun); }
    if (window.addEventListener) { o_name = o_name.replace(/^on/g, ""); o_o.addEventListener(o_name, o_fun, true); }
}

function isTest(tReg, tText, intEmpty) {
    try {
        if (intEmpty != null && (tText == "" || tText == "undefined" || tText == null)) { return true; }
        var regX = new RegExp(tReg, "ig");
        if (regX.test(tText)) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

function getID(o_id, s_type) {
    if (!document.getElementById(o_id)) { return ""; }
    var obj = document.getElementById(o_id);
    if (isTest("^(input|textarea|button)$", obj.nodeName)) {
        return obj.value;
    }
    if (isTest("^select$", obj.nodeName)) {
        var s_i = obj.selectedIndex;
        if (s_i >= 0) {
            if (s_type == "text") {
                return obj.options[index].text;
            } else {
                return obj.options[index].value;
            }
        }
        return "";
    }
    try {
        return obj.innerHTML;
    } catch (e) {
        return "";
    }
}

function setID(o_id, o_t) {
    if (!document.getElementById(o_id)) { return; }
    var obj = document.getElementById(o_id);
    if (isTest("^(input|textarea)$", obj.nodeName)) {
        obj.value = o_t;
        return;
    }
    if (isTest("^select$", obj.nodeName)) {
        for (var i = 0; i < obj.options.length; i++) {
            if (obj.options[i].value == o_t) {
                obj.options[i].selected = true;
                return;
            }
        }
        return;
    }
    try {
        return obj.innerHTML = o_t;
    } catch (e) {
        return alert(e.Message.toString());
    }
}

function getChecked(o_n) {
    if (document.getElementsByName(o_n) <= 0) { return ""; }
    var obj = document.getElementsByName(o_n);
    var t_r = "";
    if (isTest("^input$", obj[0].nodeName)) {
        if (isTest("^radio$", obj[0].type)) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].checked) {
                    return obj[i].value;                                      
                }
            }
            return t_r;
        } else if (isTest("^checkbox$", obj[0].type)) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].checked) {
                    t_r += obj[i].value;
                    if (obj.length > 1) { t_r += ","; }
                }
            }
        }
    }
    return t_r;
}

function setChecked(o_n, o_v) {
    if (document.getElementsByName(o_n) <= 0) { return; }
    var obj = document.getElementsByName(o_n);
    if (isTest("^input$", obj[0].nodeName)) {
        if (isTest("^(radio|checkbox)$", obj[0].type)) {
            o_v += ",";
            o_v = o_v.replace(/\,+/g, ",");
            var a_v = o_v.split(",");
            for (var i = 0; i < obj.length; i++) {
                for (var i_a in a_v) {
                    if (obj[i].value == a_v[i_a]) {
                        obj[i].checked = true;
                    } else {
                        obj[i].checked = false;
                    }
                }                
            }
        }        
    }
}

function showID(o_id, i_t) {
    var obj = document.getElementById(o_id);
    if (obj != null) { obj.style.display = "block"; }
    if (i_t != null) { hideID(o_id, i_t); }
}

function hideID(o_id, i_t) {
    var obj = document.getElementById(o_id);
    if (obj != null) {
        if (isNaN(i_t)) {
            obj.style.display = "none";
        } else {
            window.setTimeout(function () { obj.style.display = "none"; }, i_t);            
        }
    }
}

function writeTopRight() {
    var nHtmls = "<ol><li class=\"b0\">";
    var u_name = getCookies("user", "mail");
    var u_pass = getCookies("user", "pass");
    if (isTest("^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$", u_name) && isTest("^[A-Z0-9]{20,50}$", u_pass)) {
        nHtmls += u_name + "<a href=\"/my/\">我的账户</a></li><li><a href=\"/exit.aspx\">退出</a></li>";
    } else {
        nHtmls += "<a href=\"/login.aspx\">登录</a></li><li><a href=\"/join.aspx\">免费注册</a></li>";
    }
    nHtmls += "</ol>";
    document.writeln(nHtmls);
}

//Validator:初始化页面
function initValidator() {
    if (arrX == null || arrX.length < 1) { return false; }
    var i, j, regX, obj, objMsg;
    for (i = 0; i < arrX.length; i++) {
        if (arrX[i].length != 7) { break; }
        regX = /^(text|select|checkbox|radio|repeat|cookie)$/i;
        if (!regX.test(arrX[i][0])) { break; }
        switch (arrX[i][0].toLowerCase()) {
            case "checkbox":
            case "radio":
                obj = document.getElementsByName(arrX[i][1]);
                break;
            default:
                obj = document.getElementById(arrX[i][1]);
        }
        if (obj == null) { break; }
        if (obj.disabled == true) { break; }
        objMsg = document.getElementById(arrX[i][2]);
        if (objMsg == null) { break; }
        switch (arrX[i][0].toLowerCase()) {
            case "select":
                obj.setAttribute("onchange", "isValidator(" + i + ");");
                break;
            case "checkbox":
            case "radio":
                for (j = 1; j <= obj.length; j++) {
                    if (document.getElementById(arrX[i][1] + "_" + j) != null) {
                        document.getElementById(arrX[i][1] + "_" + j).setAttribute("onclick", "isValidator(" + i + ");");
                    } else {
                        break;
                    }
                }
                break;
            default:
                obj.setAttribute("onfocus", "focusValidator(" + i + ");");
                obj.setAttribute("onblur", "isValidator(" + i + ");");
        }
    }
}

//Validator:单次验证
function isValidator(cItem) {
    var obj, objMsg;
    //类型
    switch (arrX[cItem][0].toLowerCase()) {
        case "checkbox":
        case "radio":
            obj = document.getElementsByName(arrX[cItem][1]);
            break;
        default:
            obj = document.getElementById(arrX[cItem][1]);
    }
    if (obj == null) { return; }
    if (obj.disabled == true) { return; }
    objMsg = document.getElementById(arrX[cItem][2]);
    if (objMsg == null) { return; }
    var iValue = "";
    var iValues = "";
    var iType = 0;
    switch (arrX[cItem][0].toLowerCase()) {
        case "select":
            iValue = getSelect(arrX[cItem][1]);
            iType = 1;
            break;
        case "checkbox":
            iValue = getCheckbox(arrX[cItem][1]);
            iType = 1;
            break;
        case "radio":
            iValue = getRadio(arrX[cItem][1]);
            iType = 1;
            break;
        case "repeat":
            iValue = obj.value;
            if (document.getElementById(arrX[cItem][3]) != null) {
                iValues = document.getElementById(arrX[cItem][3]).value;
            }
            if (iValues != "" && iValues == iValue) {
                if (objMsg.style.display != "none") { objMsg.style.display = "none"; }
            } else {
                if (objMsg.style.display != "block") { objMsg.style.display = "block"; }
                if (iValues != "") {
                    objMsg.innerHTML = arrX[cItem][5];
                } else {
                    objMsg.innerHTML = arrX[cItem][6];
                }
                objMsg.className = "msg error";
                booValidator = false;
            }            
            return;
        default:
            iValue = obj.value;
    }
    var booEmpty = true;
    if (arrX[cItem][6] != "") { booEmpty = false;}
    if (iValue == null) { iValue = ""; }
    if (iValue == "") {
        if (booEmpty == true) {
            if (objMsg.style.display != "none") { objMsg.style.display = "none"; }
        } else {
            booValidator = false;
            if (objMsg.style.display != "block") { objMsg.style.display = "block"; }
            objMsg.innerHTML = arrX[cItem][6];
            objMsg.className = "msg error";
        }
        return;
    }
    if (iValue != "") {        
        if (iType == 1) {
            if (objMsg.style.display != "none") { objMsg.style.display = "none"; }
            return;
        }        
        var regT = arrX[cItem][3].toString();
        if (arrX[cItem][0].toLowerCase() == "cookie") {
            regT = getCookie(regT);
        }
        switch (regT) {
            case "mail":
                regT = "^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$";
                break;
            case "phone":
                regT = "^((\\(\\d{2,3}\\))|(\\d{3}\\-))?(\\(0\\d{2,3}\\)|0\\d{2,3}-)?[1-9]\\d{6,7}(\\-\\d{1,5})?$";
                break;
            case "mobile":
                regT = "^(1[358]\\d{9})$";
                break;
            case "url":
                regT = "^((http:\\/\\/|\\/)[A-Za-z0-9]+\\.[A-Za-z0-9]+[\\/=\\?%\\-&_~`@[\\]\\':+!]*([^<>\"])*)|(\\/)$";
                break;
            case "urls":
                regT = "^(http|https|ftp|thunder|qqdl|flashget|rayfile|fs2you):\\/\\/(.[^\\<\\>\"\n]*)$";
                break;
            case "ip":
                regT = "^(0|[1-9]\\d?|[0-1]\\d{2}|2[0-4]\\d|25[0-5]).(0|[1-9]\\d?|[0-1]\\d{2}|2[0-4]\\d|25[0-5]).(0|[1-9]\\d?|[0-1]\\d{2}|2[0-4]\\d|25[0-5]).(0|[1-9]\\d?|[0-1]\\d{2}|2[0-4]\\d|25[0-5])$";
                break;
            case "currency":
                regT = "^\\d+(\\.\\d+)?$";
                break;
            case "number":
                regT = "^\\d+$";
                break;
            case "qq":
                regT = "^[1-9]\\d{4,15}$";
                break;
            case "skype":
                regT = "^[A-Za-z0-9\\-\\_\\.]{6,32}$";
                break;
            case "zip":
                regT = "^[1-9]\\d{5}$";
                break;
            case "integer":
                regT = "^[-\\+]?\\d+$";
                break;
            case "name":
                regT = "^[A-Za-z0-9\\u0391-\\uFFE5]{1,16}$";
                break;
            case "pass":
                regT = "^[A-Za-z0-9\u0391-\uFFE5]{6,16}$";
                break;
            case "answer":
                regT = "^[^\\<\\>\\\\\:\"\\?\\*\\|\\'\\;]{6,20}$";
                break;
            case "birth":
                regT = "^((?:19|20)\\d\\d)(-|\\/)(0[1-9]|1[012])(-|\\/)(0[1-9]|[12][0-9]|3[01])$";
                break;
            default:
                regT = regT;
        }
        var regX = new RegExp(regT, "i");
        if (!regX.test(iValue)) {
            booValidator = false;
            if (objMsg.style.display != "block") { objMsg.style.display = "block"; }
            objMsg.innerHTML = arrX[cItem][5];
            objMsg.className = "msg error";
            return;
        } else {
            if (objMsg.style.display != "none") { objMsg.style.display = "none"; }
            return;
        }
    }
}

//Validator:提示
function focusValidator(cItem) {
    objMsg = document.getElementById(arrX[cItem][2]);
    if (objMsg.style.display != "block") { objMsg.style.display = "block"; }
    objMsg.className = "msg tips";
    objMsg.innerHTML = arrX[cItem][4];
}

//Validator:全部验证
function runValidator(booMsgUnity) {
    if (arrX == null || arrX.length < 1) {
        return true;
    }
    booValidator = true;   
    for (var i = 0; i < arrX.length; i++) {
        isValidator(i);
        if (booMsgUnity == 1) {
            if (booValidator == false) { break; }
        }
    }
    if (booValidator == false) {
        return false;
    } else {
        return true;
    }
}

//显示code
function checkCode() {
    var code = "";
    var codeLength = 6;    
    var selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
    for (var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 36);
        code += selectChar[charIndex];
    }
    var expire;
    expire = new Date((new Date()).getTime() + 0.1 * 3600000);
    expire = ";expires=" + expire.toGMTString() + ";path=/;";
    document.cookie = "code=" + encodeURI(code) + expire;
    if (document.getElementById("login_code") != null) {
        setID("login_code", code, "value");
    } else {
        html_code = "&nbsp;&nbsp;&nbsp;<input id=\"login_code\" type=\"text\" readonly=\"readonly\" style=\"width:80px;height:24px;text-align:center;border:0;line-height:24px;color:red;font-family:Arial;font-weight:bolder;letter-spacing:3px;font-style:italic;background-color:#eaf3ff;cursor:pointer;\" value=\"" + code + "\" title=\"刷新验证码\" onclick=\"checkCode();\" />";
        document.write(html_code);
    }
    if (document.getElementById("u_code") != null) setID("u_code", "", "value");
}

function writeGoogleADs(adSlot, adW, adH, adNote) {
    document.writeln("<script type=\"text/javascript\"><!--");
    document.writeln("google_ad_client = \"pub-8683919961926629\";");
    document.writeln("google_ad_slot = \"" + adSlot + "\";");
    document.writeln("google_ad_width = " + adW + ";");
    document.writeln("google_ad_height = " + adH + ";");
    document.writeln("//-->");
    document.writeln("</script>");
    document.writeln("<script type=\"text/javascript\" src=\"http://pagead2.googlesyndication.com/pagead/show_ads.js\">");
    document.writeln("</script>");
}

//* id l=默认右 t=默认底 f=1固定|空或者0表示滚动 *//
function scrollx(p) {
    var d = document, dd = d.documentElement, db = d.body, w = window, o = d.getElementById(p.id), ie6 = /msie 6/i.test(navigator.userAgent), style, timer;
    if (o) {
        o.style.cssText += ";position:" + (p.f && !ie6 ? 'fixed' : 'absolute') + ";" + (p.l == undefined ? 'right:0;' : 'left:' + p.l + 'px;') + (p.t != undefined ? 'top:' + p.t + 'px' : 'bottom:0');
        if (p.f && ie6) {
            o.style.cssText += ';left:expression(documentElement.scrollLeft + ' + (p.l == undefined ? dd.clientWidth - o.offsetWidth : p.l) + ' + \"px\");top:expression(documentElement.scrollTop +' + (p.t == undefined ? dd.clientHeight - o.offsetHeight : p.t) + '+ "px" );';
            dd.style.cssText += ';background-image: url(about:blank);background-attachment:fixed;';
        } else {
            if (!p.f) {
                w.onresize = w.onscroll = function () {
                    clearInterval(timer);
                    timer = setInterval(function () {
                        var st = (dd.scrollTop || db.scrollTop), c;
                        c = st - o.offsetTop + (p.t != undefined ? p.t : (w.innerHeight || dd.clientHeight) - o.offsetHeight);
                        if (c != 0) {
                            o.style.top = o.offsetTop + Math.ceil(Math.abs(c) / 10) * (c < 0 ? -1 : 1) + 'px';
                        } else {
                            clearInterval(timer);
                        }
                    }, 10)
                }
            }
        }
    }
}