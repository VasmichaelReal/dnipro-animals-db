/* --- JAVASCRIPT ЛОГІКА --- */

const breedsData = {
    'Кіт': ['Безпородний', 'Британська короткошерста', 'Мейн-кун', 'Сфінкс', 'Абіссинська'],
    'Собака': ['Дворняжка', 'Лабрадор', 'Вівчарка', 'Такса', 'Мопс', 'Французький бульдог'],
    'Гризун': ['Морська свинка', 'Хом\'як', 'Пацюк', 'Шиншила'],
    'Птах': ['Папуга хвилястий', 'Корела', 'Канарка', 'Амадіна'],
    'Рептилія': ['Черепаха сухопутна', 'Ящірка еублефар', 'Змія (вуж)']
};

// База доступу для волонтерів
const volunteersDB = [
    { id: 1, email: 'palyanicka@dniproanimal.ua', pass: '2109' },
    { id: 2, email: 'ostapenko@dniproanimal.ua', pass: '2002' },
    { id: 3, email: 'lavrik@dniproanimal.ua', pass: '2411' },
    { id: 4, email: 'michael@dniproanimal.ua', pass: 'xxxx' }
];

let currentAnimalId = null;
let isFilterOpen = false;
let currentUser = null; 
let editingAnimalId = null; 
let uploadedImageBase64 = null; 

let animals = [
    { id: 1, ownerId: 1, type: 'Кіт', breed: 'Мейн-кун', name: 'Мурчик', age: '3 роки', sex: 'Хлопчик', status: 'Вільна', apps: 2, image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80', desc: 'Великий, ласкавий кіт. Любить спати на підвіконні та гратися з м\'ячиком.', sterilized: true },
    { id: 2, ownerId: null, type: 'Собака', breed: 'Лабрадор', name: 'Барон', age: '1 рік', sex: 'Хлопчик', status: 'Вільна', apps: 5, image: 'https://images.unsplash.com/photo-1575425186775-b8de9a427e67?auto=format&fit=crop&w=400&q=80', desc: 'Дуже активний песик, обожнює бігати за палицею та плавати.', sterilized: false },
    { id: 3, ownerId: 1, type: 'Кіт', breed: 'Безпородний', name: 'Сніжинка', age: '2 місяці', sex: 'Дівчинка', status: 'Заброньована', apps: 12, image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=400&q=80', desc: 'Маленьке біле кошеня. Вже привчена до лотка.', sterilized: false },
    { id: 4, ownerId: null, type: 'Собака', breed: 'Дворняжка', name: 'Рекс', age: '5 років', sex: 'Хлопчик', status: 'Вільна', apps: 0, image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=400&q=80', desc: 'Спокійний і мудрий пес. Ідеальний охоронець і вірний друг.', sterilized: true }
];

window.onload = () => {
    updateRoleUI();
    updateHeaderAction();
    renderCatalog(animals, 'catalog-grid');
};

/* Навігація та Хедер */
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');
    window.scrollTo(0, 0);

    if (pageId === 'catalog') {
        renderCatalog(animals, 'catalog-grid');
    } else if (pageId === 'volunteer-catalog') {
        const myAnimals = animals.filter(a => a.ownerId === currentUser.id);
        renderCatalog(myAnimals, 'volunteer-catalog-grid');
    }

    if(pageId === 'catalog' || pageId === 'volunteer-catalog') {
        document.getElementById('form-wrapper').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
    }

    if (isFilterOpen && pageId !== 'catalog') toggleFilter();
    updateHeaderAction(pageId);
}

function updateHeaderAction(pageId = 'catalog') {
    const btn = document.getElementById('header-action-btn');
    const logo = document.getElementById('main-logo');
    
    logo.onclick = () => navigate(currentUser ? 'volunteer-catalog' : 'catalog');

    if (pageId === 'catalog' && !currentUser) {
        btn.style.display = 'block';
        btn.innerText = isFilterOpen ? '✕ Закрити' : 'Фільтри';
        btn.onclick = toggleFilter;
    } else if (pageId === 'volunteer-catalog' && currentUser) {
        btn.style.display = 'block';
        btn.innerText = 'Додати тварину';
        btn.onclick = () => openEditor();
    } else {
        btn.style.display = 'none';
    }
}

/* Авторизація та Ролі */
function handleLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('auth-email').value.trim();
    const passInput = document.getElementById('auth-password').value.trim();

    // Перевірка серед бази 4-х волонтерів
    const foundUser = volunteersDB.find(v => v.email === emailInput && v.pass === passInput);

    if (foundUser) {
        currentUser = { id: foundUser.id };
        document.getElementById('auth-form').reset();
        updateRoleUI();
        navigate('volunteer-catalog');
    } else {
        alert("Помилка! Невірний логін або пароль.");
    }
}

