"use strict";

// const baseURL = `http://136.244.96.201:10101/v1`;
var baseURL = "http://149.28.153.46:10101/v1";
var routes = {
  home: '/',
  about: '/about',
  create: '/create',
  deposit: '/deposit',
  myPhotos: '/myPhotos',
  payinfo: '/payinfo'
};
var img_base_64 = null;
var base64_text = 'data:image/png;base64,';
var ls = window.localStorage;
var token = ls.getItem('ai_nude_token');
var username = ls.getItem('ai_nude_name');
var coins = ls.getItem('ai_nude_coins');
console.log('test_1');
console.log("before protocol: ".concat(window.location.protocol));

if (window.location.protocol == 'https:') {
  window.location.protocol = 'http:';
  console.log('change');
  console.log(window.location.protocol);
} else {
  console.log('normal');
  console.log(window.location.protocol);
}

console.log("after protocol: ".concat(window.location.protocol));;"use strict";

function GET_images() {
  var url = "".concat(baseURL, "/images/list");
  sendRequest('GET', url, null, token).then(function (res) {
    addImagesToCollection(res);
    modal_image();
  })["catch"](function (err) {
    return console.log(err);
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
  var page_back = "".concat(window.location.origin).concat(routes.payinfo);
  var url = "".concat(baseURL, "/payments/create?payment_type=1&payment_amount=").concat(cash, "&successfull=").concat(page_back);
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
  start_loader();
  var url = "".concat(baseURL, "/images/new");
  var body = {
    imageBase64: img_base_64[0]
  };
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
};"use strict";

function POST_registration(body) {
  start_loader();
  var url = "".concat(baseURL, "/user/registration");
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
      list.insertAdjacentHTML('afterbegin', html);
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
  var login = document.querySelector('#sign_in');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJSRVEvR0VUX2ltYWdlcy5qcyIsIlJFUS9HRVRfaW1nU3RhdHVzLmpzIiwiUkVRL0dFVF9wYXkuanMiLCJSRVEvR0VUX3VzZXJJbmZvLmpzIiwiUkVRL2xzX2RhdGFfdXNlci5qcyIsIlJFUS9QT1NUX2F1dGguanMiLCJSRVEvUE9TVF9pbWFnZS5qcyIsIlJFUS9QT1NUX3JlZ2lzdHJhdGlvbi5qcyIsImJsb2Nrcy9hZGRJbWFnZXNUb0NvbGxlY3Rpb24uanMiLCJibG9ja3MvYXV0b3JpemF0aW9uX21vZGFsLmpzIiwiYmxvY2tzL2NoZWNrX2NvaW5zLmpzIiwiYmxvY2tzL2hhbWJ1cmdlci5qcyIsImJsb2Nrcy9sb2FkZXIuanMiLCJibG9ja3MvbW9kYWwuanMiLCJibG9ja3MvbW9kYWxfaW1hZ2UuanMiLCJibG9ja3MvcmFkaW9fYnRuLmpzIiwiYmxvY2tzL3JvdXRlc19idG4uanMiLCJibG9ja3Mvc2VsZWN0LmpzIiwiYmxvY2tzL3NlbmRfaW1hZ2UuanMiLCJibG9ja3Mvc3BsaWRlLmpzIiwiYmxvY2tzL3RhYnMuanMiLCJibG9ja3MvdXBkYXRlX2ltZy5qcyIsInRlbXBsYXRlcy9oZWFkZXJfZml4LmpzIiwidGVtcGxhdGVzL3JlcS5qcyJdLCJuYW1lcyI6WyJiYXNlVVJMIiwicm91dGVzIiwiaG9tZSIsImFib3V0IiwiY3JlYXRlIiwiZGVwb3NpdCIsIm15UGhvdG9zIiwicGF5aW5mbyIsImltZ19iYXNlXzY0IiwiYmFzZTY0X3RleHQiLCJscyIsIndpbmRvdyIsImxvY2FsU3RvcmFnZSIsInRva2VuIiwiZ2V0SXRlbSIsInVzZXJuYW1lIiwiY29pbnMiLCJjb25zb2xlIiwibG9nIiwibG9jYXRpb24iLCJwcm90b2NvbCIsIkdFVF9pbWFnZXMiLCJ1cmwiLCJzZW5kUmVxdWVzdCIsInRoZW4iLCJyZXMiLCJhZGRJbWFnZXNUb0NvbGxlY3Rpb24iLCJtb2RhbF9pbWFnZSIsImVyciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIkdFVF9pbWdTdGF0dXMiLCJpbWFnZV9pZCIsImNoZWNrX2ltYWdlX3N0YXR1cyIsInNldEludGVydmFsIiwic3RhdGUiLCJjbGVhckludGVydmFsIiwiR0VUX3BheSIsImNhc2giLCJwYWdlX2JhY2siLCJvcmlnaW4iLCJjaGVja19jb2lucyIsInBheV9saW5rIiwiaHJlZiIsImxpbmsiLCJjbGljayIsInBheV9idG4iLCJwb2ludHMiLCJpbnBzIiwicXVlcnlTZWxlY3RvckFsbCIsIm9uY2xpY2siLCJlIiwicHJldmVudERlZmF1bHQiLCJmb3JFYWNoIiwiaXRlbSIsImkiLCJjaGVja2VkIiwidmFsdWUiLCJHRVRfdXNlckluZm8iLCJzZXRJdGVtIiwidXNlcldhbGxldCIsImF1dGhfc2VsZWN0IiwiY29pbnNfdXBkYXRlIiwibHNfZGF0YV91c2VyIiwiX3VzZXJuYW1lIiwiX3Rva2VuIiwiX2NvaW5zIiwiUE9TVF9hdXRoIiwiYm9keSIsInN0YXJ0X2xvYWRlciIsInVzZXJOYW1lIiwiYXV0aFRva2VuIiwid2FsbGV0IiwicmVsb2FkIiwicmVtb3ZlX2xvYWRlciIsIlBPU1RfaW1hZ2UiLCJpbWFnZUJhc2U2NCIsInBhdGhuYW1lIiwiY29kZSIsIlBPU1RfcmVnaXN0cmF0aW9uIiwic2VjIiwibGlzdCIsIm9sZF9lbGVtcyIsImVsIiwiaWQiLCJyZW1vdmUiLCJmaXJzdCIsImltYWdlSWQiLCJlbmQiLCJodG1sIiwiYmVmb3JlQmFzZTY0IiwiYWZ0ZXJCYXNlNjQiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJhdXRvcml6YXRpb25fbW9kYWwiLCJhdXRob3JpemF0aW9uIiwibW9kYWwiLCJmb3JtIiwiYnRuX3JlbW92ZSIsImJ0bl9jaGFuZ2UiLCJpbnBfbmFtZSIsImlucF9wYXNzIiwiYnRuX3NpZ25JbiIsImJ0bl9zaWduVXAiLCJhZGRFdmVudExpc3RlbmVyIiwiY2xhc3NMaXN0IiwiYWRkIiwidG9nZ2xlIiwibGVuZ3RoIiwidXNlclBhc3N3b3JkIiwiY2hlY2siLCJoYW1idXJnZXIiLCJoYW1idXJnZXJfbWVudSIsImxpbmtfZWxlbXMiLCJoZWFkZXIiLCJoYW1idXJnZXJfY2hlY2siLCJjb250YWlucyIsImhhbWJ1cmdlcl93YXRjaGVyIiwic3RhdHVzIiwib2xkX3N0YXR1cyIsImFjdGl2ZV9jbGFzcyIsIm1vZGFsX3N0YXR1cyIsImxvYWRlciIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmQiLCJtb2RhbF93aW5kb3ciLCJhZGRNb2RhbCIsIm92ZXJsYXkiLCJjb250ZW50IiwibW9kYWxXYXRjaGVyIiwibW9kYWxfY2hlY2siLCJtb2RhbF9odG1sIiwiaW5uZXJIVE1MIiwiaW1nX2FyciIsInNyYyIsInJhZGlvX2J0bnMiLCJidG5zIiwicmFkaW8iLCJyb3V0ZXNfYnRuIiwiZGF0YXNldCIsInJvdXQiLCJjaGVja19yb3V0ZXIiLCJoYXNoIiwibmF2X2xpc3QiLCJuYXYiLCJlbF9oYXNoIiwiZ2V0QXR0cmlidXRlIiwic2VsZWN0X2J0biIsInNlbGVjdCIsInByZXZpZXciLCJsaW5rcyIsInNpZ25faW4iLCJzaWduX3VwIiwibG9nX29mZiIsImNsZWFyIiwiY29pbl9ibG9jayIsInRleHRDb250ZW50Iiwic2VuZF9pbWFnZSIsImxvZ2luIiwic2NyZWVuIiwid2lkdGgiLCJzbGlkZXJzIiwidHJhY2siLCJzbGlkZXMiLCJzbGlkZSIsIlNwbGlkZSIsIm1vdW50IiwiZl90YWJzIiwidGFicyIsInJlbV9jbGFzc2VzIiwiZWxlbXMiLCJhY3RpdmUiLCJ0YWJzX2VsZW1zIiwiaW5kZXgiLCJ0ZXh0IiwidGFic190aXRsZSIsImFkZF9jb250ZW50IiwiY29udGVudF9uYW1lIiwidGFic19jb250IiwidXBkYXRlX2ltZyIsImlucF9pbWciLCJibG9jayIsIm9uY2hhbmdlIiwiZ2V0QmFzZTY0IiwiZmlsZXMiLCJpbWdfcHJldmlldyIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwicmVhZEFzRGF0YVVSTCIsIm9ubG9hZCIsInJlc3VsdCIsInNwbGl0Iiwib25lcnJvciIsImVycm9yIiwiaW1nIiwiZXZlbnQiLCJ0YXJnZXQiLCJyZW1vdmVfYnRuIiwicGFyZW50Tm9kZSIsImhlYWRlcl9maXgiLCJvbnNjcm9sbCIsInNob3dIZWFkZXIiLCJwYWdlWU9mZnNldCIsIm1ldGhvZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwicmVzcG9uc2VUeXBlIiwic2V0UmVxdWVzdEhlYWRlciIsInJlc3BvbnNlIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQSxJQUFNQSxPQUFPLGtDQUFiO0FBQ0EsSUFBTUMsTUFBTSxHQUFHO0FBQ2RDLEVBQUFBLElBQUksRUFBRSxHQURRO0FBRWRDLEVBQUFBLEtBQUssRUFBRSxRQUZPO0FBR2RDLEVBQUFBLE1BQU0sRUFBRSxTQUhNO0FBSWRDLEVBQUFBLE9BQU8sRUFBRSxVQUpLO0FBS2RDLEVBQUFBLFFBQVEsRUFBRSxXQUxJO0FBTWRDLEVBQUFBLE9BQU8sRUFBRTtBQU5LLENBQWY7QUFTQSxJQUFJQyxXQUFXLEdBQUcsSUFBbEI7QUFDQSxJQUFJQyxXQUFXLEdBQUcsd0JBQWxCO0FBQ0EsSUFBTUMsRUFBRSxHQUFHQyxNQUFNLENBQUNDLFlBQWxCO0FBQ0EsSUFBTUMsS0FBSyxHQUFHSCxFQUFFLENBQUNJLE9BQUgsQ0FBVyxlQUFYLENBQWQ7QUFDQSxJQUFNQyxRQUFRLEdBQUdMLEVBQUUsQ0FBQ0ksT0FBSCxDQUFXLGNBQVgsQ0FBakI7QUFDQSxJQUFNRSxLQUFLLEdBQUdOLEVBQUUsQ0FBQ0ksT0FBSCxDQUFXLGVBQVgsQ0FBZDtBQUlBRyxPQUFPLENBQUNDLEdBQVIsQ0FBWSxRQUFaO0FBRUFELE9BQU8sQ0FBQ0MsR0FBUiw0QkFBZ0NQLE1BQU0sQ0FBQ1EsUUFBUCxDQUFnQkMsUUFBaEQ7O0FBRUEsSUFBR1QsTUFBTSxDQUFDUSxRQUFQLENBQWdCQyxRQUFoQixJQUE0QixRQUEvQixFQUF5QztBQUN4Q1QsRUFBQUEsTUFBTSxDQUFDUSxRQUFQLENB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aWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGNvbnN0IGJhc2VVUkwgPSBgaHR0cDovLzEzNi4yNDQuOTYuMjAxOjEwMTAxL3YxYDtcclxuY29uc3QgYmFzZVVSTCA9IGBodHRwOi8vMTQ5LjI4LjE1My40NjoxMDEwMS92MWA7XHJcbmNvbnN0IHJvdXRlcyA9IHtcclxuXHRob21lOiAnLycsXHJcblx0YWJvdXQ6ICcvYWJvdXQnLFxyXG5cdGNyZWF0ZTogJy9jcmVhdGUnLFxyXG5cdGRlcG9zaXQ6ICcvZGVwb3NpdCcsXHJcblx0bXlQaG90b3M6ICcvbXlQaG90b3MnLFxyXG5cdHBheWluZm86ICcvcGF5aW5mbydcclxufVxyXG5cclxudmFyIGltZ19iYXNlXzY0ID0gbnVsbDtcclxudmFyIGJhc2U2NF90ZXh0ID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwnO1xyXG5jb25zdCBscyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcbmNvbnN0IHRva2VuID0gbHMuZ2V0SXRlbSgnYWlfbnVkZV90b2tlbicpO1xyXG5jb25zdCB1c2VybmFtZSA9IGxzLmdldEl0ZW0oJ2FpX251ZGVfbmFtZScpO1xyXG5jb25zdCBjb2lucyA9IGxzLmdldEl0ZW0oJ2FpX251ZGVfY29pbnMnKTtcclxuXHJcblxyXG5cclxuY29uc29sZS5sb2coJ3Rlc3RfMScpO1xyXG5cclxuY29uc29sZS5sb2coYGJlZm9yZSBwcm90b2NvbDogJHt3aW5kb3cubG9jYXRpb24ucHJvdG9jb2x9YCk7XHJcblxyXG5pZih3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT0gJ2h0dHBzOicpIHtcclxuXHR3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPSAnaHR0cDonO1xyXG5cdGNvbnNvbGUubG9nKCdjaGFuZ2UnKTtcclxuXHRjb25zb2xlLmxvZyh3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wpO1xyXG59ZWxzZXtcclxuXHRjb25zb2xlLmxvZygnbm9ybWFsJyk7XHJcblx0Y29uc29sZS5sb2cod2luZG93LmxvY2F0aW9uLnByb3RvY29sKTtcclxufVxyXG5cclxuY29uc29sZS5sb2coYGFmdGVyIHByb3RvY29sOiAke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH1gKTtcclxuIiwiZnVuY3Rpb24gR0VUX2ltYWdlcygpe1xyXG5cdGxldCB1cmwgPSBgJHtiYXNlVVJMfS9pbWFnZXMvbGlzdGA7XHJcblxyXG5cdHNlbmRSZXF1ZXN0KCdHRVQnLCB1cmwsIG51bGwsIHRva2VuKVxyXG5cdFx0LnRoZW4ocmVzID0+IHtcclxuXHRcdFx0YWRkSW1hZ2VzVG9Db2xsZWN0aW9uKHJlcyk7XHJcblx0XHRcdG1vZGFsX2ltYWdlKCk7XHJcblx0XHR9KVxyXG5cdFx0LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxyXG5cclxufVxyXG5cclxuY29uc3QgbXlQaG90b3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc19teS1waG90b3MnKTtcclxuaWYobXlQaG90b3MpIEdFVF9pbWFnZXMoKTtcclxuIiwiZnVuY3Rpb24gR0VUX2ltZ1N0YXR1cyhpbWFnZV9pZCl7XHJcblxyXG5cdGxldCB1cmwgPSBgJHtiYXNlVVJMfS9pbWFnZXMvY2hlY2s/aW1hZ2VfaWQ9JHtpbWFnZV9pZH1gXHJcblxyXG5cdGNvbnN0IGNoZWNrX2ltYWdlX3N0YXR1cyA9IHNldEludGVydmFsKCgpPT57XHJcblxyXG5cdFx0c2VuZFJlcXVlc3QoJ0dFVCcsIHVybCwgbnVsbCwgdG9rZW4pXHJcblx0XHRcdC50aGVuKHJlcz0+e1xyXG5cdFx0XHRcdGlmKHJlcy5zdGF0ZSAhPSAwKXtpZihteVBob3RvcykgR0VUX2ltYWdlcygpO1xyXG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChjaGVja19pbWFnZV9zdGF0dXMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0pXHJcblx0XHRcdC5jYXRjaChlcnI9PmNvbnNvbGUubG9nKGVycikpXHJcblx0fSwxMDAwMClcclxufVxyXG4iLCJmdW5jdGlvbiBHRVRfcGF5KGNhc2gpe1xyXG5cdGxldCBwYWdlX2JhY2sgPSBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufSR7cm91dGVzLnBheWluZm99YDtcclxuXHRsZXQgdXJsID0gYCR7YmFzZVVSTH0vcGF5bWVudHMvY3JlYXRlP3BheW1lbnRfdHlwZT0xJnBheW1lbnRfYW1vdW50PSR7Y2FzaH0mc3VjY2Vzc2Z1bGw9JHtwYWdlX2JhY2t9YDtcclxuXHJcblx0c2VuZFJlcXVlc3QoJ0dFVCcsIHVybCwgbnVsbCwgdG9rZW4pXHJcblx0XHQudGhlbihyZXM9PiB7XHJcblx0XHRcdGNoZWNrX2NvaW5zKCk7XHJcblx0XHRcdGNvbnN0IHBheV9saW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BheS1saW5rJyk7XHJcblx0XHRcdHBheV9saW5rLmhyZWYgPSByZXMubGluaztcclxuXHRcdFx0cGF5X2xpbmsuY2xpY2soKTtcclxuXHJcblx0XHR9KVxyXG5cdFx0LmNhdGNoKGVycj0+IGNvbnNvbGUubG9nKGVycikpXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBwYXlfYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBheS1idG4nKTtcclxuaWYocGF5X2J0bil7XHJcblx0Y29uc3QgcG9pbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvaW50cycpO1xyXG5cdGNvbnN0IGlucHMgPSBwb2ludHMucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJyk7XHJcblxyXG5cdHBheV9idG4ub25jbGljayA9IChlKT0+e1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0aW5wcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcblx0XHRcdGlmKGl0ZW0uY2hlY2tlZCkgR0VUX3BheShpdGVtLnZhbHVlKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG4iLCJmdW5jdGlvbiBHRVRfdXNlckluZm8oKXtcclxuXHRsZXQgdXJsID0gYCR7YmFzZVVSTH0vdXNlci9pbmZvYDtcclxuXHJcblx0c2VuZFJlcXVlc3QoJ0dFVCcsIHVybCwgbnVsbCwgdG9rZW4pXHJcblx0XHQudGhlbihyZXM9PntcclxuXHRcdFx0bHMuc2V0SXRlbSgnYWlfbnVkZV9jb2lucycsIGAke3Jlcy51c2VyV2FsbGV0fWApO1xyXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX292ZXJsYXknKS5jbGljaygpO1xyXG5cdFx0XHRhdXRoX3NlbGVjdCgpO1xyXG5cdFx0XHRjb2luc191cGRhdGUocmVzLnVzZXJXYWxsZXQpO1xyXG5cdFx0fSlcclxuXHRcdC5jYXRjaChlcnI9PmNvbnNvbGUubG9nKGVycikpXHJcbn1cclxuXHJcbmlmKHRva2VuICYmIHVzZXJuYW1lKXtcclxuXHRHRVRfdXNlckluZm8oKTtcclxufVxyXG4iLCJmdW5jdGlvbiBsc19kYXRhX3VzZXIoX3VzZXJuYW1lLCBfdG9rZW4sIF9jb2lucyl7XHJcblx0bHMuc2V0SXRlbSgnYWlfbnVkZV9uYW1lJywgX3VzZXJuYW1lKTtcclxuXHRscy5zZXRJdGVtKCdhaV9udWRlX3Rva2VuJywgX3Rva2VuKTtcclxuXHRscy5zZXRJdGVtKCdhaV9udWRlX2NvaW5zJywgX2NvaW5zKTtcclxufVxyXG4iLCJmdW5jdGlvbiBQT1NUX2F1dGgoYm9keSl7XHJcblx0c3RhcnRfbG9hZGVyKCk7XHJcblxyXG5cdGxldCB1cmwgPSBgJHtiYXNlVVJMfS91c2VyL2F1dGhgO1xyXG5cclxuXHRzZW5kUmVxdWVzdCgnUE9TVCcsIHVybCwgYm9keSlcclxuXHRcdC50aGVuKHJlcz0+e1xyXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX292ZXJsYXknKS5jbGljaygpO1xyXG5cdFx0XHRsc19kYXRhX3VzZXIocmVzLnVzZXJOYW1lLCByZXMuYXV0aFRva2VuLCByZXMud2FsbGV0KTtcclxuXHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHRcdHJlbW92ZV9sb2FkZXIoKTtcclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyPT57XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdHJlbW92ZV9sb2FkZXIoKTtcclxuXHRcdH0pXHJcbn1cclxuIiwiZnVuY3Rpb24gUE9TVF9pbWFnZSgpe1xyXG5cdHN0YXJ0X2xvYWRlcigpO1xyXG5cdGxldCB1cmwgPSBgJHtiYXNlVVJMfS9pbWFnZXMvbmV3YDtcclxuXHJcblx0bGV0IGJvZHkgPSB7XHJcblx0XHRpbWFnZUJhc2U2NDogaW1nX2Jhc2VfNjRbMF1cclxuXHR9XHJcblxyXG5cdHNlbmRSZXF1ZXN0KCdQT1NUJywgdXJsLCBib2R5LCB0b2tlbilcclxuXHRcdC50aGVuKHJlcyA9PiB7XHJcblx0XHRcdHJlbW92ZV9sb2FkZXIoKTtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID0gcm91dGVzLm15UGhvdG9zO1xyXG5cdFx0XHRHRVRfdXNlckluZm8oKTtcclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyID0+IHtcclxuXHRcdFx0cmVtb3ZlX2xvYWRlcigpO1xyXG5cdFx0XHRpZihlcnIuY29kZSA9PSAyKXtcclxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPSByb3V0ZXMuZGVwb3NpdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0fSlcclxuXHJcbn1cclxuIiwiZnVuY3Rpb24gUE9TVF9yZWdpc3RyYXRpb24oYm9keSl7XHJcblx0c3RhcnRfbG9hZGVyKCk7XHJcblx0bGV0IHVybCA9IGAke2Jhc2VVUkx9L3VzZXIvcmVnaXN0cmF0aW9uYDtcclxuXHJcblxyXG5cdHNlbmRSZXF1ZXN0KCdQT1NUJywgdXJsLCBib2R5KVxyXG5cdFx0LnRoZW4ocmVzPT57XHJcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fb3ZlcmxheScpLmNsaWNrKCk7XHJcblx0XHRcdGxzX2RhdGFfdXNlcihyZXMudXNlck5hbWUsIHJlcy5hdXRoVG9rZW4sIHJlcy53YWxsZXQpO1xyXG5cdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdFx0cmVtb3ZlX2xvYWRlcigpO1xyXG5cdFx0fSlcclxuXHRcdC5jYXRjaChlcnI9PntcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0cmVtb3ZlX2xvYWRlcigpO1xyXG5cdFx0fSlcclxufVxyXG4iLCJmdW5jdGlvbiBhZGRJbWFnZXNUb0NvbGxlY3Rpb24ocmVzKXtcclxuXHRjb25zdCBzZWMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc19teS1waG90b3MnKVxyXG5cdGlmKHNlYyl7XHJcblx0XHRjb25zdCBsaXN0ID0gc2VjLnF1ZXJ5U2VsZWN0b3IoJy5teS1waG90b3NfX2xpc3QnKTtcclxuXHRcdGNvbnN0IG9sZF9lbGVtcyA9IGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm15LXBob3Rvc19fZWwnKTtcclxuXHJcblxyXG5cdFx0XHRvbGRfZWxlbXMuZm9yRWFjaCgoZWwsIGkpID0+IHtcclxuXHRcdFx0XHRpZihlbC5pZCAhPSAnbXlQaG90b3NfZWwtZmlyc3QnKSBlbC5yZW1vdmUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG5cdFx0XHRcdC8vIEdFVF9pbWdTdGF0dXMoaXRlbS4pXHJcblx0XHRcdFx0bGV0IGZpcnN0ID0gYGA7XHJcblx0XHRcdFx0aWYoaXRlbS5zdGF0ZSA9PSAxKSBmaXJzdCA9IGA8bGkgY2xhc3M9XCJteS1waG90b3NfX2VsIF9zdWNjZXNzXCI+YDtcclxuXHRcdFx0XHRpZihpdGVtLnN0YXRlID09IDIpIGZpcnN0ID0gYDxsaSBjbGFzcz1cIm15LXBob3Rvc19fZWwgX2Vycm9yXCI+YDtcclxuXHRcdFx0XHRpZihpdGVtLnN0YXRlID09IDApIHtmaXJzdCA9IGA8bGkgY2xhc3M9XCJteS1waG90b3NfX2VsIF9sb2FkXCI+YDtcclxuXHRcdFx0XHRcdEdFVF9pbWdTdGF0dXMoaXRlbS5pbWFnZUlkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IGVuZCA9ICc8L2xpPidcclxuXHRcdFx0XHRsZXQgaHRtbCA9IGAke2ZpcnN0fVxyXG5cdFx0ICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm15LXBob3Rvc19fbm90LXByb2Nlc3NlZFwiPlxyXG5cdFx0ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibXktcGhvdG9zX19pbWdcIj5cclxuXHRcdCAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwibXktcGhvdG9zX19wcmV2aWV3XCIgc3JjPVwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7aXRlbS5iZWZvcmVCYXNlNjR9XCIvPlxyXG5cdFx0ICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdCAgICAgICAgICAgICAgICAgIDwvZGl2PjxpbWcgY2xhc3M9XCJteS1waG90b3NfX2Fycm93XCIgc3JjPVwiLi9hc3NldHMvaW1hZ2VzL2ljb25zL2Fycm93LnN2Z1wiPlxyXG5cdFx0ICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm15LXBob3Rvc19fcHJvY2Vzc2VkXCI+XHJcblx0XHQgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJteS1waG90b3NfX2ltZ1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgY2xhc3M9XCJteS1waG90b3NfX3ByZXZpZXdcIiBzcmM9XCJkYXRhOmltYWdlL3BuZztiYXNlNjQsJHtpdGVtLmFmdGVyQmFzZTY0fVwiLz5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIGNsYXNzPVwibXktcGhvdG9zX19pbWdfZXJyb3JcIiBzcmM9XCIuL2Fzc2V0cy9pbWFnZXMvd2FybmluZy5wbmdcIj48aW1nIGNsYXNzPVwibXktcGhvdG9zX19pbWdfbG9hZFwiIHNyYz1cIi4vYXNzZXRzL2ltYWdlcy9sb2FkLnBuZ1wiPlxyXG5cdFx0ICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdCAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0ICAgICAgICAgICAgICAgICR7ZW5kfWBcclxuXHJcblx0XHRcdFx0bGlzdC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cclxuXHR9XHJcblxyXG59XHJcbiIsImNvbnN0IGF1dG9yaXphdGlvbl9tb2RhbCA9IGBcclxuXHQ8ZGl2IGNsYXNzPVwiYXV0aG9yaXphdGlvblwiPlxyXG5cdFx0PGZvcm0gYXV0b2NvbXBsZXRlPVwib2ZmXCIgY2xhc3M9XCJhdXRob3JpemF0aW9uX19mb3JtXCI+XHJcblxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiYXV0aG9yaXphdGlvbl9fYmxvY2tcIj5cclxuXHRcdFx0IFx0PGEgY2xhc3M9XCJhdXRob3JpemF0aW9uX19iYWNrXCI+PC9hPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJidG4gYXV0aG9yaXphdGlvbl9fY2hhbmdlXCI+PHNwYW4+PC9zcGFuPjwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImF1dGhvcml6YXRpb25fX2Jsb2NrXCI+XHJcblx0XHRcdFx0PGltZyBjbGFzcz1cImF1dGhvcml6YXRpb25fX2xvZ29cIiBzcmM9XCIuL2Fzc2V0cy9pbWFnZXMvaWNvbnMvTE9HTy5zdmdcIi8+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJ0ZXh0XCI+U2lnbiBpbiB0byBjb250aW51ZTwvcD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJhdXRob3JpemF0aW9uX19ibG9ja1wiPlxyXG5cdFx0XHRcdDxpbnB1dCByZXF1aXJlZCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgcGxhY2Vob2xkZXI9XCJFbnRlciB1c2VybmFtZVwiIGNsYXNzPVwiaW5wXCIvPlxyXG5cdFx0XHRcdDxpbnB1dCByZXF1aXJlZCB0eXBlPVwicGFzc3dvcmRcIiBuYW1lPVwicGFzc1wiIHBsYWNlaG9sZGVyPVwiRW50ZXIgcGFzc3dvcmRcIiBjbGFzcz1cImlucFwiLz5cclxuXHRcdFx0XHQ8YSBocmVmPVwiI1wiIGNsYXNzPVwiYXV0aG9yaXphdGlvbl9fZm9yZ290XCI+Rm9yZ290IHBhc3N3b3JkPC9hPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImF1dGhvcml6YXRpb25fX2Jsb2NrXCI+XHJcblx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic2VuZFwiIGlkPVwic2VuZF9zaWduX2luXCIgY2xhc3M9XCJidG4gX29yYW5nZSBhdXRob3JpemF0aW9uX19zaW5nLWluXCI+U2lnbiBpbjwvYnV0dG9uPlxyXG5cdFx0XHRcdDxidXR0b24gdHlwZT1cInNlbmRcIiBpZD1cInNlbmRfc2lnbl91cFwiIGNsYXNzPVwiYnRuIGF1dGhvcml6YXRpb25fX3NpbmctdXBcIj5TaWduIHVwPC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0PC9mb3JtPlxyXG5cdDwvZGl2PlxyXG5gXHJcblxyXG5cclxuZnVuY3Rpb24gYXV0aG9yaXphdGlvbih2YWx1ZSl7XHJcblx0Y29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwnKTtcclxuXHRjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmF1dGhvcml6YXRpb25fX2Zvcm0nKTtcclxuXHRjb25zdCBidG5fcmVtb3ZlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuYXV0aG9yaXphdGlvbl9fYmFjaycpO1xyXG5cdGNvbnN0IGJ0bl9jaGFuZ2UgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5hdXRob3JpemF0aW9uX19jaGFuZ2UnKTtcclxuXHRjb25zdCBpbnBfbmFtZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cIm5hbWVcIl0nKTtcclxuXHRjb25zdCBpbnBfcGFzcyA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInBhc3NcIl0nKTtcclxuXHRjb25zdCBidG5fc2lnbkluID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcjc2VuZF9zaWduX2luJyk7XHJcblx0Y29uc3QgYnRuX3NpZ25VcCA9IGZvcm0ucXVlcnlTZWxlY3RvcignI3NlbmRfc2lnbl91cCcpO1xyXG5cclxuXHRmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKT0+e2UucHJldmVudERlZmF1bHQoKX0pXHJcblxyXG5cdGlmKHZhbHVlID09ICdzaWduX2luJyl7XHJcblx0XHRmb3JtLmNsYXNzTGlzdC5hZGQoJ19zaW5nJyk7XHJcblx0fVxyXG5cclxuXHRidG5fcmVtb3ZlLm9uY2xpY2sgPSAoKT0+IG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ19hY3RpdmUnKTtcclxuXHRidG5fY2hhbmdlLm9uY2xpY2sgPSAoKT0+e2Zvcm0uY2xhc3NMaXN0LnRvZ2dsZSgnX3NpbmcnKTt9O1xyXG5cclxuXHJcblx0YnRuX3NpZ25VcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XHJcblx0XHRpZihpbnBfbmFtZS52YWx1ZS5sZW5ndGggJiYgaW5wX3Bhc3MudmFsdWUubGVuZ3RoKXtcclxuXHRcdFx0bGV0IGJvZHkgPSB7XHJcblx0XHRcdFx0dXNlck5hbWU6IGlucF9uYW1lLnZhbHVlLFxyXG5cdFx0XHRcdHVzZXJQYXNzd29yZDogaW5wX3Bhc3MudmFsdWVcclxuXHRcdFx0fTtcclxuXHRcdFx0UE9TVF9yZWdpc3RyYXRpb24oYm9keSk7XHJcblxyXG5cdFx0XHRpbnBfbmFtZS52YWx1ZSA9ICcnO1xyXG5cdFx0XHRpbnBfcGFzcy52YWx1ZSA9ICcnO1xyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5cdGJ0bl9zaWduSW4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xyXG5cdFx0aWYoaW5wX25hbWUudmFsdWUubGVuZ3RoICYmIGlucF9wYXNzLnZhbHVlLmxlbmd0aCl7XHJcblx0XHRcdGxldCBib2R5ID0ge1xyXG5cdFx0XHRcdHVzZXJOYW1lOiBpbnBfbmFtZS52YWx1ZSxcclxuXHRcdFx0XHR1c2VyUGFzc3dvcmQ6IGlucF9wYXNzLnZhbHVlXHJcblx0XHRcdH07XHJcblx0XHRcdFBPU1RfYXV0aChib2R5KTtcclxuXHJcblx0XHRcdGlucF9uYW1lLnZhbHVlID0gJyc7XHJcblx0XHRcdGlucF9wYXNzLnZhbHVlID0gJyc7XHJcblx0XHR9XHJcblx0fSlcclxufVxyXG4iLCIgZnVuY3Rpb24gY2hlY2tfY29pbnMoKXtcclxuICAgY29uc3QgY2hlY2sgPSBzZXRJbnRlcnZhbCgoKT0+e1xyXG4gICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfS91c2VyL2luZm9gO1xyXG4gICAgIHNlbmRSZXF1ZXN0KCdHRVQnLCB1cmwsIG51bGwsIHRva2VuKVxyXG4gICAgICAgLnRoZW4ocmVzPT57XHJcbiAgICAgICAgIGlmKHJlcy51c2VyV2FsbGV0ICE9IGNvaW5zKXtcclxuICAgICAgICAgICBscy5zZXRJdGVtKCdhaV9udWRlX2NvaW5zJywgYCR7cmVzLnVzZXJXYWxsZXR9YCk7XHJcbiAgICAgICAgICAgYXV0aF9zZWxlY3QoKTtcclxuICAgICAgICAgICBjbGVhckludGVydmFsKGNoZWNrKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgfSlcclxuICAgICAgIC5jYXRjaChlcnI9PmNvbnNvbGUubG9nKGVycikpXHJcbiAgIH0sIDEwMDAwKVxyXG4gfVxyXG4iLCJcclxuZnVuY3Rpb24gaGFtYnVyZ2VyKCkge1xyXG4gIHZhciBoYW1idXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGFtYnVyZ2VyJyk7XHJcbiAgdmFyIGhhbWJ1cmdlcl9tZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYmxvY2snKTtcclxuICB2YXIgbGlua19lbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXZfX2xpbmsnKTtcclxuICB2YXIgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpO1xyXG5cclxuICB2YXIgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuXHJcbiAgaGFtYnVyZ2VyLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnX2FjdGl2ZScpO1xyXG5cdFx0aGFtYnVyZ2VyX2NoZWNrKCk7XHJcbiAgfTtcclxuXHJcblx0bGlua19lbGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpKSB7XHJcblx0XHRpdGVtLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGhhbWJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKFwiX2FjdGl2ZVwiKTtcclxuXHRcdFx0aGFtYnVyZ2VyX2NoZWNrKCk7XHJcblx0XHR9O1xyXG5cdH0pO1xyXG5cclxuXHRoYW1idXJnZXJfY2hlY2soKTtcclxuXHJcblx0Ly8gZnVuY3Rpb3NfX19fX19fX19fX19cclxuXHJcbiAgZnVuY3Rpb24gaGFtYnVyZ2VyX2NoZWNrKCl7XHJcbiAgICBpZihoYW1idXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwiX2FjdGl2ZVwiKSkge1xyXG4gICAgICBoYW1idXJnZXJfbWVudS5jbGFzc0xpc3QuYWRkKCdoYW1idXJnZXItbWVudV9hY3RpdmUnKTtcclxuICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCdfbm9TY3JvbGwnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGhhbWJ1cmdlcl9tZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2hhbWJ1cmdlci1tZW51X2FjdGl2ZScpO1xyXG4gICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ19ub1Njcm9sbCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblx0ZnVuY3Rpb24gaGFtYnVyZ2VyX3dhdGNoZXIoKXtcclxuXHRcdGxldCBoYW1idXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGFtYnVyZ2VyJyk7XHJcblx0XHR2YXIgc3RhdHVzID0gdHJ1ZTtcclxuXHRcdHZhciBvbGRfc3RhdHVzID0gc3RhdHVzO1xyXG5cclxuXHRcdHNldEludGVydmFsKCgpPT57XHJcblx0XHRcdGxldCBhY3RpdmVfY2xhc3MgPSBoYW1idXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdfYWN0aXZlJyk7XHJcblx0XHRcdGlmKGFjdGl2ZV9jbGFzcykgc3RhdHVzID0gdHJ1ZTtcclxuXHRcdFx0aWYoIWFjdGl2ZV9jbGFzcykgc3RhdHVzID0gZmFsc2U7XHJcblxyXG5cdFx0XHRpZihzdGF0dXMgIT0gb2xkX3N0YXR1cyl7XHJcblx0XHRcdFx0aGFtYnVyZ2VyX2NoZWNrKCk7XHJcblx0XHRcdFx0b2xkX3N0YXR1cyA9IG1vZGFsX3N0YXR1cztcclxuXHRcdFx0fVxyXG5cdFx0fSwxMDApO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbmhhbWJ1cmdlcigpO1xyXG4iLCJmdW5jdGlvbiBzdGFydF9sb2FkZXIoKXtcclxuXHRjb25zdCBsb2FkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRsb2FkZXIuY2xhc3NMaXN0LmFkZCgnbG9hZGVyJyk7XHJcblx0bG9hZGVyLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgYDxkaXYgaWQ9XCJlc2NhcGluZ0JhbGxHXCI+XHJcblx0PGRpdiBpZD1cImVzY2FwaW5nQmFsbF8xXCIgY2xhc3M9XCJlc2NhcGluZ0JhbGxHXCI+PC9kaXY+XHJcbjwvZGl2PmApXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmQobG9hZGVyKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZV9sb2FkZXIoKXtcclxuXHRjb25zdCBsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyJyk7XHJcblx0aWYobG9hZGVyKSBsb2FkZXIucmVtb3ZlKCk7XHJcbn1cclxuIiwiXHJcbi8vIG1vZGFsX3dpbmRvd1xyXG5cclxuZnVuY3Rpb24gbW9kYWxfd2luZG93KCkge1xyXG5cdGFkZE1vZGFsKCk7XHJcblx0Y29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwnKTtcclxuXHRjb25zdCBvdmVybGF5ID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsX19vdmVybGF5Jyk7XHJcblx0Y29uc3QgY29udGVudCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY29udGVudCcpO1xyXG5cdGNvbnN0IGJ0bl9yZW1vdmUgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX3JlbW92ZScpO1xyXG5cdGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcblxyXG5cdG92ZXJsYXkub25jbGljayA9ICgpPT4gcmVtb3ZlKCk7XHJcblx0YnRuX3JlbW92ZS5vbmNsaWNrID0gKCk9PiByZW1vdmUoKTtcclxuXHJcblx0bW9kYWxXYXRjaGVyKCk7XHJcblx0bW9kYWxfY2hlY2soKTtcclxuXHQvLyBmdW5jdGlvc19fX19fX19fX19fX1xyXG5cdGZ1bmN0aW9uIG1vZGFsX2NoZWNrKCl7XHJcblx0XHRsZXQgYWN0aXZlX2NsYXNzID0gbW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdfYWN0aXZlJyk7XHJcblx0XHRpZihhY3RpdmVfY2xhc3Mpe1xyXG5cdFx0XHRib2R5LmNsYXNzTGlzdC5hZGQoJ19ub1Njcm9sbCcpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnX25vU2Nyb2xsJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIHJlbW92ZSgpe1xyXG5cdFx0aWYobW9kYWwpe1xyXG5cdFx0XHRtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdfYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGFkZE1vZGFsKCl7XHJcblx0XHRjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cdFx0Y29uc3QgbW9kYWxfaHRtbCA9IGBcclxuXHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsXCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsX19yZW1vdmVcIj7DlzwvZGl2PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbF9fb3ZlcmxheVwiPjwvZGl2PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbF9fY29udGVudFwiPjwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdGA7XHJcblxyXG5cdFx0Ym9keS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZUVuZCcsIG1vZGFsX2h0bWwpO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBtb2RhbFdhdGNoZXIoKXtcclxuXHRcdGxldCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbCcpO1xyXG5cdFx0dmFyIG1vZGFsX3N0YXR1cyA9IHRydWU7XHJcblx0XHR2YXIgb2xkX3N0YXR1cyA9IG1vZGFsX3N0YXR1cztcclxuXHJcblx0XHRzZXRJbnRlcnZhbCgoKT0+e1xyXG5cdFx0XHRsZXQgYWN0aXZlX2NsYXNzID0gbW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdfYWN0aXZlJyk7XHJcblx0XHRcdGlmKGFjdGl2ZV9jbGFzcykgbW9kYWxfc3RhdHVzID0gdHJ1ZTtcclxuXHRcdFx0aWYoIWFjdGl2ZV9jbGFzcykgbW9kYWxfc3RhdHVzID0gZmFsc2U7XHJcblxyXG5cdFx0XHRpZihtb2RhbF9zdGF0dXMgIT0gb2xkX3N0YXR1cyl7XHJcblx0XHRcdFx0bW9kYWxfY2hlY2soKTtcclxuXHRcdFx0XHRvbGRfc3RhdHVzID0gbW9kYWxfc3RhdHVzO1xyXG5cdFx0XHR9XHJcblx0XHR9LDEwMCk7XHJcblxyXG5cdH1cclxufVxyXG5tb2RhbF93aW5kb3coKTtcclxuXHJcbmZ1bmN0aW9uIG1vZGFsKGh0bWw9Jycpe1xyXG5cdGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsJyk7XHJcblx0bW9kYWwuY2xhc3NMaXN0LmFkZCgnX2FjdGl2ZScpO1xyXG5cclxuXHRpZihtb2RhbCl7XHJcblx0XHRjb25zdCBjb250ZW50ID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsX19jb250ZW50Jyk7XHJcblx0XHRjb250ZW50LmlubmVySFRNTCA9IGh0bWw7XHJcblx0fVxyXG59XHJcbiIsImZ1bmN0aW9uIG1vZGFsX2ltYWdlKCl7XHJcblx0Y29uc3Qgc2VjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNfbXktcGhvdG9zJyk7XHJcblxyXG5cdGlmKHNlYyl7XHJcblx0XHRjb25zdCBpbWdfYXJyID0gc2VjLnF1ZXJ5U2VsZWN0b3JBbGwoJy5teS1waG90b3NfX3ByZXZpZXcnKTtcclxuXHJcblx0XHRpbWdfYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuXHRcdFx0aXRlbS5vbmNsaWNrID0gKCk9PntcclxuXHJcblx0XHRcdFx0bW9kYWwoYDxkaXYgY2xhc3M9XCJpbWctbW9kYWxcIj48aW1nIHNyYz1cIiR7aXRlbS5zcmN9XCIvPjwvZGl2PmApO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHJcblxyXG59XHJcbiIsIlxyXG5cclxuLy8gcmFkaW9fX2J0bnNcclxuZnVuY3Rpb24gcmFkaW9fYnRucygpe1xyXG5cdGNvbnN0IGJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9yZGVyLWJveCcpO1xyXG5cclxuXHRpZihidG5zKXtcclxuXHRcdGJ0bnMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG5cdFx0XHRsZXQgcmFkaW8gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xyXG5cdFx0XHRzZXRJbnRlcnZhbCgoKT0+e1xyXG5cdFx0XHRcdGlmKHJhZGlvLmNoZWNrZWQgJiYgIWl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdfYWN0aXZlJykpe1xyXG5cdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QuYWRkKCdfYWN0aXZlJylcclxuXHRcdFx0XHR9ZWxzZSBpZiAoIXJhZGlvLmNoZWNrZWQpIHtcclxuXHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnX2FjdGl2ZScpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LDEwMClcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbnJhZGlvX2J0bnMoKTtcclxuIiwiZnVuY3Rpb24gcm91dGVzX2J0bigpe1xyXG5cdGNvbnN0IHJvdXRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yb3V0Jyk7XHJcblxyXG5cclxuXHRyb3V0ZXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG5cdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9IGl0ZW0uZGF0YXNldC5yb3V0XHJcblx0XHR9KVxyXG5cdH0pO1xyXG5cclxufVxyXG5cclxucm91dGVzX2J0bigpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGNoZWNrX3JvdXRlcigpe1xyXG5cdGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcblx0Y29uc3QgbmF2X2xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmF2X19saW5rJyk7XHJcblxyXG5cdG5hdl9saXN0LmZvckVhY2goKGVsLCBpKSA9PiB7ZWwuY2xhc3NMaXN0LnJlbW92ZSgnX2FjdGl2ZScpfSk7XHJcblxyXG5cdG5hdl9saXN0LmZvckVhY2goKG5hdiwgaSkgPT4ge1xyXG5cdFx0Y29uc3QgZWxfaGFzaCA9IG5hdi5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcclxuXHRcdGlmKGVsX2hhc2ggPT0gaGFzaCl7XHJcblx0XHRcdG5hdi5jbGFzc0xpc3QuYWRkKCdfYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbmNoZWNrX3JvdXRlcigpO1xyXG4iLCJmdW5jdGlvbiBzZWxlY3RfYnRuKCl7XHJcblx0Y29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdCcpO1xyXG5cdGNvbnN0IHByZXZpZXcgPSBzZWxlY3QucXVlcnlTZWxlY3RvcignLnNlbGVjdF9fcHJldmlldycpO1xyXG5cdGNvbnN0IGxpbmtzID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWxlY3RfX2VsJyk7XHJcblx0Y29uc3Qgc2lnbl9pbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaWduX2luJyk7XHJcblx0Y29uc3Qgc2lnbl91cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaWduX3VwJyk7XHJcblx0Y29uc3QgbG9nX29mZiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2dfb2ZmJyk7XHJcblxyXG5cclxuXHRsb2dfb2ZmLm9uY2xpY2sgPSAoKT0+e1xyXG5cdFx0d2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG5cdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID0gJy8nO1xyXG5cdH1cclxuXHJcblx0c2lnbl9pbi5vbmNsaWNrID0gKCk9PntcclxuXHRcdG1vZGFsKGF1dG9yaXphdGlvbl9tb2RhbCk7XHJcblx0XHRhdXRob3JpemF0aW9uKCdzaWduX2luJyk7XHJcblx0fVxyXG5cclxuXHRzaWduX3VwLm9uY2xpY2sgPSAoKT0+e1xyXG5cdFx0bW9kYWwoYXV0b3JpemF0aW9uX21vZGFsKTtcclxuXHRcdGF1dGhvcml6YXRpb24oJ3NpZ25fdXAnKTtcclxuXHR9XHJcblxyXG5cclxuXHRsaW5rcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcblx0XHRpdGVtLm9uY2xpY2sgPSAoZSk9PntcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRjb25zb2xlLmxvZygnc3NzJyk7XHJcblx0XHRcdHNlbGVjdC5jbGFzc0xpc3QucmVtb3ZlKCdfYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdHNldEludGVydmFsKCgpPT57XHJcblx0XHRpZighc2VsZWN0LmNsYXNzTGlzdC5jb250YWlucygnX2xvZ2luJykpe1xyXG5cdFx0XHRwcmV2aWV3Lm9uY2xpY2sgPSAoKT0+e1x0c2VsZWN0LmNsYXNzTGlzdC50b2dnbGUoJ19hY3RpdmUnKTtcdH1cclxuXHRcdH1lbHNle1x0c2VsZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ19hY3RpdmUnKTt9XHJcblx0fSwxMDApXHJcbn1cclxuXHJcbnNlbGVjdF9idG4oKTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYXV0aF9zZWxlY3QoKXtcclxuXHRjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0Jyk7XHJcblx0Y29uc3QgY29pbl9ibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb2lucycpO1xyXG5cdGNvbnN0IF91c2VybmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1c2VybmFtZScpO1xyXG5cdGlmKHRva2VuICYmIHVzZXJuYW1lICYmIGNvaW5zKXtcclxuXHRcdHNlbGVjdC5jbGFzc0xpc3QucmVtb3ZlKCdfbG9naW4nKTtcclxuXHRcdGNvaW5fYmxvY2sudGV4dENvbnRlbnQgPSBjb2lucztcclxuXHRcdF91c2VybmFtZS50ZXh0Q29udGVudCA9IHVzZXJuYW1lO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNvaW5zX3VwZGF0ZSh2YWx1ZSl7XHJcblx0Y29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdCcpO1xyXG5cdGNvbnN0IGNvaW5fYmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29pbnMnKTtcclxuXHRpZih2YWx1ZSl7XHJcblx0XHRjb2luX2Jsb2NrLnRleHRDb250ZW50ID0gdmFsdWU7XHJcblx0fVxyXG59XHJcbiIsImZ1bmN0aW9uIHNlbmRfaW1hZ2UoKXtcclxuXHRjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNyZWF0ZS1mb3JtJyk7XHJcblx0Y29uc3QgbG9naW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2lnbl9pbicpO1xyXG5cdGlmKGZvcm0pe1xyXG5cdFx0Zm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSk9PntcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRpZih0b2tlbiAmJiB1c2VybmFtZSAmJiBjb2lucyl7XHJcblx0XHRcdFx0UE9TVF9pbWFnZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsb2dpbi5jbGljaygpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG59XHJcblxyXG5zZW5kX2ltYWdlKCk7XHJcbiIsIlxyXG5cclxuaWYoIHdpbmRvdy5zY3JlZW4ud2lkdGggPCA4MjApe1xyXG5cdGNvbnN0IHNsaWRlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ2FsbGVyeScpO1xyXG5cdHNsaWRlcnMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG5cdFx0bGV0IHRyYWNrID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZ2FsbGVyeV9fdHJhY2snKTtcclxuXHRcdGxldCBsaXN0ID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZ2FsbGVyeV9fbGlzdCcpO1xyXG5cdFx0bGV0IHNsaWRlcyA9IGl0ZW0ucXVlcnlTZWxlY3RvckFsbCgnLmdhbGxlcnlfX3NsaWRlJyk7XHJcblxyXG5cdFx0aXRlbS5jbGFzc0xpc3QuYWRkKCdzcGxpZGUnKTtcclxuXHRcdHRyYWNrLmNsYXNzTGlzdC5hZGQoJ3NwbGlkZV9fdHJhY2snKTtcclxuXHRcdGxpc3QuY2xhc3NMaXN0LmFkZCgnc3BsaWRlX19saXN0Jyk7XHJcblxyXG5cdFx0c2xpZGVzLmZvckVhY2goKHNsaWRlLCBpKSA9PiB7c2xpZGUuY2xhc3NMaXN0LmFkZCgnc3BsaWRlX19zbGlkZScpO1x0fSk7XHJcblxyXG5cclxuXHR9KTtcclxuXHJcblx0c2xpZGVycy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcblx0XHRuZXcgU3BsaWRlKGl0ZW0pLm1vdW50KClcclxuXHR9KTtcclxufVxyXG4iLCJcclxuXHJcbi8qX19fX19fX19fX19fdGFic19fX19fX18qL1xyXG5cclxuXHJcbmZ1bmN0aW9uIGZfdGFicygpe1xyXG5cdGNvbnN0IHRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFicycpO1xyXG5cclxuXHRpZih0YWJzKXtcclxuXHRcdGNvbnN0IHRhYnNfZWxlbXMgPSB0YWJzLnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWJzX190YWInKTtcclxuXHRcdGNvbnN0IHRhYnNfY29udCA9IHRhYnMucXVlcnlTZWxlY3RvcignLnRhYnNfX2NvbnRlbnQnKVxyXG5cdFx0Y29uc3QgdGFic190aXRsZSA9IHRhYnMucXVlcnlTZWxlY3RvcignLnRpdGxlJyk7XHJcblxyXG5cclxuXHRcdHZhciBjb250ZW50ID0ge1xyXG5cdFx0XHRcIl8xXCI6W1wiTGFzdCBtb2RpZmllZCBkYXRlOiBNYXkgMTcsIDIwMjFcIiwgXCJNRU1CRVJTSElQIEFORCBCSUxMSU5HLiBZb3UgaGVyZWJ5IGFncmVlIHRoYXQsIHVwb24gWW91ciBzdWJzY3JpcHRpb24gdG8gUGVyc29uZXJhLmNvbSwgZGVwZW5kaW5nIG9uIHRoZSBtZW1iZXJzaGlwIG9wdGlvbnMgWW91IGNob29zZSwgWW91IG1heSBiZSBzdWJqZWN0IHRvIGNlcnRhaW4gaW1tZWRpYXRlIGFuZCBhdXRvbWF0aWNhbGx5IHJlY3VycmluZyBjaGFyZ2VzIHdoaWNoIHNoYWxsIGJlIGJpbGxlZCB0byBZb3VyIGNyZWRpdCBjYXJkLCB1bmxlc3MgWW91IGNhbmNlbCBZb3VyIHN1YnNjcmlwdGlvbiB1bmRlciB0aGUgdGVybXMgYW5kIGNvbmRpdGlvbnMgb2YgdGhpcyBBZ3JlZW1lbnQuIFRoZSBjaGFyZ2VzLCBpZiBhbnksIHdoaWNoIFlvdSB3aWxsIGluY3VyLCBhbmQgaGVyZWJ5IGF1dGhvcml6ZSwgYXJlIGFzIGZvbGxvd3M6XCIsIFwiKGEpIFRyaWFsIFN1YnNjcmlwdGlvbnMuIFlvdSBtYXkgc3Vic2NyaWJlIHRvIHBlcnNvbmVyYS5jb20gZm9yIGEgc3BlY2lmaWMgcGVyaW9kIG9mIHRpbWUsIHVuZGVyIHRoZSB0aGVuIGN1cnJlbnQgYmlsbGluZyB0ZXJtcyAoYXMgc2V0IGZvcnRoIG9uIHRoZSBzaWduLXVwIHBhZ2Ugb2YgUGVyc29uZXJhLmNvbSkgKFRyaWFsIFN1YnNjcmlwdGlvbikuXCIsIFwiKGIpIEF1dG9tYXRpYyBSZW5ld2FsIG9mIFRyaWFsIFN1YnNjcmlwdGlvbiB0byBNb250aGx5IE1lbWJlcnNoaXAuIEFsbCBUcmlhbCBTdWJzY3JpcHRpb25zIHNoYWxsIHJlbmV3LCBhdXRvbWF0aWNhbGx5IGFuZCB3aXRob3V0IG5vdGljZSwgdG8gYSBNb250aGx5IE1lbWJlcnNoaXAuIFBhaWQgVHJpYWwgU3Vic2NyaXB0aW9ucyB3aWxsIHJlbmV3IG1vbnRobHkgYXQgdGhlIE1vbnRobHkgTWVtYmVyc2hpcCBSYXRlIHNlbGVjdGVkIGJ5IFlvdS5cIiwgXCIoYykgQXV0b21hdGljIFJlbmV3YWwgb2YgTW9udGhseSBNZW1iZXJzaGlwLiBBbGwgTW9udGhseSBNZW1iZXJzaGlwcyBzaGFsbCByZW5ldywgYXV0b21hdGljYWxseSBhbmQgd2l0aG91dCBub3RpY2UsIGZvciBzdWNjZXNzaXZlIHBlcmlvZHMgb2YgYXBwcm94aW1hdGVseSBvbmUgKDEpIG1vbnRoLCBjb21tZW5jaW5nIHVwb24gdGhlIGV4cGlyYXRpb24gb2YgdGhlIFRyaWFsIFN1YnNjcmlwdGlvbiwgYW5kIGNvbnRpbnVpbmcgdGhlcmVhZnRlciBmb3Igc3VjY2Vzc2l2ZSBwZXJpb2RzIG9mIGFwcHJveGltYXRlbHkgb25lICgxKSBtb250aCwgdW5sZXNzIGFuZCB1bnRpbCB0aGlzIEFncmVlbWVudCBpcyBjYW5jZWxlZCBieSBZb3Ugb3IgdGhlIENvbXBhbnkgaW4gYWNjb3JkYW5jZSB3aXRoIHRoZSB0ZXJtcyBoZXJlb2YuIEVhY2ggcGVyaW9kIG9mIGFwcHJveGltYXRlbHkgb25lICgxKSBtb250aCBzaGFsbCBiZSByZWZlcnJlZCB0byBhcyB0aGUgJ01vbnRobHkgU3Vic2NyaXB0aW9uIFBlcmlvZC4nXCIsIFwiKGQpIENhbmNlbGxhdGlvbiBieSBDb21wYW55LiBUaGUgQ29tcGFueSBtYXksIGF0IGFueSB0aW1lIGFuZCBhdCBpdHMgc29sZSBkaXNjcmV0aW9uLCBjYW5jZWwgYW55IFRyaWFsIE1lbWJlcnNoaXAgb3IgTW9udGhseSBNZW1iZXJzaGlwLlwiLCBcIihlKSBDYW5jZWxsYXRpb24gb2YgQXV0b21hdGljIFJlbmV3YWwgb2YgVHJpYWwgU3Vic2NyaXB0aW9uIHRvIE1vbnRobHkgTWVtYmVyc2hpcC4gVE8gQ0FOQ0VMIEFVVE9NQVRJQyBSRU5FV0FMIEFUIFRIRSBFTkQgT0YgVEhFIFRSSUFMIFNVQlNDUklQVElPTiwgWU9VIE1VU1QgTk9USUZZIFRIRSBDT01QQU5ZIFBSSU9SIFRPIFRIRSBFTkQgT0YgVEhFIFRSSUFMIFBFUklPRCwgQlkgQ09OVEFDVElORyBUSEUgQ09NUEFOWSBCWSBFLU1BSUwgT1IgVEVMRVBIT05FLlwiLCBcIihmKSBDYW5jZWxsYXRpb24gb2YgQXV0b21hdGljIFJlbmV3YWwgb2YgTW9udGhseSBNZW1iZXJzaGlwLiBUTyBDQU5DRUwgQVVUT01BVElDIFJFTkVXQUwgT0YgWU9VUiBNT05USExZIE1FTUJFUlNISVAgQVQgQU5ZIFRJTUUsIFlPVSBNVVNUIE5PVElGWSBUSEUgQ09NUEFOWSBCWSBFLU1BSUwgT1IgVEVMRVBIT05FLC5cIiwgXCIoZykgQ2FuY2VsbGF0aW9ucyBFZmZlY3RpdmUgVXBvbiBSZWNlaXB0IEJ5IENvbXBhbnkuIEFsbCBjYW5jZWxsYXRpb25zIHJlY2VpdmVkIGJ5IHRoZSBDb21wYW55IHdpbGwgYmUgZWZmZWN0aXZlIHVwb24gcmVjZWlwdC5cIiwgXCIoaCkgQ3JlZGl0IENhcmQgQ2hhcmdlcyBBdXRob3JpemVkLiBJZiB5b3Ugc2VsZWN0IGFueSBwYWlkIFRyaWFsIG9yIE1vbnRobHkgU3Vic2NyaXB0aW9ucywgWW91IGhlcmVieSBhdXRob3JpemUgdGhlIENvbXBhbnkgdG8gY2hhcmdlIFlvdXIgY3JlZGl0IGNhcmQgKHdoaWNoIFlvdSBoZXJlYnkgYWNrbm93bGVkZ2Ugd2FzIGVudGVyZWQgYnkgWW91IGludG8gdGhlIHNpZ24tdXAgcGFnZSkgdG8gcGF5IGZvciB0aGUgb25nb2luZyBTdWJzY3JpcHRpb24gRmVlcyB0byBwZXJzb25lcmEuY29tIGF0IHRoZSB0aGVuIGN1cnJlbnQgU3Vic2NyaXB0aW9uIFJhdGUuIFlvdSBmdXJ0aGVyIGF1dGhvcml6ZSB0aGUgQ29tcGFueSB0byBjaGFyZ2UgWW91ciBjcmVkaXQgY2FyZCBmb3IgYW55IGFuZCBhbGwgcHVyY2hhc2VzIG9mIHByb2R1Y3RzLCBzZXJ2aWNlcyBhbmQgZW50ZXJ0YWlubWVudCBhdmFpbGFibGUgdGhyb3VnaCwgYXQsIGluIG9yIG9uLCBvciBwcm92aWRlZCBieSwgcGVyc29uZXJhLmNvbS4gWW91IGFncmVlIHRvIGJlIHBlcnNvbmFsbHkgbGlhYmxlIGZvciBhbGwgY2hhcmdlcyBpbmN1cnJlZCBieSBZb3UgZHVyaW5nIG9yIHRocm91Z2ggdGhlIHVzZSBvZiBwZXJzb25lcmEuY29tLiBZb3VyIGxpYWJpbGl0eSBmb3Igc3VjaCBjaGFyZ2VzIHNoYWxsIGNvbnRpbnVlIGFmdGVyIHRlcm1pbmF0aW9uIG9mIFlvdXIgbWVtYmVyc2hpcC5cIiwgXCIoaSkgQXV0b21hdGljIENyZWRpdCBDYXJkIG9yIERlYml0IENhcmQgRGViaXQuIEFsbCBjaGFyZ2VzIHRvIFlvdXIgY3JlZGl0IGNhcmQgb3IgZGViaXQgY2FyZCBmb3IgUGFpZCBUcmFpbCBTdWJzY3JpcHRpb24gYW5kL29yIHRoZSBNb250aGx5IE1lbWJlcnNoaXAsIHVuZGVyIHRoZSB0ZXJtcyBhbmQgY29uZGl0aW9ucyBvZiB0aGlzIEFncmVlbWVudCwgd2lsbCBiZSBtYWRlIGluIGFkdmFuY2UgYnkgYXV0b21hdGljIGNyZWRpdCBjYXJkIG9yIGRlYml0IGNhcmQgZGViaXQgYW5kIHlvdSBoZXJlYnkgYXV0aG9yaXplIHRoZSBDb21wYW55IGFuZCBpdHMgYWdlbnRzIHRvIHByb2Nlc3Mgc3VjaCB0cmFuc2FjdGlvbnMgb24gWW91ciBiZWhhbGYuXCIsIFwiKGopIEJpbGxpbmcgU3VwcG9ydC4gWW91IG1heSBhY2Nlc3MgdGhlIGN1c3RvbWVyIHN1cHBvcnQgZGVwYXJ0bWVudCBieSBlbWFpbGluZyBzdXBwb3J0LCBFTUFJTFwiLCBcIihqKSBhbGwgcXVlc3Rpb25zIHJlZ2FyZGluZyBiaWxsaW5nIGZvciB0aGUgc2l0ZSBtZW1iZXJzaGlwXCIsIFwiKGpqKSBob3cgdG8gcmVxdWVzdCBhIHJlZnVuZC5cIl0sXHJcblx0XHRcdFwiXzJcIjpbXCJBdXRvbWF0aWMgUmVuZXdhbCBvZiBUcmlhbCBTdWJzY3JpcHRpb24gdG8gTW9udGhseSBNZW1iZXJzaGlwLiBBbGwgVHJpYWwgU3Vic2NyaXB0aW9ucyBzaGFsbCByZW5ldywgYXV0b21hdGljYWxseSBhbmQgd2l0aG91dCBub3RpY2UsIHRvIGEgTW9udGhseSBNZW1iZXJzaGlwLiBQYWlkIFRyaWFsIFN1YnNjcmlwdGlvbnMgd2lsbCByZW5ldyBtb250aGx5IGF0IHRoZSBNb250aGx5IE1lbWJlcnNoaXAgUmF0ZSBzZWxlY3RlZCBieSBZb3UuXCIsIFwiKGMpIEF1dG9tYXRpYyBSZW5ld2FsIG9mIE1vbnRobHkgTWVtYmVyc2hpcC4gQWxsIE1vbnRobHkgTWVtYmVyc2hpcHMgc2hhbGwgcmVuZXcsIGF1dG9tYXRpY2FsbHkgYW5kIHdpdGhvdXQgbm90aWNlLCBmb3Igc3VjY2Vzc2l2ZSBwZXJpb2RzIG9mIGFwcHJveGltYXRlbHkgb25lICgxKSBtb250aCwgY29tbWVuY2luZyB1cG9uIHRoZSBleHBpcmF0aW9uIG9mIHRoZSBUcmlhbCBTdWJzY3JpcHRpb24sIGFuZCBjb250aW51aW5nIHRoZXJlYWZ0ZXIgZm9yIHN1Y2Nlc3NpdmUgcGVyaW9kcyBvZiBhcHByb3hpbWF0ZWx5IG9uZSAoMSkgbW9udGgsIHVubGVzcyBhbmQgdW50aWwgdGhpcyBBZ3JlZW1lbnQgaXMgY2FuY2VsZWQgYnkgWW91IG9yIHRoZSBDb21wYW55IGluIGFjY29yZGFuY2Ugd2l0aCB0aGUgdGVybXMgaGVyZW9mLiBFYWNoIHBlcmlvZCBvZiBhcHByb3hpbWF0ZWx5IG9uZSAoMSkgbW9udGggc2hhbGwgYmUgcmVmZXJyZWQgdG8gYXMgdGhlICdNb250aGx5IFN1YnNjcmlwdGlvbiBQZXJpb2QuJ1wiLCBcIihkKSBDYW5jZWxsYXRpb24gYnkgQ29tcGFueS4gVGhlIENvbXBhbnkgbWF5LCBhdCBhbnkgdGltZSBhbmQgYXQgaXRzIHNvbGUgZGlzY3JldGlvbiwgY2FuY2VsIGFueSBUcmlhbCBNZW1iZXJzaGlwIG9yIE1vbnRobHkgTWVtYmVyc2hpcC5cIiwgXCIoZSkgQ2FuY2VsbGF0aW9uIG9mIEF1dG9tYXRpYyBSZW5ld2FsIG9mIFRyaWFsIFN1YnNjcmlwdGlvbiB0byBNb250aGx5IE1lbWJlcnNoaXAuIFRPIENBTkNFTCBBVVRPTUFUSUMgUkVORVdBTCBBVCBUSEUgRU5EIE9GIFRIRSBUUklBTCBTVUJTQ1JJUFRJT04sIFlPVSBNVVNUIE5PVElGWSBUSEUgQ09NUEFOWSBQUklPUiBUTyBUSEUgRU5EIE9GIFRIRSBUUklBTCBQRVJJT0QsIEJZIENPTlRBQ1RJTkcgVEhFIENPTVBBTlkgQlkgRS1NQUlMIE9SIFRFTEVQSE9ORS5cIiwgXCIoZikgQ2FuY2VsbGF0aW9uIG9mIEF1dG9tYXRpYyBSZW5ld2FsIG9mIE1vbnRobHkgTWVtYmVyc2hpcC4gVE8gQ0FOQ0VMIEFVVE9NQVRJQyBSRU5FV0FMIE9GIFlPVVIgTU9OVEhMWSBNRU1CRVJTSElQIEFUIEFOWSBUSU1FLCBZT1UgTVVTVCBOT1RJRlkgVEhFIENPTVBBTlkgQlkgRS1NQUlMIE9SIFRFTEVQSE9ORSwuXCIsIFwiKGcpIENhbmNlbGxhdGlvbnMgRWZmZWN0aXZlIFVwb24gUmVjZWlwdCBCeSBDb21wYW55LiBBbGwgY2FuY2VsbGF0aW9ucyByZWNlaXZlZCBieSB0aGUgQ29tcGFueSB3aWxsIGJlIGVmZmVjdGl2ZSB1cG9uIHJlY2VpcHQuXCIsIFwiKGgpIENyZWRpdCBDYXJkIENoYXJnZXMgQXV0aG9yaXplZC4gSWYgeW91IHNlbGVjdCBhbnkgcGFpZCBUcmlhbCBvciBNb250aGx5IFN1YnNjcmlwdGlvbnMsIFlvdSBoZXJlYnkgYXV0aG9yaXplIHRoZSBDb21wYW55IHRvIGNoYXJnZSBZb3VyIGNyZWRpdCBjYXJkICh3aGljaCBZb3UgaGVyZWJ5IGFja25vd2xlZGdlIHdhcyBlbnRlcmVkIGJ5IFlvdSBpbnRvIHRoZSBzaWduLXVwIHBhZ2UpIHRvIHBheSBmb3IgdGhlIG9uZ29pbmcgU3Vic2NyaXB0aW9uIEZlZXMgdG8gcGVyc29uZXJhLmNvbSBhdCB0aGUgdGhlbiBjdXJyZW50IFN1YnNjcmlwdGlvbiBSYXRlLiBZb3UgZnVydGhlciBhdXRob3JpemUgdGhlIENvbXBhbnkgdG8gY2hhcmdlIFlvdXIgY3JlZGl0IGNhcmQgZm9yIGFueSBhbmQgYWxsIHB1cmNoYXNlcyBvZiBwcm9kdWN0cywgc2VydmljZXMgYW5kIGVudGVydGFpbm1lbnQgYXZhaWxhYmxlIHRocm91Z2gsIGF0LCBpbiBvciBvbiwgb3IgcHJvdmlkZWQgYnksIHBlcnNvbmVyYS5jb20uIFlvdSBhZ3JlZSB0byBiZSBwZXJzb25hbGx5IGxpYWJsZSBmb3IgYWxsIGNoYXJnZXMgaW5jdXJyZWQgYnkgWW91IGR1cmluZyBvciB0aHJvdWdoIHRoZSB1c2Ugb2YgcGVyc29uZXJhLmNvbS4gWW91ciBsaWFiaWxpdHkgZm9yIHN1Y2ggY2hhcmdlcyBzaGFsbCBjb250aW51ZSBhZnRlciB0ZXJtaW5hdGlvbiBvZiBZb3VyIG1lbWJlcnNoaXAuXCIsIFwiKGkpIEF1dG9tYXRpYyBDcmVkaXQgQ2FyZCBvciBEZWJpdCBDYXJkIERlYml0LiBBbGwgY2hhcmdlcyB0byBZb3VyIGNyZWRpdCBjYXJkIG9yIGRlYml0IGNhcmQgZm9yIFBhaWQgVHJhaWwgU3Vic2NyaXB0aW9uIGFuZC9vciB0aGUgTW9udGhseSBNZW1iZXJzaGlwLCB1bmRlciB0aGUgdGVybXMgYW5kIGNvbmRpdGlvbnMgb2YgdGhpcyBBZ3JlZW1lbnQsIHdpbGwgYmUgbWFkZSBpbiBhZHZhbmNlIGJ5IGF1dG9tYXRpYyBjcmVkaXQgY2FyZCBvciBkZWJpdCBjYXJkIGRlYml0IGFuZCB5b3UgaGVyZWJ5IGF1dGhvcml6ZSB0aGUgQ29tcGFueSBhbmQgaXRzIGFnZW50cyB0byBwcm9jZXNzIHN1Y2ggdHJhbnNhY3Rpb25zIG9uIFlvdXIgYmVoYWxmLlwiLCBcIihqKSBCaWxsaW5nIFN1cHBvcnQuIFlvdSBtYXkgYWNjZXNzIHRoZSBjdXN0b21lciBzdXBwb3J0IGRlcGFydG1lbnQgYnkgZW1haWxpbmcgc3VwcG9ydCwgRU1BSUxcIiwgXCIoaikgYWxsIHF1ZXN0aW9ucyByZWdhcmRpbmcgYmlsbGluZyBmb3IgdGhlIHNpdGUgbWVtYmVyc2hpcFwiLCBcIihqaikgaG93IHRvIHJlcXVlc3QgYSByZWZ1bmQuXCJdLFxyXG5cdFx0XHRcIl8zXCI6W1wiTGFzdCBtb2RpZmllZCBkYXRlOiBNYXkgMTcsIDIwMjFcIiwgXCJNRU1CRVJTSElQIEFORCBCSUxMSU5HLiBZb3UgaGVyZWJ5IGFncmVlIHRoYXQsIHVwb24gWW91ciBzdWJzY3JpcHRpb24gdG8gUGVyc29uZXJhLmNvbSwgZGVwZW5kaW5nIG9uIHRoZSBtZW1iZXJzaGlwIG9wdGlvbnMgWW91IGNob29zZSwgWW91IG1heSBiZSBzdWJqZWN0IHRvIGNlcnRhaW4gaW1tZWRpYXRlIGFuZCBhdXRvbWF0aWNhbGx5IHJlY3VycmluZyBjaGFyZ2VzIHdoaWNoIHNoYWxsIGJlIGJpbGxlZCB0byBZb3VyIGNyZWRpdCBjYXJkLCB1bmxlc3MgWW91IGNhbmNlbCBZb3VyIHN1YnNjcmlwdGlvbiB1bmRlciB0aGUgdGVybXMgYW5kIGNvbmRpdGlvbnMgb2YgdGhpcyBBZ3JlZW1lbnQuIFRoZSBjaGFyZ2VzLCBpZiBhbnksIHdoaWNoIFlvdSB3aWxsIGluY3VyLCBhbmQgaGVyZWJ5IGF1dGhvcml6ZSwgYXJlIGFzIGZvbGxvd3M6XCIsIFwiTGFzdCBtb2RpZmllZCBkYXRlOiBNYXkgMTcsIDIwMjFcIiwgXCJNRU1CRVJTSElQIEFORCBCSUxMSU5HLiBZb3UgaGVyZWJ5IGFncmVlIHRoYXQsIHVwb24gWW91ciBzdWJzY3JpcHRpb24gdG8gUGVyc29uZXJhLmNvbSwgZGVwZW5kaW5nIG9uIHRoZSBtZW1iZXJzaGlwIG9wdGlvbnMgWW91IGNob29zZSwgWW91IG1heSBiZSBzdWJqZWN0IHRvIGNlcnRhaW4gaW1tZWRpYXRlIGFuZCBhdXRvbWF0aWNhbGx5IHJlY3VycmluZyBjaGFyZ2VzIHdoaWNoIHNoYWxsIGJlIGJpbGxlZCB0byBZb3VyIGNyZWRpdCBjYXJkLCB1bmxlc3MgWW91IGNhbmNlbCBZb3VyIHN1YnNjcmlwdGlvbiB1bmRlciB0aGUgdGVybXMgYW5kIGNvbmRpdGlvbnMgb2YgdGhpcyBBZ3JlZW1lbnQuIFRoZSBjaGFyZ2VzLCBpZiBhbnksIHdoaWNoIFlvdSB3aWxsIGluY3VyLCBhbmQgaGVyZWJ5IGF1dGhvcml6ZSwgYXJlIGFzIGZvbGxvd3M6XCIsIFwiTGFzdCBtb2RpZmllZCBkYXRlOiBNYXkgMTcsIDIwMjFcIiwgXCJNRU1CRVJTSElQIEFORCBCSUxMSU5HLiBZb3UgaGVyZWJ5IGFncmVlIHRoYXQsIHVwb24gWW91ciBzdWJzY3JpcHRpb24gdG8gUGVyc29uZXJhLmNvbSwgZGVwZW5kaW5nIG9uIHRoZSBtZW1iZXJzaGlwIG9wdGlvbnMgWW91IGNob29zZSwgWW91IG1heSBiZSBzdWJqZWN0IHRvIGNlcnRhaW4gaW1tZWRpYXRlIGFuZCBhdXRvbWF0aWNhbGx5IHJlY3VycmluZyBjaGFyZ2VzIHdoaWNoIHNoYWxsIGJlIGJpbGxlZCB0byBZb3VyIGNyZWRpdCBjYXJkLCB1bmxlc3MgWW91IGNhbmNlbCBZb3VyIHN1YnNjcmlwdGlvbiB1bmRlciB0aGUgdGVybXMgYW5kIGNvbmRpdGlvbnMgb2YgdGhpcyBBZ3JlZW1lbnQuIFRoZSBjaGFyZ2VzLCBpZiBhbnksIHdoaWNoIFlvdSB3aWxsIGluY3VyLCBhbmQgaGVyZWJ5IGF1dGhvcml6ZSwgYXJlIGFzIGZvbGxvd3M6XCJdLFxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHR0YWJzX2VsZW1zLmZvckVhY2goKGVsLCBpKT0+e1xyXG5cdFx0XHRlbC5vbmNsaWNrID0gKCk9PntcclxuXHRcdFx0XHRyZW1fY2xhc3Nlcyh0YWJzX2VsZW1zKTtcclxuXHRcdFx0XHRlbC5jbGFzc0xpc3QuYWRkKCdfYWN0aXZlJywgYF8ke2krMX1gKTtcclxuXHRcdFx0XHRjaGVjaygpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlbV9jbGFzc2VzKGVsZW1zKXtcclxuXHRcdFx0ZWxlbXMuZm9yRWFjaChlbD0+ZWwuY2xhc3NMaXN0LnJlbW92ZSgnX2FjdGl2ZScpKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBjaGVjaygpe1xyXG5cdFx0XHRsZXQgYWN0aXZlID0gJyc7XHJcblxyXG5cdFx0XHR0YWJzX2VsZW1zLmZvckVhY2goKGVsLCBpbmRleCk9PntcclxuXHRcdFx0XHRpZihlbC5jbGFzc0xpc3QuY29udGFpbnMoJ19hY3RpdmUnKSl7XHJcblx0XHRcdFx0XHRhY3RpdmUgPSBpbmRleCsxO1xyXG5cdFx0XHRcdFx0bGV0IHRleHQgPSBlbC50ZXh0Q29udGVudDtcclxuXHRcdFx0XHRcdHRhYnNfdGl0bGUudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdGFkZF9jb250ZW50KGBfJHthY3RpdmV9YCk7XHJcblx0XHR9XHJcblx0XHRjaGVjaygpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFkZF9jb250ZW50KGNvbnRlbnRfbmFtZSl7XHJcblx0XHRcdHRhYnNfY29udC5xdWVyeVNlbGVjdG9yQWxsKCcudGV4dCcpLmZvckVhY2goZWw9PmVsLnJlbW92ZSgpKTtcclxuXHRcdFx0Y29udGVudFtjb250ZW50X25hbWVdLmZvckVhY2goZWw9PntcclxuXHRcdFx0XHR0YWJzX2NvbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVFbmQnLCBgPHAgY2xhc3M9XCJ0ZXh0XCI+JHtlbH08L3A+YCk7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG59XHJcbmZfdGFicygpO1xyXG4iLCJmdW5jdGlvbiB1cGRhdGVfaW1nKCl7XHJcblx0Y29uc3QgaW5wX2ltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjcmVhdGUtZm9ybV9pbWcnKTtcclxuXHRjb25zdCBibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcmVhdGUtZm9ybV9fYmxvY2snKTtcclxuXHJcblx0aWYoaW5wX2ltZyl7XHJcblxyXG5cdFx0aW5wX2ltZy5vbmNoYW5nZT0gKGUpPT57XHJcblx0XHRcdGdldEJhc2U2NChpbnBfaW1nLmZpbGVzWzBdKTtcclxuXHRcdFx0aW1nX3ByZXZpZXcoaW5wX2ltZywgaW5wX2ltZy5maWxlc1swXSwgYmxvY2spO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuXHJcbnVwZGF0ZV9pbWcoKTtcclxuXHJcblxyXG5cclxuLy8gZnVuY3NfX19fX19fXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0QmFzZTY0KGZpbGUpIHtcclxuICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgIGltZ19iYXNlXzY0ID0gcmVhZGVyLnJlc3VsdDtcclxuICAgICBpbWdfYmFzZV82NCA9IFtpbWdfYmFzZV82NC5zcGxpdChcIixcIilbMV1dO1xyXG4gICB9O1xyXG4gICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJywgZXJyb3IpO1xyXG4gICB9O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaW1nX3ByZXZpZXcoZmlsZSwgaW1nLCBibG9jayl7XHJcblx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblx0cmVhZGVyLnJlYWRBc0RhdGFVUkwoaW1nKTtcclxuXHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGFkZChldmVudC50YXJnZXQucmVzdWx0KTtcclxuXHRcdHJlbW92ZSgpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWRkKHNyYyl7XHJcblx0XHRibG9jay5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBgPGRpdiBjbGFzcz1cImNyZWF0ZS1mb3JtX19wcmV2aWV3XCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjcmVhdGVJbWctcmVtb3ZlLWJ0blwiPsOXPC9kaXY+XHJcblx0XHRcdDxpbWcgc3JjPVwiJHtldmVudC50YXJnZXQucmVzdWx0fVwiLz5cclxuXHRcdDwvZGl2PmApXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiByZW1vdmUoKXtcclxuXHRcdGNvbnN0IHJlbW92ZV9idG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3JlYXRlSW1nLXJlbW92ZS1idG4nKTtcclxuXHJcblx0XHRyZW1vdmVfYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcclxuXHRcdFx0cmVtb3ZlX2J0bi5wYXJlbnROb2RlLnJlbW92ZSgpO1xyXG5cdFx0XHRpbWdfYmFzZV82NCA9IG51bGw7XHJcblx0XHRcdGZpbGUudmFsdWUgPSAnJztcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHJcbn1cclxuIiwiLypfX19fX19fX19fX19fX19fX19oZWFkZXJfZml4X19fX19fX19fX19fX19fXyovXHJcblxyXG5mdW5jdGlvbiBoZWFkZXJfZml4KCkge1xyXG4gIHZhciBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XHJcblxyXG4gIGRvY3VtZW50Lm9uc2Nyb2xsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgc2hvd0hlYWRlcigpO1xyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIHNob3dIZWFkZXIoKSB7XHJcbiAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gMjAwKSB7XHJcbiAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfZml4ZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkZXJfZml4ZWQnKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuaGVhZGVyX2ZpeCgpO1xyXG4iLCJmdW5jdGlvbiBzZW5kUmVxdWVzdChtZXRob2QsIHVybCwgYm9keSA9IG51bGwsIHRva2VuPW51bGwpe1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG5cclxuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsKTtcclxuICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XHJcbiAgICBpZih0b2tlbikge1xyXG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignYXV0aCcsIHRva2VuKTtcclxuICAgIH1cclxuXHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKVxyXG5cclxuXHJcbiAgICB4aHIub25sb2FkID0gKCkgPT57XHJcbiAgICAgIGlmKHhoci5zdGF0dXMgPj0gNDAwKXtcclxuICAgICAgICByZWplY3QoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgeGhyLm9uZXJyb3IgPSAoKSA9PntcclxuICAgICAgcmVqZWN0KHhoci5yZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHhoci5zZW5kKCBKU09OLnN0cmluZ2lmeShib2R5KSk7XHJcbiAgfSlcclxufVxyXG4iXX0=