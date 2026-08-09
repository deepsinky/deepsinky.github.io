
/* ==========================================
   DeepSINKY AI
   script.js - PART 1
   Core Engine + DOM Cache + Loader
========================================== */
alert("script.js loaded");

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    console.log("DeepSINKY AI Started");

    /* ===========================
       DOM CACHE
    =========================== */

    const app = document.getElementById("app");
const loader = document.getElementById("appLoader");

const sidebar = document.getElementById("sidebar");

const chatContainer = document.getElementById("chatContainer");
const promptInput = document.getElementById("promptInput");
const sendBtn = document.getElementById("sendBtn");

const themeBtn = document.getElementById("themeBtn");
const newChatBtn = document.getElementById("newChatBtn");

const chatSearch = document.getElementById("chatSearch");
const toastContainer = document.getElementById("toastContainer");
    /* ===========================
       GLOBAL STATE
    =========================== */

    const state = {

        theme: localStorage.getItem("theme") || "dark",

        loading: true,

        streaming: false,

        chats: [],

        currentChat: null

    };

    /* ===========================
       APPLY THEME
    =========================== */

    if (state.theme === "dark") {

        document.documentElement.classList.add("dark");

    } else {

        document.documentElement.classList.remove("dark");

    }

    /* ===========================
       SHOW APPLICATION
    =========================== */

    function showApplication() {

        if (loader) {

            loader.style.opacity = "0";

            setTimeout(() => {

                loader.style.display = "none";

            }, 500);

        }

        if (app) {

            app.style.display = "flex";

        }

        state.loading = false;

    }

    /* ===========================
       START LOADER
    =========================== */

    setTimeout(showApplication, 1500);

    /* ===========================
       INITIALIZATION COMPLETE
    =========================== */

    console.log("Core Engine Loaded");

});
/* ==========================================
   DeepSINKY AI
   script.js - PART 2
   Sidebar + Navigation + Theme + Search
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       DOM ELEMENTS
    =========================== */
const sidebar = document.getElementById("sidebar");

const sidebarToggle = document.getElementById("menuBtn");

const sidebarClose = document.getElementById("closeSidebarBtn");

const overlay = document.getElementById("overlay");

const navigationItems = document.querySelectorAll(".nav-item");

const searchInput = document.getElementById("chatSearch");

const themeToggle = document.getElementById("themeBtn");

    /* ===========================
       SIDEBAR
    =========================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (overlay) {

            overlay.classList.add("active");

        }

    }

    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (overlay) {

            overlay.classList.remove("active");

        }

    }

    if (sidebarToggle) {

        sidebarToggle.addEventListener("click", openSidebar);

    }

    if (sidebarClose) {

        sidebarClose.addEventListener("click", closeSidebar);

    }

    if (overlay) {

        overlay.addEventListener("click", closeSidebar);

    }

    /* ===========================
       ACTIVE NAVIGATION
    =========================== */

    navigationItems.forEach(item => {

        item.addEventListener("click", () => {

            navigationItems.forEach(nav => {

                nav.classList.remove("active");

            });

            item.classList.add("active");

        });

    });

    /* ===========================
       SEARCH
    =========================== */

    if (searchInput) {

        searchInput.addEventListener("input", event => {

            const keyword = event.target.value
                .trim()
                .toLowerCase();

            navigationItems.forEach(item => {

                const text = item.textContent
                    .toLowerCase();

                if (text.includes(keyword)) {

                    item.style.display = "";

                } else {

                    item.style.display = "none";

                }

            });

        });

    }

    /* ===========================
       THEME
    =========================== */

    function toggleTheme() {

        document.documentElement.classList.toggle("dark");

        const isDark = document.documentElement
            .classList
            .contains("dark");

        localStorage.setItem(

            "theme",

            isDark ? "dark" : "light"

        );

    }

    if (themeToggle) {

        themeToggle.addEventListener(

            "click",

            toggleTheme

        );

    }

    /* ===========================
       ESC KEY
    =========================== */

    document.addEventListener(

        "keydown",

        event => {

            if (event.key === "Escape") {

                closeSidebar();

            }

        }

    );

    /* ===========================
       WINDOW RESIZE
    =========================== */

    window.addEventListener(

        "resize",

        () => {

            if (window.innerWidth > 992) {

                closeSidebar();

            }

        }

    );

});


