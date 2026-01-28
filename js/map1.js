mapboxgl.accessToken = "pk.eyJ1IjoiMjA2ZXQiLCJhIjoiY21oZHVlNGhsMDZvajJpb3JiYW44NDdkbCJ9.2t0kCjiMB6Mad8U9mEQfKQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [-98, 39],
  zoom: 3
});

map.on("load", () => {
  map.addSource("rates", {
    type: "geojson",
    data: "assets/us-covid-2020-rates.geojson.json"
  });

  map.addLayer({
    id: "rates-fill",
    type: "fill",
    source: "rates",
    paint: {
      "fill-color": "#3b82f6",
      "fill-opacity": 0.6,
      "fill-outline-color": "#111827"
    }
  });
});
