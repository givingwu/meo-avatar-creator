import { useState } from "react";
import { Upload, Sparkles, Trash2, Check, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { uploadPhotoAndGenerateAvatar } from "@/lib/api";

interface AvatarGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageUrl: string, originalPhotoUrl?: string) => void;
}

interface GeneratedImage {
  id: string;
  url: string;
  style: 'cartoon' | 'realistic';
}

export const AvatarGenerator = ({ isOpen, onClose, onSave }: AvatarGeneratorProps) => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { toast } = useToast();

  // Mock generated images for demo
  const mockGeneratedImages: GeneratedImage[] = [
    { id: '1', url: '/placeholder.svg', style: 'cartoon' },
    { id: '2', url: '/placeholder.svg', style: 'cartoon' },
    { id: '3', url: '/placeholder.svg', style: 'cartoon' },
    { id: '4', url: '/placeholder.svg', style: 'cartoon' },
    { id: '5', url: '/placeholder.svg', style: 'realistic' },
    { id: '6', url: '/placeholder.svg', style: 'realistic' },
    { id: '7', url: '/placeholder.svg', style: 'realistic' },
    { id: '8', url: '/placeholder.svg', style: 'realistic' },
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      try {
        const response = await uploadPhotoAndGenerateAvatar(file);
        if (response.code === 200) {
          setOriginalPhotoUrl(response.data.url);
          toast({
            title: "图片上传成功",
            description: "您现在可以生成AI头像了",
          });
        }
      } catch (error) {
        toast({
          title: "上传失败",
          description: "图片上传出现错误，请重试",
          variant: "destructive",
        });
      }
    }
  };

  const generateAvatars = async () => {
    if (!uploadedImage) {
      toast({
        title: "请先上传图片",
        description: "需要上传头像图片才能进行AI生成",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setGeneratedImages(mockGeneratedImages);
      setIsGenerating(false);
      toast({
        title: "生成完成",
        description: "已为您生成8张不同风格的头像",
      });
    }, 3000);
  };

  const deleteUploadedImage = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setOriginalPhotoUrl(null);
    setGeneratedImages([]);
    setSelectedImage(null);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onSave(selectedImage, originalPhotoUrl || undefined);
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
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="font-medium text-foreground mb-3">请上传符合如下要求的头像：</p>
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
              <Label className="text-sm font-medium mb-3 block">选择性别</Label>
              <RadioGroup
                value={selectedGender}
                onValueChange={(value) => setSelectedGender(value as 'male' | 'female')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="font-medium">男生</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="font-medium">女生</Label>
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
                  <Label htmlFor="avatar-upload">
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

                  <Button
                    onClick={generateAvatars}
                    disabled={isGenerating}
                    variant="meo"
                    size="lg"
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                        正在生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        生成
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {generatedImages.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="font-medium">卡通风格</p>
                  <div className="grid grid-cols-4 gap-3">
                    {generatedImages.filter(img => img.style === 'cartoon').map((image) => (
                      <div
                        key={image.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === image.url
                            ? 'border-primary shadow-glow scale-105'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <img
                          src={image.url}
                          alt="Generated avatar"
                          className="w-full aspect-square object-cover"
                        />
                        {selectedImage === image.url && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary rounded-full p-1">
                              <Check className="h-4 w-4 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-medium">写实风格</p>
                  <div className="grid grid-cols-4 gap-3">
                    {generatedImages.filter(img => img.style === 'realistic').map((image) => (
                      <div
                        key={image.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === image.url
                            ? 'border-primary shadow-glow scale-105'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <img
                          src={image.url}
                          alt="Generated avatar"
                          className="w-full aspect-square object-cover"
                        />
                        {selectedImage === image.url && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary rounded-full p-1">
                              <Check className="h-4 w-4 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedImage && (
                  <Button
                    onClick={handleConfirm}
                    variant="success"
                    size="lg"
                    className="w-full"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    确认选择
                  </Button>
                )}
              </div>
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