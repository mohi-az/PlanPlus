export const Dialog = ({ description, changeVisibility, confirmAction,Visibility }: 
    { description?: string, confirmAction: () => void,Visibility:boolean,changeVisibility:()=>void}) => {

    return (

        <dialog id="my_modal_1" className="modal" open={Visibility}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Confirmation</h3>
                <p className="py-4">{description ? description : 'Are you sure want you delete the task?'}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-accent" onClick={confirmAction}>Delete</button>
                        <button className="btn" onClick={changeVisibility}>cancel</button>
                    </form>
                </div>
            </div>
        </dialog>

    )
}