import React, { useEffect, useState } from 'react';
import { removeParenthesesFromString } from './methods';

const metricsDropdown = ({
  echartOptions,
  formData,
  showChartFilter,
  onDataChange,
  getSelectedMatricValue,
  selectedMetricValue,
}: any) => {
  let firstValue = '';
  if (formData?.metrics[0].label !== undefined) {
    firstValue = formData?.metrics[0].label;
  } else {
    firstValue = formData?.metrics[0];
  }
  console.log('firstValue:', firstValue);

  const defaultValue = 'All Indicators';
  const [data, setData] = useState(echartOptions);
  const [selectedMatric, setSelectedMatric] = useState(
    selectedMetricValue || firstValue,
  );

  function filterMetrics(data: any, metric: any) {
    return data.map((item: any) => {
      let newItem = {};
      formData?.cols.forEach((col: any) => {
        newItem[col] = item[col];
      });
      newItem[metric] = item[metric];
      return newItem;
    });
  }

  useEffect(() => {
    if (echartOptions?.series !== undefined) {
      const filteredData = echartOptions?.series?.filter((item: any) => {
        const a = removeParenthesesFromString(item.id);
        const b = removeParenthesesFromString(selectedMatric);

        return b.toLowerCase() === a.toLowerCase();
      });

      if (selectedMatric !== defaultValue || showChartFilter) {
        setData((prevData: any) => ({
          ...prevData,
          series: filteredData,
        }));
      }
    } else {
      const a = removeParenthesesFromString(selectedMatric);
      let filteredData = filterMetrics(echartOptions, a);
      setData(filteredData);
    }
    if (selectedMatric === defaultValue || !showChartFilter) {
      setData(echartOptions);
      setSelectedMatric(defaultValue);
    }
  }, [selectedMatric, showChartFilter]);

  const handleSelectedValue = (e: any) => {
    const value = e.target.value;
    setSelectedMatric(value);
  };

  useEffect(() => {
    onDataChange(data); // parent function
    getSelectedMatricValue(selectedMatric);
  }, [data]);

  return (
    <div>
      {showChartFilter !== undefined && showChartFilter ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            // flexDirection: 'column',
            position: 'absolute',
            top: '20px',
            marginLeft: '6px',
            maxWidth: '45%',
          }}
        >
          {/* <text style={{ fontSize: 12, fontWeight: 'bold' }}>Indicators</text> */}
          <select
            className="form-select"
            onChange={e => handleSelectedValue(e)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              marginLeft: '10px',
              outline: 'none',
              border: 'none',
              width: '90%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            value={selectedMatric}
          >
            {formData?.metrics?.map((item: any, i: any) => {
              if (item.label !== undefined) {
                return (
                  <option
                    key={i}
                    value={item.label}
                    style={{
                      whiteSpace: 'nowrap',
                      width: '100% border-bottom: 1px #ccc solid',
                    }}
                  >
                    {item.label}
                  </option>
                );
              } else {
                return (
                  <option
                    key={i}
                    value={`${item}` + '(*)'}
                    style={{
                      whiteSpace: 'nowrap',
                      width: '100% border-bottom: 1px #ccc solid',
                    }}
                  >
                    {`${item}` + '(*)'}
                  </option>
                );
              }
            })}
            <option
              style={{
                whiteSpace: 'nowrap',
                width: '100% border-bottom: 1px #ccc solid',
              }}
            >
              {defaultValue}
            </option>
          </select>
        </div>
      ) : null}
    </div>
  );
};

export default metricsDropdown;
