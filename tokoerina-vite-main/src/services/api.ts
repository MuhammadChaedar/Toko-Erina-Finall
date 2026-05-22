import axios, { AxiosError, AxiosInstance } from 'axios'

const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/admin/login'
    }

    return Promise.reject(error)
  }
)

const submitWithMethodOverride = (url: string, method: string, data: any = {}) => {
  const formData = new URLSearchParams()

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })
  formData.append('_method', method)

  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

// ============ AUTHENTICATION ============
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
}

// ============ PRODUCTS ============
export const productsAPI = {
  // Public endpoints
  getPublicProducts: (params?: any) =>
    apiClient.get('/public/products', { params }),
  getPublicProductById: (id: string) => apiClient.get(`/public/products/${id}`),

  // Admin endpoints
  getProducts: (params?: any) => apiClient.get('/products', { params }),
  getProductById: (id: string) => apiClient.get(`/products/${id}`),
  createProduct: (data: any) => {
    // Use FormData if a File object is present for proper multipart upload
    if (data.image && data.image instanceof File) {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any)
        }
      })
      return apiClient.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return apiClient.post('/products', data)
  },
  updateProduct: (id: string, data: any) => {
    // Use FormData if a File object is present for proper multipart upload
    if (data.image && data.image instanceof File) {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any)
        }
      })
      formData.append('_method', 'PUT')
      return apiClient.post(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return submitWithMethodOverride(`/products/${id}`, 'PUT', data)
  },
  deleteProduct: (id: string) =>
    submitWithMethodOverride(`/products/${id}`, 'DELETE'),
  toggleFeatured: (id: string) =>
    submitWithMethodOverride(`/products/${id}/toggle-featured`, 'PATCH'),
  updateStockStatus: (id: string, status: string) =>
    submitWithMethodOverride(`/products/${id}/stock-status`, 'PATCH', {
      stock_status: status,
    }),
}

// ============ GALLERY ============
export const galleryAPI = {
  getPublicGallery: () => apiClient.get('/public/gallery'),
  getGallery: () => apiClient.get('/gallery'),
  getGalleryById: (id: string) => apiClient.get(`/gallery/${id}`),
  createGalleryImage: (data: any) => apiClient.post('/gallery', data),
  updateGalleryImage: (id: string, data: any) =>
    apiClient.put(`/gallery/${id}`, data),
  deleteGalleryImage: (id: string) => apiClient.delete(`/gallery/${id}`),
  reorderGallery: (data: any) => apiClient.patch('/gallery/reorder', data),
}

// ============ STORE LOCATIONS ============
export const storeLocationsAPI = {
  getPublicStoreLocations: () => apiClient.get('/public/store-locations'),
  getStoreLocations: () => apiClient.get('/store-locations'),
  getStoreLocationById: (id: string) => apiClient.get(`/store-locations/${id}`),
  createStoreLocation: (data: any) => apiClient.post('/store-locations', data),
  updateStoreLocation: (id: string, data: any) =>
    apiClient.put(`/store-locations/${id}`, data),
  deleteStoreLocation: (id: string) =>
    submitWithMethodOverride(`/store-locations/${id}`, 'DELETE'),
}

// ============ CONTACT MESSAGES ============
export const contactMessagesAPI = {
  submitContactForm: (data: any) => apiClient.post('/public/contact', data),
  getContactMessages: (params?: any) =>
    apiClient.get('/contact-messages', { params }),
  getContactMessageById: (id: string) =>
    apiClient.get(`/contact-messages/${id}`),
  replyToContactMessage: (id: string, data: any) =>
    apiClient.post(`/contact-messages/${id}/reply`, data),
  markAsRead: (id: string) => apiClient.patch(`/contact-messages/${id}/read`),
  deleteContactMessage: async (id: string) => {
    try {
      return await apiClient.delete(`/contact-messages/${id}`)
    } catch (error: any) {
      if (error.response?.status === 405) {
        return submitWithMethodOverride(`/contact-messages/${id}`, 'DELETE')
      }

      throw error
    }
  },
}

// ============ ABOUT INFO ============
export const aboutAPI = {
  getPublicAbout: () => apiClient.get('/public/about'),
  updateAbout: (data: any) =>
    submitWithMethodOverride('/about', 'PUT', data),
}

// ============ DASHBOARD & ANALYTICS ============
export const dashboardAPI = {
  getDashboard: () => apiClient.get('/dashboard'),
  getAnalytics: (page: number = 1) =>
    apiClient.get('/analytics', { params: { page } }),
}

// ============ ORDERS & SALES REPORTS ============
export const ordersAPI = {
  createOrder: (data: any) => apiClient.post('/orders', data),
  getOrders: (params?: any) => apiClient.get('/admin/orders', { params }),
  updateOrderStatus: (id: string, status: string) =>
    submitWithMethodOverride(`/admin/orders/${id}/status`, 'PATCH', { status }),
}

export const salesReportAPI = {
  getSalesReport: (month: string) =>
    apiClient.get('/admin/sales-report', { params: { month } }),
  exportSalesReport: (month: string) =>
    apiClient.get('/admin/sales-report/export', {
      params: { month },
      responseType: 'blob',
    }),
}

// ============ PUBLIC ANALYTICS TRACKING ============
export const analyticsTrackingAPI = {
  trackVisitor: (data: {
    visitor_city: string
    visitor_province: string
    visitor_country: string
  }) => apiClient.post('/public/analytics/track', data),
}

export default apiClient