/* ==========================================
   DeepSINKY AI
   script.js - PART 3
   Chat Engine + Message Rendering
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       DOM CACHE
    =========================== */

    const chatContainer = document.getElementById("chatContainer");

    const chatForm = document.getElementById("chat-form");

    const chatInput = document.getElementById("promptInput");

    const sendButton = document.getElementById("sendBtn");

    /* ===========================
       CHAT STATE
    =========================== */

    const chatState = {

        messages: [],

        streaming: false,

        typing: false

    };

    /* ===========================
       CREATE MESSAGE
    =========================== */

    function createMessage(role, text) {

        const message = document.createElement("div");

        message.className = `chat-message ${role}`;

        const avatar = document.createElement("div");

        avatar.className = "chat-avatar";

        avatar.textContent = role === "user"
            ? "U"
            : "AI";

        const bubble = document.createElement("div");

        bubble.className = "chat-bubble";

        bubble.textContent = text;

        message.appendChild(avatar);

        message.appendChild(bubble);

        return message;

    }

    /* ===========================
       ADD MESSAGE
    =========================== */

    function addMessage(role, text) {

        if (!chatContainer) return;

        const message = createMessage(role, text);

        chatContainer.appendChild(message);

        chatState.messages.push({

            role,

            text,

            time: Date.now()

        });

        scrollToBottom();

    }

    /* ===========================
       SCROLL
    =========================== */

    function scrollToBottom() {

        chatContainer.scrollTo({

            top: chatContainer.scrollHeight,

            behavior: "smooth"

        });

    }

    /* ===========================
       SEND MESSAGE
    =========================== */

    function sendMessage() {

        if (!chatInput) return;

        const text = chatInput.value.trim();

        if (text === "") return;

        addMessage("user", text);

        chatInput.value = "";

        disableInput();

        startThinking();

    }

    /* ===========================
       FORM SUBMIT
    =========================== */

    if (chatForm) {

        chatForm.addEventListener("submit", event => {

            event.preventDefault();

            sendMessage();

        });

    }

    /* ===========================
       ENTER KEY
    =========================== */

    if (chatInput) {

        chatInput.addEventListener("keydown", event => {

            if (

                event.key === "Enter" &&

                !event.shiftKey

            ) {

                event.preventDefault();

                sendMessage();

            }

        });

    }

    /* ===========================
       INPUT CONTROL
    =========================== */

    function disableInput() {

        chatState.typing = true;

        if (chatInput) {

            chatInput.disabled = true;

        }

        if (sendButton) {

            sendButton.disabled = true;

        }

    }

    function enableInput() {

        chatState.typing = false;

        if (chatInput) {

            chatInput.disabled = false;

            chatInput.focus();

        }

        if (sendButton) {

            sendButton.disabled = false;

        }

    }

    /* ===========================
       THINKING PLACEHOLDER
    =========================== */

    function startThinking() {

        chatState.streaming = true;

        const thinking = createMessage(

            "assistant",

            "Thinking..."

        );

        thinking.id = "thinking-message";

        chatContainer.appendChild(thinking);

        scrollToBottom();

    }

    function stopThinking() {

        const thinking = document.getElementById(

            "thinking-message"

        );

        if (thinking) {

            thinking.remove();

        }

        chatState.streaming = false;

    }

});

/* ==========================================
   DeepSINKY AI
   script.js - PART 4
   AI Streaming Engine
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       DOM CACHE
    =========================== */
