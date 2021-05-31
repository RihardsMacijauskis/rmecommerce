import React from 'react'

//kļūdu ziņojuma izvade iekšlapās
export default function MessageScreen(props) {
    return (
        <div className={`alert alert-${props.variant || 'info'}`}>
             {props.children}
        </div>
    )
}
