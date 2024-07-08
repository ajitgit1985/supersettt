// New Changes
import d3 from 'd3';
import PropTypes from 'prop-types';
import { extent as d3Extent } from 'd3-array';

import * as React from 'react';
import { Button } from 'antd';
import ReactDOM from 'react-dom';
// import mapJasonValue from 'superset-frontend/plugins/legacy-plugin-chart-country-map/src/countries/india.geojson';

import {
  getNumberFormatter,
  getSequentialSchemeRegistry,
  CategoricalColorNamespace,
  NumberFormatter,
} from '@superset-ui/core';
import countries, { countryOptions } from './countries';

import { ControlPanelConfig } from '@superset-ui/chart-controls';
import { formatCountdown } from 'antd/lib/statistic/utils';
import { useAtomValue } from 'jotai';
import { tooltiData } from 'src/views/atoms';

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      country_id: PropTypes.string,
      metric: PropTypes.number,
    }),
  ),
  width: PropTypes.number,
  height: PropTypes.number,
  country: PropTypes.string,
  linearColorScheme: PropTypes.string,
  mapBaseUrl: PropTypes.string,
  numberFormat: PropTypes.string,
};

const maps = {};

let isDistrictSelected = false;
function CountryMap(element, props) {
  const {
    data,
    width,
    height,
    country,
    linearColorScheme,
    numberFormat,
    colorScheme,
    sliceId,
  } = props;
console.log("data_map",data);
  // const tooltip = d3
  //   .select('body')
  //   .append('div')
  //   .attr('class', 'tooltip')
  //   .style('opacity', 0);

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('pointer-events', 'none');

  // tooltip.append("div") // Add inner div for tooltip content
  // .attr("class", "tooltip-content");

  const container = element;
  const format = getNumberFormatter(numberFormat);

  //----------- calclulate percentage wise legend new--------------------
  // Calculate the total metric value
  const totalMetric = data.reduce((total, item) => total + item.metric, 0);

  // Initialize an object to store the percentages
  const percentageData = {};

  // Calculate and store percentages for each item
  for (const item of data) {
    // Convert metric value to the "35.44" format
    const convertedMetric = (item.metric / 1000000).toFixed(2);

    const percentage = (item.metric / totalMetric) * 1000;

    // Determine the percentage range
    let range;
    if (percentage >= 0 && percentage <= 20) {
      range = '0-20%';
    } else if (percentage > 20 && percentage <= 40) {
      range = '21-40%';
    } else if (percentage > 40 && percentage <= 60) {
      range = '41-60%';
    } else if (percentage > 60 && percentage <= 80) {
      range = '61-80%';
    } else {
      range = '81-100%';
    }

    // Store the percentage and converted metric in the appropriate range
    if (!percentageData[range]) {
      percentageData[range] = [];
    }
    percentageData[range].push({
      country_id: item.country_id,
      percentage,
      convertedMetric,
    });
  }

  const linearColorScale = getSequentialSchemeRegistry()
    .get(linearColorScheme)
    .createLinearScale(d3Extent(data, v => v.metric));

  const colorScale = CategoricalColorNamespace.getScale(colorScheme);

  const colorMap = {};
  data.forEach(d => {
    colorMap[d.country_id] = colorScheme
      ? colorScale(d.country_id, sliceId)
      : linearColorScale(d.metric);
  });

  // convert color map data in json (here all logic color rgb append in 0-20,21-40 me store and the last)
  const colorMapString = JSON.stringify(colorMap, null, 2);
  const color_json = JSON.parse(colorMapString);
  const range_percentage_store = [];
  // Iterate through the object
  for (const range in percentageData) {
    if (percentageData.hasOwnProperty(range)) {
      const countryArray = percentageData[range];

      // Iterate through the array for each percentage range
      for (const countryObj of countryArray) {
        const countryId = countryObj.country_id;

        // Check if the country_id exists as a key in color_json
        if (color_json.hasOwnProperty(countryId)) {
          const colorValue = color_json[countryId];
          range_percentage_store.push({
            'Percentage Range': range,
            'Country ID': countryId,
            'RGB Color': colorValue,
            // "Percentage": countryObj.percentage,
          });
        }
      }
    }
  }

  // Create an empty array to store the values (lenend logic here new )
  const legend = [];
  // Iterate through the colorMap object and push the values to the array
  for (const key in colorMap) {
    if (colorMap.hasOwnProperty(key)) {
      const value = colorMap[key];
      legend.push(value);
    }
  }

  // Log the valueList array to the console
  const formattedData = '[' + legend.join(',') + ']';
  //end here

  let addmatchingcolor = [];
  const colorFn = d => {
    if (!d.properties || !d.properties.ISO) {
      return 'gray'; // Fallback color for missing ISO property
    }
    const iso = d.properties.ISO;
    let maxSimilarity = 0;
    let matchingColor = 'none';
    //add machingcolor new data
    const storedFormData = localStorage.getItem('formDataValue');
    let parsedFormData = JSON.parse(storedFormData);

    data.forEach((region, i) => {
      const similarityScore = similarity(iso, region.country_id);
      //  Remove the space from the values of iso and contry name
      const isoValue = iso.replace(/\s/g, '').toLowerCase();
      const countryName = region.country_id.replace(/\s/g, '').toLowerCase();
      // To change the colour of selected state on dashboard

      if (parsedFormData !== null) {
        // only for Dashboard
        if (isoValue == countryName) {
          maxSimilarity = similarityScore;
          matchingColor = colorScheme
            ? colorScale(region.country_id, sliceId)
            : linearColorScale(region.metric);
        }
      } else {
        // For Chart
        if (similarityScore > maxSimilarity) {
          maxSimilarity = similarityScore;
          matchingColor = colorScheme
            ? colorScale(region.country_id, sliceId)
            : linearColorScale(region.metric);
        }
      }
    });
    return matchingColor;
  };

  // Create a link element and set its attributes
  const link = document.createElement('link');
  link.href =
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css';
  link.rel = 'stylesheet';

  const countryMapElement = document.querySelector('.country_map');
  if (countryMapElement) {
    // Remove any existing modalBody elements
    const existingModalBody = countryMapElement.querySelector('.modal-body1');
    if (existingModalBody) {
      existingModalBody.remove();
    }

    // Create and append modalBody inside it
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body1');

    // Check the value of numberFormat
    if (numberFormat === 'Percentage') {
      // Get unique percentage ranges from the range_percentage_store
      const uniquePercentageRanges = [
        ...new Set(
          range_percentage_store.map(item => item['Percentage Range']),
        ),
      ];

      // Create a container div to hold the legend boxes and labels
      const legendContainer = document.createElement('div');
      legendContainer.classList.add('legend-container');

      // Add CSS styles for the legend container
      legendContainer.style.display = 'flex'; // Make it a flex container
      legendContainer.style.alignItems = 'center'; // Align items vertically in the center
      legendContainer.style.gap = '10px'; // Add a gap between legend items

      // Create legend boxes for each unique percentage range
      uniquePercentageRanges.forEach((range, i) => {
        // Create a container for each legend box and label
        const legendItemContainer = document.createElement('div');
        legendItemContainer.classList.add('legend-item-container');

        // Create a legend box div and set the background color
        const legendBox = document.createElement('div');
        legendBox.classList.add('legend-box');
        const matchingItem = range_percentage_store.find(
          item => item['Percentage Range'] === range,
        );
        if (matchingItem) {
          const colorValue = matchingItem['RGB Color'];
          legendBox.style.backgroundColor = colorValue;
        }

        // Set the width and height of the legend boxes
        legendBox.style.width = '30px';
        legendBox.style.height = '20px';

        // Append the legend box to the legend item container
        legendItemContainer.appendChild(legendBox);
        const label = document.createElement('span');
        label.textContent = range;
        label.classList.add('legend-label');
        legendItemContainer.appendChild(label);
        // Append the legend item container to legendContainer
        legendContainer.appendChild(legendItemContainer);
      });

      // Append legendContainer to modalBody
      modalBody.appendChild(legendContainer);

      // Add a class to toggle the pseudo-elements and styles
      modalBody.classList.add('gradient-background');
    } else {
      // If numberFormat is not "Percentage," define a gradient background using CSS
      const remove_square_legend = formattedData.slice(1, -1);
      const gradientBackground = `linear-gradient(to right, ${remove_square_legend})`;

      // Apply the gradient background to modalBody using inline CSS
      modalBody.style.background = gradientBackground;
    }
    // Append modalBody to countryMapElement
    countryMapElement.appendChild(modalBody);
  } else {
    console.error('Element with class .country_map not found.');
  }

  const oldcolorFn = d => colorMap[d.properties.ISO] || colorFn(d);

  const path = d3.geo.path();
  const div = d3.select(container);
  div.classed('superset-legacy-chart-country-map', true);
  container.style.overflow = 'auto'; // Add this line to enable scrolling

  div.selectAll('*').remove();
  container.style.height = `${height}px`;
  container.style.width = `${width}px`;
  const svg = div
    .append('svg:svg')
    .attr('width', width)
    .attr('height', height + 100)
    .attr('preserveAspectRatio', 'xMidYMid meet');
  const backgroundRect = svg
    .append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height);
  const g = svg.append('g');
  const mapLayer = g.append('g').classed('map-layer', true);
  const textLayer = g
    .append('g')
    .classed('text-layer', true)
    .attr('transform', `translate(${width / 2}, 45)`)
    .style('display', 'none');
  const bigText = textLayer.append('text').classed('big-text', true);
  const resultText = textLayer
    .append('text')
    .classed('result-text', true)
    .attr('dy', '1em');

  let centered;
  const clicked = function clicked(d) {
    // For disabled the click on district map.
    if (!isDistrictSelected) {
      const stateISO = d.properties.ISO;
      const button = d3
        .select('.country_map')
        .append('button')
        .html('India Map')
        .on('click', () => {
          const url = countries[country];
          // For this example, we'll use the d3.json function
          let india_map = null;

          d3.json(url, (error, data) => {
            if (error) {
              console.error('Error loading state GeoJSON:', error);
            } else {
              india_map = data;
              sessionStorage.clear();
              mapLayer.selectAll('*').remove();
              console.log('Loaded stateMapData:', india_map);
              drawMap(india_map);
              button.style('display', 'none');
              isDistrictSelected = false;
            }
          });
          return india_map;
        });
      sessionStorage.setItem('no_formater_session', stateISO);
      const MapData = loadStateGeoJSON(stateISO);
      drawMap(MapData);

      const hasCenter = d && centered !== d;
      let x;
      let y;
      let k;
      const halfWidth = width / 2;
      const halfHeight = height / 2;

      if (hasCenter) {
        const centroid = path.centroid(d);
        [x, y] = centroid;
        k = 4;
        centered = d;
      } else {
        x = halfWidth;
        y = halfHeight;
        k = 1;
        centered = null;
      }

      g.transition()
        .duration(750)
        .attr(
          'transform',
          `translate(${halfWidth},${halfHeight})scale(${k})translate(${-x},${-y})`,
        );
      textLayer
        .style('opacity', 0)
        .attr(
          'transform',
          `translate(0,0)translate(${x},${hasCenter ? y - 5 : 45})`,
        )
        .transition()
        .duration(750)
        .style('opacity', 1);
      bigText
        .transition()
        .duration(750)
        .style('font-size', hasCenter ? 6 : 16);
      resultText
        .transition()
        .duration(750)
        .style('font-size', hasCenter ? 16 : 24);
    }
  };
  backgroundRect.on('click', clicked);

  const selectAndDisplayNameOfRegion = function selectAndDisplayNameOfRegion(
    feature,
  ) {
    let name = '';
    if (feature && feature.properties) {
      if (feature.properties.ID_2) {
        name = feature.properties.NAME_2;
      } else {
        name = feature.properties.NAME_1;
      }
    }
    bigText.text(name);
  };

  const updateMetrics = function updateMetrics(region) {
    if (region && region.length > 0) {
      resultText.text(format(region[0].metric));
    } else {
      resultText.text('0'); // Display a message for null or empty region
    }
  };
  // fecth json data after over get the district result
  function fetchJSONData(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const jsonData = JSON.parse(xhr.responseText);
        callback(jsonData);
      }
    };
    xhr.send();
  }

  // Example function to find the key dynamically based on your criteria
  function findKeyBasedOnDataset(obj) {
    // Replace this logic with your own
    for (const key in obj) {
      return key;
    }
    return null; // Return null or handle it appropriately if the key is not found
  }

  const mouseenter = function mouseenter(d) {
    // for passing the value iside the function updateTooltipContent which is using for update the tooltip content
    const event = d3.event;

    const select_state = d.properties.ISO;
    const tooltip_data = localStorage.getItem('tooltip_data');
    const parsed_tooltip_data = JSON.parse(tooltip_data);
    const modifiedKeys = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        const obj = data[i];
        //chect confition bot state_name
        const dynamicKey = findKeyBasedOnDataset(obj);
        const stateName_dynamic = obj[dynamicKey]; // Extract the value of the "State" key

        if (stateName_dynamic.toLowerCase() === select_state.toLowerCase()) {
          // Remove brackets from property names
          const modifiedObj = {};
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const modifiedKey = key.replace(/\(.*\)/g, '');
              // round logic here
              const numericValue = parseFloat(obj[key]);
              if (!isNaN(numericValue)) {
                modifiedObj[modifiedKey.trim()] = numericValue.toFixed(2);
              } else {
                modifiedObj[modifiedKey.trim()] = obj[key]; // Keep the original value if it's not a valid number
              }
              //append data
              modifiedKeys.push(modifiedKey.trim());
            }
          }

          const propertyNamesToRetrieve = [
            'COUNT',
            'AVG',
            'MAX',
            'COUNT_DISTINCT',
            'MIN',
            'SUM',
            'count',
            'metric',
          ];
          const count_key_value = propertyNamesToRetrieve.map(propertyName => {
            modifiedObj[`propertyName`];
          });
          const count_key_value_filter = count_key_value.filter(
            value => typeof value !== 'undefined',
          ); // Filter out undefined values
          d.count_key_value_filter = modifiedObj.metric;
          d.modifiedKeys = modifiedKeys[1];
        }
      }
    }

    let c = colorFn(d);

    if (c !== 'none') {
      c = d3.rgb(c).darker().toString();
    }
    d3.select(this).style('fill', c);
    selectAndDisplayNameOfRegion(d);
    const district_name = d.properties.ISO;
    const district_tooltip = district_name.trim().split(/ +/).join('_');
    const lc_dis_tooltip = district_tooltip.toLowerCase();
    const district_name_url = countries[lc_dis_tooltip];

    fetch(district_name_url)
      .then(response => response.json())
      .then(data => {
        // Access the features array and count the number of items
        const features = data.features || [];
        d.numberOfDistricts = features.length;
        updateTooltipContent(event);
      });

    const result = data.filter(region =>
      fuzzyMatch(region.country_id, d.properties.ISO),
    );
    updateMetrics(result);

    function updateTooltipContent(event) {
      // Display tooltip
      tooltip.transition().duration(200).style('opacity', 0.9);

      let tooltipContent = '';

      if (d.numberOfDistricts !== undefined) {
        if (typeof d.modifiedKeys !== 'undefined') {
          if (isDistrictSelected) {
            tooltipContent = `<strong>State Name: ${d.properties.NAME_1}</strong><br/><strong>${d.modifiedKeys}:${d.count_key_value_filter}</strong>`;
          } else {
            tooltipContent = `<strong>State Name: ${d.properties.NAME_1}</strong><br/><strong>Total District: ${d.numberOfDistricts}</strong><br/><strong>${d.modifiedKeys}:${d.count_key_value_filter}</strong>`;
          }
        } else {
          if (isDistrictSelected) {
            tooltipContent = `<strong>State Name: ${d.properties.NAME_1}</strong>`;
          } else {
            tooltipContent = `<strong>State Name: ${d.properties.NAME_1}</strong><br/><strong>Total District: ${d.numberOfDistricts}</strong>`;
          }
        }
      } else {
        tooltipContent = 'Loading...'; // Display a loading message
      }

      // Position tooltip
      tooltip
        .html(tooltipContent)
        .style('left', event.pageX + 'px')
        .style('top', event.pageY - 28 + 'px');
    }
  };

  // Function to perform fuzzy matching between two strings
  function fuzzyMatch(str1, str2) {
    // Convert both strings to lowercase for case-insensitive comparison
    const lowerStr1 = str1.toLowerCase();
    const lowerStr2 = str2.toLowerCase();

    // Perform your fuzzy matching logic here
    // For example, you can use string similarity algorithms like Levenshtein distance or Jaro-Winkler distance

    // In this example, we'll check if one string is a substring of the other
    return lowerStr1.includes(lowerStr2) || lowerStr2.includes(lowerStr1);
  }
  function loadStateGeoJSON(stateISO) {
    const stateISOtrim = stateISO.trim().split(/ +/).join('_');
    const lowerCaseStateiso = stateISOtrim.toLowerCase();
    const stateGeoJSONUrl = countries[lowerCaseStateiso];
    // Load the GeoJSON data using d3.json or any suitable method
    // For this example, we'll use the d3.json function
    let stateMapData = null;

    d3.json(stateGeoJSONUrl, (error, data) => {
      if (error) {
        console.error('Error loading state GeoJSON:', error);
      } else {
        stateMapData = data;
        isDistrictSelected = true;
        mapLayer.selectAll('*').remove();
        drawMap(stateMapData);
      }
    });

    // Return the GeoJSON data (will be null until loaded)
    return stateMapData;
  }

  const mouseout = function mouseout() {
    d3.select(this).style('fill', colorFn);

    // Hide tooltip
    tooltip.transition().duration(500).style('opacity', 0);
  };

  const similarity = (a, b) => {
    const minLength = Math.min(a.length, b.length);
    let matchingChars = 0;
    for (let i = 0; i < minLength; i++) {
      if (a[i] === b[i]) {
        matchingChars++;
      }
    }
    return matchingChars / minLength;
  };

  function drawMap(mapData) {
    sessionStorage.setItem('no_country_session', country);
    const { features } = mapData;
    const center = d3.geo.centroid(mapData);
    const scale = 1000;
    const projection = d3.geo
      .mercator()
      .scale(scale)
      .center(center)
      .translate([width / 2, height / 2]);
    path.projection(projection);

    // Compute scale that fits container.
    const bounds = path.bounds(mapData);
    const hscale = (scale * width) / (bounds[1][0] - bounds[0][0]);
    const vscale = (scale * height) / (bounds[1][1] - bounds[0][1]);
    const newScale = hscale < vscale ? hscale : vscale;

    // Compute bounds and offset using the updated scale.
    projection.scale(newScale);
    const newBounds = path.bounds(mapData);
    projection.translate([
      width - (newBounds[0][0] + newBounds[1][0]) / 2,
      height - (newBounds[0][1] + newBounds[1][1]) / 2,
    ]);

    // Draw each province as a path
    mapLayer
      .selectAll('path')
      .data(features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'region')
      .attr('vector-effect', 'non-scaling-stroke')
      .style('fill', colorFn)
      .on('mouseenter', mouseenter)
      .on('mouseout', mouseout)
      .on('click', clicked);
  }

  const sessionstore = sessionStorage.getItem('no_formater_session');
  const sessionstore_country = sessionStorage.getItem('no_country_session');

  if (country != sessionstore_country) {
    sessionStorage.clear();
  }
  if (numberFormat && sessionstore) {
    loadStateGeoJSON(sessionstore);
  } else {
    const map = maps[country];
    if (map) {
      drawMap(map);
    } else {
      const url = countries[country];
      d3.json(url, (error, mapData) => {
        if (error) {
          const countryName =
            countryOptions.find(x => x[0] === country)?.[1] || country;
          d3.select(element).html(
            `<div class="alert alert-danger">Could not load map data for ${countryName}</div>`,
          );
        } else {
          maps[country] = mapData;
          drawMap(mapData);
          sessionStorage.clear();
          sessionStorage.setItem('no_country_session', country);
        }
      });
    }
  }
}

CountryMap.displayName = 'CountryMap';
CountryMap.propTypes = propTypes;

export default CountryMap;
