"use client"
export const Dialog = ({ description, changeVisibility, confirmAction,Visibility ,ActionTitle}: 
    { description?: string, confirmAction: () => void,Visibility:boolean,changeVisibility:()=>void,ActionTitle:string}) => {

    return (

        <dialog id="my_modal_1" className="modal" open={Visibility}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Confirmation</h3>
                <p className="py-4">{description ? description : 'Are you sure want you delete the task?'}</p>
                <div className="modal-action">
                    <div className="flex flex-row gap-4">
                        <button className="btn btn-sm md:px-8 md:btn-md btn-accent" onClick={confirmAction}>{ActionTitle}</button>
                        <button className="btn btn-sm md:px-8 md:btn-md" onClick={changeVisibility}>Cancel</button>
                    </div>
                </div>
            </div>
        </dialog>

    )
}