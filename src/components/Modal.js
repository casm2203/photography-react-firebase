import React from 'react'
import '../App.css';

const Modal = ({closeModal}) => {
    return (
        <div class="modal dpf " tabindex="-1">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header modal-h-cs">
                        <h5 class="modal-title">Notificacion</h5>
                        <button type="button" class="btn-close" onClick={closeModal()} data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body modal-b-cs" >
                        <p>Se ha registrado la fotografia.</p>
                    </div>
                    <div class="modal-footer modal-f-cs">
                        <button type="button" class="btn btn-success" onClick={closeModal()} data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal