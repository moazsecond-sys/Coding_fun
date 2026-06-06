// ====== 1. أداة الفحص ======
const grid = document.getElementById('grid');
const filters = document.querySelectorAll('.filter');

function showReport(title, status, details) {
    const color = status === 'ok' ? '#4CAF50' : '#f44336';
    const icon = status === 'ok' ? '✅' : '❌';
    return `<p><b>${icon} ${title}:</b><br><span style="color:${color}">${details}</span></p>`;
}

async function runDiagnostics() {
    let report = '<div style="grid-column:1/-1; background:#111; padding:20px; border-radius:10px; text-align:left; font-family:monospace; font-size:14px; direction:ltr">';
    report += '<h3 style="color:#fff; margin-top:0; text-align:center">🔍 تقرير فحص الموقع</h3>';

    // فحص 1: config.js
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_KEY === 'undefined' || typeof BUCKET === 'undefined') {
        report += showReport('ملف config.js', 'error', 'المتغيرات ناقصة. تأكد ان config.js مربوط قبل script.js في HTML');
        grid.innerHTML = report + '</div>';
        return false;
    }
    report += showReport('ملف config.js', 'ok', `URL: ${SUPABASE_URL.substring(0,30)}... | Bucket: ${BUCKET}`);

    // فحص 2: الاتصال
    try {
        const { data, error } = await supabase.storage.from(BUCKET).list();
        if (error) {
            report += showReport('الاتصال بـ Supabase', 'error', `فشل: ${error.message}<br>السبب: البكت '${BUCKET}' مو موجود/مو Public/المفتاح غلط`);
            grid.innerHTML = report + '</div>';
            return false;
        }
        report += showReport('الاتصال بـ Supabase', 'ok', `نجح! لقيت ${data.length} ملف`);
        report += showReport('الملفات', 'ok', data.map(f=>f.name).join(', ') || 'البكت فاضي');

        if(data.length === 0) {
            report += showReport('الصور', 'error', 'البكت فاضي. ارفع صورك png/jpg');
            grid.innerHTML = report + '</div>';
            return false;
        }

        report += '<hr style="border-color:#333"><p style="color:#4CAF50; text-align:center"><b>✅ كل الفحوصات نجحت! جاري عرض الأعمال...</b></p></div>';
        grid.innerHTML = report;
        return data; // ارجع الصور عشان نعرضها

    } catch (err) {
        report += showReport('مكتبة Supabase', 'error', `فشل تحميل المكتبة: ${err.message}<br>تأكد من سطر CDN في HTML`);
        grid.innerHTML = report + '</div>';
        return false;
    }
}

// ====== 2. كود عرض الصور ======
function renderWorks(files) {
    grid.innerHTML = ''; // امسح التقرير
    const supabaseUrl = SUPABASE_URL;
    
    files.forEach(file => {
        if (!file.name.match(/\.(png|jpg|jpeg|webp)$/i)) return;
        
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(file.name);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${urlData.publicUrl}" alt="${file.name}" loading="lazy">
            <div class="card-body"><h3>${file.name.replace(/\.[^/.]+$/, "")}</h3></div>
        `;
        grid.appendChild(card);
    });
}

// ====== 3. التشغيل ======
(async function init() {
    const files = await runDiagnostics();
    if (files) {
        setTimeout(() => renderWorks(files), 1500); // انتظر ثانية ونص عشان تقرأ التقرير
    }
})();
