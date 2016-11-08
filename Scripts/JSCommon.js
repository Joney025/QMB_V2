
//String.format 扩展函数
    String.prototype.trim = String.prototype.trim || function () {
            return this.replace(/(^[\s]*)|([\s]*$)/g, "");
        };
    String.prototype.replaceAll = String.prototype.replaceAll || function (s1, s2) {
            return this.replace(new RegExp(s1, "gm"), s2);
        };
    String.prototype.replaceHTML = String.prototype.replaceHTML || function () {
            return this.replace(/<[^>]+>/g, "").replace(/</g, "").replace(/>/g, "").replace(/&\/?.+?;/g, "");
        };

    String.prototype.format = String.prototype.f = function (args) {
        var result = this;
        if (arguments.length > 0) {
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    if (args[key] != undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        var reg = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
        //var s = this, i = arguments.length;
        //while (i--) {
        //    s = s.replace(new RegExp('\\{'+i+'\\}','gm'),arguments[i]);
        //}
        //return s;
    }
//计算字符串长度（包含中英文）
    String.prototype.lengthGB = function () {
        var gblen = 0;
        for (var i = 0; i < this.length; i++) {
            if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
                gblen += 2;
            } else {
                gblen++;
            }
        }
        return gblen;
    }
    /*
     函数：日期 加n天
     参数：n是天数
     返回：n天后的日期
     */
    Date.prototype.addDays = Date.prototype.addDays || function (n) {
            this.setDate(this.getDate() + n);
            return this;
        }
    /*
     函数：日期 减n天
     参数：n是天数
     返回：n天后的日期
     */
    Date.prototype.minusDays = Date.prototype.minusDays || function (n) {
            this.setDate(this.getDate() - n);
            return this;
        }
    /*
     函数：日期 加n天
     参数：n是天数
     返回：n天后的日期
     */
    Date.prototype.getWeek = Date.prototype.getWeek || function (date) {
            // var n = date.getDay();
            var n = this.getDay();
            var rtnStr = "";
            switch (n) {
                case 0:
                {
                    rtnStr = "星期日";
                    break;
                }
                case 1:
                {
                    rtnStr = "星期一";
                    break;
                }
                case 2:
                {
                    rtnStr = "星期二";
                    break;
                }
                case 3:
                {
                    rtnStr = "星期三";
                    break;
                }
                case 4:
                {
                    rtnStr = "星期四";
                    break;
                }
                case 5:
                {
                    rtnStr = "星期五";
                    break;
                }
                case 6:
                {
                    rtnStr = "星期六";
                    break;
                }
                default:
                {
                    rtnStr = "";
                    break;
                }
            }
            return rtnStr;
        }
    /*
     函数：把字符串转换为日期对象
     参数：yyyy-mm-dd或yyyy/mm/dd形式的字符串
     返回：Date对象
     注：IE下不支持直接实例化日期对象，如new Date("2011-04-06")
     */
    Date.prototype.convertDate = function (date) {
        var flag = true;

        var dateArray = date.split("-");
        if (dateArray.length != 3) {
            dateArray = date.split("/");
            if (dateArray.length != 3) {
                return null;
            }
            // flag = false;
        }
        var newDate = new Date();
        if (flag) {
            // month从0开始
            newDate.setFullYear(dateArray[0], dateArray[1] - 1, dateArray[2]);
        }
        else {
            newDate.setFullYear(dateArray[2], dateArray[1] - 1, dateArray[0]);
        }
        newDate.setHours(0, 0, 0);
        return newDate;
    };

    /*
     函数：计算两个日期之间的差值
     参数：date是日期对象
     flag：ms-毫秒，s-秒，m-分，h-小时，d-天，M-月，y-年
     返回：当前日期和date两个日期相差的毫秒/秒/分/小时/天
     */
    Date.prototype.dateDiff = function (date, flag) {
        var msCount = 24 * 60 * 60 * 1000;
        this.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        var diff = this.getTime() - date.getTime();
        return Math.floor(diff / msCount);

        switch (flag) {
            case "ms":
                msCount = 1;
                break;
            case "s":
                msCount = 1000;
                break;
            case "m":
                msCount = 60 * 1000;
                break;
            case "h":
                msCount = 60 * 60 * 1000;
                break;
            case "d":
                msCount = 24 * 60 * 60 * 1000;
                break;
        }
        return Math.floor(diff / msCount);
    };

    /*
     函数：格式化日期
     参数：formatStr-格式化字符串
     d：将日显示为不带前导零的数字，如1
     dd：将日显示为带前导零的数字，如01
     ddd：将日显示为缩写形式，如Sun
     dddd：将日显示为全名，如Sunday
     M：将月份显示为不带前导零的数字，如一月显示为1
     MM：将月份显示为带前导零的数字，如01
     MMM：将月份显示为缩写形式，如Jan
     MMMM：将月份显示为完整月份名，如January
     yy：以两位数字格式显示年份
     yyyy：以四位数字格式显示年份
     h：使用12小时制将小时显示为不带前导零的数字，注意||的用法
     hh：使用12小时制将小时显示为带前导零的数字
     H：使用24小时制将小时显示为不带前导零的数字
     HH：使用24小时制将小时显示为带前导零的数字
     m：将分钟显示为不带前导零的数字
     mm：将分钟显示为带前导零的数字
     s：将秒显示为不带前导零的数字
     ss：将秒显示为带前导零的数字
     l：将毫秒显示为不带前导零的数字
     ll：将毫秒显示为带前导零的数字
     tt：显示am/pm
     TT：显示AM/PM
     返回：格式化后的日期
     */
    Date.prototype.dtFormat = function (formatStr) {
        var date = this;

        /*
         函数：填充0字符
         参数：value-需要填充的字符串, length-总长度
         返回：填充后的字符串
         */
        var zeroize = function (value, length) {
            if (!length) {
                length = 2;
            }
            value = new String(value);
            for (var i = 0, zeros = ''; i < (length - value.length); i++) {
                zeros += '0';
            }
            return zeros + value;
        };

        return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function ($0) {
            switch ($0) {
                case 'd':
                    return date.getDate();
                case 'dd':
                    return zeroize(date.getDate());
                case 'ddd':
                    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()];
                case 'dddd':
                    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
                case 'M':
                    return date.getMonth() + 1;
                case 'MM':
                    return zeroize(date.getMonth() + 1);
                case 'MMM':
                    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
                case 'MMMM':
                    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
                case 'yy':
                    return new String(date.getFullYear()).substr(2);
                case 'yyyy':
                    return date.getFullYear();
                case 'h':
                    return date.getHours() % 12 || 12;
                case 'hh':
                    return zeroize(date.getHours() % 12 || 12);
                case 'H':
                    return date.getHours();
                case 'HH':
                    return zeroize(date.getHours());
                case 'm':
                    return date.getMinutes();
                case 'mm':
                    return zeroize(date.getMinutes());
                case 's':
                    return date.getSeconds();
                case 'ss':
                    return zeroize(date.getSeconds());
                case 'l':
                    return date.getMilliseconds();
                case 'll':
                    return zeroize(date.getMilliseconds());
                case 'tt':
                    return date.getHours() < 12 ? 'am' : 'pm';
                case 'TT':
                    return date.getHours() < 12 ? 'AM' : 'PM';
            }
        });
    }
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    };

    function formatDate(formatStr, fdate, start) {
        var fTime, fStr = 'ymdhis';
        if (!formatStr)
            formatStr = "y-m-d h:i:s";
        if (fdate) {
            fTime = new Date(fdate);
        }
        else {
            fTime = new Date();
        }
        var formatArr = [
            fTime.getFullYear().toString(),
            (fTime.getMonth() + 1).toString().length == 1 ? ("A" + (fTime.getMonth() + 1).toString()).replace("A", "0") : (fTime.getMonth() + 1).toString(),
            fTime.getDate().toString().length == 1 ? ("A" + fTime.getDate().toString()).replace("A", "0") : fTime.getDate().toString(),
            fTime.getHours().toString().length == 1 ? ("A" + fTime.getHours().toString()).replace("A", "0") : fTime.getHours().toString(),
            fTime.getMinutes().toString().length == 1 ? ("A" + fTime.getMinutes().toString()).replace("A", "0") : fTime.getMinutes().toString(),
            fTime.getSeconds().toString().length == 1 ? ("A" + fTime.getSeconds().toString()).replace("A", "0") : fTime.getSeconds().toString()
        ]

        var newdate2 = new Date();
        var wde = newdate2.getFullYear() + "-" + (newdate2.getMonth() + 1) + "-" + (newdate2.getDate() + 1) + " 00:00:00";
        var newdate = new Date(wde);
        if (!start) {
            for (var i = 0; i < formatArr.length; i++) {
                formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
            }
        } else {
            var ii = dateDiff(fTime, newdate)
            switch (ii) {
                case 0:
                    for (var i = 3; i < formatArr.length; i++) {
                        formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
                    }
                    formatStr = formatStr.substring(start, formatStr.length)
                    formatStr = "今天" + formatStr;
                    break;
                case 1:
                    for (var i = 3; i < formatArr.length; i++) {
                        formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
                    }
                    formatStr = formatStr.substring(start, formatStr.length)
                    formatStr = "昨天" + formatStr;
                    break;
                default:
                    for (var i = 0; i < formatArr.length; i++) {
                        formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
                    }
                    break;
            }
        }
        return formatStr;
    }

    function dateDiff(date1, date2) {
        var type1 = typeof date1, type2 = typeof date2;
        if (type1 == 'string')
            date1 = stringToTime(date1);
        else if (date1.getTime)
            date1 = date1.getTime();
        if (type2 == 'string')
            date2 = stringToTime(date2);
        else if (date2.getTime)
            date2 = date2.getTime();
        if ((date2 - date1) / (1000 * 60 * 60 * 24) == 0)
            return -1;
        else if ((date2 - date1) / (1000 * 60 * 60 * 24) == 1)
            return 0;
        else if ((date2 - date1) / (1000 * 60 * 60 * 24) == 2)
            return 1;
        else
            return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)); //结果是秒
    }

