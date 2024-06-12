import { Request } from "express";
import { mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname, join } from "path";

export type TmulterFile = Express.Multer.File;
export type TdestinationMulterCallback = (error: Error | null, destination: string) => void;
export type TFilenameMulterCallback = (error: Error | null, filename: string) => void;

export function bookMulterDestination(req: Request, file: TmulterFile, callback: TdestinationMulterCallback) {
    const path = join("public", "uploads", "book");
    mkdirSync(path, { recursive: true });
    callback(null, path);
}

export function bookMulterFilename(req: Request, file: TmulterFile, callback: TFilenameMulterCallback) {
    const ext = extname(file.originalname);
    const filename = `${new Date().getTime()}${ext}`;
    callback(null, filename);
}

export function bookMulterDiskstorage() {
    return diskStorage({
        destination: bookMulterDestination,
        filename: bookMulterFilename,
    })
}