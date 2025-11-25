export const TILE_STATES = {
  CORRECT: 'correct',
  MISPLACED: 'misplaced',
  WRONG: 'wrong',
};

export const GAME_STATUS = {
  WAITING: 'waiting',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished',
};

export const EVENTS = {
  // Client -> Server
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  MAKE_GUESS: 'make_guess',
  LEAVE_ROOM: 'leave_room',
  
  // Server -> Client
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  GAME_STARTED: 'game_started',
  PLAYER_JOINED: 'player_joined',
  TURN_CHANGED: 'turn_changed',
  GUESS_RESULT: 'guess_result',
  ROUND_ENDED: 'round_ended',
  GAME_ENDED: 'game_ended',
  ERROR: 'error',
  ROOM_STATE: 'room_state',
};