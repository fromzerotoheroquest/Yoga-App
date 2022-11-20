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
    $("#filter").append(

      `<span class="category">${poses[i].category} &nbsp;</span>`
    )
    $("#poses").append(
      `<div id="pose-${poses[i].id}" class="pose ${poses[i].category}">
        <div class="illustration"><img src="assets/poses/${poses[i].image}"/></div>
        <div class="english">${poses[i].english} </div>
        <div class="sanskrit">(${poses[i].sanskrit}) </div>
        <div class="category">Category: ${poses[i].category} </div>
        <div id="add-pose-${poses[i].id}" class="add-btn"> + add </div>
       </div>`
    );
    // just to show it if there is any counter pose
    if (poses[i].counterpose.length > 0) {
      $(`#pose-${poses[i].id}`).append(
        `<div class="counter-wrapper" > <span>Counter pose:</span> </div>`
      )
    }
    // interaction
    $(`#add-pose-${poses[i].id}`).click(function () {
      $("#plan").append(
        `<div class="pose">
          <div class="illustration"><img src="assets/poses/${poses[i].image}"/></div>
          <div class="english">${poses[i].english} </div>
          <div class="sanskrit">(${poses[i].sanskrit}) </div>
          <div class="del-btn" /> ✖ del </div>
          </div>`
      )
      $(".del-btn").click(function () {
        $(this).parent().remove()
      })
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
        $("#plan").append(
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
})

// to sort, drag and drop in plan section
  $( "#plan" ).sortable(); 


// console.log (poses)