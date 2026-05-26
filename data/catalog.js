// Bu fayl SmartPortal GLOBAL PRO üçün çox böyük xidmət bazasını, dilləri, valyutaları və portal məlumat modellərini saxlayır.
// Modul sayı statik seed-lərdən runtime-da 480+ seçimə genişlənir ki, müştəri “web sayt” deyəndə ağla gələn bütün qatları seçə bilsin.

export const languages = [
  { id: "az", name: "Azərbaycan", dir: "ltr" },
  { id: "en", name: "English", dir: "ltr" },
  { id: "tr", name: "Türkçe", dir: "ltr" },
  { id: "ru", name: "Русский", dir: "ltr" },
  { id: "es", name: "Español", dir: "ltr" },
  { id: "fr", name: "Français", dir: "ltr" },
  { id: "de", name: "Deutsch", dir: "ltr" },
  { id: "it", name: "Italiano", dir: "ltr" },
  { id: "pt", name: "Português", dir: "ltr" },
  { id: "ar", name: "العربية", dir: "rtl" },
  { id: "zh", name: "中文", dir: "ltr" },
  { id: "hi", name: "हिन्दी", dir: "ltr" }
];

export const i18n = {
  az: {
    start: "Kalkulyatoru aç",
    admin: "Admin ERP",
    portal: "Müştəri portalı",
    auth: "Daxil ol",
    heroTitle: "Qlobal web və SaaS layihələri üçün PRO platforma.",
    heroText: "Qiymət matrisi, CRM, ERP, müştəri portalı və ödəniş xatırlatmaları bir yerdə.",
    matrixTitle: "PRO qiymət kalkulyatoru",
    send: "CRM-ə göndər",
    live: "Canlı hesab"
  },
  en: {
    start: "Open calculator",
    admin: "Admin ERP",
    portal: "Client portal",
    auth: "Sign in",
    heroTitle: "A PRO platform for global web and SaaS projects.",
    heroText: "Pricing, CRM, ERP, client portal and renewal reminders in one clean workspace.",
    matrixTitle: "PRO pricing calculator",
    send: "Send to CRM",
    live: "Live estimate"
  },
  tr: {
    start: "Hesaplayıcıyı aç",
    admin: "Admin ERP",
    portal: "Müşteri portalı",
    auth: "Giriş yap",
    heroTitle: "Global web ve SaaS projeleri için PRO platform.",
    heroText: "Fiyat, CRM, ERP, müşteri paneli ve yenileme hatırlatmaları tek yerde.",
    matrixTitle: "PRO fiyat hesaplayıcı",
    send: "CRM'e gönder",
    live: "Canlı hesap"
  },
  ru: {
    start: "Открыть калькулятор",
    admin: "Admin ERP",
    portal: "Кабинет клиента",
    auth: "Войти",
    heroTitle: "PRO платформа для web и SaaS проектов.",
    heroText: "Цены, CRM, ERP, кабинет клиента и напоминания в одном интерфейсе.",
    matrixTitle: "PRO калькулятор",
    send: "Отправить в CRM",
    live: "Расчет"
  },
  es: { start: "Abrir calculadora", admin: "Admin ERP", portal: "Portal cliente", auth: "Entrar", heroTitle: "Plataforma global para un estudio Senior Full Stack Developer.", heroText: "Matriz multilingüe y multimoneda con 480+ opciones, CRM, ERP, portal cliente, dominios, correos, pagos y push.", matrixTitle: "Calculadora GLOBAL PRO 480+", send: "Enviar a CRM", live: "Estimación" },
  fr: { start: "Ouvrir le calculateur", admin: "Admin ERP", portal: "Portail client", auth: "Connexion", heroTitle: "Plateforme mondiale pour studio Senior Full Stack Developer.", heroText: "Matrice multilingue multidevise 480+ options, CRM, ERP, portail client, domaines, e-mails, paiements et push.", matrixTitle: "Calculateur GLOBAL PRO 480+", send: "Envoyer au CRM", live: "Estimation" },
  de: { start: "Kalkulator öffnen", admin: "Admin ERP", portal: "Kundenportal", auth: "Login", heroTitle: "Weltklasse-Plattform für ein Senior Full Stack Developer Studio.", heroText: "Mehrsprachige Mehrwährungs-Matrix mit 480+ Optionen, CRM, ERP, Kundenportal, Domains, E-Mail, Zahlungen und Push.", matrixTitle: "GLOBAL PRO Rechner 480+", send: "An CRM senden", live: "Live-Schätzung" },
  it: { start: "Apri calcolatore", admin: "Admin ERP", portal: "Portale clienti", auth: "Accedi", heroTitle: "Piattaforma globale per studio Senior Full Stack Developer.", heroText: "Matrice multilingua e multivaluta con 480+ opzioni, CRM, ERP, portale clienti, domini, email, pagamenti e push.", matrixTitle: "Calcolatore GLOBAL PRO 480+", send: "Invia al CRM", live: "Stima live" },
  pt: { start: "Abrir calculadora", admin: "Admin ERP", portal: "Portal cliente", auth: "Entrar", heroTitle: "Plataforma global para estúdio Senior Full Stack Developer.", heroText: "Matriz multilíngue e multimoeda com 480+ opções, CRM, ERP, portal cliente, domínios, e-mails, pagamentos e push.", matrixTitle: "Calculadora GLOBAL PRO 480+", send: "Enviar ao CRM", live: "Estimativa" },
  ar: { start: "افتح الحاسبة", admin: "إدارة ERP", portal: "بوابة العميل", auth: "تسجيل الدخول", heroTitle: "منصة عالمية لاستوديو Senior Full Stack Developer.", heroText: "مصفوفة متعددة اللغات والعملات مع أكثر من 480 خيارا وCRM وERP وبوابة عميل ودومينات وبريد ومدفوعات وتنبيهات.", matrixTitle: "حاسبة GLOBAL PRO 480+", send: "إرسال إلى CRM", live: "تقدير مباشر" },
  zh: { start: "打开计算器", admin: "Admin ERP", portal: "客户门户", auth: "登录", heroTitle: "面向 Senior Full Stack Developer 工作室的世界级平台。", heroText: "多语言、多币种、480+选项矩阵，CRM、ERP、客户门户、域名、邮箱、付款和推送提醒。", matrixTitle: "GLOBAL PRO 480+ 计算器", send: "发送到 CRM", live: "实时估算" },
  hi: { start: "Calculator खोलें", admin: "Admin ERP", portal: "Client portal", auth: "Sign in", heroTitle: "Senior Full Stack Developer studio के लिए world-class platform.", heroText: "Multilingual, multicurrency 480+ options matrix, CRM, ERP, client portal, domains, emails, payments and push reminders.", matrixTitle: "GLOBAL PRO 480+ calculator", send: "CRM को भेजें", live: "Live estimate" }
};

