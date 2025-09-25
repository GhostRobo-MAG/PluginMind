/**
 * SWR Provider - Global SWR configuration provider
 */

'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';
import { swrConfig } from './swr-config';

interface SWRProviderProps {
  children: ReactNode;
  /**
   * Override default SWR configuration
   */
  config?: Partial<typeof swrConfig>;
}

/**
 * SWR Provider component to wrap the application
 * This should be used at the root level or in layout components
 */
export function SWRProvider({ children, config = {} }: SWRProviderProps) {
  const mergedConfig = {
    ...swrConfig,
    ...config,
  };

  return (
    <SWRConfig value={mergedConfig}>
      {children}
    </SWRConfig>
  );
}

export default SWRProvider;