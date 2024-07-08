import { ChartProps, TimeseriesDataRecord } from '@superset-ui/core';

export default function transformProps(chartProps: ChartProps) {
  const { width, height, formData, queriesData } = chartProps;
  const { boldText, headerFontSize, headerText } = formData;
  const data = queriesData[0].data as TimeseriesDataRecord[];

  console.log('formData via TransformProps.ts', formData);

  return {
    width,
    height,
    data,
    boldText,
    headerFontSize,
    headerText,
    columns: formData?.cols,
    metrics: formData?.metrics,
  };
}