export const currencies = {
  AZN: { symbol: "₼", rate: 1 },
  USD: { symbol: "$", rate: 0.5882 },
  EUR: { symbol: "€", rate: 0.541 },
  GBP: { symbol: "£", rate: 0.462 },
  TRY: { symbol: "₺", rate: 19.08 },
  AED: { symbol: "د.إ", rate: 2.16 },
  SAR: { symbol: "﷼", rate: 2.21 },
  RUB: { symbol: "₽", rate: 52.4 },
  CNY: { symbol: "¥", rate: 4.25 },
  INR: { symbol: "₹", rate: 49.1 }
};

export const platformTypes = [
  ["landing", "Premium Landing Page", 900, 7, 1],
  ["corporate", "Corporate Website", 1600, 12, 1.05],
  ["portfolio", "Portfolio / Personal Brand", 1200, 10, 1.03],
  ["catalog", "Product / Service Catalog", 1900, 14, 1.08],
  ["booking", "Booking Platform", 2600, 20, 1.14],
  ["education", "LMS / Online Course Platform", 3900, 30, 1.22],
  ["ecommerce", "E-commerce Store", 4200, 32, 1.24],
  ["marketplace", "Multi-vendor Marketplace", 7600, 54, 1.42],
  ["saas", "SaaS Subscription Platform", 8600, 62, 1.48],
  ["mobile", "iOS + Android App", 9200, 70, 1.52],
  ["erp", "Custom ERP / CRM", 12500, 90, 1.68],
  ["ai-platform", "AI Agent Platform", 14800, 100, 1.78],
  ["fintech", "FinTech / Payment System", 18000, 120, 1.92],
  ["govtech", "GovTech / Tender Portal", 22000, 140, 2.05],
  ["superapp", "Global Super App Ecosystem", 30000, 180, 2.35]
].map(([id, title, price, days, complexity]) => ({ id, title, price, days, complexity }));

