import { useEffect } from 'react'

type useOutsideClose = {
    ref: React.RefObject<HTMLElement | HTMLDivElement | null>,
    setState: React.Dispatch<React.SetStateAction<any>>,
    containerId?: string
}
const useOutsideClose = ({ ref, setState, containerId }: useOutsideClose) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setState(false);
            }
        };
        let fileContainer: HTMLElement | null;
        if (containerId) {
            fileContainer = document.getElementById(containerId);
        }
        else {
            fileContainer = document.body;
        }
        fileContainer?.addEventListener("mousedown", handleClickOutside);
        return () =>
            fileContainer?.removeEventListener("mousedown", handleClickOutside);
    }, [ref, setState, containerId]);
}

export default useOutsideClose