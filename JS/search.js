var course_list = [];
var campus = null;
var instructor = null;
var days = [];
var not_days = [];
var times = [];
var section = null;
var total_credits = 0;
var b1 = [];
var b2 = [];
var b3 = [];


$('[data-cid]').click(function() {
  var course = $(this).data('cid');
  var course_credits = parseInt($(this).attr('value'));
  var id = $(this).attr('id');
  var element = document.getElementById(id);
  var color = window.getComputedStyle(element, null).getPropertyValue("fill");
  build_course_list(course, course_credits, color, id, []);
});

$(document).on('click', function(e) {
  if ($(e.target).closest('#drop1').length) {
    var element = document.getElementById("block1");
    drop_menu(element);
  }
  else if (!$(e.target).closest('#block1').length)
    $('#block1').hide();

  if ($(e.target).closest('#drop2').length) {
    var element = document.getElementById("block2");
    drop_menu(element);
  }
  else if (!$(e.target).closest('#block2').length)
    $('#block2').hide();

  if ($(e.target).closest('#drop3').length) {
    var element = document.getElementById("block3");
    drop_menu(element);
  }
  else if (!$(e.target).closest('#block3').length)
    $('#block3').hide();
});

$('[data-block]').click(function() {
  var blk = $(this).attr('class');
  var course = $(this).data('block');
  var course_credits = parseInt($(this).attr('value'));
  var id = $(this).attr('id');
  var element = document.getElementById(id);
  var color = window.getComputedStyle(element, null).getPropertyValue("fill");
  check_block(blk, course, course_credits, id, color);
});

$('[data-clear]').click(function() {
  clear();
});

$('[data-menu]').click(function() {
  var element = document.getElementById("sideMenu");
  menu(element);
});

$("[data-flow]").click(function() {
  $('html, body').animate({
    scrollTop: $("#cs_flow").offset().top
  }, 500);
});

$('[data-collapse]').click(function(){
  $(this).siblings('.filter-content').slideToggle(300);
})

$('[data-day]').click(function() {
  var day = $(this).data('day');
  build_filter_list(day, days);
});

$('[data-time]').click(function() {
  var time = $(this).data('time');
  build_filter_list(time, times);
});

$('[data-search]').click(function() {
  term = $('#semester').find(":selected").val();
  campus = $('#location').find(":selected").text();
  if (campus == "Select a location")
    campus = null;
  section = $('#session').find(":selected").text();
  if (section == "Select a session")
    section = null;
  print_results();
});

function build_course_list(course, course_credits, color, id, list) {
  var co = course.split(", ")[0];
  // If course is already there in array, it's index will be returned,
  // otherwise inArray() will return -1
  var indexOfCourse = $.inArray(co, course_list);
  // Check if student has exceeded maximum allowable semester credits
  var tmpCredits = total_credits + course_credits;
  if (tmpCredits > 18 && indexOfCourse == -1) {
    window.alert("ERROR: Exceeded max credits: " + tmpCredits);
    return true;
  }
  if (course.length != 8) {
    course_and_lab(co, indexOfCourse, course, course_credits, id, list);
  }
  else {
    if (indexOfCourse !== -1) {
      course_list.splice(indexOfCourse, 1);
      list.splice(0, 3);
      total_credits = total_credits - course_credits;
    }
    else {
      course_list.push(course);
      list.push(course, course_credits, id);
      total_credits = total_credits + course_credits;
    }
  }
  change_color(color, id);
  console.log(course_list);
  console.log(total_credits);
}

function course_and_lab(co, indexOfCourse, course, course_credits, id, list) {
  var lab = course.split(", ")[1];
  if (indexOfCourse !== -1) {
    course_list.splice(indexOfCourse, 2);
    list.splice(0, 3);
    total_credits = total_credits - course_credits;
  }
  else {
    course_list.push(co);
    course_list.push(lab);
    list.push(course, course_credits, id);
    total_credits = total_credits + course_credits;
  }
}

function change_color(color, id) {
  if (color == "rgb(255, 255, 255)")
    $('#'+id).css({fill: "lightgrey"});
  else
    $('#'+id).css({fill: "white"});
}

function drop_menu(element) {
  if (element.style.display == "none")
    element.style.display = "inline";
  else
    element.style.display = "none";
}

