document.addEventListener('DOMContentLoaded', function() {
    const photo1 = document.getElementById('photo1');
    const photo2 = document.getElementById('photo2');
    const wordsContainer = document.querySelector('.romantic-words');
    const words = document.querySelectorAll('.word');
    const instruction = document.getElementById('instruction');
    let currentStep = 0; // 0: photo1, 1: word1, 2: word2, 3: photo2, 4: word3, 5: word4
    let isAnimating = false;

    const sequence = [
        { type: 'photo', element: photo1 },
        { type: 'word', element: words[0] },
        { type: 'word', element: words[1] },
        { type: 'photo', element: photo2 },
        { type: 'word', element: words[2] },
        { type: 'word', element: words[3] }
       ];

    function showStep(step) {
        if (isAnimating) return;
        isAnimating = true;

        // Hide all
        sequence.forEach(item => {
            if (item.type === 'photo') {
                item.element.style.display = 'none';
                item.element.style.opacity = '0';
                item.element.style.filter = 'blur(10px)';
            } else {
                item.element.classList.remove('visible');
                item.element.style.filter = 'blur(10px)';
            }
        });
        wordsContainer.style.opacity = '0';
        wordsContainer.style.filter = 'blur(10px)';
        wordsContainer.style.transform = 'translateY(20px)';
        instruction.style.opacity = '0'; // Hide instruction

        // Show current
        const current = sequence[step];
        if (current.type === 'photo') {
            current.element.style.display = 'block';
            setTimeout(() => {
                current.element.style.opacity = '1';
                current.element.style.filter = 'blur(0px)';
                if (current.element === photo1) {
                    setTimeout(() => {
                        instruction.style.opacity = '1'; // Show instruction after photo fade in
                    }, 2000); // Delay 2s setelah fade in foto
                }
                isAnimating = false;
            }, 50);
        } else {
            wordsContainer.style.opacity = '1';
            wordsContainer.style.filter = 'blur(0px)';
            wordsContainer.style.transform = 'translateY(0)';
            setTimeout(() => {
                current.element.classList.add('visible');
                current.element.style.filter = 'blur(0px)';
                isAnimating = false;
            }, 50);
        }
    }

    function nextStep() {
        if (currentStep < sequence.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
        // Tidak reset ke awal; tetap di akhir
    }

    function prevStep() {
        currentStep = (currentStep - 1 + sequence.length) % sequence.length;
        showStep(currentStep);
    }

    // Detect swipe up or down
    let startY = 0;
    let endY = 0;

    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', function(e) {
        endY = e.changedTouches[0].clientY;
        const deltaY = startY - endY;
        if (Math.abs(deltaY) > 50) { // Threshold
            if (deltaY > 0) { // Swipe up: next step jika belum akhir
                nextStep();
            } else { // Swipe down: prev step
                prevStep();
            }
        }
    });

    // Fallback for desktop scroll (wheel up/down)
    window.addEventListener('wheel', function(e) {
        if (e.deltaY > 0) { // Scroll down: next step jika belum akhir
            nextStep();
        } else { // Scroll up: prev step
            prevStep();
        }
    });

    // Initial show with opening animation
    setTimeout(() => {
        photo1.style.opacity = '1';
        photo1.style.filter = 'blur(0px)';
        setTimeout(() => {
            instruction.style.opacity = '1'; // Show instruction after photo fade in
        }, 2000); // Delay 2s
    }, 100); // Small delay for smooth start
});