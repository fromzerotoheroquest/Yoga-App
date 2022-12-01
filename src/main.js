// auto save to local storage
let planTitle = document.querySelector('#title');
let planPoses = document.querySelector('#selected-poses');
let savedTitle = localStorage.getItem('planTitleStored');
let savedPoses = localStorage.getItem('planPosesStored');

// If there are any saved items, update our list
if (savedTitle) {
  planTitle.innerHTML = savedTitle;
}
if (savedPoses) {
  planPoses.innerHTML = savedPoses;
}
function saveToLocalStorage() {
  localStorage.setItem('planTitleStored', planTitle.innerHTML);
  localStorage.setItem('planPosesStored', planPoses.innerHTML);
}

function deleteFromLocalStorage() {
  window.localStorage.removeItem('planTitleStored');
  window.localStorage.removeItem('planPosesStored');
}

//local storage interaction

$('#delete-btn').click(function () {
  shakeButton(this)
  $('#warning, #delete-warning').fadeIn()
  $('#warning').css({
    height: $(document).height() + 'px',
    width: $(document).width() + 'px'

  })
})

$('#yes-del-btn').click(function () {
  shakeButton(this)
  deleteFromLocalStorage()
  $('.chosen').fadeOut(function () {
    $('.chosen').remove()
  })
  $('#warning, #delete-warning').fadeOut()
  $('#title').html('Yoga plan')
})

$('#no-del-btn').click(function () {
  shakeButton(this)

  $('#warning, #delete-warning').fadeOut()

})


$('#save-btn').click(function () {
  shakeButton(this)
  saveToLocalStorage()
  $('#warning, #save-warning').fadeIn('slow').delay(1500).fadeOut('slow')
})

// window.localStorage.clear()


// disable right click to avoid menu pop-up when tapholding to arrange poses.
function disableRightClick() {
  const noContext = document.querySelectorAll('img')
  for (let i = 0; i < noContext.length; i++) {
    noContext[i].addEventListener("contextmenu", e => e.preventDefault())
  }
  window.addEventListener("contextmenu", e => e.preventDefault());
}

disableRightClick()

//load poses
let poses = []

async function loadPoses() {
  await axios
    .get("src/poses.json")
    .then((allposes) => {
      // console.log(allposes.data);
      // console.log(allposes.data.length)
      poses = allposes.data
      // return poses
    })
    .catch((err) => {
      console.log("rejected: ", err);
    });

}

loadPoses().then(() => {
  console.time()
  for (let i = 0; i < poses.length; i++) {
    $("#poses").append(
      `<div id="pose-${poses[i].id}" class="pose ${poses[i].category}">
        <div class="illustration"><img src="assets/poses/${poses[i].image}"/></div>
        <div class="english">${poses[i].english} </div>
        <div class="sanskrit">(${poses[i].sanskrit}) </div>
        <div class="category">Category: ${poses[i].category} </div>
        <div id="add-pose-${poses[i].id}" class="btn add-btn"> <img class="icon" src="assets/add_icon.svg"></div>
       </div>`
    );
    // just to show it if there is any counter pose
    if (poses[i].counterpose.length > 0) {
      $(`#pose-${poses[i].id}`).append(
        `
        <span id="pose-${poses[i].id}-counter-btn" class="btn counter-btn">Counter pose &nbsp;<img  class="icon" src="assets/balance_icon.svg"></span>
        <div class="counter-wrapper" ></div>
        `
      )
    }
    // interaction
    // add buttons
    $(`#add-pose-${poses[i].id}`).click(function () {
      shakeButton(this)
      $("#selected-poses").append(
        `<div class="clone pose chosen">
        <div class="illustration"><img src="assets/poses/${poses[i].image}"/></div>
        <div class="english">${poses[i].english} </div>
        <div class="sanskrit">(${poses[i].sanskrit}) </div>
        <div class="del-btn btn"> <img src="assets/close_icon.svg"/> </div>
        </div>`
      )
      $('.clone').fadeIn()

      // plan button animation to indicate user that a pose has been added to the plan
      animatePlanButton()
    })

    //counter poses buttons
    $(`#pose-${poses[i].id}-counter-btn`).click(function () {
      console.log('click')
      $(`#pose-${poses[i].id} .counter-wrapper`).slideToggle()
    })

    //counter poses
    for (let j = 0; j < poses[i].counterpose.length; j++) {

      $(`#pose-${poses[i].id} .counter-wrapper`).append(
        `<div class="english">${poses[i].counterpose[j].english} </div>
        <div class="counter-pose-icon"><img class="icon" src="assets/poses/${poses[i].counterpose[j].image}"/></div>
        
        `
      );
      $(`#pose-${poses[i].id} .counter-wrapper`).append(
        `<div id="pose-${poses[i].id}-counter-${poses[i].counterpose[j].id}" class="add-btn btn" > <img  class="icon" src="assets/add_icon.svg"></div>`
      )
      //add pose to selected poses
      $(`#pose-${poses[i].id}-counter-${poses[i].counterpose[j].id}`).click(function () {
        // plan button animation to indicate user that a pose has been added to the plan
        shakeButton(this)
        animatePlanButton()
        $("#selected-poses").append(
          `<div class="counter-pose chosen">
            <div class="illustration"><img src="assets/poses/${poses[i].counterpose[j].image}"/></div>
            <div class="english">${poses[i].counterpose[j].english} </div>
            <div class="sanskrit">(${poses[i].counterpose[j].sanskrit}) </div>
            <div class="del-btn btn"> <img  class="icon" src="assets/close_icon.svg"/> </div>
           </div>`
        )

      })
    }
  }
  // default filter
  $('#standing-btn').trigger('click');
  console.timeEnd()


})

