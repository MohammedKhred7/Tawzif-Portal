// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupAuthListeners();
    }

    setupAuthListeners() {
        // Listen for auth state changes
        // This would typically integrate with a real auth service
    }

    checkAuthStatus() {
        // Check if user is logged in (from localStorage or session)
        const userData = localStorage.getItem('tawzif_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }
    }

    login(email, password) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const user = {
                        id: 1,
                        email: email,
                        name: 'مستخدم تجريبي',
                        type: 'employer', // or 'seeker', 'advertiser'
                        plan: 'basic'
                    };
                    
                    this.currentUser = user;
                    localStorage.setItem('tawzif_user', JSON.stringify(user));
                    this.updateUI();
                    resolve(user);
                } else {
                    reject('بيانات الدخول غير صحيحة');
                }
            }, 1000);
        });
    }

    register(userData) {
        // Simulate registration
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (userData.email && userData.password) {
                    const user = {
                        id: Date.now(),
                        ...userData,
                        plan: 'basic'
                    };
                    
                    this.currentUser = user;
                    localStorage.setItem('tawzif_user', JSON.stringify(user));
                    this.updateUI();
                    resolve(user);
                } else {
                    reject('البيانات غير مكتملة');
                }
            }, 1500);
        });
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('tawzif_user');
        this.updateUI();
        window.location.href = '/';
    }

    updateUI() {
        // Update UI based on auth status
        const authButtons = document.querySelector('.nav-links');
        
        if (this.currentUser) {
            authButtons.innerHTML = `
                <span>مرحباً، ${this.currentUser.name}</span>
                <a href="dashboard.html" class="btn btn-outline">لوحة التحكم</a>
                <button class="btn btn-primary" onclick="auth.logout()">تسجيل الخروج</button>
            `;
        } else {
            authButtons.innerHTML = `
                <a href="#" class="nav-link active">الرئيسية</a>
                <a href="#" class="nav-link">الميزات</a>
                <a href="#" class="nav-link">الأسعار</a>
                <a href="#" class="nav-link">اتصل بنا</a>
                <button class="btn btn-outline" id="loginBtn">تسجيل الدخول</button>
                <button class="btn btn-primary" id="registerBtn">إنشاء حساب</button>
            `;
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        // Simple permission check based on user type and plan
        const permissions = {
            employer: {
                basic: ['post_jobs', 'view_candidates'],
                advanced: ['post_jobs', 'view_candidates', 'premium_support'],
                professional: ['post_jobs', 'view_candidates', 'premium_support', 'analytics']
            },
            seeker: {
                basic: ['view_jobs', 'apply_jobs'],
                advanced: ['view_jobs', 'apply_jobs', 'premium_profile']
            },
            advertiser: {
                basic: ['post_ads'],
                advanced: ['post_ads', 'premium_placement'],
                professional: ['post_ads', 'premium_placement', 'analytics']
            }
        };

        const userPermissions = permissions[this.currentUser.type]?.[this.currentUser.plan] || [];
        return userPermissions.includes(permission);
    }
}

// Initialize auth manager
const auth = new AuthManager();
window.auth = auth;