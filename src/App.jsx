import React, { useState } from 'react';
import { ArrowLeftRight, ExternalLink } from 'lucide-react';

export default function StarforceSimulator() {
  // 상태 관리
  const [preventDestruction, setPreventDestruction] = useState([]);
  const [traceRecovery, setTraceRecovery] = useState([]);
  const [traceOpt, setTraceOpt] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('없음');
  const [discounts, setDiscounts] = useState({
    silver: false, gold: false, diamond: false, pc방: false
  });

  const events = [
    "없음", "10성 이하에서 강화 시 1+1", "비용 30% 할인 (샤타포스)",
    "흔적 복구 비용 중 메소 비용 20% 할인", "5, 10, 15성에서 강화 시 성공확률 100%",
    "21성 이하에서 파괴 확률 30% 감소 (샤타포스)", "샤이닝 스타포스",
    "샤이닝 스타포스 (+흔적 복구 비용 20% 할인)", "샤이닝 스타포스 (+ 5/10/15성 100%)"
  ];

  // 토글 함수
  const toggleArray = (setter, state, value) => {
    if (state.includes(value)) setter(state.filter(v => v !== value));
    else setter([...state, value]);
  };

  const toggleAll = (setter, values) => {
    setter(values);
  };

  const toggleDiscount = (key) => {
    setDiscounts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl w-full flex flex-col md:flex-row gap-6">
        
        {/* 좌측 패널: 설정 영역 */}
        <div className="flex-1 bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 space-y-10">
          
          {/* 파괴방지 */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-extrabold tracking-tight">파괴방지</h2>
              <button 
                onClick={() => toggleAll(setPreventDestruction, [15, 16, 17])}
                className="text-orange-500 text-sm font-bold hover:text-orange-600 transition-colors"
              >
                모두 선택
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[15, 16, 17].map(star => (
                <button 
                  key={star}
                  onClick={() => toggleArray(setPreventDestruction, preventDestruction, star)}
                  className={`py-4 rounded-2xl border-2 text-base font-bold transition-all duration-200 ${
                    preventDestruction.includes(star) 
                      ? 'border-orange-500 text-orange-500 bg-orange-50' 
                      : 'border-gray-100 text-gray-400 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {star}성
                </button>
              ))}
            </div>
          </section>

          {/* 흔적 복구 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-extrabold tracking-tight">흔적 복구</h2>
                <button 
                  onClick={() => toggleAll(setTraceRecovery, [15, 16, 17, 18, 19, 20, 21, 22])}
                  className="text-orange-500 text-sm font-bold hover:text-orange-600 transition-colors"
                >
                  모두 선택
                </button>
              </div>
              <a href="#" className="text-orange-500 text-sm font-semibold flex items-center gap-1 hover:underline">
                데이터 출처: 인벤 법사캐 <ExternalLink size={14} />
              </a>
            </div>
            
            <div className="flex items-center gap-3 mb-5">
              <label className="relative flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={traceOpt} 
                  onChange={() => setTraceOpt(!traceOpt)} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                <span className="ml-3 text-sm font-bold text-gray-600">흔적 복구 최적화</span>
              </label>
            </div>
            <p className="text-sm text-gray-400 mb-4 font-medium italic">자동으로 유리한 흔적 복구 구간을 선택합니다.</p>

            <div className="grid grid-cols-4 gap-3">
              {[15, 16, 17, 18, 19, 20, 21, 22].map(star => (
                <button 
                  key={star}
                  onClick={() => toggleArray(setTraceRecovery, traceRecovery, star)}
                  className={`py-4 rounded-2xl border-2 text-base font-bold transition-all duration-200 ${
                    traceRecovery.includes(star) 
                      ? 'border-orange-500 text-orange-500 bg-orange-50' 
                      : 'border-gray-100 text-gray-400 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {star}성
                </button>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                장비 레벨이 <span className="text-gray-500">130, 135, 140, 145, 150, 160, 200, 250</span> 중 하나이고,<br/>
                목표 스타포스가 <span className="text-orange-500 font-bold">16성 이상</span>일 때 활성화됩니다.
              </p>
            </div>
          </section>

          {/* 스타포스 이벤트 */}
          <section>
            <h2 className="text-xl font-extrabold tracking-tight mb-5">스타포스 이벤트</h2>
            <div className="grid grid-cols-1 gap-3">
              {events.map((event, idx) => (
                <label 
                  key={idx} 
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedEvent === event 
                      ? 'border-orange-500 bg-orange-50 shadow-sm' 
                      : 'border-gray-50 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="starforce_event" 
                    className="w-5 h-5 accent-orange-500"
                    checked={selectedEvent === event}
                    onChange={() => setSelectedEvent(event)}
                  />
                  <span className={`text-sm font-bold ${
                    selectedEvent === event ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    {event}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* 강화비용 할인 */}
          <section>
            <h2 className="text-xl font-extrabold tracking-tight mb-5">강화비용 할인</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'silver', label: 'MVP 실버' },
                { id: 'gold', label: 'MVP 골드' },
                { id: 'diamond', label: 'MVP 다이아' },
                { id: 'pc', label: 'PC방' }
              ].map(discount => (
                <label 
                  key={discount.id} 
                  className={`flex items-center gap-3 py-3 px-5 rounded-full border-2 cursor-pointer transition-all ${
                    discounts[discount.id] 
                      ? 'border-orange-500 bg-orange-50 text-orange-600' 
                      : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-orange-500" 
                    checked={discounts[discount.id]}
                    onChange={() => toggleDiscount(discount.id)}
                  />
                  <span className="text-sm font-bold">{discount.label}</span>
                </label>
              ))}
            </div>
          </section>

        </div>

        {/* 우측 패널: 결과 영역 */}
        <div className="flex-1 bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full min-h-[800px]">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-gray-900">시뮬레이션 통계</h2>
              <p className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-black">평균: 0</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1 group">
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-[1.25rem] py-5 px-6 text-right font-black text-xl focus:border-orange-500 focus:bg-white transition-all outline-none" 
                  placeholder="0" 
                />
                <span className="absolute right-6 top-5 text-gray-400 font-bold">%</span>
                <span className="absolute left-6 top-5 text-gray-900 font-black">상위</span>
              </div>
              
              <div className="p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-orange-100 hover:text-orange-500 transition-colors cursor-pointer">
                <ArrowLeftRight size={24} />
              </div>
              
              <div className="relative flex-1 group">
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-[1.25rem] py-5 px-6 pr-16 text-right font-black text-xl focus:border-orange-500 focus:bg-white transition-all outline-none" 
                  placeholder="0" 
                />
                <span className="absolute right-6 top-5 text-gray-400 font-bold">메소</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-extrabold tracking-tight mb-5">소모 장비</h2>
            
            {/* 결과 표시 영역 (빈 공간) */}
            <div className="flex-1 border-4 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center group hover:border-orange-200 transition-colors bg-gray-50/50">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6 text-gray-300 group-hover:bg-orange-100 group-hover:text-orange-300 transition-all">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/></svg>
              </div>
              <p className="text-gray-400 font-bold text-lg mb-2">시뮬레이션 결과가 여기에 표시됩니다.</p>
              <p className="text-gray-300 text-sm font-medium">강화 버튼을 눌러 시뮬레이션을 시작하세요.</p>
            </div>
          </div>

          <button className="mt-8 w-full py-6 bg-orange-500 text-white rounded-[1.5rem] text-xl font-black shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-[0.98] transition-all">
            시뮬레이션 시작
          </button>
        </div>

      </div>
    </div>
  );
}
