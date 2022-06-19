import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

export const useSafeState = <S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] => {
    const [s, set] = useState(initialState);
    const mounted = useRef(true);

    useEffect(() => {
        // required for dev mode
        if (process.env.NODE_ENV === 'development') {
            mounted.current = true;
        }
        return () => {
            mounted.current = false;
        };
    }, []);

    const safeSet = useCallback<typeof set>((arg) => {
        if (mounted.current) set(arg);
    }, []);

    return [s, safeSet];
};
