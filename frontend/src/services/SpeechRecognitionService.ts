window.SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
const getLocale = () =>
    navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

const state = { running: false, locale: getLocale(), start: () => {} };

const startFocusListener = () => {
    state.start();
    window.addEventListener('focus', state.start);
};

const removeFocusListener = () => {
    window.removeEventListener('focus', state.start);
};

const init = (): SpeechRecognition => {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = state.locale;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    state.start = () => {
        if (!state.running) {
            recognition.start();
            state.running = true;
        }
    };

    recognition.onend = () => {
        state.running = false;
    };
    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onerror = (event) => {
        window.console.error('Error occurred in recognition: ' + event.error);
    };

    return recognition;
};

const recognition = init();

const onResult = (cb: (v: string) => void): void => {
    recognition.onresult = (event) => {
        cb(event.results[0][0].transcript);
    };
};

export const SpeechRecognitionService = { onResult, locale: state.locale, startFocusListener, removeFocusListener };
