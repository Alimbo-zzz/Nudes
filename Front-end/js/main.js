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
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJhZGRJbWFnZXNUb0NvbGxlY3Rpb24uanMiLCJhdXRvcml6YXRpb25fbW9kYWwuanMiLCJjaGVja19jb2lucy5qcyIsImhhbWJ1cmdlci5qcyIsImxvYWRlci5qcyIsIm1vZGFsLmpzIiwibW9kYWxfaW1hZ2UuanMiLCJyYWRpb19idG4uanMiLCJyb3V0ZXNfYnRuLmpzIiwic2VsZWN0LmpzIiwic2VuZF9pbWFnZS5qcyIsInNwbGlkZS5qcyIsInRhYnMuanMiLCJ1cGRhdGVfaW1nLmpzIl0sIm5hbWVzIjpbImJhc2VVUkwiLCJyb3V0ZXMiLCJob21lIiwiYWJvdXQiLCJjcmVhdGUiLCJkZXBvc2l0IiwibXlQaG90b3MiLCJwYXlpbmZvIiwiaW1nX2Jhc2VfNjQiLCJiYXNlNjRfdGV4dCIsImxzIiwid2luZG93IiwibG9jYWxTdG9yYWdlIiwidG9rZW4iLCJnZXRJdGVtIiwidXNlcm5hbWUiLCJjb2lucyIsImNvbnNvbGUiLCJsb2ciLCJsb2NhdGlvbiIsInByb3RvY29sIiwiYWRkSW1hZ2VzVG9Db2xsZWN0aW9uIiwicmVzIiwic2VjIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibGlzdCIsIm9sZF9lbGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZWwiLCJpIiwiaWQiLCJyZW1vdmUiLCJpdGVtIiwiZmlyc3QiLCJzdGF0ZSIsIkdFVF9pbWdTdGF0dXMiLCJpbWFnZUlkIiwiZW5kIiwiaHRtbCIsImJlZm9yZUJhc2U2NCIsImFmdGVyQmFzZTY0IiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwiYXV0b3JpemF0aW9uX21vZGFsIiwiYXV0aG9yaXphdGlvbiIsInZhbHVlIiwibW9kYWwiLCJmb3JtIiwiYnRuX3JlbW92ZSIsImJ0bl9jaGFuZ2UiLCJpbnBfbmFtZSIsImlucF9wYXNzIiwiYnRuX3NpZ25JbiIsImJ0bl9zaWduVXAiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInByZXZlbnREZWZhdWx0IiwiY2xhc3NMaXN0IiwiYWRkIiwib25jbGljayIsInRvZ2dsZSIsImxlbmd0aCIsImJvZHkiLCJ1c2VyTmFtZSIsInVzZXJQYXNzd29yZCIsIlBPU1RfcmVnaXN0cmF0aW9uIiwiUE9TVF9hdXRoIiwiY2hlY2tfY29pbnMiLCJjaGVjayIsInNldEludGVydmFsIiwidXJsIiwic2VuZFJlcXVlc3QiLCJ0aGVuIiwidXNlcldhbGxldCIsInNldEl0ZW0iLCJhdXRoX3NlbGVjdCIsImNsZWFySW50ZXJ2YWwiLCJlcnIiLCJoYW1idXJnZXIiLCJoYW1idXJnZXJfbWVudSIsImxpbmtfZWxlbXMiLCJoZWFkZXIiLCJoYW1idXJnZXJfY2hlY2siLCJjb250YWlucyIsImhhbWJ1cmdlcl93YXRjaGVyIiwic3RhdHVzIiwib2xkX3N0YXR1cyIsImFjdGl2ZV9jbGFzcyIsIm1vZGFsX3N0YXR1cyIsInN0YXJ0X2xvYWRlciIsImxvYWRlciIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmQiLCJyZW1vdmVfbG9hZGVyIiwibW9kYWxfd2luZG93IiwiYWRkTW9kYWwiLCJvdmVybGF5IiwiY29udGVudCIsIm1vZGFsV2F0Y2hlciIsIm1vZGFsX2NoZWNrIiwibW9kYWxfaHRtbCIsImlubmVySFRNTCIsIm1vZGFsX2ltYWdlIiwiaW1nX2FyciIsInNyYyIsInJhZGlvX2J0bnMiLCJidG5zIiwicmFkaW8iLCJjaGVja2VkIiwicm91dGVzX2J0biIsInBhdGhuYW1lIiwiZGF0YXNldCIsInJvdXQiLCJjaGVja19yb3V0ZXIiLCJoYXNoIiwibmF2X2xpc3QiLCJuYXYiLCJlbF9oYXNoIiwiZ2V0QXR0cmlidXRlIiwic2VsZWN0X2J0biIsInNlbGVjdCIsInByZXZpZXciLCJsaW5rcyIsInNpZ25faW4iLCJzaWduX3VwIiwibG9nX29mZiIsImNsZWFyIiwiY29pbl9ibG9jayIsIl91c2VybmFtZSIsInRleHRDb250ZW50IiwiY29pbnNfdXBkYXRlIiwic2VuZF9pbWFnZSIsImxvZ2luIiwiUE9TVF9pbWFnZSIsImNsaWNrIiwic2NyZWVuIiwid2lkdGgiLCJzbGlkZXJzIiwidHJhY2siLCJzbGlkZXMiLCJzbGlkZSIsIlNwbGlkZSIsIm1vdW50IiwiZl90YWJzIiwidGFicyIsInJlbV9jbGFzc2VzIiwiZWxlbXMiLCJhY3RpdmUiLCJ0YWJzX2VsZW1zIiwiaW5kZXgiLCJ0ZXh0IiwidGFic190aXRsZSIsImFkZF9jb250ZW50IiwiY29udGVudF9uYW1lIiwidGFic19jb250IiwidXBkYXRlX2ltZyIsImlucF9pbWciLCJibG9jayIsIm9uY2hhbmdlIiwiZ2V0QmFzZTY0IiwiZmlsZXMiLCJpbWdfcHJldmlldyIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwicmVhZEFzRGF0YVVSTCIsIm9ubG9hZCIsInJlc3VsdCIsInNwbGl0Iiwib25lcnJvciIsImVycm9yIiwiaW1nIiwiZXZlbnQiLCJ0YXJnZXQiLCJyZW1vdmVfYnRuIiwicGFyZW50Tm9kZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBLElBQU1BLE9BQU8sa0NBQWI7QUFDQSxJQUFNQyxNQUFNLEdBQUc7QUFDZEMsRUFBQUEsSUFBSSxFQUFFLEdBRFE7QUFFZEMsRUFBQUEsS0FBSyxFQUFFLFFBRk87QUFHZEMsRUFBQUEsTUFBTSxFQUFFLFNBSE07QUFJZEMsRUFBQUEsT0FBTyxFQUFFLFVBSks7QUFLZEMsRUFBQUEsUUFBUSxFQUFFLFdBTEk7QUFNZEMsRUFBQUEsT0FBTyxFQUFFO0FBTkssQ0FBZjtBQVNBLElBQUlDLFdBQVcsR0FBRyxJQUFsQjtBQUNBLElBQUlDLFdBQVcsR0FBRyx3QkFBbEI7QUFDQSxJQUFNQyxFQUFFLEdBQUdDLE1BQU0sQ0FBQ0MsWUFBbEI7QUFDQSxJQUFNQyxLQUFLLEdBQUdILEVBQUUsQ0FBQ0ksT0FBSCxDQUFXLGVBQVgsQ0FBZDtBQUNBLElBQU1DLFFBQVEsR0FBR0wsRUFBRSxDQUFDSSxPQUFILENBQVcsY0FBWCxDQUFqQjtBQUNBLElBQU1FLEtBQUssR0FBR04sRUFBRSxDQUFDSSxPQUFILENBQVcsZUFBWCxDQUFkO0FBR0FHLE9BQU8sQ0FBQ0Ms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QXZCLENBQW5CO0FBRUFzSixJQUFBQSxVQUFVLENBQUN4SCxnQkFBWCxDQUE0QixPQUE1QixFQUFxQyxZQUFJO0FBQ3hDd0gsTUFBQUEsVUFBVSxDQUFDQyxVQUFYLENBQXNCL0ksTUFBdEI7QUFDQXpCLE1BQUFBLFdBQVcsR0FBRyxJQUFkO0FBQ0EySixNQUFBQSxJQUFJLENBQUNySCxLQUFMLEdBQWEsRUFBYjtBQUNBLEtBSkQ7QUFLQTtBQUdEIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb25zdCBiYXNlVVJMID0gYGh0dHA6Ly8xMzYuMjQ0Ljk2LjIwMToxMDEwMS92MWA7XHJcbmNvbnN0IGJhc2VVUkwgPSBgaHR0cDovLzE0OS4yOC4xNTMuNDY6MTAxMDEvdjFgO1xyXG5jb25zdCByb3V0ZXMgPSB7XHJcblx0aG9tZTogJy8nLFxyXG5cdGFib3V0OiAnL2Fib3V0JyxcclxuXHRjcmVhdGU6ICcvY3JlYXRlJyxcclxuXHRkZXBvc2l0OiAnL2RlcG9zaXQnLFxyXG5cdG15UGhvdG9zOiAnL215UGhvdG9zJyxcclxuXHRwYXlpbmZvOiAnL3BheWluZm8nXHJcbn1cclxuXHJcbnZhciBpbWdfYmFzZV82NCA9IG51bGw7XHJcbnZhciBiYXNlNjRfdGV4dCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsJztcclxuY29uc3QgbHMgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xyXG5jb25zdCB0b2tlbiA9IGxzLmdldEl0ZW0oJ2FpX251ZGVfdG9rZW4nKTtcclxuY29uc3QgdXNlcm5hbWUgPSBscy5nZXRJdGVtKCdhaV9udWRlX25hbWUnKTtcclxuY29uc3QgY29pbnMgPSBscy5nZXRJdGVtKCdhaV9udWRlX2NvaW5zJyk7XHJcblxyXG5cclxuY29uc29sZS5sb2coYGJlZm9yZSBwcm90b2NvbDogJHt3aW5kb3cubG9jYXRpb24ucHJvdG9jb2x9YCk7XHJcblxyXG5pZih3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT0gJ2h0dHBzOicpIHtcclxuXHR3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPSAnaHR0cDonO1xyXG5cdGNvbnNvbGUubG9nKCdjaGFuZ2UnKTtcclxuXHRjb25zb2xlLmxvZyh3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wpO1xyXG59ZWxzZXtcclxuXHRjb25zb2xlLmxvZygnbm9ybWFsJyk7XHJcblx0Y29uc29sZS5sb2cod2luZG93LmxvY2F0aW9uLnByb3RvY29sKTtcclxufVxyXG5cclxuY29uc29sZS5sb2coYGFmdGVyIHByb3RvY29sOiAke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH1gKTtcclxuIiwiZnVuY3Rpb24gYWRkSW1hZ2VzVG9Db2xsZWN0aW9uKHJlcyl7XHJcblx0Y29uc3Qgc2VjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNfbXktcGhvdG9zJylcclxuXHRpZihzZWMpe1xyXG5cdFx0Y29uc3QgbGlzdCA9IHNlYy5xdWVyeVNlbGVjdG9yKCcubXktcGhvdG9zX19saXN0Jyk7XHJcblx0XHRjb25zdCBvbGRfZWxlbXMgPSBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5teS1waG90b3NfX2VsJyk7XHJcblxyXG5cclxuXHRcdFx0b2xkX2VsZW1zLmZvckVhY2goKGVsLCBpKSA9PiB7XHJcblx0XHRcdFx0aWYoZWwuaWQgIT0gJ215UGhvdG9zX2VsLWZpcnN0JykgZWwucmVtb3ZlKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmVzLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuXHRcdFx0XHQvLyBHRVRfaW1nU3RhdHVzKGl0ZW0uKVxyXG5cdFx0XHRcdGxldCBmaXJzdCA9IGBgO1xyXG5cdFx0XHRcdGlmKGl0ZW0uc3RhdGUgPT0gMSkgZmlyc3QgPSBgPGxpIGNsYXNzPVwibXktcGhvdG9zX19lbCBfc3VjY2Vzc1wiPmA7XHJcblx0XHRcdFx0aWYoaXRlbS5zdGF0ZSA9PSAyKSBmaXJzdCA9IGA8bGkgY2xhc3M9XCJteS1waG90b3NfX2VsIF9lcnJvclwiPmA7XHJcblx0XHRcdFx0aWYoaXRlbS5zdGF0ZSA9PSAwKSB7Zmlyc3QgPSBgPGxpIGNsYXNzPVwibXktcGhvdG9zX19lbCBfbG9hZFwiPmA7XHJcblx0XHRcdFx0XHRHRVRfaW1nU3RhdHVzKGl0ZW0uaW1hZ2VJZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBlbmQgPSAnPC9saT4nXHJcblx0XHRcdFx0bGV0IGh0bWwgPSBgJHtmaXJzdH1cclxuXHRcdCAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJteS1waG90b3NfX25vdC1wcm9jZXNzZWRcIj5cclxuXHRcdCAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm15LXBob3Rvc19faW1nXCI+XHJcblx0XHQgICAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm15LXBob3Rvc19fcHJldmlld1wiIHNyYz1cImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwke2l0ZW0uYmVmb3JlQmFzZTY0fVwiLz5cclxuXHRcdCAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0XHQgICAgICAgICAgICAgICAgICA8L2Rpdj48aW1nIGNsYXNzPVwibXktcGhvdG9zX19hcnJvd1wiIHNyYz1cIi4vYXNzZXRzL2ltYWdlcy9pY29ucy9hcnJvdy5zdmdcIj5cclxuXHRcdCAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJteS1waG90b3NfX3Byb2Nlc3NlZFwiPlxyXG5cdFx0ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibXktcGhvdG9zX19pbWdcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIGNsYXNzPVwibXktcGhvdG9zX19wcmV2aWV3XCIgc3JjPVwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7aXRlbS5hZnRlckJhc2U2NH1cIi8+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGltZyBjbGFzcz1cIm15LXBob3Rvc19faW1nX2Vycm9yXCIgc3JjPVwiLi9hc3NldHMvaW1hZ2VzL3dhcm5pbmcucG5nXCI+PGltZyBjbGFzcz1cIm15LXBob3Rvc19faW1nX2xvYWRcIiBzcmM9XCIuL2Fzc2V0cy9pbWFnZXMvbG9hZC5wbmdcIj5cclxuXHRcdCAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0XHQgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdCAgICAgICAgICAgICAgICAke2VuZH1gXHJcblxyXG5cdFx0XHRcdGxpc3QuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgaHRtbCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHJcblx0fVxyXG5cclxufVxyXG4iLCJjb25zdCBhdXRvcml6YXRpb25fbW9kYWwgPSBgXHJcblx0PGRpdiBjbGFzcz1cImF1dGhvcml6YXRpb25cIj5cclxuXHRcdDxmb3JtIGF1dG9jb21wbGV0ZT1cIm9mZlwiIGNsYXNzPVwiYXV0aG9yaXphdGlvbl9fZm9ybVwiPlxyXG5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImF1dGhvcml6YXRpb25fX2Jsb2NrXCI+XHJcblx0XHRcdCBcdDxhIGNsYXNzPVwiYXV0aG9yaXphdGlvbl9fYmFja1wiPjwvYT5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYnRuIGF1dGhvcml6YXRpb25fX2NoYW5nZVwiPjxzcGFuPjwvc3Bhbj48L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJhdXRob3JpemF0aW9uX19ibG9ja1wiPlxyXG5cdFx0XHRcdDxpbWcgY2xhc3M9XCJhdXRob3JpemF0aW9uX19sb2dvXCIgc3JjPVwiLi9hc3NldHMvaW1hZ2VzL2ljb25zL0xPR08uc3ZnXCIvPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwidGV4dFwiPlNpZ24gaW4gdG8gY29udGludWU8L3A+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiYXV0aG9yaXphdGlvbl9fYmxvY2tcIj5cclxuXHRcdFx0XHQ8aW5wdXQgcmVxdWlyZWQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgdXNlcm5hbWVcIiBjbGFzcz1cImlucFwiLz5cclxuXHRcdFx0XHQ8aW5wdXQgcmVxdWlyZWQgdHlwZT1cInBhc3N3b3JkXCIgbmFtZT1cInBhc3NcIiBwbGFjZWhvbGRlcj1cIkVudGVyIHBhc3N3b3JkXCIgY2xhc3M9XCJpbnBcIi8+XHJcblx0XHRcdFx0PGEgaHJlZj1cIiNcIiBjbGFzcz1cImF1dGhvcml6YXRpb25fX2ZvcmdvdFwiPkZvcmdvdCBwYXNzd29yZDwvYT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJhdXRob3JpemF0aW9uX19ibG9ja1wiPlxyXG5cdFx0XHRcdDxidXR0b24gdHlwZT1cInNlbmRcIiBpZD1cInNlbmRfc2lnbl9pblwiIGNsYXNzPVwiYnRuIF9vcmFuZ2UgYXV0aG9yaXphdGlvbl9fc2luZy1pblwiPlNpZ24gaW48L2J1dHRvbj5cclxuXHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzZW5kXCIgaWQ9XCJzZW5kX3NpZ25fdXBcIiBjbGFzcz1cImJ0biBhdXRob3JpemF0aW9uX19zaW5nLXVwXCI+U2lnbiB1cDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvZm9ybT5cclxuXHQ8L2Rpdj5cclxuYFxyXG5cclxuXHJcbmZ1bmN0aW9uIGF1dGhvcml6YXRpb24odmFsdWUpe1xyXG5cdGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsJyk7XHJcblx0Y29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hdXRob3JpemF0aW9uX19mb3JtJyk7XHJcblx0Y29uc3QgYnRuX3JlbW92ZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmF1dGhvcml6YXRpb25fX2JhY2snKTtcclxuXHRjb25zdCBidG5fY2hhbmdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuYXV0aG9yaXphdGlvbl9fY2hhbmdlJyk7XHJcblx0Y29uc3QgaW5wX25hbWUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJuYW1lXCJdJyk7XHJcblx0Y29uc3QgaW5wX3Bhc3MgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJwYXNzXCJdJyk7XHJcblx0Y29uc3QgYnRuX3NpZ25JbiA9IGZvcm0ucXVlcnlTZWxlY3RvcignI3NlbmRfc2lnbl9pbicpO1xyXG5cdGNvbnN0IGJ0bl9zaWduVXAgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyNzZW5kX3NpZ25fdXAnKTtcclxuXHJcblx0Zm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSk9PntlLnByZXZlbnREZWZhdWx0KCl9KVxyXG5cclxuXHRpZih2YWx1ZSA9PSAnc2lnbl9pbicpe1xyXG5cdFx0Zm9ybS5jbGFzc0xpc3QuYWRkKCdfc2luZycpO1xyXG5cdH1cclxuXHJcblx0YnRuX3JlbW92ZS5vbmNsaWNrID0gKCk9PiBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdfYWN0aXZlJyk7XHJcblx0YnRuX2NoYW5nZS5vbmNsaWNrID0gKCk9Pntmb3JtLmNsYXNzTGlzdC50b2dnbGUoJ19zaW5nJyk7fTtcclxuXHJcblxyXG5cdGJ0bl9zaWduVXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xyXG5cdFx0aWYoaW5wX25hbWUudmFsdWUubGVuZ3RoICYmIGlucF9wYXNzLnZhbHVlLmxlbmd0aCl7XHJcblx0XHRcdGxldCBib2R5ID0ge1xyXG5cdFx0XHRcdHVzZXJOYW1lOiBpbnBfbmFtZS52YWx1ZSxcclxuXHRcdFx0XHR1c2VyUGFzc3dvcmQ6IGlucF9wYXNzLnZhbHVlXHJcblx0XHRcdH07XHJcblx0XHRcdFBPU1RfcmVnaXN0cmF0aW9uKGJvZHkpO1xyXG5cclxuXHRcdFx0aW5wX25hbWUudmFsdWUgPSAnJztcclxuXHRcdFx0aW5wX3Bhc3MudmFsdWUgPSAnJztcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHRidG5fc2lnbkluLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcclxuXHRcdGlmKGlucF9uYW1lLnZhbHVlLmxlbmd0aCAmJiBpbnBfcGFzcy52YWx1ZS5sZW5ndGgpe1xyXG5cdFx0XHRsZXQgYm9keSA9IHtcclxuXHRcdFx0XHR1c2VyTmFtZTogaW5wX25hbWUudmFsdWUsXHJcblx0XHRcdFx0dXNlclBhc3N3b3JkOiBpbnBfcGFzcy52YWx1ZVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRQT1NUX2F1dGgoYm9keSk7XHJcblxyXG5cdFx0XHRpbnBfbmFtZS52YWx1ZSA9ICcnO1xyXG5cdFx0XHRpbnBfcGFzcy52YWx1ZSA9ICcnO1xyXG5cdFx0fVxyXG5cdH0pXHJcbn1cclxuIiwiIGZ1bmN0aW9uIGNoZWNrX2NvaW5zKCl7XHJcbiAgIGNvbnN0IGNoZWNrID0gc2V0SW50ZXJ2YWwoKCk9PntcclxuICAgICBsZXQgdXJsID0gYCR7YmFzZVVSTH0vdXNlci9pbmZvYDtcclxuICAgICBzZW5kUmVxdWVzdCgnR0VUJywgdXJsLCBudWxsLCB0b2tlbilcclxuICAgICAgIC50aGVuKHJlcz0+e1xyXG4gICAgICAgICBpZihyZXMudXNlcldhbGxldCAhPSBjb2lucyl7XHJcbiAgICAgICAgICAgbHMuc2V0SXRlbSgnYWlfbnVkZV9jb2lucycsIGAke3Jlcy51c2VyV2FsbGV0fWApO1xyXG4gICAgICAgICAgIGF1dGhfc2VsZWN0KCk7XHJcbiAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjaGVjayk7XHJcbiAgICAgICAgIH1cclxuICAgICAgIH0pXHJcbiAgICAgICAuY2F0Y2goZXJyPT5jb25zb2xlLmxvZyhlcnIpKVxyXG4gICB9LCAxMDAwMClcclxuIH1cclxuIiwiXHJcbmZ1bmN0aW9uIGhhbWJ1cmdlcigpIHtcclxuICB2YXIgaGFtYnVyZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhhbWJ1cmdlcicpO1xyXG4gIHZhciBoYW1idXJnZXJfbWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2Jsb2NrJyk7XHJcbiAgdmFyIGxpbmtfZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmF2X19saW5rJyk7XHJcbiAgdmFyIGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKTtcclxuXHJcbiAgdmFyIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcblxyXG4gIGhhbWJ1cmdlci5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaGFtYnVyZ2VyLmNsYXNzTGlzdC50b2dnbGUoJ19hY3RpdmUnKTtcclxuXHRcdGhhbWJ1cmdlcl9jaGVjaygpO1xyXG4gIH07XHJcblxyXG5cdGxpbmtfZWxlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xyXG5cdFx0aXRlbS5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRoYW1idXJnZXIuY2xhc3NMaXN0LnJlbW92ZShcIl9hY3RpdmVcIik7XHJcblx0XHRcdGhhbWJ1cmdlcl9jaGVjaygpO1xyXG5cdFx0fTtcclxuXHR9KTtcclxuXHJcblx0aGFtYnVyZ2VyX2NoZWNrKCk7XHJcblxyXG5cdC8vIGZ1bmN0aW9zX19fX19fX19fX19fXHJcblxyXG4gIGZ1bmN0aW9uIGhhbWJ1cmdlcl9jaGVjaygpe1xyXG4gICAgaWYoaGFtYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucyhcIl9hY3RpdmVcIikpIHtcclxuICAgICAgaGFtYnVyZ2VyX21lbnUuY2xhc3NMaXN0LmFkZCgnaGFtYnVyZ2VyLW1lbnVfYWN0aXZlJyk7XHJcbiAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnX25vU2Nyb2xsJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoYW1idXJnZXJfbWVudS5jbGFzc0xpc3QucmVtb3ZlKCdoYW1idXJnZXItbWVudV9hY3RpdmUnKTtcclxuICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdfbm9TY3JvbGwnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cdGZ1bmN0aW9uIGhhbWJ1cmdlcl93YXRjaGVyKCl7XHJcblx0XHRsZXQgaGFtYnVyZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhhbWJ1cmdlcicpO1xyXG5cdFx0dmFyIHN0YXR1cyA9IHRydWU7XHJcblx0XHR2YXIgb2xkX3N0YXR1cyA9IHN0YXR1cztcclxuXHJcblx0XHRzZXRJbnRlcnZhbCgoKT0+e1xyXG5cdFx0XHRsZXQgYWN0aXZlX2NsYXNzID0gaGFtYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnX2FjdGl2ZScpO1xyXG5cdFx0XHRpZihhY3RpdmVfY2xhc3MpIHN0YXR1cyA9IHRydWU7XHJcblx0XHRcdGlmKCFhY3RpdmVfY2xhc3MpIHN0YXR1cyA9IGZhbHNlO1xyXG5cclxuXHRcdFx0aWYoc3RhdHVzICE9IG9sZF9zdGF0dXMpe1xyXG5cdFx0XHRcdGhhbWJ1cmdlcl9jaGVjaygpO1xyXG5cdFx0XHRcdG9sZF9zdGF0dXMgPSBtb2RhbF9zdGF0dXM7XHJcblx0XHRcdH1cclxuXHRcdH0sMTAwKTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5oYW1idXJnZXIoKTtcclxuIiwiZnVuY3Rpb24gc3RhcnRfbG9hZGVyKCl7XHJcblx0Y29uc3QgbG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0bG9hZGVyLmNsYXNzTGlzdC5hZGQoJ2xvYWRlcicpO1xyXG5cdGxvYWRlci5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGA8ZGl2IGlkPVwiZXNjYXBpbmdCYWxsR1wiPlxyXG5cdDxkaXYgaWQ9XCJlc2NhcGluZ0JhbGxfMVwiIGNsYXNzPVwiZXNjYXBpbmdCYWxsR1wiPjwvZGl2PlxyXG48L2Rpdj5gKVxyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kKGxvYWRlcik7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZW1vdmVfbG9hZGVyKCl7XHJcblx0Y29uc3QgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlcicpO1xyXG5cdGlmKGxvYWRlcikgbG9hZGVyLnJlbW92ZSgpO1xyXG59XHJcbiIsIlxyXG4vLyBtb2RhbF93aW5kb3dcclxuXHJcbmZ1bmN0aW9uIG1vZGFsX3dpbmRvdygpIHtcclxuXHRhZGRNb2RhbCgpO1xyXG5cdGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsJyk7XHJcblx0Y29uc3Qgb3ZlcmxheSA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fb3ZlcmxheScpO1xyXG5cdGNvbnN0IGNvbnRlbnQgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2NvbnRlbnQnKTtcclxuXHRjb25zdCBidG5fcmVtb3ZlID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsX19yZW1vdmUnKTtcclxuXHRjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cclxuXHRvdmVybGF5Lm9uY2xpY2sgPSAoKT0+IHJlbW92ZSgpO1xyXG5cdGJ0bl9yZW1vdmUub25jbGljayA9ICgpPT4gcmVtb3ZlKCk7XHJcblxyXG5cdG1vZGFsV2F0Y2hlcigpO1xyXG5cdG1vZGFsX2NoZWNrKCk7XHJcblx0Ly8gZnVuY3Rpb3NfX19fX19fX19fX19cclxuXHRmdW5jdGlvbiBtb2RhbF9jaGVjaygpe1xyXG5cdFx0bGV0IGFjdGl2ZV9jbGFzcyA9IG1vZGFsLmNsYXNzTGlzdC5jb250YWlucygnX2FjdGl2ZScpO1xyXG5cdFx0aWYoYWN0aXZlX2NsYXNzKXtcclxuXHRcdFx0Ym9keS5jbGFzc0xpc3QuYWRkKCdfbm9TY3JvbGwnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ19ub1Njcm9sbCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiByZW1vdmUoKXtcclxuXHRcdGlmKG1vZGFsKXtcclxuXHRcdFx0bW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnX2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBhZGRNb2RhbCgpe1xyXG5cdFx0Y29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuXHRcdGNvbnN0IG1vZGFsX2h0bWwgPSBgXHJcblx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbF9fcmVtb3ZlXCI+w5c8L2Rpdj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWxfX292ZXJsYXlcIj48L2Rpdj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWxfX2NvbnRlbnRcIj48L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRgO1xyXG5cclxuXHRcdGJvZHkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVFbmQnLCBtb2RhbF9odG1sKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gbW9kYWxXYXRjaGVyKCl7XHJcblx0XHRsZXQgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwnKTtcclxuXHRcdHZhciBtb2RhbF9zdGF0dXMgPSB0cnVlO1xyXG5cdFx0dmFyIG9sZF9zdGF0dXMgPSBtb2RhbF9zdGF0dXM7XHJcblxyXG5cdFx0c2V0SW50ZXJ2YWwoKCk9PntcclxuXHRcdFx0bGV0IGFjdGl2ZV9jbGFzcyA9IG1vZGFsLmNsYXNzTGlzdC5jb250YWlucygnX2FjdGl2ZScpO1xyXG5cdFx0XHRpZihhY3RpdmVfY2xhc3MpIG1vZGFsX3N0YXR1cyA9IHRydWU7XHJcblx0XHRcdGlmKCFhY3RpdmVfY2xhc3MpIG1vZGFsX3N0YXR1cyA9IGZhbHNlO1xyXG5cclxuXHRcdFx0aWYobW9kYWxfc3RhdHVzICE9IG9sZF9zdGF0dXMpe1xyXG5cdFx0XHRcdG1vZGFsX2NoZWNrKCk7XHJcblx0XHRcdFx0b2xkX3N0YXR1cyA9IG1vZGFsX3N0YXR1cztcclxuXHRcdFx0fVxyXG5cdFx0fSwxMDApO1xyXG5cclxuXHR9XHJcbn1cclxubW9kYWxfd2luZG93KCk7XHJcblxyXG5mdW5jdGlvbiBtb2RhbChodG1sPScnKXtcclxuXHRjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbCcpO1xyXG5cdG1vZGFsLmNsYXNzTGlzdC5hZGQoJ19hY3RpdmUnKTtcclxuXHJcblx0aWYobW9kYWwpe1xyXG5cdFx0Y29uc3QgY29udGVudCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY29udGVudCcpO1xyXG5cdFx0Y29udGVudC5pbm5lckhUTUwgPSBodG1sO1xyXG5cdH1cclxufVxyXG4iLCJmdW5jdGlvbiBtb2RhbF9pbWFnZSgpe1xyXG5cdGNvbnN0IHNlYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zX215LXBob3RvcycpO1xyXG5cclxuXHRpZihzZWMpe1xyXG5cdFx0Y29uc3QgaW1nX2FyciA9IHNlYy5xdWVyeVNlbGVjdG9yQWxsKCcubXktcGhvdG9zX19wcmV2aWV3Jyk7XHJcblxyXG5cdFx0aW1nX2Fyci5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcblx0XHRcdGl0ZW0ub25jbGljayA9ICgpPT57XHJcblxyXG5cdFx0XHRcdG1vZGFsKGA8ZGl2IGNsYXNzPVwiaW1nLW1vZGFsXCI+PGltZyBzcmM9XCIke2l0ZW0uc3JjfVwiLz48L2Rpdj5gKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblxyXG5cclxufVxyXG4iLCJcclxuXHJcbi8vIHJhZGlvX19idG5zXHJcbmZ1bmN0aW9uIHJhZGlvX2J0bnMoKXtcclxuXHRjb25zdCBidG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvcmRlci1ib3gnKTtcclxuXHJcblx0aWYoYnRucyl7XHJcblx0XHRidG5zLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuXHRcdFx0bGV0IHJhZGlvID0gaXRlbS5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKTtcclxuXHRcdFx0c2V0SW50ZXJ2YWwoKCk9PntcclxuXHRcdFx0XHRpZihyYWRpby5jaGVja2VkICYmICFpdGVtLmNsYXNzTGlzdC5jb250YWlucygnX2FjdGl2ZScpKXtcclxuXHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnX2FjdGl2ZScpXHJcblx0XHRcdFx0fWVsc2UgaWYgKCFyYWRpby5jaGVja2VkKSB7XHJcblx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ19hY3RpdmUnKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwxMDApXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5yYWRpb19idG5zKCk7XHJcbiIsImZ1bmN0aW9uIHJvdXRlc19idG4oKXtcclxuXHRjb25zdCByb3V0ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucm91dCcpO1xyXG5cclxuXHJcblx0cm91dGVzLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuXHRcdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPSBpdGVtLmRhdGFzZXQucm91dFxyXG5cdFx0fSlcclxuXHR9KTtcclxuXHJcbn1cclxuXHJcbnJvdXRlc19idG4oKTtcclxuXHJcblxyXG5mdW5jdGlvbiBjaGVja19yb3V0ZXIoKXtcclxuXHRjb25zdCBoYXNoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG5cdGNvbnN0IG5hdl9saXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdl9fbGluaycpO1xyXG5cclxuXHRuYXZfbGlzdC5mb3JFYWNoKChlbCwgaSkgPT4ge2VsLmNsYXNzTGlzdC5yZW1vdmUoJ19hY3RpdmUnKX0pO1xyXG5cclxuXHRuYXZfbGlzdC5mb3JFYWNoKChuYXYsIGkpID0+IHtcclxuXHRcdGNvbnN0IGVsX2hhc2ggPSBuYXYuZ2V0QXR0cmlidXRlKCdocmVmJyk7XHJcblx0XHRpZihlbF9oYXNoID09IGhhc2gpe1xyXG5cdFx0XHRuYXYuY2xhc3NMaXN0LmFkZCgnX2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG5jaGVja19yb3V0ZXIoKTtcclxuIiwiZnVuY3Rpb24gc2VsZWN0X2J0bigpe1xyXG5cdGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QnKTtcclxuXHRjb25zdCBwcmV2aWV3ID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RfX3ByZXZpZXcnKTtcclxuXHRjb25zdCBsaW5rcyA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VsZWN0X19lbCcpO1xyXG5cdGNvbnN0IHNpZ25faW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2lnbl9pbicpO1xyXG5cdGNvbnN0IHNpZ25fdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2lnbl91cCcpO1xyXG5cdGNvbnN0IGxvZ19vZmYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9nX29mZicpO1xyXG5cclxuXHJcblx0bG9nX29mZi5vbmNsaWNrID0gKCk9PntcclxuXHRcdHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuXHRcdHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9ICcvJztcclxuXHR9XHJcblxyXG5cdHNpZ25faW4ub25jbGljayA9ICgpPT57XHJcblx0XHRtb2RhbChhdXRvcml6YXRpb25fbW9kYWwpO1xyXG5cdFx0YXV0aG9yaXphdGlvbignc2lnbl9pbicpO1xyXG5cdH1cclxuXHJcblx0c2lnbl91cC5vbmNsaWNrID0gKCk9PntcclxuXHRcdG1vZGFsKGF1dG9yaXphdGlvbl9tb2RhbCk7XHJcblx0XHRhdXRob3JpemF0aW9uKCdzaWduX3VwJyk7XHJcblx0fVxyXG5cclxuXHJcblx0bGlua3MuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG5cdFx0aXRlbS5vbmNsaWNrID0gKGUpPT57XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0Y29uc29sZS5sb2coJ3NzcycpO1xyXG5cdFx0XHRzZWxlY3QuY2xhc3NMaXN0LnJlbW92ZSgnX2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRzZXRJbnRlcnZhbCgoKT0+e1xyXG5cdFx0aWYoIXNlbGVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ19sb2dpbicpKXtcclxuXHRcdFx0cHJldmlldy5vbmNsaWNrID0gKCk9PntcdHNlbGVjdC5jbGFzc0xpc3QudG9nZ2xlKCdfYWN0aXZlJyk7XHR9XHJcblx0XHR9ZWxzZXtcdHNlbGVjdC5jbGFzc0xpc3QucmVtb3ZlKCdfYWN0aXZlJyk7fVxyXG5cdH0sMTAwKVxyXG59XHJcblxyXG5zZWxlY3RfYnRuKCk7XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGF1dGhfc2VsZWN0KCl7XHJcblx0Y29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdCcpO1xyXG5cdGNvbnN0IGNvaW5fYmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29pbnMnKTtcclxuXHRjb25zdCBfdXNlcm5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdXNlcm5hbWUnKTtcclxuXHRpZih0b2tlbiAmJiB1c2VybmFtZSAmJiBjb2lucyl7XHJcblx0XHRzZWxlY3QuY2xhc3NMaXN0LnJlbW92ZSgnX2xvZ2luJyk7XHJcblx0XHRjb2luX2Jsb2NrLnRleHRDb250ZW50ID0gY29pbnM7XHJcblx0XHRfdXNlcm5hbWUudGV4dENvbnRlbnQgPSB1c2VybmFtZTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjb2luc191cGRhdGUodmFsdWUpe1xyXG5cdGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QnKTtcclxuXHRjb25zdCBjb2luX2Jsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvaW5zJyk7XHJcblx0aWYodmFsdWUpe1xyXG5cdFx0Y29pbl9ibG9jay50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG5cdH1cclxufVxyXG4iLCJmdW5jdGlvbiBzZW5kX2ltYWdlKCl7XHJcblx0Y29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcmVhdGUtZm9ybScpO1xyXG5cdGNvbnN0IGxvZ2luID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NpZ25faW4nKTtcclxuXHRpZihmb3JtKXtcclxuXHRcdGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpPT57XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0aWYodG9rZW4gJiYgdXNlcm5hbWUgJiYgY29pbnMpe1xyXG5cdFx0XHRcdFBPU1RfaW1hZ2UoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bG9naW4uY2xpY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxufVxyXG5cclxuc2VuZF9pbWFnZSgpO1xyXG4iLCJcclxuXHJcbmlmKCB3aW5kb3cuc2NyZWVuLndpZHRoIDwgODIwKXtcclxuXHRjb25zdCBzbGlkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdhbGxlcnknKTtcclxuXHRzbGlkZXJzLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuXHRcdGxldCB0cmFjayA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmdhbGxlcnlfX3RyYWNrJyk7XHJcblx0XHRsZXQgbGlzdCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmdhbGxlcnlfX2xpc3QnKTtcclxuXHRcdGxldCBzbGlkZXMgPSBpdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5nYWxsZXJ5X19zbGlkZScpO1xyXG5cclxuXHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnc3BsaWRlJyk7XHJcblx0XHR0cmFjay5jbGFzc0xpc3QuYWRkKCdzcGxpZGVfX3RyYWNrJyk7XHJcblx0XHRsaXN0LmNsYXNzTGlzdC5hZGQoJ3NwbGlkZV9fbGlzdCcpO1xyXG5cclxuXHRcdHNsaWRlcy5mb3JFYWNoKChzbGlkZSwgaSkgPT4ge3NsaWRlLmNsYXNzTGlzdC5hZGQoJ3NwbGlkZV9fc2xpZGUnKTtcdH0pO1xyXG5cclxuXHJcblx0fSk7XHJcblxyXG5cdHNsaWRlcnMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG5cdFx0bmV3IFNwbGlkZShpdGVtKS5tb3VudCgpXHJcblx0fSk7XHJcbn1cclxuIiwiXHJcblxyXG4vKl9fX19fX19fX19fX3RhYnNfX19fX19fKi9cclxuXHJcblxyXG5mdW5jdGlvbiBmX3RhYnMoKXtcclxuXHRjb25zdCB0YWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYnMnKTtcclxuXHJcblx0aWYodGFicyl7XHJcblx0XHRjb25zdCB0YWJzX2VsZW1zID0gdGFicy5xdWVyeVNlbGVjdG9yQWxsKCcudGFic19fdGFiJyk7XHJcblx0XHRjb25zdCB0YWJzX2NvbnQgPSB0YWJzLnF1ZXJ5U2VsZWN0b3IoJy50YWJzX19jb250ZW50JylcclxuXHRcdGNvbnN0IHRhYnNfdGl0bGUgPSB0YWJzLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpO1xyXG5cclxuXHJcblx0XHR2YXIgY29udGVudCA9IHtcclxuXHRcdFx0XCJfMVwiOltcIkxhc3QgbW9kaWZpZWQgZGF0ZTogTWF5IDE3LCAyMDIxXCIsIFwiTUVNQkVSU0hJUCBBTkQgQklMTElORy4gWW91IGhlcmVieSBhZ3JlZSB0aGF0LCB1cG9uIFlvdXIgc3Vic2NyaXB0aW9uIHRvIFBlcnNvbmVyYS5jb20sIGRlcGVuZGluZyBvbiB0aGUgbWVtYmVyc2hpcCBvcHRpb25zIFlvdSBjaG9vc2UsIFlvdSBtYXkgYmUgc3ViamVjdCB0byBjZXJ0YWluIGltbWVkaWF0ZSBhbmQgYXV0b21hdGljYWxseSByZWN1cnJpbmcgY2hhcmdlcyB3aGljaCBzaGFsbCBiZSBiaWxsZWQgdG8gWW91ciBjcmVkaXQgY2FyZCwgdW5sZXNzIFlvdSBjYW5jZWwgWW91ciBzdWJzY3JpcHRpb24gdW5kZXIgdGhlIHRlcm1zIGFuZCBjb25kaXRpb25zIG9mIHRoaXMgQWdyZWVtZW50LiBUaGUgY2hhcmdlcywgaWYgYW55LCB3aGljaCBZb3Ugd2lsbCBpbmN1ciwgYW5kIGhlcmVieSBhdXRob3JpemUsIGFyZSBhcyBmb2xsb3dzOlwiLCBcIihhKSBUcmlhbCBTdWJzY3JpcHRpb25zLiBZb3UgbWF5IHN1YnNjcmliZSB0byBwZXJzb25lcmEuY29tIGZvciBhIHNwZWNpZmljIHBlcmlvZCBvZiB0aW1lLCB1bmRlciB0aGUgdGhlbiBjdXJyZW50IGJpbGxpbmcgdGVybXMgKGFzIHNldCBmb3J0aCBvbiB0aGUgc2lnbi11cCBwYWdlIG9mIFBlcnNvbmVyYS5jb20pIChUcmlhbCBTdWJzY3JpcHRpb24pLlwiLCBcIihiKSBBdXRvbWF0aWMgUmVuZXdhbCBvZiBUcmlhbCBTdWJzY3JpcHRpb24gdG8gTW9udGhseSBNZW1iZXJzaGlwLiBBbGwgVHJpYWwgU3Vic2NyaXB0aW9ucyBzaGFsbCByZW5ldywgYXV0b21hdGljYWxseSBhbmQgd2l0aG91dCBub3RpY2UsIHRvIGEgTW9udGhseSBNZW1iZXJzaGlwLiBQYWlkIFRyaWFsIFN1YnNjcmlwdGlvbnMgd2lsbCByZW5ldyBtb250aGx5IGF0IHRoZSBNb250aGx5IE1lbWJlcnNoaXAgUmF0ZSBzZWxlY3RlZCBieSBZb3UuXCIsIFwiKGMpIEF1dG9tYXRpYyBSZW5ld2FsIG9mIE1vbnRobHkgTWVtYmVyc2hpcC4gQWxsIE1vbnRobHkgTWVtYmVyc2hpcHMgc2hhbGwgcmVuZXcsIGF1dG9tYXRpY2FsbHkgYW5kIHdpdGhvdXQgbm90aWNlLCBmb3Igc3VjY2Vzc2l2ZSBwZXJpb2RzIG9mIGFwcHJveGltYXRlbHkgb25lICgxKSBtb250aCwgY29tbWVuY2luZyB1cG9uIHRoZSBleHBpcmF0aW9uIG9mIHRoZSBUcmlhbCBTdWJzY3JpcHRpb24sIGFuZCBjb250aW51aW5nIHRoZXJlYWZ0ZXIgZm9yIHN1Y2Nlc3NpdmUgcGVyaW9kcyBvZiBhcHByb3hpbWF0ZWx5IG9uZSAoMSkgbW9udGgsIHVubGVzcyBhbmQgdW50aWwgdGhpcyBBZ3JlZW1lbnQgaXMgY2FuY2VsZWQgYnkgWW91IG9yIHRoZSBDb21wYW55IGluIGFjY29yZGFuY2Ugd2l0aCB0aGUgdGVybXMgaGVyZW9mLiBFYWNoIHBlcmlvZCBvZiBhcHByb3hpbWF0ZWx5IG9uZSAoMSkgbW9udGggc2hhbGwgYmUgcmVmZXJyZWQgdG8gYXMgdGhlICdNb250aGx5IFN1YnNjcmlwdGlvbiBQZXJpb2QuJ1wiLCBcIihkKSBDYW5jZWxsYXRpb24gYnkgQ29tcGFueS4gVGhlIENvbXBhbnkgbWF5LCBhdCBhbnkgdGltZSBhbmQgYXQgaXRzIHNvbGUgZGlzY3JldGlvbiwgY2FuY2VsIGFueSBUcmlhbCBNZW1iZXJzaGlwIG9yIE1vbnRobHkgTWVtYmVyc2hpcC5cIiwgXCIoZSkgQ2FuY2VsbGF0aW9uIG9mIEF1dG9tYXRpYyBSZW5ld2FsIG9mIFRyaWFsIFN1YnNjcmlwdGlvbiB0byBNb250aGx5IE1lbWJlcnNoaXAuIFRPIENBTkNFTCBBVVRPTUFUSUMgUkVORVdBTCBBVCBUSEUgRU5EIE9GIFRIRSBUUklBTCBTVUJTQ1JJUFRJT04sIFlPVSBNVVNUIE5PVElGWSBUSEUgQ09NUEFOWSBQUklPUiBUTyBUSEUgRU5EIE9GIFRIRSBUUklBTCBQRVJJT0QsIEJZIENPTlRBQ1RJTkcgVEhFIENPTVBBTlkgQlkgRS1NQUlMIE9SIFRFTEVQSE9ORS5cIiwgXCIoZikgQ2FuY2VsbGF0aW9uIG9mIEF1dG9tYXRpYyBSZW5ld2FsIG9mIE1vbnRobHkgTWVtYmVyc2hpcC4gVE8gQ0FOQ0VMIEFVVE9NQVRJQyBSRU5FV0FMIE9GIFlPVVIgTU9OVEhMWSBNRU1CRVJTSElQIEFUIEFOWSBUSU1FLCBZT1UgTVVTVCBOT1RJRlkgVEhFIENPTVBBTlkgQlkgRS1NQUlMIE9SIFRFTEVQSE9ORSwuXCIsIFwiKGcpIENhbmNlbGxhdGlvbnMgRWZmZWN0aXZlIFVwb24gUmVjZWlwdCBCeSBDb21wYW55LiBBbGwgY2FuY2VsbGF0aW9ucyByZWNlaXZlZCBieSB0aGUgQ29tcGFueSB3aWxsIGJlIGVmZmVjdGl2ZSB1cG9uIHJlY2VpcHQuXCIsIFwiKGgpIENyZWRpdCBDYXJkIENoYXJnZXMgQXV0aG9yaXplZC4gSWYgeW91IHNlbGVjdCBhbnkgcGFpZCBUcmlhbCBvciBNb250aGx5IFN1YnNjcmlwdGlvbnMsIFlvdSBoZXJlYnkgYXV0aG9yaXplIHRoZSBDb21wYW55IHRvIGNoYXJnZSBZb3VyIGNyZWRpdCBjYXJkICh3aGljaCBZb3UgaGVyZWJ5IGFja25vd2xlZGdlIHdhcyBlbnRlcmVkIGJ5IFlvdSBpbnRvIHRoZSBzaWduLXVwIHBhZ2UpIHRvIHBheSBmb3IgdGhlIG9uZ29pbmcgU3Vic2NyaXB0aW9uIEZlZXMgdG8gcGVyc29uZXJhLmNvbSBhdCB0aGUgdGhlbiBjdXJyZW50IFN1YnNjcmlwdGlvbiBSYXRlLiBZb3UgZnVydGhlciBhdXRob3JpemUgdGhlIENvbXBhbnkgdG8gY2hhcmdlIFlvdXIgY3JlZGl0IGNhcmQgZm9yIGFueSBhbmQgYWxsIHB1cmNoYXNlcyBvZiBwcm9kdWN0cywgc2VydmljZXMgYW5kIGVudGVydGFpbm1lbnQgYXZhaWxhYmxlIHRocm91Z2gsIGF0LCBpbiBvciBvbiwgb3IgcHJvdmlkZWQgYnksIHBlcnNvbmVyYS5jb20uIFlvdSBhZ3JlZSB0byBiZSBwZXJzb25hbGx5IGxpYWJsZSBmb3IgYWxsIGNoYXJnZXMgaW5jdXJyZWQgYnkgWW91IGR1cmluZyBvciB0aHJvdWdoIHRoZSB1c2Ugb2YgcGVyc29uZXJhLmNvbS4gWW91ciBsaWFiaWxpdHkgZm9yIHN1Y2ggY2hhcmdlcyBzaGFsbCBjb250aW51ZSBhZnRlciB0ZXJtaW5hdGlvbiBvZiBZb3VyIG1lbWJlcnNoaXAuXCIsIFwiKGkpIEF1dG9tYXRpYyBDcmVkaXQgQ2FyZCBvciBEZWJpdCBDYXJkIERlYml0LiBBbGwgY2hhcmdlcyB0byBZb3VyIGNyZWRpdCBjYXJkIG9yIGRlYml0IGNhcmQgZm9yIFBhaWQgVHJhaWwgU3Vic2NyaXB0aW9uIGFuZC9vciB0aGUgTW9udGhseSBNZW1iZXJzaGlwLCB1bmRlciB0aGUgdGVybXMgYW5kIGNvbmRpdGlvbnMgb2YgdGhpcyBBZ3JlZW1lbnQsIHdpbGwgYmUgbWFkZSBpbiBhZHZhbmNlIGJ5IGF1dG9tYXRpYyBjcmVkaXQgY2FyZCBvciBkZWJpdCBjYXJkIGRlYml0IGFuZCB5b3UgaGVyZWJ5IGF1dGhvcml6ZSB0aGUgQ29tcGFueSBhbmQgaXRzIGFnZW50cyB0byBwcm9jZXNzIHN1Y2ggdHJhbnNhY3Rpb25zIG9uIFlvdXIgYmVoYWxmLlwiLCBcIihqKSBCaWxsaW5nIFN1cHBvcnQuIFlvdSBtYXkgYWNjZXNzIHRoZSBjdXN0b21lciBzdXBwb3J0IGRlcGFydG1lbnQgYnkgZW1haWxpbmcgc3VwcG9ydCwgRU1BSUxcIiwgXCIoaikgYWxsIHF1ZXN0aW9ucyByZWdhcmRpbmcgYmlsbGluZyBmb3IgdGhlIHNpdGUgbWVtYmVyc2hpcFwiLCBcIihqaikgaG93IHRvIHJlcXVlc3QgYSByZWZ1bmQuXCJdLFxyXG5cdFx0XHRcIl8yXCI6W1wiQXV0b21hdGljIFJlbmV3YWwgb2YgVHJpYWwgU3Vic2NyaXB0aW9uIHRvIE1vbnRobHkgTWVtYmVyc2hpcC4gQWxsIFRyaWFsIFN1YnNjcmlwdGlvbnMgc2hhbGwgcmVuZXcsIGF1dG9tYXRpY2FsbHkgYW5kIHdpdGhvdXQgbm90aWNlLCB0byBhIE1vbnRobHkgTWVtYmVyc2hpcC4gUGFpZCBUcmlhbCBTdWJzY3JpcHRpb25zIHdpbGwgcmVuZXcgbW9udGhseSBhdCB0aGUgTW9udGhseSBNZW1iZXJzaGlwIFJhdGUgc2VsZWN0ZWQgYnkgWW91LlwiLCBcIihjKSBBdXRvbWF0aWMgUmVuZXdhbCBvZiBNb250aGx5IE1lbWJlcnNoaXAuIEFsbCBNb250aGx5IE1lbWJlcnNoaXBzIHNoYWxsIHJlbmV3LCBhdXRvbWF0aWNhbGx5IGFuZCB3aXRob3V0IG5vdGljZSwgZm9yIHN1Y2Nlc3NpdmUgcGVyaW9kcyBvZiBhcHByb3hpbWF0ZWx5IG9uZSAoMSkgbW9udGgsIGNvbW1lbmNpbmcgdXBvbiB0aGUgZXhwaXJhdGlvbiBvZiB0aGUgVHJpYWwgU3Vic2NyaXB0aW9uLCBhbmQgY29udGludWluZyB0aGVyZWFmdGVyIGZvciBzdWNjZXNzaXZlIHBlcmlvZHMgb2YgYXBwcm94aW1hdGVseSBvbmUgKDEpIG1vbnRoLCB1bmxlc3MgYW5kIHVudGlsIHRoaXMgQWdyZWVtZW50IGlzIGNhbmNlbGVkIGJ5IFlvdSBvciB0aGUgQ29tcGFueSBpbiBhY2NvcmRhbmNlIHdpdGggdGhlIHRlcm1zIGhlcmVvZi4gRWFjaCBwZXJpb2Qgb2YgYXBwcm94aW1hdGVseSBvbmUgKDEpIG1vbnRoIHNoYWxsIGJlIHJlZmVycmVkIHRvIGFzIHRoZSAnTW9udGhseSBTdWJzY3JpcHRpb24gUGVyaW9kLidcIiwgXCIoZCkgQ2FuY2VsbGF0aW9uIGJ5IENvbXBhbnkuIFRoZSBDb21wYW55IG1heSwgYXQgYW55IHRpbWUgYW5kIGF0IGl0cyBzb2xlIGRpc2NyZXRpb24sIGNhbmNlbCBhbnkgVHJpYWwgTWVtYmVyc2hpcCBvciBNb250aGx5IE1lbWJlcnNoaXAuXCIsIFwiKGUpIENhbmNlbGxhdGlvbiBvZiBBdXRvbWF0aWMgUmVuZXdhbCBvZiBUcmlhbCBTdWJzY3JpcHRpb24gdG8gTW9udGhseSBNZW1iZXJzaGlwLiBUTyBDQU5DRUwgQVVUT01BVElDIFJFTkVXQUwgQVQgVEhFIEVORCBPRiBUSEUgVFJJQUwgU1VCU0NSSVBUSU9OLCBZT1UgTVVTVCBOT1RJRlkgVEhFIENPTVBBTlkgUFJJT1IgVE8gVEhFIEVORCBPRiBUSEUgVFJJQUwgUEVSSU9ELCBCWSBDT05UQUNUSU5HIFRIRSBDT01QQU5ZIEJZIEUtTUFJTCBPUiBURUxFUEhPTkUuXCIsIFwiKGYpIENhbmNlbGxhdGlvbiBvZiBBdXRvbWF0aWMgUmVuZXdhbCBvZiBNb250aGx5IE1lbWJlcnNoaXAuIFRPIENBTkNFTCBBVVRPTUFUSUMgUkVORVdBTCBPRiBZT1VSIE1PTlRITFkgTUVNQkVSU0hJUCBBVCBBTlkgVElNRSwgWU9VIE1VU1QgTk9USUZZIFRIRSBDT01QQU5ZIEJZIEUtTUFJTCBPUiBURUxFUEhPTkUsLlwiLCBcIihnKSBDYW5jZWxsYXRpb25zIEVmZmVjdGl2ZSBVcG9uIFJlY2VpcHQgQnkgQ29tcGFueS4gQWxsIGNhbmNlbGxhdGlvbnMgcmVjZWl2ZWQgYnkgdGhlIENvbXBhbnkgd2lsbCBiZSBlZmZlY3RpdmUgdXBvbiByZWNlaXB0LlwiLCBcIihoKSBDcmVkaXQgQ2FyZCBDaGFyZ2VzIEF1dGhvcml6ZWQuIElmIHlvdSBzZWxlY3QgYW55IHBhaWQgVHJpYWwgb3IgTW9udGhseSBTdWJzY3JpcHRpb25zLCBZb3UgaGVyZWJ5IGF1dGhvcml6ZSB0aGUgQ29tcGFueSB0byBjaGFyZ2UgWW91ciBjcmVkaXQgY2FyZCAod2hpY2ggWW91IGhlcmVieSBhY2tub3dsZWRnZSB3YXMgZW50ZXJlZCBieSBZb3UgaW50byB0aGUgc2lnbi11cCBwYWdlKSB0byBwYXkgZm9yIHRoZSBvbmdvaW5nIFN1YnNjcmlwdGlvbiBGZWVzIHRvIHBlcnNvbmVyYS5jb20gYXQgdGhlIHRoZW4gY3VycmVudCBTdWJzY3JpcHRpb24gUmF0ZS4gWW91IGZ1cnRoZXIgYXV0aG9yaXplIHRoZSBDb21wYW55IHRvIGNoYXJnZSBZb3VyIGNyZWRpdCBjYXJkIGZvciBhbnkgYW5kIGFsbCBwdXJjaGFzZXMgb2YgcHJvZHVjdHMsIHNlcnZpY2VzIGFuZCBlbnRlcnRhaW5tZW50IGF2YWlsYWJsZSB0aHJvdWdoLCBhdCwgaW4gb3Igb24sIG9yIHByb3ZpZGVkIGJ5LCBwZXJzb25lcmEuY29tLiBZb3UgYWdyZWUgdG8gYmUgcGVyc29uYWxseSBsaWFibGUgZm9yIGFsbCBjaGFyZ2VzIGluY3VycmVkIGJ5IFlvdSBkdXJpbmcgb3IgdGhyb3VnaCB0aGUgdXNlIG9mIHBlcnNvbmVyYS5jb20uIFlvdXIgbGlhYmlsaXR5IGZvciBzdWNoIGNoYXJnZXMgc2hhbGwgY29udGludWUgYWZ0ZXIgdGVybWluYXRpb24gb2YgWW91ciBtZW1iZXJzaGlwLlwiLCBcIihpKSBBdXRvbWF0aWMgQ3JlZGl0IENhcmQgb3IgRGViaXQgQ2FyZCBEZWJpdC4gQWxsIGNoYXJnZXMgdG8gWW91ciBjcmVkaXQgY2FyZCBvciBkZWJpdCBjYXJkIGZvciBQYWlkIFRyYWlsIFN1YnNjcmlwdGlvbiBhbmQvb3IgdGhlIE1vbnRobHkgTWVtYmVyc2hpcCwgdW5kZXIgdGhlIHRlcm1zIGFuZCBjb25kaXRpb25zIG9mIHRoaXMgQWdyZWVtZW50LCB3aWxsIGJlIG1hZGUgaW4gYWR2YW5jZSBieSBhdXRvbWF0aWMgY3JlZGl0IGNhcmQgb3IgZGViaXQgY2FyZCBkZWJpdCBhbmQgeW91IGhlcmVieSBhdXRob3JpemUgdGhlIENvbXBhbnkgYW5kIGl0cyBhZ2VudHMgdG8gcHJvY2VzcyBzdWNoIHRyYW5zYWN0aW9ucyBvbiBZb3VyIGJlaGFsZi5cIiwgXCIoaikgQmlsbGluZyBTdXBwb3J0LiBZb3UgbWF5IGFjY2VzcyB0aGUgY3VzdG9tZXIgc3VwcG9ydCBkZXBhcnRtZW50IGJ5IGVtYWlsaW5nIHN1cHBvcnQsIEVNQUlMXCIsIFwiKGopIGFsbCBxdWVzdGlvbnMgcmVnYXJkaW5nIGJpbGxpbmcgZm9yIHRoZSBzaXRlIG1lbWJlcnNoaXBcIiwgXCIoamopIGhvdyB0byByZXF1ZXN0IGEgcmVmdW5kLlwiXSxcclxuXHRcdFx0XCJfM1wiOltcIkxhc3QgbW9kaWZpZWQgZGF0ZTogTWF5IDE3LCAyMDIxXCIsIFwiTUVNQkVSU0hJUCBBTkQgQklMTElORy4gWW91IGhlcmVieSBhZ3JlZSB0aGF0LCB1cG9uIFlvdXIgc3Vic2NyaXB0aW9uIHRvIFBlcnNvbmVyYS5jb20sIGRlcGVuZGluZyBvbiB0aGUgbWVtYmVyc2hpcCBvcHRpb25zIFlvdSBjaG9vc2UsIFlvdSBtYXkgYmUgc3ViamVjdCB0byBjZXJ0YWluIGltbWVkaWF0ZSBhbmQgYXV0b21hdGljYWxseSByZWN1cnJpbmcgY2hhcmdlcyB3aGljaCBzaGFsbCBiZSBiaWxsZWQgdG8gWW91ciBjcmVkaXQgY2FyZCwgdW5sZXNzIFlvdSBjYW5jZWwgWW91ciBzdWJzY3JpcHRpb24gdW5kZXIgdGhlIHRlcm1zIGFuZCBjb25kaXRpb25zIG9mIHRoaXMgQWdyZWVtZW50LiBUaGUgY2hhcmdlcywgaWYgYW55LCB3aGljaCBZb3Ugd2lsbCBpbmN1ciwgYW5kIGhlcmVieSBhdXRob3JpemUsIGFyZSBhcyBmb2xsb3dzOlwiLCBcIkxhc3QgbW9kaWZpZWQgZGF0ZTogTWF5IDE3LCAyMDIxXCIsIFwiTUVNQkVSU0hJUCBBTkQgQklMTElORy4gWW91IGhlcmVieSBhZ3JlZSB0aGF0LCB1cG9uIFlvdXIgc3Vic2NyaXB0aW9uIHRvIFBlcnNvbmVyYS5jb20sIGRlcGVuZGluZyBvbiB0aGUgbWVtYmVyc2hpcCBvcHRpb25zIFlvdSBjaG9vc2UsIFlvdSBtYXkgYmUgc3ViamVjdCB0byBjZXJ0YWluIGltbWVkaWF0ZSBhbmQgYXV0b21hdGljYWxseSByZWN1cnJpbmcgY2hhcmdlcyB3aGljaCBzaGFsbCBiZSBiaWxsZWQgdG8gWW91ciBjcmVkaXQgY2FyZCwgdW5sZXNzIFlvdSBjYW5jZWwgWW91ciBzdWJzY3JpcHRpb24gdW5kZXIgdGhlIHRlcm1zIGFuZCBjb25kaXRpb25zIG9mIHRoaXMgQWdyZWVtZW50LiBUaGUgY2hhcmdlcywgaWYgYW55LCB3aGljaCBZb3Ugd2lsbCBpbmN1ciwgYW5kIGhlcmVieSBhdXRob3JpemUsIGFyZSBhcyBmb2xsb3dzOlwiLCBcIkxhc3QgbW9kaWZpZWQgZGF0ZTogTWF5IDE3LCAyMDIxXCIsIFwiTUVNQkVSU0hJUCBBTkQgQklMTElORy4gWW91IGhlcmVieSBhZ3JlZSB0aGF0LCB1cG9uIFlvdXIgc3Vic2NyaXB0aW9uIHRvIFBlcnNvbmVyYS5jb20sIGRlcGVuZGluZyBvbiB0aGUgbWVtYmVyc2hpcCBvcHRpb25zIFlvdSBjaG9vc2UsIFlvdSBtYXkgYmUgc3ViamVjdCB0byBjZXJ0YWluIGltbWVkaWF0ZSBhbmQgYXV0b21hdGljYWxseSByZWN1cnJpbmcgY2hhcmdlcyB3aGljaCBzaGFsbCBiZSBiaWxsZWQgdG8gWW91ciBjcmVkaXQgY2FyZCwgdW5sZXNzIFlvdSBjYW5jZWwgWW91ciBzdWJzY3JpcHRpb24gdW5kZXIgdGhlIHRlcm1zIGFuZCBjb25kaXRpb25zIG9mIHRoaXMgQWdyZWVtZW50LiBUaGUgY2hhcmdlcywgaWYgYW55LCB3aGljaCBZb3Ugd2lsbCBpbmN1ciwgYW5kIGhlcmVieSBhdXRob3JpemUsIGFyZSBhcyBmb2xsb3dzOlwiXSxcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0dGFic19lbGVtcy5mb3JFYWNoKChlbCwgaSk9PntcclxuXHRcdFx0ZWwub25jbGljayA9ICgpPT57XHJcblx0XHRcdFx0cmVtX2NsYXNzZXModGFic19lbGVtcyk7XHJcblx0XHRcdFx0ZWwuY2xhc3NMaXN0LmFkZCgnX2FjdGl2ZScsIGBfJHtpKzF9YCk7XHJcblx0XHRcdFx0Y2hlY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRmdW5jdGlvbiByZW1fY2xhc3NlcyhlbGVtcyl7XHJcblx0XHRcdGVsZW1zLmZvckVhY2goZWw9PmVsLmNsYXNzTGlzdC5yZW1vdmUoJ19hY3RpdmUnKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gY2hlY2soKXtcclxuXHRcdFx0bGV0IGFjdGl2ZSA9ICcnO1xyXG5cclxuXHRcdFx0dGFic19lbGVtcy5mb3JFYWNoKChlbCwgaW5kZXgpPT57XHJcblx0XHRcdFx0aWYoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdfYWN0aXZlJykpe1xyXG5cdFx0XHRcdFx0YWN0aXZlID0gaW5kZXgrMTtcclxuXHRcdFx0XHRcdGxldCB0ZXh0ID0gZWwudGV4dENvbnRlbnQ7XHJcblx0XHRcdFx0XHR0YWJzX3RpdGxlLnRleHRDb250ZW50ID0gdGV4dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRhZGRfY29udGVudChgXyR7YWN0aXZlfWApO1xyXG5cdFx0fVxyXG5cdFx0Y2hlY2soKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhZGRfY29udGVudChjb250ZW50X25hbWUpe1xyXG5cdFx0XHR0YWJzX2NvbnQucXVlcnlTZWxlY3RvckFsbCgnLnRleHQnKS5mb3JFYWNoKGVsPT5lbC5yZW1vdmUoKSk7XHJcblx0XHRcdGNvbnRlbnRbY29udGVudF9uYW1lXS5mb3JFYWNoKGVsPT57XHJcblx0XHRcdFx0dGFic19jb250Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlRW5kJywgYDxwIGNsYXNzPVwidGV4dFwiPiR7ZWx9PC9wPmApO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5mX3RhYnMoKTtcclxuIiwiZnVuY3Rpb24gdXBkYXRlX2ltZygpe1xyXG5cdGNvbnN0IGlucF9pbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY3JlYXRlLWZvcm1faW1nJyk7XHJcblx0Y29uc3QgYmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3JlYXRlLWZvcm1fX2Jsb2NrJyk7XHJcblxyXG5cdGlmKGlucF9pbWcpe1xyXG5cclxuXHRcdGlucF9pbWcub25jaGFuZ2U9IChlKT0+e1xyXG5cdFx0XHRnZXRCYXNlNjQoaW5wX2ltZy5maWxlc1swXSk7XHJcblx0XHRcdGltZ19wcmV2aWV3KGlucF9pbWcsIGlucF9pbWcuZmlsZXNbMF0sIGJsb2NrKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59XHJcblxyXG51cGRhdGVfaW1nKCk7XHJcblxyXG5cclxuXHJcbi8vIGZ1bmNzX19fX19fX1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEJhc2U2NChmaWxlKSB7XHJcbiAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICBpbWdfYmFzZV82NCA9IHJlYWRlci5yZXN1bHQ7XHJcbiAgICAgaW1nX2Jhc2VfNjQgPSBbaW1nX2Jhc2VfNjQuc3BsaXQoXCIsXCIpWzFdXTtcclxuICAgfTtcclxuICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycm9yKTtcclxuICAgfTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGltZ19wcmV2aWV3KGZpbGUsIGltZywgYmxvY2spe1xyXG5cdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cdHJlYWRlci5yZWFkQXNEYXRhVVJMKGltZyk7XHJcblx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRhZGQoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XHJcblx0XHRyZW1vdmUoKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZChzcmMpe1xyXG5cdFx0YmxvY2suaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgYDxkaXYgY2xhc3M9XCJjcmVhdGUtZm9ybV9fcHJldmlld1wiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY3JlYXRlSW1nLXJlbW92ZS1idG5cIj7DlzwvZGl2PlxyXG5cdFx0XHQ8aW1nIHNyYz1cIiR7ZXZlbnQudGFyZ2V0LnJlc3VsdH1cIi8+XHJcblx0XHQ8L2Rpdj5gKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVtb3ZlKCl7XHJcblx0XHRjb25zdCByZW1vdmVfYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNyZWF0ZUltZy1yZW1vdmUtYnRuJyk7XHJcblxyXG5cdFx0cmVtb3ZlX2J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XHJcblx0XHRcdHJlbW92ZV9idG4ucGFyZW50Tm9kZS5yZW1vdmUoKTtcclxuXHRcdFx0aW1nX2Jhc2VfNjQgPSBudWxsO1xyXG5cdFx0XHRmaWxlLnZhbHVlID0gJyc7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG59XHJcbiJdfQ==