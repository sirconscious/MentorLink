import { Share2, Link, Facebook, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ShareDropdown = () => {
    const url = window.location.href;

    const copyLink = () => {
        navigator.clipboard.writeText(url);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyLink}>
                    <Link className="h-4 w-4 mr-2" />
                    Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank')}>
                    <Twitter className="h-4 w-4 mr-2" />
                    Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')}>
                    <Facebook className="h-4 w-4 mr-2" />
                    Share on Facebook
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}; 
export default ShareDropdown;