//filter ------------------------------------
function filter(id, category) {
  $(`#${id}`).click(function () {

    //effect pulsate to help user realise what new elements have been included/removed
    $(`.${category}`).toggle('pulsate', { times: 1 }, 250)
    if (!$(`#${id}`).hasClass('filter-on')) {
      $(`#${id}`).removeClass('filter-off')
      $(`#${id}`).addClass('filter-on')
    } else {
      $(`#${id}`).removeClass('filter-on')
      $(`#${id}`).addClass('filter-off')
    }
  });
}

filter('standing-btn', 'standing')
filter('reclining-btn', 'reclining')
filter('inversion-btn', 'inversion')
filter('backbend-btn', 'back-bend')
filter('forwardbend-btn', 'forward-bend')
filter('armbalance-btn', 'arm-balance-bend')

// plan button animation to indicate user that a pose has been added to the plan
function animatePlanButton() {
  $('#plan-btn').animate({
    opacity: '.3'
  }, 50).effect("bounce", "fast").animate({
    opacity: '1'
  }, 50).effect("highlight", "fast")
}

// print yoga plan 

function printPlan() {

  //hide elements to avoid printing them
  $("#close-plan-btn, .del-btn, #print-btn, #preview-btn, #plan-tips, #save-btn, #delete-btn, #edit-btn").hide();
  var contents = $("#plan").html();
  var frame1 = $('<iframe />');
  frame1[0].name = "frame1";
  frame1.css({ "position": "absolute", "top": "-1000000px" });
  $("body").append(frame1);
  var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
  frameDoc.document.open();
  //Create a new HTML document.
  // frameDoc.document.write('<html><head><title>Yogup: Your custom yoga plan</title>');
  frameDoc.document.write('</head><body>');
  //Append the external CSS file.
  frameDoc.document.write('<link href="css/style.css" rel="stylesheet" type="text/css" />');
  //Append the DIV contents.
  frameDoc.document.write(contents);
  frameDoc.document.write('</body></html>');
  frameDoc.document.close();
  setTimeout(function () {
    window.frames["frame1"].focus();
    window.frames["frame1"].print();
    frame1.remove();
    //show elements as they were before clicking on print
    $("#close-plan-btn, .del-btn, #print-btn, #preview-btn, #plan-tips, #save-btn, #delete-btn, #edit-btn").show();

  }, 500);
  $("#close-plan-btn, .del-btn , #print-btn").show();

}

// to sort, drag and drop in plan section
// $("#selected-poses").sortable();

// close plan
$("#close-plan-btn, #blurry-bg").click(() => {
  $("#plan, #blurry-bg").fadeOut();
  $("#gridview-btn").trigger('click')
  // removeSlider()
})

// encourage to add poses in plan section if it is empty
function showAdvice() {
  $('#plan-advice').remove()
  if ($('.chosen').length === 0) {
    $('#preview-btn, #print-btn').fadeOut('fast')
    $("#plan").append(
      `<h4 id="plan-advice">Add poses to your plan by clicking on this icon<span class="add-btn" > <img  class="icon" src="assets/add_icon.svg"></span> </h4>`
    )
    $('#plan-advice').hide().fadeIn(1000)
  }
}

// highlight add button to let users know they clicked on it
function shakeButton(element) {
  $(element).effect('shake', { direction: "right", times: 1.5, distance: 5 }, 300)
}

