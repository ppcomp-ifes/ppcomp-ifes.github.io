const templateList = document.getElementById("templates");
const includes = [...templateList.querySelectorAll("[data-include]")];
const filters = [...document.querySelectorAll("#filters [data-tag]")];
const emptyMessage = document.getElementById("empty");
const loadError = document.getElementById("load-error");

async function loadTemplates() {
	const results = await Promise.all(includes.map(async (include) => {
		const response = await fetch(include.dataset.include);
		if (!response.ok) throw new Error(`Falha ao carregar ${include.dataset.include}`);
		return response.text();
	}));

	includes.forEach((include, index) => {
		include.outerHTML = results[index];
	});

	connectTemplateActions();
	applyFilters();
}

function applyFilters() {
	const activeTags = filters
		.filter((filter) => filter.classList.contains("btn-success"))
		.map((filter) => filter.dataset.tag);
	const items = [...templateList.querySelectorAll(".accordion-item")];
	let visibleCount = 0;

	items.forEach((item) => {
		const tags = item.dataset.tags.split(" ");
		const visible = activeTags.every((tag) => tags.includes(tag));
		item.classList.toggle("d-none", !visible);
		if (visible) visibleCount += 1;
	});

	emptyMessage.classList.toggle("d-none", visibleCount > 0);
}

function connectTemplateActions() {
	templateList.querySelectorAll(".copy").forEach((button) => {
		button.addEventListener("click", async () => {
			const code = button.closest(".accordion-body").querySelector("pre code").textContent;
			try {
				await navigator.clipboard.writeText(code);
				button.textContent = "Copiado!";
				setTimeout(() => { button.textContent = "Copiar"; }, 1500);
			} catch {
				button.textContent = "Falha ao copiar";
				setTimeout(() => { button.textContent = "Copiar"; }, 1500);
			}
		});
	});
}

filters.forEach((filter) => {
	filter.addEventListener("click", () => {
		filter.classList.toggle("btn-success");
		filter.classList.toggle("btn-outline-success");
		applyFilters();
	});
});

document.getElementById("clear").addEventListener("click", () => {
	filters.forEach((filter) => {
		filter.classList.remove("btn-success");
		filter.classList.add("btn-outline-success");
	});
	applyFilters();
});

loadTemplates().catch((error) => {
	console.error(error);
	loadError.classList.remove("d-none");
});
