
import { ExternalLink } from "lucide-react";

export const AnnouncementBar = () => {
    return (
        <div className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 px-4 text-center font-medium flex flex-col sm:flex-row items-center justify-center gap-2 shadow-md relative z-50">
            <span className="text-sm sm:text-base">
                Regístrate con un código y deja otro para que la cadena siga 👇
            </span>
            <a 
                href="https://www.chatcut.io/projects" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-200 transition-colors flex items-center gap-1 font-bold text-sm sm:text-base"
            >
                Ir a ChatCut.io
                <ExternalLink className="h-4 w-4" />
            </a>
        </div>
    );
};
