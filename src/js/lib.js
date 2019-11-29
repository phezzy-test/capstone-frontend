/* eslint-disable no-restricted-globals */
const $ = (q) => (document.querySelector(q));

const lib = {
  isEmpty: (str) => (str ? !str.trim() : true),

  isElement: (o) => (
    typeof HTMLElement === 'object' ? o instanceof HTMLElement
      : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
  ),

  isEmail: (str) => (!((/[a-z0-9]+@+[a-z0-9]+\.+[a-z]{3,}/i.test(str) === false || /[^a-z0-9.@]/i.test(str) === true))),

  isDescendant: (e, query) => {
    const matches = typeof (query) === 'string' ? document.querySelectorAll(query) : query;
    let el = lib.isElement(e) ? e : document.querySelector(e);
    let matchesLen = 0;
    if (lib.isElement(matches)) {
      if (query.contains(el)) return query;
    } else if (matches) {
      matchesLen = matches.length;
      while (el && !(el.tagName === 'HTML')) {
        for (let i = 0; i < matchesLen; i += 1) {
          if (el === matches[i]) return el;
        }

        el = el.parentElement;
      }
    }
    return false;
  },

  isUpperCase: (v) => (!!(v.toUpperCase() !== v.toLowerCase() && v === v.toUpperCase())),

  isLowerCase: (v) => (!!(v.toUpperCase() !== v.toLowerCase() && v === v.toLowerCase())),

  sepCamelWord: (str) => {
    let i = str.length - 1;
    let newStr = '';
    for (i; i >= 0; i -= 1) newStr = lib.isUpperCase(str[i]) ? ` ${str[i].toLowerCase()}${newStr}` : `${str[i]}${newStr}`;
    return newStr;
  },

  popMessage: (m, timeout = 4500) => {
    const animationTime = 300; // <== value must be the same here and in general.less
    const showMsg = (msg) => {
      setTimeout(() => {
        msg.classList.add('show');
      }, 100);
    };
    let popMessage = document.querySelector('#popMessage');
    const msg = document.createElement('DIV');
    msg.classList = 'message';
    msg.innerHTML = m;

    if (!popMessage) {
      // alert('popMessage not created yet');
      popMessage = document.createElement('DIV');
      popMessage.id = 'popMessage';
      popMessage.appendChild(msg);
      document.querySelector('#root').appendChild(popMessage);
      showMsg(msg);
    } else {
      popMessage.appendChild(msg);
      showMsg(msg);
    }

    setTimeout(() => {
      msg.classList.remove('show');
      setTimeout(() => {
        popMessage.removeChild(msg);
        if (!popMessage.children[0]) {
          document.querySelector('#root').removeChild(popMessage);
        }
      }, animationTime);
    }, timeout);
  },

  deleteIndex: (value, ...indexes) => {
    // can input as much parameter as possible but first parameter much be an array obj or string
    const newArray = [];
    const argumentsLength = indexes.length;
    let save = true;
    for (let j = 0; j < value.length; j += 1) {
      save = true;
      for (let i = 0; i < argumentsLength; i += 1) {
        const currentIndex = indexes[i];
        if (j === currentIndex) {
          save = false;
          break;
        }
      }
      if (save) newArray.push(value[j]);
    }
    return typeof (value) === 'string' ? newArray.join('') : newArray;
  },

  getWeekDay: (day) => {
    const weekdays = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return isNaN(day) ? false : weekdays[day];
  },

  getMonth: (month) => {
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];
    return isNaN(month) ? false : months[month];
  },

  getRelativeTime: (timestamp, relative = true) => {
    const d1 = new Date();
    const d2 = new Date(timestamp);
    let relativeTime = '';

    let year = d2.getFullYear();
    year = d1.getFullYear() > year ? year : '';
    const month = lib.getMonth(d2.getMonth());
    let hour = d2.getHours();
    const hourPref = hour >= 12 ? 'pm' : 'am';
    if (hour === 0) {
      hour = 12;
    } else {
      hour = hour > 12 ? hour - 12 : hour;
    }
    const date = d2.getDate() + 1;
    const minutes = d2.getMinutes();
    let minutesDbl = `${minutes}`;
    minutesDbl = minutesDbl.length === 1 ? `0${minutesDbl}` : minutesDbl;
    const day = lib.getWeekDay(d2.getDay());
    if (relative) {
      const diffInMilliseconds = d1 - d2;
      const diffInSec = Math.floor(diffInMilliseconds / 1000);
      if (diffInSec >= 60) { // 60 seconds make a minute
        const diffInMinutes = Math.floor(diffInSec / 60);
        if (diffInMinutes >= 60) { // 60 minutes make in an hour
          const diffInHours = Math.floor(diffInMinutes / 60);
          if (diffInHours >= 24) { // 24 hours make in a day
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays >= 7) { // 7 day make in a week
              relativeTime = `${day} ${month} ${date} ${year} at ${hour}:${minutesDbl} ${hourPref}`;
            } else if (diffInDays === 1) {
              relativeTime = `yesterday at ${hour}:${minutesDbl} ${hourPref}`;
            } else {
              relativeTime = `last ${day} at ${hour}:${minutesDbl} ${hourPref}`;
            }
          } else relativeTime = `${diffInHours}hr${diffInHours > 1 ? 's' : ''} ago`;
        } else relativeTime = `${diffInMinutes}min${diffInMinutes > 1 ? 's' : ''} ago`;
      } else relativeTime = 'just now';
    } else {
      relativeTime = `${day} ${month} ${date} ${year} at ${hour}:${minutesDbl} ${hourPref}`;
    }

    return relativeTime;
  },

  getCordinates: (el, scrollContainer = $('html')) => {
    const elem = lib.isElement(el) ? el : $(el);
    const xPos = elem.offsetLeft - scrollContainer.scrollLeft;
    const yPos = elem.offsetTop - scrollContainer.scrollTop;

    return {
      left: xPos,
      top: yPos,
    };
  },

  parseURI(_URI, _Uri) {
    // uri are expected to  come in this format => "/api/one/two/param?query=value&query=value"
    // where _URI is dominate and will be calling the shots (typically a route path)
    // where _Uri has to abide by _URI ruled (typically a full location path)
    const breakUri = (u) => {
      const uri = u.split('?')[0]; // <== to remove query string from the uri
      const uriArr = uri.split('/');
      if (uriArr[uriArr.length - 1] === '') uriArr.pop();
      return uriArr;
    };

    const URI = breakUri(_URI);
    const Uri = breakUri(_Uri);
    const URILen = URI.length;
    if (URILen === Uri.length) {
      const params = {};
      let param = '';
      let value = '';
      for (let i = 0; i < URILen; i += 1) {
        if (URI[i][0] === ':') {
          param = lib.deleteIndex(URI[i], 0);
          value = Uri[i];
          params[param] = value;
        } else if (URI[i] !== Uri[i]) return false;
      }

      return params;
    } return false;
  },

};

export default lib;
