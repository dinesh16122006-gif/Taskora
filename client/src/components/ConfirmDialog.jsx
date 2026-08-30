import React from 'react'
import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false, danger = true }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Are you sure?'}
      size="sm"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className={danger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-red-100' : 'bg-primary-100'}`}>
          <AlertTriangle className={`h-5 w-5 ${danger ? 'text-red-600' : 'text-primary-600'}`} />
        </div>
        <div>
          <p className="text-sm text-slate-600">{message || 'This action cannot be undone. Please confirm.'}</p>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
