window.SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
const getLocale = () =>
    navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

const state = { running: false, locale: getLocale() };

const init = (): SpeechRecognition => {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = state.locale;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    window.onfocus = () => {
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

export const SpeechRecognitionService = { onResult, locale: state.locale };