const chatContainer = document.getElementById("chatContainer");
const chatInput = document.getElementById("promptInput");
const sendButton = document.getElementById("sendBtn");
    
    /* ===========================
       STREAM STATE
    =========================== */

    let streaming = false;

    let currentBubble = null;

    /* ===========================
       CREATE AI MESSAGE
    =========================== */

    function createAIMessage() {

        const wrapper = document.createElement("div");

        wrapper.className = "chat-message assistant";

        const avatar = document.createElement("div");

        avatar.className = "chat-avatar";

        avatar.textContent = "AI";

        const bubble = document.createElement("div");

        bubble.className = "chat-bubble ai-streaming";

        wrapper.appendChild(avatar);

        wrapper.appendChild(bubble);

        chatContainer.appendChild(wrapper);

        chatContainer.scrollTop = chatContainer.scrollHeight;

        return bubble;

    }

    /* ===========================
       STREAM TEXT
    =========================== */

    async function streamText(text) {

        streaming = true;

        currentBubble = createAIMessage();

        currentBubble.innerHTML = "";

        const cursor = document.createElement("span");

        cursor.className = "ai-cursor";

        currentBubble.appendChild(cursor);

        for (let i = 0; i < text.length; i++) {

            if (!streaming) {

                break;

            }

            cursor.insertAdjacentText(

                "beforebegin",

                text.charAt(i)

            );

            chatContainer.scrollTop =

                chatContainer.scrollHeight;

            await sleep(getTypingDelay(text.charAt(i)));

        }

        cursor.remove();

        streaming = false;

        enableInput();

    }

    /* ===========================
       TYPING SPEED
    =========================== */

    function getTypingDelay(character) {

        if (

            character === "." ||

            character === "," ||

            character === "!" ||

            character === "?"

        ) {

            return 60;

        }

        if (

            character === " "

        ) {

            return 8;

        }

        return 18;

    }

    /* ===========================
       STOP STREAM
    =========================== */

    function stopStreaming() {

        streaming = false;

    }

    /* ===========================
       SLEEP
    =========================== */

    function sleep(ms) {

        return new Promise(resolve => {

            setTimeout(resolve, ms);

        });

    }

    /* ===========================
       ENABLE INPUT
    =========================== */

    function enableInput() {

        if (chatInput) {

            chatInput.disabled = false;

            chatInput.focus();

        }

        if (sendButton) {

            sendButton.disabled = false;

        }

    }

    /* ===========================
       DEMO
    =========================== */

    window.DeepSINKY = {

        streamText,

        stopStreaming

    };

});

/* ==========================================
   DeepSINKY AI
   script.js - PART 5
   API Engine + Streaming Integration
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       CONFIGURATION
    =========================== */

    const API_URL = "https://YOUR_SERVER_URL/chat";

    /* ===========================
       DOM CACHE
    =========================== */

    const chatInput = document.getElementById("promptInput");
