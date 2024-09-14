const container = document.getElementById('lineContainer');

function createLine(left, height, bottom) {
    const line = document.createElement('div');
    line.className = 'line';
    line.style.left = `${left-3}%`;
    line.style.height = `${height}%`;
    line.style.bottom = `${bottom+50}%`;
    line.style.animationDelay = `${Math.random() * 4}s`;
    container.appendChild(line);
}

function createCluster(startPos, endPos, count, minHeight, maxHeight, minBottom, maxBottom) {
    const step = (endPos - startPos) / (count - 1);
    for (let i = 0; i < count; i++) {
        const left = startPos + (step * i);
        const height = Math.random() * (maxHeight - minHeight) + minHeight;
        const bottom = Math.random() * (maxBottom - minBottom) + minBottom;
        createLine(left, height, bottom);
    }
}

function spawnClusters() {
    // First cluster: Left bottom
    createCluster(15, 20, 7, 10, 20, -10, 10);

    // Second Cluster: Next
    createCluster(0, 3, 4, 5, 12, 0, 10);

    // Third cluster: Middle, larger
    createCluster(39, 51, 11, 20, 40, 5, 25);

    // Fourth cluster: Top right, even longer
    createCluster(85, 95, 9, 40, 60, 60, 80);

    // Add a few random lines between clusters
    createLine(28, 15, 5);
    createLine(29, 16, 5);
    createLine(65, 30, 40);
    createLine(66, 36, 50);
    createLine(70, 50, 50);
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

