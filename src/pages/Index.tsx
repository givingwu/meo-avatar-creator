import { useState } from "react";
import { ReadingNotice } from "./ReadingNotice";
import { UploadMaterials } from "./UploadMaterials";
import { Completion } from "./Completion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Sparkles, User, Mic } from "lucide-react";
import meoLogo from "@/assets/meo-logo.png";

type Step = 'welcome' | 'reading' | 'upload' | 'completion';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');

  const handleNext = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('reading');
        break;
      case 'reading':
        setCurrentStep('upload');
        break;
      case 'upload':
        setCurrentStep('completion');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'reading':
        setCurrentStep('welcome');
        break;
      case 'upload':
        setCurrentStep('reading');
        break;
      case 'completion':
        setCurrentStep('upload');
        break;
    }
  };

  const handleReset = () => {
    setCurrentStep('welcome');
  };

  if (currentStep === 'reading') {
    return <ReadingNotice onNext={handleNext} onBack={handleBack} />;
  }

  if (currentStep === 'upload') {
    return <UploadMaterials onNext={handleNext} onBack={handleBack} />;
  }

  if (currentStep === 'completion') {
    return <Completion onBack={handleBack} onReset={handleReset} />;
  }

  // Welcome page
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header title="MEO自主定制" />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-card rounded-2xl shadow-glow flex items-center justify-center">
                <img 
                  src={meoLogo} 
                  alt="MEO Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-primary-foreground">
                MEO自主定制
              </h1>
              <p className="text-xl text-primary-foreground/90">
                打造您的专属AI数字伙伴
              </p>
              <p className="text-primary-foreground/70 leading-relaxed">
                通过声音和外观定制，创造独一无二的AI角色
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 shadow-medium">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Mic className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">声音克隆</h3>
              <p className="text-sm text-muted-foreground">
                录制您的声音，AI将学习并复制您独特的音色
              </p>
            </div>
            
            <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 shadow-medium">
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <User className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">形象定制</h3>
              <p className="text-sm text-muted-foreground">
                上传照片生成专属3D数字形象，卡通或写实风格
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-card rounded-2xl p-8 shadow-strong space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">
                开始定制您的MEO
              </h2>
              <p className="text-muted-foreground">
                只需几个简单步骤，即可获得专属AI伙伴
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-left">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span>阅读服务须知</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-left">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span>上传声音和头像素材</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-left">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span>等待制作完成并收货</span>
              </div>
            </div>

            <Button
              onClick={handleNext}
              variant="hero"
              size="xl"
              className="w-full"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              开始定制
            </Button>

            <p className="text-xs text-muted-foreground">
              制作周期：3-7个工作日 | 支持全国包邮
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
