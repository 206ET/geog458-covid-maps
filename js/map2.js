mapboxgl.accessToken =
  "pk.eyJ1IjoiMjA2ZXQiLCJhIjoiY21oZHVlNGhsMDZvajJpb3JiYW44NDdkbCJ9.2t0kCjiMB6Mad8U9mEQfKQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [-98, 39],
  zoom: 3,
});

map.addControl(new mapboxgl.NavigationControl(), "top-right");

map.on("load", () => {
  
  map.addSource("cases", {
    type: "geojson",
    data: "assets/us-covid-2020-counts.geojson.json",
  });

  
  map.addLayer({
    id: "cases-circles",
    type: "circle",
    source: "cases",
    paint: {
      // circle size scales with "cases"
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "cases"],
        0,
        0,
        1000,
        2,
        10000,
        6,
        50000,
        12,
        100000,
        18,
        500000,
        30,
      ],
      "circle-color": "#d62828",
      "circle-opacity": 0.55,
      "circle-stroke-width": 0.7,
      "circle-stroke-color": "#ffffff",
    },
  });

  
  map.on("mouseenter", "cases-circles", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "cases-circles", () => {
    map.getCanvas().style.cursor = "";
  });

  
  map.on("click", "cases-circles", (e) => {
    const props = e.features[0].properties;

    
    const county =
      props.county || props.NAME || props.name || props.NAMELSAD || "County";
    const state = props.state || props.STATE_NAME || props.STATE || "";
    const casesVal = props.cases;

    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;">
        <div style="font-weight:700; margin-bottom:4px;">${county}${state ? `, ${state}` : ""}</div>
        <div><b>Cases (2020):</b> ${Number(casesVal).toLocaleString()}</div>
      </div>
    `;

    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(map);
  });

  
  console.log("Map2 loaded ✅ Source file:", "assets/us-covid-2020-counts.geojson.json");
});
