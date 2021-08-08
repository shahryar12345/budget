import React, { useEffect, useState } from "react";
import { Modal } from "carbon-components-react";

const FullScreenModal = (props) => {

    const [scrollYValue, setscrollYValue] = useState(0);
    useEffect(() => {
        if (props.open) {
            const scrollY = window.scrollY;
            const body = document.body;
            body.style.overflowY = 'hidden';
            body.style.position = 'fixed';
            body.style.width = '100%';
            body.style.top = `-${scrollY}px`;
            document.getElementsByClassName('bx--modal is-visible')[0].style.top = `${scrollY}px`;
            setscrollYValue(scrollY);
        }
        else if(props.open === false) {
            const body = document.body;
            body.style.position = '';
            body.style.top = '';
            body.style.overflowY = 'unset';
            window.scrollTo(0, scrollYValue);
            setscrollYValue(0);
        }
    }, [props.open]);
    return <Modal {...props}> {props.children}</Modal>
}

export default FullScreenModal;