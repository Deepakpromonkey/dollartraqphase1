
import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import SignatureCanvas from "react-signature-canvas";

import Gesture from '@mui/icons-material/Gesture'
import Replay from '@mui/icons-material/Replay'

import Btn from 'components/Btn'

export default function ESign(){
    
    const sigCanvas = useRef();
    const containerRef = useRef();
    
    const [width, setWidth] = useState(600);
    const [isSigned, setIsSigned] = useState(false);

    const clearSignature = () => {
        sigCanvas.current.clear();
        setIsSigned(false);
    };

    useEffect(() => {

        const updateWidth = () => {
            
            if(containerRef.current){
                setWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();

        window.addEventListener("resize", updateWidth);

        return () => {
            window.removeEventListener("resize", updateWidth);
        };
    }, []);

    const saveSignature = async () => {

        if (sigCanvas.current.isEmpty()) {
            alert("Please provide a signature");
            return;
        }

        const dataUrl = sigCanvas.current
            .getTrimmedCanvas()
            .toDataURL("image/png");

        const response = await fetch(dataUrl);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("signature", blob, "signature.png");

        // await fetch(
        //     "http://127.0.0.1:8000/api/signature/upload",
        //     {
        //         method: "POST",
        //         body: formData,
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //         },
        //     }
        // );

        alert("Signature saved");
    };

    return (
        <div ref={containerRef} className="w-full relative">

            {isSigned &&
            
                <div className="absolute right-[10px] top-[10px]" style={{zIndex:2}}>
                    <Btn icon={true} size="small" onClick={clearSignature}>
                        <Replay style={{fontSize: 18}} />
                    </Btn>
                </div>
            }

            {!isSigned && (

                <div className="absolute left-[50%] top-[40%] w-full"
                    style={{
                        transform: "translate(-50%, -40%)",
                        pointerEvents: "none",
                        textAlign: "center",
                        color: "text.secondary",
                        zIndex: 1,
                    }}
                >
                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-50 w-[60px] h-[60px] rounded-full flex items-center justify-center">
                            <Gesture sx={{ fontSize: 30 }} className="text-gray-300" />
                        </div>
                        <span className="text-xs text-[#94A3B8]">Sign using mouse, trackpad, or finger</span>
                    </div>
                </div>
            )}

            <div style={{width: width, height: 250}} className="border-2 border-dashed border-gray-200 rounded-lg">
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    onBegin={() => setIsSigned(true)}
                    canvasProps={{
                        width,
                        height: 250,
                        className: "rounded w-full"
                    }}
                />
            </div>
        </div>
    );
}