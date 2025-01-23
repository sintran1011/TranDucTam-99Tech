import React from "react";

const tokenIcons = import.meta.glob("../assets/tokens/*.svg", { eager: true });

type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>;

export const renderTokenSvg = (
  tokenCode: string,
  props?: React.SVGProps<SVGSVGElement>
) => {
  const iconPath = `../assets/tokens/${tokenCode}.svg`;
  const SvgIcon = tokenIcons[iconPath] as { default: SvgComponent } | undefined;

  if (!SvgIcon) {
    return <div className="rounded-full size-4 bg-slate-400" />;
  }

  // Render the SVG component
  return <SvgIcon.default {...props} />;
};

export const formatNumber = (num: number) => {
  return Math.round(num * 1000000) / 1000000;
};

export const transformFromTo = ({
  fromAmount,
  toPrice,
  fromPrice,
}: {
  fromAmount: number;
  toPrice: number;
  fromPrice: number;
}) => {
  const toAmount = (fromPrice * fromAmount) / toPrice;
  return formatNumber(toAmount);
};

export const transformToForm = ({
  toAmount,
  toPrice,
  fromPrice,
}: {
  toAmount: number;
  toPrice: number;
  fromPrice: number;
}) => {
  const fromAmount = (toPrice * toAmount) / fromPrice;
  return formatNumber(fromAmount);
};
