var s_xy = [0, 38.65119833229951, 104.073486328125, 38.6518141832995, 104.076431393625, 38.6577751798795, 104.082963824405, 0, "", 5];
var s_id = 0;
var i_msg = 0;

function hideMsg(i_i) { if (i_i < i_msg) { return; } hideID("s_msg"); }

function showMsg(t_c, t_t, t_i) {
    i_msg = i_msg + 1;
    if (t_c != "") { t_t = "<span class=\"" + t_c + "\">" + t_t + "</span>"; }
    setID("s_msg", t_t);
    showID("s_msg");
    window.setTimeout(function () { hideMsg(i_msg); }, 5000);
}

function closeMarker() { if (lastMarker != null) { lastMarker.setMap(null); } }

function closeInfowindow() { if (infowindow != null) { if (infowindow.getContent() != "") { infowindow.close(); } } }

//变更地图类型事件
function changedMaptypeProcess() {
    closeMarker();
    if (lastMarker) {
        var t_xy, t_h;
        if (infowindow != null) { t_h = infowindow.getContent(); infowindow.close(); }
        if (map.getMapTypeId() == "hybrid" || map.getMapTypeId() == "satellite") {
            t_xy = new google.maps.LatLng(s_xy[1], s_xy[2]);
        } else {
            t_xy = new google.maps.LatLng(s_xy[3], s_xy[4]);
        }
        map.setCenter(t_xy);
        var marker = new google.maps.Marker({ position: t_xy, map: map, icon: "http://img.gpsspg.com/img/marker.png" });
        lastMarker = marker;
        if (t_h) { infowindow.setContent(t_h); infowindow.open(map, marker); }
    }
}

//显示点
function showMarkerInfo(id) {
    if (!id) { id = s_xy[0]; }
    if (s_xy[0] != id) { return; }
    closeMarker();
    closeInfowindow();
    var t_xy;
    if (map.getMapTypeId() == "hybrid" || map.getMapTypeId() == "satellite") {
        t_xy = new google.maps.LatLng(s_xy[1], s_xy[2]);
    } else {
        t_xy = new google.maps.LatLng(s_xy[3], s_xy[4]);
    }
    map.setCenter(t_xy);
    map.setZoom(s_xy[9]);
    var marker = new google.maps.Marker({ position: t_xy, map: map, icon: "http://img.gpsspg.com/img/marker.png" });
    lastMarker = marker;
    var i_h = 0;
    var t_h = "谷歌纬度经度：<br />";
    if (s_xy[3] == 0 && s_xy[4] == 0) {
        t_h += "正在转换中...";
        i_h = 1;
    } else {
        t_h += s_xy[3] + "," + s_xy[4];
    }
    t_h += "<br />GPS纬度经度：<br />"
    if (s_xy[1] == 0 && s_xy[2] == 0) {
        t_h += "正在转换中...";
        i_h = 1;
    } else {
        t_h += s_xy[1] + "," + s_xy[2] + "<br />" + getXYHMS(s_xy[1], "lat") + "<br />" + getXYHMS(s_xy[2], "lng");
    }
    t_h += "<br /><br />靠近：";
    if (s_xy[8] != "") { t_h += s_xy[8]; } else { t_h += "请求中..."; }
    infowindow.setContent(t_h);
    infowindow.open(map, marker);
    if (i_h == 0) { parent.hideID("ajax_msg"); }
}

//经纬度搜索地址
function searchLatLng(t, i_type, i_z) {
    var reg_c = /^-?[0-9]{1,2}(\s[0-9]{1,2}(\s[0-9]{1,2}(\.[0-9]{1,2})?)?)?\,-?[0-9]{1,3}(\s[0-9]{1,2}(\s[0-9]{1,2}(\.[0-9]{1,2})?)?)?$/;
    var a_t = t.split(",");
    var t_lat, t_lng;
    if (reg_c.test(t)) {
        t_lat = getHMSXY(a_t[0]);
        t_lng = getHMSXY(a_t[1]);
    } else {
        t_lat = a_t[0];
        t_lng = a_t[1];
    }
    if (isNaN(i_z)) { i_z = 15; }
    if (i_z >= 19) { i_z = 18; }
    if (i_z <= 5) { i_z = 13; }
    s_id = s_id + 1;
    taskPoi(s_id, t_lat, t_lng, i_type, i_z);
}

