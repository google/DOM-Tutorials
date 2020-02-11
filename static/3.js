/**
 * @license
 * Copyright 2013-2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

/**
 * Code for Tutorial 3.
 * @author fraser@google.com (Neil Fraser)
 */

Tutorial.pageInit = function() {
  Tutorial.setup1();
  Tutorial.setup2();
  Tutorial.setup3();
  Tutorial.setup4();
  Tutorial.setup5();
  Tutorial.setup6();
  // Section 4 demo star.
  var handler = function(e) {
    console.log(e);
  };
  document.getElementById('event_star').addEventListener('click', handler, false);
};

Tutorial.check = [];
Tutorial.check[1] = function() {
  var first = document.getElementById('first');
  if (typeof first.onclick == 'function') {
    first.onclick();
    var c = ((window.getComputedStyle &&
        window.getComputedStyle(first)['background-color']) ||
        first.style.background || first.style.backgroundColour).toLowerCase();
    document.getElementById('execute1').style.backgroundColor = c;
    if (c == '#ff8' || c == '#ffff88' || c == 'rgb(255, 255, 136)') {
      return true;
    }
  }
  return false;
};
Tutorial.check[2] = function() {
  var w3c = document.getElementById('w3c');
  if (w3c.handlers.length < 1) {
    alert('You need to call addEventListener.');
    return false;
  }
  var success = false;
  for (var x = 0; x < w3c.handlers.length; x++) {
    w3c.handlers[x].call(w3c);
  }
  var c = ((window.getComputedStyle &&
      window.getComputedStyle(w3c)['background-color']) ||
      w3c.style.background || w3c.style.backgroundColour).toLowerCase();
  document.getElementById('execute2').style.backgroundColor = c;
  if (c == '#ff8' || c == '#ffff88' || c == 'rgb(255, 255, 136)') {
    return true;
  }
  return success;
};
Tutorial.check[3] = null;
Tutorial.check[4] = function() {
  var table = document.getElementById('star_table');
  var children = table.getElementsByTagName('*');
  var onStars = 0;
  var onOther = 0;
  for (var x = 0, child; child = children[x]; x++) {
    if (child.src && child.src.match(/star_on\.gif$/)) {
      if (child.tagName == 'IMG') {
        onStars++;
      } else {
        onOther++;
      }
    }
  }
  if (onStars > 2) {
    if (onOther > 0) {
      return false;
    }
    return true;
  }
  return null;
};
Tutorial.check[5] = function() {
  var phone = document.getElementById('phone');
  if (phone.handlers.length < 1) {
    alert('You need to call addEventListener.');
    return false;
  }
  if (phone.handlers.length > 1) {
    alert('Why do you have more than one event listener?.');
    return false;
  }
  var func = phone.handlers[0];
  var prevented = false;
  var e = {
    preventDefault: function() {prevented = true},
    charCode: '5'.charCodeAt(0)
  };
  func(e);
  if (prevented) {
    return false;
  }
  e.charCode = 'M'.charCodeAt(0);
  func(e);
  if (!prevented) {
    return false;
  }
  return true;
};

Tutorial.checkOnClick = function(n) {
  var code = document.getElementById('code' + n).getValue();
  if (code.indexOf('onclick') != -1) {
    alert('Bad programmer!\nYou are not suposed to be using "onclick"!');
    return false;
  }
  return true;
};

Tutorial.setup1 = function() {
  // Destroy the button and rebuild it to get rid of any handlers.
  var container = document.getElementById('playground1');
  container.innerHTML = '';
  // <button id="first">Execute</button>
  var button = document.createElement('button');
  button.id = 'first';
  button.appendChild(document.createTextNode('Execute'));
  container.appendChild(button);
};

Tutorial.setup2 = function() {
  // Destroy the button and rebuild it to get rid of any handlers.
  var container = document.getElementById('playground2');
  container.innerHTML = '';
  // <button id="w3c">Execute</button>
  var button = document.createElement('button');
  button.id = 'w3c';
  button.appendChild(document.createTextNode('Execute'));
  container.appendChild(button);

  button.handlers = [];
  button.addEventListener = function(type, func, bool) {
    if (type == 'click') {
      if (typeof func == 'function') {
        button.handlers.push(func);
      } else {
        alert('The second argument of addEventListener should be a function.');
      }
    } else {
      alert('For this lesson you want to be adding "click" handlers, not "' + type + '".');
    }
  };
};

Tutorial.setup3 = function() {
  // Destroy the star and rebuild it to get rid of any handlers.
  var container = document.getElementById('playground3');
  container.innerHTML = '';
  // <img id="once_star" src="star_on.gif">
  var star = document.createElement('img');
  star.id = 'once_star';
  star.src = 'star_on.gif';
  container.appendChild(star);
};

