import './ConfirmDialog.css'
import './ConfigComponent.css'

interface ConfirmDialogProps {
    message: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
    return (
        <div className='configOverlay' onClick={onCancel}>
            <div className='configComponent confirmDialog' onClick={(e) => e.stopPropagation()}>
                <p className='confirmDialog-message'>{message}</p>
                <div className='confirmDialog-buttons'>
                    <button className='confirmDialog-cancel' onClick={onCancel}>No</button>
                    <button className='confirmDialog-confirm' onClick={onConfirm}>Yes</button>
                </div>
            </div>
        </div>
    )
}
