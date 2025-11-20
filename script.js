// Event Registration Form JavaScript
console.log('Event Registration Form loaded');

// Dark mode functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const toggleIcon = document.querySelector('.toggle-icon');

// Initialize dark mode from localStorage
function initializeDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateToggleIcon(savedTheme);
    } else {
        // Default to light mode
        body.setAttribute('data-theme', 'light');
        updateToggleIcon('light');
    }
}

// Update toggle icon based on theme
function updateToggleIcon(theme) {
    if (theme === 'dark') {
        toggleIcon.textContent = '☀️';
    } else {
        toggleIcon.textContent = '🌙';
    }
}

// Toggle dark mode
function toggleDarkMode() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
    
    // Add a subtle animation effect
    body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 300);
}

// Event listener for dark mode toggle
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

// Initialize dark mode on page load
initializeDarkMode();

// Get all form elements
const eventSelect = document.getElementById('eventSelect');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const tickets = document.getElementById('tickets');
const mealPreferencesContainer = document.getElementById('mealPreferences');
const resetBtn = document.getElementById('resetBtn');
const eventForm = document.getElementById('eventForm');

// Get success message elements
const successMessage = document.getElementById('successMessage');
const confirmationDetails = document.getElementById('confirmationDetails');

// Get form container for styling
const formContainer = document.querySelector('.form-container');

// Get display elements for price calculation
const selectedEventDisplay = document.getElementById('selectedEvent');
const ticketCountDisplay = document.getElementById('ticketCount');
const ticketPriceDisplay = document.getElementById('ticketPrice');
const mealCostDisplay = document.getElementById('mealCost');
const totalPriceDisplay = document.getElementById('totalPrice');

// Get submit button
const submitButton = eventForm.querySelector('button[type="submit"]');

// Form state tracking
let isSubmitting = false;
let formValidationState = {
    eventSelect: false,  // Changed from 'event' to match the actual element ID
    firstName: false,
    lastName: false,
    email: false,
    phone: true, // Phone is optional, so starts as valid
    tickets: true // Default value of 1 is valid
};

// Validation functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return !phone || /^[\+]?[1-9][\d]{0,15}$/.test(phone);
}

function validateRequired(value) {
    return value && value.trim() !== '';
}

// Show success message with registration details
function showSuccessMessage(registrationData) {
    console.log('🎉 Showing success message with registration data');
    
    // Generate confirmation number
    const confirmationNumber = 'REG-' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
    
    // Create confirmation details HTML
    const confirmationHTML = `
        <div class="confirmation-details">
            <h4>Registration Details</h4>
            <p><strong>Confirmation Number:</strong> ${confirmationNumber}</p>
            <p><strong>Event:</strong> ${registrationData.eventName}</p>
            <p><strong>Attendee:</strong> ${registrationData.firstName} ${registrationData.lastName}</p>
            <p><strong>Email:</strong> ${registrationData.email}</p>
            <p><strong>Phone:</strong> ${registrationData.phone || 'Not provided'}</p>
            <p><strong>Number of Tickets:</strong> ${registrationData.ticketCount}</p>
            ${registrationData.mealPreferences.length > 0 ? `
                <h4>Meal Preferences</h4>
                ${registrationData.mealPreferences.map(meal => 
                    `<p><strong>Guest ${meal.guest}:</strong> ${meal.mealText}</p>`
                ).join('')}
            ` : ''}
            <p><strong>Total Cost:</strong> $${registrationData.totalCost}</p>
        </div>
    `;
    
    // Update confirmation details
    confirmationDetails.innerHTML = confirmationHTML;
    
    // Show success message
    successMessage.classList.remove('hidden');
    
    // Update form styling
    formContainer.classList.add('completed');
    formContainer.classList.remove('processing');
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth' });
    
    console.log('Success message displayed with confirmation:', confirmationNumber);
}

// Hide success message and reset form state
function hideSuccessMessage() {
    successMessage.classList.add('hidden');
    formContainer.classList.remove('completed', 'processing');
    console.log('Success message hidden');
}

