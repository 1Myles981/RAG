import React, { useEffect, useMemo, useState } from 'react';

const MESSAGES = {
  zh: {
    welcome: ['你好，我是小合～', '有合规问题尽管问我！', '试试左侧的快捷提问吧'],
    loading: ['小合正在全力检索…', '马上就好，稍等一下～'],
    answer: ['答案生成好啦！', '点击引用编号可以溯源哦', '点我可以发起新提问～']
  },
  en: {
    welcome: ["Hi, I'm Xiaohe!", 'Ask me anything about compliance!', 'Try the quick questions on the left'],
    loading: ['Xiaohe is searching…', 'Almost there, one moment~'],
    answer: ['Your answer is ready!', 'Click a citation to trace the source', 'Click me to start a new question~']
  }
};

function MascotXiaohe({ phase = 'welcome', language = 'zh', onActivate }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);

  const messages = useMemo(() => {
    const pack = MESSAGES[language] || MESSAGES.zh;
    return pack[phase] || pack.welcome;
  }, [phase, language]);

  useEffect(() => {
    setMessageIndex(0);
    setIsBubbleVisible(true);
  }, [phase, language]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((value) => (value + 1) % messages.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [messages.length]);

  return (
    <div className={`mascot-xiaohe ${phase === 'loading' ? 'is-busy' : ''}`}>
      {isBubbleVisible && (
        <div className="mascot-bubble" key={`${phase}-${messageIndex}`}>
          {messages[messageIndex]}
        </div>
      )}

      <button
        type="button"
        className="mascot-body-wrap"
        title={language === 'zh' ? '点我开始新提问' : 'Click me to start a new question'}
        aria-label={language === 'zh' ? '小合：开始新提问' : 'Xiaohe: start a new question'}
        onClick={() => onActivate?.()}
      >
        <svg className="mascot-svg" viewBox="0 0 200 224" width="132" height="148" role="img">
          <defs>
            {/* 头部 / 身体的立体白 */}
            <radialGradient id="xhShell" cx="38%" cy="26%" r="90%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#fdf3f2" />
              <stop offset="82%" stopColor="#f6d9d8" />
              <stop offset="100%" stopColor="#eebfbf" />
            </radialGradient>
            {/* 红色部件的立体红 */}
            <radialGradient id="xhRed" cx="35%" cy="25%" r="95%">
              <stop offset="0%" stopColor="#ff9d9d" />
              <stop offset="45%" stopColor="#f26d6d" />
              <stop offset="100%" stopColor="#d64550" />
            </radialGradient>
            <radialGradient id="xhRedDeep" cx="35%" cy="25%" r="95%">
              <stop offset="0%" stopColor="#f47f7f" />
              <stop offset="100%" stopColor="#b83a44" />
            </radialGradient>
            {/* 面屏 */}
            <linearGradient id="xhVisor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#463046" />
              <stop offset="55%" stopColor="#2e1e33" />
              <stop offset="100%" stopColor="#1f1224" />
            </linearGradient>
            {/* 眼睛发光 */}
            <linearGradient id="xhEye" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff3e8" />
              <stop offset="60%" stopColor="#ffc9a8" />
              <stop offset="100%" stopColor="#ff9d7a" />
            </linearGradient>
            <filter id="xhGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="xhGlowSoft" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 地面影子 */}
          <ellipse className="mascot-shadow" cx="100" cy="212" rx="46" ry="8" fill="rgba(214, 69, 80, 0.16)" />

          <g className="mascot-float">
            {/* ============ 手臂（自然下垂，轻摆） ============ */}
            <g className="mascot-arm-left">
              <rect x="34" y="120" width="20" height="46" rx="10" fill="url(#xhRedDeep)" />
              <circle cx="44" cy="166" r="10" fill="url(#xhRed)" />
              <circle cx="41" cy="162" r="3" fill="rgba(255,255,255,0.5)" />
            </g>
            <g className="mascot-arm-right">
              <rect x="146" y="120" width="20" height="46" rx="10" fill="url(#xhRedDeep)" />
              <circle cx="156" cy="166" r="10" fill="url(#xhRed)" />
              <circle cx="153" cy="162" r="3" fill="rgba(255,255,255,0.5)" />
            </g>

            {/* ============ 腿脚 ============ */}
            <g>
              <rect x="62" y="168" width="34" height="34" rx="15" fill="url(#xhRedDeep)" />
              <ellipse cx="79" cy="196" rx="17" ry="9" fill="url(#xhRed)" />
              <ellipse cx="73" cy="192" rx="5" ry="2.6" fill="rgba(255,255,255,0.45)" />
              <rect x="104" y="168" width="34" height="34" rx="15" fill="url(#xhRedDeep)" />
              <ellipse cx="121" cy="196" rx="17" ry="9" fill="url(#xhRed)" />
              <ellipse cx="115" cy="192" rx="5" ry="2.6" fill="rgba(255,255,255,0.45)" />
            </g>

            {/* ============ 身体 ============ */}
            <rect x="54" y="112" width="92" height="70" rx="32" fill="url(#xhShell)" />
            {/* 身体底部暗部 */}
            <path d="M60 158 Q100 176 140 158 L140 166 Q100 186 60 166 Z" fill="rgba(184, 58, 68, 0.10)" />
            {/* 胸口发光条 */}
            <g className="mascot-heart" filter="url(#xhGlowSoft)">
              <rect x="72" y="138" width="24" height="6.5" rx="3.25" fill="#ff7d6e" />
              <rect x="104" y="138" width="24" height="6.5" rx="3.25" fill="#ff7d6e" />
            </g>
            {/* 身体高光 */}
            <ellipse cx="78" cy="124" rx="16" ry="7" fill="rgba(255,255,255,0.65)" />

            {/* 右上角小天线鳍 */}
            <g className="mascot-antenna-dot">
              <path d="M166 40 Q184 8 190 26 Q192 44 172 52 Z" fill="url(#xhRed)" />
              <path d="M170 42 Q182 20 186 30" stroke="rgba(255,255,255,0.5)" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>

            {/* ============ 头部 ============ */}
            <rect x="24" y="10" width="152" height="118" rx="52" fill="url(#xhShell)" />
            {/* 头部底部暗部 */}
            <path d="M34 96 Q100 130 166 96 L166 106 Q100 142 34 106 Z" fill="rgba(184, 58, 68, 0.10)" />
            {/* 头顶高光 */}
            <ellipse cx="70" cy="34" rx="34" ry="14" fill="rgba(255,255,255,0.8)" />
            <ellipse cx="132" cy="26" rx="12" ry="5" fill="rgba(255,255,255,0.55)" />

            {/* 面屏 */}
            <rect x="44" y="36" width="112" height="76" rx="28" fill="url(#xhVisor)" />
            <rect x="44" y="36" width="112" height="76" rx="28" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
            {/* 面屏顶部反光 */}
            <path d="M56 44 Q100 36 144 44 Q100 52 56 44 Z" fill="rgba(255,255,255,0.14)" />

            {/* 眼睛（发光竖条，会眨、会左右看） */}
            <g className="mascot-eyes" filter="url(#xhGlow)">
              <g className="mascot-eye-glance">
                <rect x="72" y="56" width="12" height="34" rx="6" fill="url(#xhEye)" />
                <rect x="116" y="56" width="12" height="34" rx="6" fill="url(#xhEye)" />
              </g>
            </g>

            {/* 微笑 */}
            <path
              className="mascot-mouth"
              d="M92 96 Q100 103 108 96"
              stroke="#ffb08e"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              filter="url(#xhGlowSoft)"
            />
          </g>
        </svg>
        <span className="mascot-name">小合</span>
      </button>
    </div>
  );
}

export default MascotXiaohe;