export const tiers = [
  { id: "essential", title: "Essential", multiplier: 0.72, dayFactor: 0.78 },
  { id: "pro", title: "Professional", multiplier: 1, dayFactor: 1 },
  { id: "premium", title: "Premium", multiplier: 1.38, dayFactor: 1.18 },
  { id: "enterprise", title: "Enterprise", multiplier: 1.82, dayFactor: 1.42 },
  { id: "global", title: "Global Scale", multiplier: 2.45, dayFactor: 1.75 }
];

export const delivery = [
  { id: "7d", title: "7 gün Hyper Sprint", multiplier: 1.85, factor: 0.42 },
  { id: "14d", title: "14 gün Fast Track", multiplier: 1.45, factor: 0.64 },
  { id: "30d", title: "30 gün Standard", multiplier: 1, factor: 1 },
  { id: "45d", title: "45 gün Calm Build", multiplier: 0.94, factor: 1.18 },
  { id: "60d", title: "60 gün Budget Roadmap", multiplier: 0.88, factor: 1.36 }
];

export const support = [
  { id: "none", title: "Dəstək yoxdur", monthly: 0, hours: 0 },
  { id: "care", title: "Care SLA", monthly: 120, hours: 3 },
  { id: "growth", title: "Growth SLA", monthly: 280, hours: 8 },
  { id: "scale", title: "Scale SLA", monthly: 650, hours: 20 },
  { id: "mission", title: "Mission Critical", monthly: 1400, hours: 50 },
  { id: "dedicated", title: "Dedicated Product Team", monthly: 3200, hours: 120 }
];

