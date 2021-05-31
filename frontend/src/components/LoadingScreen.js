import React from 'react'

//Lapas ielādes komponente (animācija)
export default function LoadingScreen() {
    return (
        <div className="loading">
            <i className="fa fa-spinner fa-spin"></i> Notiek ielāde...  
        </div>
    )
}
