import { APITodo, APITrack, Todo, Track } from './Types';

const uuid = (a?: any) =>
    a
        ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
        : (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);

const convertAPITracks = (t: APITrack[]): Track[] => t.map((track) => ({ ...track, time: new Date(track.time) }));
const convertTrack = (t: Track): APITrack => ({ ...t, time: t.time.toISOString() });
const convertTracks = (t: Track[]): APITrack[] => t.map(convertTrack);

const convertAPITodo = (t: APITodo): Todo => ({
    ...t,
    createdAt: new Date(t.createdAt),
    resolvedAt: t.resolvedAt ? new Date(t.resolvedAt) : undefined,
});
const convertTodo = (t: Todo): APITodo => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    resolvedAt: t.resolvedAt?.toISOString(),
});

const _withLeadingZero = (num: number) => ('0' + num).slice(-2);
const toApiString = (date: Date) =>
    `${date.getFullYear()}-${_withLeadingZero(date.getMonth() + 1)}-${_withLeadingZero(date.getDate())}`;

const getKeyForDate = (date: Date = new Date()) => 'trackuler-' + Utils.toApiString(date);

const classNamesFilter = (arg: any) => !!arg && typeof arg === 'string';
const classNames = (...classes: any[]): string | undefined => classes.filter(classNamesFilter).join(' ') || undefined;

export const Utils = {
    uuid,
    convertAPITracks,
    convertTracks,
    toApiString,
    convertTrack,
    getKeyForDate,
    classNames,
    convertTodo,
    convertAPITodo,
};
