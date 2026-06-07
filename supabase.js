// ===== ملف استدعاءات Supabase =====
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// جلب الصور من البكت
async function getImages(category = 'all') {
  try {
    const { data, error } = await supabaseClient.storage.from(BUCKET).list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    });
    
    if (error) throw error;
    if (!data) return [];
    
    // فلترة الصور فقط
    let images = data.filter(file => 
      file.name && file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)
    );
    
    // فلترة حسب التصنيف
    if (category !== 'all') {
      images = images.filter(file => 
        file.name.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    return images;
  } catch (err) {
    console.error('خطأ جلب الصور:', err);
    return [];
  }
}

// جلب المقالات
async function getPosts() {
  try {
    const { data, error } = await supabaseClient
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('خطأ جلب المقالات:', err);
    return [];
  }
}

// ارسال رسالة
async function sendMessage(name, whatsapp, message) {
  try {
    const { error } = await supabaseClient.from('messages').insert([{ name, whatsapp, message }]);
    return { success: !error, error };
  } catch (err) {
    return { success: false, error: err };
  }
}
