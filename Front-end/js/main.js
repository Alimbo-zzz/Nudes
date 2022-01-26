"use strict";

// const baseURL = `http://136.244.96.201:10101/v1`;
// const baseURL = `http://149.28.153.46:10101/v1`;
var baseURL = "https://still-lake-80983.herokuapp.com/v1";
var routes = {
  home: '/',
  about: '/about',
  create: '/create',
  deposit: '/deposit',
  myPhotos: '/myPhotos',
  successpay: 'successpay',
  failedpay: 'failedpay'
};
var img_base_64 = null;
var base64_text = 'data:image/png;base64,';
var ls = window.localStorage;
var token = ls.getItem('ai_nude_token');
var username = ls.getItem('ai_nude_name');
var coins = ls.getItem('ai_nude_coins'); // if(window.location.protocol == 'https:' && window.location.pathname != '/test') window.location.protocol = 'http:';;"use strict";

function GET_images() {
  var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var url = "".concat(baseURL, "/images/list?page=").concat(page, "&count=5");
  start_loader();
  sendRequest('GET', url, null, token).then(function (res) {
    addImagesToCollection(res.images);
    modal_image();
    myPhotos_nav(res.pageCount);
    remove_loader();
  })["catch"](function (err) {
    console.log(err);
    remove_loader();
  });
}

var myPhotos = document.querySelector('.s_my-photos');
if (myPhotos) GET_images();;"use strict";

function GET_imgStatus(image_id) {
  var url = "".concat(baseURL, "/images/check?image_id=").concat(image_id);
  var check_image_status = setInterval(function () {
    sendRequest('GET', url, null, token).then(function (res) {
      if (res.state != 0) {
        if (myPhotos) GET_images();
        clearInterval(check_image_status);
      }
    })["catch"](function (err) {
      return console.log(err);
    });
  }, 10000);
};"use strict";

function GET_pay(cash) {
  var page_success = "".concat(routes.successpay);
  var page_failed = "".concat(routes.failedpay);
  var url = "".concat(baseURL, "/payments/create?payment_type=1&payment_amount=").concat(cash, "&successpay=").concat(page_success, "&failedpay=").concat(page_failed);
  sendRequest('GET', url, null, token).then(function (res) {
    check_coins();
    var pay_link = document.querySelector('#pay-link');
    pay_link.href = res.link;
    pay_link.click();
  })["catch"](function (err) {
    return console.log(err);
  });
}

var pay_btn = document.querySelector('.pay-btn');

if (pay_btn) {
  var points = document.querySelector('.points');
  var inps = points.querySelectorAll('input[type="radio"]');

  pay_btn.onclick = function (e) {
    e.preventDefault();
    inps.forEach(function (item, i) {
      if (item.checked) GET_pay(item.value);
    });
  };
};"use strict";

function GET_userInfo() {
  var url = "".concat(baseURL, "/user/info");
  sendRequest('GET', url, null, token).then(function (res) {
    ls.setItem('ai_nude_coins', "".concat(res.userWallet));
    document.querySelector('.modal__overlay').click();
    auth_select();
    coins_update(res.userWallet);
  })["catch"](function (err) {
    return console.log(err);
  });
}

if (token && username) {
  GET_userInfo();
};"use strict";

function ls_data_user(_username, _token, _coins) {
  ls.setItem('ai_nude_name', _username);
  ls.setItem('ai_nude_token', _token);
  ls.setItem('ai_nude_coins', _coins);
};"use strict";

function POST_auth(body) {
  start_loader();
  var url = "".concat(baseURL, "/user/auth");
  sendRequest('POST', url, body).then(function (res) {
    document.querySelector('.modal__overlay').click();
    ls_data_user(res.userName, res.authToken, res.wallet);
    location.reload();
    remove_loader();
  })["catch"](function (err) {
    console.log(err);
    remove_loader();
  });
};"use strict";

function POST_image() {
  var url = "".concat(baseURL, "/images/new");
  var body = {
    imageBase64: null
  };

  if (img_base_64) {
    body.imageBase64 = img_base_64[0];
  }

  if (!body.imageBase64) {
    modal('<h1>No image selected(</h1>');
  }

  if (body.imageBase64) {
    start_loader();
    sendRequest('POST', url, body, token).then(function (res) {
      remove_loader();
      window.location.pathname = routes.myPhotos;
      GET_userInfo();
    })["catch"](function (err) {
      remove_loader();

      if (err.code == 2) {
        window.location.pathname = routes.deposit;
      }

      console.log(err);
    });
  }
};"use strict";