//经纬度搜索地址2
function taskPoi(s_id, t_lat, t_lng, i_type, i_z) {
    parent.setID("ajax_msg", "<span>正在解析...</span>");
    parent.showID("ajax_msg");
    var t_xy = [];
    t_xy = getLatLngOffice(t_lat, t_lng, i_type);
    s_xy = [s_id, t_xy[0], t_xy[1], t_xy[2], t_xy[3], t_xy[4], t_xy[5], 0, "", i_z];
    showMarkerInfo(s_id);
    parent.setID("ajax_msg", "<span>正在解析为地址...</span>");
    parent.showID("ajax_msg");
    var v_xy = new google.maps.LatLng(s_xy[3], s_xy[4]);
    geocoder.geocode({ "latLng": v_xy }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (s_xy[0] != s_id) { return; }
            if (results[0]) {
                s_xy[8] = results[0].formatted_address;
                s_xy[8] = s_xy[8].replace(/^中国/g, "");
                showMarkerInfo(s_id);
            } else {
                s_xy[8] = "无";
                showMarkerInfo(s_id);
            }
        } else {
            s_xy[8] = "解析失败=" + status;
            parent.showID("ajax_msg");
            showMarkerInfo(s_id);
        }
    });
}

//地址搜索经纬度
function searchAddress(s_t) {
    parent.setID("ajax_msg", "<span>正在解析...</span>");
    parent.showID("ajax_msg");
    geocoder.geocode({ "address": s_t }, function (results, status) {
        s_id = s_id + 1;
        var i_z = 11;
        if (s_t.length >= 3) { i_z = 14; }
        var o_xy = [];
        if (status == google.maps.GeocoderStatus.OK) {
            o_xy = getLatLngOffice(results[0].geometry.location.lat(), results[0].geometry.location.lng(), 1);
            s_xy = [s_id, o_xy[0], o_xy[1], o_xy[2], o_xy[3], o_xy[4], o_xy[5], 0, "", i_z];
            showMarkerInfo(s_id);
            parent.setID("ajax_msg", "<span>正在将结果解析为地址...</span>");
            var v_xy = new google.maps.LatLng(s_xy[3], s_xy[4]);
            geocoder.geocode({ "latLng": v_xy }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (s_xy[0] != s_id) { return; }
                    if (results[0]) {
                        s_xy[8] = results[0].formatted_address;
                        showMarkerInfo(s_id);
                    } else {
                        s_xy[8] = "-";
                        showMarkerInfo(s_id);
                    }
                } else {
                    s_xy[8] = "-";
                    showMarkerInfo(s_id);
                }
            });
        } else {
            parent.showID("ajax_msg");
            parent.showMsg("fcr", "未能解析为经纬度！请更改或精简关键词。<br />原因：" + status);
        }
    });
}