const sendButton = document.getElementById("sendBtn");

    /* ===========================
       REQUEST STATE
    =========================== */

    let controller = null;

    let generating = false;

    /* ===========================
       SEND TO API
    =========================== */

    async function sendToAPI(message) {

        if (generating) return;

        generating = true;

        controller = new AbortController();

        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    message: message

                }),

                signal: controller.signal

            });

            if (!response.ok) {

                throw new Error(

                    "Server Error"

                );

            }

            const data = await response.json();

            if (!data.reply) {

                throw new Error(

                    "Invalid Response"

                );

            }

            stopThinking();

            await DeepSINKY.streamText(

                data.reply

            );

        }

        catch (error) {

            stopThinking();

            showError(

                error.message

            );

        }

        finally {

            generating = false;

            controller = null;

        }

    }

    /* ===========================
       STOP GENERATION
    =========================== */

    function stopGeneration() {

        if (controller) {

            controller.abort();

        }

        DeepSINKY.stopStreaming();

        generating = false;

    }

    /* ===========================
       ERROR MESSAGE
    =========================== */

    function showError(message) {

        const text =

            "Error : " + message;

        DeepSINKY.streamText(text);

    }

    /* ===========================
       DISABLE INPUT
    =========================== */

    function disableInput() {

        if (chatInput) {

            chatInput.disabled = true;

        }

        if (sendButton) {

            sendButton.disabled = true;

        }

    }

    /* ===========================
       ENABLE INPUT
    =========================== */

    function enableInput() {

        if (chatInput) {

            chatInput.disabled = false;

            chatInput.focus();

        }

        if (sendButton) {

            sendButton.disabled = false;

        }

    }

    /* ===========================
       PUBLIC METHODS
    =========================== */

    window.DeepSINKY_API = {

        send: sendToAPI,

        stop: stopGeneration,

        enable: enableInput,

        disable: disableInput

    };

});
/* ==========================================
   DeepSINKY AI
   script.js - PART 6
   Memory + Chat History + Local Storage
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       STORAGE KEYS
    =========================== */

    const STORAGE = {

        chats: "deepsinky_chats",

        current: "deepsinky_current_chat",

        settings: "deepsinky_settings"

    };

    /* ===========================
       CHAT MEMORY
    =========================== */

    let chats = [];

    let currentChat = null;

    /* ===========================
       CREATE CHAT
    =========================== */

    function createChat() {

        const chat = {

            id: Date.now().toString(),

            title: "New Chat",

            created: new Date().toISOString(),

            updated: new Date().toISOString(),

            messages: []

        };

        chats.unshift(chat);

        currentChat = chat.id;

        saveChats();

        return chat;

    }

    /* ===========================
       GET CURRENT CHAT
    =========================== */

    function getCurrentChat() {

        return chats.find(

            chat => chat.id === currentChat

        );

    }

    /* ===========================
       ADD MESSAGE
    =========================== */

    function saveMessage(role, content) {

        let chat = getCurrentChat();

        if (!chat) {

            chat = createChat();

        }

        chat.messages.push({

            id: Date.now(),

            role,

            content,

            time: new Date().toISOString()

        });

        chat.updated = new Date().toISOString();

        if (

            role === "user" &&

            chat.messages.length === 1

        ) {

            chat.title =

                content.substring(0, 40);

        }

        saveChats();

    }

    /* ===========================
       SAVE STORAGE
    =========================== */

    function saveChats() {

        localStorage.setItem(

            STORAGE.chats,

            JSON.stringify(chats)

        );

        localStorage.setItem(

            STORAGE.current,

            currentChat

        );

    }

    /* ===========================
       LOAD STORAGE
    =========================== */

    function loadChats() {

        const savedChats =

            localStorage.getItem(

                STORAGE.chats

            );

        const savedCurrent =

            localStorage.getItem(

                STORAGE.current

            );

        if (savedChats) {

            chats = JSON.parse(savedChats);

        }

        if (savedCurrent) {

            currentChat = savedCurrent;

        }

        if (

            chats.length === 0

        ) {

            createChat();

        }

    }

    /* ===========================
       DELETE CHAT
    =========================== */

    function deleteChat(chatId) {

        chats = chats.filter(

            chat => chat.id !== chatId

        );

        if (

            currentChat === chatId

        ) {

            if (

                chats.length > 0

            ) {

                currentChat = chats[0].id;

            } else {

                createChat();

            }

        }

        saveChats();

    }

    /* ===========================
       RENAME CHAT
    =========================== */

    function renameChat(chatId, title) {

        const chat = chats.find(

            item => item.id === chatId

        );

        if (!chat) return;

        chat.title = title.trim();

        chat.updated =

            new Date().toISOString();

        saveChats();

    }

    /* ===========================
       CLEAR HISTORY
    =========================== */

    function clearHistory() {

        chats = [];

        currentChat = null;

        localStorage.removeItem(

            STORAGE.chats

        );

        localStorage.removeItem(

            STORAGE.current

        );

        createChat();

    }

    /* ===========================
       EXPORT CHAT
    =========================== */

    function exportChats() {

        return JSON.stringify(

            chats,

            null,

            2

        );

    }

    /* ===========================
       IMPORT CHAT
    =========================== */

    function importChats(data) {

        try {

            chats = JSON.parse(data);

            currentChat = chats[0].id;

            saveChats();

        }

        catch {

            console.error(

                "Invalid Chat File"

            );

        }

    }

    /* ===========================
       INITIALIZE
    =========================== */

    loadChats();

    /* ===========================
       PUBLIC METHODS
    =========================== */

    window.DeepSINKY_MEMORY = {

        createChat,

        saveMessage,

        getCurrentChat,

        deleteChat,

        renameChat,

        clearHistory,

        exportChats,

        importChats

    };

});