function POST_registration(body) {
  start_loader();
  var click_id = CUT_clickID(); // файл param_click_id

  var url = "".concat(baseURL, "/user/registration");
  body.clickId = click_id;
  sendRequest('POST', url, body).then(function (res) {
    document.querySelector('.modal__overlay').click();
    ls_data_user(res.userName, res.authToken, res.wallet);
    location.reload();
    remove_loader();
    REMOVE_clickID();
  })["catch"](function (err) {
    console.log(err);
    remove_loader();
  });
};"use strict";

if (window.location.pathname == '/test') {
  POST_auth({
    userName: 'test7',
    userPassword: 'test7'
  });
};"use strict";

function addImagesToCollection(res) {
  var sec = document.querySelector('.s_my-photos');

  if (sec) {
    var list = sec.querySelector('.my-photos__list');
    var old_elems = list.querySelectorAll('.my-photos__el');
    old_elems.forEach(function (el, i) {
      if (el.id != 'myPhotos_el-first') el.remove();
    });
    res.forEach(function (item, i) {
      // GET_imgStatus(item.)
      var first = "";
      if (item.state == 1) first = "<li class=\"my-photos__el _success\">";
      if (item.state == 2) first = "<li class=\"my-photos__el _error\">";

      if (item.state == 0) {
        first = "<li class=\"my-photos__el _load\">";
        GET_imgStatus(item.imageId);
      }

      var end = '</li>';
      var html = "".concat(first, "\n\t\t                  <div class=\"my-photos__not-processed\">\n\t\t                    <div class=\"my-photos__img\">\n\t\t                      <img class=\"my-photos__preview\" src=\"data:image/png;base64,").concat(item.beforeBase64, "\"/>\n\t\t                    </div>\n\t\t                  </div><img class=\"my-photos__arrow\" src=\"./assets/images/icons/arrow.svg\">\n\t\t                  <div class=\"my-photos__processed\">\n\t\t                    <div class=\"my-photos__img\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img class=\"my-photos__preview\" src=\"data:image/png;base64,").concat(item.afterBase64, "\"/>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img class=\"my-photos__img_error\" src=\"./assets/images/warning.png\"><img class=\"my-photos__img_load\" src=\"./assets/images/load.png\">\n\t\t                    </div>\n\t\t                  </div>\n\t\t                ").concat(end);
      list.insertAdjacentHTML('beforeend', html);
    });
  }
};"use strict";

var autorization_modal = "\n\t<div class=\"authorization\">\n\t\t<form autocomplete=\"off\" class=\"authorization__form\">\n\n\t\t\t<div class=\"authorization__block\">\n\t\t\t \t<a class=\"authorization__back\"></a>\n\t\t\t\t<div class=\"btn authorization__change\"><span></span></div>\n\t\t\t</div>\n\t\t\t<div class=\"authorization__block\">\n\t\t\t\t<img class=\"authorization__logo\" src=\"./assets/images/icons/LOGO.svg\"/>\n\t\t\t\t<p class=\"text\">Sign in to continue</p>\n\t\t\t</div>\n\t\t\t<div class=\"authorization__block\">\n\t\t\t\t<input required type=\"text\" name=\"name\" placeholder=\"Enter username\" class=\"inp\"/>\n\t\t\t\t<input required type=\"password\" name=\"pass\" placeholder=\"Enter password\" class=\"inp\"/>\n\t\t\t\t<a href=\"#\" class=\"authorization__forgot\">Forgot password</a>\n\t\t\t</div>\n\t\t\t<div class=\"authorization__block\">\n\t\t\t\t<button type=\"send\" id=\"send_sign_in\" class=\"btn _orange authorization__sing-in\">Sign in</button>\n\t\t\t\t<button type=\"send\" id=\"send_sign_up\" class=\"btn authorization__sing-up\">Sign up</button>\n\t\t\t</div>\n\t\t</form>\n\t</div>\n";

