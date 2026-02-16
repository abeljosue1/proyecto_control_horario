export type WorkSessionStatus = 'working' | 'paused' | 'finished';

export interface WorkSession {
    id: string;
    user_id: string;
    start_time: string;
    pause_time: string | null;
    end_time: string | null;
    status: WorkSessionStatus;
    created_at: string;
}
