// One source of truth for what the sky is doing, so the camera and the focus panel can't disagree.
// 'focused' covers the approach too: the camera eases toward the star while the panel is already readable.

export type SkyState = { mode: 'overview'; selected: null } | { mode: 'focused'; selected: string };

export type SkyEvent = { type: 'select'; id: string } | { type: 'back' };

export const initialSkyState: SkyState = { mode: 'overview', selected: null };

export function skyReducer(state: SkyState, event: SkyEvent): SkyState {
  switch (event.type) {
    case 'select':
      return state.mode === 'focused' && state.selected === event.id ? state : { mode: 'focused', selected: event.id };
    case 'back':
      return state.mode === 'overview' ? state : initialSkyState;
  }
}
