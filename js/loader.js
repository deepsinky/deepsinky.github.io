/* ==========================================
   DeepSINKY AI
   loader.js - PART 1
   Loader Core + Initialization
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       LOADER DOM CACHE
    =========================== */

    const loader = document.getElementById("appLoader");
    const loaderBar = document.getElementById("loaderBar");
    const loaderPercent = document.getElementById("loaderPercent");
    const app = document.getElementById("app");

    /* ===========================
       LOADER STATE
    =========================== */

    const loaderState = {

        active: true,

        progress: 0,

        completed: false,

        startedAt: Date.now(),

        minimumDuration: 1200

    };

    /* ===========================
       VALIDATE LOADER
    =========================== */

    function validateLoader() {

        if (!loader) {

            console.error(
                "DeepSINKY Loader: appLoader not found."
            );

            return false;

        }

        if (!loaderBar) {

            console.warn(
                "DeepSINKY Loader: loaderBar not found."
            );

        }

        if (!loaderPercent) {

            console.warn(
                "DeepSINKY Loader: loaderPercent not found."
            );

        }

        return true;

    }

    /* ===========================
       INITIALIZE LOADER
    =========================== */

    function initializeLoader() {

        if (!validateLoader()) {

            return;

        }

        loaderState.active = true;

        loaderState.progress = 0;

        loaderState.completed = false;

        if (loader) {

            loader.style.display = "flex";

            loader.style.visibility = "visible";

            loader.style.opacity = "1";

            loader.style.pointerEvents = "auto";

        }

        if (loaderBar) {

            loaderBar.style.width = "0%";

        }

        if (loaderPercent) {

            loaderPercent.textContent = "0%";

        }

        if (app) {

            app.style.visibility = "hidden";

        }

    }

    /* ===========================
       INITIALIZE
    =========================== */

    initializeLoader();

    /* ===========================
       PUBLIC LOADER STATE
    =========================== */

    window.DeepSINKY_LOADER = {

        state: loaderState,

        getProgress() {

            return loaderState.progress;

        },

        isActive() {

            return loaderState.active;

        }

    };

});

/* ==========================================
   DeepSINKY AI
   loader.js - PART 2
   Progress Engine
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       DOM CACHE
    =========================== */

    const loader = document.getElementById("appLoader");
    const loaderBar = document.getElementById("loaderBar");
    const loaderPercent =
        document.getElementById("loaderPercent");

    /* ===========================
       EXISTING STATE
    =========================== */

    const state = window.DeepSINKY_LOADER?.state || {

        active: true,

        progress: 0,

        completed: false,

        startedAt: Date.now(),

        minimumDuration: 1200

    };

    /* ===========================
       PROGRESS LIMIT
    =========================== */

    function clampProgress(value) {

        return Math.max(
            0,
            Math.min(
                100,
                Number(value) || 0
            )
        );

    }

    /* ===========================
       SET PROGRESS
    =========================== */

    function setProgress(value) {

        if (!state.active) {

            return;

        }

        const progress =
            clampProgress(value);

        state.progress = progress;

        if (loaderBar) {

            loaderBar.style.width =
                `${progress}%`;

        }

        if (loaderPercent) {

            loaderPercent.textContent =
                `${Math.round(progress)}%`;

        }

    }

    /* ===========================
       INCREASE PROGRESS
    =========================== */

    function increaseProgress(amount = 1) {

        setProgress(
            state.progress + amount
        );

    }

    /* ===========================
       RESET PROGRESS
    =========================== */

    function resetProgress() {

        state.progress = 0;

        state.completed = false;

        setProgress(0);

    }

    /* ===========================
       GET PROGRESS
    =========================== */

    function getProgress() {

        return state.progress;

    }

    /* ===========================
       CHECK COMPLETION
    =========================== */

    function isComplete() {

        return state.progress >= 100;

    }

    /* ===========================
       PUBLIC API
    =========================== */

    window.DeepSINKY_LOADER = {

        ...(window.DeepSINKY_LOADER || {}),

        state,

        setProgress,

        increaseProgress,

        resetProgress,

        getProgress,

        isComplete

    };

});

