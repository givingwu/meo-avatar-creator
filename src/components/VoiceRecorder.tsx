import { useState, useRef } from "react";
import { Mic, MicOff, Play, Pause, Trash2, RotateCcw, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
// 新增导入
import { uploadAudio } from "@/services/custom-info.service";
import { isSuccessResponse } from "@/utils/response.util";
import { formatErrorMessage } from "@/utils/response.util";

interface VoiceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (audioUrl: string) => void;
  orderNumber: string;
}

export const VoiceRecorder = ({ isOpen, onClose, onSuccess, orderNumber }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  // 添加isSaving状态
  const [isSaving, setIsSaving] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const sampleText = "《静夜思》是唐代诗人李白所作、流传最广泛的一首五言乐府诗，全文为：窗前明月光，疑是地上霜，举头望明月，低头思故乡";

  // 修改录音完成后的Blob创建逻辑 (L36-48部分)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      // 修改录音完成后的文件创建逻辑 (L48-49部分)
      mediaRecorder.onstop = () => {
        const fileName = `${orderNumber}_${Date.now()}.wav`;
        // 1. 显式指定正确的MIME类型为audio/wav
        // 2. 确保从源头上创建正确类型的Blob
        const wavBlob = new Blob(chunks, { type: 'audio/wav' });
        // 3. 创建File对象时再次确认MIME类型
        const audioFile = new File([wavBlob], fileName, {
          type: 'audio/wav',
          lastModified: Date.now()
        });

        setAudioFile(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "开始录音",
        description: "请有感情地朗读提示文本",
      });
    } catch (error) {
      toast({
        title: "录音失败",
        description: "请检查麦克风权限",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      toast({
        title: "录音完成",
        description: "您可以播放预览或重新录制",
      });
    }
  };

  const playAudio = () => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };

      audio.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioFile(null);
    setRecordingTime(0);
    setIsPlaying(false);
    onSuccess('')

    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const beforeClose = () => {
    // 如果正在录音，先停止
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    // 停止计时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // 停止播放
    if (audioRef.current) {
      audioRef.current.pause();
    }
    // 清空录音文件和播放状态
    setAudioFile(null);
    setIsPlaying(false);
    // 通知父组件录音已被清空
    onSuccess("");
    // 通知父组建关闭弹窗
    onClose()
  };

  const handleSave = async () => {
    if (audioFile && !isSaving) {
      setIsSaving(true);

      try {
        // 确保传递File对象而非原始Blob
        const response = await uploadAudio(audioFile, orderNumber);

        if (isSuccessResponse(response)) {
          if (response.data.uploadSuccess) {
            onSuccess(response.data.url);
            onClose();
            toast({
              title: "上传成功",
              description: "音频文件已上传",
            });
          } else {
            throw new Error(response.data.detectionFailureReason);
          }
        }
      } catch (error) {
        toast({
          title: "上传失败",
          description: formatErrorMessage(error),
          variant: "destructive",
        });
      } finally {
        setIsSaving(false); // 无论成功失败，最终设置isSaving为false
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={beforeClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">请录入声纹</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">
              请有感情的朗读如下文本，否则声音会死板：
            </p>
            <p className="text-sm leading-relaxed bg-card p-3 rounded-md border">
              {sampleText}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            {!isRecording && !audioFile && (
              <Button
                onClick={startRecording}
                variant="hero"
                size="lg"
                className="w-full"
              >
                <Mic className="h-5 w-5 mr-2" />
                开始录音
              </Button>
            )}

            {isRecording && (
              <div className="text-center space-y-4">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-2">
                    <Mic className="h-6 w-6 text-destructive-foreground" />
                  </div>
                  <p className="text-lg font-mono">{formatTime(recordingTime)}</p>
                  <p className="text-sm text-muted-foreground">正在录音...</p>
                </div>

                <Button
                  onClick={stopRecording}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <MicOff className="h-5 w-5 mr-2" />
                  停止录音
                </Button>
              </div>
            )}

            {audioFile && !isRecording && (
              <div className="w-full space-y-4">
                <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                  <p className="text-success font-medium">录音完成！</p>
                  <p className="text-sm text-muted-foreground">时长：{formatTime(recordingTime)}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={isPlaying ? pauseAudio : playAudio}
                    variant="outline"
                    className="flex-1"
                  >
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "暂停" : "播放"}
                  </Button>

                  <Button
                    onClick={deleteRecording}
                    variant="outline"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={startRecording}
                    variant="outline"
                    size="icon"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleSave}
                  variant="meo"
                  size="lg"
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>正在保存... <Loader className="ml-2 h-4 w-4 animate-spin" /></>
                  ) : (
                    "确认使用此录音"
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={beforeClose}>
              先不录，返回
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};