import { ChartProps, getValueFormatter } from '@superset-ui/core';

export default function transformProps(chartProps: ChartProps) {
  const {
    width,
    height,
    formData,
    queriesData,
    datasource: { currencyFormats = {}, columnFormats = {} },
  } = chartProps;
  const {
    boldText,
    headerFontSize,
    headerText,
    colorScheme,
    yAxisFormat,
    currencyFormat,
    metric = 'value',
  } = formData;
  const { data = [] } = queriesData[0];

  const numberFormatter = getValueFormatter(
    metric,
    currencyFormats,
    columnFormats,
    yAxisFormat,
    currencyFormat,
  );

  return {
    width,
    height,
    data,
    boldText,
    headerFontSize,
    headerText,
    colorScheme,
    numberFormatter,
    show_values: formData?.showValues,
    formData,
    colsValues: formData?.cols,
    currentQuarter: formData?.currentQuarter,
    dataLabelsVerticalAlign: formData?.dataLabelsVerticalAlign,
    showChartFilter: formData?.showChartFilter,
    finalYear: formData?.finalYear,
  };
}