/* ==========================================
   DeepSINKY AI
   loader.js - PART 3
   Loading Steps Engine
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       LOADER STATE
    =========================== */

    const loaderAPI = window.DeepSINKY_LOADER;

    if (!loaderAPI) {

        console.error(
            "DeepSINKY Loader Core is not initialized."
        );

        return;

    }

    const state = loaderAPI.state;

    /* ===========================
       LOADING STEPS
    =========================== */

    const loadingSteps = [

        {
            id: "initialization",
            progress: 10,
            label: "Initializing application"
        },

        {
            id: "interface",
            progress: 25,
            label: "Loading interface"
        },

        {
            id: "components",
            progress: 40,
            label: "Loading components"
        },

        {
            id: "chat",
            progress: 55,
            label: "Preparing chat engine"
        },

        {
            id: "storage",
            progress: 70,
            label: "Preparing local storage"
        },

        {
            id: "api",
            progress: 85,
            label: "Preparing AI connection"
        },

        {
            id: "finalization",
            progress: 100,
            label: "Finalizing application"
        }

    ];

    /* ===========================
       CURRENT STEP
    =========================== */

    let currentStepIndex = -1;

    /* ===========================
       GET STEPS
    =========================== */

    function getSteps() {

        return loadingSteps.map(
            step => ({ ...step })
        );

    }

    /* ===========================
       GET CURRENT STEP
    =========================== */

    function getCurrentStep() {

        if (
            currentStepIndex < 0 ||
            currentStepIndex >=
            loadingSteps.length
        ) {

            return null;

        }

        return {
            ...loadingSteps[currentStepIndex]
        };

    }

    /* ===========================
       RUN STEP
    =========================== */

    function runStep(index) {

        if (
            index < 0 ||
            index >= loadingSteps.length
        ) {

            return null;

        }

        currentStepIndex = index;

        const step =
            loadingSteps[index];

        if (
            typeof loaderAPI.setProgress ===
            "function"
        ) {

            loaderAPI.setProgress(
                step.progress
            );

        }

        return {
            ...step
        };

    }

    /* ===========================
       RUN NEXT STEP
    =========================== */

    function nextStep() {

        const nextIndex =
            currentStepIndex + 1;

        if (
            nextIndex >=
            loadingSteps.length
        ) {

            return null;

        }

        return runStep(nextIndex);

    }

    /* ===========================
       RESET STEPS
    =========================== */

    function resetSteps() {

        currentStepIndex = -1;

        if (
            typeof loaderAPI.resetProgress ===
            "function"
        ) {

            loaderAPI.resetProgress();

        }

    }

    /* ===========================
       STEP COUNT
    =========================== */

    function getStepCount() {

        return loadingSteps.length;

    }

    /* ===========================
       PUBLIC API
    =========================== */

    window.DeepSINKY_LOADER = {

        ...loaderAPI,

        loadingSteps,

        getSteps,

        getCurrentStep,

        runStep,

        nextStep,

        resetSteps,

        getStepCount

    };

});




