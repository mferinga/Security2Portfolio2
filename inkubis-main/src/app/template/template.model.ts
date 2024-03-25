import { SafeUrl } from "@angular/platform-browser";

export interface ITemplate {
    id: string;
    name: string;
    content: string;
    templateImage: string;
}

export interface ITemplateVM {
    id: string;
    name: string;
    content: string;
    templateImage: string;
    safeTemplateImage: SafeUrl;
}