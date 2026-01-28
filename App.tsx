
import React, { useState, useRef } from 'react';
import { analyzeMeal } from './services/gemini';
import { AnalysisResult, UserProfile } from './types';
import { 
  Camera, 
  Upload, 
  History, 
  Heart, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Loader2,
  ChefHat,
  Stethoscope,
  Activity,
  Zap,
  Droplets,
  Wind,
  Info
} from 'lucide-react';

const App: React.FC = () => {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userProfile: UserProfile = {
    age: 43,
    role: "資深教育人員 (高壓)",
    bloodPressure: "140/90 mmHg",
    conditions: ["血壓管理", "胃食道逆流風險"]
  };

  // 前端圖片壓縮工具：解決手機上傳過大圖片的問題
  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // 使用 JPEG 0.7 壓縮率，能大幅縮小檔案體積
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        // 拍照後立即壓縮
        const compressed = await compressImage(result);
        setSelectedImage(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async () => {
    if (!inputText && !selectedImage) return;
    setLoading(true);
    try {
      let base64Image = '';
      let mimeType = 'image/jpeg';
      if (selectedImage) {
        const parts = selectedImage.split(';');
        mimeType = parts[0].split(':')[1];
        base64Image = parts[1].split(',')[1];
      }

      const data = await analyzeMeal({ text: inputText, base64Image, mimeType });

      const newResult: AnalysisResult = {
        evaluation: data.evaluation,
        breakdown: {
          bloodPressure: data.bloodPressure,
          sugarStarch: data.sugarStarch,
          fatWeight: data.fatWeight,
          acidReflux: data.acidReflux,
        },
        support: data.support,
        timestamp: new Date(),
        imageUrl: selectedImage || undefined,
        description: inputText || undefined
      };

      setHistory([newResult, ...history]);
      setSelectedImage(null);
      setInputText('');
    } catch (error: any) {
      console.error("Analysis failed:", error);
      alert(`分析失敗：${error.message || "請檢查網路連線或圖片大小"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto pb-24 px-4 bg-slate-50">
      <header className="py-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ChefHat className="text-blue-600" />
              健康教練 HealthCoach
            </h1>
            <p className="text-sm text-slate-500">教育人員專屬健康管家</p>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Stethoscope className="text-blue-500 w-5 h-5" />
             </div>
             <div>
                <div className="text-xs font-medium text-slate-400">目前血壓</div>
                <div className="text-sm font-bold text-slate-700">{userProfile.bloodPressure}</div>
             </div>
          </div>
        </div>
      </header>

      <main className="space-y-6">
        {/* Input Card */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex flex-col gap-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="描述您的餐點（例如：自助餐、排骨便當...）"
              className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-700 text-base"
            />
            <div className="flex gap-3">
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-slate-100 rounded-2xl flex items-center justify-center gap-2 font-medium text-slate-600 active:bg-slate-200">
                <Camera className="w-5 h-5" /> 相機/照片
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              <button 
                disabled={loading || (!inputText && !selectedImage)}
                onClick={handleAnalysis}
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "開始智慧分析"}
              </button>
            </div>
            {selectedImage && <img src={selectedImage} alt="Preview" className="w-full h-48 object-cover rounded-xl mt-2 border-2 border-white shadow-sm" />}
          </div>
        </section>

        {/* Results List */}
        <div className="space-y-6">
          {history.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header with Evaluation */}
              <div className="p-5 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
                <div className={`px-4 py-1 rounded-full flex items-center gap-2 font-bold ${
                  item.evaluation === '綠燈' ? 'bg-emerald-100 text-emerald-700' :
                  item.evaluation === '黃燈' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {item.evaluation === '綠燈' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {item.evaluation}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {item.imageUrl && <img src={item.imageUrl} alt="Meal" className="w-full h-56 object-cover" />}

              <div className="p-5 space-y-4">
                {/* 4 Quadrants Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {/* BP Card - Priority 1 */}
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold">
                      <Activity className="w-4 h-4 text-blue-500" /> 血壓/鹽分監控
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed">{item.breakdown.bloodPressure}</p>
                  </div>

                  {/* Sugar Card */}
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold">
                      <Zap className="w-4 h-4 text-amber-500" /> 控糖/澱粉檢視
                    </div>
                    <p className="text-sm text-amber-800 leading-relaxed">{item.breakdown.sugarStarch}</p>
                  </div>

                  {/* Fat Card */}
                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2 text-rose-700 font-bold">
                      <Droplets className="w-4 h-4 text-rose-500" /> 減脂/體重管理
                    </div>
                    <p className="text-sm text-rose-800 leading-relaxed">{item.breakdown.fatWeight}</p>
                  </div>

                  {/* Reflux Card */}
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold">
                      <Wind className="w-4 h-4 text-emerald-500" /> 胃食道逆流友善
                    </div>
                    <p className="text-sm text-emerald-800 leading-relaxed">{item.breakdown.acidReflux}</p>
                  </div>
                </div>

                {/* Support Block */}
                <div className="mt-4 p-4 bg-slate-100/50 rounded-2xl border-l-4 border-slate-400">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs mb-1">
                    <Heart className="w-3 h-3 text-rose-400" /> 心理支持與關懷
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">「{item.support}」</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Profile Bar */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl bg-slate-900 text-white rounded-3xl py-4 px-8 flex justify-between items-center shadow-2xl z-50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Management Priority</div>
              <div className="text-xs font-medium">BP: 140/90 & Acid Reflux</div>
            </div>
          </div>
          <button className="text-[10px] bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 active:bg-slate-700 transition-colors">
            月報表
          </button>
      </footer>
    </div>
  );
};

export default App;