/* ==========================================
   DeepSINKY AI
   loader.js - PART 4
   Loading Sequence Engine
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       LOADER API
    =========================== */

    const loaderAPI =
        window.DeepSINKY_LOADER;

    if (!loaderAPI) {

        console.error(
            "DeepSINKY Loader API not found."
        );

        return;

    }

    /* ===========================
       STATE
    =========================== */

    const state =
        loaderAPI.state;

    let sequenceRunning = false;

    let sequenceTimer = null;

    /* ===========================
       STEP DELAY
    =========================== */

    const STEP_DELAY = 280;

    /* ===========================
       RUN SEQUENCE
    =========================== */

    function startSequence() {

        if (sequenceRunning) {

            return;

        }

        sequenceRunning = true;

        if (
            typeof loaderAPI.resetSteps ===
            "function"
        ) {

            loaderAPI.resetSteps();

        }

        runNextStep();

    }

    /* ===========================
       NEXT STEP
    =========================== */

    function runNextStep() {

        if (!sequenceRunning) {

            return;

        }

        const step =
            loaderAPI.nextStep();

        if (!step) {

            sequenceRunning = false;

            sequenceTimer = null;

            return;

        }

        sequenceTimer = setTimeout(
            runNextStep,
            STEP_DELAY
        );

    }

    /* ===========================
       STOP SEQUENCE
    =========================== */

    function stopSequence() {

        sequenceRunning = false;

        if (sequenceTimer !== null) {

            clearTimeout(sequenceTimer);

            sequenceTimer = null;

        }

    }

    /* ===========================
       RESTART SEQUENCE
    =========================== */

    function restartSequence() {

        stopSequence();

        startSequence();

    }

    /* ===========================
       STATUS
    =========================== */

    function isRunning() {

        return sequenceRunning;

    }

    /* ===========================
       PUBLIC API
    =========================== */

    window.DeepSINKY_LOADER = {

        ...loaderAPI,

        startSequence,

        stopSequence,

        restartSequence,

        isRunning

    };

});
/* ==========================================
   DeepSINKY AI
   loader.js - PART 5
   Smooth Progress Animation
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       LOADER API
    =========================== */

    const loaderAPI =
        window.DeepSINKY_LOADER;

    if (!loaderAPI) {

        console.error(
            "DeepSINKY Loader API not found."
        );

        return;

    }

    /* ===========================
       DOM CACHE
    =========================== */

    const loaderBar =
        document.getElementById("loaderBar");

    const loaderPercent =
        document.getElementById("loaderPercent");

    /* ===========================
       ANIMATION STATE
    =========================== */

    let displayedProgress = 0;

    let animationFrame = null;

    /* ===========================
       ANIMATION SETTINGS
    =========================== */

    const animationDuration = 450;

    /* ===========================
       EASING
    =========================== */

    function easeOutCubic(value) {

        return 1 - Math.pow(
            1 - value,
            3
        );

    }

    /* ===========================
       UPDATE VISUALS
    =========================== */

    function updateVisuals(value) {

        const progress =
            Math.max(
                0,
                Math.min(
                    100,
                    value
                )
            );

        if (loaderBar) {

            loaderBar.style.width =
                `${progress}%`;

        }

        if (loaderPercent) {

            loaderPercent.textContent =
                `${Math.round(progress)}%`;

        }

    }

    /* ===========================
       ANIMATE TO VALUE
    =========================== */

    function animateTo(target) {

        const destination =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(target) || 0
                )
            );

        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );

        }

        const start =
            displayedProgress;

        const difference =
            destination - start;

        const startTime =
            performance.now();

        function frame(currentTime) {

            const elapsed =
                currentTime - startTime;

            const rawProgress =
                Math.min(
                    elapsed /
                    animationDuration,
                    1
                );

            const easedProgress =
                easeOutCubic(
                    rawProgress
                );

            displayedProgress =
                start +
                difference *
                easedProgress;

            updateVisuals(
                displayedProgress
            );

            if (rawProgress < 1) {

                animationFrame =
                    requestAnimationFrame(
                        frame
                    );

            } else {

                displayedProgress =
                    destination;

                updateVisuals(
                    displayedProgress
                );

                animationFrame = null;

            }

        }

        animationFrame =
            requestAnimationFrame(
                frame
            );

    }

    /* ===========================
       OVERRIDE SET PROGRESS
    =========================== */

    const originalSetProgress =
        loaderAPI.setProgress;

    function setProgress(value) {

        if (
            typeof originalSetProgress ===
            "function"
        ) {

            originalSetProgress(value);

        }

        animateTo(value);

    }

    /* ===========================
       INITIALIZE
    =========================== */

    displayedProgress =
        loaderAPI.getProgress
            ? loaderAPI.getProgress()
            : 0;

    updateVisuals(
        displayedProgress
    );

    /* ===========================
       PUBLIC API
    =========================== */

    window.DeepSINKY_LOADER = {

        ...loaderAPI,

        setProgress,

        animateTo,

        getDisplayedProgress() {

            return displayedProgress;

        }

    };

});


