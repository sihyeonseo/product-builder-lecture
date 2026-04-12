const upgradeBtn = document.getElementById('btn-upgrade');
const resetBtn = document.getElementById('btn-reset');
const starDisplay = document.getElementById('star-display');
const currentStarsText = document.getElementById('current-stars');
const successRateText = document.getElementById('success-rate');
const keepRateText = document.getElementById('keep-rate');
const dropRateText = document.getElementById('drop-rate');
const destroyRateText = document.getElementById('destroy-rate');
const upgradeCostText = document.getElementById('upgrade-cost');
const totalCostText = document.getElementById('total-cost');
const logBox = document.getElementById('upgrade-log');
const starCatchCheck = document.getElementById('star-catch');
const safeguardCheck = document.getElementById('safeguard');

let currentStars = 0;
let totalCost = 0;
let totalDestroys = 0;
const itemLevel = 160;

// 2025년 최신 KMS 확률 테이블 (15성 이상 하락 삭제 반영)
const getProbabilities = (stars) => {
    let success, keep, drop, destroy;
    
    // 0~10성: 성공률 높음, 하락/파괴 없음
    if (stars <= 10) {
        success = 100 - (stars * 5);
        keep = 100 - success;
        drop = 0;
        destroy = 0;
    } 
    // 11~14성: 하락/파괴 가능 구간
    else if (stars <= 14) {
        success = 45 - (stars - 11) * 5;
        keep = 0;
        drop = 100 - success;
        destroy = (stars >= 12) ? 0.6 + (stars - 12) * 0.7 : 0;
        drop -= destroy;
    }
    // 15성: 하락 방지 체크포인트 (기존) -> 2025 개편으로 15성 이상 하락 없음
    else if (stars === 15) {
        success = 30;
        keep = 70 - 2.1;
        drop = 0;
        destroy = 2.1;
    }
    // 16성 이상 (2025 NEXT 개편 반영: 하락 삭제, 파괴 확률 조정)
    else if (stars <= 29) {
        if (stars <= 17) { success = 30; destroy = 2.1; }
        else if (stars <= 20) { success = 15; destroy = (stars === 20) ? 10.5 : 8.5; }
        else if (stars <= 22) { success = (stars === 21) ? 30 : 15; destroy = (stars === 21) ? 10.5 : 12.75; }
        else if (stars <= 25) { success = (stars <= 23) ? 15 : 10; destroy = (stars <= 23) ? 17.0 : 18.0; }
        else { success = Math.max(1, 10 - (stars - 25) * 2); destroy = 19.8; } // 25~30성 추정치
        
        keep = 100 - success - destroy;
        drop = 0;
    }

    // 스타캐치 적용 (성공 확률의 5% 곱연산 증가)
    if (starCatchCheck.checked) {
        success = success * 1.05;
    }

    return { 
        success: parseFloat(success.toFixed(2)), 
        keep: parseFloat(keep.toFixed(2)), 
        drop: parseFloat(drop.toFixed(2)), 
        destroy: parseFloat(destroy.toFixed(2)) 
    };
};

// 2025년 최신 비용 공식 (분모 D 값 조정 반영)
const calculateCost = (stars) => {
    let D = 200;
    if (stars === 17) D = 150;
    else if (stars === 18) D = 70;
    else if (stars === 19) D = 45;
    else if (stars === 21) D = 125;
    
    let cost = 1000 + Math.pow(itemLevel, 3) * Math.pow(stars + 1, 2.7) / (stars >= 10 ? D : 1000);
    
    // 파괴 방지 (2025 개편: 비용 200% 증가, 17성 이상도 가능)
    if (safeguardCheck.checked && stars >= 12) {
        cost *= 2;
    }
    
    return Math.round(cost / 100) * 100;
};

const updateUI = () => {
    const probs = getProbabilities(currentStars);
    currentStarsText.innerText = currentStars;
    successRateText.innerText = probs.success;
    keepRateText.innerText = probs.keep;
    dropRateText.innerText = probs.drop;
    destroyRateText.innerText = probs.destroy;
    upgradeCostText.innerText = calculateCost(currentStars).toLocaleString();
    totalCostText.innerText = totalCost.toLocaleString();
    
    // 별 표시 업데이트 (최대 30성)
    starDisplay.innerHTML = '⭐'.repeat(currentStars) + '☆'.repeat(30 - currentStars);
};

const addLog = (message, type) => {
    const p = document.createElement('p');
    p.className = `log-entry ${type}`;
    p.innerText = `[${currentStars}성 -> ${type === 'success' ? currentStars + 1 : (type === 'destroy' ? 12 : currentStars)}성] ${message}`;
    logBox.prepend(p);
};

upgradeBtn.addEventListener('click', () => {
    if (currentStars >= 30) {
        alert('최대 강화 단계(30성)입니다!');
        return;
    }

    const cost = calculateCost(currentStars);
    totalCost += cost;
    
    const probs = getProbabilities(currentStars);
    const rand = Math.random() * 100;
    
    if (rand < probs.success) {
        addLog('강화 성공!', 'success');
        currentStars++;
    } else if (rand < probs.success + probs.destroy) {
        // 파괴 방지 체크
        if (safeguardCheck.checked && currentStars >= 12) {
            addLog('강화 실패 (파괴 방지 발동 - 유지)', 'keep');
        } else {
            addLog('장비가 파괴되었습니다! (12성으로 복구)', 'destroy');
            totalDestroys++;
            currentStars = 12;
        }
    } else if (rand < probs.success + probs.destroy + probs.drop) {
        addLog('강화 실패 (단계 하락)', 'drop');
        currentStars--;
    } else {
        addLog('강화 실패 (단계 유지)', 'keep');
    }
    
    updateUI();
});

resetBtn.addEventListener('click', () => {
    currentStars = 0;
    totalCost = 0;
    totalDestroys = 0;
    logBox.innerHTML = '<p class="log-entry">2025년 최신 시스템으로 강화를 시작하세요!</p>';
    updateUI();
});

updateUI();