// Update form progress based on completion
function updateFormProgress() {
    const totalFields = Object.keys(formValidationState).length;
    const validFields = Object.values(formValidationState).filter(isValid => isValid).length;
    const progressPercent = (validFields / totalFields) * 100;
    
    console.log(`Form progress: ${validFields}/${totalFields} fields valid (${progressPercent.toFixed(0)}%)`);
    
    // Add visual progress indicator if it doesn't exist
    let progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        formContainer.insertBefore(progressBar, formContainer.firstChild);
    }
    
    const progressFill = progressBar.querySelector('.progress-fill');
    progressFill.style.width = progressPercent + '%';
}

// Generate meal preference selectors based on ticket quantity
function generateMealPreferences(ticketCount) {
    console.log('Generating meal preferences for', ticketCount, 'guests');
    
    // Clear existing meal preferences
    mealPreferencesContainer.innerHTML = '';
    
    if (ticketCount === 0) {
        return;
    }
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Meal Preferences';
    title.style.marginBottom = '15px';
    mealPreferencesContainer.appendChild(title);
    
    // Generate meal selection for each guest
    for (let i = 1; i <= ticketCount; i++) {
        const guestDiv = document.createElement('div');
        guestDiv.className = 'meal-guest';
        
        const guestTitle = document.createElement('h4');
        guestTitle.textContent = `Guest ${i} Meal Preference:`;
        
        const mealSelect = document.createElement('select');
        mealSelect.id = `meal-guest-${i}`;
        mealSelect.name = `meal-guest-${i}`;
        mealSelect.innerHTML = `
            <option value="none">No meal</option>
            <option value="regular">Regular meal (+$25)</option>
            <option value="vegetarian">Vegetarian meal (+$25)</option>
            <option value="vegan">Vegan meal (+$30)</option>
        `;
        
        // Add event listener for price updates
        mealSelect.addEventListener('change', function() {
            console.log(`Guest ${i} meal changed to:`, this.value);
            updatePricing();
        });
        
        guestDiv.appendChild(guestTitle);
        guestDiv.appendChild(mealSelect);
        mealPreferencesContainer.appendChild(guestDiv);
    }
    
    console.log('Meal preferences generated successfully');
}

// Price calculation function
function updatePricing() {
    const selectedEvent = eventSelect.value;
    const ticketQuantity = parseInt(tickets.value) || 0;
    
    let eventPrice = 0;
    let eventName = 'Not selected';
    let totalMealCost = 0;
    
    // Get event price
    if (selectedEvent) {
        const selectedOption = eventSelect.options[eventSelect.selectedIndex];
        eventPrice = parseInt(selectedOption.getAttribute('data-price')) || 0;
        eventName = selectedOption.text;
    }
    
    // Calculate total meal cost from all individual selections
    const mealSelects = mealPreferencesContainer.querySelectorAll('select');
    mealSelects.forEach(select => {
        const mealType = select.value;
        switch(mealType) {
            case 'regular':
            case 'vegetarian':
                totalMealCost += 25;
                break;
            case 'vegan':
                totalMealCost += 30;
                break;
            default:
                // 'none' adds $0
                break;
        }
    });
    
    const totalTicketCost = eventPrice * ticketQuantity;
    const totalCost = totalTicketCost + totalMealCost;
    
    // Update display elements
    selectedEventDisplay.textContent = eventName;
    ticketCountDisplay.textContent = ticketQuantity;
    ticketPriceDisplay.textContent = `$${eventPrice}`;
    mealCostDisplay.textContent = `$${totalMealCost}`;
    totalPriceDisplay.textContent = totalCost;
    
    console.log('Price updated:', {
        event: eventName,
        eventPrice: eventPrice,
        tickets: ticketQuantity,
        totalMealCost: totalMealCost,
        total: totalCost
    });
}

// Add visual validation feedback
function showValidation(element, isValid, message = '') {
    // Remove existing validation classes
    element.classList.remove('valid', 'invalid');
    
    // Add appropriate class
    if (isValid) {
        element.classList.add('valid');
    } else {
        element.classList.add('invalid');
    }
    
    console.log(`Validation for ${element.id}: ${isValid ? 'VALID' : 'INVALID'} ${message}`);
    
    // Update form validation state
    updateFormValidationState(element.id, isValid);
}

