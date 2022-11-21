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
        <div id="add-pose-${poses[i].id}" class="add-btn"> <b>+</b> add </div>
       </div>`
    );
    // just to show it if there is any counter pose
    if (poses[i].counterpose.length > 0) {
      $(`#pose-${poses[i].id}`).append(
        `
        <span id="pose-${poses[i].id}-counter-btn" class="counter-btn">Counter pose: <b>⇅</b></span>
        <div class="counter-wrapper" ></div>
        `
      )
    }
    // interaction
    // add buttons
    $(`#add-pose-${poses[i].id}`).click(function () {
      $("#selected-poses").append(
        `<div class="clone pose">
        <div class="illustration"><img src="assets/poses/${poses[i].image}"/></div>
        <div class="english">${poses[i].english} </div>
        <div class="sanskrit">(${poses[i].sanskrit}) </div>
        <div class="del-btn" /> ✖ del </div>
        </div>`
      )
      $(".del-btn").click(function () {
        $(this).parent().fadeOut(function () {
          $(this).remove()
        })
      })
      $('.clone').fadeIn()

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
        `<div id="pose-${poses[i].id}-counter-${poses[i].counterpose[j].id}" class="add-btn" > + add   </div>`
      )
      $(`#pose-${poses[i].id}-counter-${poses[i].counterpose[j].id}`).click(function () {
        $("#selected-poses").append(
          `<div class="counter-pose">
            <div class="illustration"><img src="assets/poses/${poses[i].counterpose[j].image}"/></div>
            <div class="english">${poses[i].counterpose[j].english} </div>
            <div class="sanskrit">(${poses[i].counterpose[j].sanskrit}) </div>
            <div class="del-btn" /> ✖ del </div>
           </div>`
        )
        $(".del-btn").click(function () {
          $(this).parent().remove()
        })
      })
    }
  }
  //filter buttons
  function filter (id, category) {
    $(`#${id}`).click(function () {
      $(`.${category}`).fadeToggle()
      if (!$(`#${id}`).hasClass('filter-on')) {
        $(`#${id}`).removeClass('filter-off')
        $(`#${id}`).addClass('filter-on')
      } else {
        $(`#${id}`).removeClass('filter-on')
        $(`#${id}`).addClass('filter-off')
      }
    });
  }
  
  filter ('standing-btn', 'standing')
  filter ('reclining-btn', 'reclining')
  filter ('inversion-btn', 'inversion')
  filter ('backbend-btn', 'back-bend')
  filter ('forwardbend-btn', 'forward-bend')
  filter ('armbalance-btn', 'arm-balance-bend')
  $('#standing-btn').trigger('click');
})


// to sort, drag and drop in plan section
$("#selected-poses").sortable();
// close plan
$("#close-plan-btn").click(() => {
  $("#plan").fadeOut();
})

$("#plan-btn").click(() => {
  $("#plan").fadeIn();
})


