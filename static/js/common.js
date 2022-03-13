import axios from "axios";
import apis from "@apis/apis.js";
import { ElMessage } from 'element-plus';

/* 所有的通用功能方法 */
const comfn = {
  // sitetype:信源
  infoTags: {
    1: "新闻",
    2: "论坛",
    3: "博客",
    4: "评论",
    5: "专题",
    6: "刊物/纸媒",
    7: "微博",
    8: "视频",
    9: "招聘",
    10: "元搜索",
    11: "RSS",
    12: "手机网站",
    13: "百度贴吧",
    14: "微信",
    15: "广州报纸",
    16: "广州的地方媒体",
    17: "外媒",
    18: "央媒",
    19: "自媒体(今日头条)",
    22: "问答平台", // 暂缺
    // 23: "短视频",
    24: "twitter",
    25: "facebook",
    50: "境外多语种", // 暂缺
    0: "其他",
  },

  /* **
   *  底层大数据组的通用token
   ** */
  TOKEN: "af001a11-3410-4b77-86a0-d54249d3df38",

  /* **
   *  获取地址栏的参数
   * @module 通用组件---公用方法
   * @params：
   *   name： 必传，参数名称
   ** */
  getUrlKey(name) {
    return (
      decodeURIComponent(
        (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
          window.location
        ) || [, ""])[1].replace(/\+/g, "%20")
      ) || null
    );
  },

  /* **
   * 通用的ajax请求封装
   * 参数说明：
   *   nologin: 不验证登录
   *   url: 请求接口地址，默认为doMain的值
   *   type: 请求类型 -- get、post、put、delete等等
   *   headers: 请求头信息
   *   params: 接口请求参数
   * promise参数说明：
   *     resolve: 成功的回调
   *     reject: 失败的回调
   ** */
  async doAjax(INSERT_DATA) {
    const fnObj = {
      // 默认给axios的参数
      defaultParams: {
        nologin: true, // 是否验证登录，验证true，不验证false
        type: "POST", // 请求类型："GET"、"POST" 尽量只使用get或者post，其它的在小程序中兼容性不是很好
        headers: {
          // 调用python接口(包括用户中心接口)需要使用"application/x-www-form-urlencoded"
          // "Content-Type": "application/x-www-form-urlencoded"
    
          // 调用lixing的业务接口需要使用"application/json"
          "Content-Type": "application/json",
        },
        withCredentials: false, // 调用python接口(包括用户中心接口)需要设置为true，业务接口(lixing)需要设置为false
        url: "", // 接口地址
        params: {}, // 接口接收的参数
      },
      FINALPARAMS: {},
      
      // 主逻辑
      async main() {
      	// 检查登录
      	if (!fnObj.checkLogin()) {
      		return false;
      	}
      	// 处理请求头
      	fnObj.resetHeaders();
      	// 处理网络请求的参数
      	if (fnObj.resetParams()) {
      		// 执行请求
      		return await fnObj.request()
      	}
      },
      
      // 调用封装
      async request() {
        return await new Promise((resolve, reject) => {
          const req_params = {
						url: fnObj.FINALPARAMS["url"], // 仅为示例，并非真实接口地址。
						method: fnObj.FINALPARAMS["type"],
						withCredentials: fnObj.FINALPARAMS["withCredentials"],
						header: fnObj.FINALPARAMS["header"],
						timeout: 30000, // 超时时间 30s
          };
          if (obj.type == "POST" || obj.type == "PUT" || obj.type == "PATCH") {
            req_params["data"] = fnObj.FINALPARAMS["params"];
          } else {
            req_params["params"] = fnObj.FINALPARAMS["params"];
          }
        
          const service = axios.create({
            timeout: req_params.timeout,
          });
          
          service.interceptors.response.use(
            (response) => {
              if (response.status == 200) {
                console.log(`请求接口 ${fnObj.FINALPARAMS["url"]} 成功，数据：`, response.data);
              }
              return response;
            },
            (error) => {
              if (error.message != "cancelLoalist") {
                console.error(`请求接口 ${fnObj.FINALPARAMS["url"]} 失败，错误原因：`, error);
              }
              return Promise.reject(error);
            }
          );
          
          service
            .request(req_params)
            .then((res) => {
              // 请求成功
              resolve(res);
            })
            .catch((err) => {
              // 请求失败
              // TODO：先做统一操作，再执行error回调
              if (err && err.response && err.response.status == 403) {
                if (url.indexOf(location.origin) != -1) {
                  //非同源的403不处理，同源的才处理
                  ElMessage({
                    showClose: true,
                    message: '登录已失效，请重新登录。',
                    type: 'error'
                  });
                  // comfn.backLogin();
                }
              }
              reject(err);
              return false;
            })
            .finally(() => {
              // TODO: 请求结束后，保证代码能继续执行
              // 请求完成
            });
        });
      },

			// 检查登录
			checkLogin() {
				let isLogin = true;
				// 是否验证登录 true为验证，false为不验证
				let nologin = INSERT_DATA.nologin || fnObj.defaultParams.nologin;
				if (nologin) {
					// TODO：验证登录
					// isLogin = comfn.checkLogin(); // 验证登录，已登录返回true，未登录返回false
				}
				return isLogin;
			},

			// 处理请求头headers
			resetHeaders() {
				const headers = {
          ...fnObj.defaultParams.headers,
          ...INSERT_DATA.headers,
          au_ur: "urunAPIKEY",
          uAgent: "system10",
          // uData: `${userInfo.systemID}-${userInfo.id}-${userInfo.companyID}`
        };
        
				let withCredentials = INSERT_DATA.withCredentials || fnObj.defaultParams.withCredentials;

				fnObj.FINALPARAMS["headers"] = headers;
				fnObj.FINALPARAMS["withCredentials"] = withCredentials || false;
			},
      
      // 整理axios的请求参数
      resetParams() {
				// 请求类型，默认POST请求
				fnObj.FINALPARAMS["type"] = INSERT_DATA.type || fnObj.defaultParams.type;

				// 接口地址
				fnObj.FINALPARAMS["url"] = INSERT_DATA.url || "";
        
        if (!fnObj.FINALPARAMS["url"]) {
          ElMessage({
            showClose: true,
            message: '缺少接口地址，请检查。',
            type: 'error'
          });
          return false;
        }

				// 传递给接口的参数，此处直接转发参数，不做任何处理，如果没传params进来，则直接自动传{}给接口
				fnObj.FINALPARAMS["params"] = INSERT_DATA.params || fnObj.defaultParams.params;
				return true;
			},
    };
    
    return await fnObj.main() // 执行主逻辑
  },

  /* 所有对时间操作的通用方法 */
  time: {
    /* **
     * 时间转换
     * 将 2020-01-01 08:00 转成 202001010800
     ** */
    onlyTimeNum(str) {
      str = str.replace(/-|:|\s/g, "");
      return str;
    },

    /**
     * 将 "201905061213" 格式的日期还原成 “2019-05-06 12:13”的格式
     * @module 通用组件---公用方法
     * @author maoyingcai
     * @email 619631130@qq.com
     **/
    resDateFormat(time_str) {
      let year = time_str.substr(0, 4);
      let month = time_str.substr(4, 2);
      let days = time_str.substr(6, 2);
      let hours = time_str.substr(8, 2);
      let mins = time_str.substr(10, 2);
      let seconds = time_str.substr(12, 2);
      let ym = year + "-" + month;
      let ymd = ym + "-" + days;
      let ymdhm = ymd + " " + (hours || "00") + ":" + (mins || "00");
      let ymdhms = ymdhm + ":" + (seconds || "00");
      return {
        ymd: ymd,
        ymdhm: ymdhm,
        ymdhms: ymdhms,
      };
    },

    /**
     * 转换某个指定时间
     * @module 通用组件---公用方法
     * @params 参数说明：
     *   str： 需要转换的时间，可以是时间戳，也可以是有格式的日期（可以精确到日，也可以精确到秒）
     *   char：转换后的连接符
     * @author maoyingcai
     * @email 619631130@qq.com
     **/
    getTimeObj(str, char) {
      // char = char ? char : "-"; // 日期中间的连接符，默认 -
      char = char ? char : char === undefined ? "-" : char === "" ? "" :
      "-"; //传连接符就用，不传就默认用 - ，传空字符串表示不用连接符连接，最后那个三元判断防止传null等这种极端情况
      let reg_timestr = /[-|/|:|\s]/;
      // 1、检查str 是否含有 - / : 这几个符号
      if (!reg_timestr.test(str)) {
        // 2、str 如果是 字符串类型的 时间戳，那么需要转换成数值类型
        let reg_num = /^[0-9]\d*$/;
        if (reg_num.test(str)) {
          if (str.toString().length > 10) {
            str = parseInt(str);
          } else {
            str = parseInt(str) * 1000;
          }
        }
      }

      let time_obj = {};
      let cur_time = "";
      if (str) {
        cur_time = new Date(str);
      } else {
        cur_time = new Date();
      }

      let time_str = cur_time.getTime();
      let nowday = cur_time.getDay(); // 今天是本周第几天，值为0(周日)~6(周六)
      let year = cur_time.getFullYear();

      let month = cur_time.getMonth() + 1;
      month = month < 10 ? "0" + month : month;

      let days = cur_time.getDate();
      days = days < 10 ? "0" + days : days;

      let hours = cur_time.getHours();
      hours = hours < 10 ? "0" + hours : hours;

      let mins = cur_time.getMinutes();
      mins = mins < 10 ? "0" + mins : mins;

      let seconds = cur_time.getSeconds();
      seconds = seconds < 10 ? "0" + seconds : seconds;

      let ym = year + char + month;
      let ymd = ym + char + days;
      let md = month + char + days;
      let mdhm = md + " " + hours + ":" + mins;
      let ymdh = ymd + " " + hours + ":00";
      let ymdhm = ymd + " " + hours + ":" + mins;
      let ymdhms = ymdhm + ":" + seconds;

      time_obj = {
        time_str: time_str, // 拿时间戳
        nowday: nowday, // 今天是本周第几天
        year: year, // 单独拿年份
        month: month, // 单独拿月份
        days: days, // 单独拿日
        hours: hours, // 单独拿小时
        mins: mins, // 单独拿分钟
        seconds: seconds, // 单独拿秒
        ym: ym, // 2020-07
        ymd: ymd, // 2020-07-15
        md: md, // 07-15
        mdhm: mdhm, // 07-15 19:08
        ymdh: ymdh, // 2020-07-15 19:00
        ymdhm: ymdhm, // 2020-07-15 19:08
        ymdhms: ymdhms, // 2020-07-15 19:08:50
      };

      return time_obj;
    },

    /* **
     * 获取本周的开始日期
     * **/
    getWeekStartDate() {
      let curObj = comfn.time.getTimeObj();
      let days = 0;
      // curObj.nowday 是从周日开始算本周第一天的
      if (curObj.nowday == 0) {
        days = -6;
      } else {
        days = parseInt("-" + curObj.nowday) + 1;
      }
      let obj = {
        type: "day",
        days: days,
      };
      let weekStartDate = comfn.time.getRecentDate(obj);
      return weekStartDate;
    },

    /* **
     * 获取本周的结束日期
     * **/
    getWeekEndDate() {
      let curObj = comfn.time.getTimeObj();
      let days = 0;
      // curObj.nowday 是从周日开始算本周第一天的
      if (curObj.nowday == 0) {
        days = 0;
      } else {
        days = 7 + parseInt("-" + curObj.nowday);
      }
      let obj = {
        type: "day",
        days: days,
      };
      let weekEndDate = comfn.time.getRecentDate(obj);
      return weekEndDate;
    },

    /* **
     * 获得某月的天数
     * **/
    getMonthDays(_month) {
      let curObj = comfn.time.getTimeObj();
      let monthStartDate = new Date(curObj.year, _month, 1);
      let monthEndDate = new Date(curObj.year, _month + 1, 1);
      let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
      return days;
    },

    /* **
     * 获得本月的开始日期
     * **/
    getMonthStartDate() {
      let curObj = comfn.time.getTimeObj();
      let monthStartDate = new Date(curObj.year, parseInt(curObj.month) - 1, 1);
      return comfn.time.getTimeObj(monthStartDate).ymd;
    },

    /* **
     * 获得本月的结束日期
     * **/
    getMonthEndDate() {
      let curObj = comfn.time.getTimeObj();
      let _month = parseInt(curObj.month) - 1;
      let monthEndDate = new Date(
        curObj.year,
        _month,
        comfn.time.getMonthDays(_month)
      );
      return comfn.time.getTimeObj(monthEndDate).ymd;
    },

    getYearStartDate() {
      let curObj = comfn.time.getTimeObj();
      let monthStartDate = new Date(curObj.year, 0, 1);
      return comfn.time.getTimeObj(monthStartDate).ymd;
    },

    /**
     * 计算两个日期之间的天数
     * @module 通用组件---公用方法
     * @author maoyingcai
     * @email 619631130@qq.com
     **/
    countDateDiff(stime, etime) {
      let startTime = comfn.time.getTimeObj(stime).time_str;
      let endTime = comfn.time.getTimeObj(etime).time_str;

      // abs 取绝对值    ceil 上舍
      let dates = Math.abs(startTime - endTime) / (1000 * 60 * 60 * 24);
      return dates;
    },

    /* **
     * 获取最近N天或最近N小时，返回具体的时间格式，例如：2020-02-14 13:02:03
     * obj里面的参数说明
     *  type:
     *    "year"->精确到年;
     *    "month"->精确到月;
     *    "day"->精确到天;
     *    "hour"->精确到小时;
     *    "minute"->精确到分钟;
     *    "second" - > 精确到秒;
     *  days： 要获取N天的N数值，正数往后算日期，负数往前算日期
     *  char： 非必传，默认"-"，用什么符号来连接
     *  time： 从指定时间开始计算
     ** */
    getRecentDate(obj) {
      let new_time = "";
      let def_time = obj.time || ""; // 默认时间
      let deftime_str = comfn.time.getTimeObj(def_time).time_str;
      let days_str = obj.days * 24 * 60 * 60 * 1000;
      let newtime_str = deftime_str + days_str;
      let newtime_obj = comfn.time.getTimeObj(newtime_str, obj.char);

      let opt = {
        year: newtime_obj.year,
        month: newtime_obj.ym,
        day: newtime_obj.ymd,
        hour: newtime_obj.ymdh,
        minute: newtime_obj.ymdhm,
        second: newtime_obj.ymdhms,
      };
      new_time = opt[obj.type];

      return new_time;
    },
  },

  //只能输入数字
  clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d]/g, ""); //清除"数字"和"."以外的字符
  },

  // 清除字符串中的所有html标签
  clearHtml(str) {
    return str.replace(/<[^>]+>/g, "");
  },

  // 图片代理
  getProxy(Overseas) {
    if (Overseas == 1) {
      // 境外
      return window.outsideImg;
    } else {
      // 境内
      return window.insideImg;
    }
  },

  /**
   * 检查关键词格式是否正确，并替换成正确格式的关键词
   * @module 配置页---检查关键词
   * @author maoyingcai
   * @email  619631130@qq.com
   * @params word：要检查的字符串
   **/
  checkWord(word) {
    let fnObj = {
      word_str: word, // 当前的关键词字符串
      errcode: 0, // 当前的错误代码
      msg: {
        0: "关键词格式正确", // 验证成功
        1: '关键词格式错误，缺少")"',
        2: '关键词格式错误，缺少"("',
        3: '关键词格式错误，缺少"]"',
        4: '关键词格式错误，缺少"["',
        5: '关键词格式错误，"()"中间必须有词或词组',
        6: '关键词格式错误，"[]"中间必须有词或词组',
      },
      main() {
        // 替换字符
        let new_wordstr = fnObj.replaceChar(fnObj.word_str);
        // 验证关键词格式是否正确
        fnObj.check(new_wordstr);

        // 要返回的集合
        let res = {
          msg: fnObj.msg[fnObj.errcode], // 返回消息
          errcode: fnObj.errcode, // 错误代码
          result: fnObj.word_str, // 验证成功后返回替换的新的字符串
        };
        return res;
      },

      // 过滤指定字符
      replaceChar(str) {
        str = str.replace(/^(\||\+)*|(\||\+)*$/g, "") // 第一个字符和最后一个字符不能是+号或者|号，直接清除
        str = str.replace(/（/g, "("); // 将中文的左小括号替换成英文的
        str = str.replace(/）/g, ")"); // 将中文的右小括号替换成英文的
        str = str.replace(/【/g, "["); // 将中文的左中括号替换成英文的
        str = str.replace(/】/g, "]"); // 将中文的右中括号替换成英文的
        str = str.replace(/\s*\+\s*/g, "+"); // 清除+号左右的空格
        str = str.replace(/\s*\|\s*/g, "|"); // 清除|号左右的空格
        str = str.replace(/\s*\(\s*/g, "("); // 清除(号左右的空格
        str = str.replace(/\s*\)\s*/g, ")"); // 清除)号左右的空格
        str = str.replace(/\s*\[\s*/g, "["); // 清除[号左右的空格
        str = str.replace(/\s*\]\s*/g, "]"); // 清除]号左右的空格
        str = str.replace(/\s+/gi, "+"); // 将>2的空格替换为1个+号
        return str;
      },

      // 检查关键词括号的匹配是否正确
      check(str) {
        let par_l = "(", // 左小括号
          pl_num = 0, // 左小括号的数量
          par_r = ")", // 右小括号
          pr_num = 0; // 右小括号的数量
        let bra_l = "[", // 左中括号
          bl_num = 0, // 左中括号的数量
          bra_r = "]", // 右中括号
          br_num = 0; // 右中括号的数量

        let reg_pl = str.match(/\(/g);
        let reg_pr = str.match(/\)/g);
        let reg_bl = str.match(/\[/g);
        let reg_br = str.match(/\]/g);

        // 先验证小括号
        pl_num = reg_pl ? reg_pl.length : 0;
        pr_num = reg_pr ? reg_pr.length : 0;
        if (pl_num != pr_num) {
          if (pl_num > pr_num) {
            fnObj.errcode = 1;
            return false;
          } else {
            //(pl_num < pr_num)
            fnObj.errcode = 2;
            return false;
          }
        }

        // 再验证中括号
        bl_num = reg_bl ? reg_bl.length : 0;
        br_num = reg_br ? reg_br.length : 0;
        if (bl_num != br_num) {
          if (bl_num > br_num) {
            fnObj.errcode = 3;
            return false;
          } else {
            //(bl_num < br_num)
            fnObj.errcode = 4;
            return false;
          }
        }

        // 验证()是否在一起
        if (str.indexOf("()") > -1) {
          fnObj.errcode = 5;
          return false;
        }

        // 验证[]是否在一起
        if (str.indexOf("[]") > -1) {
          fnObj.errcode = 6;
          return false;
        }

        fnObj.errcode = 0;
        fnObj.word_str = str;
      },
    };
    return fnObj.main();
  },

  // 规定上传文件类型
  uploadTypes: {
    ".doc": "docx",
    ".docx": "docx",
    ".pdf": "pdf",
    ".jpg": "img",
    ".png": "img",
    ".jpeg": "img",
    ".gif": "img",
    ".txt": "txt",
    ".xls": "excel",
    ".xlsx": "excel",
    ".rar": "rar",
    ".zip": "rar",
    ".ppt": "ppt",
    ".pptx": "ppt",
  },
  // 深拷贝
  deepClone(obj) {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          //判断ojb子元素是否为对象，如果是，递归复制
          if (obj[key] && typeof obj[key] === "object") {
            objClone[key] = this.deepClone(obj[key]);
          } else {
            //如果不是，简单复制
            objClone[key] = obj[key];
          }
        }
      }
    }
    return objClone;
  },
};
export default comfn;
