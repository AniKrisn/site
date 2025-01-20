const container = document.getElementById('lineContainer');

function createLine(left, height, bottom, delay) {
    const line = document.createElement('div');
    line.className = 'line';
    line.style.cssText = `left: ${left-3}%; height: ${height}%; bottom: ${bottom+50}%; animation-delay: ${delay}s;`;
    return line;
}

function createCluster(startPos, endPos, count, minHeight, maxHeight, minBottom, maxBottom, fragment) {
    const step = (endPos - startPos) / (count - 1);
    for (let i = 0; i < count; i++) {
        const left = startPos + (step * i);
        const height = Math.random() * (maxHeight - minHeight) + minHeight;
        const bottom = Math.random() * (maxBottom - minBottom) + minBottom;
        const delay = Math.random() * 4;
        fragment.appendChild(createLine(left, height, bottom, delay));
    }
}

function spawnClusters() {
    const fragment = document.createDocumentFragment();

    
    createCluster(15, 20, 7, 10, 20, -10, 10, fragment);
    createCluster(0, 3, 4, 5, 12, 0, 10, fragment);
    createCluster(39, 51, 11, 20, 40, 5, 25, fragment);
    createCluster(85, 95, 9, 40, 60, 60, 80, fragment);


    fragment.appendChild(createLine(28, 15, 5, Math.random() * 4));
    fragment.appendChild(createLine(29, 16, 5, Math.random() * 4));
    fragment.appendChild(createLine(65, 30, 40, Math.random() * 4));
    fragment.appendChild(createLine(66, 36, 50, Math.random() * 4));
    fragment.appendChild(createLine(70, 50, 50, Math.random() * 4));

    container.appendChild(fragment);
}

function handleResize() {
    if (window.innerWidth < 900) {
        container.innerHTML = '';
    }
}

window.addEventListener('resize', handleResize);

if (window.innerWidth > 900) {
    spawnClusters();
}