/* ==========================================
   DeepSINKY AI
   script.js - PART 7
   Settings + Theme + User Preferences
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       STORAGE KEY
    =========================== */

    const SETTINGS_KEY = "deepsinky_settings";

    /* ===========================
       DEFAULT SETTINGS
    =========================== */

    const defaultSettings = {

        theme: "dark",

        language: "en",

        fontSize: "16",

        animations: true,

        sound: false,

        autoScroll: true,

        markdown: true,

        codeHighlight: true,

        enterToSend: true,

        saveHistory: true

    };

    /* ===========================
       SETTINGS
    =========================== */

    let settings = {

        ...defaultSettings

    };

    /* ===========================
       LOAD SETTINGS
    =========================== */

    function loadSettings() {

        const saved = localStorage.getItem(

            SETTINGS_KEY

        );

        if (saved) {

            settings = {

                ...settings,

                ...JSON.parse(saved)

            };

        }

        applySettings();

    }

    /* ===========================
       SAVE SETTINGS
    =========================== */

    function saveSettings() {

        localStorage.setItem(

            SETTINGS_KEY,

            JSON.stringify(settings)

        );

    }

    /* ===========================
       APPLY SETTINGS
    =========================== */

    function applySettings() {

        applyTheme();

        applyFontSize();

        applyAnimation();

    }

    /* ===========================
       THEME
    =========================== */

    function applyTheme() {

        document.documentElement.classList.remove(

            "dark",

            "light"

        );

        document.documentElement.classList.add(

            settings.theme

        );

    }

    function toggleTheme() {

        settings.theme =

            settings.theme === "dark"

                ? "light"

                : "dark";

        applyTheme();

        saveSettings();

    }

    /* ===========================
       FONT SIZE
    =========================== */

    function applyFontSize() {

        document.documentElement.style.fontSize =

            settings.fontSize + "px";

    }

    function setFontSize(size) {

        settings.fontSize = size;

        applyFontSize();

        saveSettings();

    }

    /* ===========================
       ANIMATION
    =========================== */

    function applyAnimation() {

        if (settings.animations) {

            document.body.classList.remove(

                "reduce-motion"

            );

        }

        else {

            document.body.classList.add(

                "reduce-motion"

            );

        }

    }

    function toggleAnimation() {

        settings.animations =

            !settings.animations;

        applyAnimation();

        saveSettings();

    }

    /* ===========================
       SOUND
    =========================== */

    function toggleSound() {

        settings.sound =

            !settings.sound;

        saveSettings();

    }

    /* ===========================
       AUTO SCROLL
    =========================== */

    function toggleAutoScroll() {

        settings.autoScroll =

            !settings.autoScroll;

        saveSettings();

    }

    /* ===========================
       MARKDOWN
    =========================== */

    function toggleMarkdown() {

        settings.markdown =

            !settings.markdown;

        saveSettings();

    }

    /* ===========================
       CODE HIGHLIGHT
    =========================== */

    function toggleHighlight() {

        settings.codeHighlight =

            !settings.codeHighlight;

        saveSettings();

    }

    /* ===========================
       ENTER TO SEND
    =========================== */

    function toggleEnterSend() {

        settings.enterToSend =

            !settings.enterToSend;

        saveSettings();

    }

    /* ===========================
       RESET
    =========================== */

    function resetSettings() {

        settings = {

            ...defaultSettings

        };

        applySettings();

        saveSettings();

    }

    /* ===========================
       INITIALIZE
    =========================== */

    loadSettings();

    /* ===========================
       PUBLIC METHODS
    =========================== */

    window.DeepSINKY_SETTINGS = {

        get() {

            return settings;

        },

        toggleTheme,

        setFontSize,

        toggleAnimation,

        toggleSound,

        toggleAutoScroll,

        toggleMarkdown,

        toggleHighlight,

        toggleEnterSend,

        resetSettings

    };

});

