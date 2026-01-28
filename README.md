# COVID-19 County-Level Maps (GEOG 458, Lab03)

## Project Overview
This project presents two interactive web maps visualizing county-level COVID-19 data across the United States for the year 2020. The goal of the project is to compare spatial patterns of COVID-19 **case rates** and **total case counts** using different thematic mapping techniques.

This lab includes:
1. A **choropleth map** showing COVID-19 case rates per 1,000 residents.
2. A **proportional symbol map** showing total COVID-19 case counts.

Both maps were built using **Mapbox GL JS** and are published using **GitHub Pages**.

---

## Live Maps
- **Choropleth Map (COVID-19 Case Rates):**  
  https://206et.github.io/geog458-covid-maps/map1.html

- **Proportional Symbol Map (COVID-19 Total Cases):**  
  https://206et.github.io/geog458-covid-maps/map2.html

---

- Choropleth map showing COVID-19 case rates by county  
- Proportional symbol map showing total COVID-19 cases by county  

---

## Data Sources
- **COVID-19 Case Data:**  
  The New York Times, COVID-19 county-level dataset (2020)

- **Population Data:**  
  U.S. Census Bureau, 2018 ACS 5-Year Estimates

- **Geographic Boundaries:**  
  U.S. Census Bureau county boundary shapefiles, processed and converted to GeoJSON

---

## Map Design & Projection
- **Projection:** Albers (US-focused)
- **Basemap:** Light Mapbox basemap chosen to minimize visual competition with thematic layers
- **Geographic Unit:** U.S. counties

---

## Primary Functions & Features

### Choropleth Map (Map 1)
- Counties are colored based on **COVID-19 case rates per 1,000 residents**
- Data is classified into multiple ranges and symbolized using a sequential color scheme
- Interactive hover and click events display county-level information
- Includes a dynamic legend explaining color ranges

### Proportional Symbol Map (Map 2)
- County centroids are represented using circles sized proportionally to **total COVID-19 cases**
- Circle sizes scale continuously using data-driven styling
- Interactive popups display county names and total case counts
- Includes a legend explaining relative symbol sizes

### Functions Not Covered in Lectures
- Use of `interpolate` expressions in Mapbox GL JS to dynamically scale symbol sizes
- Custom HTML legends created outside the Mapbox canvas
- Conditional cursor changes and interactive event handling (`mouseenter`, `mouseleave`, `click`)

---

## Libraries & Tools Used
- **Mapbox GL JS**
- **HTML5**
- **CSS**
- **JavaScript**
- **GitHub Pages**

---

## File Structure
