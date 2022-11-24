let poses = []

async function loadPoses() {
  await axios
    .get("src/poses.json")
    .then((allposes) => {
      // console.log(allposes.data);
      // console.log(allposes.data.length)
      poses = allposes.data
      return poses
    })
    .catch((err) => {
      console.log("rejected: ", err);
    });
}

loadPoses().then(() => {

  for (let i = 0; i < poses.length; i++) {
    $("#poses").append(
      `<div id="pose-${poses[i].id}" class="pose ${poses[i].category}">
        <div class="illustration"><img src="assets/poses/${poses[i].image}"/></div>
        <div class="english">${poses[i].english} </div>
        <div class="sanskrit">(${poses[i].sanskrit}) </div>
        <div class="category">Category: ${poses[i].category} </div>
        <div id="add-pose-${poses[i].id}" class="btn add-btn"> <img src="assets/add_icon.svg"></div>
       </div>`
    );
    // just to show it if there is any counter pose
    if (poses[i].counterpose.length > 0) {
      $(`#pose-${poses[i].id}`).append(
        `
        <span id="pose-${poses[i].id}-counter-btn" class="btn counter-btn">Counter pose &nbsp;<img src="assets/balance_icon.svg"></span>
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
      $(".del-btn").click(function () {
        $(this).parent().fadeOut('fast', function () {
          $(this).remove()
          showAdvice()
        })
      })
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
        `<div class="english">${poses[i].counterpose[j].english} </div>`
      );
      $(`#pose-${poses[i].id} .counter-wrapper`).append(
        `<div id="pose-${poses[i].id}-counter-${poses[i].counterpose[j].id}" class="add-btn btn" > <img src="assets/add_icon.svg"></div>`
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
            <div class="del-btn btn"> <img src="assets/close_icon.svg"/> </div>
           </div>`
        )
        $(".del-btn").click(function () {
          $(this).parent().fadeOut('fast', function () {
            $(this).remove()
            showAdvice()
          })
        })
      })
    }
  }
  //filter buttons
  function filter(id, category) {
    $(`#${id}`).click(function () {

      //effect pulsate to help user realise what new elements have been included
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
  $('#standing-btn').trigger('click');
})

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

  if ($('.chosen').length !== 0) {
    $("#print-btn").show()
    $("#print-btn").click(function () {

      shakeButton(this)
      $("#close-plan-btn, .del-btn, #print-btn, play-btn").hide();
      var contents = $("#plan").html();
      var frame1 = $('<iframe />');
      frame1[0].name = "frame1";
      frame1.css({ "position": "absolute", "top": "-1000000px" });
      $("body").append(frame1);
      var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
      frameDoc.document.open();
      //Create a new HTML document.
      frameDoc.document.write('<html><head><title>Yoga plan</title>');
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
      }, 500);
      $("#close-plan-btn, .del-btn , #print-btn").show();

    });
  } else { $("#print-btn").hide() }
}



// to sort, drag and drop in plan section
$("#selected-poses").sortable();
// close plan
$("#close-plan-btn, #blurry-bg").click(() => {
  $("#plan, #blurry-bg").fadeOut();
})

// encourage to add poses in plan section if it is empty
function showAdvice() {
  $('#plan-advice').remove()
  if ($('#selected-poses .clone').length === 0 && $('#selected-poses .counter-pose').length === 0) {
    $("#plan").append(
      `<h4 id="plan-advice">Add poses to your plan by clicking on this icon<span class="add-btn" > <img src="assets/add_icon.svg"></span> </h4>`
    )
    $('#plan-advice').hide().fadeIn(1000)
  }
}

// highlight add button to let users know they clicked on it
function shakeButton(element) {
  $(element).effect('shake', { direction: "right", times: 1.5, distance: 5 }, 500)
}

// Plan button inteface
$("#plan-btn").click(() => {
  showAdvice();
  printPlan()
  $("#plan, #blurry-bg").fadeIn();
  $('#blurry-bg').css({
    height: $(document).height() + 'px'
  })
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

//slideshow 
$("#play-btn").click(function () {
  let poseCount = 0
  let totalPoses = $(".chosen").length
  console.log(`pose count is: ${totalPoses}`)
  if ($("#gallery-nav").length === 0 && $("#selected-poses>div").length > 1) {
    //effects
    shakeButton(this)
    //switch button
    $("#play-btn").fadeOut(function () {
      $("#stop-btn").fadeIn()
    })
    $("#selected-poses").addClass('gallery')
    let gallery_height = $("#selected-poses>div").outerHeight()
    console.log(gallery_height)
    $(".gallery").height(gallery_height)
    $(".gallery .del-btn").hide()

    //create navigation buttons
    $(`
    <div id="gallery-nav">
    <div class=left-btn><img src="assets/left_icon.svg"></div>
    <div class=right-btn><img src="assets/right_icon.svg"></div>
    </div>
    `).insertAfter('.gallery')
    $(".right-btn").click(function () {
      $(".gallery").animate({
        // scrollTop: gallery_height
      }, 2000);
      // $(".chosen").eq(poseCount).css( "background-color", "red" )
    })
    $(".left-btn").click(function () {
      poseCount--
      if (poseCount >= 0) {
        console.log(`pose count is: ${poseCount}`)
        console.log($(".chosen").eq(poseCount).offset().top)
        // $(".gallery").animate({
        //   scrollTop: $( ".chosen" ).eq( poseCount  ).offset().top
        // }, 2000);
      }

    })
  }
})

$("#stop-btn").click(function () {
  //effects
  shakeButton(this)
  //switch button
  $("#stop-btn").fadeOut(function () {
    $("#play-btn").fadeIn()
  })
  $(".gallery").height('auto')

  $("#gallery-nav").remove()
  $(".gallery .del-btn").show()
  $("#selected-poses").removeClass('gallery')
})

landingAnimation(500, 1000) //500, 1000 nice
