document.getElementById('grid').innerHTML = "جاري التحميل..."

const url = "https://mirrxytqttjglglxrarq.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnJ4eXRxdHRqZ2xnbHhyYXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjE1MDMsImV4cCI6MjA5NjA5NzUwM30.I8EZoSupeqYZxPQvjNa4y0kq8XXZzfobhcHSFfVSbyo";

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({limit: 10})
.then(r => r.json())
.then(data => {
  document.getElementById('grid').innerHTML = "النتيجة: " + JSON.stringify(data)
})
.catch(e => {
  document.getElementById('grid').innerHTML = "خطأ الشبكة: " + e.message
})
