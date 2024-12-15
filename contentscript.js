chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getContext") {
        // Grab the surrounding context of the selected text
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const node = range.startContainer;

        const parentText = node.parentElement.innerText || node.textContent || "";
        const contextSnippet = parentText.slice(
            Math.max(0, range.startOffset - 50),
            range.endOffset + 50
        );

        sendResponse({context: contextSnippet});
    }

    if (request.action === "showExplanation") {
        const explanation = request.explanation;
        showTooltip(explanation);
    }

    return true;
});

function showTooltip(text) {
    const tooltip = document.createElement("div");
    tooltip.textContent = text;
    tooltip.style.position = "fixed";
    tooltip.style.bottom = "10px";
    tooltip.style.right = "50%";
    tooltip.style.background = "#333";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "10px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.zIndex = 999999;
    tooltip.style.maxWidth = "300px";

    const closeButton = document.createElement("span");
    closeButton.textContent = "x";
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "10px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "16px";
    closeButton.style.color = "#fff";

    closeButton.addEventListener("click", () => {
        tooltip.remove();
    });

    tooltip.appendChild(closeButton);
    document.body.appendChild(tooltip);
}