/* ==========================================
   DeepSINKY AI
   script.js - PART 8
   Animation Engine + Toast + Loader + Ripple
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       DOM CACHE
    =========================== */

    const loader = document.getElementById("app-loader");

    const toastContainer = document.getElementById("toast-container");

    /* ===========================
       LOADER
    =========================== */

    function showLoader() {

        if (!loader) return;

        loader.classList.remove("hidden");

        loader.style.display = "flex";

    }

    function hideLoader() {

        if (!loader) return;

        loader.classList.add("hidden");

        setTimeout(() => {

            loader.style.display = "none";

        }, 300);

    }

    /* ===========================
       TOAST
    =========================== */

    function showToast(message, type = "info") {

        if (!toastContainer) return;

        const toast = document.createElement("div");

        toast.className = `toast ${type}`;

        toast.textContent = message;

        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {

            toast.classList.add("show");

        });

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 3000);

    }

    /* ===========================
       RIPPLE EFFECT
    =========================== */

    function createRipple(event) {

        const button = event.currentTarget;

        const ripple = document.createElement("span");

        ripple.className = "ripple";

        const rect = button.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);

        ripple.style.width = size + "px";

        ripple.style.height = size + "px";

        ripple.style.left =

            event.clientX - rect.left - size / 2 + "px";

        ripple.style.top =

            event.clientY - rect.top - size / 2 + "px";

        button.appendChild(ripple);

        ripple.addEventListener("animationend", () => {

            ripple.remove();

        });

    }

    /* ===========================
       ENABLE RIPPLE
    =========================== */

    document.querySelectorAll(

        "button,.btn"

    ).forEach(button => {

        button.addEventListener(

            "click",

            createRipple

        );

    });

    /* ===========================
       FADE IN
    =========================== */

    function fadeIn(element) {

        if (!element) return;

        element.classList.remove("fade-out");

        element.classList.add("fade-in");

    }

    /* ===========================
       FADE OUT
    =========================== */

    function fadeOut(element) {

        if (!element) return;

        element.classList.remove("fade-in");

        element.classList.add("fade-out");

    }

    /* ===========================
       SCALE
    =========================== */

    function scaleIn(element) {

        if (!element) return;

        element.classList.add("scale-in");

    }

    /* ===========================
       SHAKE
    =========================== */

    function shake(element) {

        if (!element) return;

        element.classList.add("error-shake");

        element.addEventListener(

            "animationend",

            () => {

                element.classList.remove(

                    "error-shake"

                );

            },

            {

                once: true

            }

        );

    }

    /* ===========================
       SCROLL
    =========================== */

    function smoothScroll(container) {

        if (!container) return;

        container.scrollTo({

            top: container.scrollHeight,

            behavior: "smooth"

        });

    }

    /* ===========================
       PUBLIC METHODS
    =========================== */

    window.DeepSINKY_ANIMATION = {

        showLoader,

        hideLoader,

        showToast,

        fadeIn,

        fadeOut,

        scaleIn,

        shake,

        smoothScroll

    };

});

/* ==========================================
   DeepSINKY AI
   script.js - PART 9
   Utilities + Keyboard Shortcuts + Clipboard
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       DEVICE INFORMATION
    =========================== */

    const Device = {

        isMobile() {

            return window.innerWidth <= 768;

        },

        isTablet() {

            return window.innerWidth > 768 &&

                   window.innerWidth <= 1024;

        },

        isDesktop() {

            return window.innerWidth > 1024;

        }

    };

    /* ===========================
       KEYBOARD SHORTCUTS
    =========================== */

    document.addEventListener("keydown", event => {

        if (

            event.ctrlKey &&

            event.key.toLowerCase() === "k"

        ) {

            event.preventDefault();

            const search = document.getElementById(

                "search-input"

            );

            if (search) {

                search.focus();

            }

        }

        if (

            event.ctrlKey &&

            event.key.toLowerCase() === "n"

        ) {

            event.preventDefault();

            if (

                window.DeepSINKY_MEMORY

            ) {

                window.DeepSINKY_MEMORY.createChat();

            }

        }

    });

    /* ===========================
       COPY
    =========================== */

    async function copyText(text) {

        try {

            await navigator.clipboard.writeText(

                text

            );

            if (

                window.DeepSINKY_ANIMATION

            ) {

                window.DeepSINKY_ANIMATION

                .showToast(

                    "Copied Successfully",

                    "success"

                );

            }

        }

        catch {

            console.error(

                "Copy Failed"

            );

        }

    }

    /* ===========================
       DOWNLOAD FILE
    =========================== */

    function downloadFile(

        filename,

        content

    ) {

        const blob = new Blob(

            [content],

            {

                type:

                "text/plain"

            }

        );

        const url = URL.createObjectURL(

            blob

        );

        const link =

            document.createElement("a");

        link.href = url;

        link.download = filename;

        document.body.appendChild(

            link

        );

        link.click();

        link.remove();

        URL.revokeObjectURL(

            url

        );

    }

    /* ===========================
       FULLSCREEN
    =========================== */

    async function toggleFullscreen() {

        if (

            !document.fullscreenElement

        ) {

            await document

                .documentElement

                .requestFullscreen();

        }

        else {

            await document

                .exitFullscreen();

        }

    }

    /* ===========================
       FORMAT DATE
    =========================== */

    function formatDate(date) {

        return new Date(date)

            .toLocaleString();

    }

    /* ===========================
       UNIQUE ID
    =========================== */

    function uniqueId() {

        return

        "id_" +

        Date.now() +

        "_" +

        Math.random()

        .toString(36)

        .substring(2,10);

    }

    /* ===========================
       DEBOUNCE
    =========================== */

    function debounce(

        callback,

        delay = 300

    ) {

        let timer;

        return (...args) => {

            clearTimeout(timer);

            timer = setTimeout(

                () => {

                    callback(...args);

                },

                delay

            );

        };

    }

    /* ===========================
       THROTTLE
    =========================== */

    function throttle(

        callback,

        limit = 200

    ) {

        let waiting = false;

        return (...args) => {

            if (waiting) return;

            callback(...args);

            waiting = true;

            setTimeout(() => {

                waiting = false;

            }, limit);

        };

    }

    /* ===========================
       NETWORK STATUS
    =========================== */

    window.addEventListener(

        "online",

        () => {

            DeepSINKY_ANIMATION

            ?.showToast(

                "Connection Restored",

                "success"

            );

        }

    );

    window.addEventListener(

        "offline",

        () => {

            DeepSINKY_ANIMATION

            ?.showToast(

                "No Internet Connection",

                "error"

            );

        }

    );

    /* ===========================
       PUBLIC METHODS
    =========================== */

    window.DeepSINKY_UTILS = {

        Device,

        copyText,

        downloadFile,

        toggleFullscreen,

        formatDate,

        uniqueId,

        debounce,

        throttle

    };

});