function authorization(value) {
  var modal = document.querySelector('.modal');
  var form = document.querySelector('.authorization__form');
  var btn_remove = form.querySelector('.authorization__back');
  var btn_change = form.querySelector('.authorization__change');
  var inp_name = form.querySelector('input[name="name"]');
  var inp_pass = form.querySelector('input[name="pass"]');
  var btn_signIn = form.querySelector('#send_sign_in');
  var btn_signUp = form.querySelector('#send_sign_up');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
  });

  if (value == 'sign_in') {
    form.classList.add('_sing');
  }

  btn_remove.onclick = function () {
    return modal.classList.remove('_active');
  };

  btn_change.onclick = function () {
    form.classList.toggle('_sing');
  };

  btn_signUp.addEventListener('click', function () {
    if (inp_name.value.length && inp_pass.value.length) {
      var body = {
        userName: inp_name.value,
        userPassword: inp_pass.value
      };
      POST_registration(body);
      inp_name.value = '';
      inp_pass.value = '';
    }
  });
  btn_signIn.addEventListener('click', function () {
    if (inp_name.value.length && inp_pass.value.length) {
      var body = {
        userName: inp_name.value,
        userPassword: inp_pass.value
      };
      POST_auth(body);
      inp_name.value = '';
      inp_pass.value = '';
    }
  });
};"use strict";

function check_coins() {
  var check = setInterval(function () {
    var url = "".concat(baseURL, "/user/info");
    sendRequest('GET', url, null, token).then(function (res) {
      if (res.userWallet != coins) {
        ls.setItem('ai_nude_coins', "".concat(res.userWallet));
        auth_select();
        clearInterval(check);
      }
    })["catch"](function (err) {
      return console.log(err);
    });
  }, 10000);
};"use strict";

function hamburger() {
  var hamburger = document.querySelector('.hamburger');
  var hamburger_menu = document.querySelector('.header__block');
  var link_elems = document.querySelectorAll('.nav__link');
  var header = document.querySelector('.header');
  var body = document.querySelector('body');

  hamburger.onclick = function () {
    hamburger.classList.toggle('_active');
    hamburger_check();
  };

  link_elems.forEach(function (item, i) {
    item.onclick = function () {
      hamburger.classList.remove("_active");
      hamburger_check();
    };
  });
  hamburger_check(); // functios____________

  function hamburger_check() {
    if (hamburger.classList.contains("_active")) {
      hamburger_menu.classList.add('hamburger-menu_active');
      body.classList.add('_noScroll');
    } else {
      hamburger_menu.classList.remove('hamburger-menu_active');
      body.classList.remove('_noScroll');
    }
  }

  function hamburger_watcher() {
    var hamburger = document.querySelector('.hamburger');
    var status = true;
    var old_status = status;
    setInterval(function () {
      var active_class = hamburger.classList.contains('_active');
      if (active_class) status = true;
      if (!active_class) status = false;

      if (status != old_status) {
        hamburger_check();
        old_status = modal_status;
      }
    }, 100);
  }
}

hamburger();;"use strict";

function start_loader() {
  var loader = document.createElement('div');
  loader.classList.add('loader');
  loader.insertAdjacentHTML('beforeend', "<div id=\"escapingBallG\">\n\t<div id=\"escapingBall_1\" class=\"escapingBallG\"></div>\n</div>");
  document.body.append(loader);
}

function remove_loader() {
  var loader = document.querySelector('.loader');
  if (loader) loader.remove();
};"use strict";

// modal_window
function modal_window() {
  addModal();
  var modal = document.querySelector('.modal');
  var overlay = modal.querySelector('.modal__overlay');
  var content = modal.querySelector('.modal__content');
  var btn_remove = modal.querySelector('.modal__remove');
  var body = document.querySelector('body');

  overlay.onclick = function () {
    return remove();
  };

  btn_remove.onclick = function () {
    return remove();
  };

  modalWatcher();
  modal_check(); // functios____________

  function modal_check() {
    var active_class = modal.classList.contains('_active');

    if (active_class) {
      body.classList.add('_noScroll');
    } else {
      body.classList.remove('_noScroll');
    }
  }

  function remove() {
    if (modal) {
      modal.classList.remove('_active');
    }
  }

  function addModal() {
    var body = document.querySelector('body');
    var modal_html = "\n\t\t\t<div class=\"modal\">\n\t\t\t\t<div class=\"modal__remove\">\xD7</div>\n\t\t\t\t<div class=\"modal__overlay\"></div>\n\t\t\t\t<div class=\"modal__content\"></div>\n\t\t\t</div>\n\t\t";
    body.insertAdjacentHTML('beforeEnd', modal_html);
  }

  function modalWatcher() {
    var modal = document.querySelector('.modal');
    var modal_status = true;
    var old_status = modal_status;
    setInterval(function () {
      var active_class = modal.classList.contains('_active');
      if (active_class) modal_status = true;
      if (!active_class) modal_status = false;

      if (modal_status != old_status) {
        modal_check();
        old_status = modal_status;
      }
    }, 100);
  }
}

