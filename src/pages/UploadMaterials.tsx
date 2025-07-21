import { useState } from "react";
import { Mic, User, Upload, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/StepIndicator";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { AvatarGenerator } from "@/components/AvatarGenerator";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CustomerService } from "@/components/CustomerService";
import { useToast } from "@/hooks/use-toast";
import { saveCustomInfo, uploadAudio, CustomInfoDTO } from "@/services/custom-info.service";
import { validatePhone, validateOrderNo, validatePersonalityDesc } from "@/utils/validation.util";
import { isSuccessResponse, formatErrorMessage } from "@/utils/response.util";

interface FormData {
  orderNumber: string;
  name: string;
  phone: string;
  personality: string;
  voiceBlob: Blob | null;
  avatarUrl: string | null;
  audioUrl?: string;
  originalPhotoUrl?: string;
}

interface UploadMaterialsProps {
  onNext: () => void;
  onBack: () => void;
}

const validateForm = (formData: FormData) => {
  const errors = [];

  if (!validateOrderNo(formData.orderNumber)) {
    errors.push("订单号格式不正确");
  }
  if (formData.phone.trim() && !validatePhone(formData.phone)) {
    errors.push("手机号码格式不正确");
  }
  if (!validatePersonalityDesc(formData.personality)) {
    errors.push("性格描述长度不符合要求（10-200字）");
  }
  // 将验证voiceBlob改为验证audioUrl
  if (!formData.audioUrl) {
    errors.push("声音素材");
  }
  if (!formData.avatarUrl) {
    errors.push("头像素材");
  }

  return errors;
};

export const UploadMaterials = ({ onNext, onBack }: UploadMaterialsProps) => {
  const [formData, setFormData] = useState<FormData>({
    orderNumber: '',
    name: '',
    phone: '',
    personality: '',
    voiceBlob: null,
    avatarUrl: null,
    // 保留audioUrl但不再需要voiceBlob
    audioUrl: undefined
  });

  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showAvatarGenerator, setShowAvatarGenerator] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [expandedPersonality, setExpandedPersonality] = useState(false);

  const { toast } = useToast();

  const personalityTemplate = `在交流中，经常是自由发散的聊天。回复要简洁，答案不必详尽无遗，就像人类不可能知道所有信息一样。既提供情绪支持，又给出逻辑明晰、条理清楚且充满人情味的建议或解答。`;

  const steps = ["阅读须知", "上传资料", "确认提交"];

  // 新增成功回调
  const handleVoiceSuccess = (audioUrl: string) => {
    setFormData(prev => ({
      ...prev,
      audioUrl,
      voiceBlob: null // 清除不再需要的blob
    }));
  };

  const handleSubmit = () => {
    const errors = validateForm(formData);

    if (errors.length > 0) {
      toast({
        title: "请完善以下信息",
        description: errors.join("、"),
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);

    try {
      const customInfo: CustomInfoDTO = {
        orderNo: formData.orderNumber,
        userName: formData.name || undefined,
        phone: formData.phone || undefined,
        personalityDesc: formData.personality,
        audioUrl: formData.audioUrl,
        avatarUrl: formData.avatarUrl || undefined,
        originalPhotoUrl: formData.originalPhotoUrl,
      };

      const response = await saveCustomInfo(customInfo);

      if (isSuccessResponse(response)) {
        onNext();
        toast({
          title: "提交成功",
          description: "您的定制需求已提交，正在制作中",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "提交失败",
        description: formatErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleAvatarSave = (imageUrl: string, originalPhotoUrl?: string) => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: imageUrl,
      originalPhotoUrl
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="MEO自主定制" showBack onBack={onBack} />

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <StepIndicator currentStep={1} totalSteps={3} steps={steps} />

        <div className="bg-card rounded-xl shadow-soft p-6 space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="orderNumber" className="text-sm font-medium">
                订单号*
              </Label>
              <Input
                id="orderNumber"
                value={formData.orderNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, orderNumber: e.target.value }))}
                placeholder="请输入订单号"
                className="transition-all duration-200 focus:shadow-soft"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                收件人姓名 <span className="text-xs text-muted-foreground">（可提供收件人信息，若定制过程中有声音和头像上的疑问，客服会据此信息联系您）</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入收件人姓名"
                className="transition-all duration-200 focus:shadow-soft"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                收件手机号码 <span className="text-xs text-muted-foreground">（可提供收件人信息，若定制过程中有声音和头像上的疑问，客服会据此信息联系您）</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="请输入11位手机号码"
                maxLength={11}
                className="transition-all duration-200 focus:shadow-soft"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality" className="text-sm font-medium">
                性格描述* <span className="text-xs text-muted-foreground">（定制你的专属性格）</span>
              </Label>
              <div className="space-y-3">
                <Textarea
                  id="personality"
                  value={formData.personality}
                  onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                  placeholder="请描述您希望的AI性格特点..."
                  className="min-h-[100px] transition-all duration-200 focus:shadow-soft resize-none"
                  maxLength={200}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formData.personality.length}/200字</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedPersonality(!expandedPersonality)}
                    className="h-auto p-1"
                  >
                    {expandedPersonality ? "收起" : "查看"}模板
                    {expandedPersonality ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                  </Button>
                </div>

                {expandedPersonality && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-2">参考模板：</p>
                    <p className="text-xs leading-relaxed text-foreground">
                      {personalityTemplate}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, personality: personalityTemplate }))}
                      className="mt-2 h-auto p-1 text-xs"
                    >
                      使用此模板
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">声音素材*</Label>
                <Button
                  onClick={() => setShowVoiceRecorder(true)}
                  variant={formData.voiceBlob ? "success" : "outline"}
                  className="w-full justify-start h-auto p-4"
                >
                  <Mic className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">
                      {formData.voiceBlob ? "已录制声音素材" : "点击录制"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formData.voiceBlob ? "点击重新录制" : "录制您的专属声纹"}
                    </p>
                  </div>
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">头像素材*</Label>
                <Button
                  onClick={() => setShowAvatarGenerator(true)}
                  variant={formData.avatarUrl ? "success" : "outline"}
                  className="w-full justify-start h-auto p-4"
                >
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Selected avatar"
                      className="h-12 w-12 rounded-lg object-cover mr-3"
                    />
                  ) : (
                    <User className="h-5 w-5 mr-3" />
                  )}
                  <div className="text-left">
                    <p className="font-medium">
                      {formData.avatarUrl ? "已选择头像" : "点击上传"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formData.avatarUrl ? "点击重新选择" : "上传照片生成专属头像"}
                    </p>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-4 text-center">
              注释：获取的姓名、电话仅为定制过程中沟通使用，不涉及获取个人隐私
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                variant="meo"
                size="lg"
                className="w-full"
              >
                提交
              </Button>

              <Button
                onClick={() => setShowCustomerService(true)}
                variant="outline"
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                联系企微客服
              </Button>
            </div>
          </div>
        </div>
      </div>

      <VoiceRecorder
        isOpen={showVoiceRecorder}
        onClose={() => setShowVoiceRecorder(false)}
        onSuccess={handleVoiceSuccess}
        orderNumber={formData.orderNumber}
      />

      <AvatarGenerator
        isOpen={showAvatarGenerator}
        onClose={() => setShowAvatarGenerator(false)}
        onSave={handleAvatarSave}
        orderNo={formData.orderNumber}
      />

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSubmit}
        title="确认提交"
        description="请确认素材，一经提交即进入定制生产流程，无法退款！"
        confirmText="确认"
        cancelText="取消"
        variant="destructive"
      />

      <CustomerService
        isOpen={showCustomerService}
        onClose={() => setShowCustomerService(false)}
      />
    </div>
  );
};