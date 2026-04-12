// DOM Elements
const upgradeBtn = document.getElementById('btn-upgrade');
const resetBtn = document.getElementById('btn-reset');
const starDisplay = document.getElementById('star-display');
const itemNameInput = document.getElementById('item-name-input');
const itemLevelInput = document.getElementById('item-level-input');
const displayItemName = document.getElementById('display-item-name');
const itemIconAnim = document.getElementById('item-icon-anim');
const statusOverlay = document.getElementById('status-overlay');

const successRateText = document.getElementById('success-rate');
const keepRateText = document.getElementById('keep-rate');
const dropRateText = document.getElementById('drop-rate');
const destroyRateText = document.getElementById('destroy-rate');
const upgradeCostText = document.getElementById('upgrade-cost');
const totalCostText = document.getElementById('total-cost');
const logContainer = document.getElementById('upgrade-log');

const statTotalTry = document.getElementById('stat-total-try');
const statTotalDestroy = document.getElementById('stat-total-destroy');
const statMaxStar = document.getElementById('stat-max-star');

const starCatchCheck = document.getElementById('star-catch');
const safeguardCheck = document.getElementById('safeguard');
const event30Check = document.getElementById('event-30');

// State
let currentStars = 0;
let totalCost = 0;
let totalTries = 0;
let totalDestroys = 0;
let maxReachedStars = 0;
let isAnimating = false;

// Initialize Stars
const initStars = () => {
    starDisplay.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star star';
        starDisplay.appendChild(star);
    }
};

const updateStarsUI = () => {
    const stars = starDisplay.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < currentStars) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
};

const getProbabilities = (stars) => {
    let success, keep, drop, destroy;
    
    if (stars <= 10) {
        success = 100 - (stars * 5);
        keep = 100 - success;
        drop = 0; destroy = 0;
    } else if (stars <= 14) {
        success = 45 - (stars - 11) * 5;
        keep = 0;
        drop = 100 - success;
        destroy = (stars >= 12) ? 0.6 + (stars - 12) * 0.7 : 0;
        drop -= destroy;
    } else if (stars === 15) {
        success = 30; keep = 67.9; drop = 0; destroy = 2.1;
    } else if (stars <= 29) {
        // 2025 NEXT 패치: 하락 삭제
        if (stars <= 17) { success = 30; destroy = 2.1; }
        else if (stars <= 20) { success = 15; destroy = (stars === 20) ? 10.5 : 8.5; }
        else if (stars <= 22) { success = (stars === 21) ? 30 : 15; destroy = (stars === 21) ? 10.5 : 12.75; }
        else if (stars <= 25) { success = (stars <= 23) ? 15 : 10; destroy = (stars <= 23) ? 17.0 : 18.0; }
        else { success = Math.max(1, 10 - (stars - 25) * 2); destroy = 19.8; }
        keep = 100 - success - destroy;
        drop = 0;
    }

    if (starCatchCheck.checked) success *= 1.05;

    return { 
        success: parseFloat(success.toFixed(2)), 
        keep: parseFloat(keep.toFixed(2)), 
        drop: parseFloat(drop.toFixed(2)), 
        destroy: parseFloat(destroy.toFixed(2)) 
    };
};

const calculateCost = (stars) => {
    const level = parseInt(itemLevelInput.value);
    let D = 200;
    if (stars === 17) D = 150;
    else if (stars === 18) D = 70;
    else if (stars === 19) D = 45;
    else if (stars === 21) D = 125;
    
    let cost = 1000 + Math.pow(level, 3) * Math.pow(stars + 1, 2.7) / (stars >= 10 ? D : 1000);
    
    if (safeguardCheck.checked && stars >= 12) cost *= 2;
    if (event30Check.checked) cost *= 0.7;
    
    return Math.round(cost / 100) * 100;
};

const updateUI = () => {
    displayItemName.innerText = itemNameInput.value;
    const probs = getProbabilities(currentStars);
    successRateText.innerText = probs.success + '%';
    keepRateText.innerText = probs.keep + '%';
    dropRateText.innerText = probs.drop + '%';
    destroyRateText.innerText = probs.destroy + '%';
    
    upgradeCostText.innerText = calculateCost(currentStars).toLocaleString();
    totalCostText.innerText = totalCost.toLocaleString();
    
    statTotalTry.innerText = totalTries + '회';
    statTotalDestroy.innerText = totalDestroys + '회';
    statMaxStar.innerText = maxReachedStars + '성';
    
    updateStarsUI();
};

const addLog = (msg, type) => {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerText = msg;
    logContainer.prepend(entry);
    if (logContainer.children.length > 50) logContainer.lastChild.remove();
};

upgradeBtn.addEventListener('click', () => {
    if (isAnimating || currentStars >= 30) return;

    const cost = calculateCost(currentStars);
    totalCost += cost;
    totalTries++;
    
    isAnimating = true;
    itemIconAnim.classList.add('anim-shake');
    itemIconAnim.classList.remove('is-destroyed', 'anim-success');
    
    // 연출을 위해 500ms 지연
    setTimeout(() => {
        itemIconAnim.classList.remove('anim-shake');
        const probs = getProbabilities(currentStars);
        const rand = Math.random() * 100;
        
        let resultType = '';
        let logMsg = '';

        if (rand < probs.success) {
            currentStars++;
            if (currentStars > maxReachedStars) maxReachedStars = currentStars;
            resultType = 'success';
            logMsg = `[성공] ${currentStars-1}성 -> ${currentStars}성`;
            itemIconAnim.classList.add('anim-success');
        } else if (rand < probs.success + probs.destroy) {
            if (safeguardCheck.checked && currentStars >= 12) {
                resultType = 'fail';
                logMsg = `[실패] 파괴 방지 발동 (유지)`;
            } else {
                currentStars = 12;
                totalDestroys++;
                resultType = 'destroy';
                logMsg = `[파괴] 장비가 파괴되었습니다 (12성 복구)`;
                itemIconAnim.classList.add('is-destroyed');
            }
        } else if (rand < probs.success + probs.destroy + probs.drop) {
            currentStars--;
            resultType = 'fail';
            logMsg = `[실패] 단계 하락 (${currentStars+1}성 -> ${currentStars}성)`;
        } else {
            resultType = 'fail';
            logMsg = `[실패] 단계 유지 (${currentStars}성)`;
        }

        addLog(logMsg, resultType);
        updateUI();
        isAnimating = false;
    }, 600);
});

resetBtn.addEventListener('click', () => {
    if (confirm('모든 기록을 초기화할까요?')) {
        currentStars = 0;
        totalCost = 0;
        totalTries = 0;
        totalDestroys = 0;
        maxReachedStars = 0;
        logContainer.innerHTML = '<p class="empty-log">초기화되었습니다.</p>';
        itemIconAnim.classList.remove('is-destroyed', 'anim-success', 'anim-shake');
        updateUI();
    }
});

// Sync input name
itemNameInput.addEventListener('input', () => {
    displayItemName.innerText = itemNameInput.value;
});

// Initial Load
initStars();
updateUI();
