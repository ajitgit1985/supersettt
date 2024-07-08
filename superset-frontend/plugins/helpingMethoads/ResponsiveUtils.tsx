// ResponsiveUtils.js

export const FontSize = (containerSize: any) => {
  const xsmall: any = `${
    Math.min(containerSize.width, containerSize.height) * 0.03
  }px`;
  const small: any = `${
    Math.min(containerSize.width, containerSize.height) * 0.04
  }px`;
  const meadium: any = `${
    Math.min(containerSize.width, containerSize.height) * 0.05
  }px`;
  const large: any = `${
    Math.min(containerSize.width, containerSize.height) * 0.06
  }px`;
  return { xsmall, small, meadium, large };
};

export const Size = (containerSize: any) => {
  const xsmall: any =
    Math.min(containerSize.width, containerSize.height) * 0.03;
  const small: any = Math.min(containerSize.width, containerSize.height) * 0.04;
  const meadium: any =
    Math.min(containerSize.width, containerSize.height) * 0.05;

  const large: any = Math.min(containerSize.width, containerSize.height) * 0.06;
  const xLarge: any =
    Math.min(containerSize.width, containerSize.height) * 0.12;

  return { xsmall, small, meadium, large, xLarge };
};
