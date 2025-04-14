import { readdir } from 'fs/promises';
import { join } from 'path';
import { FileNode } from '../components/system/StateEngine';

export async function buildFileTree(dirPath: string): Promise<FileNode[]> {
    const entries = await readdir(dirPath, { withFileTypes: true });
  
    const tree = await Promise.all(entries.map(async entry => {
      const fullPath = join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return {
          name: entry.name,
          isFolder: true,
          isOpen: false,
          path: fullPath,
          children: await buildFileTree(fullPath),
        };
      } else {
        return {
          name: entry.name,
          isFolder: false,
          path: fullPath,
        };
      }
    }));
  
    return tree;
  }
  