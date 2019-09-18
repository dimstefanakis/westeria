import React from 'react'
import {AreYouSureModal, ToggleContent} from "./Temporary"


export function AreYouSure({handleYes,handleNo,message,children}){

    // these two trough e,show,hide not defined errors
    // try catch needed
    function handleShow(e,show){
        try{
            e.stopPropagation();
            show();
        }catch(e){

        }
    }

    function handleHide(e,hide){
        try{
            e.stopPropagation();
            hide();
        }catch(e){

        }   
    }

    return (
        <ToggleContent 
            toggle={show=>{
            return <>
                    {React.cloneElement(children,{ onClick: e=>handleShow(e,show) })}
                </>
            }}
            content={hide => (
            <AreYouSureModal onClick={()=>handleHide(hide)}>
                <div className="modal-confirmation-box">
                    <span style={{fontSize:'1.4rem',fontWeight:500}}>{message}</span>
                    <div className="flex-fill" style={{marginTop:10}}>
                        <button onClick={handleYes} className="accept-btn">Yes, I am sure</button>
                        <button onClick={handleNo} className="decline-btn">No, cancel</button>
                    </div>
                </div>
            </AreYouSureModal>    
        )}/>
    )
}