function check_block(blk, course, course_credits, id, color) {
  if (blk == "b1") {
    if ((b1.length == 0 && course != b2[0]) || course == b1[0]) {
      if (build_course_list(course, course_credits, color, id, b1))
        return;
    }
    else if (course != b1[0] && course != b2[0]) {
      var tmpCredits = total_credits - b1[1] + course_credits;
      if (tmpCredits > 18) {
        window.alert("ERROR: Exceeded max credits: " + tmpCredits);
        return;
      }
      // remove the currently selected course and then add the new one
      build_course_list(b1[0], b1[1], null, b1[2], b1);
      build_course_list(course, course_credits, color, id, b1);
    }
    else {
      window.alert("ERROR: This course was already selected!");
      return;
    }

    if (b1.length != 0)
      change_color("rgb(255, 255, 255)", "drop1");
    else
      change_color(null, "drop1");

    setTimeout(function() {
      var element = document.getElementById("block1");
      drop_menu(element);
    }, 200);
  }
  else if (blk == "b2") {
    if ((b2.length == 0 && course != b1[0]) || course == b2[0]) {
      if (build_course_list(course, course_credits, color, id, b2))
        return;
    }
    else if (course != b2[0] && course != b1[0]) {
      var tmpCredits = total_credits - b2[1] + course_credits;
      if (tmpCredits > 18) {
        window.alert("ERROR: Exceeded max credits: " + tmpCredits);
        return;
      }
      // remove the currently selected course and then add the new one
      build_course_list(b2[0], b2[1], null, b2[2], b2);
      build_course_list(course, course_credits, color, id, b2);
    }
    else {
      window.alert("ERROR: This course was already selected!");
      return;
    }

    if (b2.length != 0)
      change_color("rgb(255, 255, 255)", "drop2");
    else
      change_color(null, "drop2");

    setTimeout(function() {
      var element = document.getElementById("block2");
      drop_menu(element);
    }, 200);
  }
  else {
    if (b3.length == 0 || course == b3[0]) {
      if (build_course_list(course, course_credits, color, id, b3))
        return;
    }
    else {
      // remove the currently selected course and then add the new one
      build_course_list(b3[0], b3[1], null, b3[2], b3);
      build_course_list(course, course_credits, color, id, b3);
    }

    if (b3.length != 0)
      change_color("rgb(255, 255, 255)", "drop3");
    else
      change_color(null, "drop3");

    setTimeout(function() {
      var element = document.getElementById("block3");
      drop_menu(element);
    }, 200);
  }
}

function clear() {
  $('html, body').animate({
    scrollTop: $("#cs_flow").offset().top
  }, 500);
  course_list = [];
  campus = null;
  document.getElementById("location").value = "0";
  instructor = document.getElementById("instructor").value = "";
  days = [];
  times = [];
  section = null;
  document.getElementById("session").value = "0";
  total_credits = 0;
  b1 = [];
  b2 = [];
  b3 = [];
  $(".button").css({fill: "white"});
  $(".b1").css({fill: "white"});
  $(".b2").css({fill: "white"});
  $(".b3").css({fill: "white"});
  $("input:checkbox").removeAttr("checked");
}

function menu(element) {
  $('html, body').animate({
    scrollTop: $("#cs_flow").offset().top
  }, 500);
  if (element.offsetWidth == "0") {
    element.style.visibility = "visible";
    element.style.width = "300px";
  }
  else {
    element.style.width = "0";
    element.style.visibility = "hidden";
  }
}

function build_filter_list(item, list) {
  var indexOfItem = $.inArray(item, list);
  if (indexOfItem !== -1)
    list.splice(indexOfItem, 1);
  else
    list.push(item);
}

function get_not_days() {
  not_days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  var num = days.length;
  var i = 0;
  while (i < num) {
    var indexOfDay = $.inArray(days[i], not_days);
    if (indexOfDay !== -1)
      not_days.splice(indexOfDay, 1);
    i = i + 1;
  }
  if (not_days.length == 0)
    not_days = [""];
  if (not_days.length == 7)
    not_days = [];
}

function print_results() {
  if (term == "0") {
    window.alert("ERROR: Must select a semester!");
    $('html, body').animate({
      scrollTop: $("#home_div").offset().top
    }, 1500);
    return;
  }
  get_not_days();

  instructor = document.getElementById("instructor").value;
  if (instructor == "")
    instructor = null;

  if (course_list.length == 0 && campus == null && instructor == null && days.length == 0 && times.length == 0 && section == null) {
    window.alert("ERROR: Need input to search!");
    $('html, body').animate({
      scrollTop: $("#cs_flow").offset().top
    }, 500);
    return;
  }
  $('html, body').animate({
    scrollTop: $("#results_div").offset().top
  }, 1500);
  // clear the div
  document.getElementById("courses_div").innerHTML = "";
  // populate div
  var script = document.createElement('script');
  script.src = 'JS/bundle.js';
  script.type = 'text/javascript';
  document.head.appendChild(script);
}

