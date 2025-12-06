const supabaseUrl = 'https://tdaxbmmbenbpokyznquq.supabase.co'; // From dashboard
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkYXhibW1iZW5icG9reXpucXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NjMzNTMsImV4cCI6MjA4MDUzOTM1M30.sUX_iSfGRyw0rRArT7x24XCEIjSobtAbORZQa8aVjGU'; // From dashboard
const supabase = Supabase.createClient(supabaseUrl, supabaseKey);

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        document.getElementById('dashboard-link').style.display = 'block';
        document.getElementById('logout').style.display = 'block';
    } else {
        document.getElementById('dashboard-link').style.display = 'none';
        document.getElementById('logout').style.display = 'none';
    }
});

// Logout
document.getElementById('logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
});
