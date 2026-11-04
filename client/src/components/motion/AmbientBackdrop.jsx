import React from 'react';

/**
 * Fixed background stack shared by every route: slow warm light fields plus a
 * fine film grain. Both are painted by CSS (see `.ambient-light` and
 * `.grain-layer`) so this component stays a static, render-free layer.
 */
export const AmbientBackdrop = () => (
  <>
    <div className="ambient-light" aria-hidden="true" />
    <div className="grain-layer" aria-hidden="true" />
  </>
);

export default AmbientBackdrop;
