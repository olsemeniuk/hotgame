function banner(options){
    if (Array.isArray(options)) options = options[Math.floor(Math.random()*options.length)];
    if (typeof options == 'string') {
        options = {name: options/*, chance: 0.5*/};
    }

    if (options.chance) {
        if (options.chance < Math.random()) return;
    }

    let bgUrl = options.bgURL ?? '../i/bonus/banners/bg.jpg';
    if (!options.bgURL && options.name) bgUrl = `../i/bonus/banners/${options.name}/bg.jpg`;
    let logoUrl = options.logoUrl ?? '../i/bonus/banners/logo.png';
    if (!options.logoUrl && options.name) logoUrl = `../i/bonus/banners/${options.name}/logo.png`;
    let textUrl = options.textUrl ?? '../i/bonus/banners/text.png';
    if (!options.textUrl && options.name) textUrl = `../i/bonus/banners/${options.name}/text.png`;

    let v = '';
    if (options.v) {
        v = '?v='+options.v;
        bgUrl += v;
        logoUrl += v;
    }

	let bannerHTML = `
		<div class="hg-block banner ${options.name ?? ''}" style="background-image: url(${bgUrl}${v});">
            <a style="display: block; width: 100%; height: 100%;" href="${options.url ?? 'https://t.me/hotgame_info'}">
                <div class="banner-content-wrapper">
                    <div class="logo-text-wrapper">
                        <img class="banner-logo" src="${logoUrl}${v}" style="max-width: 170px;">
                        <img src="${textUrl}${v}">
                    </div>
                    <div class="banner-social">
                        <img src="../i/bonus/banners/telegram.png${v}">
                    </div>
                </div>                
            </a>
            ${options.style ? '<style>'+options.style+'</style>' : '' }
        </div>
	`;

    if (document.getElementById('prices_block')) {
        document.getElementById('prices_block').insertAdjacentHTML("afterend", bannerHTML);
    }
    else if (document.querySelector('.content-container .result-block')) {
        let resultBlock = document.querySelector('.content-container .result-block');
        if (resultBlock.childElementCount > 6/* && Math.floor(resultBlock.childElementCount / 3) == resultBlock.childElementCount / 3*/) {
            let lines_on_desktop = Math.floor(resultBlock.childElementCount / 3);
            if (Math.floor(lines_on_desktop / 2) != lines_on_desktop / 2) lines_on_desktop--;
            if (options.top) lines_on_desktop = 2;
            let randomNum = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
            let line = randomNum(2, lines_on_desktop);
            if (Math.floor(line / 2) != line / 2) line++;
            resultBlock.children[line*3 - 1].insertAdjacentHTML("afterend", bannerHTML);
        }
    }
}

