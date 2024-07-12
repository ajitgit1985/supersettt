// maped the color with matics values
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
      mapLabels.push([...label, key].join(';')); // Create Labels for map

      // console.log('data values 3333', mapLabels);
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
