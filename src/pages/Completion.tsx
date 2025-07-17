import { CheckCircle, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/StepIndicator";

interface CompletionProps {
  onBack: () => void;
  onReset: () => void;
}

export const Completion = ({ onBack, onReset }: CompletionProps) => {
  const steps = ["阅读须知", "上传资料", "确认提交"];

  return (
    <div className="min-h-screen bg-background">
      <Header title="MEO自主定制" showBack onBack={onBack} />
      
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <StepIndicator currentStep={2} totalSteps={3} steps={steps} />
        
        <div className="bg-card rounded-xl shadow-soft p-8 text-center space-y-8">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
              <CheckCircle className="h-10 w-10 text-primary-foreground" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground">
              提交成功！
            </h2>
            
            <p className="text-muted-foreground leading-relaxed">
              您的定制需求正在制作，制作完成后会立刻安排精美礼盒包装发送，敬请期待！
            </p>
          </div>

          <div className="bg-gradient-card rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-center gap-3 text-primary">
              <Sparkles className="h-6 w-6" />
              <span className="font-semibold">制作进度</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>AI训练中...</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-muted rounded-full"></div>
                <span>模型生成</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-muted rounded-full"></div>
                <span>质量检测</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-muted rounded-full"></div>
                <span>包装发货</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Package className="h-5 w-5" />
              <span className="font-medium">配送信息</span>
            </div>
            <p className="text-sm text-muted-foreground">
              预计制作时间：3-7个工作日
            </p>
            <p className="text-sm text-muted-foreground">
              完成后将通过短信通知您发货信息
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onReset}
              variant="meo"
              size="lg"
              className="w-full"
            >
              再次定制
            </Button>
            
            <p className="text-xs text-muted-foreground">
              感谢您选择MEO定制服务，我们将为您打造独一无二的AI伙伴
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};