/**
 * Convert File to Base64 string
 * @param file - File object from input
 * @returns Promise with base64 string (data:image/..;base64,..)
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Validate image file
 * @param file - File object to validate
 * @param maxSizeMB - Max file size in MB (default: 5)
 * @returns Object with isValid and error message
 */
export const validateImageFile = (
  file: File,
  maxSizeMB: number = 5,
): { isValid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format gambar tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF',
    }
  }

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Ukuran gambar tidak boleh lebih dari ${maxSizeMB}MB`,
    }
  }

  return { isValid: true }
}

/**
 * Handle image file input and convert to base64
 * @param file - File object from input
 * @param maxSizeMB - Max file size in MB
 * @returns Promise with base64 string or error
 */
export const handleImageUpload = async (
  file: File,
  maxSizeMB?: number,
): Promise<{ success: boolean; data?: string; error?: string }> => {
  const validation = validateImageFile(file, maxSizeMB)

  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error,
    }
  }

  try {
    const base64 = await fileToBase64(file)
    return {
      success: true,
      data: base64,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Gagal mengupload gambar',
    }
  }
}

/**
 * Get file name from base64 (for display purposes)
 */
export const getImagePreviewUrl = (base64: string): string => {
  return base64 // base64 string dengan data: prefix dapat langsung digunakan untuk img src
}
