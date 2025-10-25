// Dashboard JavaScript
class Dashboard {
    constructor() {
        this.currentView = 'overview';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupPlans();
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView(e.currentTarget.dataset.view);
            });
        });

        // Plan selection
        document.querySelectorAll('.plan-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectPlan(e.currentTarget);
            });
        });

        // Form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(e);
            });
        });
    }

    showView(viewName) {
        // Update sidebar active state
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.style.display = 'none';
        });

        // Show selected view
        document.getElementById(`${viewName}View`).style.display = 'block';
        this.currentView = viewName;

        // Load view-specific data
        this.loadViewData(viewName);
    }

    loadDashboardData() {
        // Load stats and overview data
        this.updateStats();
        this.loadRecentActivity();
    }

    updateStats() {
        // Simulate updating statistics
        const stats = {
            jobs: 47,
            candidates: 128,
            ads: 23,
            revenue: 15420
        };

        document.querySelectorAll('.stat-card-value').forEach(stat => {
            const statType = stat.closest('.stat-card').dataset.stat;
            if (stats[statType]) {
                stat.textContent = stats[statType].toLocaleString();
            }
        });
    }

    loadRecentActivity() {
        // Load recent activity data
        const activity = [
            { type: 'job', action: 'تمت إضافة وظيفة جديدة', time: 'منذ 5 دقائق' },
            { type: 'candidate', action: 'تم تسجيل باحث جديد', time: 'منذ 15 دقيقة' },
            { type: 'ad', action: 'تم نشر إعلان جديد', time: 'منذ ساعة' }
        ];

        const activityList = document.getElementById('activityList');
        if (activityList) {
            activityList.innerHTML = activity.map(item => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-${this.getActivityIcon(item.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <p>${item.action}</p>
                        <span>${item.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    getActivityIcon(type) {
        const icons = {
            job: 'briefcase',
            candidate: 'user-tie',
            ad: 'bullhorn'
        };
        return icons[type] || 'circle';
    }

    setupPlans() {
        // Initialize plans and pricing
        const plans = {
            employers: [
                { name: 'الاساسي', price: 99, features: ['5 وظائف', '30 يوم', 'دعم أساسي'] },
                { name: 'المتقدم', price: 199, features: ['15 وظيفة', '60 يوم', 'دعم مميز'] },
                { name: 'الاحترافي', price: 299, features: ['وظائف غير محدودة', '90 يوم', 'دعم فوري'] }
            ],
            seekers: [
                { name: 'الاساسي', price: 49, features: ['ملف شخصي', '30 يوم', '3 طلبات'] },
                { name: 'المتقدم', price: 99, features: ['ملف مميز', '60 يوم', 'طلبات غير محدودة'] }
            ],
            advertisers: [
                { name: 'الاساسي', price: 79, features: ['3 إعلانات', '30 يوم', 'عرض أساسي'] },
                { name: 'المتقدم', price: 149, features: ['10 إعلانات', '60 يوم', 'عرض مميز'] },
                { name: 'الاحترافي', price: 249, features: ['إعلانات غير محدودة', '90 يوم', 'عرض متميز'] }
            ]
        };

        // Render plans in their respective sections
        Object.keys(plans).forEach(section => {
            const container = document.getElementById(`${section}Plans`);
            if (container) {
                container.innerHTML = plans[section].map((plan, index) => `
                    <div class="plan-card ${index === 1 ? 'featured' : ''}" data-plan="${section}-${plan.name}">
                        <h3 class="plan-name">${plan.name}</h3>
                        <div class="plan-price">${plan.price}</div>
                        <div class="plan-period">ريال سعودي / شهرياً</div>
                        <ul class="plan-features">
                            ${plan.features.map(feature => `<li><i class="fas fa-check"></i>${feature}</li>`).join('')}
                        </ul>
                        <button class="btn btn-primary btn-block">اختيار الخطة</button>
                    </div>
                `).join('');
            }
        });
    }

    selectPlan(planCard) {
        document.querySelectorAll('.plan-card').forEach(card => {
            card.classList.remove('selected');
        });
        planCard.classList.add('selected');
        
        const planName = planCard.dataset.plan;
        this.showToast(`تم اختيار خطة ${planName}`, 'success');
    }

    loadViewData(viewName) {
        // Load data specific to each view
        switch(viewName) {
            case 'jobs':
                this.loadJobsManagement();
                break;
            case 'candidates':
                this.loadCandidatesManagement();
                break;
            case 'ads':
                this.loadAdsManagement();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    loadJobsManagement() {
        // Load jobs management data
        const jobs = [
            { title: 'مطور ويب', status: 'نشط', applications: 15, posted: '2024-01-15' },
            { title: 'محاسب', status: 'معلق', applications: 8, posted: '2024-01-14' },
            { title: 'مدير تسويق', status: 'منتهي', applications: 23, posted: '2024-01-10' }
        ];

        this.renderTable('jobsTable', jobs, ['العنوان', 'الحالة', 'عدد المتقدمين', 'تاريخ النشر']);
    }

    loadCandidatesManagement() {
        // Load candidates management data
        const candidates = [
            { name: 'أحمد محمد', status: 'نشط', applications: 5, lastActive: '2024-01-15' },
            { name: 'فاطمة عبدالله', status: 'نشط', applications: 3, lastActive: '2024-01-14' },
            { name: 'خالد سعيد', status: 'غير نشط', applications: 8, lastActive: '2024-01-10' }
        ];

        this.renderTable('candidatesTable', candidates, ['الاسم', 'الحالة', 'طلبات التقديم', 'آخر نشاط']);
    }

    loadAdsManagement() {
        // Load ads management data
        const ads = [
            { title: 'دورة تطوير الويب', status: 'نشط', clicks: 150, expires: '2024-02-15' },
            { title: 'خدمات تصميم', status: 'نشط', clicks: 89, expires: '2024-02-10' },
            { title: 'استشارات أعمال', status: 'منتهي', clicks: 234, expires: '2024-01-20' }
        ];

        this.renderTable('adsTable', ads, ['العنوان', 'الحالة', 'النقرات', 'تاريخ الانتهاء']);
    }

    renderTable(tableId, data, headers) {
        const table = document.getElementById(tableId);
        if (table) {
            table.innerHTML = `
                <thead>
                    <tr>
                        ${headers.map(header => `<th>${header}</th>`).join('')}
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                            <td>
                                <div class="table-actions">
                                    <button class="btn btn-outline btn-sm" onclick="dashboard.editItem('${row[Object.keys(row)[0]]}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-outline btn-sm" onclick="dashboard.deleteItem('${row[Object.keys(row)[0]]}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
        }
    }

    loadSettings() {
        // Load settings form data
        // This would typically load user settings from an API
    }

    handleFormSubmit(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        // Simulate form submission
        this.showToast('تم حفظ التغييرات بنجاح', 'success');
        
        // In a real app, this would send data to the server
        setTimeout(() => {
            form.reset();
        }, 1000);
    }

    editItem(itemName) {
        this.showToast(`جاري تحرير ${itemName}`, 'info');
    }

    deleteItem(itemName) {
        if (confirm(`هل أنت متأكد من حذف ${itemName}؟`)) {
            this.showToast(`تم حذف ${itemName}`, 'success');
        }
    }

    showToast(message, type = 'success') {
        // Similar to main app toast, but for dashboard
        alert(`${type === 'success' ? '✓' : '⚠'} ${message}`);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});