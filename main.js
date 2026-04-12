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
const itemLevel = 160;

const getProbabilities = (stars) => {
    let success, keep, drop, destroy;
    
    if (stars <= 10) {
        success = 100 - (stars * 5);
        keep = 100 - success;
        drop = 0;
        destroy = 0;
    } else if (stars <= 15) {
        success = stars === 15 ? 30 : 45 - (stars - 11) * 5;
        keep = 0;
        drop = 100 - success;
        destroy = (stars >= 12) ? (stars === 15 ? 2.1 : 0.6 + (stars - 12) * 0.7) : 0;
        if (stars >= 12) drop -= destroy;
    } else {
        success = 30;
        keep = 0;
        destroy = (stars <= 17) ? 2.1 : (stars <= 19) ? 2.8 : (stars <= 21) ? 7.0 : 10.0;
        drop = 100 - success - destroy;
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

const calculateCost = (stars) => {
    let cost = 1000 + Math.pow(itemLevel, 3) * Math.pow(stars + 1, 2.7) / 10000;
    if (stars >= 10 && stars <= 14) {
        cost = 1000 + Math.pow(itemLevel, 3) * Math.pow(stars + 1, 2.7) / 400;
    } else if (stars >= 15) {
        cost = 1000 + Math.pow(itemLevel, 3) * Math.pow(stars + 1, 2.7) / 200;
    }
    
    // 파괴 방지 (12~16성 구간에서 비용 2배)
    if (safeguardCheck.checked && stars >= 12 && stars <= 16) {
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
    
    // 별 표시 업데이트
    starDisplay.innerHTML = '⭐'.repeat(currentStars) + '☆'.repeat(25 - currentStars);
};

const addLog = (message, type) => {
    const p = document.createElement('p');
    p.className = `log-entry ${type}`;
    p.innerText = `[${currentStars}성 -> ${type === 'success' ? currentStars + 1 : currentStars}성] ${message}`;
    logBox.prepend(p);
};

upgradeBtn.addEventListener('click', () => {
    if (currentStars >= 25) {
        alert('최대 강화 단계입니다!');
        return;
    }

    const cost = calculateCost(currentStars);
    totalCost += cost;
    
    const probs = getProbabilities(currentStars);
    const rand = Math.random() * 100;
    
    if (rand < probs.success) {
        addLog('강화 성공!', 'success');
        currentStars++;
    } else if (rand < probs.success + probs.destroy && !(safeguardCheck.checked && currentStars <= 16)) {
        addLog('장비가 파괴되었습니다! (12성으로 복구)', 'destroy');
        currentStars = 12;
    } else if (rand < probs.success + probs.destroy + probs.drop) {
        if (currentStars > 10 && currentStars % 5 !== 0) {
            addLog('강화 실패 (단계 하락)', 'drop');
            currentStars--;
        } else {
            addLog('강화 실패 (단계 유지)', 'keep');
        }
    } else {
        addLog('강화 실패 (단계 유지)', 'keep');
    }
    
    updateUI();
});

resetBtn.addEventListener('click', () => {
    currentStars = 0;
    totalCost = 0;
    logBox.innerHTML = '<p class="log-entry">강화를 시작하세요!</p>';
    updateUI();
});

// 초기 실행
updateUI();
