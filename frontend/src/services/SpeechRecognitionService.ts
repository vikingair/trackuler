import { Store } from '../store';

type SpeechRecognition = any;

(window as any).SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const state = { running: false, start: (): void => undefined, stop: (): void => undefined };

const startFocusListener = (): void => {
    state.start();
    window.addEventListener('focus', state.start);
};

const removeFocusListener = (): void => {
    state.stop();
    window.removeEventListener('focus', state.start);
};

const init = (): SpeechRecognition => {
    const recognition = new (window as any).SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = Store.get().language;
    Store.listen(
        ({ language }) => language,
        (lang) => {
            recognition.lang = lang;
        }
    );

    state.start = () => {
        if (!state.running) {
            recognition.start();
            state.running = true;
        }
    };

    state.stop = () => {
        if (state.running) {
            recognition.stop();
        }
    };

    recognition.onend = () => {
        state.running = false;
    };
    recognition.onspeechend = () => {
        state.stop();
    };

    recognition.onerror = (event: { error: string }) => {
        window.console.error('Error occurred in recognition: ' + event.error);
    };

    return recognition;
};

const recognition = init();

const onResult = (cb: (v: string) => void): void => {
    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
        cb(event.results[0][0].transcript);
    };
};

const setLanguage = (language: string): void => {
    recognition.lang = language;
};

export const SpeechRecognitionService = {
    onResult,
    startFocusListener,
    removeFocusListener,
    setLanguage,
};
