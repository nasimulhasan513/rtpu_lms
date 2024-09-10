<template>
    <footer class="text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300">
        <AppContainer class="py-10">

            <div class="border-gray-200 dark:border-gray-700">
                <div class="flex flex-col items-center justify-center md:flex-row">
                    <p>&copy; ২০২৪ বাংলা ব্যাঞ্জন। সর্বস্বত্ব সংরক্ষিত।</p>
                    <!-- <div class="flex mt-4 space-x-4 md:mt-0">
                        <NuxtLink v-for="link in legalLinks" :key="link.to" :to="link.to"
                            class="transition-colors hover:text-primary">
                            {{ link.label }}
                        </NuxtLink>
                    </div> -->
                </div>
            </div>
        </AppContainer>
    </footer>
</template>

<script setup>
const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Blog", to: "/blog" },
];

const socialMediaLinks = [
    { label: "Facebook", url: "https://facebook.com", icon: "lucide:facebook" },
    { label: "Twitter", url: "https://twitter.com", icon: "lucide:twitter" },
    { label: "LinkedIn", url: "https://linkedin.com", icon: "lucide:linkedin" },
    { label: "YouTube", url: "https://youtube.com", icon: "lucide:youtube" },
];

const contactInfo = [
    { text: "+1 (555) 123-4567", icon: "lucide:phone" },
    { text: "support@edutech.com", icon: "lucide:mail" },
    { text: "123 Learning Street, Education City, 12345", icon: "lucide:map-pin" },
];

const legalLinks = [
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms of Service", to: "/terms-of-service" },
    { label: "Cookie Policy", to: "/cookie-policy" },
];

function subscribeNewsletter() {
    // Implement newsletter subscription logic here
    console.log("Newsletter subscription submitted");
}
</script>