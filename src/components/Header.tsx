import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header = ({ title, showBack = false, onBack }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border/50 sticky top-0 z-40 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            MEO
          </div>
        </div>
      </div>
    </header>
  );
};