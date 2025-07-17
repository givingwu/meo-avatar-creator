import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "确认操作",
  description = "此操作无法撤销，请确认继续。",
  confirmText = "确认",
  cancelText = "取消",
  variant = 'default'
}: ConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              variant === 'destructive' 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-primary/10 text-primary'
            }`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <AlertDialogTitle className="text-lg font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};