//搜索
function ajaxSearchMap() {
    hideID("s_msg");
    var s_t = getID("s_t");
    if (s_t == "") { showMsg("fcr", "您还未输入呢？"); return; }
    s_t = s_t.replace(/(^\s+)|(\s+$)/g, "");
    if (s_t == "") { showMsg("fcr", "您还未输入呢？"); return; }
    setID("ajax_msg", "<span>正在请求数据...</span>");
    showID("ajax_msg");
    s_t = s_t.replace(/\<|\>|\(|\)|（|）/g, "");
    s_t = s_t.replace(/，|\|/g, ",");
    s_t = s_t.replace(/\"|\'|\+|°|。|′|″/g, " ");
    s_t = s_t.replace(/\s+/g, " ");
    s_t = s_t.replace(/(^\s+)|(\s+$)/g, "");
    s_t = s_t.replace(/(\,\s+)|(\s+\,)/g, ",");
    s_t = s_t.replace(/\,+/g, ",");
    s_t = s_t.replace(/(^\,)|(\,$)/g, "");
    s_t = s_t.replace(/\.\,/g, ",");
    s_t = s_t.replace(/\.+/g, ".");
    s_t = s_t.replace(/\.$/g, "");
    var reg_a, reg_b, reg_c;
    reg_a = /^[A-Za-z0-9\u0391-\uFFE5\s]{1,100}$/;
    reg_b = /^-?[0-9]{1,3}(\.[0-9]{1,20})?\,-?[0-9]{1,3}(\.[0-9]{1,20})?$/;
    reg_c = /^-?[0-9]{1,3}(\s[0-9]{1,2}(\s[0-9]{1,3}(\.[0-9]{1,2})?)?)?\,-?[0-9]{1,3}(\s[0-9]{1,2}(\s[0-9]{1,2}(\.[0-9]{1,2})?)?)?$/;
    if (reg_a.test(s_t)) {
        searchAddress(s_t);
        return;
    } else if (reg_b.test(s_t) || reg_c.test(s_t)) {
        var s_tt = s_t.replace(/\-/g, "");
        s_tt = s_t.replace(/\./g, " ");
        var a_t = s_tt.split(",");
        var a_x = a_t[0].split(" ");
        var a_y = a_t[1].split(" ");
        if (parseFloat(a_x[0]) > 90 || parseFloat(a_y[0]) > 180) {
            showMsg("fcr", "纬度,经度 不正确！ 纬度在前（纬度小于90）<br /><br />纬度范围：-90~90<br />经度范围：-180~180");
            hideID("ajax_msg");
        } else {
            searchLatLng(s_t, 0);
        }
        return;
    } else {
        showMsg("fcr", "输入的格式不正确！若输入纬度,经度，中间须用 <strong>,</strong> 分隔。");
        hideID("ajax_msg");
    }
}

function goSearchMap(e) {
    var c_key = window.event ? e.keyCode : e.which;
    if (c_key == 13) { ajaxSearchMap(); }
}

function initButton() { jsAddEvent("s_btn", "onclick", ajaxSearchMap); jsAddEvent("s_t", "onkeydown", goSearchMap); }

function getDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378137;
    s = Math.round(s * 10000) / 10000;
    return s;
}

function getXYHMS(f, t_t) {
    var h = parseInt(f);
    var m = parseInt((parseFloat(f) - parseInt(h)) * 60);
    var s = (parseFloat(((parseFloat(f) - parseInt(h)) * 60 - parseInt(m)) * 60)).toFixed(2);
    if (m.toString().length == 1 && m != 0) { m = "0" + m.toString(); }
    if (s.toString().length == 1) { s = "0" + s.toString(); }
    if (s == "0.00") { s = 0; }
    var hms = "";
    if (t_t != null) {
        if (t_t == "lng") {
            if (h < 0) { hms = "西经W"; } else { hms = "东经E"; }
        }
        if (t_t == "lat") {
            if (h < 0) { hms = "南纬S"; } else { hms = "北纬N"; }
        }
    }
    hms += h + '°' + m + '′' + s + '″';
    hms = hms.replace(/\-/g, "");
    return hms;
}

function getHMSXY(t_t) {
    var a_t = t_t.split(" ");
    var v_t = 0;
    for (var i = 0; i < a_t.length; i++) {
        if (i == 0) { v_t = parseInt(a_t[i]); }
        if (i == 1) { v_t = v_t + (parseFloat(a_t[i]) / 60); }
        if (i == 2) { v_t = v_t + (parseFloat(a_t[i]) / 3600); }
    }
    v_t = v_t.toFixed(8);
    return v_t;
}

function getLatLngOffice(t_lat, t_lng, t_type) {
    var o_xy = [0, 0, 0, 0, 0, 0];
    o_xy[0] = parseFloat(t_lat);
    o_xy[1] = parseFloat(t_lng);
    o_xy[2] = o_xy[0];
    o_xy[3] = o_xy[1];
    o_xy[4] = o_xy[0];
    o_xy[5] = o_xy[1];
    if (o_xy[0] > 53 || o_xy[0] < 18 || o_xy[1] > 135 || o_xy[1] < 73) { return o_xy; }
    t_type = parseInt(t_type);
    createXmlHttp();
    xmlhttp.open("GET", "/ajax/latlng_offices.aspx?lat=" + t_lat + "&lng=" + t_lng + "&type=" + t_type, false);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    try { xmlhttp.send(null); } catch (e) { }
    if (xmlhttp.responseText) {
        var o;
        o = eval('(' + xmlhttp.responseText + ')');
        if (o.status) {
            if (o.status == "ok") {
                o_xy[0] = o.gps.lat;
                o_xy[1] = o.gps.lng;
                o_xy[2] = o.google.lat;
                o_xy[3] = o.google.lng;
                o_xy[4] = o.baidu.lat;
                o_xy[5] = o.baidu.lng;
            }
        }
    }
    return o_xy;
}