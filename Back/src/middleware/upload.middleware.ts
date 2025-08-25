import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { StorageEngine } from 'multer';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
        cb(null, 'uploads/'); // Carpeta donde guardar
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Nombre único
    }
});

export const upload = multer({ storage });