/* ==========================================
   DeepSINKY AI
   script.js - PART 10 (FINAL)
   Application Initialization
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       APPLICATION
    =========================== */

    const DeepSINKY = {

        version: "1.0.0",

        initialized: false,

        startTime: Date.now()

    };

    /* ===========================
       MODULE CHECK
    =========================== */

    function checkModules() {

        const modules = [

            "DeepSINKY",

            "DeepSINKY_API",

            "DeepSINKY_MEMORY",

            "DeepSINKY_SETTINGS",

            "DeepSINKY_ANIMATION",

            "DeepSINKY_UTILS"

        ];

        modules.forEach(name => {

            if (

                window[name] === undefined

            ) {

                console.warn(

                    name +

                    " Module Not Loaded"

                );

            }

        });

    }

    /* ===========================
       INITIALIZE
    =========================== */

    function initialize() {

        if (

            DeepSINKY.initialized

        ) {

            return;

        }

        checkModules();

        initializeEvents();

        initializeTheme();

        initializeMemory();

        initializeAnimations();

        initializeApplication();

        DeepSINKY.initialized = true;

    }

    /* ===========================
       EVENTS
    =========================== */

    function initializeEvents() {

        window.addEventListener(

            "beforeunload",

            saveApplication

        );

    }

    /* ===========================
       THEME
    =========================== */

    function initializeTheme() {

        if (

            window.DeepSINKY_SETTINGS

        ) {

            const settings =

                window

                .DeepSINKY_SETTINGS

                .get();

            document.documentElement.classList.add(

                settings.theme

            );

        }

    }

    /* ===========================
       MEMORY
    =========================== */

    function initializeMemory() {

        if (

            window.DeepSINKY_MEMORY

        ) {

            window

            .DeepSINKY_MEMORY

            .getCurrentChat();

        }

    }

    /* ===========================
       ANIMATION
    =========================== */

    function initializeAnimations() {

        if (

            window.DeepSINKY_ANIMATION

        ) {

            window

            .DeepSINKY_ANIMATION

            .hideLoader();

        }

    }

    /* ===========================
       APPLICATION READY
    =========================== */

    function initializeApplication() {

        const app =

            document.getElementById(

                "app"

            );

        if (

            app

        ) {

            app.style.display =

                "flex";

        }

    }

    /* ===========================
       SAVE
    =========================== */

    function saveApplication() {

        if (

            window.DeepSINKY_MEMORY

        ) {

            console.log(

                "Saving Chat History"

            );

        }

    }

    /* ===========================
       ERROR HANDLER
    =========================== */

    window.addEventListener(

        "error",

        event => {

            console.error(

                "Application Error:",

                event.message

            );

        }

    );

    /* ===========================
       PROMISE ERROR
    =========================== */

    window.addEventListener(

        "unhandledrejection",

        event => {

            console.error(

                "Unhandled Promise:",

                event.reason

            );

        }

    );

    /* ===========================
       START
    =========================== */

    initialize();

    /* ===========================
       GLOBAL
    =========================== */

    window.DeepSINKY_APP = {

        version() {

            return DeepSINKY.version;

        },

        uptime() {

            return (

                Date.now()

                -

                DeepSINKY.startTime

            );

        },

        restart() {

            location.reload();

        }

    };

});