modal_window();

function modal() {
  var html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var modal = document.querySelector('.modal');
  modal.classList.add('_active');

  if (modal) {
    var content = modal.querySelector('.modal__content');
    content.innerHTML = html;
  }
};"use strict";

function modal_image() {
  var sec = document.querySelector('.s_my-photos');

  if (sec) {
    var img_arr = sec.querySelectorAll('.my-photos__preview');
    img_arr.forEach(function (item, i) {
      item.onclick = function () {
        modal("<div class=\"img-modal\"><img src=\"".concat(item.src, "\"/></div>"));
        console.log(item);
      };
    });
  }
};"use strict";

function myPhotos_nav(res) {
  var navs = document.querySelectorAll('.my-photos-nav');
  navs.forEach(function (nav) {
    var old_elems = nav.querySelectorAll('a');
    old_elems.forEach(function (el) {
      return el.remove();
    });

    var _loop = function _loop(i) {
      var link = document.createElement('a');
      link.classList.add('my-photos-nav__link');
      link.textContent = i + 1;
      nav.append(link);

      link.onclick = function () {
        GET_images(i);
      };
    };

    for (var i = 0; i < res; i++) {
      _loop(i);
    }
  });
};"use strict";

if (window.location.search.substr(0, 9) == '?clickid=') {
  var id = window.location.search.split('=')[1];
  ls.setItem('param_click_id', id);
}

function REMOVE_clickID() {
  localStorage.removeItem('param_click_id');
}

function CUT_clickID() {
  if (window.location.search.substr(0, 9) == '?clickid=') {
    var _id = window.location.search.split('=')[1];
    return _id;
  } else if (ls.getItem('param_click_id')) {
    return ls.getItem('param_click_id');
  } else {
    return '';
  }
};"use strict";

// radio__btns
function radio_btns() {
  var btns = document.querySelectorAll('.border-box');

  if (btns) {
    btns.forEach(function (item, i) {
      var radio = item.querySelector('input[type="radio"]');
      setInterval(function () {
        if (radio.checked && !item.classList.contains('_active')) {
          item.classList.add('_active');
        } else if (!radio.checked) {
          item.classList.remove('_active');
        }
      }, 100);
    });
  }
}

radio_btns();;"use strict";

function routes_btn() {
  var routes = document.querySelectorAll('.rout');
  routes.forEach(function (item, i) {
    item.addEventListener('click', function () {
      window.location.pathname = item.dataset.rout;
    });
  });
}

routes_btn();

function check_router() {
  var hash = window.location.pathname;
  var nav_list = document.querySelectorAll('.nav__link');
  nav_list.forEach(function (el, i) {
    el.classList.remove('_active');
  });
  nav_list.forEach(function (nav, i) {
    var el_hash = nav.getAttribute('href');

    if (el_hash == hash) {
      nav.classList.add('_active');
    }
  });
}

check_router();;"use strict";

function select_btn() {
  var select = document.querySelector('.select');
  var preview = select.querySelector('.select__preview');
  var links = select.querySelectorAll('.select__el');
  var sign_in = document.querySelector('#sign_in');
  var sign_up = document.querySelector('#sign_up');
  var log_off = document.querySelector('#log_off');

  log_off.onclick = function () {
    window.localStorage.clear();
    window.location.pathname = '/';
  };

  sign_in.onclick = function () {
    modal(autorization_modal);
    authorization('sign_in');
  };

  sign_up.onclick = function () {
    modal(autorization_modal);
    authorization('sign_up');
  };

  links.forEach(function (item, i) {
    item.onclick = function (e) {
      e.preventDefault();
      console.log('sss');
      select.classList.remove('_active');
    };
  });
  setInterval(function () {
    if (!select.classList.contains('_login')) {
      preview.onclick = function () {
        select.classList.toggle('_active');
      };
    } else {
      select.classList.remove('_active');
    }
  }, 100);
}

