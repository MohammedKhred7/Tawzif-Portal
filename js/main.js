// Tawzif Portal - Main Application
class TawzifPortal {
    constructor() {
        this.currentSection = 'home';
        this.paginationConfig = {
            itemsPerPage: 6,
            visiblePages: 5
        };
        
        this.paginationState = {
            employers: { currentPage: 1, totalPages: 1, totalItems: 0 },
            jobSeekers: { currentPage: 1, totalPages: 1, totalItems: 0 },
            advertisements: { currentPage: 1, totalPages: 1, totalItems: 0 }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.showToast('مرحباً بك في منصة توظيف', 'info');
    }

    setupEventListeners() {
        // Platform cards
        document.querySelectorAll('.platform-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
                this.showSection(target);
            });
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget.getAttribute('href').substring(1);
                this.showSection(target);
            });
        });

        // Footer links
        document.querySelectorAll('.footer-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget.getAttribute('href').substring(1);
                this.showSection(target);
            });
        });

        // Dashboard button
        // document.getElementById('dashboardBtn').addEventListener('click', () => {
        //     this.showDashboard();
        // });

        // Mobile menu
        document.querySelector('.mobile-menu').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Search and filters
        this.setupSearchAndFilters();
    }

    setupSearchAndFilters() {
        // Search inputs
        ['jobSearch', 'candidateSearch', 'adSearch'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.handleSearch(e.target.value, this.getSectionFromId(id));
                });
            }
        });

        // Filter selects
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleFilter(e.target.value, this.getSectionFromId(e.target.id));
            });
        });

        // Sort selects
        document.querySelectorAll('.sort-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleSort(e.target.value, this.getSectionFromId(e.target.id));
            });
        });
    }

    getSectionFromId(elementId) {
        const sectionMap = {
            'jobSearch': 'employers', 'jobLocation': 'employers', 'jobType': 'employers', 'jobsSort': 'employers',
            'candidateSearch': 'jobSeekers', 'candidateLocation': 'jobSeekers', 'candidateSpecialty': 'jobSeekers', 'candidatesSort': 'jobSeekers',
            'adSearch': 'advertisements', 'adCategory': 'advertisements', 'adLocation': 'advertisements', 'adsSort': 'advertisements'
        };
        return sectionMap[elementId] || 'employers';
    }

    setupNavigation() {
        window.addEventListener('load', () => {
            const hash = window.location.hash.substring(1);
            if (hash && this.isValidSection(hash)) {
                this.showSection(hash);
            }
        });

        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && this.isValidSection(hash)) {
                this.showSection(hash);
            }
        });
    }

    isValidSection(section) {
        return ['home', 'employers', 'job-seekers', 'advertisements'].includes(section);
    }

    showSection(sectionId) {
        // Update URL
        window.location.hash = sectionId;

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show/hide content
        if (sectionId === 'home') {
            document.querySelector('.hero').style.display = 'block';
            document.querySelector('.main-content').style.display = 'none';
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                this.currentSection = sectionId;
            }
        } else {
            document.querySelector('.hero').style.display = 'none';
            document.querySelector('.main-content').style.display = 'block';
            
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                this.currentSection = sectionId;
                
                // Reset pagination for this section
                const sectionKey = this.getSectionKey(sectionId);
                this.paginationState[sectionKey].currentPage = 1;
                
                this.loadSectionData(sectionId);
            }
        }

        this.updateActiveNav();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getSectionKey(sectionId) {
        const map = {
            'employers': 'employers',
            'job-seekers': 'jobSeekers',
            'advertisements': 'advertisements'
        };
        return map[sectionId];
    }

    updateActiveNav() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const linkSection = link.getAttribute('href').substring(1);
            if (linkSection === this.currentSection) {
                link.classList.add('active');
            }
        });
    }

    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    }

    loadSectionData(sectionId) {
        this.showLoading(sectionId);

        // Simulate API delay
        setTimeout(() => {
            switch(sectionId) {
                case 'employers':
                    this.loadJobs();
                    break;
                case 'job-seekers':
                    this.loadCandidates();
                    break;
                case 'advertisements':
                    this.loadAds();
                    break;
            }
        }, 600);
    }

    // Data loading with pagination
    loadJobs() {
        const allJobs = this.generateJobsData();
        this.displayPaginatedData('employers', allJobs, this.renderJobs.bind(this));
    }

    loadCandidates() {
        const allCandidates = this.generateCandidatesData();
        this.displayPaginatedData('jobSeekers', allCandidates, this.renderCandidates.bind(this));
    }

    loadAds() {
        const allAds = this.generateAdsData();
        this.displayPaginatedData('advertisements', allAds, this.renderAds.bind(this));
    }

    displayPaginatedData(sectionKey, allItems, renderFunction) {
        const sectionId = this.getSectionIdFromKey(sectionKey);
        const { currentPage } = this.paginationState[sectionKey];
        const itemsPerPage = this.paginationConfig.itemsPerPage;
        
        // Calculate pagination
        const totalItems = allItems.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const currentItems = allItems.slice(startIndex, endIndex);

        // Update state
        this.paginationState[sectionKey].totalPages = totalPages;
        this.paginationState[sectionKey].totalItems = totalItems;

        // Update UI
        this.updateResultsCount(sectionId, totalItems);
        renderFunction(currentItems);
        this.renderPagination(sectionKey, sectionId);
    }

    getSectionIdFromKey(sectionKey) {
        const map = {
            'employers': 'employers',
            'jobSeekers': 'job-seekers',
            'advertisements': 'advertisements'
        };
        return map[sectionKey];
    }

    updateResultsCount(sectionId, totalItems) {
        const elementId = `${sectionId === 'employers' ? 'jobs' : sectionId === 'job-seekers' ? 'candidates' : 'ads'}Count`;
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = totalItems.toLocaleString();
        }
    }

    renderPagination(sectionKey, sectionId) {
        const elementId = `${sectionId === 'employers' ? 'jobs' : sectionId === 'job-seekers' ? 'candidates' : 'ads'}Pagination`;
        const paginationElement = document.getElementById(elementId);
        const { currentPage, totalPages, totalItems } = this.paginationState[sectionKey];

        if (totalPages <= 1) {
            paginationElement.innerHTML = '';
            return;
        }

        let html = '';

        // Previous button
        if (currentPage > 1) {
            html += `<button class="pagination-btn" onclick="app.changePage('${sectionKey}', ${currentPage - 1})">
                        <i class="fas fa-chevron-right"></i>
                    </button>`;
        } else {
            html += `<button class="pagination-btn disabled"><i class="fas fa-chevron-right"></i></button>`;
        }

        // Page numbers
        const pages = this.generatePageNumbers(currentPage, totalPages);
        html += '<div class="pagination-pages">';
        
        pages.forEach(page => {
            if (page === '...') {
                html += '<span class="pagination-dots">...</span>';
            } else {
                const active = page === currentPage;
                html += `<button class="pagination-btn ${active ? 'active' : ''}" 
                                onclick="app.changePage('${sectionKey}', ${page})">
                            ${page}
                        </button>`;
            }
        });
        
        html += '</div>';

        // Next button
        if (currentPage < totalPages) {
            html += `<button class="pagination-btn" onclick="app.changePage('${sectionKey}', ${currentPage + 1})">
                        <i class="fas fa-chevron-left"></i>
                    </button>`;
        } else {
            html += `<button class="pagination-btn disabled"><i class="fas fa-chevron-left"></i></button>`;
        }

        // Page info
        const startItem = ((currentPage - 1) * this.paginationConfig.itemsPerPage) + 1;
        const endItem = Math.min(currentPage * this.paginationConfig.itemsPerPage, totalItems);
        html += `<div class="pagination-info">عرض ${startItem}-${endItem} من ${totalItems}</div>`;

        paginationElement.innerHTML = html;
    }

    generatePageNumbers(currentPage, totalPages) {
        const visiblePages = this.paginationConfig.visiblePages;
        
        if (totalPages <= visiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];
        const half = Math.floor(visiblePages / 2);
        let start = Math.max(currentPage - half, 1);
        let end = Math.min(start + visiblePages - 1, totalPages);

        if (end - start + 1 < visiblePages) {
            start = Math.max(end - visiblePages + 1, 1);
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    }

    changePage(sectionKey, newPage) {
        this.paginationState[sectionKey].currentPage = newPage;
        const sectionId = this.getSectionIdFromKey(sectionKey);
        this.loadSectionData(sectionId);
        
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Data generators
    generateJobsData() {
        const jobs = [];
        const titles = ['مطور ويب', 'محاسب', 'مدير تسويق', 'مصمم جرافيك', 'مهندس برمجيات'];
        const companies = ['شركة التقنية', 'مجموعة الأعمال', 'شركة التسويق', 'استوديو التصميم', 'البرمجيات الذكية'];
        
        for (let i = 1; i <= 45; i++) {
            jobs.push({
                id: i,
                title: `${titles[i % titles.length]} ${i % 3 === 0 ? 'متقدم' : ''}`,
                company: companies[i % companies.length],
                location: ['الرياض', 'جدة', 'الدمام', 'عن بعد'][i % 4],
                type: ['دوام كامل', 'دوام جزئي', 'عمل عن بعد'][i % 3],
                salary: `${(8 + i % 5) * 1000} - ${(12 + i % 5) * 1000} ر.س`,
                posted: `منذ ${i % 7 + 1} أيام`,
                description: `وظيفة مميزة في مجال التكنولوجيا تتطلب مهارات متقدمة وخبرة في المجال.`,
                urgent: i % 7 === 0,
                featured: i % 5 === 0
            });
        }
        return jobs;
    }

    generateCandidatesData() {
        const candidates = [];
        const names = ['أحمد محمد', 'فاطمة عبدالله', 'خالد سعيد', 'نورة أحمد', 'محمد علي'];
        const titles = ['مطور ويب', 'محاسب', 'مدير تسويق', 'مصمم UX/UI', 'مهندس برمجيات'];
        
        for (let i = 1; i <= 36; i++) {
            candidates.push({
                id: i,
                name: `${names[i % names.length]} ${i}`,
                title: titles[i % titles.length],
                experience: `${2 + i % 8} سنوات`,
                location: ['الرياض', 'جدة', 'الدمام', 'الشرقية'][i % 4],
                education: i % 3 === 0 ? 'ماجستير' : 'بكالوريوس',
                skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'].slice(0, 2 + i % 3),
                available: i % 10 !== 0
            });
        }
        return candidates;
    }

    generateAdsData() {
        const ads = [];
        const types = ['تدريب', 'استشارات', 'عمل حر', 'تطوير'];
        const providers = ['مركز التدريب', 'أكاديمية التسويق', 'مستشار معتمد', 'مصمم محترف'];
        
        for (let i = 1; i <= 42; i++) {
            ads.push({
                id: i,
                title: `خدمة ${types[i % types.length]} رقم ${i}`,
                provider: providers[i % providers.length],
                type: types[i % types.length],
                location: i % 4 === 0 ? 'عن بعد' : ['الرياض', 'جدة', 'الدمام'][i % 3],
                price: i % 3 === 0 ? `يبدأ من ${(1 + i % 3) * 500} ر.س` : `${(1 + i % 5) * 500} ر.س`,
                duration: i % 2 === 0 ? `${4 + i % 4} أسابيع` : 'مستمر',
                description: `خدمة احترافية توفر حلولاً مبتكرة ومميزة في مجالها.`,
                featured: i % 6 === 0
            });
        }
        return ads;
    }

    // Render functions
    renderJobs(jobs) {
        const grid = document.getElementById('jobsGrid');
        
        if (jobs.length === 0) {
            grid.innerHTML = this.getNoResultsHTML('وظائف');
            return;
        }

        grid.innerHTML = jobs.map(job => `
            <div class="job-card">
                ${job.urgent ? '<span class="card-urgent">عاجل</span>' : ''}
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${job.title}</h3>
                        <p class="card-subtitle">${job.company}</p>
                    </div>
                    <span class="card-badge">${job.urgent ? 'عاجل' : 'جديد'}</span>
                </div>
                <div class="card-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location}</span>
                </div>
                <div class="card-info">
                    <i class="fas fa-clock"></i>
                    <span>${job.type}</span>
                </div>
                <div class="card-info">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>${job.salary}</span>
                </div>
                <div class="card-info">
                    <i class="fas fa-calendar"></i>
                    <span>${job.posted}</span>
                </div>
                <p class="card-description">${job.description}</p>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="app.applyForJob(${job.id})">
                        <i class="fas fa-paper-plane"></i>
                        التقديم
                    </button>
                    <button class="btn btn-outline" onclick="app.saveJob(${job.id})">
                     <i class="fa-brands fa-whatsapp"></i>
                        تواصل
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderCandidates(candidates) {
        const grid = document.getElementById('candidatesGrid');
        
        if (candidates.length === 0) {
            grid.innerHTML = this.getNoResultsHTML('باحثين عن عمل');
            return;
        }

        grid.innerHTML = candidates.map(candidate => `
            <div class="candidate-card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${candidate.name}</h3>
                        <p class="card-subtitle">${candidate.title}</p>
                    </div>
                    <span class="card-badge">${candidate.available ? 'متاح' : 'غير متاح'}</span>
                </div>
                <div class="card-info">
                    <i class="fas fa-briefcase"></i>
                    <span>${candidate.experience} خبرة</span>
                </div>
                <div class="card-info">
                    <i class="fas fa-graduation-cap"></i>
                    <span>${candidate.education}</span>
                </div>
                <div class="card-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${candidate.location}</span>
                </div>
                <div class="card-skills">
                    ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="app.viewCandidate(${candidate.id})">
                        <i class="fas fa-eye"></i>
                       CV
                    </button>
                    <button class="btn btn-outline" onclick="app.contactCandidate(${candidate.id})" 
                            ${!candidate.available ? 'disabled' : ''}>
                        <i class="fa-brands fa-whatsapp"></i>
                        تواصل
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderAds(ads) {
        const grid = document.getElementById('adsGrid');
        
        if (ads.length === 0) {
            grid.innerHTML = this.getNoResultsHTML('إعلانات');
            return;
        }

        grid.innerHTML = ads.map(ad => `
            <div class="ad-card">
                ${ad.featured ? '<span class="card-featured">مميز</span>' : ''}
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${ad.title}</h3>
                        <p class="card-subtitle">${ad.provider}</p>
                    </div>
                </div>
                <div class="card-info">
                    <i class="fas fa-tags"></i>
                    <span>${ad.type}</span>
                </div>
                <div class="card-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${ad.location}</span>
                </div>
                <div class="card-info">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>${ad.price}</span>
                </div>
                <div class="card-info">
                    <i class="fas fa-clock"></i>
                    <span>${ad.duration}</span>
                </div>
                <p class="card-description">${ad.description}</p>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="app.viewAdDetails(${ad.id})">
                        <i class="fas fa-info-circle"></i>
                        التفاصيل
                    </button>
                    <button class="btn btn-outline" onclick="app.contactAdProvider(${ad.id})">
                         <i class="fa-brands fa-whatsapp"></i>
                        تواصل
                    </button>
                </div>
            </div>
        `).join('');
    }

    getNoResultsHTML(type) {
        return `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>لا توجد ${type} متاحة</h3>
                <p>جرب تعديل معايير البحث أو الفلاتر للحصول على نتائج أكثر.</p>
                <button class="btn btn-primary" onclick="app.clearFilters()">
                    مسح الفلاتر
                </button>
            </div>
        `;
    }

    showLoading(sectionId) {
        const gridIds = {
            'employers': 'jobsGrid',
            'job-seekers': 'candidatesGrid',
            'advertisements': 'adsGrid'
        };
        
        const grid = document.getElementById(gridIds[sectionId]);
        if (grid) {
            grid.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>جاري تحميل البيانات...</p>
                </div>
            `;
        }
    }

    // Event handlers
    handleSearch(query, section) {
        console.log(`Search in ${section}:`, query);
        // In real app: filter data and reset to page 1
        this.paginationState[this.getSectionKey(section)].currentPage = 1;
        this.loadSectionData(section);
    }

    handleFilter(value, section) {
        console.log(`Filter ${section}:`, value);
        this.paginationState[this.getSectionKey(section)].currentPage = 1;
        this.loadSectionData(section);
    }

    handleSort(value, section) {
        console.log(`Sort ${section}:`, value);
        this.paginationState[this.getSectionKey(section)].currentPage = 1;
        this.loadSectionData(section);
    }

    clearFilters() {
        // Reset all filters and searches
        document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
        document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
        
        const sectionKey = this.getSectionKey(this.currentSection);
        this.paginationState[sectionKey].currentPage = 1;
        this.loadSectionData(this.currentSection);
        
        this.showToast('تم مسح جميع الفلاتر', 'success');
    }

    // Action methods
    applyForJob(jobId) {
        this.showToast(`تم التقديم على الوظيفة #${jobId}`, 'success');
    }

    saveJob(jobId) {
        this.showToast(`تم حفظ الوظيفة #${jobId}`, 'success');
    }

    viewCandidate(candidateId) {
        this.showToast(`عرض السيرة الذاتية #${candidateId}`, 'info');
    }

    contactCandidate(candidateId) {
        this.showToast(`جاري التواصل مع المرشح #${candidateId}`, 'info');
    }

    viewAdDetails(adId) {
        this.showToast(`عرض تفاصيل الإعلان #${adId}`, 'info');
    }

    contactAdProvider(adId) {
        this.showToast(`جاري التواصل مع مقدم الخدمة #${adId}`, 'info');
    }

    showDashboard() {
        this.showToast('جاري الانتقال إلى لوحة التحكم', 'info');
        setTimeout(() => {
            alert('لوحة التحكم - نظام الإدارة المتكامل\n\n• إدارة الوظائف\n• إدارة الباحثين\n• إدارة الإعلانات\n• التقارير والإحصائيات');
        }, 1000);
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageElement = document.getElementById('toastMessage');
        
        messageElement.textContent = message;
        toast.className = 'toast';
        toast.classList.add('active');
        
        // Set color based on type
        const colors = {
            success: 'var(--success)',
            error: 'var(--error)',
            warning: 'var(--warning)',
            info: 'var(--primary)'
        };
        
        toast.style.background = colors[type] || colors.success;
        
        // Auto hide
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TawzifPortal();
});