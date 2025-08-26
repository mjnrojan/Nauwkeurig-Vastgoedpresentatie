document.addEventListener('DOMContentLoaded', () => {

    // --- DYNAMIC HERO SECTION LOADING ---
    async function loadHeroSection() {
        try {
            const response = await fetch('page_content.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            const heroData = data.heroSection;

            document.getElementById('home').style.backgroundImage = `url('${heroData.backgroundImage}')`;
            document.getElementById('hero-title').textContent = heroData.title;
            document.getElementById('hero-subtitle').textContent = heroData.subtitle;
            document.getElementById('hero-button').textContent = heroData.buttonText;

        } catch (error) {
            console.error("Could not load hero content:", error);
        }
    }

    // --- DYNAMIC PORTFOLIO LOADING ---
    async function loadPortfolioItems() {
        try {
            const response = await fetch('portfolio.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const properties = await response.json();
            const portfolioGrid = document.getElementById('portfolio-grid');
            if (!portfolioGrid) return;

            portfolioGrid.innerHTML = ''; // Clear existing content

            properties.forEach(property => {
                const propertyItem = document.createElement('div');
                propertyItem.className = 'bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 animate-on-scroll';
                
                propertyItem.innerHTML = `
                    <img src="${property.image}" alt="${property.imageAlt}" class="w-full h-64 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-gray-800 mb-2 property-title">${property.title}</h3>
                        <p class="text-gray-600 mb-2 property-details">${property.details}</p>
                        <p class="text-gray-700 font-bold text-lg property-price">${property.price}</p>
                        <button class="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full text-sm generate-description-btn">
                            ✨ Generate Description
                        </button>
                    </div>
                `;
                portfolioGrid.appendChild(propertyItem);
            });

            // After adding new items to the DOM, re-initialize event listeners and animations
            initializeEventListeners();
            initializeScrollAnimations();

        } catch (error) {
            console.error("Could not load portfolio items:", error);
            const portfolioGrid = document.getElementById('portfolio-grid');
            if (portfolioGrid) {
                portfolioGrid.innerHTML = '<p class="text-red-500 col-span-full">Failed to load portfolio projects. Please try again later.</p>';
            }
        }
    }

    // --- DYNAMIC GUIDING SECTION LOADING ---
    async function loadGuidingSection() {
        try {
            const response = await fetch('page_content.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            const sectionData = data.guidingSection;
            const container = document.getElementById('guiding-section-container');
            if (!container) return;

            // Build the inner HTML
            container.innerHTML = `
                <h2 class="text-4xl font-bold text-gray-800 mb-12 animate-on-scroll">${sectionData.title}</h2>
                <div class="flex flex-col md:flex-row items-center gap-10">
                    <div class="md:w-1/2 animate-on-scroll animate-delay-100">
                        <img src="${sectionData.image.src}" alt="${sectionData.image.alt}" class="rounded-lg shadow-xl w-full">
                    </div>
                    <div class="md:w-1/2 animate-on-scroll animate-delay-200">
                        ${sectionData.paragraphs.map(p => `<p class="text-lg text-gray-700 leading-relaxed mb-4">${p}</p>`).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error("Could not load guiding section content:", error);
        }
    }

    // --- DYNAMIC TESTIMONIALS LOADING ---
    async function loadTestimonials() {
        try {
            const response = await fetch('testimonials.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const container = document.getElementById('testimonials-container');
            if (!container) return;

            const testimonialsCol = document.createElement('div');
            testimonialsCol.className = 'md:w-1/2 animate-on-scroll animate-delay-100';
            
            data.testimonials.forEach(testimonial => {
                const testimonialEl = document.createElement('div');
                testimonialEl.className = 'bg-stone-50 p-8 rounded-lg shadow-lg mb-6';
                testimonialEl.innerHTML = `
                    <p class="text-gray-700 italic mb-4">"${testimonial.quote}"</p>
                    <p class="font-semibold text-gray-800">- ${testimonial.author}</p>
                `;
                testimonialsCol.appendChild(testimonialEl);
            });

            const imageCol = document.createElement('div');
            imageCol.className = 'md:w-1/2 animate-on-scroll animate-delay-200';
            imageCol.innerHTML = `<img src="${data.sectionImage.src}" alt="${data.sectionImage.alt}" class="rounded-lg shadow-xl w-full">`;

            container.innerHTML = '';
            container.appendChild(testimonialsCol);
            container.appendChild(imageCol);

        } catch (error) {
            console.error("Could not load testimonials:", error);
            const container = document.getElementById('testimonials-container');
            if (container) {
                container.innerHTML = '<p class="text-red-500 col-span-full">Failed to load testimonials.</p>';
            }
        }
    }

    // --- EVENT LISTENER INITIALIZATION (MODAL, GEMINI API) ---
    function initializeEventListeners() {
        const modal = document.getElementById('descriptionModal');
        const closeButton = document.querySelector('.close-button');
        const modalDescription = document.getElementById('modalDescription');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const generateButtons = document.querySelectorAll('.generate-description-btn');
        const apiKey = ''; // This will be set by your Cloudflare Environment Variable

        if (closeButton) {
            closeButton.onclick = () => modal.classList.add('hidden');
        }
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.classList.add('hidden');
            }
        };

        generateButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const card = event.target.closest('.p-6');
                const title = card.querySelector('.property-title').textContent;
                const details = card.querySelector('.property-details').textContent;
                const price = card.querySelector('.property-price').textContent;

                modal.classList.remove('hidden');
                loadingSpinner.classList.remove('hidden');
                modalDescription.innerHTML = '';

                const prompt = `Write a compelling and professional real estate description for a property in the Netherlands. Be creative and engaging. Details: Title: ${title}, Features: ${details}, Price: ${price}.`;

                try {
                    // This is a placeholder for the actual API call logic
                    // In a real scenario, you would fetch from your backend or directly if secured
                    // For now, we simulate a delay and a sample response.
                    console.log("Calling Gemini API with prompt:", prompt);
                    // Replace this with your actual fetch call to Google Gemini API
                    // const response = await fetch(....);
                    // const data = await response.json();
                    // const description = data.candidates[0].content.parts[0].text;

                    // --- SIMULATED RESPONSE ---
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
                    const description = `Discover this exquisite ${title.toLowerCase()}, a true gem in the heart of the Netherlands. Boasting ${details.toLowerCase()}, this property offers a unique blend of comfort and style. Priced at ${price}, it represents an exceptional opportunity for discerning buyers seeking a premium living experience. Don't miss your chance to own a piece of Dutch paradise.`;
                    // --- END SIMULATED RESPONSE ---

                    modalDescription.innerHTML = description.replace(/\n/g, '<br>');

                } catch (error) {
                    console.error('Error calling API:', error);
                    modalDescription.textContent = 'Sorry, we could not generate a description at this time. Please try again later.';
                } finally {
                    loadingSpinner.classList.add('hidden');
                }
            });
        });
    }

    // --- SCROLL ANIMATION ---
    function initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- INITIAL PAGE LOAD ---
    loadHeroSection(); // Load hero content
    loadPortfolioItems(); // Load portfolio first
    loadGuidingSection(); // Load guiding content
    loadTestimonials(); // Load testimonials
    initializeScrollAnimations(); // Initialize animations for elements already on page
});
