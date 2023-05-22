const YogaRetreat = require("../models/yogaretreat");
const { cloudinary } = require("../cloudinary");
const fnc = module.exports;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

fnc.index = async (req, res) => {
  if (!req.query.page) {
    const yogaretreats = await YogaRetreat.paginate({}, {});
    res.render("yogaretreats/index", { yogaretreats });
  } else {
    const { page } = req.query;
    const yogaretreats = await YogaRetreat.paginate({}, { page });
    res.status(200).json(yogaretreats);
  }
};

fnc.renderNewPage = (req, res) => {
  res.render("yogaretreats/new");
};

fnc.createRetreat = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.yogaretreat.location,
      limit: 1,
    })
    .send();
  const yogaretreat = new YogaRetreat(req.body.yogaretreat);
  yogaretreat.geometry = geoData.body.features[0].geometry;
  yogaretreat.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  yogaretreat.yogi = req.user._id;
  await yogaretreat.save();
  console.log(yogaretreat);
  req.flash("success", `Another amazing retreat in the books!`);
  res.redirect(`/yogaretreats/${yogaretreat._id}`);
};

fnc.showRetreat = async (req, res) => {
  const yogaretreats = await YogaRetreat.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "yogi" } })
    .populate("yogi");
  if (!yogaretreats) {
    req.flash("error", "Cannot find this retreat!");
    return res.redirect("/yogaretreats");
  }
  res.render("yogaretreats/show", { yogaretreats });
};

fnc.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const yogaretreats = await YogaRetreat.findById(req.params.id);
  if (!yogaretreats) {
    req.flash(
      "error",
      "Hm... Are you sure you didnt dream of this retreat? We can not find it..."
    );
    return res.redirect(`/yogaretreats/`);
  }
  res.render("yogaretreats/edit", { yogaretreats });
};

fnc.updateRetreat = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const yogaretreat = await YogaRetreat.findByIdAndUpdate(id, {
    ...req.body.yogaretreat,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  yogaretreat.images.push(...imgs);
  await yogaretreat.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await yogaretreat.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  res.redirect(`/yogaretreats/${yogaretreat._id}`);
};

fnc.deleteRetreat = async (req, res) => {
  const { id } = req.params;
  const retreat = await YogaRetreat.findById(id);
  if (!retreat.yogi.equals(req.user._id)) {
    req.flash(
      "error",
      "Uh-oh, seems like you are trying to step onto someone elses mat!"
    );
    return res.redirect(`/yogaretreats/${id}`);
  }
  const yogaretreat = await YogaRetreat.findByIdAndDelete(id);
  res.redirect("/yogaretreats");
};
