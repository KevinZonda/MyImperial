import { useEffect, useState } from "react";
import { getWindowDimensions } from "./screen";

export function useScreenSize() {
    const [wDim, setWDim] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWDim(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
    }, []);
    return wDim;
}