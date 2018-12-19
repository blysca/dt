const cumulativeOffset = function (element) {
  var top = 0, left = 0;
  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return {
    top: top,
    left: left
  };
};

var dropmic = new Dropmic(document.querySelector('[data-dropmic="1"]'), {
  onOpen: function () {
  },
  onClose: function () {
  }
});

const formBtns = document.querySelectorAll(".js-btn-contact");
for (let i = 0; i < formBtns.length; i++) {
  let current = formBtns[i];
  current.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.js-form').classList.add('active');
  }, false);
}

const mobNavList = document.querySelectorAll("#navList .nav-link");
for (let i = 0; i < mobNavList.length; i++) {
  let navLink = mobNavList[i];
  navLink.addEventListener('click', function () {
    let parent = document.querySelector('.js-nav-list');
    parent.classList.remove('active');
    setTimeout(function () {
      window.scrollBy(0, 5);
    }, 850)
  }, false);
}

const burgers = document.querySelectorAll('.js-burger');
for (let i = 0, len = burgers.length; i < len; i++) {
  let b = burgers[i];

  b.addEventListener('click', function (e) {
    e.preventDefault();
    bPositions = cumulativeOffset(b);
    document.querySelector('.js-burger-close').style.left = (bPositions.left - 4) + 'px';
    document.querySelector('.js-nav-list').classList.add('active');
  }, false);
}

document.querySelector('.js-burger-close').addEventListener('click', function (e) {
  e.preventDefault();
  document.querySelector('.js-nav-list').classList.remove('active');
}, false);
document.body.querySelector('.js-form-btn-close').addEventListener('click', function () {
  document.querySelector('.js-form').classList.remove('active');
}, false);

function scrollSpyFx(el) {
  const offsetTop = el.offsetTop;

  window.addEventListener("scroll", function () {
    var scroll = this.scrollY;

    if (scroll >= offsetTop) {
      if (!el.classList.contains('fixed')) {
        el.classList.add('fixed')
      }
    } else {
      el.classList.remove('fixed')
    }
  });
}

scrollSpyFx(document.querySelector('.js-scroll-spy'));

const navbar = document.querySelector('#navList');
const scrollspy = new VanillaScrollspy(navbar);
scrollspy.init();

function scrollIt(element) {
  window.scrollTo({
    'behavior': 'smooth',
    'left': 0,
    'top': element.offsetTop
  });
}

const heroBtn = document.querySelector('.js-hero-scroll-down');
const heroBtnDirection = document.querySelector('#s1');

heroBtn.addEventListener('click', function () {
  scrollIt(heroBtnDirection);
}, false);

const logoBtns = document.querySelectorAll('.js-scroll-to-hero');
const heroSection = document.getElementById('hero');

for (let i = 0; i < logoBtns.length; i++) {
  let lg = logoBtns[i];
  lg.addEventListener('click', function () {
    scrollIt(heroSection);

    let parent = document.querySelector('.js-nav-list');
    parent.classList.remove('active');
  }, false);
}

window.onload = function () {

  const form = document.getElementById("msg");

  const defaultConfig = {
    classTo: 'form-group',
    errorClass: 'has-danger',
    successClass: 'has-success',
    errorTextParent: 'form-group',
    errorTextTag: 'div',
    errorTextClass: 'text-help'
  };

  const pristine = new Pristine(form, defaultConfig);

  form.addEventListener('submit', function (e) {
    var valid = pristine.validate();
    console.log('Form is valid: ' + valid);
    e.preventDefault();
    let response = grecaptcha.getResponse();

    if (valid && response) {
      const data = {
        "email": this.email.value,
        "name": this.name.value,
        "dscr": this.dscr.value,
        "response": response
      };
      document.querySelectorAll('.has-success').forEach(function (item) {
        item.classList.remove('has-success');
      });

      document.querySelectorAll('.has-danger').forEach(function (item) {
        item.classList.remove('has-danger');
      });

      sendData(data);

      setTimeout(function () {
        form.reset();
        grecaptcha.reset('6Ld6oIEUAAAAAGhuOay1FYy-6v2WtRmSDyX98CLZ');
        document.querySelector('.js-form-valid').classList.remove('validation-success');
        document.querySelector('.js-form-btn-close').click();
      }, 5000)
    }
  });
};


function sendData(data) {
  var XHR = new XMLHttpRequest();
  var urlEncodedData = "";
  var urlEncodedDataPairs = [];
  var name;

  for (name in data) {
    urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  }
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
  XHR.addEventListener('load', function () {
    document.querySelector('.js-form-invalid').classList.remove('validation-error');
    document.querySelector('.js-form-valid').classList.add('validation-success');
  });

  XHR.addEventListener('error', function () {
    document.querySelector('.js-form-valid').classList.remove('validation-success');
    document.querySelector('.js-form-invalid').classList.add('validation-error');
  });

  XHR.open('POST', 'feedback.php');

  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  XHR.send(urlEncodedData);
}

function correctCaptcha() {
  //console.log('*bububu*');
  document.querySelector('.js-form-captcha.form-group').classList.add('has-success');
}
