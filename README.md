# Trackuler <img src="https://github.com/fdc-viktor-luft/trackuler/blob/main/frontend/public/favicon.svg" height="25" width="25" />
Track your schedule. See it in action and use yourself [here](https://fdc-viktor-luft.github.io/trackuler/).

**Disclaimer: Only tested in Chrome. TODO: Progressive enhancement.**

Trackuler makes use of the [Speech Recognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).
This seems to be supported only by Chrome atm. For storing the data you can decide to save your data in the browsers
local storage (default) or specify a workdir on your file system. Not every browser atm fully supports the
[File System Access API](https://web.dev/file-system-access/).

## Data Protection
All created data is not submitted to any server and only stored on the client device. All user created data stays on
the user device. I'm not accountable for any custom integrations with Trackuler that don't respect the user privacy.

## Planned
Trackuler is still WIP, and the following things are planned:
- Grouping of tracks (later with optional ML enhancement)
- Configuring special commands like "Pause" and "End"
- Editing and creating of tracks without speech recognition
- Configuration of language instead of picking the browser language
- Configuration of workday amount (default and per day)
- Time summaries per groups
- Timeline visualisations with graphs based on configured groups
