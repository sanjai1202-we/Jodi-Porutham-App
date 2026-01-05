// ==================== RESULT IMAGE GENERATOR ====================
// Generate shareable image from results using html2canvas

// Add html2canvas library dynamically
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
document.head.appendChild(script);

// ==================== GENERATE RESULT CARD IMAGE ====================

async function generateResultImage(type = 'couple') {
    try {
        // Show loading
        showNotification('📸 Generating your result card...');

        // Create a styled result card for capture
        const resultCard = createResultCard(type);
        document.body.appendChild(resultCard);

        // Wait for html2canvas to load
        await waitForLibrary('html2canvas');

        // Generate image
        const canvas = await html2canvas(resultCard, {
            backgroundColor: '#1a1a2e',
            scale: 2, // High quality
            logging: false
        });

        // Remove the temporary card
        resultCard.remove();

        // Convert to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jodi-porutham-result-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);

            showNotification('✅ Result card downloaded! Share it with friends!');

            // Also offer to share directly if Web Share API is available
            if (navigator.share && blob) {
                offerDirectShare(blob);
            }
        });

    } catch (error) {
        console.error('Error generating image:', error);
        showNotification('❌ Failed to generate image. Please try again.');
    }
}

// ==================== CREATE STYLED RESULT CARD ====================

function createResultCard(type) {
    const card = document.createElement('div');
    card.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 600px;
        padding: 40px;
        background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
        border-radius: 30px;
        border: 3px solid #ffcf4b;
        font-family: 'Outfit', sans-serif;
        color: white;
    `;

    if (type === 'couple') {
        const maleName = document.getElementById('resultMaleName')?.textContent || '';
        const femaleName = document.getElementById('resultFemaleName')?.textContent || '';
        const score = document.getElementById('lovePercent')?.textContent || '0';
        const remark = document.querySelector('#coupleFunnyRemark .funny-comment')?.textContent || '';

        card.innerHTML = `
            <div style="text-align: center;">
                <h1 style="
                    font-size: 2.5rem;
                    background: linear-gradient(135deg, #ffcf4b 0%, #ff8c00 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 20px;
                    font-weight: 800;
                ">💖 Jodi Porutham</h1>
                
                <div style="font-size: 1.8rem; margin: 20px 0; color: #ffcf4b; font-weight: 700;">
                    ${maleName} & ${femaleName}
                </div>

                <div style="
                    width: 200px;
                    height: 200px;
                    margin: 30px auto;
                    border-radius: 50%;
                    border: 10px solid #ffcf4b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 207, 75, 0.1);
                ">
                    <div style="text-align: center;">
                        <div style="font-size: 4rem; font-weight: 900; color: #ffcf4b;">
                            ${score}%
                        </div>
                        <div style="font-size: 0.9rem; color: #b2becd;">LOVE MATCH</div>
                    </div>
                </div>

                <div style="
                    background: rgba(255, 207, 75, 0.1);
                    padding: 20px;
                    border-radius: 15px;
                    margin: 20px 0;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: #fff;
                ">${remark}</div>

                <div style="margin-top: 30px; font-size: 0.9rem; color: #b2becd;">
                    🌐 jodi-porutham.netlify.app
                </div>
            </div>
        `;
    }

    return card;
}

// ==================== WEB SHARE API ====================

async function offerDirectShare(blob) {
    try {
        const file = new File([blob], 'jodi-porutham-result.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            const shareData = {
                title: 'Jodi Porutham - Love Compatibility',
                text: 'Check out my compatibility result!',
                files: [file]
            };

            const confirmShare = confirm('Would you like to share directly to social media?');
            if (confirmShare) {
                await navigator.share(shareData);
                showNotification('✅ Shared successfully!');
            }
        }
    } catch (error) {
        console.log('Direct share not available or cancelled');
    }
}

// ==================== CONFETTI CELEBRATION ====================

// Add canvas-confetti library
const confettiScript = document.createElement('script');
confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
document.head.appendChild(confettiScript);

async function celebrateHighScore(score) {
    if (score >= 85) {
        await waitForLibrary('confetti');

        // Fire confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const colors = ['#ffcf4b', '#ff8c00', '#1a1a2e', '#0f3460'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Show special message
        if (score >= 95) {
            showNotification('🎉 WOW! Perfect Match! You two are made for each other! 💖');
        } else {
            showNotification('🎊 Amazing! This is a great match! 🌟');
        }
    }
}

// ==================== SMOOTH ANIMATIONS (GSAP-style with native JS) ====================

function animateElement(element, properties, duration = 500) {
    const start = performance.now();
    const startValues = {};

    // Get initial values
    for (const prop in properties) {
        startValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
    }

    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);

        for (const prop in properties) {
            const start = startValues[prop];
            const end = properties[prop];
            const current = start + (end - start) * eased;

            if (prop === 'opacity') {
                element.style.opacity = current;
            } else {
                element.style[prop] = current + 'px';
            }
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// ==================== SCREEN TRANSITION ANIMATIONS ====================

function animateScreenTransition(fromScreen, toScreen) {
    // Fade out current screen
    fromScreen.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    fromScreen.style.opacity = '0';
    fromScreen.style.transform = 'translateX(-50px)';

    setTimeout(() => {
        fromScreen.classList.remove('active');

        // Fade in new screen
        toScreen.classList.add('active');
        toScreen.style.opacity = '0';
        toScreen.style.transform = 'translateX(50px)';

        setTimeout(() => {
            toScreen.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            toScreen.style.opacity = '1';
            toScreen.style.transform = 'translateX(0)';
        }, 50);
    }, 300);
}

// Override the existing showScreen function
const originalShowScreen = window.showScreen;
window.showScreen = function (screenId) {
    const currentScreen = document.querySelector('.screen.active');
    const newScreen = document.getElementById(screenId);

    if (currentScreen && newScreen && currentScreen !== newScreen) {
        animateScreenTransition(currentScreen, newScreen);
    } else {
        // Fallback to original
        if (originalShowScreen) {
            originalShowScreen(screenId);
        }
    }
};

// ==================== UTILITY FUNCTIONS ====================

function waitForLibrary(libName, maxWait = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        function check() {
            if (window[libName]) {
                resolve();
            } else if (Date.now() - startTime > maxWait) {
                reject(new Error(`Library ${libName} failed to load`));
            } else {
                setTimeout(check, 100);
            }
        }

        check();
    });
}

// ==================== SHARE RESULT ENHANCEMENT ====================

// Enhance the existing shareResult function
window.enhancedShareResult = async function () {
    const hasImage = await confirm('Would you like to share as an image? (Recommended)\n\nClick OK for image, Cancel for text only.');

    if (hasImage) {
        // Determine which type of result
        const coupleScreen = document.getElementById('coupleResultsScreen');
        const type = coupleScreen?.classList.contains('active') ? 'couple' : 'solo';
        await generateResultImage(type);
    } else {
        // Use original text sharing
        if (window.shareResult) {
            window.shareResult();
        }
    }
};
