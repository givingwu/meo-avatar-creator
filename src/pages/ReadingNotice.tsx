import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

interface ReadingNoticeProps {
  onNext: () => void;
  onBack: () => void;
}

export const ReadingNotice = ({ onNext, onBack }: ReadingNoticeProps) => {
  const [acknowledged, setAcknowledged] = useState(true);

  const noticeContent = `
在使用 MEO 自主定制服务前，请仔细阅读以下重要信息：

1. 定制说明
• 本服务为 AI 数字人定制服务
• 定制过程需要提供声音和头像素材
• 生成时间约 3-7 个工作日

2. 素材要求
• 声音素材：需录制指定文本，确保音质清晰
• 头像素材：需正面清晰照片，背景干净无遮挡
• 所有素材需真实有效，不得使用他人素材

3. 服务条款
• 一经提交即进入定制生产流程
• 定制完成后不支持退款
• 请确保提供信息准确无误

4. 隐私保护
• 我们承诺保护您的个人信息安全
• 素材仅用于定制服务，不会用于其他用途
• 严格遵守相关法律法规

5. 联系我们
• 如有疑问可联系客服咨询
• 客服工作时间：9:00-18:00
• 我们将竭诚为您服务

请确认您已详细阅读并理解以上内容。
  `;

  return (
    <div className="min-h-screen bg-background">
      <Header title="MEO 自主定制" showBack onBack={onBack} />

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-card rounded-xl shadow-soft p-6 mb-6">
          <h2 className="text-xl font-bold text-center mb-4 text-foreground">
            阅读须知
          </h2>

          <div className="bg-muted/30 rounded-lg p-6 mb-6 overflow-y-auto">
            <pre className="text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans">
              {noticeContent}
            </pre>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="sr-only"
                />
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                  ${acknowledged
                    ? 'bg-primary border-primary shadow-soft'
                    : 'border-border group-hover:border-primary/50'
                  }
                `}>
                  {acknowledged && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
              </div>
              <span className="text-sm text-foreground">
                我已知晓以上内容，同意继续使用MEO定制服务
              </span>
            </label>

            <Button
              onClick={onNext}
              disabled={!acknowledged}
              variant="meo"
              size="lg"
              className="w-full"
            >
              我已知晓
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};