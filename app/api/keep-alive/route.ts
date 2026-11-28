import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Memastikan route ini tidak di-cache oleh Next.js agar selalu hit ke Supabase
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: 'Konfigurasi Supabase belum ditemukan' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Mengambil 1 baris ID saja dari tabel 'classes' agar sangat ringan
  const { error } = await supabase.from('classes').select('id').limit(1);

  if (error) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: 'ok',
    message: 'Supabase keep-alive berhasil',
    timestamp: new Date().toISOString(),
  });
}