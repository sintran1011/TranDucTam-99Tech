import React, { lazy, Suspense } from "react";
export const renderTokenSvg = (
  currency: string,
  props?: Record<string, unknown>
) => {
  const SvgIcon = lazy(() => import(`@/assets/tokens/${currency}.svg`));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SvgIcon {...props} />
    </Suspense>
  );
};
