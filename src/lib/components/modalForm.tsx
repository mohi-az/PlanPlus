import React from 'react'

export default function ModalForm({ children,title,isVisible }: { children: React.ReactNode ,title:string,isVisible:boolean}) {
  return (
    <div className='w-full'>
    
      <dialog id="tasksModal" className="modal" open={isVisible}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="divider divider-accent"></div>

          <div className="modal-action ">
            
              {children}
            
          </div>
        </div>
      </dialog></div>
  )
}
