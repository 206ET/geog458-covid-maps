mapboxgl.accessToken = "pk.eyJ1IjoiMjA2ZXQiLCJhIjoiY21oZHVlNGhsMDZvajJpb3JiYW44NDdkbCJ9.2t0kCjiMB6Mad8U9mEQfKQ";


const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11", 
  center: [-98.5, 39.8],
  zoom: 3.25,
  projection: "albers"
});

map.addControl(new mapboxgl.NavigationControl(), "top-right");


function pickRateField(geojson) {
  const f = geojson?.features?.[0];
  if (!f || !f.properties) return null;

  const props = f.properties;

  
  const common = [
    "rate", "cases_rate", "case_rate", "caseRate",
    "cases_per_1000", "cases_per_1000_residents",
    "casesPer1000", "rate_per_1000", "cases_1000"
  ];

  for (const k of common) {
    if (typeof props[k] === "number") return k;
    if (typeof props[k] === "string" && !isNaN(parseFloat(props[k]))) return k;
  }

  
  const keys = Object.keys(props);
  for (const k of keys) {
    const v = props[k];
    const isNumeric = (typeof v === "number") || (typeof v === "string" && !isNaN(parseFloat(v)));
    if (!isNumeric) continue;

    const name = k.toLowerCase();
    if (name.includes("rate") || name.includes("per") || name.includes("1000")) return k;
  }

  
  for (const k of Object.keys(props)) {
    const v = props[k];
    const isNumeric = (typeof v === "number") || (typeof v === "string" && !isNaN(parseFloat(v)));
    if (isNumeric) return k;
  }

  return null;
}


function buildLegend(values) {
  const rows = document.getElementById("legend-rows");
  rows.innerHTML = "";

  values.sort((a, b) => a - b);

  const n = values.length;
  const q = (p) => values[Math.floor(p * (n - 1))];

  
  const breaks = [q(0), q(0.2), q(0.4), q(0.6), q(0.8), q(1)];

  
  const colors = ["#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"];

  for (let i = 0; i < 6; i++) {
    const a = breaks[i];
    const b = i === 5 ? breaks[i] : breaks[i + 1];

    const label = i === 5
      ? `${a.toFixed(1)}+`
      : `${a.toFixed(1)} – ${b.toFixed(1)}`;

    const row = document.createElement("div");
    row.className = "legend-row";

    const left = document.createElement("div");
    left.className = "legend-left";

    const swatch = document.createElement("div");
    swatch.className = "swatch";
    swatch.style.background = colors[i];

    const text = document.createElement("div");
    text.textContent = label;

    left.appendChild(swatch);
    left.appendChild(text);

    row.appendChild(left);
    rows.appendChild(row);
  }

  return { breaks, colors };
}

map.on("load", async () => {
  
  const res = await fetch("assets/us-covid-2020-rates.geojson.json");
  const geo = await res.json();

  const rateField = pickRateField(geo);
  console.log("Map1 selected rate field:", rateField);

  if (!rateField) {
    console.error("No numeric rate field found in rates geojson.");
    return;
  }

  const values = geo.features
    .map(ft => {
      const v = ft.properties[rateField];
      const num = typeof v === "number" ? v : parseFloat(v);
      return Number.isFinite(num) ? num : null;
    })
    .filter(v => v !== null);

  if (values.length === 0) {
    console.error("Rate field exists, but no numeric values found.");
    return;
  }

  const { breaks, colors } = buildLegend(values);

  map.addSource("rates", {
    type: "geojson",
    data: geo
  });

  map.addLayer({
    id: "rates-fill",
    type: "fill",
    source: "rates",
    paint: {
      "fill-color": [
        "step",
        ["to-number", ["get", rateField]],
        colors[0], breaks[1],
        colors[1], breaks[2],
        colors[2], breaks[3],
        colors[3], breaks[4],
        colors[4], breaks[5],
        colors[5]
      ],
      "fill-opacity": 0.75
    }
  });

  map.addLayer({
    id: "rates-outline",
    type: "line",
    source: "rates",
    paint: {
      "line-color": "rgba(0,0,0,0.25)",
      "line-width": 0.5
    }
  });

  map.on("click", "rates-fill", (e) => {
    const f = e.features?.[0];
    if (!f) return;

    const props = f.properties || {};
    const rateValRaw = props[rateField];
    const rateVal = typeof rateValRaw === "number" ? rateValRaw : parseFloat(rateValRaw);

    const name =
      props.county || props.COUNTY || props.NAME || props.name ||
      props.county_name || "County";

    const state =
      props.state || props.STATE || props.state_name || props.ST_NM || "";

    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`
        <b>${name}${state ? ", " + state : ""}</b><br/>
        <b>Rate (per 1,000):</b> ${Number.isFinite(rateVal) ? rateVal.toFixed(1) : "N/A"}
      `)
      .addTo(map);
  });

  map.on("mouseenter", "rates-fill", () => (map.getCanvas().style.cursor = "pointer"));
  map.on("mouseleave", "rates-fill", () => (map.getCanvas().style.cursor = ""));
});