$("#plan-btn").click(function () {
  //hide del buttons
  $('#plan .del-btn').hide()

  //taphold event
  $(".chosen").on("taphold", { duration: 1000 }, function (event) {
    // in case the user taphold more than once before doubletapping
    $(".chosen").removeClass("taphold");
    $("#selected-poses").sortable({
      disabled: true
    });

    $(".chosen").addClass("taphold");
    // shakeButton('.chosen')
    $("#selected-poses").sortable({
      disabled: false
    });

    // show del buttons
    $('#plan .del-btn').fadeIn()
  })

  $(".chosen").on("doubletap", function () {
    $(".chosen").removeClass("taphold");
    $("#selected-poses").sortable({
      disabled: true
    });
    // hide del buttons
    $('#plan .del-btn').fadeOut()
  });

  //just in case users click anywhere else before doubletapping
  $('#preview-btn, #print-btn, #close-plan-btn, #blurry-bg').click(function () {
    $(".chosen").removeClass("taphold");
    $("#selected-poses").sortable({
      disabled: true
    });
  })

  // Delete poses function -------------------------
  let allDeleteButtons = document.querySelectorAll('.del-btn')
  for (let i = 0; i < allDeleteButtons.length; i++) {
    allDeleteButtons[i].addEventListener('click', deletePose, false)
  }

  function deletePose() {
    console.log('clicked!')
    if ($('.chosen').length <= 2) {
      console.log($('.chosen').length)
      $('#preview-btn').fadeOut('fast')
    }
    $(this).parent().fadeOut('fast', function () {
      $(this).remove()
      showAdvice()
    })
  }

  //hide icons if not selection has been made
  showAdvice();
  $('#preview-btn, #print-btn').show()
  $("#plan, #blurry-bg").fadeIn();
  $('#blurry-bg').css({
    height: $(document).height() + 'px'
  })
  if ($('.chosen').length === 0) {
    $('#preview-btn, #print-btn').hide()
  }
  if ($('.chosen').length === 1) {
    $('#preview-btn').hide()
  }
})



//slideshow 
$("#preview-btn").click(function () {

  if ($("#gallery-nav").length === 0 && $(".chosen").length > 1) {

    //hide buttons
    $('#print-btn, #plan-tips, #save-btn, #delete-btn, #edit-btn').fadeOut('fast')

    //effects
    shakeButton(this)
    //switch button
    $("#preview-btn").fadeOut('fast', function () {
      $("#gridview-btn").fadeIn('fast')
    })
    //add class to re-shape the poses
    $("#selected-poses").addClass('gallery')
    $(".gallery").css({ 'height': $(".gallery .chosen").outerHeight() })
    $(".gallery .del-btn").hide()

    //create navigation buttons
    $('<div id="gallery-nav"></div>').insertBefore('.gallery')

    //navigation buttons
    for (let i = 0; i < $('.chosen').length; i++) {
      $('#gallery-nav').append(`<div class="topose-btn btn"></div>`)
    }
    let toPoseButtons = document.querySelectorAll('.topose-btn');
    for (let i = 0; i < $('.topose-btn').length; i++) {
      toPoseButtons[i].addEventListener('click', scrollControl, false);
    }
    //
    $('.topose-btn').first().addClass('button-on')
    //to control buttons behaviour
    function scrollControl() {
      // console.log($('.gallery .chosen').outerHeight())
      $(this).addClass('button-on').siblings('div').removeClass('button-on');
      $(".gallery").stop().animate({
        scrollTop: $(this).index() * ($('.gallery .chosen').outerHeight())
      }, 2000, 'easeInOutQuint');
    }
  }
})

$("#gridview-btn").click(function () {
  //effects
  shakeButton(this)
  //switch button
  $("#gridview-btn").fadeOut('fast', function () {
    $('#preview-btn, #print-btn, #save-btn, #delete-btn, #edit-btn').fadeIn('fast')
    removeSlider()
  })

})
// edit name of the yoga plan
$('#edit-btn').click(function () {
  shakeButton(this)
  $('#title').prop('contenteditable', true)
  $('#title').addClass('editable')
  $('#edit-btn').fadeOut(function () {
    $('#done-btn').fadeIn()
  })
})

$('#done-btn').click(function () {
  shakeButton(this)
  $('#title').prop('contenteditable', false)
  $('#title').removeClass('editable')
  $('#done-btn').fadeOut(function () {
    $('#edit-btn').fadeIn()
  })
})

function removeSlider() {
  $("#gridview-btn").hide()
  $(".gallery").height('auto')
  $("#selected-poses").removeClass('gallery')
  $("#gallery-nav").remove()
  $("#plan-tips").fadeIn('fast')
}

$('#print-btn').click(function () {
  printPlan()
  console.log('print button clicked')
})

//landing page animation
function landingAnimation(speed1, speed2) {
  $('#animation').css({
    backgroundSize: '200%',
    height: $(document).height() + 'px'
  })
  $('#animation').animate({
    backgroundSize: '170%',
  }, speed1, 'easeInBounce').animate({
    backgroundSize: '120%'
  }, speed2, 'easeInOutQuint').animate({
    opacity: '.4',
    zIndex: -5
  })
}

landingAnimation(500, 1000) //500, 1000 nice
