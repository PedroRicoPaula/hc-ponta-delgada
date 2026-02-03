import { LucideIcon } from 'lucide-react';

export type Category = 'sub11' | 'sub13' | 'sub15' | 'sub17' | 'seniores';

export interface Training {
    id: string;
    date: string;
    content: string;
}

export interface AttendanceSession {
    id: string;
    date: string;
    presentPlayers: string[];
}

export interface TrainingData {
    [key: string]: Training[];
}

export interface AttendanceData {
    sessions: AttendanceSession[];
    valuePerSession: number;
}

export interface CategoryItem {
    id: Category;
    name: string;
    color: string;
    icon?: LucideIcon;
}
