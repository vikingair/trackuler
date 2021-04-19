import React, { useCallback, useMemo, useState } from 'react';
import { IconSettings } from '../icons/icon';
import { Main } from './Main';
import { Settings } from './Settings';
import { Aside } from './Aside';

export const App: React.VFC = () => {
    const [open, setOpen] = useState(false);
    const onOpen = useCallback(() => setOpen(true), []);
    const onClose = useCallback(() => setOpen(false), []);
    const now = useMemo(() => new Date().toLocaleDateString(), []);

    return (
        <div className="App">
            <header>
                <h1>{now}</h1>
                <button className={'icon-button'} onClick={onOpen} title={'settings'}>
                    <IconSettings />
                </button>
            </header>
            <Settings open={open} onClose={onClose} />
            <div className="content">
                <Main />
                <Aside />
            </div>
        </div>
    );
};