// Update form validation state and submit button
function updateFormValidationState(fieldId, isValid) {
    console.log(`Updating validation for field: ${fieldId} to ${isValid}`);
    
    // Update the validation state for this field
    if (formValidationState.hasOwnProperty(fieldId)) {
        formValidationState[fieldId] = isValid;
    } else {
        console.warn(`Field ${fieldId} not found in formValidationState:`, formValidationState);
    }
    
    // Check if entire form is valid
    const isFormValid = Object.values(formValidationState).every(valid => valid);
    
    // Update submit button state
    updateSubmitButton(isFormValid);
    
    // Update form progress
    updateFormProgress();
    
    console.log('Form validation state:', formValidationState);
    console.log('Form is valid:', isFormValid);
}

// Update submit button appearance and functionality
function updateSubmitButton(isValid) {
    if (isValid && !isSubmitting) {
        submitButton.disabled = false;
        submitButton.textContent = 'Register for Event';
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
    } else {
        submitButton.disabled = true;
        if (isSubmitting) {
            submitButton.textContent = 'Processing...';
        } else {
            submitButton.textContent = 'Complete All Required Fields';
        }
        submitButton.style.opacity = '0.6';
        submitButton.style.cursor = 'not-allowed';
    }
}

// Prevent invalid characters in phone field
function preventInvalidPhoneInput(e) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'Clear', 'Copy', 'Paste'];
    if (allowedKeys.indexOf(e.key) !== -1) {
        return;
    }
    if ((e.key < '0' || e.key > '9') && e.key !== '+' && e.key !== '-' && e.key !== '(' && e.key !== ')' && e.key !== ' ') {
        e.preventDefault();
        console.log('Invalid character prevented in phone field:', e.key);
    }
}

// Prevent invalid characters in name fields
function preventInvalidNameInput(e) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'Clear', 'Copy', 'Paste'];
    if (allowedKeys.indexOf(e.key) !== -1) {
        return;
    }
    // Allow letters, spaces, hyphens, apostrophes
    if (!/[a-zA-Z\s\-']/.test(e.key)) {
        e.preventDefault();
        console.log('Invalid character prevented in name field:', e.key);
    }
}

// Log when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, adding event listeners');
    generateMealPreferences(1); // Generate for default 1 ticket
    updatePricing(); // Initialize pricing display
    updateSubmitButton(false); // Initially disable submit button
    updateFormProgress(); // Initialize progress bar
    console.log('Form initialization complete');
});

// Event selection logging and price update
eventSelect.addEventListener('change', function() {
    console.log('Event selected:', this.value);
    console.log('Selected option text:', this.options[this.selectedIndex].text);
    
    const isValid = this.value !== '';
    if (isValid) {
        const price = this.options[this.selectedIndex].getAttribute('data-price');
        console.log('Event price:', price);
        showValidation(this, true, '- Valid event selected');
    } else {
        showValidation(this, false, '- Please select an event');
    }
    updatePricing();
});

// Prevent invalid characters in name fields
firstName.addEventListener('keydown', preventInvalidNameInput);
lastName.addEventListener('keydown', preventInvalidNameInput);

// Prevent invalid characters in phone field
phone.addEventListener('keydown', preventInvalidPhoneInput);

// First name input logging and validation
firstName.addEventListener('input', function() {
    console.log('First name typed:', this.value);
    const isValid = validateRequired(this.value);
    showValidation(this, isValid, isValid ? '- Valid name' : '- Name is required');
});

firstName.addEventListener('focus', function() {
    console.log('First name field focused');
});

firstName.addEventListener('blur', function() {
    console.log('First name field lost focus, final value:', this.value);
    const isValid = validateRequired(this.value);
    showValidation(this, isValid, isValid ? '- Valid name' : '- Name is required');
});

// Last name input logging and validation
lastName.addEventListener('input', function() {
    console.log('Last name typed:', this.value);
    const isValid = validateRequired(this.value);
    showValidation(this, isValid, isValid ? '- Valid name' : '- Name is required');
});

lastName.addEventListener('focus', function() {
    console.log('Last name field focused');
});

lastName.addEventListener('blur', function() {
    console.log('Last name field lost focus, final value:', this.value);
    const isValid = validateRequired(this.value);
    showValidation(this, isValid, isValid ? '- Valid name' : '- Name is required');
});

// Email input logging and validation
email.addEventListener('input', function() {
    console.log('Email typed:', this.value);
    if (this.value.length > 0) {
        const isValid = validateEmail(this.value);
        showValidation(this, isValid, isValid ? '- Valid email format' : '- Invalid email format');
    }
});

email.addEventListener('focus', function() {
    console.log('Email field focused');
});

email.addEventListener('blur', function() {
    console.log('Email field lost focus, final value:', this.value);
    const isValid = validateRequired(this.value) && validateEmail(this.value);
    showValidation(this, isValid, isValid ? '- Valid email' : '- Valid email is required');
});

// Phone input logging and validation
phone.addEventListener('input', function() {
    console.log('Phone typed:', this.value);
    const isValid = validatePhone(this.value);
    showValidation(this, isValid, isValid ? '- Valid phone format' : '- Invalid phone format');
});

phone.addEventListener('focus', function() {
    console.log('Phone field focused');
});

phone.addEventListener('blur', function() {
    console.log('Phone field lost focus, final value:', this.value);
    const isValid = validatePhone(this.value);
    showValidation(this, isValid, isValid ? '- Valid phone format' : '- Invalid phone format');
});

// Prevent invalid ticket quantities
tickets.addEventListener('input', function() {
    console.log('Ticket quantity changed:', this.value);
    
    // Prevent values outside range
    let quantity = parseInt(this.value);
    if (quantity < 1) {
        this.value = 1;
        quantity = 1;
        console.log('Ticket quantity corrected to minimum: 1');
    } else if (quantity > 10) {
        this.value = 10;
        quantity = 10;
        console.log('Ticket quantity corrected to maximum: 10');
    }
    
    const isValid = quantity >= 1 && quantity <= 10;
    showValidation(this, isValid, isValid ? '- Valid quantity' : '- Must be 1-10 tickets');
    
    // Regenerate meal preferences
    generateMealPreferences(quantity);
    
    updatePricing();
});

tickets.addEventListener('change', function() {
    console.log('Ticket quantity confirmed:', this.value);
    updatePricing();
});

// Reset button functionality
resetBtn.addEventListener('click', function() {
    // Prevent reset during submission
    if (isSubmitting) {
        console.log('❌ RESET BLOCKED: Form is being processed');
        alert('Please wait for the current submission to complete before resetting.');
        return;
    }
    
    // Confirmation dialog for better UX
    const hasData = firstName.value || lastName.value || email.value || eventSelect.value;
    if (hasData) {
        const confirmReset = confirm('Are you sure you want to reset the form? All entered information will be lost.');
        if (!confirmReset) {
            console.log('Reset cancelled by user');
            return;
        }
    }
    
    console.log('🔄 STARTING FORM RESET');
    console.log('Form will be completely reset to initial state');
    
    // Add visual feedback during reset
    formContainer.style.transition = 'opacity 0.3s ease';
    formContainer.style.opacity = '0.5';
    
    setTimeout(() => {
        // Hide success message
        hideSuccessMessage();
        
        // Reset the form completely
        eventForm.reset();
        
        // Reset all validation classes
        const allInputs = eventForm.querySelectorAll('input, select');
        allInputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
            input.value = input.defaultValue; // Ensure default values are restored
        });
        
        // Clear any custom validation messages or states
        const allLabels = eventForm.querySelectorAll('label');
        allLabels.forEach(label => {
            label.classList.remove('error', 'success');
        });
        
        // Reset validation state completely
        formValidationState = {
            eventSelect: false,  // Changed from 'event' to match the actual element ID
            firstName: false,
            lastName: false,
            email: false,
            phone: true, // Phone is optional
            tickets: true // Default value is valid
        };
        
        // Reset submission state
        isSubmitting = false;
        
        // Clear meal preferences container completely
        mealPreferencesContainer.innerHTML = '';
        
        // Regenerate meal preferences for default quantity (1)
        generateMealPreferences(1);
        
        // Reset pricing display to initial state
        updatePricing();
        
        // Reset submit button to disabled state
        updateSubmitButton(false);
        
        // Reset progress bar
        updateFormProgress();
        
        // Reset form styling
        formContainer.classList.remove('completed', 'processing');
        
        // Scroll back to top of form
        formContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Restore form opacity with animation
        formContainer.style.opacity = '1';
        
        console.log('✅ FORM RESET COMPLETED SUCCESSFULLY');
        console.log('All form data, validation states, and UI elements restored to initial state');
        
        // Optional: Show brief reset confirmation
        const resetNotification = document.createElement('div');
        resetNotification.className = 'reset-notification';
        resetNotification.textContent = '✅ Form reset successfully';
        resetNotification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(resetNotification);
        
        // Show notification
        setTimeout(() => resetNotification.style.opacity = '1', 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            resetNotification.style.opacity = '0';
            setTimeout(() => {
                if (resetNotification.parentNode) {
                    resetNotification.parentNode.removeChild(resetNotification);
                }
            }, 300);
        }, 3000);
        
    }, 200); // Small delay for visual feedback
});

// Form submission validation and logging
eventForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent actual form submission for now
    
    // Prevent double submission
    if (isSubmitting) {
        console.log('❌ SUBMISSION BLOCKED: Form is already being processed');
        return;
    }
    
    console.log('Form submission attempted');
    
    // Final validation check
    const validations = {
        event: eventSelect.value !== '',
        firstName: validateRequired(firstName.value),
        lastName: validateRequired(lastName.value),
        email: validateRequired(email.value) && validateEmail(email.value),
        phone: validatePhone(phone.value),
        tickets: parseInt(tickets.value) >= 1 && parseInt(tickets.value) <= 10
    };
    
    const isFormValid = Object.values(validations).every(isValid => isValid);
    
    console.log('Final validation results:', validations);
    console.log('Form is valid:', isFormValid);
    
    if (!isFormValid) {
        console.log('❌ FORM SUBMISSION PREVENTED - VALIDATION FAILED');
        console.log('Please fix the following issues:');
        if (!validations.event) console.log('- Select an event');
        if (!validations.firstName) console.log('- Enter first name');
        if (!validations.lastName) console.log('- Enter last name');
        if (!validations.email) console.log('- Enter valid email');
        if (!validations.phone) console.log('- Enter valid phone (or leave blank)');
        if (!validations.tickets) console.log('- Select 1-10 tickets');
        
        // Highlight invalid fields
        Object.keys(validations).forEach(fieldId => {
            const field = document.getElementById(fieldId) || document.getElementById(fieldId === 'event' ? 'eventSelect' : fieldId);
            if (field && !validations[fieldId]) {
                showValidation(field, false, '- Required field');
            }
        });
        return;
    }
    
    // Set submission state
    isSubmitting = true;
    updateSubmitButton(false);
    
    console.log('✅ FORM VALIDATION PASSED - PROCESSING SUBMISSION');
    console.log('Form data at submission:');
    console.log('- Event:', eventSelect.value);
    console.log('- Name:', firstName.value, lastName.value);
    console.log('- Email:', email.value);
    console.log('- Phone:', phone.value);
    console.log('- Tickets:', tickets.value);
    
    // Collect all meal preferences
    const mealPreferences = [];
    const mealSelects = mealPreferencesContainer.querySelectorAll('select');
    mealSelects.forEach((select, index) => {
        mealPreferences.push({
            guest: index + 1,
            meal: select.value,
            mealText: select.options[select.selectedIndex].text
        });
    });
    console.log('- Meal Preferences:', mealPreferences);
    console.log('- Total Cost: $' + totalPriceDisplay.textContent);
    
    // Simulate processing time
    setTimeout(() => {
        isSubmitting = false;
        updateSubmitButton(true);
        console.log('✅ FORM SUBMISSION COMPLETED');
        
        // Show success message on the form
        const registrationData = {
            eventName: eventSelect.options[eventSelect.selectedIndex].text,
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phone: phone.value,
            ticketCount: tickets.value,
            mealPreferences: mealPreferences,
            totalCost: totalPriceDisplay.textContent
        };
        showSuccessMessage(registrationData);
    }, 2000);
});

// Add keyboard shortcut for reset (Ctrl+R or Cmd+R)
document.addEventListener('keydown', function(e) {
    // Check for Ctrl+R (Windows) or Cmd+R (Mac) but only when form is focused
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        const isFormFocused = eventForm.contains(document.activeElement);
        if (isFormFocused && !isSubmitting) {
            e.preventDefault(); // Prevent page refresh
            console.log('Reset triggered via keyboard shortcut');
            resetBtn.click(); // Trigger the reset button click
        }
    }
});

// Log all form interactions for debugging
document.addEventListener('click', function(e) {
    if (e.target.closest('#eventForm')) {
        console.log('Element clicked inside form:', e.target.tagName, e.target.id || e.target.className);
    }
});

console.log('All event listeners added successfully');