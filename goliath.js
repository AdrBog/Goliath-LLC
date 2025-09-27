const goliathLogo = chrome.runtime.getURL("Goliath.png");
const replacements = {
  "Google": "Goliath",
  "google": "goliath",
  "GOOGLE": "GOLIATH"
};

const goliathLogoClassName = `goliathlogo` + parseInt(Math.random() * 9000) + 1000; // Esto esta mal pero me da pereza volver a empaquetar la extensión
function replaceWordsInTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent;
        for (const [oldWord, newWord] of Object.entries(replacements)) {
            const regex = new RegExp(oldWord, 'gi');
            text = text.replace(regex, newWord);
        }
        node.textContent = text;
    } else {
        node.childNodes.forEach(replaceWordsInTextNodes);
    }
}

function replaceWords() {
	replaceWordsInTextNodes(document.body);
  
	const title = document.title;
	let newTitle = title;

	for (const [oldWord, newWord] of Object.entries(replacements)) {
	const regex = new RegExp(oldWord, 'gi');
	newTitle = newTitle.replace(regex, newWord);
	}

	document.title = newTitle;
  
}

const style = document.createElement("style");
style.textContent = `
	.${goliathLogoClassName}:before, .${goliathLogoClassName}:after {
		content: none !important;
	}
	
	.${goliathLogoClassName} {
		background-image: url("${goliathLogo}");
		background-size: contain;
		background-repeat: no-repeat;
	}
`;
document.body.append(style);

Array.from(
	document.querySelectorAll(`
		img[alt='Google logo'],
		[role="img"][alt="Google logo"],
		img[src^='https://www.google.com/images/branding/googlelogo'],
		img[src^='/logos/doodles/'],	img[src^='//upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg'],
		img[src*="google-logo"],
		span.gb_Xc.gb_fe,
		[value*="google"],[value*="Google"],[value*="GOOGLE"],
		[title*="google"],[title*="Google"],[title*="GOOGLE"],
		svg[role="img"][aria-label="Google logo"],
		source[srcset^='/logos/doodles/'],
		use[href*="google-solid-logo"],
		use[href*="google-color-logo"]
	`)
).forEach(function (tag) {
	const tagName = tag.tagName.toUpperCase();
	if (tagName === "IMG") {
		const width = tag.clientWidth;
		const height = tag.clientHeight;
		tag.width = width;
		tag.height = height;
		tag.src = goliathLogo;
		tag.style.width = width + "px";
		tag.style.height = "auto";
	} else if (tag.classList.contains("gb_Xc")) {
		tag.classList.add(goliathLogoClassName);
	} else if (tagName === "SVG") {
		const width = tag.clientWidth;
		const height = tag.clientHeight;
		const img = document.createElement("img");
		img.setAttribute("width", width);
		img.setAttribute("height", height);
		img.src = goliathLogo;
		img.style.width = width + "px";
		tag.style.height = "auto";
		tag.parentNode.replaceChild(img, tag);
		return;
	} else if (tagName === "USE"){
		const svg = tag.parentNode;
		const width = svg.clientWidth;
		const height = svg.clientHeight;
		const img = document.createElement("img");
		img.setAttribute("width", width);
		img.setAttribute("height", height);
		img.src = goliathLogo;
		img.style.width = width + "px";
		tag.style.height = "auto";
		svg.parentNode.replaceChild(img, svg);
		return;
	} else if (tagName === "SOURCE") {
		tag.remove();
	}
	
	["value", "alt", "title"].forEach(function (attribute) {
		if (tag.hasAttribute(attribute)){
			let text = tag.getAttribute(attribute);
			for (const [oldWord, newWord] of Object.entries(replacements)) {
			  const regex = new RegExp(oldWord, 'gi');
			  text = text.replace(regex, newWord);
			}
			tag.setAttribute(attribute, text);
		}
	});
});

replaceWords();
setTimeout(replaceWords, 1000); // Confia en mi se lo que hago