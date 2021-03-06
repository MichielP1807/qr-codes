let websites = [];
let categories = {};
let destination;
let notChosen = [];
let clicked = false;
let flash = false;

$(document).ready(function() {
  $.ajax({
    url : "websites.csv",
    dataType: "text",
    success : function (data) {
      let arr = data.match(/[^\r\n]+/g);
      for (let i=0; i<arr.length; i++) {
        arr[i] = arr[i].split(/,/);
        if (i>0) {
          let website = {};
          for (let j=0; j<arr[i].length; j++) {
            website[arr[0][j]] = arr[i][j];
          }
          websites.push(website);
        }
      }
      resetNotChosen(false);
      $("#numberOfDongs").text(notChosen.length);
      $("#catLengthAll").text(notChosen.length);
      $("#bookmark").attr("href", window.location.href + "bookmark/");

      for (let i=0; i<websites.length; i++) {
        if (websites[i].subcategory != "") {
          if (!categories[websites[i].category]) categories[websites[i].category] = {};
          if (!categories[websites[i].category][websites[i].subcategory]) categories[websites[i].category][websites[i].subcategory] = [];
          categories[websites[i].category][websites[i].subcategory].push({
            "name":  websites[i].name,
            "url":  websites[i].url
          })
        } else {
          if (!categories[websites[i].category]) categories[websites[i].category] = [];
          categories[websites[i].category].push({
            "name":  websites[i].name,
            "url":  websites[i].url
          });
        }
      }
      for (let category in categories) {
        let length = 0;
        if (!(categories[category] instanceof Array)) { // if category is not an array of websites
          for (let subcategory in categories[category]) {
            length += categories[category][subcategory].length;
          }
        } else {
          length = categories[category].length;
        }
        let element = $('<label class="checkContainer"></label>').text(category + " (");
        element.append('<span id="catLength'+category+'">'+length+'</span>');
        element.append(")");
        element.append($('<input type="checkbox" id="checkBox'+category+'" onclick="categoryButtonClick('+"'"+category+"'" + ')" checked>'));
        element.append($('<span class="checkmark"></span>'));
        $("#categories").append(element);
        if (!(categories[category] instanceof Array)) { // if category is not an array of websites
          for (let subcategory in categories[category]) {
            length = categories[category][subcategory].length;
            let element = $('<label class="checkContainer"></label>').text(subcategory + " (");
						element.append('<span id="catLength'+category+subcategory+'">'+length+'</span>');
						element.append(")");
            element.append($('<input type="checkbox" id="checkBox'+category+subcategory+'" onclick="categoryButtonClick('+"'"+category+"','"+subcategory+"'"+')" checked>'));
            element.append($('<span class="checkmark"></span>'));
            let div = $('<div class="subcategory"></div>');
            div.append(element);
            $("#categories").append(div);
          }
        }
      }
    }
  });
});

function buttonClick() {
	if (!clicked) {
    clicked = true;
    if (notChosen.length == 0) {
      resetNotChosen(true);
    }
    let index = notChosen.splice(Math.floor(Math.random()*notChosen.length),1)[0];
    destination = websites[index];
    setTimeout(function() {
      window.open(destination.url, "_blank");
      clicked = false;
    }, 400);
  }
}
function snd(soundElementId) {
	$('#'+soundElementId)[0].play();
}

function resetNotChosen(checkButtons) {
  notChosen = [];
  for (let i=0; i<websites.length; i++) {
		if (!flash && websites[i].flash == "TRUE") continue;
		if (checkButtons) {
      if (websites[i].subcategory != "") {
        if ($("#checkBox" + websites[i].category + websites[i].subcategory)[0].checked) notChosen.push(i);
      } else {
        if ($("#checkBox" + websites[i].category)[0].checked) notChosen.push(i);
      }
    } else {
      notChosen.push(i);
    }
  }
  if (notChosen.length == 0) resetNotChosen(false); // add everything if all categories are disabled
}

function menuButtonClick() {
  $("#menu").removeClass("hidden");
  $("#overlay").removeClass("hidden");
}
$(document).click(function(event) {
    if(!$(event.target).closest('#menu').length && !$(event.target).closest('#menuButton').length) {
      $("#menu").addClass("hidden");
      $("#overlay").addClass("hidden");
    }
});

function categoryButtonClick(category, subcategory) {
  if (!subcategory) {
    if (!(categories[category] instanceof Array)) {
      let fullLength = 0;
      for (let subcategory in categories[category]) {
        $("#checkBox" + category + subcategory)[0].checked = $("#checkBox" + category)[0].checked;
        fullLength += categories[category][subcategory].length;
      }
      $("#catLength" + category).text(fullLength);
    }
  } else {
    let categoryShouldBeOn = false;
    let length = 0;
    let fullLength = 0;
    for (let sub in categories[category]) {
      if ($("#checkBox" + category + sub)[0].checked) {
        categoryShouldBeOn = true;
        length += categories[category][sub].length;
      }
      fullLength += categories[category][sub].length;
    }
    $("#checkBox" + category)[0].checked = categoryShouldBeOn;
    $("#catLength" + category).text((length > 0) ? length : fullLength);
  }
  updateCategoryLengths();
}
function categoryButtonAll() {
  resetNotChosen(false);
  $("#catLengthAll").text(notChosen.length);
  for (let category in categories) {
    if (!(categories[category] instanceof Array)) { // if category is not an array of websites
      for (let subcategory in categories[category]) {
        $("#checkBox" + category + subcategory)[0].checked = $("#checkBoxAll")[0].checked;
      }
    }
    $("#checkBox" + category)[0].checked = $("#checkBoxAll")[0].checked;
  }
}
function categoryButtonFlash() {
	flash = $("#checkBoxFlash")[0].checked;
	updateCategoryLengths();
}

function updateCategoryLengths() {
	resetNotChosen(true);
	let lengths = {"All": {"total": 0, "active": 0}};
	for (let i=0; i<notChosen.length; i++) {
		let website = websites[notChosen[i]];
		if (!lengths[website.category]) lengths[website.category] = {"total": 0, "active": 0};
		if (!lengths[website.category+website.subcategory]) lengths[website.category+website.subcategory] = {"total": 0, "active": 0};;
		if ($("#checkBox" + website.category + website.subcategory)[0].checked) {
			lengths[website.category].active++;
			if (website.subcategory != "") lengths[website.category+website.subcategory].active++;
			lengths["All"].active++;
		}
		lengths[website.category].total++;
		if (website.subcategory != "") lengths[website.category+website.subcategory].total++;
		lengths["All"].total++;
	}
	for (let category in lengths) {
		if (lengths[category].active > 0) {
			$("#catLength" + category).text(lengths[category].active);
		} else {
			$("#catLength" + category).text(lengths[category].total);
		}
	}
	$("#checkBoxAll")[0].checked = (lengths["All"].active > 0);
}
