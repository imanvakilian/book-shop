import { TmulterFile } from "src/common/utils/multer-book.util";

export type Tfiles = { image: Array<TmulterFile>, pdf?: Array<TmulterFile>, audio?: Array<TmulterFile> };

export interface IbookOptions {
    title: string;
    slug: string,
    description: string,
    short_summary: string,
    image: string,
    pdf: string,
    audio: string,
    price: number,
    total_price: number,
    count: number,
    editors_choice?: boolean,
    timeToRead: number,
}