function decorize(settings){
    let random = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

    let generate_decorize_resources = (resources_type = 'halloween') => {
        let gen = (l, min, max, pos = []) => {
            let r = [];
            for (let i = min; i <= max; i++) {
                r.push({path: `../i/decoration/${resources_type}/${l}${i}.png`, pos: [...pos]});
            }
            return r;
        };
        let resources = [];
        if (resources_type == 'halloween') {
            resources = [
                ...gen('s', 1, 3, ['B_L', 'B_R']),
                ...gen('b', 1, 8, ['B_L', 'B_R']),
                ...gen('g', 1, 6),
                ...gen('p', 1, 7, ['B_L', 'B_R']),
                ...gen('t', 2, 3, ['T_L', 'T_R']),
                {path: `../i/decoration/${resources_type}/t1.png`, pos: ['T_L']},
                {path: `../i/decoration/${resources_type}/t4.png`, pos: ['T_R']},
            ];
        }
        return resources;
    };
    if (!settings.resources && settings.resources_type) settings.resources = generate_decorize_resources(settings.resources_type);

    let num = settings.num;
    if (!num) {
        num = random(settings.min, settings.max);
    }
    if (!num) return;

    let targets = [];
    for (let e of settings.targets) {
        let target = {};
        if (e instanceof Element) target.element = e;
        else if (typeof e === 'string' || e instanceof String) target.element = document.querySelector(e);
        else {
            target = e;
            if (target.path) target.element = document.querySelector(target.path);
        }

        if (!target.element) continue;
        if (!target.pos || !target.pos.length) target.pos = ['T_L', 'T_R', 'B_L', 'B_R'];
        if (!target.count) target.count = 1;
        targets.push(target);
    }
    if (targets.length < 1) return;

    let resources = [];
    for (let e of settings.resources) {
        let resource = {};
        
        if (typeof e === 'string' || e instanceof String) resource.path = e;
        else resource = e;

        if (!resource.pos) resource.pos = ['T_L', 'T_R', 'B_L', 'B_R'];

        resources.push(resource);
    }

    let count = 0;
    while (count < num && resources.length && targets.length) {
        if (resources.length < 1 || targets.length < 1) return;
        let r_i = random(0, resources.length - 1);
        let resource = resources[r_i];
        if (!resource.pos || resource.pos.length < 1) {
            resources.splice(r_i, 1);
            continue;
        }

        let t_i = 0;
        let available_targets = [];
        for ( ; t_i < targets.length; t_i++ ) {
            if ( targets[t_i].pos.some(e => resource.pos.includes(e)) ) {
                available_targets.push(targets[t_i]);
            }
        }
        if (!available_targets.length) {
            resources.splice(r_i, 1);
            continue;
        }

        let a_i = random(0, available_targets.length - 1);
        let target = available_targets[a_i];
        let available_positions = [];
        //console.log('debug', target, a_i, available_targets);
        for (let pos of (target.pos)) {
            if (resource.pos.includes(pos)) available_positions.push(pos);
        }

        let p_i = random(0, available_positions.length - 1);
        let pos = available_positions[p_i];

        target.element.style.backgroundImage = `url(${resource.path})`;
        target.element.style.backgroundRepeat = `no-repeat`;

        if (pos.includes('T')) target.element.style.backgroundPositionY = `top`;
        else target.element.style.backgroundPositionY = `bottom`;

        if (pos.includes('L')) target.element.style.backgroundPositionX = `left`;
        else target.element.style.backgroundPositionX = `right`;

        target.element.style.backgroundSize = `60px`;

        target.count--;
        
        target.pos.splice(target.pos.indexOf(pos), 1);
        if (target.count == 0 || target.pos.length < 1) targets.splice(t_i, 1);
        
        resources.splice(r_i, 1);
        count++;
    }
}



function manageMessageBoxes(){
	let ms = document.querySelectorAll('.message-box');
	
	for (let m of ms) {
		if (m.querySelector('span.cross')) continue;
		let cross = create(null, 'span', 'cross');
		m.prepend(cross);
		cross.innerHTML = '✖';

		cross.addEventListener('click', e => {
			if (m.dataset.messageBox) {
				let closedMessages = window.localStorage.getItem('closedMessageBoxes');
				if (!closedMessages) closedMessages = [];
				closedMessages.push(m.dataset.messageBox);
				window.localStorage.setItem('closedMessageBoxes', closedMessages);
			}
            else if (m.dataset.messageBoxCookie) {
                document.cookie = `${m.dataset.messageBoxCookie}=true; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
            }
			
			m.remove()
		});

		if (m.dataset.messageBox) {
			let closedMessages = window.localStorage.getItem('closedMessageBoxes');
			if (!closedMessages) closedMessages = [];
			if (!closedMessages.includes(m.dataset.messageBox)) m.style.display = 'block';
			else {
                m.style.display = 'none';
                continue;
            }
		}

		if (m.dataset.messageBoxChance) {
			if (!m.dataset.messageBoxChanceGroup) {
				let chance = + m.dataset.messageBoxChance;
				console.log('chance', chance);
				if (chance >= Math.random()) m.style.display = 'block';
			}
			else {
				if (!manageMessageBoxes.chanceGroups) manageMessageBoxes.chanceGroups = {};
				if (!manageMessageBoxes.chanceGroups[m.dataset.messageBoxChanceGroup]) 
					manageMessageBoxes.chanceGroups[m.dataset.messageBoxChanceGroup] = {
						isFired: false,
						chanceSum: 0,
						roll: Math.random()
					};
				if (manageMessageBoxes.chanceGroups[m.dataset.messageBoxChanceGroup].isFired) continue;
				manageMessageBoxes.chanceGroups[m.dataset.messageBoxChanceGroup].chanceSum += +m.dataset.messageBoxChance;
				if (manageMessageBoxes.chanceGroups[m.dataset.messageBoxChanceGroup].chanceSum >= manageMessageBoxes.chanceGroups[m.dataset.messageBoxChanceGroup].roll) {
					manageMessageBoxes.chanceGroups[m.dataset.messageBoxChanceGroup].isFired = true;
					m.style.display = 'block';
				} 
			}
		}
	}
}

function init(){
    manageMessageBoxes();
}

window.addEventListener('load', init);