function handleLogout() {
    currentUser = null;
    updateRoleUI();
    navigate('catalog');
}

function updateRoleUI() {
    const btn = document.getElementById('footer-role-btn');
    const title = document.getElementById('footer-role-title');
    const desc = document.getElementById('footer-role-desc');

    if (currentUser) {
        title.innerText = 'Режим перегляду';
        desc.innerText = 'Бажаєте переглянути сайт як відвідувач?';
        btn.innerText = 'Звичайний користувач';
        btn.onclick = handleLogout;
    } else {
        title.innerText = 'Команда';
        desc.innerText = 'Допомагаєте нам рятувати тварин?';
        btn.innerText = 'Волонтер?';
        btn.onclick = () => navigate('auth');
    }
}

/* Кастомні випадаючі списки */
function toggleCustomSelect(itemsId, wrapper, event) {
    if(event) event.stopPropagation();
    closeAllSelects(itemsId);
    document.getElementById(itemsId).classList.toggle('select-show');
    wrapper.querySelector('.select-selected').classList.toggle('select-arrow-active');
}

function selectOption(prefix, value, text, event, mode) {
    if(event) event.stopPropagation();
    
    const inputId = mode === 'filter' ? `${prefix}-filter` : `${prefix}-val`;
    const input = document.getElementById(inputId);
    if (input) input.value = value;
    
    document.getElementById(`${prefix}-selected`).innerHTML = text;
    
    const items = document.getElementById(`${prefix}-items`);
    Array.from(items.children).forEach(child => child.classList.remove('same-as-selected'));
    event.target.classList.add('same-as-selected');
    
    closeAllSelects();

    if (mode === 'filter') {
        if (prefix === 'type') handleTypeFilterChange();
        else updateCatalogList();
    } else if (mode === 'editor') {
        if (prefix === 'editor-type') handleEditorTypeChange(value);
        checkEditorForm();
    }
}

document.addEventListener("click", () => closeAllSelects());

function closeAllSelects(exceptId = null) {
    const items = document.getElementsByClassName("select-items");
    const selected = document.getElementsByClassName("select-selected");
    for (let i = 0; i < items.length; i++) {
        if (items[i].id !== exceptId) {
            items[i].classList.remove("select-show");
            selected[i].classList.remove("select-arrow-active");
        }
    }
}

/* Фільтрація */
function toggleFilter() {
    isFilterOpen = !isFilterOpen;
    document.getElementById('filter-menu').classList.toggle('open');
    updateHeaderAction('catalog');
}

function handleTypeFilterChange() {
    const type = document.getElementById('type-filter').value;
    const breedGroup = document.getElementById('breed-filter-group');
    const breedItems = document.getElementById('breed-items');
    
    breedItems.innerHTML = '<div class="same-as-selected" onclick="selectOption(\'breed\', \'all\', \'Всі породи\', event, \'filter\')">Всі породи</div>';
    document.getElementById('breed-selected').innerHTML = 'Всі породи';
    document.getElementById('breed-filter').value = 'all';

    if (type !== 'all' && breedsData[type]) {
        breedGroup.style.display = 'block';
        breedsData[type].forEach(breed => {
            breedItems.innerHTML += `<div onclick="selectOption('breed', '${breed}', '${breed}', event, 'filter')">${breed}</div>`;
        });
    } else { breedGroup.style.display = 'none'; }
    updateCatalogList();
}

function updateCatalogList() {
    const typeVal = document.getElementById('type-filter').value;
    const breedVal = document.getElementById('breed-filter').value;
    const filtered = animals.filter(a => (typeVal === 'all' || a.type === typeVal) && (breedVal === 'all' || a.breed === breedVal));
    renderCatalog(filtered, 'catalog-grid');
}

function applyFilters() { updateCatalogList(); if(isFilterOpen) toggleFilter(); }


/* Допоміжні функції для тексту (Рід слова та Медицина) */
function getStatusText(status, sex) {
    if (status === 'Вільна') return sex === 'Хлопчик' ? 'Вільний' : 'Вільна';
    if (status === 'Заброньована') return sex === 'Хлопчик' ? 'Заброньований' : 'Заброньована';
    return status;
}

function getSterilizationInfo(animal) {
    if (animal.type !== 'Кіт' && animal.type !== 'Собака') return null;
    return animal.sterilized ? (animal.sex === 'Хлопчик' ? 'Стерилізований' : 'Стерилізована') : (animal.sex === 'Хлопчик' ? 'Не стерилізований' : 'Не стерилізована');
}


