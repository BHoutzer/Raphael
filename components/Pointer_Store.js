import { writable } from "svelte/store";

export const list_of_x = writable([]);
export const list_of_y = writable([]);
export const list_of_timestamps = writable([]);
export const list_of_angles = writable([]);
export const list_of_distances = writable([]);
export const list_of_speeds = writable([]);
export const list_of_forms = writable({});
export const list_of_meshes = writable([]);
export const window_size = writable({ width: 0, height: 0 });