Tutorial.resetSection3 = function() {
  var doneSuccessfully = false;
  Tutorial.setCorrect(3, null);
  var once_star = document.getElementById('once_star');
  once_star.addEventListener('click', function() {
      var oldHandlers = [].concat(once_star.handlers);
      for (var x = 0; x < oldHandlers.length; x++) {
        oldHandlers[x].call(once_star);
      }
      if (!doneSuccessfully) {
        var success = oldHandlers.length > once_star.handlers.length;
        Tutorial.setCorrect(3, success);
        if (success) {
          doneSuccessfully = true;
          Tutorial.setup3();
          Tutorial.showDiv('solution3', document.getElementById('giveup3'));
        }
      }
    }, false);
  once_star.handlers = [];
  once_star.addEventListener = function(type, func, bool) {
    if (type == 'click') {
      if (typeof func == 'function') {
        once_star.handlers.push(func);
      } else {
        alert('The second argument of addEventListener should be a function.');
      }
    } else {
      alert('For this lesson you want to be adding "click" handlers, not "' + type + '".');
    }
  };
  once_star.removeEventListener = function(type, func, bool) {
    if (type == 'click') {
      if (typeof func == 'function') {
        for (var x = this.handlers.length - 1; x >= 0; x--) {
          if (func == this.handlers[x]) {
            once_star.handlers.splice(x, 1);
          }
        }
      } else {
        alert('The second argument of removeEventListener should be a function.');
      }
    } else {
      alert('For this lesson you want to be adding "click" handlers, not "' + type + '".');
    }
  };
  var code = document.getElementById('code3').getValue();
  Tutorial.eval(code);
  alert('Ok, your code has been executed.\n\nTest it by clicking the star to see an alert,\nthen clicking it again to see no alert.');
};

Tutorial.setup4 = function() {
  // Destroy the star grid and rebuild it to get rid of any handlers.
  var container = document.getElementById('playground4');
  container.innerHTML = '';
  //  <table id="star_table"></table>
  var table = document.createElement('table');
  table.id = 'star_table';
  container.appendChild(table);
  for (var y = 0; y < 10; y++) {
    var row = document.createElement('tr');
    table.appendChild(row);
    for (var x = 0; x < 10; x++) {
      var cell = document.createElement('td');
      var img = document.createElement('img');
      row.appendChild(cell);
      cell.appendChild(img);
      img.src = 'star_off.gif';
    }
  }
};

Tutorial.resetSection4 = function() {
  if (Tutorial.interval4) {
    window.clearInterval(Tutorial.interval4);
  }
  Tutorial.setCorrect(4, null);
  var code = document.getElementById('code4').getValue();
  Tutorial.eval(code);
  // Monitor the table twice a second.
  Tutorial.interval4 = window.setInterval(function() {
    var success = Tutorial.check[4]();
    if (success !== null) {
      window.clearInterval(Tutorial.interval4);
      Tutorial.setCorrect(4, success);
      if (success) {
        Tutorial.showDiv('solution4', document.getElementById('giveup4'));
      } else {
        alert('Almost correct.  But in addition to setting the\n' +
              'src on images,you\'ve also set a src porperty\n' +
              'on the table\'s cells and rows.');
      }
    }
  }, 0.5);
};

Tutorial.setup5 = function() {
  // Destroy the input and rebuild it to get rid of any handlers.
  var container = document.getElementById('playground5');
  container.innerHTML = '';
  //  <input id="phone">
  var phone = document.createElement('input');
  phone.id = 'phone';
  container.appendChild(phone);
};

Tutorial.resetSection5 = function() {
  Tutorial.setCorrect(5, null);
  var phone = document.getElementById('phone');
  // Mock addEventListener.
  phone.handlers = [];
  phone.realAddEventListener = phone.addEventListener;
  phone.addEventListener = function(type, func, bool) {
    phone.realAddEventListener(type, func, bool);
    if (type == 'keypress') {
      if (typeof func == 'function') {
        phone.handlers.push(func);
      } else {
        alert('The second argument of addEventListener should be a function.');
      }
    } else {
      alert('For this lesson you want to be adding "keypress" handlers, not "' + type + '".');
    }
  };
};

Tutorial.setup6 = function() {
  // Destroy Tux and the menu. and rebuild them to get rid of any handlers.
  var container = document.getElementById('playground6');
  container.innerHTML = '';
  // <img id="tux" src="tux.png">
  var tux = document.createElement('img');
  tux.src = 'tux.png';
  tux.id = 'tux';
  container.appendChild(tux);

  /*
    <div id="menu">
      <div id="option1">Photograph</div>
      <div id="option2">Rub belly</div>
      <div id="option3">Feed a fish</div>
    </div>
  */
  var menu = document.createElement('div');
  menu.id = 'menu';
  var option = document.createElement('div');
  option.id = 'option1';
  option.appendChild(document.createTextNode('Photograph'));
  menu.appendChild(option);
  var option = document.createElement('div');
  option.id = 'option2';
  option.appendChild(document.createTextNode('Rub belly'));
  menu.appendChild(option);
  var option = document.createElement('div');
  option.id = 'option3';
  option.appendChild(document.createTextNode('Feed a fish'));
  menu.appendChild(option);
  container.appendChild(menu);
};

Tutorial.menuTest = function() {
  var code = document.getElementById('menuTest').getValue();
  Tutorial.eval(code);
};
