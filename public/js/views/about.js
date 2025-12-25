// public/js/views/about.js

const aboutView = () => `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-200">

        <!-- Hero Section -->
        <div class="text-center mb-16">
            <h1 class="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Empowering Campus Commerce</h1>
            <p class="text-xl text-gray-600 dark:text-gray-300">Connecting students to buy, sell, and trade safely within their university community.</p>
        </div>

        <!-- Mission -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
            <h2 class="text-2xl font-bold mb-4 dark:text-white"><i class="fas fa-bullseye text-red-500 mr-2"></i>Our Mission</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                University Marketplace was built to solve a simple problem: textbooks are expensive, moving out is chaotic, and campus classifieds are scattered.
                We provide a centralized, secure, and student-focused platform where you can turn your unused items into cash and find great deals on what you need next.
            </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div class="text-center p-6 bg-blue-50 dark:bg-gray-700 rounded-xl transition-transform hover:-translate-y-1 duration-300">
                <div class="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-300 text-2xl">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3 class="text-lg font-bold mb-2 dark:text-white">Secure & Trusted</h3>
                <p class="text-gray-600 dark:text-gray-400">Verified student profiles ensuring you deal with real peers, not bots.</p>
            </div>
            <div class="text-center p-6 bg-green-50 dark:bg-gray-700 rounded-xl transition-transform hover:-translate-y-1 duration-300">
                <div class="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-300 text-2xl">
                    <i class="fas fa-map-marked-alt"></i>
                </div>
                <h3 class="text-lg font-bold mb-2 dark:text-white">Campus Focused</h3>
                <p class="text-gray-600 dark:text-gray-400">Smart features like Campus Maps and Meetup Spots make local trading easy.</p>
            </div>
            <div class="text-center p-6 bg-indigo-50 dark:bg-gray-700 rounded-xl transition-transform hover:-translate-y-1 duration-300">
                <div class="bg-indigo-100 dark:bg-indigo-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-300 text-2xl">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h3 class="text-lg font-bold mb-2 dark:text-white">Smart Pricing</h3>
                <p class="text-gray-600 dark:text-gray-400">Our analytics engine helps you price fairly and find the best deals.</p>
            </div>
        </div>

        <!-- Team -->
        <div class="text-center">
             <h2 class="text-3xl font-bold mb-8 dark:text-white">Built For Students, By Students</h2>
             <p class="text-gray-600 dark:text-gray-400">
                Founded as a Software Engineering project to demonstrate modern web technologies.
             </p>
        </div>

    </div>
`;

const initAbout = async () => {
    // Any initialization logic if needed (e.g., animations)
};

export { aboutView, initAbout };
