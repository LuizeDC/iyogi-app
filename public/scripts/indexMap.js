mapboxgl.accessToken =
  "pk.eyJ1IjoiZGNsdWl6ZSIsImEiOiJjbGhobzkwZXUyZ3VnM2tvMzNud2djYzE5In0.dQAReVz20MlSNNHEaSCIrA";
const map = new mapboxgl.Map({
  container: "cluster-map",

  style: "mapbox://styles/mapbox/light-v11",
  center: [-97.211838, 38.925228],
  zoom: 4.2,
});

map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
  map.addSource("retreatData", {
    type: "geojson",
    data: retreatData,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "retreatData",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#c4ad92",
        10,
        "#8f7f6d",
        30,
        "#8f7f6d",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 10, 40, 30, 70],
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "retreatData",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "retreatData",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#9e958b",
      "circle-radius": 7,
      "circle-stroke-width": 1,
      "circle-stroke-color": "lavender",
    },
  });

  map.on("click", "clusters", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("retreatData")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  map.on("click", "unclustered-point", (e) => {
    const text = e.features[0].properties.popUpMarkup;
    const coordinates = e.features[0].geometry.coordinates.slice();

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup().setLngLat(coordinates).setHTML(text).addTo(map);
  });

  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });
});
