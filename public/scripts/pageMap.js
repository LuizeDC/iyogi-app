mapboxgl.accessToken =
  "pk.eyJ1IjoiZGNsdWl6ZSIsImEiOiJjbGhobzkwZXUyZ3VnM2tvMzNud2djYzE5In0.dQAReVz20MlSNNHEaSCIrA";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: yogaretreats.geometry.coordinates,
  zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(yogaretreats.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`<h5>${yogaretreats.title}</h5>
    <p>${yogaretreats.location}</p>`)
  )
  .addTo(map);