/* Відображення карток */
function renderCatalog(data, containerId) {
    const grid = document.getElementById(containerId);
    grid.innerHTML = '';
    
    if (data.length === 0) { 
        grid.innerHTML = '<div class="empty-state-msg">На жаль, за обраними категоріями тварин не знайдено.</div>'; 
        return; 
    }

    data.forEach(animal => {
        const statusClass = animal.status === 'Вільна' ? 'free' : 'booked';
        const displayStatus = getStatusText(animal.status, animal.sex);
        const tooltipAttr = animal.status === 'Заброньована' ? `data-tooltip="Волонтери переглянули заявки на цю тварину і вже обрали їй майбутнього хазяїна"` : '';

        const sterInfo = getSterilizationInfo(animal);
        const sterHtml = sterInfo ? `<p><strong>Медичні дані:</strong> ${sterInfo}</p>` : '';

        const card = document.createElement('div');
        card.className = 'animal-card';
        card.onclick = () => openDetails(animal.id);
        card.innerHTML = `
            <div class="card-image-container"><img src="${animal.image}" alt="${animal.name}"></div>
            <div class="card-content">
                <span class="badge ${statusClass}" ${tooltipAttr}>${displayStatus}</span>
                <h3 class="card-title">${animal.name}</h3>
                <p><strong>Вік:</strong> ${animal.age}</p>
                <p><strong>Стать:</strong> ${animal.sex}</p>
                ${sterHtml}
                <p style="color: #777; margin-top: 10px; font-size: 14px; flex-grow: 1;">${animal.type} • ${animal.breed}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openDetails(id) {
    currentAnimalId = id;
    const animal = animals.find(a => a.id === id);
    const content = document.getElementById('details-content');
    const backBtn = document.getElementById('details-back-btn');
    
    backBtn.onclick = () => navigate(currentUser ? 'volunteer-catalog' : 'catalog');

    const statusClass = animal.status === 'Вільна' ? 'free' : 'booked';
    const displayStatus = getStatusText(animal.status, animal.sex);
    const tooltipAttr = animal.status === 'Заброньована' ? `data-tooltip="Волонтери переглянули заявки на цю тварину і вже обрали їй майбутнього хазяїна"` : '';

    const sterInfo = getSterilizationInfo(animal);
    const sterHtml = sterInfo ? `<div class="stat-row"><strong>Медичні дані:</strong> ${sterInfo}</div>` : '';

    let btnHtml = '';
    if (currentUser && animal.ownerId === currentUser.id) {
        btnHtml = `<button class="primary-btn" onclick="openEditor(${animal.id})">Редагувати</button>`;
    } else {
        btnHtml = animal.status === 'Вільна' ? `<button class="primary-btn" onclick="openForm()">Подати заяву</button>` : `<button class="primary-btn" disabled>Тварина вже заброньована</button>`;
    }

    content.innerHTML = `
        <div class="details-image"><img src="${animal.image}" alt="${animal.name}"></div>
        <div class="details-info">
            <span class="badge ${statusClass}" ${tooltipAttr}>${displayStatus}</span>
            <h2>${animal.name}</h2>
            <div class="stat-row"><strong>Тип:</strong> ${animal.type} (${animal.breed})</div>
            <div class="stat-row"><strong>Вік:</strong> ${animal.age}</div>
            <div class="stat-row"><strong>Стать:</strong> ${animal.sex}</div>
            ${sterHtml}
            <div class="applications-count">🐾 Подано заявок на цю тварину: ${animal.apps}</div>
            <h3 style="margin-top: 25px;">Опис:</h3>
            <p style="line-height: 1.6; margin-top: 15px; margin-bottom: 35px;">${animal.desc}</p>
            ${btnHtml}
        </div>
    `;
    navigate('details');
}

/* Форма юзера */
function openForm() {
    document.getElementById('form-animal-name').innerText = animals.find(a => a.id === currentAnimalId).name;
    document.getElementById('adoption-form').reset();
    checkForm(); 
    navigate('form');
}

function checkForm() {
    const name = document.getElementById('fullName').value.trim(), phone = document.getElementById('phone').value.trim();
    const about = document.getElementById('about').value.trim(), cond = document.getElementById('conditions').value.trim();
    document.getElementById('submit-btn').disabled = !(name && phone && about && cond);
}

document.getElementById('adoption-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('form-wrapper').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';
});

/* Редактор Волонтера */
function openEditor(id = null) {
    editingAnimalId = id;
    document.getElementById('editor-form').reset();
    uploadedImageBase64 = null;
    document.getElementById('editor-photo-preview').style.display = 'none';
    document.getElementById('editor-submit-btn').disabled = true;

    document.getElementById('editor-type-selected').innerText = 'Оберіть тип';
    document.getElementById('editor-type-val').value = '';
    document.getElementById('editor-breed-group').style.display = 'none';
    document.getElementById('editor-breed-val').value = '';
    document.getElementById('editor-sex-selected').innerText = 'Оберіть стать';
    document.getElementById('editor-sex-val').value = '';
    document.getElementById('editor-med-group').style.display = 'none';

    if (id) {
        document.getElementById('editor-title').innerText = 'Редагувати тварину';
        const a = animals.find(x => x.id === id);
        
        document.getElementById('editor-type-selected').innerText = a.type;
        document.getElementById('editor-type-val').value = a.type;
        handleEditorTypeChange(a.type); 

        document.getElementById('editor-breed-selected').innerText = a.breed;
        document.getElementById('editor-breed-val').value = a.breed;

        document.getElementById('editor-sex-selected').innerText = a.sex;
        document.getElementById('editor-sex-val').value = a.sex;

        if (a.type === 'Кіт' || a.type === 'Собака') {
            document.getElementById('editor-med-selected').innerText = a.sterilized ? 'Стерилізований/а' : 'Не стерилізований/а';
            document.getElementById('editor-med-val').value = a.sterilized ? 'true' : 'false';
        }

        document.getElementById('editor-name').value = a.name;
        document.getElementById('editor-name-age').value = a.age;
        document.getElementById('editor-desc').value = a.desc;
        
        uploadedImageBase64 = a.image;
        document.getElementById('editor-photo-preview').src = a.image;
        document.getElementById('editor-photo-preview').style.display = 'block';
    } else {
        document.getElementById('editor-title').innerText = 'Додати тварину';
    }
    navigate('editor');
}

function handleEditorTypeChange(type) {
    const breedGroup = document.getElementById('editor-breed-group');
    const breedItems = document.getElementById('editor-breed-items');
    const medGroup = document.getElementById('editor-med-group');

    document.getElementById('editor-breed-selected').innerText = 'Оберіть породу';
    document.getElementById('editor-breed-val').value = '';

    if (type === 'Кіт' || type === 'Собака') {
        medGroup.style.display = 'block';
    } else {
        medGroup.style.display = 'none';
        document.getElementById('editor-med-val').value = ''; 
    }

    breedItems.innerHTML = '';
    if (type && breedsData[type]) {
        breedGroup.style.display = 'block';
        breedsData[type].forEach(breed => {
            breedItems.innerHTML += `<div onclick="selectOption('editor-breed', '${breed}', '${breed}', event, 'editor')">${breed}</div>`;
        });
    } else { breedGroup.style.display = 'none'; }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            uploadedImageBase64 = evt.target.result;
            document.getElementById('editor-photo-preview').src = uploadedImageBase64;
            document.getElementById('editor-photo-preview').style.display = 'block';
            checkEditorForm();
        }
        reader.readAsDataURL(file);
    }
}

function checkEditorForm() {
    const t = document.getElementById('editor-type-val').value;
    const b = document.getElementById('editor-breed-val').value;
    const n = document.getElementById('editor-name').value.trim();
    const a = document.getElementById('editor-name-age').value.trim();
    const s = document.getElementById('editor-sex-val').value;
    const d = document.getElementById('editor-desc').value.trim();
    
    let m = true;
    if (t === 'Кіт' || t === 'Собака') {
        m = document.getElementById('editor-med-val').value !== '';
    }

    const isValid = t && b && n && a && s && d && uploadedImageBase64 && m;
    document.getElementById('editor-submit-btn').disabled = !isValid;
}

function saveAnimal(e) {
    e.preventDefault();
    
    const newAnimal = {
        id: editingAnimalId ? editingAnimalId : Date.now(),
        ownerId: currentUser.id,
        type: document.getElementById('editor-type-val').value,
        breed: document.getElementById('editor-breed-val').value,
        name: document.getElementById('editor-name').value.trim(),
        age: document.getElementById('editor-name-age').value.trim(),
        sex: document.getElementById('editor-sex-val').value,
        status: editingAnimalId ? animals.find(a=>a.id === editingAnimalId).status : 'Вільна',
        apps: editingAnimalId ? animals.find(a=>a.id === editingAnimalId).apps : 0,
        image: uploadedImageBase64,
        desc: document.getElementById('editor-desc').value.trim(),
        sterilized: document.getElementById('editor-med-val').value === 'true'
    };

    if (editingAnimalId) {
        const index = animals.findIndex(a => a.id === editingAnimalId);
        animals[index] = newAnimal;
    } else {
        animals.unshift(newAnimal);
    }

    openDetails(newAnimal.id);
}