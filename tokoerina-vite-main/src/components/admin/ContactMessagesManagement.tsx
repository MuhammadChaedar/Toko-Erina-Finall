import { useState, useEffect } from 'react'
import { contactMessagesAPI } from '../../services/api'
import {
  Mail,
  Trash2,
  Eye,
  Reply,
  Loader,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  X,
} from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email?: string
  phone_number?: string
  message: string
  reply_message?: string
  is_read: boolean
  replied_at?: string
  created_at: string
}

type ModalMode = 'view' | 'reply' | null

const normalizeMessages = (data: any): ContactMessage[] => {
  const messages = data?.data || data || []
  if (!Array.isArray(messages)) return []

  return messages.map((message) => ({
    ...message,
    id: String(message.id),
    email: message.email || '',
    phone_number: message.phone_number || message.phone || message.email || '',
    is_read: Boolean(message.is_read),
  }))
}

export default function ContactMessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [filterRead, setFilterRead] = useState<boolean | null>(null)

  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  )
  const [replyMessage, setReplyMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadMessages()
  }, [page, filterRead])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const params: any = { page, limit: 10 }
      if (filterRead !== null) {
        params.is_read = filterRead
      }
      const response = await contactMessagesAPI.getContactMessages(params)
      setMessages(normalizeMessages(response.data))
      setPages(response.data.pages || 1)
    } catch (err: any) {
      console.error('Error loading messages:', err)
      setError(err.response?.data?.message || 'Gagal memuat pesan kontak')
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetail = (message: ContactMessage) => {
    setSelectedMessage(message)
    setModalMode('view')
  }

  const handleReplyClick = (message: ContactMessage) => {
    setSelectedMessage(message)
    setReplyMessage('')
    setModalMode('reply')
  }

  const handleSubmitReply = async () => {
    if (!selectedMessage || !replyMessage.trim()) return

    try {
      setIsSubmitting(true)
      await contactMessagesAPI.replyToContactMessage(selectedMessage.id, {
        reply_message: replyMessage,
      })
      setSuccess(true)
      setModalMode(null)
      loadMessages()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengirim balasan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan ini? Tindakan ini tidak dapat dibatalkan.'))
      return

    try {
      await contactMessagesAPI.deleteContactMessage(id)
      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== id)
      )
      setSuccess(true)
      loadMessages()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus pesan')
    }
  }

  const handleMarkAsRead = async (message: ContactMessage) => {
    if (message.is_read) return
    try {
      await contactMessagesAPI.markAsRead(message.id)
      loadMessages()
    } catch (err: any) {
      console.error('Error marking as read:', err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pesan Kontak</h1>
          <p className="text-gray-600 mt-2">
            Kelola pesan dari pengunjung website
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle
            size={20}
            className="text-green-600 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm text-green-800">Operasi berhasil dilakukan</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle
            size={20}
            className="text-red-600 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => {
            setFilterRead(null)
            setPage(1)
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterRead === null
              ? 'bg-sky-100 text-sky-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => {
            setFilterRead(false)
            setPage(1)
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterRead === false
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Belum Dibaca
        </button>
        <button
          onClick={() => {
            setFilterRead(true)
            setPage(1)
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterRead === true
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sudah Dibaca
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin mr-2 text-sky-600" />
          <span className="text-gray-600">Memuat pesan...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <Mail size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Belum ada pesan kontak</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {message.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {message.phone_number || message.email}
                      </p>
                    </div>
                    {!message.is_read && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-3 line-clamp-2">
                    {message.message}
                  </p>

                  {message.reply_message && (
                    <div className="bg-green-50 rounded-lg p-3 mb-3 border-l-4 border-green-500">
                      <p className="text-sm font-semibold text-green-900 mb-1">
                        Sudah Dibalas
                      </p>
                      <p className="text-sm text-green-800">
                        {message.reply_message}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    {new Date(message.created_at).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      handleViewDetail(message)
                      handleMarkAsRead(message)
                    }}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye size={18} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => {
                      handleReplyClick(message)
                      handleMarkAsRead(message)
                    }}
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                    title="Balas Pesan"
                  >
                    <Reply size={18} className="text-green-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Pesan"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          >
            Sebelumnya
          </button>
          <span className="text-gray-600">
            Halaman {page} dari {pages}
          </span>
          <button
            onClick={() => setPage(Math.min(pages, page + 1))}
            disabled={page === pages}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          >
            Berikutnya
          </button>
        </div>
      )}

      {/* View Detail Modal */}
      {modalMode === 'view' && selectedMessage && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setModalMode(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg z-[90]"
          />

          {/* Modal Content */}
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setModalMode(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-30 hover:bg-opacity-50 text-gray-900 p-2 rounded-full transition-all duration-200 z-10"
              title="Close (ESC)"
            >
              <X size={24} />
            </button>

            {/* Modal Container */}
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <MessageSquare size={24} className="text-sky-600" />
                Detail Pesan
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama
                  </label>
                  <p className="text-gray-900">{selectedMessage.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kontak
                  </label>
                  {selectedMessage.email ? (
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {selectedMessage.email}
                    </a>
                  ) : (
                    <p className="text-gray-900">
                      {selectedMessage.phone_number || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pesan
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {selectedMessage.reply_message && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Balasan
                    </label>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-green-900 whitespace-pre-wrap">
                        {selectedMessage.reply_message}
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        Dibalas pada:{' '}
                        {new Date(
                          selectedMessage.replied_at || '',
                        ).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  Diterima:{' '}
                  {new Date(selectedMessage.created_at).toLocaleString('id-ID')}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleReplyClick(selectedMessage)
                      setModalMode('reply')
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Reply size={18} />
                    Balas
                  </button>
                  <button
                    onClick={() => setModalMode(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reply Modal */}
      {modalMode === 'reply' && selectedMessage && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setModalMode(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg z-[90]"
          />

          {/* Modal Content */}
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setModalMode(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-30 hover:bg-opacity-50 text-gray-900 p-2 rounded-full transition-all duration-200 z-10"
              title="Close (ESC)"
            >
              <X size={24} />
            </button>

            {/* Modal Container */}
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Reply size={24} className="text-green-600" />
                Balas Pesan
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dari
                  </label>
                  <p className="text-gray-900">{selectedMessage.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedMessage.phone_number || selectedMessage.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pesan Asli
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 text-sm">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Balasan Anda
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Tulis balasan Anda di sini..."
                    rows={5}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSubmitReply}
                    disabled={isSubmitting || !replyMessage.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Reply size={18} />
                    )}
                    {isSubmitting ? 'Mengirim...' : 'Kirim Balasan'}
                  </button>
                  <button
                    onClick={() => setModalMode(null)}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}