/* ==========================================
   DeepSINKY AI
   loader.js - PART 6
   Percentage + Loading Status
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       LOADER API
    =========================== */

    const loaderAPI =
        window.DeepSINKY_LOADER;

    if (!loaderAPI) {

        console.error(
            "DeepSINKY Loader API not found."
        );

        return;

    }

    /* ===========================
       DOM CACHE
    =========================== */

    const loaderPercent =
        document.getElementById("loaderPercent");

    const loaderStatus =
        document.getElementById("loaderStatus");

    /* ===========================
       STATUS MAP
    =========================== */

    const statusMap = {

        0: "Initializing",

        10: "Initializing application",

        25: "Loading interface",

        40: "Loading components",

        55: "Preparing chat engine",

        70: "Preparing local storage",

        85: "Preparing AI connection",

        100: "Finalizing application"

    };

    /* ===========================
       UPDATE STATUS
    =========================== */

    function updateStatus(progress) {

        if (!loaderStatus) {

            return;

        }

        const value =
            Math.round(progress);

        const available =
            Object.keys(statusMap)
                .map(Number)
                .filter(
                    step => step <= value
                )
                .pop();

        loaderStatus.textContent =
            statusMap[
                available ?? 0
            ];

    }

    /* ===========================
       UPDATE PERCENTAGE
    =========================== */

    function updatePercentage(progress) {

        if (!loaderPercent) {

            return;

        }

        const value =
            Math.max(
                0,
                Math.min(
                    100,
                    Math.round(progress)
                )
            );

        loaderPercent.textContent =
            `${value}%`;

    }

    /* ===========================
       SYNC DISPLAY
    =========================== */

    function syncDisplay(progress) {

        updatePercentage(progress);

        updateStatus(progress);

    }

    /* ===========================
       INITIAL DISPLAY
    =========================== */

    const initialProgress =
        typeof loaderAPI.getProgress ===
        "function"
            ? loaderAPI.getProgress()
            : 0;

    syncDisplay(initialProgress);

    /* ===========================
       OBSERVE PROGRESS
    =========================== */

    let lastProgress =
        initialProgress;

    const observer =
        setInterval(() => {

            if (
                typeof loaderAPI.getProgress !==
                "function"
            ) {

                return;

            }

            const progress =
                loaderAPI.getProgress();

            if (
                progress !== lastProgress
            ) {

                lastProgress =
                    progress;

                syncDisplay(
                    progress
                );

            }

        }, 50);

    /* ===========================
       CLEANUP
    =========================== */

    function stopStatusObserver() {

        clearInterval(observer);

    }

    /* ===========================
       PUBLIC API
    =========================== */

    window.DeepSINKY_LOADER = {

        ...loaderAPI,

        updateStatus,

        updatePercentage,

        syncDisplay,

        stopStatusObserver

    };

});
/* ==========================================
   DeepSINKY AI
   loader.js - PART 7
   Logo + Visual Animation
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       LOADER API
    =========================== */

    const loaderAPI =
        window.DeepSINKY_LOADER;

    if (!loaderAPI) {

        console.error(
            "DeepSINKY Loader API not found."
        );

        return;

    }

    /* ===========================
       DOM CACHE
    =========================== */

    const loader =
        document.getElementById("appLoader");

    const loaderLogo =
        document.querySelector(
            "#appLoader .loader-logo"
        );

    const loaderContent =
        document.querySelector(
            "#appLoader .loader-content"
        );

    /* ===========================
       ANIMATION STATE
    =========================== */

    let animationEnabled = true;

    /* ===========================
       REDUCE MOTION
    =========================== */

    function prefersReducedMotion() {

        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    }

    /* ===========================
       APPLY MOTION MODE
    =========================== */

    function applyMotionMode() {

        animationEnabled =
            !prefersReducedMotion();

        if (!loader) {

            return;

        }

        if (animationEnabled) {

            loader.classList.remove(
                "reduced-motion"
            );

        } else {

            loader.classList.add(
                "reduced-motion"
            );

        }

    }

    /* ===========================
       LOGO ANIMATION
    =========================== */

    function animateLogo() {

        if (
            !loaderLogo ||
            !animationEnabled
        ) {

            return;

        }

        loaderLogo.classList.remove(
            "loader-logo-active"
        );

        void loaderLogo.offsetWidth;

        loaderLogo.classList.add(
            "loader-logo-active"
        );

    }

    /* ===========================
       CONTENT ANIMATION
    =========================== */

    function animateContent() {

        if (
            !loaderContent ||
            !animationEnabled
        ) {

            return;

        }

        loaderContent.classList.remove(
            "loader-content-active"
        );

        void loaderContent.offsetWidth;

        loaderContent.classList.add(
            "loader-content-active"
        );

    }

    /* ===========================
       START VISUAL ANIMATION
    =========================== */

    function startVisualAnimation() {

        applyMotionMode();

        animateLogo();

        animateContent();

    }

    /* ===========================
       MOTION CHANGE
    =========================== */

    const motionQuery =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    if (
        typeof motionQuery.addEventListener ===
        "function"
    ) {

        motionQuery.addEventListener(
            "change",
            applyMotionMode
        );

    }

    /* ===========================
       INITIALIZE
    =========================== */

    startVisualAnimation();

    /* ===========================
       PUBLIC API
    =========================== */

    window.DeepSINKY_LOADER = {

        ...loaderAPI,

        startVisualAnimation,

        animateLogo,

        animateContent,

        applyMotionMode

    };

});

