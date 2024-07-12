// maped the color with matics values

export const url = {
  LOCAL_HOST_L: 'http://10.25.53.164:8088/',
  LOCAL_HOST_R: 'http://10.25.53.161:8088/',
  SERVER_HOST: 'http://10.194.83.67/',
  LOCAL_HOST: 'http://localhost:8088/',
};

export const getMapedColors = (linearColorScale: any, matricsValues: any) => {
  let z = [];
  for (let i: any = 0; i < matricsValues.length; i++) {
    let a;
    let b;
    a = matricsValues[i];
    if (typeof a === 'object') {
      a = a.label;
    }
    const colorsLength = linearColorScale.colors.length;
    if (colorsLength > i) {
      b = linearColorScale.colors[i];
    } else {
      b = linearColorScale.colors[i % colorsLength];
    }
    const m = { [a]: b };
    z.push(m);
  }
  return z;
};

export const getUniqueValues = (firstData: any, secondCriteria: any) => {
  const uniqueValues: any = {};
  // Iterate through the criteria and initialize variables as arrays
  secondCriteria.forEach((criteria: any) => {
    uniqueValues[criteria] = [];
  });
  // Iterate through the first dataset
  firstData.forEach((item: any) => {
    // Check if the item matches the criteria from the second dataset
    const matchesCriteria = secondCriteria.every((criteria: any) => {
      return item.cols.includes(criteria);
    });
    // If it matches, extract the unique values
    if (matchesCriteria) {
      secondCriteria.forEach((criteria: any) => {
        if (!uniqueValues[criteria].includes(item[criteria])) {
          uniqueValues[criteria].push(item[criteria]);
        }
      });
    }
  });
  return uniqueValues; // Return an object with separate variables as arrays for each unique value
};

export const removeDataByCols = (data: any, colsToRemove: any) => {
  return data.map((item: any) => {
    const newItem = { ...item };
    colsToRemove.forEach((col: any) => {
      delete newItem[col];
    });
    delete newItem.metrics;
    delete newItem.cols;
    return newItem;
  });
};

export const handleFilterData = (data: any, cols: any, label = []) => {
  let mData: any = [];
  let mapLabels: any = [];
  for (const key in data) {
    const value = data[key];
    if (cols?.length === 1) {
      mData.push(value);
      mapLabels.push([...label, key].join(', ')); // Create Labels for map
    } else {
      const subLabels: any = [...label, key];
      const { mData: subData, mapLabels: subMapLabels } = handleFilterData(
        value,
        cols.slice(1),
        subLabels,
      );
      mData = mData.concat(subData);
      mapLabels = mapLabels.concat(subMapLabels);
    }
  }
  return { mData, mapLabels };
};

export const removeParenthesesFromString = (value: any) => {
  if (value !== undefined) {
    let stringWithoutParentheses = value.replace(/\(\*\)/g, '');

    if (stringWithoutParentheses !== null) return stringWithoutParentheses;
  }
};

export const handleBarWidth = (value: any) => {
  let barWidth: any = [];
  if (value?.length <= 10) {
    barWidth = 20;
  }
  if (value?.length <= 20 && value?.length > 10) {
    barWidth = 10;
  }
  if (value?.length <= 30 && value?.length > 20) {
    barWidth = 7;
  }
  if (value?.length <= 40 && value?.length > 30) {
    barWidth = 5;
  }
  if (value?.length <= 52 && value?.length > 40) {
    barWidth = 3;
  } else if (value?.length > 52) {
    barWidth = 2;
  }
  return barWidth;
};

// Sorting on all data values for quarter
export const quarterSorting = (dataValue: any) => {
  dataValue.sort((a: any, b: any) => {
    let regex;
    if (a[0].match(regexFormats.quarterYear)) {
      regex = regexFormats.quarterYear;
    } else if (regexFormats.quarterMonthYear) {
      regex = regexFormats.quarterMonthYear;
    }
    const matchA = a[0].match(regex);
    const matchB = b[0].match(regex);
    if (matchA && matchB) {
      const [quarterA, yearRangeA] = a[0]?.match(regex)?.slice(1);
      const [quarterB, yearRangeB] = b[0]?.match(regex)?.slice(1);
      // Compare the starting years
      const yearA =
        parseInt(yearRangeA, 10) + parseInt(yearRangeA.slice(-2), 10) * 0.01;
      const yearB =
        parseInt(yearRangeB, 10) + parseInt(yearRangeB.slice(-2), 10) * 0.01;
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      // If years are the same, compare the quarters
      return quarterA.localeCompare(quarterB);
    } else {
      return a > b ? 1 : -1;
    }
  });
};