////////////////////////////////////////////////////////////////////////////////
function queryBuilder() {
  var query = '{"from": 0, "size": 1000, "query": {"bool": {';

  if (must() != null && must_not() == null && filter_courses() == null && filter_times() == null)
    query = query + must() + '}}}';
  else if (must() == null && must_not() != null && filter_courses() == null && filter_times() == null)
    query = query + must_not() + '}}}';
  else if (must() == null && must_not() == null && filter_courses() != null && filter_times() == null)
    query = query + filter_courses() + '}}}';
  else if (must() == null && must_not() == null && filter_courses() == null && filter_times() != null)
    query = query + filter_times() + '}}}';
  else if (must() != null && must_not() != null && filter_courses() == null && filter_times() == null)
    query = query + must() + ', ' + must_not() + '}}}';
  else if (must() != null && must_not() == null && filter_courses() != null && filter_times() == null)
    query = query + must() + ', ' + filter_courses() + '}}}';
  else if (must() != null && must_not() == null && filter_courses() == null && filter_times() != null)
    query = query + must() + ', ' + filter_times() + '}}}';
  else if (must() == null && must_not() != null && filter_courses() != null && filter_times() == null)
    query = query + must_not() + ', ' + filter_courses() + '}}}';
  else if (must() == null && must_not() != null && filter_courses() == null && filter_times() != null)
    query = query + must_not() + ', ' + filter_times() + '}}}';
  else if (must() == null && must_not() == null && filter_courses() != null && filter_times() != null)
    query = query + filter_courses() + ', ' + filter_times() + '}}}';
  else if (must() != null && must_not() != null && filter_courses() != null && filter_times() == null)
    query = query + must() + ', ' + must_not() + ', ' + filter_courses() + '}}}';
  else if (must() != null && must_not() != null && filter_courses() == null && filter_times() != null)
    query = query + must() + ', ' + must_not() + ', ' + filter_times() + '}}}';
  else if (must() != null && must_not() == null && filter_courses() != null && filter_times() != null)
    query = query + must() + ', ' + filter_courses() + ', ' + filter_times() + '}}}';
  else if (must() == null && must_not() != null && filter_courses() != null && filter_times() != null)
    query = query + must_not() + ', ' + filter_courses() + ', ' + filter_times() + '}}}';
  else if (must() != null && must_not() != null && filter_courses() != null && filter_times() != null)
    query = query + must() + ', ' + must_not() + ', ' + filter_courses() + ', ' + filter_times() + '}}}';
  else
    return ("ERROR: Input is needed!");

  return query;
}

function must() {
  var str_must = null;

  if (campus != null)
    var str_campus = '{"match_phrase": {"location": "' + campus + '"}}';
  if (instructor != null)
    var str_instructor = '{"match_phrase": {"instructor": "' + instructor + '"}}';
  if (section != null)
    var str_section = '{"match_phrase": {"section": "' + section + '"}}';

  if (campus != null && instructor == null && section == null)
    str_must = '"must": [' + str_campus + ']';
  else if (campus == null && instructor != null && section == null)
    str_must = '"must": [' + str_instructor + ']';
  else if (campus == null && instructor == null && section != null)
    str_must = '"must": [' + str_section + ']';
  else if (campus != null && instructor != null && section == null)
    str_must = '"must": [' + str_campus + ', ' + str_instructor + ']';
  else if (campus != null && instructor == null && section != null)
    str_must = '"must": [' + str_campus + ', ' + str_section + ']';
  else if (campus == null && instructor != null && section != null)
    str_must = '"must": [' + str_instructor + ', ' + str_section + ']';
  else if (campus != null && instructor != null && section != null)
    str_must = '"must": [' + str_campus + ', ' + str_instructor + ', ' + str_section + ']';

  return str_must;
}

function must_not() {
  var str_not = null;
  var i = 0;

  if (not_days.length != 0) {
    str_not = '"must_not": [';

    while (i < not_days.length) {
      str_not = str_not + '{"match_phrase": {"days": "' + not_days[i] + '"}}';
      i = i + 1;
      if ((not_days.length - i) != 0)
        str_not = str_not + ', ';
    }

    str_not = str_not + ']';
  }

  return str_not;
}

function filter_courses() {
  var str_courses = null;
  var i = 0;

  if (course_list.length != 0) {
    str_courses = '"filter": {"bool": {"should": [';

    while (i < course_list.length) {
      str_courses = str_courses + '{"match_phrase": {"courseInfo": "' + course_list[i] + '"}}';
      i = i + 1;
      if ((course_list.length - i) != 0)
        str_courses = str_courses + ', ';
    }

    str_courses = str_courses + ']}}';
  }

  return str_courses;
}

function filter_times() {
  var str_times = null;
  var i = 0;

  if (times.length != 0) {
    str_times = '"filter": {"bool": {"should": [';

    while (i < times.length) {
      str_times = str_times + '{"match_phrase": {"time": "' + times[i] + '"}}';
      i = i + 1;
      if ((times.length - i) != 0)
        str_times = str_times + ', ';
    }

    str_times = str_times + ']}}';
  }

  return str_times;
}
////////////////////////////////////////////////////////////////////////////////