//字符串转成Time(dateDiff)所需方法
    function stringToTime(string) {
        var f = string.split(' ', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var t = (f[1] ? f[1] : '').split(':', 3);
        return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1) - 1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
        )).getTime();
    }

//日期格式化函数：
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * eg:
     * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
     * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
     * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */

    Date.prototype.PatDate = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18

    Date.prototype.FmtDate = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };


//获取当前日期,时间：type='-'='/'='0' yyyy-MM-dd hh:mm:ss yyyy/MM/dd hh:mm:ss 长整型：yyyyMMddhhmmss
    function GetCurDateTime(type) {
        var d = new Date();
        var years = d.getFullYear();
        var month = FormatNumZero(d.getMonth() + 1);
        var days = FormatNumZero(d.getDate());
        var hours = FormatNumZero(d.getHours());
        var minutes = FormatNumZero(d.getMinutes());
        var seconds = FormatNumZero(d.getSeconds());
        var datetimeStr = "";
        if (typeof (type) != 'undefined') {
            switch (type) {
                case "/":
                    datetimeStr = years + "/" + month + "/" + days + " " + hours + ":" + minutes + ":" + seconds;
                    break;
                case "-":
                    datetimeStr = years + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
                    break;
                case "0":
                    datetimeStr = parseInt(d.getTime() / 1000);
                    break;
                default:
                    datetimeStr = d.toLocaleString();
                    break;
            }
        }
        return datetimeStr;
    }

