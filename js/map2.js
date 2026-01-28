mapboxgl.accessToken = "pk.eyJ1IjoiMjA2ZXQiLCJhIjoiY21oZHVlNGhsMDZvajJpb3JiYW44NDdkbCJ9.2t0kCjiMB6Mad8U9mEQfKQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11", 
  center: [-98.5, 39.8],
  zoom: 3.25,
  projection: "albers"
});

map.addControl(new mapboxgl.NavigationControl(), "top-right");

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
        ["to-number", ["get", "cases"]],
        100, 2,
        1000, 5,
        5000, 10,
        10000, 15,
        50000, 25
      ],
      "circle-color": "#dc2626",
      "circle-opacity": 0.55,
      "circle-stroke-width": 0.75,
      "circle-stroke-color": "#ffffff"
    }
  });

  map.on("mouseenter", "cases-circles", () => (map.getCanvas().style.cursor = "pointer"));
  map.on("mouseleave", "cases-circles", () => (map.getCanvas().style.cursor = ""));


  map.on("click", "cases-circles", (e) => {
    const f = e.features?.[0];
    if (!f) return;

    const props = f.properties || {};
    const county = props.county || props.COUNTY || props.NAME || props.name || "County";
    const state = props.state || props.STATE || props.state_name || "";
    const casesRaw = props.cases;
    const cases = typeof casesRaw === "number" ? casesRaw : parseFloat(casesRaw);

    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`
        <b>${county}${state ? ", " + state : ""}</b><br/>
        <b>Cases (2020):</b> ${Number.isFinite(cases) ? cases.toLocaleString() : "N/A"}
      `)
      .addTo(map);
  });
});
