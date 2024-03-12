import React, { useEffect } from "react";
import Plotly from "plotly.js-dist";
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

const MapboxChart = () => {

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch("http://ec252.abrasel.com.br:8443/api/leads/v1/estabelecimentos/counts?origem=benvisavale&groupby=longitudes,latitudes,nome_fantasia");
        const data = await response.json();

        const doWhatever = (data) => {
          // Function to extract values from a column in the data
          const unpack = (data, key) => {
            return data.map(row => row[key]);
          };

          // Define the map trace (points)
          const trace = {
            type: "scattermapbox",
            text: unpack(data, "NOME_FANTASIA"),
            lon: unpack(data, "LONGITUDES"),
            lat: unpack(data, "LATITUDES"),
            marker: { color: "purple", size: 7 }
          };

          // Map layout settings
          const layout = {
            dragmode: "zoom",
            mapbox: {
              style: "mapbox://styles/mapbox/dark-v10",
              accesstoken: "pk.eyJ1IjoibHVpenZnbSIsImEiOiJjbGpwcDdleWUwMTN5M2VwZGNiY3Jlc3J0In0.8WXmL0waJtqgvQTYjHUh4A",
              center: { lat: -14, lon: -51 },
              zoom: 3
            },
            margin: { r: 0, t: 0, b: 0, l: 0 }
          };

          const plotData = [trace];

          // Create the map using Plotly
          Plotly.newPlot("myDiv", plotData, layout);

          const mapElement = document.getElementById("myDiv");
          const map = mapElement._fullLayout.mapbox._subplot.map;

          // Event handler for marker click
          mapElement.on("plotly_click", function (data) {
            const point = data.points[0];
            const lat = point.lat;
            const lon = point.lon;
            const zoomLevel = 14;
            const duration = 2000;

            // Smooth zoom animation to the clicked marker
            map.flyTo({
              center: [lon, lat],
              zoom: zoomLevel,
              duration: duration
            });
          });
        };

        doWhatever(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

  }, []);

  return (
    <div id="myDiv" style={{ width: "100%", height: "500px" }}></div>
  );
};

export default MapboxChart;