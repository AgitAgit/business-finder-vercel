import React from 'react'

function MyModal({ onClose, children}) {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center" 
      onClick={onClose} 
    > 
        <div className='bg-white' onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    </div>
  )
}

export default MyModal