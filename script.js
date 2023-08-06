async function fetchData() {
    try {
        const response = await fetch('entries.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

function displayData(entries) {
    entries.forEach((entry) => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('tab-content');

        const title = document.createElement('h2');
        title.innerHTML = entry.name;
        entryDiv.appendChild(title);

        if (entry.description) {
            const description = document.createElement('p');
            description.innerHTML = entry.description;
            entryDiv.appendChild(description);
        }

        if (entry.media && entry.mediaType === 'image' && entry.media !== 'none') {
            const media = document.createElement('img');
            media.setAttribute('src', `media/${entry.media}`);
            media.setAttribute('alt', entry.name);
            entryDiv.appendChild(media);
        }

        const tierTag = document.createElement('p');
        tierTag.textContent = `Tier: ${entry.tier || 'N/A'}`;
        entryDiv.appendChild(tierTag);

        const tags = document.createElement('p');
        tags.classList.add('tags');
        tags.textContent = `Tags: ${entry.tags ? entry.tags.join(', ') : 'N/A'}`;
        entryDiv.appendChild(tags);

        const tierTab = document.getElementById(`tier${entry.tier}`);
        if (tierTab) {
            tierTab.appendChild(entryDiv);
        }
    });
}

function findUniqueTiers(entries) {
    const uniqueTiers = new Set();
    entries.forEach(entry => uniqueTiers.add(entry.tier));
    return Array.from(uniqueTiers).sort();
}

function createTabs(uniqueTiers) {
    const tabsContainer = document.getElementById('tabsContainer');

    uniqueTiers.forEach(tier => {
        const tabLink = document.createElement('div');
        tabLink.classList.add('tab-link');
        tabLink.textContent = `Tier ${tier}`;
        tabLink.setAttribute('data-tab', `tier${tier}`);
        tabsContainer.appendChild(tabLink);

        const tabContent = document.createElement('div');
        tabContent.classList.add('tab');
        tabContent.setAttribute('id', `tier${tier}`);
        document.body.appendChild(tabContent);
    });
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(tabLink => tabLink.classList.remove('active'));

    const selectedTab = document.getElementById(tabName);
    selectedTab.classList.add('active');

    const selectedTabLink = document.querySelector(`[data-tab="${tabName}"]`);
    selectedTabLink.classList.add('active');
}

window.onload = async () => {
    const data = await fetchData();
    const uniqueTiers = findUniqueTiers(data);
    createTabs(uniqueTiers);

    displayData(data);

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', () => {
            const tabName = tabLink.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
};