/* ==========================================
   DeepSINKY AI
   loader.js - PART 8
   Completion + Fade Out + App Reveal
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       LOADER API
    =========================== */

    const loaderAPI =
        window.DeepSINKY_LOADER;

    if (!loaderAPI) {

        console.error(
            "DeepSINKY Loader API not found."
        );

        return;

    }

    /* ===========================
       DOM CACHE
    =========================== */

    const loader =
        document.getElementById("appLoader");

    const app =
        document.getElementById("app");

    /* ===========================
       COMPLETION STATE
    =========================== */

    let completing = false;

    let completed = false;

    /* ===========================
       FADE DURATION
    =========================== */

    const fadeDuration = 600;

    /* ===========================
       REVEAL APP
    =========================== */

    function revealApp() {

        if (!app) {

            return;

        }

        app.style.visibility = "visible";

        app.style.opacity = "1";

        app.style.pointerEvents = "auto";

    }

    /* ===========================
       HIDE LOADER
    =========================== */

    function hideLoader() {

        if (!loader) {

            revealApp();

            return;

        }

        loader.style.transition =
            `opacity ${fadeDuration}ms ease`;

        loader.style.opacity = "0";

        loader.style.pointerEvents =
            "none";

        setTimeout(() => {

            loader.style.display = "none";

            loader.style.visibility =
                "hidden";

            revealApp();

        }, fadeDuration);

    }

    /* ===========================
       COMPLETE LOADER
    =========================== */

    function completeLoader() {

        if (
            completing ||
            completed
        ) {

            return;

        }

        completing = true;

        if (
            typeof loaderAPI.setProgress ===
            "function"
        ) {

            loaderAPI.setProgress(100);

        }

        if (
            typeof loaderAPI.updateStatus ===
            "function"
        ) {

            loaderAPI.updateStatus(100);

        }

        setTimeout(() => {

            completed = true;

            completing = false;

            if (loaderAPI.state) {

                loaderAPI.state.active =
                    false;

                loaderAPI.state.completed =
                    true;

            }

            hideLoader();

        }, 350);

    }

    /* ===========================
       CHECK PROGRESS
    =========================== */

    function checkCompletion() {

        if (
            typeof loaderAPI.getProgress !==
            "function"
        ) {

            return;

        }

        const progress =
            loaderAPI.getProgress();

        if (
            progress >= 100
        ) {

            completeLoader();

        }

    }

    /* ===========================
       COMPLETION OBSERVER
    =========================== */

    const completionObserver =
        setInterval(() => {

            if (completed) {

                clearInterval(
                    completionObserver
                );

                return;

            }

            checkCompletion();

        }, 50);

    /* ===========================
       PUBLIC API
    =========================== */

    window.DeepSINKY_LOADER = {

        ...loaderAPI,

        completeLoader,

        hideLoader,

        revealApp,

        checkCompletion

    };

});



