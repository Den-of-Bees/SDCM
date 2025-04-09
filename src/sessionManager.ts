import { app } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import os from 'os';
import { SessionData } from './components/system/StateEngine';


export class SessionManager {
    private sessionPath: string;
    private sessionFile: string;
    private platform: string;

    constructor() {
        this.platform = os.platform();
        const appDataPath = app.getPath('appData');
        this.sessionPath = path.join(appDataPath, 'sdcm');
        this.sessionFile = path.join(this.sessionPath, 'session.json');
        
        console.log('Session file location:', this.sessionFile);

        if (!existsSync(this.sessionPath)) {
            mkdirSync(this.sessionPath, { recursive: true });
        }
    }

    async saveSession(data: Partial<SessionData>): Promise<void> {
        try {
            const sessionData: SessionData = {
                ...await this.loadSession(),
                ...data,
                platform: this.platform,
                timestamp: Date.now()
            };
            await fs.writeFile(this.sessionFile, JSON.stringify(sessionData, null, 2));
        } catch (error) {
            console.error('Failed to save session:', error);
        }
    }

    private getDefaultSession(): SessionData {
        return {
            timestamp: Date.now(),
            platform: this.platform
        };
    }
    
    async loadSession(): Promise<SessionData> {
        try {
            if (!existsSync(this.sessionFile)) {
                const defaultSession = this.getDefaultSession();
                await fs.writeFile(this.sessionFile, JSON.stringify(defaultSession, null, 2));
                return defaultSession;
            }
    
            const data = await fs.readFile(this.sessionFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load session:', error);
            return this.getDefaultSession();
        }
    }
}