document.addEventListener('DOMContentLoaded', function() {
    // Scroll animation logic
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });

    // Gemini API Integration for Property Description
    const generateButtons = document.querySelectorAll('.generate-description-btn');
    const descriptionModal = document.getElementById('descriptionModal');
    const modalDescription = document.getElementById('modalDescription');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const closeButton = document.querySelector('.close-button');

    // Function to show the modal
    function showModal() {
        descriptionModal.classList.remove('hidden');
        descriptionModal.classList.add('flex'); // Use flex to center
    }

    // Function to hide the modal
    function hideModal() {
        descriptionModal.classList.add('hidden');
        descriptionModal.classList.remove('flex');
        modalDescription.innerHTML = ''; // Clear content
        loadingSpinner.classList.add('hidden'); // Hide spinner
    }

    // Close modal when close button is clicked
    closeButton.addEventListener('click', hideModal);

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target == descriptionModal) {
            hideModal();
        }
    });

    generateButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const card = this.closest('.bg-white.rounded-lg.shadow-lg');
            const title = card.querySelector('.property-title').textContent;
            const details = card.querySelector('.property-details').textContent;
            const price = card.querySelector('.property-price').textContent;

            // Construct the prompt for the LLM
            const prompt = `Generate a compelling real estate property description (around 100-150 words) for a property with the following details:
            Title: ${title}
            Details: ${details}
            Price: ${price}
            Focus on making it attractive to potential buyers, highlighting key features and lifestyle.`;

            showModal();
            modalDescription.innerHTML = ''; // Clear previous description
            loadingSpinner.classList.remove('hidden'); // Show loading spinner

            try {
                let chatHistory = [];
                chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                const payload = { contents: chatHistory };
                const apiKey = ""; // Leave as-is, Canvas will provide in runtime
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    modalDescription.innerHTML = text; // Display the generated text
                } else {
                    modalDescription.innerHTML = '<p class="text-red-500">Error: Could not generate description. Please try again.</p>';
                    console.error('Gemini API response structure unexpected:', result);
                }
            } catch (error) {
                modalDescription.innerHTML = '<p class="text-red-500">Error generating description. Please check your network connection or try again later.</p>';
                console.error('Error calling Gemini API:', error);
            } finally {
                loadingSpinner.classList.add('hidden'); // Hide loading spinner
            }
        });
    });
});