// sorting on quarter array
export const filtersQuarterSorting = (data: Array<any>) => {
  data?.sort((a, b) => {
    let regex;
    const valueA: any = Object.values(a);
    const valueB: any = Object.values(b);

    if (valueA[0].match(regexFormats.quarterYear)) {
      regex = regexFormats.quarterYear;
    } else if (regexFormats.quarterMonthYear) {
      regex = regexFormats.quarterMonthYear;
    }

    const matchA = valueA[0].match(regex);
    const matchB = valueB[0].match(regex);
    if (matchA && matchB) {
      const [quarterA, yearRangeA] = valueA[0]?.match(regex)?.slice(1);
      const [quarterB, yearRangeB] = valueB[0]?.match(regex)?.slice(1);
      // Compare the starting years
      const yearA =
        parseInt(yearRangeA, 10) + parseInt(yearRangeA.slice(-2), 10) * 0.01;
      const yearB =
        parseInt(yearRangeB, 10) + parseInt(yearRangeB.slice(-2), 10) * 0.01;
      if (yearA !== yearB) {
        return yearB - yearA;
      }
      // If years are the same, compare the quarters
      return quarterB.localeCompare(quarterA);
    } else {
      return b > a ? 1 : -1;
    }
  });
};

export const regexFormats = {
  quarterYear: /Q(\d) (\d{4})-(\d{2})/,
  quarterMonthYear: /^Q(\d)\(\w+-\w+\) (\d{4})-(\d{2})$/,
};

export const numbersCount = (value: any) => {
  return value.toString().length;
};

export const powNumbers = (numberCount: any) => {
  return Math.pow(10, numberCount - 1);
};

export const handleRoundingValues = (minInterval: any) => {
  const intervalCount = numbersCount(parseInt(minInterval));
  const intervalBaseValue = powNumbers(intervalCount);
  return Math.ceil(minInterval / intervalBaseValue) * intervalBaseValue;
};

const findIntervals = (arr: any) => {
  const intervals = [];
  for (let i = 1; i < arr.length; i++) {
    const interval = arr[i] - arr[i - 1];
    intervals.push(interval);
  }
  return intervals;
};

const handleMinInterval = (array: any) => {
  const positiveArray = array.map(Math.abs);
  const a = Math.min(...positiveArray);
  return a;
};

export const getMaxScaleValue = (a: any, dataLabelsVerticalAlign: any) => {
  if (a[0] !== undefined) {
    const maxDataValue = Math.max(...(a[0] as number[]));
    const intervals = findIntervals(a[0]);
    const minInterval = handleMinInterval(intervals);
    const roundedIntervalValue = handleRoundingValues(minInterval);
    const roundedDataValue = handleRoundingValues(maxDataValue);

    const totalValue = dataLabelsVerticalAlign
      ? roundedIntervalValue + roundedDataValue
      : roundedDataValue;
    console.log(
      'rounding values: ',
      maxDataValue,
      minInterval,
      roundedIntervalValue,
      roundedDataValue,
    );

    return handleRoundingValues(totalValue);
  }
};

export const columnTypes = [
  'CHAR',
  'VARCHAR',
  'BINARY',
  'VARBINARY',
  'TEXT',
  'BLOB',
  'ENUM',
  'SET',
  'STRING',
];

export const marticsTypes = [
  'INT',
  'TINYINT',
  'SMALLINT',
  'MEDIUMINT',
  'BIGINT',
  'DECIMAL',
  'FLOAT',
  'DOUBLE',
  'BOOLEAN',
  'SERIAL',
  'DATE',
  'TIME',
  'DATETIME',
  'TIMESTAMP',
  'YEAR',
  'DOUBLE PRECISION',
  'TIMESTAMP WITHOUT TIME ZONE',
  'GEOMETRY',
  'POINT',
  'LINESTRING',
  'POLYGON',
  'GEOMETRYCOLLECTION',
  'MULTIPOINT',
  'MULTILINESTRING',
  'MULTIPOLYGON',
  'LONGINTEGER',
];

export const columns = [
  'Year',
  'srcYear',
  'Gender',
  'month',
  'BlockName',
  'new_month',
  'country_name',
  'country',
  'city_name',
  'village_name',
  'village',
  'Village',
  'date',
  'Date',
  'state_name',
  'srcStateName',
  'srcDistrictName',
  'StateName',
  'DistrictName',
  'district_name',
  'District',
  'district',
  'State',
  'state',
];
export const state_data = [
  'states_name',
  'state_name',
  'States_name',
  'srcStateName',
  'StateName',
  'State',
  'state',
  'states',
  'States',
  'State Name',
  'State name',
  'state name',
];
export const district_data = [
  'srcDistrictName',
  'DistrictName',
  'district_name',
  'District_name',
  'District Name',
  'district name',
  'District name',
  'Districts_name',
  'Districts',
  'District',
  'district',
  'districts',
  'district_name',
];

export const quarterNames = ['quartor', 'finyear', 'quarter_year'];
