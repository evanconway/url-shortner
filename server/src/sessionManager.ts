import { v4 as uuidv4, validate } from 'uuid';

interface Session {
    userId: string,
    invalidTime: number,
}

class SessionManager {
    sessions: Map<string, Session>; // session id and invalidate time

    constructor() {
        this.sessions = new Map<string, Session>();
    }

    getUserIdBySessionId(sessionId: string) {
        return this.sessions.get(sessionId)?.userId;
    }

    startSession(userId: string) {
        const invalidTime = Date.now() + 60 * 1000;
        const sessionId = uuidv4();
        this.sessions.set(sessionId, { userId, invalidTime });
        return sessionId;
    }

    endSession(sessionId: string) {
        this.sessions.delete(sessionId);
    }
}

const sessionManager = new SessionManager;

export default sessionManager;
