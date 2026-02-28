export default function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = '确认' }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <p className="text-xl font-semibold text-gray-800 text-center mb-8">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 text-lg font-semibold active:bg-gray-200"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-lg font-semibold active:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