select_btn();

function auth_select() {
  var select = document.querySelector('.select');
  var coin_block = document.querySelector('#coins');

  var _username = document.querySelector('#username');

  if (token && username && coins) {
    select.classList.remove('_login');
    coin_block.textContent = coins;
    _username.textContent = username;
  }
}

function coins_update(value) {
  var select = document.querySelector('.select');
  var coin_block = document.querySelector('#coins');

  if (value) {
    coin_block.textContent = value;
  }
};"use strict";

function send_image() {
  var form = document.querySelector('.create-form');
  var login = document.querySelector('#sign_up');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (token && username && coins) {
        POST_image();
      } else {
        login.click();
      }
    });
  }
}

send_image();;"use strict";

if (window.screen.width < 820) {
  var sliders = document.querySelectorAll('.gallery');
  sliders.forEach(function (item, i) {
    var track = item.querySelector('.gallery__track');
    var list = item.querySelector('.gallery__list');
    var slides = item.querySelectorAll('.gallery__slide');
    item.classList.add('splide');
    track.classList.add('splide__track');
    list.classList.add('splide__list');
    slides.forEach(function (slide, i) {
      slide.classList.add('splide__slide');
    });
  });
  sliders.forEach(function (item, i) {
    new Splide(item).mount();
  });
};"use strict";

