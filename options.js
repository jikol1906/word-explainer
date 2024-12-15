document.getElementById("save").addEventListener("click", () => {
    const apiKey = document.getElementById("apiKey").value.trim();

    if (apiKey) {
        // Save the API key to Chrome's storage
        chrome.storage.local.set({apiKey}, () => {
            document.getElementById("status").textContent = "API key saved successfully!";
            setTimeout(() => {
                document.getElementById("status").textContent = "";
            }, 2000);
        });
    } else {
        document.getElementById("status").textContent = "Please enter a valid API key.";
    }
});

// Load the saved API key when the options page opens
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("apiKey", (data) => {
        if (data.apiKey) {
            document.getElementById("apiKey").value = data.apiKey;
        }
    });
});