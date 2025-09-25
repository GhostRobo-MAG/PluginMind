"use client"

import * as React from "react"

import { apiService } from "@/services"

export type ApiClientLike = {
  healthCheck: typeof apiService.healthCheck
  get: typeof apiService.get
  post: typeof apiService.post
  postWithTimeout: typeof apiService.postWithTimeout
  put: typeof apiService.put
  patch: typeof apiService.patch
  delete: typeof apiService.delete
  uploadFile: typeof apiService.uploadFile
  setAuthHeader: typeof apiService.setAuthHeader
  removeAuthHeader: typeof apiService.removeAuthHeader
  getClient: typeof apiService.getClient
}

export interface ApiClientContextValue {
  client: ApiClientLike
}

const ApiClientContext = React.createContext<ApiClientContextValue>({
  client: apiService,
})

export interface ApiClientProviderProps {
  children: React.ReactNode
  client?: ApiClientLike
}

export function ApiClientProvider({
  children,
  client = apiService,
}: ApiClientProviderProps): JSX.Element {
  const value = React.useMemo<ApiClientContextValue>(() => ({ client }), [client])
  return <ApiClientContext.Provider value={value}>{children}</ApiClientContext.Provider>
}

export function useApiClient(): ApiClientLike {
  return React.useContext(ApiClientContext).client
}