/*____________tabs_______*/
function f_tabs() {
  var tabs = document.querySelector('.tabs');

  if (tabs) {
    var rem_classes = function rem_classes(elems) {
      elems.forEach(function (el) {
        return el.classList.remove('_active');
      });
    };

    var check = function check() {
      var active = '';
      tabs_elems.forEach(function (el, index) {
        if (el.classList.contains('_active')) {
          active = index + 1;
          var text = el.textContent;
          tabs_title.textContent = text;
        }
      });
      add_content("_".concat(active));
    };

    var add_content = function add_content(content_name) {
      tabs_cont.querySelectorAll('.text').forEach(function (el) {
        return el.remove();
      });
      content[content_name].forEach(function (el) {
        tabs_cont.insertAdjacentHTML('beforeEnd', "<p class=\"text\">".concat(el, "</p>"));
      });
    };

    var tabs_elems = tabs.querySelectorAll('.tabs__tab');
    var tabs_cont = tabs.querySelector('.tabs__content');
    var tabs_title = tabs.querySelector('.title');
    var content = {
      "_1": ["Last modified date: May 17, 2021", "MEMBERSHIP AND BILLING. You hereby agree that, upon Your subscription to Personera.com, depending on the membership options You choose, You may be subject to certain immediate and automatically recurring charges which shall be billed to Your credit card, unless You cancel Your subscription under the terms and conditions of this Agreement. The charges, if any, which You will incur, and hereby authorize, are as follows:", "(a) Trial Subscriptions. You may subscribe to personera.com for a specific period of time, under the then current billing terms (as set forth on the sign-up page of Personera.com) (Trial Subscription).", "(b) Automatic Renewal of Trial Subscription to Monthly Membership. All Trial Subscriptions shall renew, automatically and without notice, to a Monthly Membership. Paid Trial Subscriptions will renew monthly at the Monthly Membership Rate selected by You.", "(c) Automatic Renewal of Monthly Membership. All Monthly Memberships shall renew, automatically and without notice, for successive periods of approximately one (1) month, commencing upon the expiration of the Trial Subscription, and continuing thereafter for successive periods of approximately one (1) month, unless and until this Agreement is canceled by You or the Company in accordance with the terms hereof. Each period of approximately one (1) month shall be referred to as the 'Monthly Subscription Period.'", "(d) Cancellation by Company. The Company may, at any time and at its sole discretion, cancel any Trial Membership or Monthly Membership.", "(e) Cancellation of Automatic Renewal of Trial Subscription to Monthly Membership. TO CANCEL AUTOMATIC RENEWAL AT THE END OF THE TRIAL SUBSCRIPTION, YOU MUST NOTIFY THE COMPANY PRIOR TO THE END OF THE TRIAL PERIOD, BY CONTACTING THE COMPANY BY E-MAIL OR TELEPHONE.", "(f) Cancellation of Automatic Renewal of Monthly Membership. TO CANCEL AUTOMATIC RENEWAL OF YOUR MONTHLY MEMBERSHIP AT ANY TIME, YOU MUST NOTIFY THE COMPANY BY E-MAIL OR TELEPHONE,.", "(g) Cancellations Effective Upon Receipt By Company. All cancellations received by the Company will be effective upon receipt.", "(h) Credit Card Charges Authorized. If you select any paid Trial or Monthly Subscriptions, You hereby authorize the Company to charge Your credit card (which You hereby acknowledge was entered by You into the sign-up page) to pay for the ongoing Subscription Fees to personera.com at the then current Subscription Rate. You further authorize the Company to charge Your credit card for any and all purchases of products, services and entertainment available through, at, in or on, or provided by, personera.com. You agree to be personally liable for all charges incurred by You during or through the use of personera.com. Your liability for such charges shall continue after termination of Your membership.", "(i) Automatic Credit Card or Debit Card Debit. All charges to Your credit card or debit card for Paid Trail Subscription and/or the Monthly Membership, under the terms and conditions of this Agreement, will be made in advance by automatic credit card or debit card debit and you hereby authorize the Company and its agents to process such transactions on Your behalf.", "(j) Billing Support. You may access the customer support department by emailing support, EMAIL", "(j) all questions regarding billing for the site membership", "(jj) how to request a refund."],
      "_2": ["Automatic Renewal of Trial Subscription to Monthly Membership. All Trial Subscriptions shall renew, automatically and without notice, to a Monthly Membership. Paid Trial Subscriptions will renew monthly at the Monthly Membership Rate selected by You.", "(c) Automatic Renewal of Monthly Membership. All Monthly Memberships shall renew, automatically and without notice, for successive periods of approximately one (1) month, commencing upon the expiration of the Trial Subscription, and continuing thereafter for successive periods of approximately one (1) month, unless and until this Agreement is canceled by You or the Company in accordance with the terms hereof. Each period of approximately one (1) month shall be referred to as the 'Monthly Subscription Period.'", "(d) Cancellation by Company. The Company may, at any time and at its sole discretion, cancel any Trial Membership or Monthly Membership.", "(e) Cancellation of Automatic Renewal of Trial Subscription to Monthly Membership. TO CANCEL AUTOMATIC RENEWAL AT THE END OF THE TRIAL SUBSCRIPTION, YOU MUST NOTIFY THE COMPANY PRIOR TO THE END OF THE TRIAL PERIOD, BY CONTACTING THE COMPANY BY E-MAIL OR TELEPHONE.", "(f) Cancellation of Automatic Renewal of Monthly Membership. TO CANCEL AUTOMATIC RENEWAL OF YOUR MONTHLY MEMBERSHIP AT ANY TIME, YOU MUST NOTIFY THE COMPANY BY E-MAIL OR TELEPHONE,.", "(g) Cancellations Effective Upon Receipt By Company. All cancellations received by the Company will be effective upon receipt.", "(h) Credit Card Charges Authorized. If you select any paid Trial or Monthly Subscriptions, You hereby authorize the Company to charge Your credit card (which You hereby acknowledge was entered by You into the sign-up page) to pay for the ongoing Subscription Fees to personera.com at the then current Subscription Rate. You further authorize the Company to charge Your credit card for any and all purchases of products, services and entertainment available through, at, in or on, or provided by, personera.com. You agree to be personally liable for all charges incurred by You during or through the use of personera.com. Your liability for such charges shall continue after termination of Your membership.", "(i) Automatic Credit Card or Debit Card Debit. All charges to Your credit card or debit card for Paid Trail Subscription and/or the Monthly Membership, under the terms and conditions of this Agreement, will be made in advance by automatic credit card or debit card debit and you hereby authorize the Company and its agents to process such transactions on Your behalf.", "(j) Billing Support. You may access the customer support department by emailing support, EMAIL", "(j) all questions regarding billing for the site membership", "(jj) how to request a refund."],
      "_3": ["Last modified date: May 17, 2021", "MEMBERSHIP AND BILLING. You hereby agree that, upon Your subscription to Personera.com, depending on the membership options You choose, You may be subject to certain immediate and automatically recurring charges which shall be billed to Your credit card, unless You cancel Your subscription under the terms and conditions of this Agreement. The charges, if any, which You will incur, and hereby authorize, are as follows:", "Last modified date: May 17, 2021", "MEMBERSHIP AND BILLING. You hereby agree that, upon Your subscription to Personera.com, depending on the membership options You choose, You may be subject to certain immediate and automatically recurring charges which shall be billed to Your credit card, unless You cancel Your subscription under the terms and conditions of this Agreement. The charges, if any, which You will incur, and hereby authorize, are as follows:", "Last modified date: May 17, 2021", "MEMBERSHIP AND BILLING. You hereby agree that, upon Your subscription to Personera.com, depending on the membership options You choose, You may be subject to certain immediate and automatically recurring charges which shall be billed to Your credit card, unless You cancel Your subscription under the terms and conditions of this Agreement. The charges, if any, which You will incur, and hereby authorize, are as follows:"]
    };
    tabs_elems.forEach(function (el, i) {
      el.onclick = function () {
        rem_classes(tabs_elems);
        el.classList.add('_active', "_".concat(i + 1));
        check();
      };
    });
    check();
  }
}