const groupSeeds = [
  ["strategy", "🧭", "Strategiya və biznes analizi", ["Discovery workshop", "Competitor audit", "Market research", "User persona", "Customer journey", "Technical scope", "Risk register", "Product roadmap", "MVP planning", "Tender documentation", "Monetization model", "Stakeholder interviews", "Requirements matrix", "Backlog grooming", "KPI tree", "Analytics taxonomy", "Go-to-market plan", "Brand positioning", "Content architecture", "Information architecture"]],
  ["ux-ui", "🎨", "UI/UX və vizual sistem", ["Design system", "Wireframes", "Interactive prototype", "Dark mode", "Light mode", "RTL layout", "Accessibility AA", "Motion guideline", "Micro interactions", "Empty states", "Loading skeletons", "Error states", "Dashboard UX", "Mobile-first UX", "Tablet UX", "High contrast mode", "Icon system", "Illustration set", "Figma components", "Brand kit"]],
  ["frontend", "💎", "Frontend və animasiya", ["Responsive layout", "PWA shell", "Offline pages", "HD hero animation", "Animated code wall", "Canvas background", "Scroll reveal", "Parallax sections", "Interactive cards", "Mega menu", "Command palette", "Search overlay", "Form wizard", "Pricing simulator", "Client portal UI", "Admin UI", "Theme switcher", "Performance CSS", "Component library", "Landing sections"]],
  ["backend", "🧱", "Backend və API", ["REST API", "GraphQL gateway", "Supabase schema", "Edge functions", "Webhook broker", "Queue worker", "File storage", "Image pipeline", "PDF generator", "Email service", "Notification service", "Audit log", "Rate limiting", "API keys", "Data import", "Data export", "Cron jobs", "Multi-tenant logic", "Cache layer", "Background jobs"]],
  ["auth-security", "🛡️", "Auth və təhlükəsizlik", ["Registration", "Login", "Forgot password", "Magic link", "OTP auth", "MFA", "OAuth Google", "OAuth Microsoft", "Role permissions", "RBAC matrix", "RLS policies", "Tenant isolation", "Device sessions", "Password policy", "Security alerts", "WAF setup", "DDoS protection", "Backup plan", "Incident response", "Compliance center"]],
  ["crm-sales", "🤝", "CRM və satış", ["Lead capture", "Lead scoring", "Kanban pipeline", "Deal stages", "Proposal builder", "Contract builder", "E-signature prep", "Follow-up tasks", "Sales forecast", "Client segmentation", "Activity timeline", "Call notes", "Meeting booking", "Quote versioning", "Discount approvals", "Win-loss analysis", "Referral tracking", "CRM import", "CRM export", "Sales inbox"]],
  ["client-portal", "📱", "Müştəri portalı", ["Client profile", "Project overview", "Domain list", "Domain expiry", "Hosting status", "Email accounts", "Invoice history", "Payment reminders", "Support tickets", "Project timeline", "Milestone approval", "Document vault", "Contract archive", "Push notifications", "Renewal calendar", "Site health", "SSL status", "Backup status", "Change requests", "Feedback center"]],
  ["erp-finance", "📊", "ERP və maliyyə", ["MRR dashboard", "ARR dashboard", "LTV report", "CAC report", "ROI calculator", "Profit margin", "Expense ledger", "Invoice automation", "Payment tracking", "Recurring billing", "Tax fields", "Vendor costs", "Cashflow forecast", "Project budget", "Timesheet", "Payroll export", "Financial audit", "PDF reports", "Excel reports", "Executive BI"]],
  ["ecommerce", "🛒", "E-commerce", ["Cart", "Checkout", "Product variants", "SKU manager", "Inventory", "Warehouse", "Coupons", "Gift cards", "Wishlist", "Compare products", "Reviews", "Ratings", "Order workflow", "Shipping zones", "Courier tracking", "Payment gateway", "Abandoned cart", "Related products", "Merchant panel", "Payout ledger"]],
  ["ai-automation", "🧠", "AI və avtomatlaşdırma", ["AI chat agent", "AI brief parser", "AI price advisor", "AI support triage", "AI content draft", "AI SEO assistant", "AI contract review", "AI anomaly detection", "Vector search", "Knowledge base", "Voice transcription", "Workflow builder", "Auto tagging", "Smart notifications", "Predictive churn", "Sales assistant", "Code assistant widget", "Report summarizer", "Prompt library", "AI audit log"]],
  ["seo-growth", "🚀", "SEO və growth", ["Technical SEO", "Meta manager", "OpenGraph", "Twitter cards", "XML sitemap", "Robots rules", "Schema JSON-LD", "Local SEO", "Keyword research", "Content plan", "Blog engine", "A/B testing", "Heatmaps", "Session replay", "Newsletter", "Marketing automation", "Referral program", "Loyalty program", "Campaign dashboard", "Conversion funnel"]],
  ["integrations", "🔌", "İnteqrasiyalar", ["WhatsApp API", "Telegram bot", "Mailgun", "SMTP", "Google Workspace", "Google Calendar", "Google Drive", "Meta Pixel", "GA4", "GTM", "Stripe", "PayPal", "Local banks", "1C bridge", "QuickBooks", "Slack", "Discord", "Zapier", "Make.com", "Courier API"]],
  ["devops", "⚙️", "DevOps və performans", ["CI/CD", "Preview deploy", "Docker setup", "Monitoring", "Uptime checks", "Error tracking", "Log dashboard", "Database indexes", "Query tuning", "CDN setup", "Cache policy", "Image optimization", "Critical CSS", "Load testing", "Stress testing", "Lighthouse fix", "Security headers", "Environment manager", "Release notes", "Rollback plan"]],
  ["content-media", "🎬", "Kontent və media", ["CMS", "Blog", "Newsroom", "Case studies", "Portfolio", "Team pages", "Careers", "FAQ", "Resource center", "Video embeds", "HLS streaming", "Gallery", "Before-after slider", "Download center", "Media kit", "Press page", "Multi-language copy", "Legal pages", "Cookie center", "Translation workflow"]],
  ["industry", "🌍", "Sənaye paketləri", ["Clinic", "Restaurant", "Hotel", "Real estate", "Education", "Logistics", "Legal", "Finance", "Construction", "Beauty salon", "Fitness", "Automotive", "Tourism", "Retail", "Manufacturing", "NGO", "Government", "Startup", "Agency", "Personal brand"]],
  ["advanced", "🏆", "Global premium fərqləndiricilər", ["White-label mode", "Partner portal", "Affiliate panel", "Franchise manager", "Multi-region setup", "Multi-currency pricing", "Multi-language admin", "Customer mobile PWA", "Push campaign center", "Domain registrar tracker", "SSL automation", "DNS record manager", "Email mailbox manager", "Subscription renewal", "SLA breach alerts", "Client satisfaction score", "NPS survey", "Public roadmap", "Status page", "Developer API docs"]]
];

