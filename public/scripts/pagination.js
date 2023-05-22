const paginate = document.getElementById("paginate");
const $retreatsContainer = $("#retreats-container");
paginate.addEventListener("click", function (e) {
  e.preventDefault();
  fetch(this.href)
    .then((response) => response.json())
    .then((data) => {
      for (const y of data.docs) {
        let template = generatePage(y);
        $retreatsContainer.append(template);
      }
      let { nextPage } = data;
      this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
      retreatData.features.push(...data.docs);
      map.getSource("retreatData").setData(retreatData);
    })
    .catch((err) => console.log("ERROR", err));
});

function generatePage(y) {
  let template = `<div class="card mb-3">
    <div class="row">
        <div class="col-md-4"> 
            <img class="img-fluid" alt="" src="${
              y.images.length
                ? y.images[0].url
                : "https://res.cloudinary.com/douqbebwk/image/upload/v1600103881/YelpCamp/lz8jjv2gyynjil7lswf4.png"
            }">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title"><strong>${y.title}</strong></h5>
    
                <p class="card-text">${y.description}</p>
                <p class="card-text">
                    <small class="text-muted">${y.location}</small>
                </p>
                <a class="btn btn-primary" href="/yogaretreats/${y._id}">View ${
    y.title
  }</a>
            </div>
        </div>
    </div>
    </div>`;
  return template;
}