f_tabs();;"use strict";

if (window.location.pathname == routes.create) {
  var add = function add(src) {
    img_base_64 = [src];
    block.insertAdjacentHTML('afterbegin', "<div class=\"create-form__preview\">\n\t\t\t<div class=\"createImg-remove-btn\">\xD7</div>\n\t\t\t<img src=\"data:image/png;base64,".concat(src, "\"/>\n\t\t</div>"));
  };

  var inp_img = document.querySelector('#create-form_img');
  var block = document.querySelector('.create-form__block');
  var img_save = ls.getItem('nude_img-file');

  if (img_save) {
    add(img_save);
    var remove_btn = document.querySelector('.createImg-remove-btn');
    remove_btn.addEventListener('click', function () {
      var previews = document.querySelectorAll('.create-form__preview');
      ls.removeItem('nude_img-file');
      previews.forEach(function (el) {
        return el.remove();
      });
      img_base_64 = null;
      inp_img.value = '';
    });
  }
}

function update_img() {
  var inp_img = document.querySelector('#create-form_img');
  var block = document.querySelector('.create-form__block');

  if (inp_img) {
    inp_img.onchange = function (e) {
      getBase64(inp_img.files[0]);
      img_preview(inp_img, inp_img.files[0], block);
    };
  }
}

update_img(); // funcs_______

function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function () {
    img_base_64 = reader.result;
    img_base_64 = [img_base_64.split(",")[1]];
    ls.removeItem('nude_img-file');
    ls.setItem('nude_img-file', img_base_64);
  };

  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

function img_preview(file, img, block) {
  var reader = new FileReader();
  reader.readAsDataURL(img);

  reader.onload = function (event) {
    add(event.target.result);
    remove();
  };

  function add(src) {
    block.insertAdjacentHTML('afterbegin', "<div class=\"create-form__preview\">\n\t\t\t<div class=\"createImg-remove-btn\">\xD7</div>\n\t\t\t<img src=\"".concat(event.target.result, "\"/>\n\t\t</div>"));
  }

  function remove() {
    var remove_btn = document.querySelector('.createImg-remove-btn');
    remove_btn.addEventListener('click', function () {
      ls.removeItem('nude_img-file');
      remove_btn.parentNode.remove();
      img_base_64 = null;
      file.value = '';
    });
  }
};"use strict";

/*__________________header_fix________________*/
function header_fix() {
  var header = document.querySelector('.header');

  document.onscroll = function () {
    showHeader();
  };

  function showHeader() {
    if (window.pageYOffset > 200) {
      header.classList.add('header_fixed');
    } else {
      header.classList.remove('header_fixed');
    }
  }
}

header_fix();;"use strict";

function sendRequest(method, url) {
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var token = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'json';

    if (token) {
      xhr.setRequestHeader('auth', token);
    }

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(xhr.response);
      }
    };

    xhr.onerror = function () {
      reject(xhr.response);
    };

    xhr.send(JSON.stringify(body));
  });
}