chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "explainWord",
        title: "Explain selected word",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "explainWord") {
        const selectedText = info.selectionText.trim();
        // Send message to content script to fetch surrounding context
        chrome.tabs.sendMessage(tab.id, {action: "getContext", selectedText}, async response => {
            const fullContext = response.context;
            const explanation = await getExplanationFromOpenAI(selectedText, fullContext);

            // Send the explanation back to the content script to display it
            chrome.tabs.sendMessage(tab.id, {action: "showExplanation", explanation});
        });
    }
});

async function getExplanationFromOpenAI(selectedWord, contextText) {
    return new Promise((resolve, reject) => {
        // Retrieve the user's API key
        chrome.storage.local.get("apiKey", async (data) => {
            const apiKey = data.apiKey;

            if (!apiKey) {
                console.error("API key not set!");
                alert("Please enter your OpenAI API key in the extension settings.");
                return reject("API key missing");
            }

            const endpoint = "https://api.openai.com/v1/chat/completions";
            const prompt = `Explain the word \"${selectedWord}\" in the following context: \"${contextText}\". Provide a clear and concise explanation.`;

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o",
                        messages: [{ role: "user", content: prompt }],
                        max_tokens: 150
                    })
                });

                const data = await response.json();
                const explanation = data.choices?.[0]?.message?.content || "No explanation found.";
                resolve(explanation);
            } catch (error) {
                console.error("API request failed:", error);
                reject("API request error");
            }
        });
    });
}