/* ==========================================
   DeepSINKY AI
   loader.js - PART 9
   Error + Timeout Protection
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       LOADER API
    =========================== */

    const loaderAPI =
        window.DeepSINKY_LOADER;

    if (!loaderAPI) {

        console.error(
            "DeepSINKY Loader API not found."
        );

        return;

    }

    /* ===========================
       DOM CACHE
    =========================== */

    const loader =
        document.getElementById("appLoader");

    const loaderStatus =
        document.getElementById("loaderStatus");

    const app =
        document.getElementById("app");

    /* ===========================
       TIMEOUT SETTINGS
    =========================== */

    const MAX_LOADING_TIME = 10000;

    let timeoutTimer = null;

    let errorState = false;

    /* ===========================
       SHOW ERROR STATUS
    =========================== */

    function showLoaderError(message) {

        errorState = true;

        if (loaderStatus) {

            loaderStatus.textContent =
                message || "Loading failed";

        }

        if (loader) {

            loader.classList.add(
                "loader-error"
            );

        }

        console.error(
            "DeepSINKY Loader Error:",
            message
        );

    }

    /* ===========================
       HANDLE TIMEOUT
    =========================== */

    function handleTimeout() {

        if (
            loaderAPI.state &&
            loaderAPI.state.completed
        ) {

            return;

        }

        showLoaderError(
            "Loading is taking longer than expected"
        );

        setTimeout(() => {

            if (
                typeof loaderAPI.setProgress ===
                "function"
            ) {

                loaderAPI.setProgress(100);

            }

            if (
                typeof loaderAPI.completeLoader ===
                "function"
            ) {

                loaderAPI.completeLoader();

            }

        }, 1000);

    }

    /* ===========================
       START TIMEOUT
    =========================== */

    function startTimeoutProtection() {

        stopTimeoutProtection();

        timeoutTimer = setTimeout(
            handleTimeout,
            MAX_LOADING_TIME
        );

    }

    /* ===========================
       STOP TIMEOUT
    =========================== */

    function stopTimeoutProtection() {

        if (timeoutTimer !== null) {

            clearTimeout(
                timeoutTimer
            );

            timeoutTimer = null;

        }

    }

    /* ===========================
       GLOBAL ERROR HANDLER
    =========================== */

    function handleGlobalError(event) {

        if (
            !loaderAPI.state ||
            loaderAPI.state.completed
        ) {

            return;

        }

        showLoaderError(
            "Application initialization error"
        );

    }

    /* ===========================
       PROMISE ERROR HANDLER
    =========================== */

    function handlePromiseError(event) {

        if (
            !loaderAPI.state ||
            loaderAPI.state.completed
        ) {

            return;

        }

        showLoaderError(
            "Application initialization failed"
        );

    }

    /* ===========================
       EVENT LISTENERS
    =========================== */

    window.addEventListener(
        "error",
        handleGlobalError
    );

    window.addEventListener(
        "unhandledrejection",
        handlePromiseError
    );

    /* ===========================
       INITIALIZE
    =========================== */

    startTimeoutProtection();

    /* ===========================
       PUBLIC API
    =========================== */

    window.DeepSINKY_LOADER = {

        ...loaderAPI,

        showLoaderError,

        handleTimeout,

        startTimeoutProtection,

        stopTimeoutProtection,

        hasError() {

            return errorState;

        }

    };

});




