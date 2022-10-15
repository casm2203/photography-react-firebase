import React from 'react'
import '../App.css';

const Modal = ({closeModal}) => {
    return (
        <div className="modal dpf " tabindex="-1">
            <div className="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header modal-h-cs">
                        <h5 className="modal-title">Notificacion</h5>
                        <button type="button" className="btn-close" onClick={closeModal()} data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body modal-b-cs" >
                        <p>Se ha registrado la fotografia.</p>
                    </div>
                    <div className="modal-footer modal-f-cs">
                        <button type="button" className="btn btn-success" onClick={closeModal()} data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal