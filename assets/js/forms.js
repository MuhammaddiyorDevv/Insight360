document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get("name"),
                email: formData.get("email"),
                message: formData.get("message")
            };
            
            try {
                // Here you can add your form submission logic
                console.log("Form submitted:", data);
                
                // Show success message
                alert("Thank you for your message! We'll get back to you soon.");
                contactForm.reset();
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("There was an error submitting your message. Please try again.");
            }
        });
    }
});
