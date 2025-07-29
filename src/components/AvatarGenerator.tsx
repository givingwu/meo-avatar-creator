import { useState } from "react";
import { Upload, Trash2, Check, User, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { uploadPhotoAndGenerateAvatar } from "@/services/custom-info.service";
import { isSuccessResponse, formatErrorMessage } from "@/utils/response.util";

interface AvatarGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageUrl: string, originalPhotoUrl?: string) => void;
  orderNo: string;
}

export const AvatarGenerator = ({ isOpen, onClose, onSave, orderNo }: AvatarGeneratorProps) => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setIsSaving(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const response = await uploadPhotoAndGenerateAvatar(file, orderNo);

        if (isSuccessResponse(response)) {
          if (response.data.uploadSuccess && response.data.url) {
            toast({
              title: "图片上传成功",
              description: "将被系统后台用于生成 AI 头像",
            });
            setOriginalPhotoUrl(response.data.url);
          } else {
            throw new Error(response.data.detectionFailureReason)
          }
        }
      } catch (error) {
        toast({
          title: "上传失败",
          description: formatErrorMessage(error),
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleClickUploadProgrammatically = () => {
    document.getElementById('avatar-upload')?.click();
  };

  const deleteUploadedImage = () => {
    setUploadedImage(null);
    setOriginalPhotoUrl(null);
    onSave('', '')
  };

  const handleConfirm = () => {
    if (uploadedImage && originalPhotoUrl) {
      onSave(originalPhotoUrl, uploadedImage);
      onClose();
      toast({
        title: "头像已保存",
        description: "您的专属头像已设置成功",
      });
    }
  };

  const requirements = [
    "完整正面",
    "不佩戴饰品",
    "头部特写",
    "背景干净"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">上传头像素材</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg">
            <p className="font-medium text-foreground mb-3 block">请上传符合如下要求的头像：</p>
            <div className="grid grid-cols-2 gap-2">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">选择性别：</Label>
              <RadioGroup
                value={selectedGender}
                onValueChange={(value) => setSelectedGender(value as 'male' | 'female')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="font-medium">女生</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="font-medium">男生</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">点击上传头像图片</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Label htmlFor="avatar-upload" onClick={handleClickUploadProgrammatically}>
                    <Button variant="outline" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      点击上传
                    </Button>
                  </Label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">已上传图片</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deleteUploadedImage}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除头像
                    </Button>
                  </div>

                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="上传的头像"
                      className="w-32 h-32 object-cover rounded-lg border mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>

            {uploadedImage && (
              <Button
                onClick={handleConfirm}
                variant="meo"
                size="lg"
                disabled={isSaving || !uploadedImage || !originalPhotoUrl}
                className="w-full"
              >
                {isSaving ? (
                    <>正在保存... <Loader className="ml-2 h-4 w-4 animate-spin" /></>
                  ) : (
                    "确认使用此头像"
                  )}
              </Button>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={onClose}>
              返回
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};