import { format as d3Format } from 'd3-format';
import NumberFormatter from '../NumberFormatter';
import NumberFormats from '../NumberFormats';

const siFormatter = d3Format(`.3~s`);
const float2PointFormatter = d3Format(`.2~f`);
const float4PointFormatter = d3Format(`.4~f`);

function formatValue(value: number) {
  if (value === 0) {
    return '0';
  }
  const absoluteValue = Math.abs(value);
  if (absoluteValue >= 10000000) {
    // Convert to crores (Cr)
    return `${float2PointFormatter(value / 10000000)} %`;
  }
  if (absoluteValue >= 100000) {
    // Convert to lakhs (L)
    return `${float2PointFormatter(value / 100000)} %`;
  }
  if (absoluteValue >= 1000) {
    // Convert to thousands (k)
    return `${float2PointFormatter(value / 1000)} %`;
  }
  if (absoluteValue >= 0.001) {
    return float4PointFormatter(value);
  }
  if (absoluteValue > 0.000001) {
    return `${float2PointFormatter(value * 1000000)} µ`;
  }
  return float2PointFormatter(value);
}

export default function percentageNoFormatter(
  config: {
    description?: string;
    signed?: boolean;
    id?: string;
    label?: string;
  } = {},
) {
  const { description, signed = false, id, label } = config;
  const getSign = signed ? (value: number) => (value > 0 ? '+' : '') : () => '';

  return new NumberFormatter({
    description,
    formatFunc: value => `${getSign(value)}${formatValue(value)}`,
    id:
      id || signed
        ? NumberFormats.SMART_NUMBER_SIGNED
        : NumberFormats.percentageNo,
    label: label ?? 'Percentage',
  });
}