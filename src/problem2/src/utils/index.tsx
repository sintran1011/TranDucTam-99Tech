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