//格式化日期位数 1=》01
    function FormatNumZero(obj) {
        if (parseInt(obj) < 10) {
            return "0" + obj;
        } else {
            return obj;
        }
    }

//时间格式化: yyyy-MM-dd hh:mm:ss
    function FormatTimeCommonFun(v) {
        if (typeof (v) == 'undefined') {
            return "";
        }
        v = v.substr(1, v.length - 2);
        var obj = eval('(' + "{Date:new " + v + "}" + ')');
        var dValue = obj["Date"];
        if (dValue.getFullYear() < 1900) {
            return "";
        }
        return dValue.dtFormat("yyyy-MM-dd hh:mm:ss");
    }

//日期时间比较
    function CompareTime(t1, t2) {
        var ctime1 = new Date(Date.parse(t1.replace(new RegExp("-", "g"), "/")));
        var ctime2 = new Date(Date.parse(t2.replace(new RegExp("-", "g"), "/")));
        var cp = (Date.parse(ctime1) - Date.parse(ctime2)) / 3600 / 1000;
        if (cp < 0) {
            console.log("TimeA>TimeB");
        } else if (cp > 0) {
            console.log("TimeA<TimeB");
        } else if (cp == 0) {
            console.log("TimeA=TimeB");
        } else {
            console.log("CompareTime ERROR.");
        }
        return cp;
    }

//返回数字千分位显示
    function formatNumTh(num) {
        return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }

//返回2位小数的浮点型数值
    function toDecimalACT(x) {
        var y = parseFloat(x);
        if (isNaN(y)) {
            return '0.00';
        }
        var x1 = Math.round(x * 100) / 100;
        var x2 = x1.toString();
        var x3 = x2.indexOf('.');
        if (x3 < 0) {
            x3 = x2.length;
            x2 += '.';
        }
        while (x2.length <= x3 + 2) {
            x2 += '0';
        }
        return x2;
    }

//返回值：arg1加上arg2的精确结果
    function accAdd(arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))
        return (arg1 * m + arg2 * m) / m
    }

//返回值：arg1减上arg2的精确结果
    function accSub(arg1, arg2) {
        return accAdd(arg1, -arg2);
    }

//返回值：arg1乘以arg2的精确结果
    function accMul(arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }

//返回值：arg1除以arg2的精确结果
    function accDiv(arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }

//Web Browser Version.
    function BrowserInfo() {
        var browser = {
                msie: false, firefox: false, opera: false, safari: false,
                chrome: false, netscape: false, appname: 'unknown', version: 0
            },
            userAgent = window.navigator.userAgent.toLowerCase();
        if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(userAgent)) {
            browser[RegExp.$1] = true;
            browser.appname = RegExp.$1;
            browser.version = RegExp.$2;
        } else if (/version\D+(\d[\d.]*).*safari/.test(userAgent)) { // safari
            browser.safari = true;
            browser.appname = 'safari';
            browser.version = RegExp.$2;
        }
        return browser;
    }

    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1,
                presto: u.indexOf('Presto') > -1,
                webKit: u.indexOf('AppleWebKit') > -1,
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
                iPad: u.indexOf('iPad') > -1,
                webApp: u.indexOf('Safari') == -1
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
