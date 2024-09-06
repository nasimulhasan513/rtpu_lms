<template>
    <footer class="text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300">
        <AppContainer class="py-12">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                <!-- Company Info -->
                <div class="space-y-4">
                    <NavbarLogo />
                    <p class="mt-4">Empowering learners worldwide with cutting-edge online education.</p>
                    <div class="flex space-x-4">
                        <a v-for="social in socialMediaLinks" :key="social.url" :href="social.url" target="_blank"
                            class="text-gray-400 transition-colors hover:text-primary">
                            <Icon :name="social.icon" class="w-6 h-6" />
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="mb-4 text-lg font-semibold">Quick Links</h3>
                    <ul class="space-y-2">
                        <li v-for="link in quickLinks" :key="link.to">
                            <NuxtLink :to="link.to" class="transition-colors hover:text-primary">{{ link.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div>
                    <h3 class="mb-4 text-lg font-semibold">Contact Us</h3>
                    <ul class="space-y-2">
                        <li v-for="contact in contactInfo" :key="contact.text" class="flex items-center">
                            <Icon :name="contact.icon" class="w-5 h-5 mr-2 text-primary" />
                            <span v-html="contact.text"></span>
                        </li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div>
                    <h3 class="mb-4 text-lg font-semibold">Subscribe to Our Newsletter</h3>
                    <p class="mb-4">Stay updated with our latest courses and offers.</p>
                    <form @submit.prevent="subscribeNewsletter" class="flex gap-2">
                        <Input type="email" placeholder="Your email" />
                        <Button type="submit" class="rounded-r-md">Subscribe</Button>
                    </form>
                </div>
            </div>

            <div class="pt-8 mt-12 border-t border-gray-200 dark:border-gray-700">
                <div class="flex flex-col items-center justify-between md:flex-row">
                    <p>&copy; 2024 EduTech Platform. All rights reserved.</p>
                    <div class="flex mt-4 space-x-4 md:mt-0">
                        <NuxtLink v-for="link in legalLinks" :key="link.to" :to="link.to"
                            class="transition-colors hover:text-primary">
                            {{ link.label }}
                        </NuxtLink>
                    </div>
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