// Bu funksiya seed-ləri tier-lərlə böyüdərək 480+ real seçim yaradır.
export function buildCatalog() {
  return groupSeeds.map(([id, icon, title, names], groupIndex) => ({
    id,
    icon,
    title,
    type: "checkbox",
    items: names.flatMap((name, itemIndex) =>
      tiers.slice(0, 3).map((tier, tierIndex) => {
        const base = 80 + groupIndex * 35 + itemIndex * 18;
        const price = Math.round(base * tier.multiplier);
        const days = Math.max(1, Math.ceil((2 + itemIndex * 0.22 + tierIndex) * tier.dayFactor));
        return {
          id: `${id}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${tier.id}`,
          title: `${name} · ${tier.title}`,
          price,
          days,
          complexity: Number((1 + groupIndex * 0.012 + tierIndex * 0.035).toFixed(3)),
          tier: tier.id
        };
      })
    )
  }));
}

export const serviceCatalog = [
  { id: "platform", icon: "🏗️", title: "Ana platforma", type: "radio", items: platformTypes },
  ...buildCatalog()
];

export const demoCustomerAssets = {
  domains: [
    { domain: "example.az", expires: "2026-06-18", ssl: "Aktiv", hosting: "Cloud PRO" },
    { domain: "shop-example.com", expires: "2026-07-04", ssl: "Yenilənməlidir", hosting: "E-commerce VPS" }
  ],
  emails: [
    { address: "info@example.az", storage: "8.4 GB / 30 GB", status: "Aktiv" },
    { address: "sales@example.az", storage: "12.1 GB / 30 GB", status: "Aktiv" },
    { address: "support@example.az", storage: "4.7 GB / 30 GB", status: "Aktiv" }
  ],
  payments: [
    { title: "Domain renewal", due: "2026-06-18", amount: 45, status: "Gözləyir" },
    { title: "Monthly SLA", due: "2026-06-01", amount: 280, status: "Yaxınlaşır" },
    { title: "Hosting", due: "2026-06-12", amount: 120, status: "Gözləyir" }
  ],
  projects: [
    { title: "Corporate website redesign", progress: 82, status: "Client Review" },
    { title: "SEO growth package", progress: 44, status: "Active" },
    { title: "Payment gateway integration", progress: 61, status: "QA" }
  ]
};

export function stats() {
  return {
    groups: serviceCatalog.length,
    modules: serviceCatalog.reduce((sum, group) => sum + group.items.length, 0),
    languages: languages.length,
    currencies: Object.keys(currencies).length
  };
}
