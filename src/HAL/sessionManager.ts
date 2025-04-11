import { app } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import os from 'os';
import { SessionData } from '../components/system/StateEngine';


export class SessionManager {
    private sessionPath: string;
    private sessionFile: string;
    private platform: string;

    private constructor(sessionPath: string) {
        this.sessionPath = sessionPath;
        this.sessionFile = path.join(sessionPath, 'session.json');
        this.platform = os.platform() === 'win32' ? 'windows' : os.platform() === 'darwin' ? 'mac' : 'linux';
    }

    static async init(): Promise<SessionManager> {
        const sessionPath = path.join(app.getPath('appData'), 'sdcm');

        try {
            await fs.access(sessionPath);
        } catch {
            await fs.mkdir(sessionPath, { recursive: true });
        }

        return new SessionManager(sessionPath);
    }

    async saveSession(data: Partial<SessionData>): Promise<void> {
        try {
            const sessionData: SessionData = {
                ...await this.loadSession(),
                ...data,
                platform: this.platform,
                timestamp: Date.now()
            };
            await fs.writeFile(this.sessionPath, JSON.stringify(sessionData, null, 2));
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
    
    async loadSession(newDirectory?: string): Promise<SessionData> {
        try {
            try {
                await fs.access(this.sessionFile);
            }
            catch {
                await fs.writeFile(this.sessionFile, JSON.stringify(this.getDefaultSession(), null, 2));
            }
    
            const data = await fs.readFile(this.sessionFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load session:', error);
            return this.getDefaultSession();
        }
    }
}