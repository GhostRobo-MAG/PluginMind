class SecureAPIClient {
  private useProxy: boolean = process.env.NEXT_PUBLIC_USE_API_PROXY === 'true'
  private useSecureTokens: boolean = process.env.NEXT_PUBLIC_SECURE_TOKENS === 'true'
  
  async request(
    path: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    console.log(`🔄 API Request: ${options.method || 'GET'} ${path}`)
    console.log(`🔧 Secure mode: ${this.useSecureTokens}`)
    
    // In secure mode, all requests must go through proxy
    if (!this.useProxy) {
      throw new Error('Secure token mode requires proxy to be enabled')
    }
    
    console.log(`🔗 Making secure proxy request...`)
    const response = await this.requestViaProxy(path, options)
    
    if (response.ok) {
      console.log(`✅ Proxy request succeeded: ${response.status}`)
    } else {
      console.log(`⚠️ Proxy request failed: ${response.status}`)
    }
    
    return response
  }
  
  private async requestViaProxy(
    path: string,
    options: RequestInit
  ): Promise<Response> {
    const url = `/api/proxy/${path}`
    return fetch(url, {
      ...options,
      credentials: 'include', // Include cookies for session
    })
  }
  
  
  // Convenience methods
  async get(path: string): Promise<any> {
    const response = await this.request(path, { method: 'GET' })
    return response.json()
  }
  
  async post(path: string, body: any): Promise<any> {
    const response = await this.request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return response.json()
  }

  async put(path: string, body: any): Promise<any> {
    const response = await this.request(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return response.json()
  }

  async delete(path: string): Promise<any> {
    const response = await this.request(path, { method: 'DELETE' })
    return response.json()
  }
}

export const apiClient = new SecureAPIClient()