import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CustomerServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerService = ({ isOpen, onClose }: CustomerServiceProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">联系企微客服</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="w-32 h-32 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="h-16 w-16 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              扫描二维码添加企微客服
            </p>
            <p className="text-xs text-muted-foreground">
              客服工作时间：9:00-18:00
            </p>
          </div>

          <Button variant="outline" onClick={onClose} className="w-full">
            <X className="h-4 w-4 mr-2" />
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};