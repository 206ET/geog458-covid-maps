mapboxgl.accessToken =
  "pk.eyJ1IjoiMjA2ZXQiLCJhIjoiY21oZHVlNGhsMDZvajJpb3JiYW44NDdkbCJ9.2t0kCjiMB6Mad8U9mEQfKQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [-98, 39],
  zoom: 3
});

map.on("load", () => {
  
  map.addSource("cases", {
    type: "geojson",
    data: "assets/us-covid-2020-counts.geojson.json"
  });

  map.addLayer({
    id: "cases-circles",
    type: "circle",
    source: "cases",
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "cases"],
        1000, 2,
        10000, 5,
        50000, 10,
        100000, 15,
        500000, 25
      ],
      "circle-color": "#dc2626",
      "circle-opacity": 0.6,
      "circle-stroke-width": 0.5,
      "circle-stroke-color": "#7f1d1d"
    }
  });

  map.on("mouseenter", "cases-circles", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "cases-circles", () => {
    map.getCanvas().style.cursor = "";
  });

  map.on("click", "cases-circles", (e) => {
    const props = e.features[0].properties;

    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(
        `<strong>${props.county}, ${props.state}</strong><br/>
         Total cases: ${props.cases}`
      )
      .addTo(map);
  });
});
