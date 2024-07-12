import { t } from '@superset-ui/core';

export const metricsDropdownControlPanelConfig = [
  {
    name: 'showChartFilter',
    config: {
      type: 'CheckboxControl',
      label: t('show metrics dropdown'),
      default: false,
      renderTrigger: true,
      description: t('Show metrics dropdown on chart'),
    },
  },
];
