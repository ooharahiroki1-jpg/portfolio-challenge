import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  ChartNoAxesCombined,
  FileDown,
  Home,
  Keyboard,
  Newspaper,
  RotateCcw,
  Save,
  Skull,
  Sparkles,
  Upload,
  WalletCards,
  X
} from 'lucide-react';
import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { useGame } from '../../context/GameProvider';

interface ControlButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: 'blue' | 'red' | 'green' | 'purple' | 'white';
}

function ControlButton({
  label,
  icon,
  onClick,
  disabled,
  tone = 'white'
}: ControlButtonProps) {
  const tones = {
    blue: 'border-sky-300 bg-sky-400 text-slate-950 hover:bg-sky-300',
    red: 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100',
    green: 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    purple: 'border-violet-300 bg-violet-700 text-white hover:bg-violet-600',
    white: 'border-sky-100 bg-white text-slate-800 hover:bg-sky-50'
  };
  return (
    <button
      type="button"
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-base font-black transition ${tones[tone]} disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

export function GameMasterControls() {
  const {
    state,
    next,
    back,
    goToPhase,
    save,
    load,
    reset,
    toggleControls,
    exportState,
    importState
  } = useGame();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState('');

  if (state.gamePhase === 'start') {
    return null;
  }

  const handleSave = () => {
    save();
    setStatus('保存しました');
  };

  const handleLoad = () => {
    setStatus(load() ? '保存データを読み込みました' : '保存データがありません');
  };

  const handleExport = () => {
    const blob = new Blob([exportState()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'portfolio-challenge-save.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus('JSONを書き出しました');
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const error = importState(String(reader.result ?? ''));
      setStatus(error ?? 'JSONを読み込みました');
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('ゲームをリセットします。よろしいですか？')) {
      reset();
    }
  };

  if (!state.controlPanelOpen) {
    return (
      <button
        type="button"
        title="操作パネルを表示"
        onClick={toggleControls}
        className="game-master-trigger"
        aria-label="ゲームマスター操作を開く"
      >
        <Keyboard className="h-6 w-6" />
        <span>運営</span>
      </button>
    );
  }

  return (
    <aside className="game-master-panel" aria-label="ゲームマスター操作">
      <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={handleImport} />
      <div className="game-master-panel-header">
        <div>
          <div className="text-xl font-black text-slate-950">ゲームマスター操作</div>
          <div className="text-sm font-bold text-slate-500">第{state.currentRound}回・進行を直接操作</div>
        </div>
        <div className="flex items-center gap-3">
          {status ? (
            <div className="text-base font-bold text-slate-500">{status}</div>
          ) : null}
          <button
            type="button"
            title="操作パネルを閉じる"
            className="game-master-close"
            onClick={toggleControls}
            aria-label="操作パネルを閉じる"
          >
            <X />
          </button>
        </div>
      </div>
      <div className="game-master-section-label">基本操作</div>
      <div className="game-master-grid game-master-grid-primary">
        <ControlButton
          label="スタートへ"
          icon={<Home className="h-5 w-5" />}
          onClick={() => goToPhase('start')}
        />
        <ControlButton
          label="戻る"
          icon={<ArrowLeft className="h-5 w-5" />}
          onClick={() => {
            back();
            toggleControls();
          }}
        />
        <ControlButton
          label="次へ"
          icon={<ArrowRight className="h-5 w-5" />}
          onClick={() => {
            next();
            toggleControls();
          }}
          tone="blue"
        />
      </div>
      <div className="game-master-section-label">画面移動</div>
      <div className="game-master-grid">
        <ControlButton
          label="ニュース"
          icon={<Newspaper className="h-5 w-5" />}
          onClick={() => goToPhase('news')}
        />
        <ControlButton
          label="投資計画"
          icon={<WalletCards className="h-5 w-5" />}
          onClick={() => goToPhase(state.currentRound === 1 ? 'initial-order' : 'order')}
        />
        <ControlButton
          label="イベント"
          icon={<Sparkles className="h-5 w-5" />}
          onClick={() => goToPhase('event')}
        />
        <ControlButton
          label="株価ボード"
          icon={<ChartNoAxesCombined className="h-5 w-5" />}
          onClick={() => goToPhase('asset-update')}
        />
        <ControlButton
          label="イベント後結果"
          icon={<BarChart3 className="h-5 w-5" />}
          onClick={() => goToPhase('ranking-update')}
        />
        <ControlButton
          label="最終表彰"
          icon={<BarChart3 className="h-5 w-5" />}
          onClick={() => goToPhase('results')}
        />
        <ControlButton
          label="成績分析"
          icon={<FileDown className="h-5 w-5" />}
          onClick={() => goToPhase('report')}
        />
        <ControlButton
          label="異常シグナル"
          icon={<Skull className="h-5 w-5" />}
          onClick={() => goToPhase('shock')}
          disabled={state.currentRound !== 2 || state.shockOccurred}
          tone="purple"
        />
      </div>
      <div className="game-master-section-label">保存・復元</div>
      <div className="game-master-grid">
        <ControlButton
          label="保存"
          icon={<Save className="h-5 w-5" />}
          onClick={handleSave}
          tone="green"
        />
        <ControlButton
          label="読込"
          icon={<Upload className="h-5 w-5" />}
          onClick={handleLoad}
        />
        <ControlButton
          label="JSON"
          icon={<FileDown className="h-5 w-5" />}
          onClick={handleExport}
        />
        <ControlButton
          label="取込"
          icon={<Upload className="h-5 w-5" />}
          onClick={() => fileRef.current?.click()}
        />
        <ControlButton
          label="リセット"
          icon={<RotateCcw className="h-5 w-5" />}
          onClick={handleReset}
          tone="red"
        />
      </div>
      <div className="game-master-shortcuts">
        Space 次へ / B 戻る / H スタート / N ニュース / O 投資 / E イベント / P 株価 / R 結果
      </div>
    </aside>
  );
}
